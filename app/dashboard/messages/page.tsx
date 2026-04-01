import { redirect } from "next/navigation";

import { MessageInbox } from "./MessageInbox";
import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function DashboardMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, name: true, email: true },
  });

  if (!member || (member.role !== "SUPER_ADMIN" && member.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page || "1"));
  const query = (params.query || "").trim();

  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
          { phone: { contains: query, mode: "insensitive" as const } },
          { subject: { contains: query, mode: "insensitive" as const } },
          { message: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <DashboardLayout member={member} activePath="/dashboard/messages" title="Messages publics">
      <MessageInbox 
        messages={messages} 
        total={total} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        query={query} 
      />
    </DashboardLayout>
  );
}


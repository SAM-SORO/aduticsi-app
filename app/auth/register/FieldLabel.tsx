export function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-slate-700">
      {children}
      {required && (
        <>
          <span aria-hidden className="ml-0.5 text-aduti-secondary">*</span>
          <span className="sr-only"> (obligatoire)</span>
        </>
      )}
    </label>
  );
}

export const fieldClass =
  "block w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-medium tracking-wide text-slate-900 transition-all focus:bg-white focus:outline-none focus:ring-4 focus:ring-(--aduti-primary)/10 focus:border-aduti-primary";

export const fieldErrorClass =
  "border-red-500/50 focus:border-red-500 focus:ring-red-500/20";

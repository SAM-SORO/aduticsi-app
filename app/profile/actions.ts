'use server'

import { revalidatePath } from 'next/cache'
import type { MemberStatus, Gender } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import logger from '@/lib/logger'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      logger.info('getProfile: No user found in Supabase session')
      return null
    }
  
    try {
      // Try to find by Supabase ID first
      let profile = await prisma.member.findUnique({
        where: { id: user.id },
        include: {
          promotion: true,
          poste: true
        }
      })
  
      // If not found by ID, try email (fallback for older accounts or manual sync issues)
      if (!profile && user.email) {
        logger.info({ userId: user.id, email: user.email }, 'getProfile: Member not found by ID, trying email');
        profile = await prisma.member.findUnique({
          where: { email: user.email },
          include: {
            promotion: true,
            poste: true
          }
        })
  
        if (profile) {
          logger.warn({ email: user.email }, 'getProfile: Member found by email but had different ID. Syncing Prisma ID with Supabase UUID.');
          // Auto-heal the record by updating its ID to match Supabase
          await prisma.member.update({
            where: { email: user.email },
            data: { id: user.id }
          })
        }
      }
  
      if (!profile) {
        logger.error({ email: user.email, userId: user.id }, 'getProfile: No Member record found in Prisma');
      }
  
      return profile
    } catch (error) {
      logger.error({ error }, 'getProfile: Unexpected error fetching profile');
      return null
    }
  }
  
  export async function updateProfile(data: {
    name?: string;
    phone?: string;
    portfolio_url?: string;
    linkedin_url?: string;
    youtube_url?: string;
    current_job_title?: string;
    current_job_description?: string;
    description?: string;
    photo_url?: string;
    status?: string;
    gender?: string;
  }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) return { error: 'Non autorisé' }
  
    try {
      await prisma.member.update({
        where: { id: user.id },
        data: {
          name: data.name,
          phone: data.phone,
          portfolio_url: data.portfolio_url,
          linkedin_url: data.linkedin_url,
          youtube_url: data.youtube_url,
          current_job_title: data.current_job_title,
          current_job_description: data.current_job_description,
          description: data.description,
          photo_url: data.photo_url,
          status: data.status as MemberStatus | undefined,
          gender: data.gender as Gender | undefined,
        }
      })
  
      revalidatePath('/profile')
      revalidatePath('/dashboard', 'layout')
      return { success: true }
    } catch (error) {
      logger.error({ error }, 'updateProfile: Error updating profile');
      return { error: 'Erreur lors de la mise à jour' }
    }
  }
  
  export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) return { error: 'Non autorisé' }
  
    const file = formData.get('file') as File
    if (!file) return { error: 'Aucun fichier fourni' }
  
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`
  
    try {
      const { error: uploadError } = await supabase.storage
        .from('membres_images')
        .upload(filePath, file)
  
      if (uploadError) throw uploadError
  
      const { data: { publicUrl } } = supabase.storage
        .from('membres_images')
        .getPublicUrl(filePath)
  
      return { publicUrl }
    } catch (error) {
      logger.error({ error }, 'uploadAvatar: Error uploading');
      return { error: 'Erreur lors du téléchargement de l\'image' }
    }
  }

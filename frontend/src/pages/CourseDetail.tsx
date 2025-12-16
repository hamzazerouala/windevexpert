import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  Play, 
  Lock, 
  CheckCircle, 
  Clock, 
  FileText, 
  Award, 
  Download, 
  Users, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Monitor, 
  Globe, 
  MessageSquare,
  Share2,
  AlertCircle,
  PlayCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import type { Course, Module, Lesson, Review } from '@/features/courses/types'

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>()
  
  if (!id) {
    return <div>Cours non trouvé</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Détail du Cours
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          ID du cours: {id}
        </p>
      </div>
    </div>
  )
}

export { CourseDetail }
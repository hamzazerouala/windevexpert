import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Clock, Users, Play } from 'lucide-react'
import { Course } from '@/features/courses/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: Course
  className?: string
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, className }) => {
  const levelColors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-orange-500',
    expert: 'bg-red-500',
  }

  const levelLabels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    expert: 'Expert'
  }

  return (
    <div className={cn(
      "group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-500 hover:-translate-y-2",
      className
    )}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail_url || 'https://via.placeholder.com/400x225'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-mono rounded-full">
            {course.version}
          </div>
          <div className={`px-3 py-1 ${levelColors[course.level]} text-white text-xs font-bold rounded-full`}>
            {levelLabels[course.level]}
          </div>
        </div>

        {/* Price badge */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 font-bold rounded-full border border-white/20">
            {course.price}€
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
              {course.subtitle}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium text-slate-900 dark:text-white">
                {course.rating_average?.toFixed(1) || '0.0'}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                ({course.rating_count || 0})
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Users className="w-4 h-4" />
              <span>{course.students_count || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span>45min</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Progression</span>
            <span>0%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full w-0 transition-all duration-300"></div>
          </div>
        </div>

        {/* Action button */}
        <Link to={`/courses/${course.id}`} className="block">
          <Button variant="primary" className="w-full">
            Commencer
          </Button>
        </Link>
      </div>
    </div>
  )
}
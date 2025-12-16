import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Download, MessageSquare, ThumbsUp, Share2, Bookmark, Settings, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { VideoPlayer } from '@/features/player/VideoPlayer'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { cn } from '@/lib/utils'
import type { Course, Module, Lesson, Comment } from '@/features/courses/types'

export function Player() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const { user } = useAuthStore()
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(true)

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}`)
      return response.data as Course
    },
    enabled: !!courseId
  })

  const { data: modules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}/modules`)
      return response.data as Module[]
    },
    enabled: !!courseId
  })

  const { data: currentLesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const response = await api.get(`/lessons/${lessonId}`)
      return response.data as Lesson
    },
    enabled: !!lessonId
  })

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['lesson-comments', lessonId],
    queryFn: async () => {
      const response = await api.get(`/lessons/${lessonId}/comments`)
      return response.data as Comment[]
    },
    enabled: !!lessonId
  })

  const allLessons = modules.flatMap(module => module.lessons || [])
  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === lessonId)
  const currentModule = modules.find(module => 
    module.lessons?.some(lesson => lesson.id === lessonId)
  )

  const handleProgressUpdate = async (progress: number) => {
    if (!lessonId) return
    
    try {
      await api.post(`/lessons/${lessonId}/progress`, { progress })
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !lessonId) return

    try {
      await api.post(`/lessons/${lessonId}/comments`, {
        content: newComment,
        timestamp: currentLesson?.duration ? Math.floor(currentLesson.duration * 0.3) : 0
      })
      setNewComment('')
      // Refetch comments
    } catch (error) {
      console.error('Failed to post comment:', error)
    }
  }

  const navigateToLesson = (lesson: Lesson) => {
    window.location.href = `/courses/${courseId}/lessons/${lesson.id}`
  }

  if (courseLoading || modulesLoading || lessonLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-96 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Leçon non trouvée
          </h1>
          <p className="text-gray-600">
            La leçon que vous recherchez n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to={`/courses/${courseId}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">
                  Module: {currentModule?.title} • Leçon {currentLessonIndex + 1} sur {allLessons.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <VideoPlayer
                src={currentLesson.video_url}
                poster={currentLesson.thumbnail_url}
                watermark={{
                  text: `${user?.email} • ${new Date().toLocaleDateString()}`,
                  position: 'bottom-right',
                  opacity: 0.7
                }}
                onProgress={handleProgressUpdate}
                className="w-full aspect-video"
              />
            </div>

            {/* Lesson info */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{currentLesson.description}</p>
                  </div>
                  <Badge variant="secondary">
                    {Math.ceil((currentLesson.duration || 0) / 60)} min
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{currentLesson.content}</p>
                </div>
                
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Ressources</h4>
                    <div className="space-y-2">
                      {currentLesson.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-gray-600">{resource.type}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const prevLesson = allLessons[currentLessonIndex - 1]
                  if (prevLesson) navigateToLesson(prevLesson)
                }}
                disabled={currentLessonIndex === 0}
              >
                Leçon précédente
              </Button>
              
              <div className="text-sm text-gray-600">
                {currentLessonIndex + 1} / {allLessons.length}
              </div>
              
              <Button
                onClick={() => {
                  const nextLesson = allLessons[currentLessonIndex + 1]
                  if (nextLesson) navigateToLesson(nextLesson)
                }}
                disabled={currentLessonIndex === allLessons.length - 1}
              >
                Leçon suivante
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Comments toggle */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Commentaires</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              {showComments && (
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <Textarea
                      placeholder="Ajouter un commentaire..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                      className="w-full"
                    >
                      Publier
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.user?.avatar_url} />
                          <AvatarFallback>
                            {comment.user?.name?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.user?.name}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              <span className="text-xs">{comment.likes_count || 0}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Course modules */}
            <Card>
              <CardHeader>
                <CardTitle>Contenu du cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => (
                    <div key={module.id}>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">
                        Module {moduleIndex + 1}: {module.title}
                      </h4>
                      <div className="space-y-1">
                        {module.lessons?.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.id}
                            onClick={() => navigateToLesson(lesson)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3",
                              lesson.id === lessonId
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "hover:bg-gray-50"
                            )}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                              lesson.id === lessonId
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            )}>
                              {lessonIndex + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{lesson.title}</p>
                              <p className="text-xs text-gray-500">
                                {Math.ceil((lesson.duration || 0) / 60)} min
                              </p>
                            </div>
                            {lesson.progress && lesson.progress > 0 && (
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
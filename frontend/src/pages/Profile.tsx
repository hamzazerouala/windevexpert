import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/auth'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { UserCourse } from '@/features/courses/types'

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'La bio ne peut pas dépasser 500 caractères').optional(),
  location: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function Profile() {
  const { user, updateProfile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)

  const { data: enrolledCourses = [] } = useQuery({
    queryKey: ['user-courses'],
    queryFn: async () => {
      const response = await api.get('/users/me/courses')
      return response.data as UserCourse[]
    }
  })

  const completedCourses = enrolledCourses.filter(course => course.progress === 100)
  const totalHours = enrolledCourses.reduce((total, course) => {
    return total + (course.total_duration || 0)
  }, 0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  {user?.bio && (
                    <p className="text-sm text-gray-600 mt-2">{user?.bio}</p>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {user?.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user?.location && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Membre depuis {new Date(user?.created_at || '').toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex-1"
                  >
                    {isEditing ? 'Annuler' : 'Modifier le profil'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Formations suivies</span>
                  </div>
                  <span className="font-semibold">{enrolledCourses.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Formations terminées</span>
                  </div>
                  <span className="font-semibold">{completedCourses.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm">Heures d'apprentissage</span>
                  </div>
                  <span className="font-semibold">{Math.floor(totalHours / 60)}h</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="courses">Mes formations</TabsTrigger>
                <TabsTrigger value="certificates">Certificats</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {isEditing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Modifier le profil</CardTitle>
                      <CardDescription>
                        Mettez à jour vos informations personnelles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom complet</Label>
                          <Input
                            {...register('name')}
                            id="name"
                            placeholder="Jean Dupont"
                          />
                          {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Adresse email</Label>
                          <Input
                            {...register('email')}
                            id="email"
                            type="email"
                            placeholder="vous@exemple.com"
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            {...register('phone')}
                            id="phone"
                            placeholder="+33 6 12 34 56 78"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Localisation</Label>
                          <Input
                            {...register('location')}
                            id="location"
                            placeholder="Paris, France"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Biographie</Label>
                          <textarea
                            {...register('bio')}
                            id="bio"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Parlez-nous de vous..."
                          />
                          {errors.bio && (
                            <p className="text-sm text-red-500">{errors.bio.message}</p>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button type="submit" className="flex-1">
                            Enregistrer
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>À propos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {user?.bio ? (
                        <p className="text-gray-700">{user.bio}</p>
                      ) : (
                        <p className="text-gray-500 italic">
                          Aucune biographie disponible. Cliquez sur "Modifier le profil" pour en ajouter une.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes formations</CardTitle>
                    <CardDescription>
                      Vos formations en cours et terminées
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {enrolledCourses.length > 0 ? (
                      <div className="space-y-4">
                        {enrolledCourses.map((course) => (
                          <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{course.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">
                                Progression: {course.progress || 0}%
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${course.progress || 0}%` }}
                                />
                              </div>
                            </div>
                            <Badge variant={course.progress === 100 ? "secondary" : "outline"}>
                              {course.progress === 100 ? "Terminé" : "En cours"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Aucune formation
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Vous n'avez pas encore commencé de formation.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certificates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes certificats</CardTitle>
                    <CardDescription>
                      Vos certificats de réussite
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {completedCourses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {completedCourses.map((course) => (
                          <div key={course.id} className="p-4 border rounded-lg text-center">
                            <Award className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                            <h4 className="font-semibold mb-1">{course.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Terminé le {new Date(course.completed_at || '').toLocaleDateString('fr-FR')}
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              Télécharger le certificat
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Aucun certificat
                        </h4>
                        <p className="text-gray-600">
                          Terminez des formations pour obtenir des certificats.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, Play, Clock, Award, User, Settings, CreditCard, BarChart3, MessageSquare, Bell, Search, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import type { Course, UserCourse } from '@/features/courses/types'

const navigation = [
  { name: 'Mes formations', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Progression', href: '/dashboard/progress', icon: BarChart3 },
  { name: 'Certificats', href: '/dashboard/certificates', icon: Award },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Paiements', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
]

export function Dashboard() {
  const location = useLocation()
  const { user } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: enrolledCourses = [], isLoading } = useQuery({
    queryKey: ['user-courses'],
    queryFn: async () => {
      const response = await api.get('/users/me/courses')
      return response.data as UserCourse[]
    }
  })

  const { data: recentCourses = [] } = useQuery({
    queryKey: ['recent-courses'],
    queryFn: async () => {
      const response = await api.get('/courses?limit=3')
      return response.data as Course[]
    }
  })

  const totalProgress = enrolledCourses.length > 0
    ? enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / enrolledCourses.length
    : 0

  const completedCourses = enrolledCourses.filter(course => course.progress === 100).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)} 
          />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">WindevExpert</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher des formations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {location.pathname === '/dashboard' ? (
            <div className="space-y-6">
              {/* Stats overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Formations suivies</p>
                        <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Formations terminées</p>
                        <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
                      </div>
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Progression globale</p>
                        <p className="text-2xl font-bold text-gray-900">{Math.round(totalProgress)}%</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Heures d'apprentissage</p>
                        <p className="text-2xl font-bold text-gray-900">42</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Continuer l'apprentissage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg h-16"></div>
                          </div>
                        ))}
                      </div>
                    ) : enrolledCourses.length > 0 ? (
                      <div className="space-y-4">
                        {enrolledCourses.slice(0, 3).map((course) => (
                          <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Play className="w-6 h-6 text-gray-400" />
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
                            <Button variant="outline" size="sm">
                              Continuer
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Aucune formation en cours
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Commencez votre apprentissage en explorant nos formations
                        </p>
                        <Link to="/catalog">
                          <Button>Explorer les formations</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nouvelles formations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCourses.map((course) => (
                        <Link key={course.id} to={`/courses/${course.id}`}>
                          <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{course.title}</h4>
                              <p className="text-sm text-gray-600 mb-1">
                                {course.instructor?.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  {course.level === 'beginner' ? 'Débutant' :
                                   course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                                </Badge>
                                <span className="text-sm font-semibold text-gray-900">
                                  {course.price === 0 ? 'Gratuit' : `${course.price}€`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
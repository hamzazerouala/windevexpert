import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { coursesApi } from '@/features/courses/api'
import { CourseCard } from '@/shared/components'
import { HeroSection } from '@/components/home/HeroSection'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { SectionBadge } from '@/components/ui/SectionBadge'
import { Button } from '@/components/ui/Button'
import { Star, Users, Award, TrendingUp } from 'lucide-react'

export function Home() {
  const { data: featuredCourses, isLoading } = useQuery({
    queryKey: ['courses', { featured: true }],
    queryFn: () => coursesApi.getCourses({ version: 'WD25' }),
  })

  const stats = [
    { icon: Users, label: 'Développeurs formés', value: '12,340+' },
    { icon: Award, label: 'Certifications délivrées', value: '3,456' },
    { icon: Star, label: 'Note moyenne', value: '4.9/5' },
    { icon: TrendingUp, label: 'Taux de réussite', value: '94%' }
  ]

  const testimonials = [
    {
      name: "Jean-Pierre D.",
      role: "Développeur WinDev",
      content: "Les formations sont claires, bien structurées et m'ont permis de progresser rapidement.",
      rating: 5
    },
    {
      name: "Marie L.",
      role: "Consultante",
      content: "Enfin des cours de qualité sur WinDev. La protection DRM est top !",
      rating: 5
    },
    {
      name: "Thomas M.",
      role: "Chef de projet",
      content: "Le support est réactif et les vidéos sont d'excellente qualité.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <RevealOnScroll key={index} delay={index * 100}>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400/10 dark:bg-yellow-400/20 rounded-lg border border-yellow-400/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <RevealOnScroll className="text-center mb-16">
            <SectionBadge>Formations Vedettes</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Cours Populaires
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Découvrez nos formations les plus populaires et apprenez avec les meilleurs experts
            </p>
          </RevealOnScroll>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-64 mb-6"></div>
                  <div className="space-y-3">
                    <div className="bg-slate-200 dark:bg-slate-800 h-6 rounded w-3/4"></div>
                    <div className="bg-slate-200 dark:bg-slate-800 h-4 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses?.slice(0, 3).map((course, index) => (
                <RevealOnScroll key={course.id} delay={index * 150}>
                  <CourseCard course={course} />
                </RevealOnScroll>
              ))}
            </div>
          )}

          <RevealOnScroll delay={500} className="text-center mt-16">
            <Link to="/catalog" className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium transition-colors">
              Voir tous les cours
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <RevealOnScroll className="text-center mb-16">
            <SectionBadge>Témoignages</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Ce que disent nos étudiants
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Rejoignez des milliers de développeurs qui ont amélioré leurs compétences
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <RevealOnScroll key={index} delay={index * 200}>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-yellow-400/20 transition-all duration-300 group">
                  <div className="flex items-center mb-6">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <RevealOnScroll>
            <SectionBadge>Commencez dès maintenant</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Prêt à devenir un expert WinDev ?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté et accédez à des centaines d'heures de contenu exclusif
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog">
                <Button variant="primary" className="px-8 py-4 text-lg">
                  Explorer les formations
                </Button>
              </Link>
              <Button variant="outline" className="px-8 py-4 text-lg border-white/20 text-white hover:bg-white/10">
                Essai gratuit
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  )
}
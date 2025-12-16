import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionBadge } from '@/components/ui/SectionBadge'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center transition-colors duration-500">
      {/* Animated Background Blobs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 dark:bg-pink-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Text Content */}
        <RevealOnScroll className="space-y-8">
          <SectionBadge>Nouvelle Plateforme 2025</SectionBadge>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            Maîtrisez <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 dark:from-yellow-400 dark:via-yellow-200 dark:to-yellow-400 text-gradient bg-[length:200%_auto]">
              L'Architecture WinDev Moderne
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            30 ans d'expertise PC Soft condensés. Passez du développement procédural à l'architecture objet et au développement multi-plateforme 
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm mx-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded border border-indigo-200 dark:border-indigo-500/20 inline-block hover:scale-105 transition-transform cursor-default">
              Avancé
            </span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/catalog">
              <Button variant="primary">
                <Play className="w-4 h-4 fill-current" /> Explorer les cours
              </Button>
            </Link>
            <Button variant="outline">
              Voir le programme gratuit
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-900 mt-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-950 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:translate-y-[-4px] hover:z-10 transition-all duration-300 shadow-lg cursor-default">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p>Rejoint par <span className="text-slate-800 dark:text-slate-200 font-bold">1,240+ développeurs</span> cette semaine</p>
          </div>
        </RevealOnScroll>

        {/* Visual Content */}
        <RevealOnScroll delay={200} className="relative hidden lg:block">
          {/* Floating Code Window */}
          <div className="absolute -top-12 -left-12 w-full h-full bg-gradient-to-br from-yellow-400/5 to-transparent rounded-3xl blur-3xl"></div>
          
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 transform rotate-2 hover:rotate-0 transition-all duration-700 hover:shadow-yellow-400/20 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.02]">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* Fake Window Header */}
              <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
                </div>
                <div className="text-xs text-slate-500 font-mono">WindevExpert Player - v3.0.0</div>
              </div>
              {/* Content */}
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2 text-lg">
                    <Lock className="w-5 h-5 text-green-500 dark:text-green-400" /> Mode Sécurisé
                  </h3>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-mono px-2 py-1 bg-yellow-400/10 rounded border border-yellow-400/20">
                    Actif
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-4">
                    <div className="h-40 bg-slate-200 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-800 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-300/50 dark:from-slate-950 to-transparent opacity-50"></div>
                      <Play className="w-16 h-16 text-slate-400 dark:text-slate-700 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-300 z-10" />
                      <div className="absolute inset-0 bg-black/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Chapitre 3: Architecture Objet</span>
                        <span>12:34 / 45:00</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1.5 rounded-full w-3/12 transition-all duration-300"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Prochaines leçons</div>
                    {['Classes & Objets', 'Héritage', 'Polymorphisme'].map((lesson, i) => (
                      <div key={lesson} className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-yellow-400 transition-colors"></div>
                          <span className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                            {lesson}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
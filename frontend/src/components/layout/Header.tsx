import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Code, Settings, Menu, X, Sun, Moon, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { name: 'Formations', href: '/catalog' },
    { name: 'Outils', href: '#tools' },
    { name: 'Expertise', href: '#expertise' },
    { name: 'Tarifs', href: '#pricing' }
  ]

  const handleLogoClick = () => {
    navigate('/')
    window.scrollTo(0, 0)
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-card/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-lg' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 group cursor-pointer" 
          onClick={handleLogoClick}
        >
          <div className="relative w-10 h-10 flex items-center justify-center bg-card border border-border rounded-lg group-hover:border-accent/50 transition-all duration-300 shadow-lg shadow-black/5 dark:shadow-black/50 group-hover:shadow-accent/20">
            <Settings className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:rotate-180 transition-transform duration-700 ease-in-out absolute" />
            <Code className="w-4 h-4 text-accent z-10" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight transition-colors">
            Windev<span className="text-accent">Expert</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="relative text-sm font-medium text-muted-foreground hover:text-accent transition-colors group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-all duration-300 hover:rotate-12"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="w-px h-6 bg-border"></div>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {user?.name || 'Dashboard'}
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Connexion
              </Link>
              <Button variant="primary" className="py-2 px-4 text-sm">
                S'abonner
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-muted-foreground"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
        {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card border-b border-border p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5 duration-200">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground block py-2 hover:text-accent transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <hr className="border-border" />
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false)
                navigate('/dashboard')
              }}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                S'abonner
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useState } from 'react';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">WindevExpert</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/catalog" className="text-muted-foreground hover:text-foreground">
              Catalogue
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                Mes Cours
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Déconnexion
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link to="/catalog" className="text-muted-foreground hover:text-foreground py-2">
                Catalogue
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground py-2">
                  Mes Cours
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
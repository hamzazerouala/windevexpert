import { Link, useLocation } from 'react-router-dom';
import { BookOpen, User, MessageSquare, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const sidebarItems = [
  {
    title: 'Mes Cours',
    icon: BookOpen,
    href: '/dashboard',
  },
  {
    title: 'Profil',
    icon: User,
    href: '/profile',
  },
  {
    title: 'Communauté',
    icon: MessageSquare,
    href: '/community',
  },
  {
    title: 'Paramètres',
    icon: Settings,
    href: '/settings',
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-card border-r transition-all duration-300`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Menu</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
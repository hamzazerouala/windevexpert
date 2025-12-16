import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { PublicLayout } from '@/layouts/PublicLayout'
import { PrivateLayout } from '@/layouts/PrivateLayout'
import { Home } from '@/pages/Home'
import { Catalog } from '@/pages/Catalog'
import { CourseDetail } from '@/pages/CourseDetail'
import { PaymentSuccess } from '@/pages/PaymentSuccess'
import { PaymentCancel } from '@/pages/PaymentCancel'
import AuthPage from '@/pages/Auth'
import { ClientDashboard } from '@/pages/ClientDashboard'
import { Player } from '@/pages/Player'
import { Profile } from '@/pages/Profile'
import { useAuthStore } from '@/stores/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="courses/:id" element={<CourseDetail />} />
          </Route>

          {/* Auth routes */}
          <Route path="/auth" element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Navigate to="/auth" replace />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Navigate to="/auth" replace />
            </PublicRoute>
          } />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          } />

          {/* Old dashboard routes - kept for reference if we want to split ClientDashboard later
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<div>Mes formations</div>} />
            <Route path="progress" element={<div>Progression</div>} />
            <Route path="certificates" element={<div>Certificats</div>} />
            <Route path="messages" element={<div>Messages</div>} />
            <Route path="billing" element={<div>Facturation</div>} />
            <Route path="settings" element={<div>Paramètres</div>} />
          </Route>
          */}

          <Route path="/courses/:courseId/lessons/:lessonId" element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          } />

          {/* Payment routes */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App

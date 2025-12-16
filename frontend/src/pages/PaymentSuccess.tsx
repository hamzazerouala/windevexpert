import { CheckCircle } from 'lucide-react'
import { useSearchParams, Link } from 'react-router-dom'

export function PaymentSuccess() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-green-600 mb-4 flex justify-center">
            <CheckCircle className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Paiement confirmé</h1>
          <p className="text-gray-600 mb-4">Merci pour votre achat. Votre accès à la formation est activé.</p>
          {sessionId && (
            <p className="text-xs text-gray-400">Session Stripe: {sessionId}</p>
          )}
          <div className="mt-6">
            <Link to="/dashboard" className="text-blue-600 hover:underline">Aller au tableau de bord</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


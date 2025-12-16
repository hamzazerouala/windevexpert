import { XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-red-600 mb-4 flex justify-center">
            <XCircle className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Paiement annulé</h1>
          <p className="text-gray-600 mb-4">Votre paiement a été annulé. Vous pouvez réessayer à tout moment.</p>
          <div className="mt-6 flex gap-6 justify-center">
            <Link to="/catalog" className="text-blue-600 hover:underline">Retour au catalogue</Link>
            <Link to="/dashboard" className="text-blue-600 hover:underline">Aller au tableau de bord</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


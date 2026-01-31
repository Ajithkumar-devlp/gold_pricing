export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
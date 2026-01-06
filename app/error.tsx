'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white gap-4">
      <h2 className="text-2xl font-bold text-red-500">¡Algo salió mal!</h2>
      <div className="p-4 bg-zinc-900 rounded-lg border border-red-500/20 max-w-lg overflow-auto">
        <p className="font-mono text-sm text-red-300">{error.message}</p>
        {error.digest && (
          <p className="text-xs text-zinc-500 mt-2">Error Digest: {error.digest}</p>
        )}
      </div>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}

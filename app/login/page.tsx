import { login } from "./actions"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-500/5 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      
      <div className="w-full max-w-md space-y-8 relative">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 mb-4 shadow-lg shadow-blue-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="drop-shadow-sm">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-zinc-400">
            Ingresa tus credenciales para acceder al panel
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-xl">
          <form className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-xs font-medium text-zinc-300 uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                placeholder="admin@follow.com"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-xs font-medium text-zinc-300 uppercase tracking-wider"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {searchParams?.message && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                {searchParams.message}
              </div>
            )}

            <button
              formAction={login}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-3 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-blue-500/20"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs text-zinc-500">
          Acceso restringido a personal autorizado
        </p>
      </div>
    </div>
  )
}

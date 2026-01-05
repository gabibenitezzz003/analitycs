"use client"

import { Toaster as SonnerToaster, toast } from "sonner"

export function NotificationToaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
        },
        className: "sonner-toast",
      }}
      theme="dark"
    />
  )
}

// Funciones helper para mostrar notificaciones
export const notify = {
  newReservation: (data: { origen: string; destino: string; valor: string }) => {
    toast.success(`Nueva reserva confirmada`, {
      description: `${data.origen} → ${data.destino} por ${data.valor}`,
      icon: "✅",
    })
  },
  
  newOffer: (data: { origen: string; destino: string }) => {
    toast.info(`Nueva oferta recibida`, {
      description: `${data.origen} → ${data.destino}`,
      icon: "📬",
    })
  },
  
  dataUpdated: () => {
    toast("Datos actualizados", {
      description: "El dashboard se ha actualizado con los últimos datos",
      icon: "🔄",
    })
  },
  
  error: (message: string) => {
    toast.error("Error", {
      description: message,
    })
  },
}

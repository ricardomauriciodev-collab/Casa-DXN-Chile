import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60dvh] flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-sm">
        <div className="mx-auto size-24 rounded-2xl bg-accent-soft flex items-center justify-center mb-5">
          <span className="text-5xl font-bold text-accent">404</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Página no encontrada</h1>
        <p className="text-muted-foreground text-sm mb-6">
          La página que buscas no existe o fue movida.
        </p>
        <Button onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}

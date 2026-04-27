import React, { useState, useEffect } from 'react'
import { toastEmitter, ToastMessage } from './toast'

const ICONS: Record<string, string> = {
  info:    'bi-info-circle-fill',
  success: 'bi-check-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  error:   'bi-x-circle-fill',
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    return toastEmitter.subscribe(msg => {
      setToasts(prev => [...prev, msg])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== msg.id))
      }, msg.duration)
    })
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`pv-toast pv-toast--${t.type}`}>
          <i className={`bi ${ICONS[t.type]} pv-toast__icon`} />
          <span className="pv-toast__msg">{t.message}</span>
          <button
            className="pv-toast__close"
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            aria-label="Dismiss"
          >×</button>
        </div>
      ))}
    </div>
  )
}

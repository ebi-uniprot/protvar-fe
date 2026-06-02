import React from 'react'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastMessage {
  id: number
  type: ToastType
  message: React.ReactNode
  duration: number
}

type Listener = (msg: ToastMessage) => void

const listeners: Listener[] = []
let counter = 0

const subscribe = (fn: Listener) => {
  listeners.push(fn)
  return () => {
    const i = listeners.indexOf(fn)
    if (i >= 0) listeners.splice(i, 1)
  }
}

const emit = (type: ToastType, message: React.ReactNode, duration = 4000) => {
  const msg: ToastMessage = { id: ++counter, type, message, duration }
  listeners.forEach(fn => fn(msg))
}

export const toastEmitter = { subscribe }

export const toast = {
  info:    (msg: React.ReactNode, duration?: number) => emit('info',    msg, duration),
  success: (msg: React.ReactNode, duration?: number) => emit('success', msg, duration),
  warning: (msg: React.ReactNode, duration?: number) => emit('warning', msg, duration),
  error:   (msg: React.ReactNode, duration?: number) => emit('error',   msg, duration),
}

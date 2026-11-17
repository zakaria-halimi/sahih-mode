'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-white border border-black max-w-md w-full p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`w-10 h-10 flex items-center justify-center shrink-0 ${
              isDestructive ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-black'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg text-black font-medium">{title}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-8 font-light leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-gray-300 text-xs uppercase tracking-wider text-black hover:border-black transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-white transition-colors ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-black hover:bg-gray-900'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

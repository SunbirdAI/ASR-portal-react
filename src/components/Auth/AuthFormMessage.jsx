import React from 'react'
import { CheckCircle2, TriangleAlert } from 'lucide-react'
import { AuthFormMessage } from './Auth.styles'

const FormError = ({ message }) => {
  if (!message) return null
  return (
    <AuthFormMessage className="text-red-500 bg-red-100">
      <TriangleAlert size={25} className='w-5 h-5 text-danger shrink-0' />

      <span className='text-sm'>{message}</span>
    </AuthFormMessage>
  )
}

const FormSuccess = ({ message }) => {
  if (!message) return null
  return (
    <AuthFormMessage className='text-emerald-500 bg-emerald-100'>
      <CheckCircle2 size={25} className='w-5 h-5 text-success shrink-0' />
      <span className='text-sm'>{message}</span>
    </AuthFormMessage>
  )
}

export { FormError, FormSuccess }
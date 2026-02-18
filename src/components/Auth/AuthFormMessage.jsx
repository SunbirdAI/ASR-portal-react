import React from 'react'
import { CheckCircle2, TriangleAlert } from 'lucide-react'
import { AuthFormMessage } from './Auth.styles'

const FormError = ({ message }) => {
  if (!message) return null
  return (
    <AuthFormMessage className="text-black bg-[#EFEFED] border border-[#E5E5E3]">
      <TriangleAlert size={25} className='w-5 h-5 shrink-0' />

      <span className='text-sm'>{message}</span>
    </AuthFormMessage>
  )
}

const FormSuccess = ({ message }) => {
  if (!message) return null
  return (
    <AuthFormMessage className='text-black bg-[#EFEFED] border border-[#E5E5E3]'>
      <CheckCircle2 size={25} className='w-5 h-5 shrink-0' />
      <span className='text-sm'>{message}</span>
    </AuthFormMessage>
  )
}

export { FormError, FormSuccess }

import { redirect } from 'next/navigation'
import { AUTH_DISABLED } from '@/lib/authMode'
import SelectEntityForm from './SelectEntityForm'

export default function SelectEntityPage() {
  if (AUTH_DISABLED) redirect('/')
  return <SelectEntityForm />
}

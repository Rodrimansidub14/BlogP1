/* eslint-disable prettier/prettier */
// useForm hook
import { useState, useCallback } from 'react'

export const useForm = (options) => {
  const [formData, setFormData] = useState(options.initialValues || {})

  const handleChange = useCallback((event) => {
    const { name, value } = event.target
    setFormData((formData) => ({ ...formData, [name]: value }))
  }, [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      options.onSubmit(formData)
    },
    [formData, options.onSubmit]
  )

  return { formData, handleChange, handleSubmit }
}

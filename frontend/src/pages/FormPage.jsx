import React from "react";
import { useForm } from '@tanstack/react-form'
import { useFormSchema } from '../hooks/useFormSchema'
import { useSubmitForm } from '../hooks/useSubmitForm'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import { Checkbox } from '../components/ui/checkbox'

const FormPage = () => {
  const { data: schema, isLoading, error } = useFormSchema()
  const submitMutation = useSubmitForm()
  const navigate = useNavigate()

  const editingId = localStorage.getItem('editingSubmissionId')
  const isEditing = !!editingId

  const getDefaultValues = () => {
    if (isEditing) {
      const submissions = JSON.parse(localStorage.getItem('submissions') || '[]')
      const submission = submissions.find(s => s.id.toString() === editingId)
      return submission ? submission.data : {}
    }
    return {}
  }

  const form = useForm({
    defaultValues: getDefaultValues(),
    onSubmit: async ({ value }) => {
      if (isEditing) {
        // Update existing
        await fetch(`https://matbook-ass-1.onrender.com/api/submissions/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        })
        localStorage.removeItem('editingSubmissionId')
      } else {
        await submitMutation.mutateAsync(value)
      }
      form.reset()
      navigate('/submissions')
    },
  })

  if (isLoading) return <div>Loading form...</div>
  if (error) return <div>Error loading form: {error.message}</div>

  const renderField = (field) => {
    // eslint-disable-next-line no-unused-vars
    const { name, type, label, placeholder, required, options, validation } = field

    const fieldProps = {
      name,
      validators: {
        onChange: ({ value }) => {
          // Required check
          if (required) {
            if (type === 'multi-select' && (!value || value.length === 0)) return 'This field is required'
            if (type !== 'multi-select' && !value) return 'This field is required'
          }

          // Type-specific validations
          if (type === 'text' || type === 'textarea') {
            if (validation?.minLength && value && value.length < validation.minLength) return `Minimum length is ${validation.minLength}`
            if (validation?.maxLength && value && value.length > validation.maxLength) return `Maximum length is ${validation.maxLength}`
            if (validation?.regex && value && !new RegExp(validation.regex).test(value)) return 'Invalid format'
          }

          if (type === 'number') {
            const numValue = value ? parseFloat(value) : null
            if (validation?.min && numValue !== null && numValue < validation.min) return `Minimum value is ${validation.min}`
            if (validation?.max && numValue !== null && numValue > validation.max) return `Maximum value is ${validation.max}`
          }

          if (type === 'date') {
            if (validation?.minDate && value && value < validation.minDate) return `Minimum date is ${validation.minDate}`
          }

          if (type === 'multi-select') {
            if (validation?.minSelected && value && value.length < validation.minSelected) return `Select at least ${validation.minSelected} options`
            if (validation?.maxSelected && value && value.length > validation.maxSelected) return `Select at most ${validation.maxSelected} options`
          }

          return undefined
        },
      },
      children: ({ state, handleChange, handleBlur }) => (
        <div className="space-y-2">
          <Label htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          {renderInput(type, { ...field, state, handleChange, handleBlur })}
          {state.meta.errors.length > 0 && (
            <p className="text-sm text-red-500">{state.meta.errors[0]}</p>
          )}
        </div>
      ),
    }

    return <form.Field key={name} {...fieldProps} />
  }

  const renderInput = (type, props) => {
    const { name, placeholder, options, state, handleChange, handleBlur } = props

    switch (type) {
      case 'text':
      case 'number':
        return (
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            value={state.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
          />
        )
      case 'textarea':
        return (
          <Textarea
            id={name}
            placeholder={placeholder}
            value={state.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
          />
        )
      case 'select':
        return (
          <Select value={state.value || ''} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'multi-select':
        return (
          <div className="space-y-2">
            {options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${name}-${option.value}`}
                  checked={(state.value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const current = state.value || []
                    if (checked) {
                      handleChange([...current, option.value])
                    } else {
                      handleChange(current.filter(v => v !== option.value))
                    }
                  }}
                />
                <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        )
      case 'date':
        return (
          <Input
            id={name}
            type="date"
            value={state.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
          />
        )
      case 'switch':
        return (
          <Switch
            id={name}
            checked={state.value || false}
            onCheckedChange={handleChange}
          />
        )
      default:
        return <div>Unsupported field type: {type}</div>
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Submission' : 'Dynamic Form'}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        {schema?.fields?.map(renderField)}
        <Button type="submit" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? 'Submitting...' : 'Submit'}
        </Button>
        {submitMutation.isError && (
          <p className="text-sm text-red-500">Error: {submitMutation.error.message}</p>
        )}
        {submitMutation.isSuccess && (
          <p className="text-sm text-green-500">Form submitted successfully!</p>
        )}
      </form>
    </div>
  )
}

export default FormPage
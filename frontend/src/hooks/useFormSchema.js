import { useQuery } from '@tanstack/react-query'

const mockSchema = {
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      validation: { minLength: 2, maxLength: 50 }
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
      validation: { regex: '^[^@]+@[^@]+\\.[^@]+$' }
    },
    {
      name: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter your age',
      required: false,
      validation: { min: 18, max: 100 }
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Gender',
      required: true,
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'interests',
      type: 'multi-select',
      label: 'Interests',
      required: false,
      options: [
        { value: 'sports', label: 'Sports' },
        { value: 'music', label: 'Music' },
        { value: 'reading', label: 'Reading' },
        { value: 'travel', label: 'Travel' }
      ],
      validation: { minSelected: 1, maxSelected: 3 }
    },
    {
      name: 'birthdate',
      type: 'date',
      label: 'Birth Date',
      required: false,
      validation: { minDate: '1900-01-01' }
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
      placeholder: 'Tell us about yourself',
      required: false,
      validation: { maxLength: 500 }
    },
    {
      name: 'newsletter',
      type: 'switch',
      label: 'Subscribe to newsletter',
      required: false
    }
  ]
}

export const useFormSchema = () => {
  return useQuery({
    queryKey: ['form-schema'],
    queryFn: async () => {
      const res = await fetch('https://matbook-ass-1.onrender.com/api/form-schema')
      if (!res.ok) {
        throw new Error('Failed to fetch form schema')
      }
      return res.json()
    },
  })
}
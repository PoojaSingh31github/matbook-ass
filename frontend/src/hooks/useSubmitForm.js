import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useSubmitForm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch('https://matbook-ass-1.onrender.com/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.errors ? Object.values(result.errors).join(', ') : 'Failed to submit form')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}
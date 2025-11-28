import { useQuery } from '@tanstack/react-query'

const mockSubmissions = [
  {
    id: 1,
    createdAt: '2025-11-28T07:00:00Z',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      gender: 'male',
      interests: ['sports', 'music'],
      birthdate: '1995-01-01',
      bio: 'Hello world',
      newsletter: true
    }
  },
  {
    id: 2,
    createdAt: '2025-11-28T06:00:00Z',
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      gender: 'female',
      interests: ['reading', 'travel'],
      birthdate: '2000-05-15',
      bio: 'I love books',
      newsletter: false
    }
  }
]

export const useSubmissions = (page = 1, limit = 10, sortBy = 'createdAt', search = '') => {
  return useQuery({
    queryKey: ['submissions', page, limit, sortBy, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder: sortBy.startsWith('-') ? 'asc' : 'desc'
      })
      const res = await fetch(`http://localhost:5000/api/submissions?${params}`)
      if (!res.ok) {
        throw new Error('Failed to fetch submissions')
      }
      return res.json()
    },
  })
}
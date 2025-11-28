import React, { useState, useEffect } from 'react'
import { useSubmissions } from '../hooks/useSubmissions'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'

const SubmissionsPage = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortBy, setSortBy] = useState('createdAt')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading, error } = useSubmissions(page, limit, sortBy, debouncedSearch)

  const submissions = data?.data || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  const handleSort = () => {
    setSortBy(sortBy === 'createdAt' ? '-createdAt' : 'createdAt')
  }

  const handleLimitChange = (value) => {
    setLimit(Number(value))
    setPage(1)
  }

  if (isLoading) return <div>Loading submissions...</div>
  if (error) return <div>Error: {error.message}</div>

  const handleExportCSV = () => {
    const allSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]')
    if (allSubmissions.length === 0) return

    const headers = ['ID', 'Created At', ...Object.keys(allSubmissions[0].data)]
    const csvContent = [
      headers.join(','),
      ...allSubmissions.map(sub => [
        sub.id,
        sub.createdAt,
        ...headers.slice(2).map(key => sub.data[key] || '')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'submissions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      await fetch(`http://localhost:5000/api/submissions/${id}`, {
        method: 'DELETE',
      })
      // Invalidate query
      window.location.reload() // Simple way to refresh
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span>Search:</span>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search submissions..."
              className="w-64"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span>Items per page:</span>
            <Select value={limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleExportCSV} variant="outline">
            Export CSV
          </Button>
          <div>Total: {total}</div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Submission ID</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={handleSort}>
                Created Date {sortBy === 'createdAt' ? '↑' : sortBy === '-createdAt' ? '↓' : ''}
              </Button>
            </TableHead>
            <TableHead>View</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No submissions found
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.id}</TableCell>
                <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submission Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        <p><strong>ID:</strong> {submission.id}</p>
                        <p><strong>Created At:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
                        <div>
                          <strong>Data:</strong>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-sm">
                            {JSON.stringify(submission.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => {
                    localStorage.setItem('editingSubmissionId', submission.id.toString())
                    window.location.href = '/'
                  }}>
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(submission.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SubmissionsPage
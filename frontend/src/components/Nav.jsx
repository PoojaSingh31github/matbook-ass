
import React from "react";
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

const Nav = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Form Builder</h1>
        <div className="flex space-x-2">
          <Button asChild variant="ghost">
            <Link to="/">Form</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/submissions">Submissions</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Nav
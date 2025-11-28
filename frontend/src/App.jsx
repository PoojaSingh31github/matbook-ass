import React from "react";
import { Routes, Route } from "react-router-dom";
import FormPage from './pages/FormPage'
import SubmissionsPage from './pages/SubmissionsPage'
import Nav from './components/Nav'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/submissions" element={<SubmissionsPage />} />
      </Routes>
    </div>
  )
}

export default App

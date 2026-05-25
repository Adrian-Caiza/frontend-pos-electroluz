import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import LoginPage from './app/auth/login/page'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          {/* Add more routes here */}
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App

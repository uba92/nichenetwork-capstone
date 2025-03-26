import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <p>Caricamento...</p>
  if (!user) return <Navigate to='/login' replace />

  return <Outlet />
}

export default ProtectedRoute

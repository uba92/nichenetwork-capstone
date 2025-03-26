import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <p>Loading...</p>
  }

  if (!user || !user.role || user.role.toUpperCase() !== 'ADMIN') {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}

export default AdminRoute

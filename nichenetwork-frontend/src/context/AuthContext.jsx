import { createContext, useState, useEffect } from 'react'
import AuthService from '../services/AuthService'
import { jwtDecode } from 'jwt-decode'
import axiosInstance from '../services/axios'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          const decodedToken = jwtDecode(parsedUser.token)
          const response = await axiosInstance.get('/api/users/me', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${parsedUser.token}`,
            },
          })
          const userData = response.data

          const enrichedUser = {
            token: parsedUser.token,
            role:
              decodedToken.roles && decodedToken.roles.includes('ROLE_ADMIN')
                ? 'ADMIN'
                : 'USER',
            id: userData.id,
          }

          setUser(enrichedUser)

          localStorage.setItem(
            'user',
            JSON.stringify({
              token: parsedUser.token,
              id: userData.id,
              role:
                decodedToken.roles && decodedToken.roles.includes('ROLE_ADMIN')
                  ? 'ADMIN'
                  : 'USER',
            })
          )
        } catch (error) {
          console.error('Errore nel recupero dei dati utente:', error)
          AuthService.logout()
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

import axiosInstance from './axios'
import { jwtDecode } from 'jwt-decode'

const API_URL =
  'https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/auth/'

const login = async (credentials) => {
  const response = await axiosInstance.post(`/api/auth/login`, credentials)

  if (response.data.token) {
    const token = response.data.token
    const decodedToken = jwtDecode(token)

    const userResponse = await axiosInstance.get(`/api/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const userData = userResponse.data

    const completeUser = {
      token,
      id: userData.id,
      role:
        decodedToken.roles && decodedToken.roles.includes('ROLE_ADMIN')
          ? 'ADMIN'
          : 'USER',
    }

    localStorage.setItem('user', JSON.stringify(completeUser))
    return completeUser
  }

  return response.data
}

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user && user.token) {
    const decodedToken = jwtDecode(user.token)
    return decodedToken.roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER'
  }
  return null
}

const register = async (userData) => {
  const response = await axiosInstance.post(`/api/auth/register`, userData)
  return response.data
}

const logout = () => {
  localStorage.removeItem('user')
}

export default { login, register, logout, getUserRole }

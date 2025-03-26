import axiosInstance from '../services/axios'
import { AuthContext } from '../context/AuthContext'
import { useContext, useEffect, useState } from 'react'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      getNotifications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getNotifications = async () => {
    try {
      const response = await axiosInstance.get(`/api/notifications`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put(`/api/notifications/markAllAsRead`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      setNotifications([])
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  return {
    notifications,
    loading,
    hasUnread: notifications.length > 0,
    markAllAsRead,
  }
}

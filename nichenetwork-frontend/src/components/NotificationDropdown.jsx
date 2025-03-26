import { useNotifications } from '../hooks/useNotifications'
import { Dropdown, Spinner } from 'react-bootstrap'
import { Bell } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
function NotificationDropdown() {
  const { notifications, loading, hasUnread, markAllAsRead } =
    useNotifications()

  const { user } = useContext(AuthContext)

  const numberOfUnreadNotifications = notifications.length

  return (
    <Dropdown align='end'>
      <Dropdown.Toggle variant='dark' id='dropdown-notifications'>
        <Bell size={20} color='#fff' />
        {hasUnread && (
          <span className='badge rounded-pill bg-danger'>
            {notifications.length}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '300px' }}>
        <Dropdown.Header>
          {loading ? (
            <Spinner animation='border' size='sm' />
          ) : (
            ` ${numberOfUnreadNotifications} ${
              numberOfUnreadNotifications === 1 ? 'Notifica' : 'Notifiche'
            }`
          )}
        </Dropdown.Header>

        <Dropdown.Divider />

        {notifications.length === 0 && !loading ? (
          <Dropdown.Item disabled>Non ci sono notifiche</Dropdown.Item>
        ) : (
          notifications.map((notification) => (
            <Dropdown.Item
              key={notification.id}
              style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
              as={Link}
              to={`/home/profile/${user.id}?highlight=${notification.relatedPostId}`}
            >
              <div style={{ fontSize: '0.9rem' }}>{notification.message}</div>
              <div style={{ fontSize: '0.7rem', color: 'gray' }}>
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </Dropdown.Item>
          ))
        )}

        {notifications.length > 0 && (
          <Dropdown.Item
            onClick={markAllAsRead}
            className='text-center text-light bg-success'
          >
            Segna tutte come lette
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default NotificationDropdown

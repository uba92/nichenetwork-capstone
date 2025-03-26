import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import '../assets/css/FollowList.css'
import axiosInstance from '../services/axios'

function FollowList({ userId, type, token }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchFollowList = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/follows/${userId}/${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.data.length === 0) {
          setMessage('Nessun utente trovato.')
        } else {
          setUsers(response.data)
        }
      } catch (err) {
        console.error('Errore nel caricamento:', err)
        setMessage('Errore nel caricamento della lista.')
      } finally {
        setLoading(false)
      }
    }

    fetchFollowList()
  }, [userId, type, token])

  return (
    <div>
      <h3>{type === 'followers' ? 'Follower' : 'Seguiti'}</h3>
      {loading && <Spinner animation='border' />}
      {!loading && users.length > 0 && (
        <ul className='user-list'>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => navigate(`/home/user/${user.id}`)}
              className='user-item'
            >
              <img
                src={user.avatar || '/img/avatar-profilo.jpg'}
                alt='avatar'
                className='user-avatar'
              />
              <span className='user-username'>{user.username}</span>
            </li>
          ))}
        </ul>
      )}
      {!loading && message && <p>{message}</p>}
    </div>
  )
}

export default FollowList

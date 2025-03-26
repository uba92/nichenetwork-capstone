import axiosInstance from '../services/axios'
import { useContext, useEffect, useState } from 'react'
import { Card, Col, Container, ListGroup, Modal, Row } from 'react-bootstrap'
import PostCard from '../components/PostCard'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import '../assets/css/ProfilePage.css'
import { AuthContext } from '../context/AuthContext'
import FollowList from '../components/FollowList'

function ProfilePage() {
  const { user } = useContext(AuthContext)

  const [searchParams] = useSearchParams()
  const highlightedPostId = searchParams.get('highlight')

  const navigate = useNavigate()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [me, setMe] = useState({})
  const [posts, setPosts] = useState(null)
  const [myCommunities, setMyCommunities] = useState([])
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null)

  const handleShowModal = (type) => {
    setModalType(type)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalType(null)
  }

  if (!user) {
    navigate('/')
  }

  const getMe = async () => {
    if (!user) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axiosInstance.get('/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })

      setMe(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching user:', error)
    }
  }

  const getMyCommunities = async () => {
    if (!user) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axiosInstance.get(`/api/users/me/communities`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })

      setMyCommunities(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching communities:', error)
    }
  }

  const getMyPosts = async () => {
    if (!user) {
      console.log('Nessun utente autenticato!')
      return
    }
    try {
      const response = await axiosInstance.get(`/api/posts/user/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })
      setPosts(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching posts:', error)
    }
  }

  const getFollowersCount = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/follows/${user.id}/followers/count`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setFollowersCount(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching followers count:', error)
    }
  }

  const getFollowingCount = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/follows/${user.id}/following/count`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setFollowingCount(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching following count:', error)
    }
  }

  useEffect(() => {
    getMe()
    getMyPosts()
    getMyCommunities()
    getFollowersCount()
    getFollowingCount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTimeSinceRegistration = (createdAt) => {
    const createdDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now - createdDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffMonths / 12)

    if (diffYears >= 1) {
      return `Membro di NicheNetwork da ${diffYears} ${
        diffYears === 1 ? 'anno' : 'anni'
      }`
    } else if (diffMonths >= 1) {
      return `Membro di NicheNetwork da ${diffMonths} ${
        diffMonths === 1 ? 'mese' : 'mesi'
      }`
    } else {
      return `Membro di NicheNetwork da ${diffDays} ${
        diffDays === 1 ? 'giorno' : 'giorni'
      }`
    }
  }

  useEffect(() => {
    if (highlightedPostId && posts?.content?.length > 0) {
      setTimeout(() => {
        const el = document.getElementById(`post-${highlightedPostId}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 200)
    }
  }, [highlightedPostId, posts])

  if (isLoading) return <p>Caricamento...</p>
  if (isError || !me) return <p>Errore nel caricamento del profilo</p>

  return (
    <Container className='p-3 mt-4' fluid>
      <Row>
        <Col md={4}>
          <Card className='text-center profile-card'>
            <div className='profile-avatar-container'>
              <Card.Img
                variant='top'
                src={me.avatar || '/img/avatar-profilo.jpg'}
                className='profile-avatar'
              />
            </div>
            <Card.Body>
              <Card.Title className='profile-name'>
                {me.firstName} {me.lastName}
              </Card.Title>
              <Card.Text className='profile-bio'>
                {me.bio || 'Nessuna bio disponibile.'}
              </Card.Text>
              <ListGroup.Item>
                <span
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginRight: '15px',
                  }}
                  onClick={() => handleShowModal('followers')}
                >
                  Follower: {followersCount}
                </span>
                <span
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => handleShowModal('following')}
                >
                  Seguiti: {followingCount}
                </span>
              </ListGroup.Item>
            </Card.Body>
            <ListGroup className='list-group-flush profile-info'>
              <ListGroup.Item>Email: {me.email}</ListGroup.Item>
              <ListGroup.Item>
                {getTimeSinceRegistration(me.createdAt)}
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card className='text-center community-card my-3'>
            <Card.Title className='community-title'>
              Le mie Community
            </Card.Title>
            <Card.Body>
              <div className='community-grid'>
                {myCommunities.map((community) => (
                  <Link
                    key={community.id}
                    to={`/home/communities/${community.id}`}
                    className='community-item'
                  >
                    <div className='community-overlay'></div>
                    <span className='community-name'>{community.name}</span>
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <h3>I tuoi post</h3>
          {posts ? (
            posts.content.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                highlight={post.id === Number(highlightedPostId)}
              />
            ))
          ) : (
            <p>Non hai ancora pubblicato post.</p>
          )}
        </Col>
      </Row>
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal} centered size='md'>
          <Modal.Header closeButton className='bg-dark text-white border-0'>
            <Modal.Title style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
              {modalType === 'followers' ? 'Follower' : 'Seguiti'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            className='bg-dark text-white'
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '1rem',
            }}
          >
            <FollowList userId={user.id} type={modalType} token={user.token} />
          </Modal.Body>
        </Modal>
      )}
    </Container>
  )
}

export default ProfilePage

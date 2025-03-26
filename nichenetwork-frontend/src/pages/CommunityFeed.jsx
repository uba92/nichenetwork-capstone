import axiosInstance from '../services/axios'
import { useContext, useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  ListGroup,
  Modal,
  Offcanvas,
  Row,
  Spinner,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import '../assets/css/CommunityFeed.css'
import PostCard from '../components/PostCard'
import { ArrowBigLeft } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import UserSearch from '../components/UserSearch'

function CommunityFeed() {
  const { communityId } = useParams()

  const { user } = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [posts, setPosts] = useState(null)
  const [community, setCommunity] = useState(null)
  const [me, setMe] = useState({})
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const fileInputRef = useRef(null)
  const [numberOfMembers, setNumberOfMembers] = useState(0)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [communityMembers, setCommunityMembers] = useState([])
  const [suggestedMembers, setSuggestedMembers] = useState([])

  const [showSidebar, setShowSidebar] = useState(false)
  const handleCloseSidebar = () => setShowSidebar(false)
  const handleShowSidebar = () => setShowSidebar(true)

  const navigate = useNavigate()

  const getCommunity = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/communities/${communityId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setCommunity(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching community:', error)
    }
  }

  const getMembers = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/community-members/${communityId}/members`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setCommunityMembers(response.data)
      setNumberOfMembers(response.data.length)

      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching number of members:', error)
    }
  }

  const getMe = async () => {
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

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/posts/community/${communityId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setPosts(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching posts:', error)
    }
  }
  const createPost = async (e) => {
    e.preventDefault()

    if (!user) {
      console.error('Nessun utente autenticato!')
      return
    }

    if (!content || !communityId) {
      console.error('Content e communityId sono obbligatori!')
      return
    }

    try {
      setIsLoading(true)

      const formData = new FormData()

      formData.append('content', content)

      if (imageUrl) {
        formData.append('image', imageUrl)
      }

      formData.append('communityId', communityId)

      await axiosInstance.post('/api/posts', formData, {
        headers: {
          //   'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      })
      setContent('')
      setImageUrl('')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      fetchPosts()
    } catch (error) {
      setIsError(true)
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const leaveCommunity = async () => {
    if (!user) {
      console.error('Nessun utente autenticato!')
      return
    }
    if (!me) {
      console.error('Nessun utente autenticato!')
      return
    }
    try {
      await axiosInstance.delete(
        `/api/community-members/leave/${user.id}/${communityId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setTimeout(() => {
        navigate('/home')
      }, 1000)
    } catch (error) {
      setIsError(true)
      console.error('Error leaving community:', error)
    }
  }

  const handleCloseLeaveModal = () => {
    setShowLeaveModal(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      await getMe()
      fetchPosts()
      getCommunity()
      getMembers()
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (communityMembers && me?.id) {
      const filtered = communityMembers.filter((member) => member.id !== me.id)
      const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 3)
      setSuggestedMembers(shuffled)
    }
  }, [communityMembers, me?.id])

  useEffect(() => {
    axiosInstance
      .get(`/api/communities/${communityId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        setCommunity(response.data)
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate('/') // 🔒 Se non iscritto, manda alla home
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId])

  return (
    <Container fluid className='p-3' style={{ height: '100vh' }}>
      {isError && <p>{isError}</p>}

      <Row className='d-flex' style={{ minHeight: '100%' }}>
        {community && (
          <Col
            md={3}
            className='d-md-block d-none border-end sidebar-left'
            style={{
              background: `linear-gradient(0deg, ${community.color} 0%, transparent 100%)`,
            }}
          >
            {me && (
              <Card className='sidebar-left-card'>
                <Card.Header className='text-center'>
                  <Card.Img
                    onClick={() => navigate(`/home/profile/${me.id}`)}
                    variant='top'
                    src={me?.avatar ? me.avatar : '/img/avatar-profilo.jpg'}
                    className='sidebar-left-avatar'
                  />
                </Card.Header>
                <Card.Body>
                  <ListGroup className='sidebar-left-list'>
                    <ListGroup.Item
                      className='sidebar-left-username'
                      onClick={() => navigate(`/home/profile/${me.id}`)}
                    >
                      {me.firstName.toUpperCase()} {me.lastName.toUpperCase()}
                    </ListGroup.Item>

                    <ListGroup.Item className='sidebar-left-bio'>
                      {me.bio ? me.bio : 'Nessuna bio disponibile'}
                    </ListGroup.Item>

                    <ListGroup.Item>{me.email}</ListGroup.Item>
                    <ListGroup.Item
                      onClick={() =>
                        navigate(`/home/profile/settings/${me.id}`)
                      }
                    >
                      Impostazioni
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            )}
          </Col>
        )}

        <Button
          variant='secondary'
          className='d-md-none btn-primary text-start mb-3'
          onClick={handleShowSidebar}
        >
          <ArrowBigLeft size={20} /> Profilo
        </Button>

        <Offcanvas show={showSidebar} onHide={handleCloseSidebar}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Profilo</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Card className='sidebar-left-card'>
              <Card.Header className='text-center'>
                <Card.Img
                  variant='top'
                  src={me?.avatar ? me.avatar : '/img/avatar-profilo.jpg'}
                  className='sidebar-left-avatar'
                  onClick={() => navigate(`/home/profile/${me.id}`)}
                />
              </Card.Header>
              <Card.Body>
                <ListGroup className='sidebar-left-list'>
                  <ListGroup.Item className='sidebar-left-username'>
                    {me?.firstName} {me?.lastName}
                  </ListGroup.Item>
                  {me.bio && (
                    <ListGroup.Item className='sidebar-left-bio'>
                      {me.bio}
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>{me.email}</ListGroup.Item>
                  <ListGroup.Item
                    onClick={() => navigate(`/home/profile/settings/${me.id}`)}
                  >
                    Impostazioni
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Offcanvas.Body>
        </Offcanvas>

        <Col
          className='col-feed-post d-flex flex-column align-items-center py-3'
          md={6}
          sm={12}
        >
          {community && (
            <>
              <Card className='cover-container'>
                <div className='img-cover-container'>
                  <Card.Img variant='top' src={community.imageUrl} />
                  <div className='cover-overlay'></div>
                </div>
                <div className='cover-content-container'>
                  <Card.Title className='display-3'>
                    {community.name}
                  </Card.Title>
                </div>
              </Card>

              <Form className='post-form' onSubmit={createPost}>
                <img
                  className='form-avatar'
                  src={me.avatar ? me.avatar : '/img/avatar-profilo.jpg'}
                  alt='me-avatar'
                />{' '}
                <span>Cosa vuoi condividere?</span>
                <FormGroup controlId='content'>
                  <Form.Control
                    as='textarea'
                    rows={4}
                    placeholder='Condividi con la Community...'
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                    className='my-3'
                  />
                </FormGroup>
                <Form.Group controlId='imageUrl'>
                  <Form.Label>Immagine</Form.Label>
                  <Form.Control
                    ref={fileInputRef}
                    onChange={(e) => {
                      setImageUrl(e.target.files[0])
                    }}
                    type='file'
                    accept='/image'
                  />
                </Form.Group>
                <Button type='submit' disabled={isLoading}>
                  {isLoading ? (
                    <Spinner animation='border' size='sm' />
                  ) : (
                    'Pubblica'
                  )}
                </Button>
              </Form>

              {!isError &&
                !isLoading &&
                posts &&
                me &&
                posts.content.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </>
          )}
        </Col>

        {community && (
          <Col
            md={3}
            className='order-last order-md-2 border-start sidebar-right'
            style={{
              background: `linear-gradient(0deg, ${community.color} 0%, transparent 100%)`,
            }}
          >
            <Card className='bg-transparent border-0 text-light'>
              <Button
                onClick={() => setShowLeaveModal(true)}
                className='d-block leave-community-button mx-auto my-3'
              >
                Lascia Community
              </Button>
              <Card.Body className='text-center'>
                <Card.Title className='py-2'>{community.name}</Card.Title>
                <Card.Text className='py-2'>{community.description}</Card.Text>
                <Card.Text className='py-2'>Membri della community</Card.Text>
                <Card.Text className='py-2'>{numberOfMembers}</Card.Text>
              </Card.Body>
              <ListGroup className='suggested-members'>
                <h5 className='mb-3 text-black'>Membri suggeriti</h5>
                {suggestedMembers.map((member) => (
                  <ListGroup.Item
                    key={member.id}
                    className='d-flex align-items-center suggested-member-item'
                    onClick={() => navigate(`/home/user/${member.id}`)}
                  >
                    <img
                      src={member.avatar || '/img/avatar-profilo.jpg'}
                      alt='avatar'
                      className='rounded-circle member-avatar'
                    />
                    <div className='member-email-div ms-2'>
                      <strong className='member-name'>
                        {member.firstName} {member.lastName}
                      </strong>
                      <p className='member-email'>{member.email}</p>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>

            <Modal show={showLeaveModal} onHide={handleCloseLeaveModal}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Title className='text-center text-black'>
                Vuoi davvero abbandonare la community?
              </Modal.Title>
              <Modal.Body className='d-flex justify-content-between'>
                <Button onClick={handleCloseLeaveModal} variant='secondary'>
                  Annulla
                </Button>
                <Button onClick={leaveCommunity} variant='danger'>
                  Abbandona Community
                </Button>
              </Modal.Body>
            </Modal>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default CommunityFeed

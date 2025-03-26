import axiosInstance from '../services/axios'
import { useContext, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Row,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import '../assets/css/UserProfile.css'
import { AuthContext } from '../context/AuthContext'
import { Heart, MessageCircle, MoreVerticalIcon } from 'lucide-react'

function UserProfile() {
  const { user } = useContext(AuthContext)

  const { userId } = useParams()
  const [me, setMe] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [posts, setPosts] = useState(null)
  const [likeCount, setLikeCount] = useState(0)
  const [likedByUser, setLikedByUser] = useState(false)

  const [selectedUser, setSelectedUser] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const [isFollowing, setIsFollowing] = useState(false)

  const [selectedPost, setSelectedPost] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [expandedComments, setExpandedComments] = useState({})
  const commentMaxChar = 20

  const navigate = useNavigate()

  useEffect(() => {
    if (user && parseInt(userId) === user.id) {
      navigate(`/home/profile/${user.id}`)
    }
  }, [user, userId, navigate])

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

  const getSelectedPostLikes = async () => {
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }
    try {
      const response = await axiosInstance.get(
        `/api/likes/post/${selectedPost.id}/count`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setLikeCount(response.data)

      const userLikeResponse = await axiosInstance.get(
        `/api/likes/post/${selectedPost.id}/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setLikedByUser(userLikeResponse.data)
    } catch (error) {
      console.error('Error fetching likes: ', error)
    }
  }

  const getUser = async () => {
    if (!user) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axiosInstance.get(`/api/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })
      setSelectedUser(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching user:', error)
    }
  }

  const getUserPosts = async () => {
    if (!user) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axiosInstance.get(`/api/posts/user/${userId}`, {
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

  const handlePostClick = (post) => {
    setSelectedPost(post)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPost(null)
  }

  useEffect(() => {
    getMe()
    getUser()
    getUserPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedPost) {
      getSelectedPostLikes()
      getSelectedPostComments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPost])

  useEffect(() => {
    const checkFollowing = async () => {
      if (user.id !== userId) {
        try {
          const response = await axiosInstance.get(
            `/api/follows/${user.id}/isFollowing/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          )
          setIsFollowing(response.data)
        } catch (error) {
          console.error('Error checking following:', error)
        }
      }
    }
    checkFollowing()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleLike = async () => {
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      await axiosInstance.post(
        `/api/likes/post/${selectedPost.id}/user/${user.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setLikedByUser((prev) => !prev)
      setLikeCount((prev) => (likedByUser ? prev - 1 : prev + 1))

      getSelectedPostLikes()
    } catch (error) {
      console.error('Error liking post: ', error)
    }
  }

  const getSelectedPostComments = async () => {
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      const response = await axiosInstance.get(
        `/api/comments/post/${selectedPost?.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments: ', error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }

    if (!newComment.trim()) return

    try {
      await axiosInstance.post(
        `/api/comments/post/${selectedPost?.id}/user/${user?.id}`,
        null,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { content: newComment },
        }
      )

      setNewComment('')
      getSelectedPostComments()
    } catch (error) {
      console.error('Error adding comment: ', error)
    }
  }

  const toggleFollow = async () => {
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }
    if (isFollowing) {
      try {
        await axiosInstance.delete(
          `/api/follows/${user.id}/unfollow/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        setIsFollowing(false)
        console.log(`Ora isFollowing: ${!isFollowing}`)
      } catch (error) {
        console.error('Error unfollowing user: ', error)
      }
    } else {
      try {
        await axiosInstance.post(
          `/api/follows/${user.id}/follow/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        setIsFollowing(true)
      } catch (error) {
        console.error('Error following user: ', error)
      }
    }
  }

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

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(
        `/api/comments/${commentId}/user/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      getSelectedPostComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const toggleComment = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  if (isLoading) return <p>Caricamento...</p>
  if (isError || !me) return <p>Errore nel caricamento del profilo</p>
  return (
    <Container className=' mt-3' fluid>
      <Row className=' d-flex justify-content-center'>
        <Col xs={12} md={10} className='profile-content'>
          <Card className='text-center profile-card'>
            <div className='profile-avatar-container'>
              <Card.Img
                variant='top'
                src={selectedUser?.avatar || '/img/avatar-profilo.jpg'}
                className='profile-avatar'
              />
            </div>
            <Card.Body>
              <Card.Title className='profile-name'>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </Card.Title>
              <Card.Text className='text-light profile-bio'>
                {selectedUser?.bio || 'Nessuna bio disponibile.'}
              </Card.Text>
            </Card.Body>
            <ListGroup className='profile-info'>
              <ListGroup.Item className='text-light'>
                Email: {selectedUser?.email}
              </ListGroup.Item>
              <ListGroup.Item className='text-light py-3'>
                {getTimeSinceRegistration(selectedUser?.createdAt)}
              </ListGroup.Item>
              <ListGroup.Item className='text-light'>
                Post: {posts?.totalElements}
              </ListGroup.Item>
              <ListGroup.Item className='text-light'>
                {userId !== user.id && (
                  <Button onClick={toggleFollow}>
                    {isFollowing ? 'Segui già' : 'Follow'}
                  </Button>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row>
        {posts &&
          posts.content.map((post) => (
            <Col key={post.id} xs={6} sm={4} md={3} className='mt-3'>
              <div
                className={`post-thumbnail ${post.image ? '' : 'text-post'}`}
                onClick={() => {
                  handlePostClick(post)
                }}
              >
                {post.image ? (
                  <img src={post.image} alt='Post' />
                ) : (
                  <p className='post-text-preview'>
                    {post.content.length > 50
                      ? post.content.substring(0, 50) + '...'
                      : post.content}
                  </p>
                )}
              </div>
            </Col>
          ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered size='lg'>
        <Container
          className='d-flex flex-row'
          style={{ boxShadow: '5px 5px 5px rgb(0, 0, 0, 0.2)' }}
        >
          <Row>
            <Col xs={12} lg={7}>
              <Modal.Header className='border border-0' closeButton>
                <Modal.Title className='d-flex align-items-center justify-content-between'>
                  <img
                    src={selectedUser?.avatar || '/img/avatar-profilo.jpg'}
                    alt='user-avatar'
                    className='post-details-user-avatar'
                  />
                  <span className='text-black ms-3'>
                    {selectedUser?.username}
                  </span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className='modal-body'>
                {selectedPost && selectedPost.image ? (
                  <img
                    src={selectedPost.image}
                    alt='Post'
                    className='modal-image img-fluid'
                  />
                ) : (
                  <p className='modal-text'>{selectedPost?.content}</p>
                )}
              </Modal.Body>
              <Modal.Footer className='border border-0 justify-content-center p-0'>
                <div className='post-details-actions'>
                  <span>{selectedPost?.content}</span>
                  <button
                    className={`like-button ${likedByUser ? 'liked' : ''}`}
                    onClick={handleLike}
                  >
                    <Heart size={20} color={likedByUser ? 'red' : 'black'} />
                    <span>{likeCount}</span>
                  </button>
                </div>
              </Modal.Footer>
            </Col>
            <Col xs={12} lg={5} className='comment-section'>
              <Modal.Header>
                <Modal.Title
                  style={{ color: 'gray' }}
                  className='d-flex align-items-center justify-content-center w-100'
                >
                  <MessageCircle size={20} /> <span>{comments?.length}</span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className='d-flex flex-column'>
                <div className='d-flex flex-column mb-3'>
                  <Form onSubmit={handleAddComment}>
                    <InputGroup>
                      <Form.Control
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                        as='textarea'
                        style={{ resize: 'none' }}
                      />
                    </InputGroup>
                    <Button type='submit' className='w-100'>
                      commenta
                    </Button>
                  </Form>
                </div>
                <div className='comment-list'>
                  {comments.length > 0 ? (
                    comments.map((comment) => {
                      const isExpanded = expandedComments[comment.id]
                      const text = comment.content
                      const shouldTruncate = text.length > commentMaxChar
                      const displayText =
                        shouldTruncate && !isExpanded
                          ? text.slice(0, commentMaxChar) + '...'
                          : text
                      return (
                        <div key={comment.id} className='comment mb-2'>
                          <strong className='d-block'>
                            {comment.author.username}
                          </strong>
                          <span>{displayText}</span>
                          {shouldTruncate && (
                            <button
                              className='btn btn-link m-0 p-0'
                              onClick={() => toggleComment(comment.id)}
                            >
                              {isExpanded ? 'Riduci' : 'Espandi'}
                            </button>
                          )}
                          <Dropdown
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: 'gray',
                            }}
                          >
                            <Dropdown.Toggle className='dropdown-btn'>
                              <MoreVerticalIcon />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='dropdown-menu'>
                              <Dropdown.Item
                                onClick={() => handleDeleteComment(comment?.id)}
                                className='dropdown-item'
                              >
                                Elimina
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      )
                    })
                  ) : (
                    <p className='text-muted'>
                      Nessun Commento per questo post
                    </p>
                  )}
                </div>
              </Modal.Body>
            </Col>
          </Row>
        </Container>
      </Modal>
    </Container>
  )
}

export default UserProfile

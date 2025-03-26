import { useContext, useEffect } from 'react'
import { useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axiosInstance from '../services/axios'
import { Alert, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import PostCard from '../components/PostCard'
import UserSearch from '../components/UserSearch'
import '../assets/css/FollowingFeed.css'

function FollowingFeed() {
  const { user } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [followingPosts, setFollowingPosts] = useState([])

  const getFollowingPosts = async () => {
    if (user) {
      try {
        const response = await axiosInstance.get(`/api/posts/following`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        })
        setFollowingPosts(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching following posts:', error)
        setIsError(true)
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    getFollowingPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <Container fluid>
      <Row className='py-3'>
        {isLoading && <Spinner animation='border' role='status' />}

        {isError && (
          <Alert variant='danger'>Errore nel caricamento dei post</Alert>
        )}
        <Col className='text-center'>
          <h1>Following</h1>
          <p className='lead'>Non perderti i post di tutti i tuoi amici</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4} className=' d-flex flex-column bg-dark rounded-3'>
          <Card className='m-3 user-search-card'>
            <Card.Body className='user-search-card-body'>
              <UserSearch className='user-search' />
            </Card.Body>
          </Card>
        </Col>
        <Col
          xs={12}
          md={8}
          style={{ borderLeft: '1px solid #ddd' }}
          className='bg-dark'
        >
          {followingPosts.content && followingPosts.content.length === 0 && (
            <Alert variant='info'>Non ci sono post da visualizzare</Alert>
          )}
          {followingPosts.content &&
            followingPosts.content.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </Col>
      </Row>
    </Container>
  )
}

export default FollowingFeed

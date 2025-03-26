import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'
import '../assets/css/DiscoverCommunities.css'
import { useEffect, useState, useCallback, useContext } from 'react'
import axiosInstance from '../services/axios'
import debounce from 'lodash.debounce'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function DiscoverCommunities() {
  const { user } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [communities, setCommunities] = useState([])
  const [me, setMe] = useState({})
  const [myCommunities, setMyCommunities] = useState([])
  const [loadingJoin, setLoadingJoin] = useState(null)

  const navigate = useNavigate()

  const myCommunitiesIds = myCommunities.map((community) => community.id)

  const getCommunities = async () => {
    try {
      const response = await axiosInstance.get(`/api/communities`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })
      setCommunities(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching communities:', error)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get(
          `/api/communities/search?query=${query}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        setCommunities(response.data)
        setIsLoading(false)
      } catch (error) {
        setIsError(true)
        setIsLoading(false)
        console.error('Error fetching communities:', error)
      }
    }, 500),
    [user.token]
  )

  const handleSearch = async (query) => {
    setSearchQuery(query)

    if (!query) {
      getCommunities()
      return
    }

    debouncedSearch(query)
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

      const communitiesResponse = await axiosInstance.get(
        '/api/users/me/communities',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setMyCommunities(communitiesResponse.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching user:', error)
    }
  }

  const handleJoinCommunity = async (communityId, userId) => {
    if (!user) {
      console.error('Nessun utente autenticato!')
      return
    }

    setLoadingJoin(communityId)

    try {
      await axiosInstance.post(
        `/api/community-members/join/${userId}/${communityId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      getCommunities()
      getMe()

      setTimeout(() => {
        navigate('/home')
      }, 1000)
    } catch (error) {
      setIsError(true)
      console.error('Error joining community:', error)
    }
  }

  useEffect(() => {
    getCommunities()
    getMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  if (isLoading) {
    return (
      <Container
        fluid
        className='d-flex flex-column align-items-center discover-communities-container py-3'
      >
        <Row>
          <Col xs='12'>
            <h1 className='display-3 text-light'>
              Esplora le nostre Community
            </h1>
          </Col>
        </Row>
        <Container
          className='d-flex align-items-center justify-content-center w-100 mt-3'
          style={{ minHeight: '100vh' }}
        >
          <Spinner animation='border' variant='light' />
        </Container>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container
        fluid
        className='d-flex flex-column align-items-center discover-communities-container py-3'
      >
        <Row>
          <Col xs='12'>
            <h1 className='display-3 text-light'>
              Esplora le nostre Community
            </h1>
          </Col>
        </Row>
        <Row className='w-100 mt-3'>
          <Col>
            <Alert variant='danger'>Errore nella richiesta!</Alert>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container
      fluid
      className='d-flex flex-column align-items-center discover-communities-container py-3'
    >
      <Row>
        <Col xs='12'>
          <h1 className='display-3 text-light'>
            Cerca tra le nostre Community
          </h1>
        </Col>
      </Row>
      <Row className='w-100 mt-3'>
        <Col>
          <Form>
            <Form.Group controlId='searchCommunityInput'>
              <Form.Control
                onChange={(e) => handleSearch(e.target.value)}
                value={searchQuery}
                className='bg-secondary rounded-5 text-light search-community-input'
                type='text'
                placeholder='Cerca la Community più adatta a te...'
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className='d-flex align-items-center justify-content-start w-100 mt-5'>
        <div className='div-dots'>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h2 className='text-center text-light my-3'>
          Non sai da dove iniziare? Prova con queste!
        </h2>

        {communities &&
          communities.slice(0, 6).map((community) => (
            <Col xs={12} sm={6} lg={4} className='mt-3' key={community.id}>
              <Card className='custom-discover-community-card'>
                <div className='image-container'>
                  <Card.Img
                    className='custom-discover-community-card-img'
                    variant='top'
                    src={community.imageUrl}
                  />
                  <div className='overlay'></div>
                </div>
                <div className='d-flex flex-column align-items-center discover-community-card-overlay-content'>
                  <Card.Title className='discover-community-card-title'>
                    {community.name}
                  </Card.Title>
                  <Card.Text className='discover-community-card-description'>
                    {community.description}
                  </Card.Text>
                  <Button
                    onClick={() =>
                      me.id && handleJoinCommunity(community.id, me.id)
                    }
                    className='discover-community-btn'
                    disabled={!me.id || myCommunitiesIds.includes(community.id)}
                    style={{
                      display: myCommunitiesIds.includes(community.id)
                        ? 'none'
                        : 'block',
                    }}
                  >
                    {loadingJoin === community.id ? (
                      <>
                        <Spinner
                          animation='border'
                          size='sm'
                          className='me-2'
                        />{' '}
                        Processing...
                      </>
                    ) : (
                      'JOIN'
                    )}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  )
}

export default DiscoverCommunities

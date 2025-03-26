import '../assets/css/CommunityList.css'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from 'react-bootstrap'
import axiosInstance from '../services/axios'
import { useNavigate } from 'react-router-dom'

function CommunityList() {
  const { user } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [myCommunities, setMyCommunities] = useState([])
  const navigate = useNavigate()

  const getMyCommunities = async () => {
    if (!user) {
      console.error('Nessun utente autenticato')
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
      console.log('Errore nel recuper delle tue Communities', error)
      setIsError(true)
    }
  }

  useEffect(() => {
    if (user) {
      const userUsername = jwtDecode(user.token).sub
      setUsername(userUsername)
    }
    getMyCommunities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (isLoading) {
    return (
      <Container
        fluid
        className='d-flex align-items-center justify-content-center'
        style={{ minHeight: '100vh' }}
      >
        <Spinner animation='border' />
      </Container>
    )
  }

  if (!user) {
    return <p>Non sei autenticato!</p>
  }

  if (isError) {
    return (
      <Container>
        <Alert>Errore nel caricamento delle community</Alert>
      </Container>
    )
  }

  return (
    <>
      <Container
        fluid
        className='d-flex flex-column community-list-container'
        style={{ minHeight: '100vh' }}
      >
        {username ? (
          <h1>Ciao {username} - Benvenuto in NicheNetwork </h1>
        ) : (
          <p>Caricamento...</p>
        )}

        {myCommunities.length > 0 ? (
          <>
            <Row>
              <Col>
                <h2>Le tue Community</h2>
              </Col>
            </Row>
            <Row className='justify-content-center mt-3'>
              {myCommunities.map((community, index) => (
                <Col key={index} xs={12} sm={6} lg={4} className='mt-3'>
                  <Card
                    className='custom-community-card'
                    onClick={() =>
                      navigate(`/home/communities/${community.id}`)
                    }
                  >
                    <div className='image-container'>
                      <Card.Img
                        className='custom-community-card-img'
                        variant='top'
                        src={community.imageUrl}
                      />
                      <div className='overlay'></div>
                    </div>
                    <div className='community-card-overlay-content'>
                      <Card.Title className='community-card-title'>
                        {community.name}
                      </Card.Title>
                      <Card.Text className='community-card-description'>
                        {community.description}
                      </Card.Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Row className='d-flex flex-grow-1 align-items-center justify-content-center'>
            <Col xs={12} sm={8} md={6} className='call-to-action-container'>
              <img
                src='/img/community.png'
                alt='Community Illustration'
                width='150'
                className='mb-3'
              />
              <h3 className='text-light'>
                Non sei ancora in nessuna Community?
              </h3>
              <p style={{ color: '#BBBBBB' }}>
                Unisciti e inizia a Condividere!
              </p>
              <Button size='lg' onClick={() => navigate('/home/communities')}>
                Esplora le community
              </Button>
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
}

export default CommunityList

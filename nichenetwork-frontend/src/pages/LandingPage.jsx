import { Button, Col, Container, Row } from 'react-bootstrap'
import '../assets/css/LandingPage.css'
import { Link, useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

function LandingPage() {
  const navigate = useNavigate()
  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  useEffect(() => {
    if (authenticatedUser) {
      try {
        const decodedToken = jwtDecode(authenticatedUser.token)
        const now = Date.now() / 1000
        if (decodedToken.exp < now) {
          localStorage.removeItem('user')
          navigate('/login')
        } else {
          navigate('/home')
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        localStorage.removeItem('user')
        navigate('/')
      }
    }
  }, [authenticatedUser, navigate])

  return (
    !authenticatedUser && (
      <Container fluid className='landing-container'>
        <Row>
          <Col>
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
            >
              <img
                className='hide-mobile landing-img'
                src='/img/cinema.jpg'
                alt='cinema'
              />
              <img
                className='landing-img'
                src='/img/cinofilia.jpg'
                alt='cinofilia'
              />
              <img
                className='landing-img'
                src='/img/equitazione.jpg'
                alt='equitazione'
              />
            </motion.div>
          </Col>
        </Row>
        <Row className='justify-content-center z-1'>
          <Col md='8' lg='6'>
            <h1 className='landing-title'>Benvenuto su NicheNetwork</h1>
            <p className='landing-sub'>
              Trova la Community adatta a te e inizia a condividere!
            </p>
            <div className='.landing-buttons'>
              <Link to='/login'>
                <Button size='lg' className='landing-button'>
                  Inizia ora
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <motion.div
              initial={{ opacity: 0, y: -70 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 2 }}
            >
              <img className='landing-img' src='/img/natura.jpg' alt='natura' />
              <img
                className='hide-mobile landing-img'
                src='/img/sport.jpg'
                alt='sport'
              />
              <img className='landing-img' src='/img/tech.jpg' alt='tech' />
            </motion.div>
          </Col>
        </Row>
      </Container>
    )
  )
}

export default LandingPage

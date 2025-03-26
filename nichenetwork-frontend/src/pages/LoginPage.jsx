import { Button, Col, Container, Row } from 'react-bootstrap'
import LoginForm from '../components/LoginForm'
import { Link } from 'react-router-dom'
import '../assets/css/LoginPage.css'

function LoginPage() {
  return (
    <Container className=' text-center login-container'>
      <Row className='justify-content-center my-5'>
        <Col xs={12} md={6} lg={4}>
          <h1>Sei già registrato?</h1>
          <h2>Accedi</h2>
          <LoginForm />
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col xs={12} md={6} lg={4}>
          <div
            style={{
              width: '60%',
              height: '2px',
              backgroundColor: '#ddd',
              marginRight: 'auto',
              marginLeft: 'auto',
              marginBottom: '3rem',
            }}
          ></div>

          <h3>Non sei ancora registrato?</h3>
          <Button as={Link} to='/register' className='btn-custom mt-3'>
            Crea un account
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage

import '../assets/css/RegisterPage.css'
import RegisterForm from '../components/RegisterForm'
import { Col, Container, Row } from 'react-bootstrap'

function RegisterPage() {
  return (
    <Container className='text-center register-container'>
      <Row className='justify-content-center my-5'>
        <Col xs={12} md={6} lg={4}>
          <h1>Crea un Account</h1>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  )
}

export default RegisterPage

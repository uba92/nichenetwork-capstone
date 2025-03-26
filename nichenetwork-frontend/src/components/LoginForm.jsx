import { useContext, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import AuthService from '../services/AuthService'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userData = await AuthService.login({ username, password })
      const userRole = AuthService.getUserRole()
      setUser({
        ...userData,
        role: userRole,
      })

      if (userRole === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch (err) {
      setError('Credenziali non valide ' + err.message)
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && <Alert variant='danger'>{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='tuo_username'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='exampleForm.ControlPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='********'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Form.Group>

        <Button className='btn-custom mt-3' type='submit'>
          {isLoading ? (
            <span className='spinner-border spinner-border-sm'></span>
          ) : (
            'Accedi'
          )}
        </Button>
      </Form>
    </>
  )
}

export default LoginForm

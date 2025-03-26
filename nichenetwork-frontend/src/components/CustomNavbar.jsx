import { Navbar, Nav, Container, Modal, Button, Spinner } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../assets/css/CustomNavbar.css'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import NotificationDropdown from './NotificationDropdown'

function CustomNavbar() {
  const location = useLocation()
  const adminRoute = location.pathname.startsWith('/admin')

  const [showModal, setShowModal] = useState(false)

  const { user, logout, loading } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setShowModal(false)
    navigate('/login')
  }

  if (loading) {
    return <Spinner animation='border' />
  }

  if (!user) {
    return (
      <Navbar expand='lg' className='navbar-custom' variant='dark'>
        <Container>
          <Navbar.Brand as={Link} to='/home' className='navbar-brand-custom'>
            🌐 Niche Network
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar-nav' />
          <Navbar.Collapse id='navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link as={Link} to='/login' className='nav-link-custom'>
                Login
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }

  return (
    <Navbar expand='lg' className='navbar-custom' variant='dark'>
      <Container>
        {adminRoute ? (
          <Navbar.Brand as={Link} to='/admin' className='navbar-brand-custom'>
            🌐 Niche Network
          </Navbar.Brand>
        ) : (
          <Navbar.Brand as={Link} to='/home' className='navbar-brand-custom'>
            🌐 Niche Network
          </Navbar.Brand>
        )}

        {!adminRoute && <NotificationDropdown />}
        <Navbar.Toggle aria-controls='navbar-nav' />
        <Navbar.Collapse id='navbar-nav'>
          <Nav className='ms-auto'>
            {!adminRoute && (
              <>
                <Nav.Link as={Link} to='/home' className='nav-link-custom'>
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to='home/following-feed'
                  className='nav-link-custom'
                >
                  Following
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to='/home/communities'
                  className='nav-link-custom'
                >
                  Esplora Community
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to={`/home/profile/${user.id}`}
                  className='nav-link-custom'
                >
                  Profilo
                </Nav.Link>
              </>
            )}

            <Nav.Link
              as={Link}
              to={`/home/profile/settings/${user.id}`}
              className='nav-link-custom'
            >
              Impostazioni
            </Nav.Link>

            <Nav.Link
              onClick={() => setShowModal(true)}
              style={{ cursor: 'pointer' }}
              className='nav-link-custom'
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Modal
        show={showModal}
        onHide={() => {}}
        backdrop='static'
        keyboard={false}
        centered
      >
        <Container className='custom-logout-modal'>
          <Modal.Body className='text-center'>
            <Modal.Title>Sicuro di voler uscire?</Modal.Title>
          </Modal.Body>
          <Modal.Footer className='justify-content-center'>
            <Button
              variant='secondary'
              onClick={() => setShowModal(false)}
              className='w-25'
            >
              Annulla
            </Button>
            <Button variant='danger' onClick={handleLogout} className='w-25'>
              Esci
            </Button>
          </Modal.Footer>
        </Container>
      </Modal>
    </Navbar>
  )
}

export default CustomNavbar

import axiosInstance from '../../services/axios'
import { useEffect } from 'react'
import { useState } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CreateCommunityModal from './CreateCommunityModal'

function ManageCommunities() {
  const [communities, setCommunities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navigate = useNavigate()

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const getCommunities = async () => {
    if (!authenticatedUser) {
      console.error('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axiosInstance.get(`/api/communities`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })

      setCommunities(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      console.error('Error fetching communities:', error)
    }
  }

  const formatDate = (dateString) => {
    const parsedDate = new Date(Date.parse(dateString))

    return parsedDate.toLocaleString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)

    if (!query) {
      getCommunities()
      return
    }

    try {
      const response = await axiosInstance.get(
        `/api/communities/search?query=${query}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )

      setCommunities(response.data)
    } catch (error) {
      console.error('Errore nella ricerca delle community:', error)
    }
  }

  useEffect(() => {
    if (authenticatedUser) {
      getCommunities()
    } else {
      console.error('Nessun utente autenticato!')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <h1>Communities</h1>
      <Container>
        <Form.Group className='mb-3'>
          <Form.Control
            type='text'
            placeholder='Cerca community...'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Form.Group>
        <Row>
          <Col>
            {isError && (
              <Alert variant='danger'>
                Errore nel caricamento delle Communities
              </Alert>
            )}

            {isLoading && (
              <Spinner animation='border' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </Spinner>
            )}

            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Descrizione</th>
                  <th>Data creazione</th>
                </tr>
              </thead>
              <tbody>
                {!communities ? (
                  <tr>
                    <td colSpan='6' className='text-center'>
                      <Spinner animation='border' role='status'>
                        <span className='visually-hidden'>Caricamento...</span>
                      </Spinner>
                    </td>
                  </tr>
                ) : (
                  communities.map((community) => (
                    <tr
                      key={community.id}
                      onClick={() =>
                        navigate(`/admin/gestione-community/${community.id}`)
                      }
                    >
                      <td>{community.id}</td>
                      <td>{community.name}</td>
                      <td>{community.description}</td>
                      <td>{formatDate(community.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row className=' pb-3'>
          <Col>
            <Button variant='warning' onClick={() => setShowModal(true)}>
              {' '}
              Crea Community
            </Button>
          </Col>
        </Row>

        <CreateCommunityModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          getCommunities={getCommunities}
        />
      </Container>
    </>
  )
}

export default ManageCommunities

import { useContext, useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import axiosInstance from '../../services/axios'

function CommunityDetails() {
  const { id } = useParams()
  const [community, setCommunity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [communityMember, setCommunityMember] = useState([])
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const handleCloseModal = () => setShowModal(false)
  const handleShowModal = () => setShowModal(true)

  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const { user } = useContext(AuthContext)

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

  const removeMember = async (userId) => {
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      await axiosInstance.delete(
        `/api/community-members/remove/${user.id}/${userId}/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      alert('Utente rimosso con successo dalla community')
      getCommunityMembers(id)
    } catch (error) {
      console.error('Errore nella rimozione del membro:', error)
      alert('Errore durante la rimozione del membro')
    }
  }

  const getCommunityMembers = async (id) => {
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      const response = await axiosInstance.get(
        `/api/community-members/${id}/members`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setCommunityMember(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      console.error('Error fetching community-members:', error)
    }
  }

  const getCommunityById = async (id) => {
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      const response = await axiosInstance.get(`/api/communities/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })

      setCommunity(response.data)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      console.error('Error fetching community:', error)
    }
  }

  const handleDeleteCommunity = async () => {
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }

    try {
      const response = await axiosInstance.delete(`/api/communities/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })

      alert(response.data)
      window.location.href = '/admin/gestione-community'
    } catch (error) {
      console.error("Errore nell'eliminazione della community:", error)
      alert("Errore durante l'eliminazione della community.")
    }
  }

  const handleEditCommunity = async () => {
    if (!user) {
      console.error('Nessun utente autenticato')
      return
    }

    if (id) {
      try {
        await axiosInstance.put(
          `/api/communities/${id}`,
          {
            name: editName,
            description: editDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )

        alert('Community modificata con successo')
        navigate(`/admin/gestione-community`)
      } catch (error) {
        console.error('Errore nella rimozione della community:', error)
        alert('Errore durante la rimozione della community')
      }
    }
  }

  useEffect(() => {
    if (id) {
      getCommunityById(id)
      getCommunityMembers(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (community) {
      setEditName(community.name || '')
      setEditDescription(community.description || '')
    }
  }, [community])

  if (isLoading) {
    return (
      <Container className='text-center mt-4'>
        <Spinner animation='border' />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container className='text-center mt-4'>
        <Alert variant='danger'>Errore nel caricamento della Community</Alert>
      </Container>
    )
  }

  return (
    <Container className='mt-4'>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Dettagli Community</Card.Title>
              <p>
                <strong>ID:</strong> {community?.id}
              </p>
              <p>
                <strong>Nome:</strong> {community?.name}
              </p>
              <p>
                <strong>Descrizione:</strong> {community?.description}
              </p>
              <p>
                <strong>Data creazione:</strong>{' '}
                {formatDate(community?.createdAt)}
              </p>
              <Button variant='danger' onClick={handleDeleteCommunity}>
                Rimuovi Community
              </Button>
              <Button
                className=' ms-3'
                variant='primary'
                onClick={handleShowModal}
              >
                Modifica Community
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className=' mt-3'>
        <Col>
          <h2>Membri della Community - {community?.name}</h2>
          <ListGroup>
            {communityMember.length > 0 ? (
              communityMember.map((member, index) => (
                <ListGroup.Item
                  key={index}
                  onClick={() =>
                    navigate(`/admin/gestione-utenti/${member.id}`)
                  }
                >
                  <div className=' d-flex justify-content-between'>
                    <span>
                      {member.username} - {member.firstName} - {member.lastName}{' '}
                      -{member.email} - {member.role}
                    </span>

                    <Button
                      className=' ms-3'
                      variant='danger'
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation()
                        removeMember(member.id)
                      }}
                    >
                      Rimuovi
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>
                Nessun membro presentein questa Community
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        centered
      >
        <Modal.Header className='bg-dark' closeButton>
          <Modal.Title>Modifica Community</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark text-light'>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Nome Community:</Form.Label>
              <Form.Control
                type='text'
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Descrizione Community:</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className='bg-dark'>
          <Button variant='secondary' onClick={handleCloseModal}>
            Annulla
          </Button>
          <Button variant='success' onClick={handleEditCommunity}>
            Salva Modifiche
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default CommunityDetails

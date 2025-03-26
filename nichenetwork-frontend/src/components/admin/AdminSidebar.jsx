import { HomeIcon, Settings, User, Users2 } from 'lucide-react'
import { ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function AdminSidebar() {
  return (
    <ListGroup>
      <ListGroup.Item
        style={{ textDecoration: 'none' }}
        className=' text-black p-3'
        as={Link}
        to={'/admin/'}
      >
        <HomeIcon size={20} color='#222' /> Dashboard
      </ListGroup.Item>
      <ListGroup.Item
        className=' text-black p-3'
        style={{ textDecoration: 'none' }}
        as={Link}
        to={'/admin/gestione-utenti'}
      >
        <User size={20} color='#222' /> Gestione Utenti
      </ListGroup.Item>
      <ListGroup.Item
        className=' text-black p-3'
        style={{ textDecoration: 'none' }}
        as={Link}
        to={'/admin/gestione-community'}
      >
        <Users2 size={20} color='#222' /> Gestione Community
      </ListGroup.Item>
      <ListGroup.Item
        className=' text-black p-3'
        style={{ textDecoration: 'none' }}
        as={Link}
        to={'/admin/impostazioni'}
      >
        <Settings size={20} color='#222' /> Impostazioni
      </ListGroup.Item>
    </ListGroup>
  )
}

export default AdminSidebar

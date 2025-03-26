import { Container, Row, Col } from 'react-bootstrap'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Outlet, Routes } from 'react-router-dom'

function AdminDashboard() {
  return (
    <Container fluid className=' pt-3'>
      <Row>
        <Col lg='3' className=' border-end'>
          <AdminSidebar />
        </Col>
        <Col lg='9'>
          <h1>Benvenuto nella pagina di gestione per utenti Admin</h1>
          <p>Usa la sidebar per navigare tra le varie funzionalità</p>
          <ul>
            <li>Esplora gli utenti iscritti</li>
            <li>Crea nuove community</li>
            <li>Rimuovi community</li>
            <li>Rimuovi membri dalle community</li>
          </ul>
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard

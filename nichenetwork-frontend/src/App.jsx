import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import CustomNavbar from './components/CustomNavbar'
import AppRoutes from './routes/AppRoutes'
import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Funzione per scrollare in cima
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <>
      <CustomNavbar />
      <AppRoutes />

      {showScrollTop && (
        <button className='scroll-to-top' onClick={scrollToTop}>
          <ArrowUp size={24} color='#fff' />
        </button>
      )}
    </>
  )
}

export default App

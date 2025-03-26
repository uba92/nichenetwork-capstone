import axiosInstance from '../services/axios'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Alert, Button, ListGroup, Spinner } from 'react-bootstrap'
import '../assets/css/UserSearch.css'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

function UserSearch() {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [isError, setIsError] = useState(false)
  const [page, setPage] = useState(0)

  const [hasMore, setHasMore] = useState(true)

  const navigate = useNavigate()

  const searchInputRef = useRef(null)

  const handleSearch = async (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setPage(0)
    setHasMore(true)
    setIsError(false)
    setIsLoading(true)

    if (value.trim() === '') {
      setSearchResults([])
      setIsLoading(false)
      return
    }

    try {
      setIsError(false)
      const size = 10
      const response = await axiosInstance.get(`/api/users/search`, {
        params: {
          query: value,
          page: 0,
          size,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })

      if (response.status === 204) {
        setSearchResults([])
        setIsLoading(false)
        setHasMore(false)
        return
      }

      const fetched = response.data.content
      const filtered = fetched.filter((u) => u.id !== user.id)

      if (filtered.length === 0) {
        setSearchResults([])
        setIsLoading(false)
        setHasMore(false)
        return
      }

      setSearchResults(filtered)
      setHasMore(fetched.length === size)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching search results:', error)
    }
  }

  const loadMore = async () => {
    try {
      const size = 10
      const response = await axiosInstance.get(`/api/users/search`, {
        params: { query: searchQuery, page: page + 1, size },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })

      const fetched = response.data.content
      const filtered = fetched.filter((u) => u.id !== user.id)

      if (!Array.isArray(filtered) || filtered.length === 0) {
        setHasMore(false)
        return
      }

      setSearchResults((prev) => [...prev, ...filtered])
      setPage((prev) => prev + 1)
      setHasMore(filtered.length === size)
    } catch (err) {
      console.error('Errore in loadMore:', err)
      setHasMore(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setSearchResults([])
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className='search-container' ref={searchInputRef}>
      <h1>
        <Search size={30} />
      </h1>
      <input
        className='search-input'
        placeholder='Cerca Nuovi Utenti...'
        type='text'
        value={searchQuery}
        onChange={handleSearch}
      />
      {isLoading && <Spinner animation='border' />}

      {searchResults.length > 0 && !isLoading && (
        <div className='search-results-container'>
          <ListGroup className='search-results'>
            {searchResults.map((result) => (
              <ListGroup.Item
                key={result.id}
                className='search-result-item'
                onClick={() => navigate(`/home/user/${result.id}`)}
              >
                <img
                  src={result.avatar || '/img/avatar-profilo.jpg'}
                  alt='Avatar'
                  className='search-result-avatar'
                />
                {result.username}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isLoading && (
        <p>Nessun utente trovato.</p>
      )}

      {searchResults.length > 0 && hasMore && (
        <Button
          onClick={loadMore}
          disabled={isLoading}
          variant='outline-dark'
          className='btn mt-3 text-light border-light'
        >
          {isLoading ? 'Caricamento...' : 'Carica altri'}
        </Button>
      )}
    </div>
  )
}

export default UserSearch

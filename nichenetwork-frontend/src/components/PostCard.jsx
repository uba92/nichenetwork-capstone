import { Card, Dropdown } from 'react-bootstrap'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import '../assets/css/Postcard.css'
import axiosInstance from '../services/axios'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function PostCard({ post, highlight = false }) {
  const [likeCount, setLikeCount] = useState(0)
  const [likedByUser, setLikedByUser] = useState(false)
  const [userId, setUserId] = useState(null)

  const { user } = useContext(AuthContext)

  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedCommentContent, setEditedCommentContent] = useState('')

  const navigate = useNavigate()

  const fetchLikes = async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/api/likes/post/${post.id}/count`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setLikeCount(response.data)

      const userLikeResponse = await axiosInstance.get(
        `/api/likes/post/${post.id}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setLikedByUser(userLikeResponse.data)
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/comments/post/${post.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  useEffect(() => {
    setUserId(user.id)
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (userId) {
      fetchLikes(userId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, post.id])

  const handleLike = async () => {
    if (!userId) {
      console.error('Errore: userId non trovato')
      return
    }

    try {
      await axiosInstance.post(
        `/api/likes/post/${post.id}/user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setLikedByUser((prev) => !prev)
      setLikeCount((prev) => (likedByUser ? prev - 1 : prev + 1))

      fetchLikes(userId)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      await axiosInstance.post(
        `/api/comments/post/${post.id}/user/${userId}`,
        null,

        {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { content: newComment },
        }
      )

      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error(`Errore nell'aggiungere il commento:`, error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await axiosInstance.delete(`/api/comments/${commentId}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      fetchComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const formatDate = (dateString) => {
    const parsedDate = new Date(Date.parse(dateString))

    return parsedDate.toLocaleString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleUpdatePost = async () => {
    try {
      await axiosInstance.put(
        `/api/posts/${post.id}`,
        {
          content: editedContent,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setIsEditing(false)
      post.content = editedContent
    } catch (error) {
      console.error('Errore nella modifica del post:', error)
    }
  }

  const handleUpdateComment = async (commentId) => {
    try {
      await axiosInstance.put(
        `/api/comments/${commentId}/user/${userId}`,
        null,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { newContent: editedCommentContent },
        }
      )

      setEditingCommentId(null)
      setEditedCommentContent('')
      fetchComments()
    } catch (error) {
      console.error('Errore aggiornamento commento:', error)
    }
  }

  const detectLinks = (text) => {
    if (!text) return ''

    const urlRegex = /(https?:\/\/[^\s]+)/g

    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='post-link'
        >
          {part}
        </a>
      ) : (
        part
      )
    )
  }

  return (
    <Card
      className={`my-3 post-card ${highlight ? 'highlighted-post' : ''}`}
      id={`post-${post.id}`}
    >
      <Card.Header className='postcard-header'>
        <div className='postcard-username-container d-flex flex-row align-items-center w-100 justify-content-between'>
          <div
            onClick={() => navigate(`/home/user/${post.author.id}`)}
            className='postcard-username-avatar-container'
          >
            <Card.Img
              className='me-3 postcard-avatar'
              src={post.author.avatar || '/img/avatar-profilo.jpg'}
              alt='avatar'
            />
            <span className='postcard-username'>{post.author.username}</span>
          </div>
          <div className='d-flex flex-column align-items-end'>
            {user.id === post.author.id && (
              <Dropdown
                onClick={(e) => e.stopPropagation()}
                className='postcard-dropdown'
              >
                <Dropdown.Toggle
                  variant='link'
                  className='text-light p-0 border-0'
                  id='dropdown-post-options'
                >
                  <MoreHorizontal size={20} />
                </Dropdown.Toggle>

                <Dropdown.Menu className='dropdown-menu-dark'>
                  <Dropdown.Item onClick={() => setIsEditing(true)}>
                    Modifica
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
        <div className='postcard-date'>{formatDate(post.createdAt)}</div>
      </Card.Header>
      <Card.Body>
        {isEditing ? (
          <div className='edit-post-form'>
            <textarea
              className='form-control mb-2'
              rows={3}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='d-flex gap-2'>
              <button
                className='btn btn-success btn-sm'
                onClick={handleUpdatePost}
              >
                Salva
              </button>
              <button
                className='btn btn-secondary btn-sm'
                onClick={() => {
                  setIsEditing(false)
                  setEditedContent(post.content)
                }}
              >
                Annulla
              </button>
            </div>
          </div>
        ) : (
          <Card.Text className='postcard-content'>
            {detectLinks(post.content)}
          </Card.Text>
        )}

        {post.image && (
          <Card.Img className='postcard-image' variant='top' src={post.image} />
        )}
        <div className='postcard-actions'>
          <button
            className={`like-button ${likedByUser ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <Heart size={20} color={likedByUser ? 'red' : '#ddd'} />
            <span style={{ color: likedByUser ? 'red' : '#ddd' }}>
              {likeCount}
            </span>
          </button>
          <button
            className='comment-button'
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={20} /> <span>{comments.length}</span>
          </button>
        </div>

        {showComments && (
          <div className={`comment-section ${showComments ? '' : 'hidden'}`}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className='d-flex justify-content-between comment'
                >
                  <div className='text-black'>
                    <strong>{comment.author.username}:</strong>{' '}
                    {editingCommentId === comment.id ? (
                      <textarea
                        className='form-control'
                        rows={2}
                        value={editedCommentContent}
                        onChange={(e) =>
                          setEditedCommentContent(e.target.value)
                        }
                      />
                    ) : (
                      comment.content
                    )}
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle
                      className='comment-dropdown-btn'
                      id='dropdown-basic'
                    >
                      <MoreHorizontal size={20} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='comment-dropdown-menu'>
                      {comment.author.id === userId && (
                        <>
                          <Dropdown.Item
                            className='text-light comment-dropdown-item'
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Elimina
                          </Dropdown.Item>
                          <Dropdown.Item
                            className='text-light comment-dropdown-item'
                            onClick={() => {
                              setEditingCommentId(comment.id)
                              setEditedCommentContent(comment.content)
                            }}
                          >
                            Modifica
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                  {editingCommentId === comment.id && (
                    <div className='d-flex gap-2 mt-2'>
                      <button
                        className='btn btn-success btn-sm'
                        onClick={() => handleUpdateComment(comment.id)}
                      >
                        Salva
                      </button>
                      <button
                        className='btn btn-secondary btn-sm'
                        onClick={() => {
                          setEditingCommentId(null)
                          setEditedCommentContent('')
                        }}
                      >
                        Annulla
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>Nessun commento</p>
            )}

            <div className='comment-form'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Scrivi un commento...'
              />
              <button onClick={handleAddComment} disabled={!newComment.trim()}>
                Invia
              </button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default PostCard

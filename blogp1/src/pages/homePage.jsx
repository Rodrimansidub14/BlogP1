/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import useAPI from '../hooks/useAPI'
import Modal from '../components/modal' // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css'

function HomePage() {
  const { data: posts, error, loading, fetchData } = useAPI()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    fetchData('api/posts').then(data => {
        console.log(data)
    }).catch(error => {
        console.error('Failed to fetch posts:', error)
    });
}, [fetchData])

  const handleOpenModal = (post) => {
    setSelectedPost(post)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedPost(null)
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    marginTop: '1rem',
  }

  const postStyle = {
    backgroundColor: '#1E1E1E', // Dark background for each post
    color: '#ccc', // Light text color for contrast
    width: '80%',
    marginBottom: '1rem',
  }

  const titleStyle = {
    color: '#A3833E', // Golden color for titles
    marginBottom: '0.5rem', // Space below the title
  }

  const textStyle = {
    color: '#ECE9DF', // Off-white color for text
    marginBottom: '0.5rem', // Space below the text
  }

  if (loading) {
    return <div style={containerStyle}>Loading posts...</div>
  }

  if (error) {
    return (
      <div style={containerStyle}>Error loading posts: {error.message}</div>
    )
  }

  return (
    <div style={containerStyle}>
      {posts && posts.length > 0 ? (
        <div
          className='post-container'
          style={{ width: '80%', maxHeight: '500px', overflowY: 'auto' }}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              className='card mb-3'
              style={postStyle}
              onClick={() => handleOpenModal(post)}
            >
              <div className='card-body'>
                <h5 className='card-title' style={titleStyle}>
                  {post.title}
                </h5>
                <p className='card-text' style={textStyle}>
                  {post.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No posts available.</div>
      )}
      <Modal
        isOpen={modalOpen}
        handleClose={handleCloseModal}
        title={selectedPost ? selectedPost.title : ''}
        style={{
          modalContent: { backgroundColor: '#333', color: '#fff' },
          title: { color: '#A3833E' },
          text: { color: '#ECE9DF' },
        }}
      >
        {selectedPost && <p>{selectedPost.content}</p>}
      </Modal>
    </div>
  )
}

export default HomePage

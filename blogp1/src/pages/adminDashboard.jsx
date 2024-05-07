/* eslint-disable prettier/prettier */
import { useContext, useEffect, useState } from 'react'
import useAPI from '../hooks/useAPI'
import Modal from '../components/modal'
import { AuthContext } from '../context/authContext'
import 'bootstrap/dist/css/bootstrap.min.css'

const AdminDashboard = () => {
  const { data: posts, error, loading, fetchData } = useAPI()
  const [selectedPost, setSelectedPost,] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const {user} = useContext(AuthContext)

  useEffect(() => {
    fetchData('api/posts')
  }, [fetchData])

  const handleEdit = (post) => {
    if (!user) {
      alert("Please log in to edit posts.")
      return;
    }
    setSelectedPost(post)
    setEditMode(true)
    handleModalClose()

  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedPost(null)
    setEditMode(false)
  }

  const handleDelete = async (postId) => {
    if (!user) {
      alert("Please log in to delete posts.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this post?')) {
      await fetchData(`api/admin/posts/${postId}`, { method: 'DELETE' });
      fetchData('api/posts');
    }
  }
  const handleNewPost = () => {
    if (!user) {
      alert("Please log in to create posts.");
      return;
    }
    setSelectedPost({ title: '', content: '', imageBase64: '', author: user.username });
    setEditMode(false);
    setModalOpen(true);
  }

  const handleSaveChanges = async () => {
    if (!user) {
      alert("Please log in to save changes.");
      return;
    }
    const endpoint = selectedPost.id ? `api/admin/posts/${selectedPost.id}` : 'api/admin/posts';
    const method = selectedPost.id ? 'PUT' : 'POST';

    await fetchData(endpoint, {
      method: method,
      body: JSON.stringify({ ...selectedPost, author: user.username }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchData('api/posts'); // Refresh list after update
      handleModalClose();
    }
  

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading posts: {error.message}</div>
  
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
  return (
    
    <div className='container mt-3' style={containerStyle}>
    <div
          className='post-container'
          style={{ width: '80%', maxHeight: '500px', overflowY: 'auto' }}
        ></div>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className='card mb-3' style={postStyle}>
            <div className='card-body'>
              <h5 className='card-title' style={titleStyle}>{post.title}</h5>
              <p className='card-text' style={textStyle}>{post.content}</p>
              <button
                className='btn btn-primary me-2'
                onClick={() => handleEdit(post)}
              >
                Edit
              </button>
              <button
                className='btn btn-danger'
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>No posts available.</div>
      )}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={handleModalClose}
          title={editMode ? 'Edit Post' : 'Create Post'}
          style={{
            modalContent: { backgroundColor: '#333', color: '#fff' },
            title: { color: '#A3833E' },
            text: { color: '#ECE9DF' },
          }}
        >
          <form onSubmit={(e) => e.preventDefault()} className='p-3'>
            <div className='form-group mb-3'>
              <label className='input-label' >Title:</label>
              <input
                type='text'
                className='form-input input-field'
                value={selectedPost?.title || ''}
                onChange={(e) =>
                  setSelectedPost({ ...selectedPost, title: e.target.value })
                }
                
              />
            </div>
            <div className='form-group mb-3'>
              <label>Content:</label>
              <textarea
                className='form-input input-field'
                value={selectedPost?.content || ''}
                onChange={(e) =>
                  setSelectedPost({ ...selectedPost, content: e.target.value })
                }
              />
            </div>
            <button
              type='submit'
              className='btn btn-success'
              onClick={handleSaveChanges}
            >
             {selectedPost?.id ? 'Save Changes' : 'Create Post'}
            </button>
          </form>
        </Modal>
      )}
      <button className="btn btn-success mb-3" onClick={() => handleNewPost()}>Create New Post</button>

    </div>
  )
}

export default AdminDashboard

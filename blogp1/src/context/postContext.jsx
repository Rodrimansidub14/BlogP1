/* eslint-disable prettier/prettier */
import { createContext, useCallback, useState } from 'react'
import useAPI from '../hooks/useAPI'
import PropTypes from 'prop-types'


export const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const { getPosts, createPost, updatePost, deletePost } = useAPI()

  const loadPosts = useCallback(async () => {
    const fetchedPosts = await getPosts()
    if (fetchedPosts) {
      setPosts(fetchedPosts)
    }
  }, [getPosts])

  const addPost = useCallback(
    async (post) => {
      const newPost = await createPost(post)
      if (newPost) {
        setPosts((prevPosts) => [...prevPosts, newPost])
      }
    },
    [createPost]
  )

  const editPost = useCallback(
    async (id, updatedPost) => {
      const result = await updatePost(id, updatedPost)
      if (result) {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === id ? result : post))
        )
      }
    },
    [updatePost]
  )

  const removePost = useCallback(
    async (id) => {
      await deletePost(id)
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
    },
    [deletePost]
  )

  return (
    <PostContext.Provider
      value={{ posts, loadPosts, addPost, editPost, removePost }}
    >
      {children}
    </PostContext.Provider>
  )
}

PostProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
/* eslint-disable prettier/prettier */
import { useState, useCallback, useContext } from 'react'
import { TokenContext } from '../hooks/useToken'

const useAPI = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { token } = useContext(TokenContext)

  const fetchData = useCallback(
    async (endpoint, options = {}) => {
      setLoading(true)
      setError(null)

      try {
        const url = `http://localhost:5000/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        }
        const response = await fetch(url, { ...options, headers })
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          )
        }
        const result = await response.json()
        setData(result)
        return result
      } catch (error) {
        setError(error)
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    },
    [token]
  )

  const getPosts = useCallback(() => {
    fetchData('api/posts')
  }, [fetchData])

  const getPost = useCallback(
    (postId) => {
      fetchData(`api/posts/${postId}`)
    },
    [fetchData]
  )

  const createPost = useCallback(
    (post) => {
      fetchData('api/admin/posts', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    },
    [fetchData]
  )

  const updatePost = useCallback(
    (postId, post) => {
      fetchData(`api/admin/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    },
    [fetchData]
  )

  const deletePost = useCallback(
    (postId) => {
      fetchData(`api/admin/posts/${postId}`, {
        method: 'DELETE',
      })
    },
    [fetchData]
  )

  const login = useCallback(async (username, password) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    };
    try {
      const response = await fetchData('api/login', options)
      if (response.token) {
        localStorage.setItem('token', response.token); // Store the token in localStorage
        // Set token in auth context or state here if using such a pattern
      }
      return response
    } catch (error) {
      console.error('Login failed:', error)
    }
  }, [fetchData])
  
  
  const register = useCallback(
    (username, password, userType) => {
      fetchData('api/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, role: userType }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    },
    [fetchData]
  )

  return {
    data,
    error,
    loading,
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    login,
    register,
    fetchData
  }
}

export default useAPI

/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
// eslint-disable-next-line linebreak-style
/* eslint-disable import/named */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import express from 'express'
import cors from 'cors'
import {
  getAllPosts, createPost, getPById, updatePById, deletePById,
  registerUser, getUserByUsername,
} from './db.js'
import { generateToken, verifyToken, verifyPassword } from './hashing.js'

const app = express()
app.use(cors({
  origin: ['http://localhost:3000'], // Add permitted domains here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

// Middleware to verify if user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const user = verifyToken(token)
    req.user = user
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' })
  }
}

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ error: 'Access denied' })
  }
}

app.get('/', (_req, res) => {
  res.send('Welcome to the blog server')
})

app.get('/posts', async (_req, res) => {
  try {
    const posts = await getAllPosts()
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).send('Failed to retrieve posts')
  }
})

app.get('/posts/:postId', async (req, res) => {
  try {
    const post = await getPById(req.params.postId)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).send('Post not found')
    }
  } catch (error) {
    res.status(500).send('Error retrieving post')
  }
})

app.post('/admin/posts', [isAuthenticated, isAdmin], async (req, res) => {
  const {
    title, content, imageBase64, author,
  } = req.body
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' })
  }
  try {
    const result = await createPost(title, content, imageBase64, author)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).send('Failed to create post')
  }
})

app.put('/admin/posts/:postId', [isAuthenticated, isAdmin], async (req, res) => {
  const {
    title, content, imageBase64, author,
  } = req.body
  try {
    const result = await updatePById(req.params.postId, title, content, imageBase64, author)
    if (result.affectedRows > 0) {
      const updatedPost = await getPById(req.params.postId)
      if (updatedPost) {
        res.status(200).json(updatedPost)
      } else {
        res.status(404).send('Post not found after update')
      }
    } else {
      res.status(200).send('Post found')
    }
  } catch (error) {
    console.error('Error updating post:', error)
    res.status(500).send('Server error')
  }
})

app.delete('/admin/posts/:postId', [isAuthenticated, isAdmin], async (req, res) => {
  try {
    const result = await deletePById(req.params.postId)
    if (result.affectedRows > 0) {
      res.status(404).send('Post no encontrado') // Correctamente eliminado, sin contenido a enviar.
    } else {
      res.status(204).send('Post eliminado') // No se encontró el post para eliminar.
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).send('Server error') // Error interno del servidor.
  }
})

app.post('/register', async (req, res) => {
  const { username, password, role } = req.body
  try {
    const userId = await registerUser(username, password, role)
    res.status(201).json({ message: 'User registered successfully', userId })
  } catch (error) {
    res.status(500).send('Registration failed')
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await getUserByUsername(username)
    if (!user || !user.password_hash) { // Check both user existence and hash existence
      return res.status(401).send('User not found or no hash stored')
    }
    if (await verifyPassword(user.password_hash, password)) {
      const token = generateToken(user)
      res.status(200).json({ token })
    } else {
      res.status(401).send('Invalid credentials')
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).send('Server error')
  }
})

app.use((_req, res, next) => {
  res.status(404).send('Endpoint not found')
  next()
})

app.use((error, _req, res, next) => {
  const status = error.status || 500
  const message = error.message || 'Internal Server Error'
  res.status(status).json({ error: message })
})

const port = 5000
app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})

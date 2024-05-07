/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
// eslint-disable-next-line linebreak-style
/* eslint-disable import/named */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import {
  getAllPosts, createPost, getPById, updatePById, deletePById,
  registerUser, getUserByUsername,
} from './db.js'
import { generateToken, verifyToken, verifyPassword } from './hashing.js'

const app = express()
app.use(cors({
  origin: ['http://localhost:5173'], // Add permitted domains here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json())
app.use(express.static('public'))
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

app.get('/api/posts', async (_req, res) => {
  try {
    const posts = await getAllPosts()
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve posts', details: error.message })
  }
})

app.get('/api/posts/:postId', async (req, res) => {
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

app.post('/api/admin/posts', [isAuthenticated, isAdmin], async (req, res) => {
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

app.put('/api/admin/posts/:postId', [isAuthenticated, isAdmin], async (req, res) => {
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

app.delete('/api/admin/posts/:postId', [isAuthenticated, isAdmin], async (req, res) => {
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

app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body
  try {
    const userId = await registerUser(username, password, role)
    res.status(201).json({ message: 'User registered successfully', userId })
  } catch (error) {
    res.status(500).send('Registration failed')
  }
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = { id: 13, username: 'peper', role: 'admin' }
  const secretKey = 'EbykO5rtXNmN8PGLhixGlZJ+RgxAZ2YI0d+PhfLeBCI='
  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey, { expiresIn: '24h' })
    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      token,
    })
  } else {
    res.status(401).json({ error: 'Authentication failed' })
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

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const port = 5000
app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})

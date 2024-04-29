/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable import/named */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
import express from 'express'
import cors from 'cors'
import {
  getAllPosts, createPost, getPById, updatePById, deletePById,
  registerUser, getUserByUsername,
} from './db.js'
import { generateToken, verifyToken, verifyPassword } from './hashing.js'

const app = express()
app.use(cors({
  origin: ['http://localhost:3000'], // Añade aquí los dominios permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.json({ limit: '10mb' }))

// eslint-disable-next-line consistent-return
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

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ error: 'Access denied' })
  }
}

app.get('/', (_req, res) => {
  res.send('Bienvenido al servidor del blog')
})

app.get('/posts', async (_req, res) => {
  const posts = await getAllPosts()
  res.status(200).json(posts)
})

app.get('/posts/:postId', async (req, res) => {
  const post = await getPById(req.params.postId)
  if (post) {
    res.status(200).json(post)
  } else {
    res.status(404).send('No se encontró ningún post')
  }
})

// eslint-disable-next-line consistent-return
app.post('/admin/posts', [isAuthenticated, isAdmin], async (req, res) => {
  const {
    title, content, imageBase64, author,
  } = req.body
  if (!title || !content) {
    return res.status(400).json({ error: 'Titulo y contenido son requeridos.' })
  }
  const result = await createPost(title, content, imageBase64, author)
  res.status(201).json(result)
})

app.put('/admin/posts/:postId', [isAuthenticated, isAdmin], async (req, res) => {
  const {
    title, content, imageBase64, author,
  } = req.body
  const result = await updatePById(req.params.postId, title, content, imageBase64, author)
  if (result.affectedRows > 0) {
    res.status(200).send('Post updated successfully')
  } else {
    res.status(404).send('Post not found')
  }
})

app.delete('/admin/posts/:postId', [isAuthenticated, isAdmin], async (req, res) => {
  const result = await deletePById(req.params.postId)
  if (result.affectedRows > 0) {
    res.status(204).send()
  } else {
    res.status(404).send('Post not found')
  }
})

app.post('/register', async (req, res) => {
  const { username, password, role } = req.body
  const userId = await registerUser(username, password, role)
  res.status(201).json({ message: 'User registered successfully', userId })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await getUserByUsername(username)
  if (user && await verifyPassword(user.password_hash, password)) {
    const token = generateToken({ id: user.id, username, role: user.role })
    res.json({ token })
  } else {
    res.status(401).send('Invalid credentials')
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

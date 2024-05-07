/* eslint-disable linebreak-style */
// Import the connection object from conn.js
// eslint-disable-next-line no-unused-vars
import pool from './conn.js'
import {
  // eslint-disable-next-line no-unused-vars
  hashPassword, verifyPassword, generateToken, verifyToken,
} from './hashing.js'

export async function getAllPosts() {
  try {
    const [rows] = await pool.query('SELECT * FROM posts') // Change 'erblog' to 'posts'
    return rows
  } catch (error) {
    console.error('Error getting all posts:', error)
    throw error
  }
}
export async function createPost(title, content, imageBase64, author) {
  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content, imageBase64, author) VALUES (?, ?, ?, ?)',
      [title, content, imageBase64, author],
    )
    return result
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

export async function getPById(postId) {
  try {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [postId]) // Change 'erblog' to 'posts'
    return rows[0] || null
  } catch (error) {
    console.error('Error getting post by id:', error)
    throw error
  }
}

export async function updatePById(postId, title, content, imageBase64, author) {
  try {
    const result = await pool.query(
      'UPDATE posts SET title = ?, content = ?, imageBase64 = ?, author = ? WHERE id = ?',
      [title, content, imageBase64, author, postId],
    )
    return result
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

export async function deletePById(postId) {
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = ?', [postId]) // Change 'erblog' to 'posts'
    return result
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

export async function registerUser(username, password, role) {
  if (!['user', 'admin'].includes(role)) {
    throw new Error('Invalid role specified')
  }
  const hashedPassword = await hashPassword(password)
  const result = await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
    [username, hashedPassword, role],
  )
  return result.insertId
}

export async function getUserByUsername(username) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    return rows[0] || null // Ensure it returns null if no user is found
  } catch (error) {
    console.error('Error getting user by username:', error)
    throw error
  }
}

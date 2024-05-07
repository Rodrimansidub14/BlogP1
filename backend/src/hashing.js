/* eslint-disable linebreak-style */
import { randomBytes, pbkdf2Sync } from 'crypto'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const { JWT_SECRET } = process.env

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set in the environment variables.')
  throw new Error('JWT_SECRET is not set')
}

const SALT_LENGTH = 16
const ITERATIONS = 10000
const KEY_LENGTH = 64
const DIGEST = 'sha512'

export function hashPassword(password) {
  if (!password) {
    console.error('Password is undefined or empty.')
    throw new Error('Password is required for hashing.')
  }
  const salt = randomBytes(SALT_LENGTH).toString('hex')
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex')
  return `${ITERATIONS}.${salt}.${hash}`
}

export function verifyPassword(storedHash, password) {
  if (!storedHash || !password) {
    console.error('Stored hash or password is undefined.')
    throw new Error('Both stored hash and password are required for verification.')
  }

  try {
    const [iterations, salt, originalHash] = storedHash.split('.')
    const hash = pbkdf2Sync(password, salt, parseInt(iterations, 10), KEY_LENGTH, DIGEST).toString('hex')
    return hash === originalHash
  } catch (error) {
    console.error('Error verifying password:', error)
    throw error
  }
}

export function generateToken(user) {
  if (!user || !user.role) {
    console.error('User role is missing:', user)
    throw new Error('User role is required for token generation.')
  }

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
  }

  console.log('JWT Payload:', payload)
  return jwt.sign(payload, JWT_SECRET)
}

export function verifyToken(token) {
  if (!token) {
    console.error('Token is undefined or empty.')
    throw new Error('Token is required for verification.')
  }

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error('Token verification failed', error)
    throw new Error('Invalid or expired token')
  }
}

/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
import sodium from 'libsodium-wrappers'
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_here'

// Espera a que sodium esté listo antes de usarlo
async function initializeSodium() {
  await sodium.ready
}

initializeSodium()

/**
 * Generar un hash de contraseña.
 *
 * @param {string} password - La contraseña a hashear.
 * @returns {Promise<string>} El hash de la contraseña.
 */
export async function hashPassword(password) {
  return sodium.crypto_pwhash_str(
    password,
    sodium.crypto_pwhash_OPSLIMIT_MODERATE,
    sodium.crypto_pwhash_MEMLIMIT_MODERATE,
  )
}

/**
 * Verificar una contraseña contra un hash.
 *
 * @param {string} hash - El hash contra el que se verifica.
 * @param {string} password - La contraseña a verificar.
 * @returns {Promise<boolean>} El resultado de la verificación.
 */
export async function verifyPassword(hash, password) {
  return sodium.crypto_pwhash_str_verify(hash, password)
}

/**
 * Generar un token JWT para un usuario.
 *
 * @param {object} user - El objeto usuario que incluye id y username.
 * @returns {string} El token JWT generado.
 */
export function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' })
}

/**
 * Verificar un token JWT.
 *
 * @param {string} token - El token JWT a verificar.
 * @returns {object} El payload decodificado si el token es válido.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

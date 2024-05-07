/* eslint-disable prettier/prettier */
import { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useAPI from '../hooks/useAPI'
import { useToken } from '../hooks/useToken' // Importa useToken

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user');
      console.log('Initial user from localStorage:', savedUser); // Log initial user retrieval
      return savedUser ? JSON.parse(savedUser) : null;
    });
    const [authError, setAuthError] = useState('');
    const { token, saveToken, clearToken } = useToken();
    const { login, register } = useAPI();
  
    useEffect(() => {
      console.log('Token changed:', token); // Log when token changes
      if (!token) {
        setUser(null);
        localStorage.removeItem('user');
      }
    }, [token]);

  const handleLogin = async (username, password, navigateCallback) => {
    try {
      const data = await login(username, password)
      if (data && data.token && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
        saveToken(data.token);  // Use saveToken here
        setUser(data.user);
        if (navigateCallback) {
          navigateCallback('/')
        }
      } else {
        throw new Error("Login data is incomplete. Missing token or user information.")
      }
    } catch (error) {
      console.error('Login failed:', error)
      setAuthError('Login failed: ' + error.message)
    }
  }

  const handleRegister = async (
    username,
    password,
    userType,
    navigateCallback
  ) => {
    try {
      await register(username, password, userType)
      if (navigateCallback) {
        navigateCallback('/login')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      setAuthError('Registration failed: ' + error.message)
    }
  }

  const logout = (navigateCallback) => {
    localStorage.removeItem('user')
    clearToken()
    setUser(null)
    if (navigateCallback) navigateCallback('/login')
  }
 
  return (
    <AuthContext.Provider
      value={{ user, setUser, token, handleLogin, logout, handleRegister, authError }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

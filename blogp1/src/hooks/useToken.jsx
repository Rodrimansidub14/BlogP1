/* eslint-disable prettier/prettier */
import { useState, createContext, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
export const TokenContext = createContext(null)

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const initialToken = localStorage.getItem('access_token')
    console.log('Initial token from localStorage:', initialToken) 
    return initialToken
  })
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('access_token')
      console.log('Token updated in localStorage:', newToken) 
      setToken(newToken)
    };

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    };
  }, [])

  const saveToken = (newToken) => {
    console.log('Saving new token to localStorage:', newToken)
    localStorage.setItem('access_token', newToken)
    setToken(newToken)
  }

  const clearToken = () => {
    console.log('Clearing token from localStorage') 
    localStorage.removeItem('access_token')
    setToken(null)
  }

  return (
    <TokenContext.Provider value={{ token, saveToken, clearToken }}>
      {children}
    </TokenContext.Provider>
  )
}
TokenProvider.propTypes = {
  children: PropTypes.node.isRequired,
}


const useToken = () => {
  const context = useContext(TokenContext)
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider')
  }
  return context
}

export { useToken }

/* eslint-disable prettier/prettier */
import 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/homePage'
import AdminDashboard from './pages/adminDashboard'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/registerPage'
import { AuthProvider } from './context/authContext'
import { TokenProvider } from './hooks/useToken'
import { PostProvider } from './context/postContext'
import backgroundImage from './assets/ERLogo3.jpg'

function App() {
  const sectionStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <div style={sectionStyle}>
    <TokenProvider>
      <AuthProvider>
        <PostProvider> 
          <Router>
            <Header />
            <div className='container mt-5'>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/admin' element={<AdminDashboard />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
              </Routes>
            </div>
          </Router>
        </PostProvider>
      </AuthProvider>
    </TokenProvider>
  </div>
)
}

export default App 
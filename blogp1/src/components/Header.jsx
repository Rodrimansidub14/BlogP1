/* eslint-disable prettier/prettier */
// components/Header.js
import  'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import eldenringlogo from '../assets/eldenringlogo.png'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  console.log(logout); // Should log the function, if not, it might log 'undefined'

  const handleLogout = () => {
    logout(); // Assuming logout clears the context/state
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark fixed-top'>
      <div className='container-fluid'>
        <NavLink className='navbar-brand' to='/'>
          <img
            src={eldenringlogo}
            alt='Logo'
            style={{ width: 210, height: 50 }}
          />
        </NavLink>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav ms-auto'>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/'>
                Home
              </NavLink>
            </li>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='/admin'>
                      Admin Dashboard
                    </NavLink>
                  </li>
                )}
                <li className='nav-item'>
                  <button
                    className='nav-link btn btn-link'
                    onClick={handleLogout}
                    style={{ color: '#fff' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/login'>
                    Login
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/register'>
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header

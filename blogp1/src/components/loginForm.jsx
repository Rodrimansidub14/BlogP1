/* eslint-disable prettier/prettier */
import 'react'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import { useNavigate } from 'react-router-dom' 
import '../styles/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'

function LoginForm() {
  const { handleLogin } = useAuth()
  const navigate = useNavigate() // usa useNavigate aquí
  const { formData, handleChange, handleSubmit } = useForm({
    initialValues: {
      username: '',
      password: '',
    },
     onSubmit: async ({ username, password }) => {
      console.log("Attempting to login with:", username, password);
      try {
        await handleLogin(username, password);
        alert('Login successful');
        navigate('/');  // Navigate only after successful login
      } catch (error) {
        console.error("Login error:", error);
        alert('Login failed: ' + error.message); // More detailed error message for debugging
      }
    }
  })

  return (
    <div className='form-container'>
      <h2 className='form-title'>Login</h2>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-group'>
          <label htmlFor='username' className='input-label'>
            Username
          </label>
          <input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            onChange={handleChange}
            className='form-input input-field'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password' className='input-label'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            className='form-input input-field'
          />
        </div>
        <button type='submit' className='btn form-button btn-primary'>
          Login
        </button>
        <div className='mt-3'>
          <p className='text-center custom-text-color'>
            ¿No tienes una cuenta?{' '}
            <Link to='/register' className='custom-link-color'>
              Registrate
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginForm

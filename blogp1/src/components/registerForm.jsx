/* eslint-disable prettier/prettier */
// RegisterForm.jsx
import 'react'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import { useNavigate } from 'react-router-dom'
import '../styles/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from 'react-router-dom'

function RegisterForm() {
  const navigate = useNavigate() // Instancia de navigate
  const { handleRegister } = useAuth()
  const { formData, handleChange, handleSubmit } = useForm({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
      userType: 'user', 
    },
    onSubmit: async ({ username, password, confirmPassword, userType }) => {
      if (password !== confirmPassword) {
        alert("Passwords don't match")
        return
      }
      try {
        await handleRegister(username, password, userType, () =>
          navigate('/login')
        )
      } catch (error) {
        alert('Registration failed: ' + error.message)
      }
    },
  })

  return (
    <div className='form-container'>
      <h2 className='form-title'>Register</h2>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-group'>
          <label htmlFor='userType' className='select-label'>
            Type of User
          </label>
          <select
            id='userType'
            name='userType'
            value={formData.role}
            onChange={handleChange}
            className='form-select'
          >
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
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
        <div className='form-group'>
          <label htmlFor='confirmPassword' className='input-label'>
            Confirm Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            className='form-input input-field'
          />
        </div>
        <button type='submit' className='btn form-button btn-primary'>
          Register
        </button>
        <div className='mt-3'>
          <p className='text-center custom-text-color'>
            Already have an account?{' '}
            <Link to='/login' className='custom-link-color'>
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm

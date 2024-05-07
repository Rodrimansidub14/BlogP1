/* eslint-disable prettier/prettier */
import 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'

const Modal = ({ isOpen, onClose , title, children, style }) => {
  if (!isOpen) return null

  // Default styles merged with incoming styles
  const defaultStyles = {
    modalContent: {
      backgroundColor: '#1E1E1E',
      color: '#ccc',
      ...style.modalContent,
    },
    title: {
      color: '#A3833E',
      marginBottom: '0.5rem',
      ...style.title,
    },
    text: {
      color: '#ECE9DF',
      marginBottom: '0.5rem',
      ...style.text,
    },
  }

  return (
    <div className='modal show' style={{ display: 'block' }}>
      <div className='modal-dialog'>
        <div className='modal-content' style={defaultStyles.modalContent}>
          <div className='modal-header'>
            <h5 className='modal-title' style={defaultStyles.title}>
              {title}
            </h5>
            <button
              type='button'
              className='btn-close btn-close-white'
              aria-label='Close'
              onClick={onClose}
            ></button>
          </div>
          <div className='modal-body' style={defaultStyles.text}>
            {children}
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  style: PropTypes.shape({
    modalContent: PropTypes.object,
    title: PropTypes.object,
    text: PropTypes.object,
  }),
}

export default Modal

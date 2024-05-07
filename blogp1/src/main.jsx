/* eslint-disable react-refresh/only-export-components */
// src/index.js or src/main.jsx
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap'

const App = React.lazy(() => import('./App'))
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
)

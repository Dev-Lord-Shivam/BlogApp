import React from 'react'
import { Link } from 'react-router-dom'
import './ErrorPage.css'
const ErrorPage = () => {
  return (
    <section className='error-pg'>
      <div className="centre">
         <Link to='/' className='btn-error'>Go Back Home</Link>
         <h2>Oops Page Not Found</h2>
      </div>
    </section>
  )
}

export default ErrorPage

import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer>
        <ul className="footer_categories">
            <li><Link to='/posts/categories/Agriculture'>Agriculture</Link></li>
            <li><Link to='/posts/categories/Business'>Business</Link></li>
            <li><Link to='/posts/categories/Education'>Education</Link></li>
            <li><Link to='/posts/categories/Entertainment'>Entertainment</Link></li>
            <li><Link to='/posts/categories/Education'>Education</Link></li>
            <li><Link to='/posts/categories/Art'>Art</Link></li>
            <li><Link to='/posts/categories/Investment'>Investment</Link></li>
            <li><Link to='/posts/categories/Weather'>Weather</Link></li>
            <li><Link to='/posts/categories/Sports'>Sports</Link></li>
            <li><Link to='/posts/categories/Politics'>Politics</Link></li>
        </ul>
        <div className="footer_copyrights">
            <small>All Right Reserved &copy; Copyright, Shivam Jaiswal</small>
        </div>
    </footer>
  )
}

export default Footer

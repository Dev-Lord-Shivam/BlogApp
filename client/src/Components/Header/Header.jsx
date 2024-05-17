import React, { useState,useContext } from 'react'
import './Header.css'
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import {UserContext} from '../../context/userContext'

const Header = () => {

  const [navbuttonVisible, setNavButtonVisisble] = useState(window.innerWidth > 800 ? true : false)
  const {currentUser} = useContext(UserContext)

  const closeNavButton = () => {

    if(window.innerWidth < 800)
         setNavButtonVisisble(false);
    else
        setNavButtonVisisble(true);
  } 
  return (
    <nav>
        <div className="container nav_container">
            <Link to="/" className='app-logo'>
                <img src={logo} alt="app logo" className="logo" />
            </Link>
            {currentUser?.id && navbuttonVisible && <ul className="nav_menu">
                <li><Link to={`/profile/${currentUser?.id}`} onClick={closeNavButton}>{currentUser?.name}</Link></li>
                <li><Link to="/create" onClick={closeNavButton}>Create Post</Link></li>
                <li><Link to="/author" onClick={closeNavButton}>Author</Link></li>
                <li><Link to="/logout" onClick={closeNavButton}>Logout</Link></li>
            </ul> }
            {!currentUser?.id && navbuttonVisible && <ul className="nav_menu">
                <li><Link to="/author" onClick={closeNavButton}>Author</Link></li>
                <li><Link to="/login" onClick={closeNavButton}>login</Link></li>
            </ul> }
            <button className='nav_toggle_btn' onClick={() => setNavButtonVisisble(!navbuttonVisible)}>
              {
                 navbuttonVisible ? <i class="fa-solid fa-x"></i>  : <i class="fa-solid fa-bars"></i>
              } 
            </button>
        </div>
    </nav>
  )
}

export default Header

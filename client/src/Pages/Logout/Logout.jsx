import {React,useEffect,useContext} from 'react'
import {UserContext} from '../../context/userContext'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate(UserContext)
  const {setCurrentUser} = useContext(UserContext)
  setCurrentUser(null)
  navigate('/login')
  return (
    <></>
  )
}

export default Logout

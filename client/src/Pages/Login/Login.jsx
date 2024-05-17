import {React,useState,useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserContext} from '../../context/userContext'

const Login = () => {
  
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const {setCurrentUser} = useContext(UserContext)

  const [userData,setUserData] = useState({
    email: '',
    password: ''
  })
  
  const changeInputHandler = (e) => {
     setUserData(prevState => {
         return {...prevState,[e.target.name]: e.target.value}
     })
  }

  const loginUser = async (e) => {
    e.preventDefault()
    setError('');
    try{
      const response = await axios.post(`${process.env.REACT_APP_BASE_URI}/users/login`, userData)
      const user = await response.data;
      console.log(response)
      console.log(user)
      if(!user){
        setError("Couldn't register user. Please try again")
      }
      setCurrentUser(user)
      navigate('/')
    }
    catch(error){
      setError(error.response.data.message)
    }
  }

  return (
    <section className="login">
      <div className="container">
        <h2>Sing In</h2>
        <form className="form resiter_form" onSubmit={loginUser}>
          {error && <p className="form_error_msg">{error}</p>}
          <input type="email" placeholder='Your Email' name='email' value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <button type='submit' className='btn-categories'>Submit</button>
        </form>
        <small>Dont have an account? <Link to='/register'>Register</Link></small>
      </div>
    </section>
  )
}

export default Login

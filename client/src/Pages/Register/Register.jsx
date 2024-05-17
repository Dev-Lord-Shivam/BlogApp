import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios'



const Register = () => {

  const [userData,setUserData] = useState({
    name: '',
    email: '',
    password: '',
    CnfPassword: ''
  })

  const [error, setError] = useState('')
  const navigate = useNavigate()
  
  const changeInputHandler = (e) => {
     setUserData(prevState => {
         return {...prevState,[e.target.name]: e.target.value}
     })
  }
  
  const registerUser = async (e) => {
       e.preventDefault()
       setError('')
       try {
          const response = await axios.post(`${process.env.REACT_APP_BASE_URI}/users/register`, userData)
          const newUser = await response.data;
          console.log(newUser)
          if(!newUser){
            setError("Couldn't register user. Please try again")
          }
          navigate('/login')
       }
       catch(error){
        setError(error.response.data.message)
       }
  }

  return (
    <section className="register">
      <div className="container">
        <h2>Sing Up</h2>
        <form className="form resiter_form" onSubmit={registerUser}>
         {error && <p className="form_error_msg">{error}</p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler} />
          <input type="email" placeholder='Your Email' name='email' value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='CnfPassword' value={userData.CnfPassword} onChange={changeInputHandler} />
          <button type='submit' className='btn-categories'>Submit</button>
        </form>
        <small>Already have an account? <Link to='/login'>Login</Link></small>
      </div>
    </section>
  )
}

export default Register

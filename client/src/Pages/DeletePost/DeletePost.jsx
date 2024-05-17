import React,{useContext} from 'react'
import { Link,useNavigate,useLocation } from 'react-router-dom'
import { UserContext } from '../../context/userContext'
import axios from 'axios'

const DeletePost = ({postID : id}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token
  
  const removePost = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URI}/posts/${id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      
      if(response.status == 200){
        if(location.pathname == `/myposts/${currentUser.id}`){
          navigate(0)
        }
        else{
          navigate('/')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <Link className='btn-error' onClick={() => removePost(id)}>Delete</Link>
    </div>
  )
}

export default DeletePost

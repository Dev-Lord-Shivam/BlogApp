import React, { useState,useContext,useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import {UserContext} from '../../context/userContext'
import './Dashboard.css'
import axios from 'axios';
import Loader from '../../Components/Loader/Loader'
const Dashboard = () => {
 
  const [posts,setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const {id} = useParams();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token
  const navigate = useNavigate(); 
  useEffect(() => {
    if(!token){
       navigate('/login')
    }
  }, [])
  
  useEffect(() => {
     const fetchPost = async () => {
      setIsLoading(true);
      try 
      {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/posts/users/${id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
        setPosts(response.data)
      } 
      catch (error) 
      {
        console.log(error)
      }
      setIsLoading(false)
     }
     fetchPost();
     
  }, [id])
  
  if(isLoading){
    return <Loader />
  }

  return (
    <section className="dashboard">
      {
        posts.length ? <div className="container dashboard_container">
             {
               posts.map(post => {
                return <article key={post.id} className='dashboard_post'>

                  <div className="dashboard_post-info">
                      <div className="dashboard_post-thumbnails">
                        <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
                      </div>
                      <h5>{post.title}</h5>
                  </div>
                  <div className="dashboard_post-actions">
                      <Link to={`/posts/${post._id}`} className='btn-categories'>View</Link>
                      <Link to={`/posts/${post._id}/edit`} className='btn-success'>Edit</Link>
                      <Link to={`/posts/${post._id}/delete`} className='btn-error'>Delete</Link>
                  </div>
                </article>
               })
             }
        </div> : <h2 style={{textAlign:"center"}}>No Post Available</h2>
      }
    </section>
  )
}

export default Dashboard

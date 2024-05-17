import React, { useState,useEffect } from 'react'
import './AuthorPost.css'
import PostsItem from '../../Components/PostsItem/PostsItem'
import Loader from '../../Components/Loader/Loader'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const AuthorPost = () => {
  const [posts, setPosts] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const {id} = useParams();
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/posts/users/${id}`)
        setPosts(response?.data)
      }
      catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }
    fetchPosts()
  }, [id])

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className='posts'>
      {posts.length > 0 ? <div className="container post_container">
        {
          posts.map(({ _id: id, thumbnail, creator, title, description, category, createdAt }) =>
            <PostsItem key={id} thumbnail={thumbnail} postID={id} desc={description} category={category} title={title} authorID={creator} createdAt={createdAt} />
          )
        }
      </div> : <h2 style={{ textAlign: "center" }}>Oops! No Post Found</h2>}
    </section>
  )
}

export default AuthorPost

import React, { useState,useEffect } from 'react'
import './Post.css'
import Loader from '../Loader/Loader'
import PostsItem from '../PostsItem/PostsItem'
import axios from 'axios'



const Posts = () => {

    const [posts, setPosts] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchPosts = async () => {
             setIsLoading(true);
             try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/posts`)
                setPosts(response?.data)
             }
             catch (err){
                console.log(err)
             }
             setIsLoading(false)
        }
        fetchPosts()
    }, [])

    if(isLoading){
        return <Loader/>
    }

    return (
        <section className='posts'>
          {posts.length > 0 ? <div className="container post_container">
            {
                posts.map(({_id: id, thumbnail, creator, title, description, category,createdAt }) =>
                    <PostsItem key={id} thumbnail={thumbnail} postID={id} desc={description} category={category} title={title} authorID={creator} createdAt={createdAt} />
                )
            }
            </div> : <h2 style={{textAlign: "center"}}>Oops! No Post Found</h2>}
        </section>
    )
}

export default Posts

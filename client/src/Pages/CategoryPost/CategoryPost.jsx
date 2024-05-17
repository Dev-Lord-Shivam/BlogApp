import {React,useState,useEffect} from 'react'
import axios from 'axios';
import PostsItem from '../../Components/PostsItem/PostsItem';
import './CategoryPost.css'
import { useParams } from 'react-router-dom';
import Loader from '../../Components/Loader/Loader';

const CategoryPost = () => {
  const [posts, setPosts] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const {category} = useParams();
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/posts/categories/${category}`)
        setPosts(response?.data)
      }
      catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }
    fetchPosts()
  }, [category])

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

export default CategoryPost

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Author.css'
import axios from 'axios';
import Loader from '../../Components/Loader/Loader';



const Author = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
     const getAuthors = async () => {
        setIsLoading(true)
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/users`)
          setAuthors(response.data)
        } catch (error) {
          console.log(error)
        }
        setIsLoading(false)
     }
     getAuthors()
  }, [])

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? <div className="container author_container">
        {
          authors.map(({_id: id, avatar, name, posts }) => {
            return <Link key={id} to={`/posts/users/${id}`} className='author'>
              <div className="author_avatar">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt={name} />
              </div>
              <div className="author_info">
                <h4>{name}</h4>
                <p>{posts}</p>
              </div>
            </Link>
          }
          )}
      </div> : <h2 style={{ textAlign: "center" }}>No Author/User Found</h2>
      }
    </section>
  )
}

export default Author

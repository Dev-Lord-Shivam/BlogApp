import React, { useContext, useEffect, useState } from 'react';
import PostAuthor from '../../Components/PostAuthor/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './PostDetails.css';
import Loader from '../../Components/Loader/Loader';
import DeletePost from '../DeletePost/DeletePost';
import {UserContext} from '../../context/userContext'

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {currentUser} = useContext(UserContext)

  useEffect(() => {

    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };

    getPost();
  }, [id,currentUser]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post_Details">
      {error && <p className="error">{error}</p>}
      {post && (
        <div className="container post_details_container">
          <div className="post_detail_header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>
            {currentUser?.id === post?.creator && (
              <div className="post_detail_button">
                <Link to={`/posts/${post?._id}/edit`} className="btn-success">
                  Edit
                </Link>
                <DeletePost postID = {id}/>
              </div>
            )} 
          </div>
          <h1>{post.title}</h1>
          <div className="post_detail_thumbnails">
            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post?.thumbnail}`} alt="thumbnail" />
          </div>
          <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
        </div>
      )}
    </section>
  );
};

export default PostDetails;

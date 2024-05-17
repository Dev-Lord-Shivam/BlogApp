import React from 'react'
import { Link } from 'react-router-dom'
import './PostsItem.css'
import PostAuthor from '../PostAuthor/PostAuthor'

const PostsItem = ({ postID, thumbnail, authorID, title, desc, category, createdAt }) => {
  const shortDesc = desc.length > 145? `${desc.substr(0,145)}...`:desc;
  const shortTitle = title.length > 24? `${title.substr(0,24)}...`:title;
  return (
    <article className='post'>
      <div className="post_thumbnails">
        <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={thumbnail} />
      </div>
      <div className="post_content">
        <Link to={`/posts/${postID}`}>
            <h3>{shortTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{__html: shortDesc}} />
        <div className="post_footer">
            <PostAuthor authorID = {authorID} createdAt ={createdAt} />
            <Link to={`/posts/categories/${category}`} className='btn-categories'>
                {category}
            </Link>
        </div>
      </div>
    </article>
  )
}

export default PostsItem

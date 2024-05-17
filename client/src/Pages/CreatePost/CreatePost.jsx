import React, { useEffect, useState, useContext } from 'react'
import ReactQuill from 'react-quill'
import { useNavigate } from 'react-router-dom'
import './CreatePost.css'
import 'react-quill/dist/quill.snow.css'
import {UserContext} from '../../context/userContext'
import axios from 'axios'

const CreatePost = () => {

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategories');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState(null)
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token
  const navigate = useNavigate();
  useEffect(() => {
    if(!token){
       navigate('/login')
    }
  }, [])

  const module = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list','bullet','indent',
    'link','image'
  ]

  const POST_CATEGORIES = ["Politics","Sports","Architecture", "Art", "Education", "Uncategories", "Entertainment", "Investment",
    "Weather", "Business"]
   
  const createPost = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.set('title',title)
    postData.set('category',category)
    postData.set('description',description)
    postData.set('thumbnail',thumbnail)

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URI}/posts`, postData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      if(response.status == 201){
        return navigate('/')
      }
    } catch (error) {
       setError(error.response.data.message)
    }
  }
  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className='form_error_msg'>{error}</p>}
        <form className='form create-post-form' onSubmit={createPost}>
          <input type="text" placeholder='title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {
              POST_CATEGORIES.map(categories => <option key={categories}>{categories}</option>)
            }
          </select>
          <ReactQuill modules={module} formats={formats} value={description} onChange={setDescription} />
          <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept='jpg, png, jpec' />
          <button type='submit' className='btn-categories'>Submit</button>
        </form>
      </div>
    </section>
  )
}

export default CreatePost

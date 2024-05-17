import React, { useState, useEffect, useContext } from 'react';
import './UserProfile.css';
import { Link, useNavigate,useParams } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axios from 'axios';

const UserProfile = () => {
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const {id} = useParams();
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [cnfNewPassword, setCnfNewPassword] = useState('');
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URI}/users/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        })
        const {name,email,avatar} = response.data;
        setAvatar(avatar);
        setName(name);
        setEmail(email);
        
      } catch (error) {
         console.log(error)
      }
    }
    getUser();
  }, [id])

  const changeAvatarHandler = async (e) => {
    e.preventDefault();
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set('avatar', avatar);
      
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URI}/users/change-avatar`,
        postData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Assuming the response contains the updated avatar URL
      setAvatar(response?.data.avatar);
    } catch (error) {
      setError(error.message.data)
    }
  };
  
  const updateUserProfile = async (e) => {
    e.preventDefault();

    try {
      const userData = new FormData();
      userData.set('name',name);
      userData.set('email',email);
      userData.set('currpassword',currPassword);
      userData.set('newPassword',newPassword);
      userData.set('CnfPassword',cnfNewPassword);

      const response = await axios.patch(`${process.env.REACT_APP_BASE_URI}/users/edit-user`,userData,
      {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.status == 200)
      {
         navigate('/logout')
      }
      
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser.id}`} className="btn-dark">My Posts</Link>
        <div className="profile_detail">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="User Avatar" />
            </div>
            <form className="avatar_form">
              <input
                type="file"
                name="avatar"
                id="profilepic"
                onChange={e => setAvatar(e.target.files[0])}
                accept="image/jpg, image/png, image/jpeg"
              />
              <label htmlFor="profilepic" onClick={() => setIsAvatarTouched(true)}>
                <i className="fa-solid fa-pen-to-square"></i>
              </label>
            </form>
            {isAvatarTouched && (
              <button className="profile_avatar-btn" onClick={changeAvatarHandler}>
                <i className="fa-solid fa-check"></i>
              </button>
            )}
          </div>
          <h1>{currentUser.name}</h1>
          <form className="form profile_form" onSubmit={updateUserProfile}>
            {error && <p className="form_error_msg">{error}</p>}
            <input
              type="text"
              value={name}
              placeholder="Full Name"
              onChange={e => setName(e.target.value)}
            />
            <input
              type="email"
              value={email}
              placeholder="Your Email"
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              value={currPassword}
              placeholder="Your Current Password"
              onChange={e => setCurrPassword(e.target.value)}
            />
            <input
              type="password"
              value={newPassword}
              placeholder="New Password"
              onChange={e => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              value={cnfNewPassword}
              placeholder="Confirm New Password"
              onChange={e => setCnfNewPassword(e.target.value)}
            />
            <button type="submit" className="btn-categories">
              Update
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;

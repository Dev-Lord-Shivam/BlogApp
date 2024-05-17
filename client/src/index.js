import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './Components/Layout/Layout';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import Home from './Pages/Home/Home'
import PostDetails from './Pages/PostDetails/PostDetails';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import CreatePost from './Pages/CreatePost/CreatePost';
import UserProfile from './Pages/UserProfile/UserProfile';
import Author from './Pages/Author/Author';
import EditPost from './Pages/EditPost/EditPost';
import Logout from './Pages/Logout/Logout';
import AuthorPost from './Pages/AuthorPost/AuthorPost';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';
import CategoryPost from './Pages/CategoryPost/CategoryPost';
import UserProvider from './context/userContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserProvider><Layout /></UserProvider>,
    errorElement: <ErrorPage />,
    children: [
        {index: true, element: <Home />},
        {path:"posts/:id" , element: <PostDetails />},
        {path:"register" , element: <Register />},
        {path:"login" , element: <Login />},
        {path:"profile/:id" , element: <UserProfile />},
        {path:"create" , element: <CreatePost />},
        {path:"author" , element: <Author />},
        {path:"posts/:id/edit", element: <EditPost />},
        {path:"posts/categories/:category", element: <CategoryPost />},
        {path:"posts/Users/:id", element: <AuthorPost />},
        {path:"myposts/:id", element: <Dashboard />},
        {path:"logout", element: <Logout />},
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);


const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')
const HttpError = require('../models/errorModel')


//==================================== CREATE A NEW POST ==========================================
//POST : api/posts
//UNPROTECTED

const createPost = async (req, res, next) => {
    try {

        let { title, category, description } = req.body;
        if (!title || !category || !req.files) {
            return next(new HttpError("Fill in all Filed", 422))
        }
        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail Size is too big it should be less then 2mb"))
        }
        let filename = thumbnail.name;
        let splittedFileName = filename.split('.')
        let newFileName = splittedFileName[0] + uuid() + "." + splittedFileName[splittedFileName.length - 1]
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFileName), async (err) => {
            if (err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({
                    title, category, description, thumbnail: newFileName,
                    creator: req.user.id
                })
                if (!newPost) {
                    return next(new HttpError("Post could'nt be created", 422))
                }

                const currentUser = await User.findById(req.user.id)
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
                res.status(201).json(newPost)
            }
        })
    }
    catch (err) {
        return next(new HttpError(err))
    }
}

//==================================== GET ALL POSTS ==========================================
//GET : api/posts
//UNPROTECTED

const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 })
        res.status(200).json(posts)
    }
    catch (err) {
        return next(new HttpError(err))
    }
}

//==================================== GET SINGLE POST =======================================
//GET : api/posts/:id
//UNPROTECTED

const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const UserPost = await Post.findById(postId)
        res.status(200).json(UserPost)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//==================================== GET POSTS BY CATEGORY =================================
//GET : api/posts/categories/:category
//UNPROTECTED

const getPostsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const UserPost = await Post.find({ category }).sort({ createdAt: -1 })
        res.status(200).json(UserPost)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//==================================== GET POSTS BY AUTHOR =====================================
//GET : api/posts/users/:id
//UNPROTECTED

const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params
        const PostList = await Post.find({ creator: id }).sort({ createdAt: -1 })
        res.status(200).json(PostList)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//==================================== EDIT POST ==============================================
//PATCH : api/posts/:id
//PROTECTED

const editPost = async (req, res, next) => {
    try {
        let fileName, newFileName, updatedPost;
        const postid = req.params.id
        let { title, category, description } = req.body;
        const oldPost = await Post.findById(postid)
        if (req.user.id == oldPost.creator) {
            if (!title || !category || description.length < 12) {
                return next(new HttpError("Fill in all Filed", 422))
            }
            if (!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postid, { title, category, description }, { new: true })
            }
            else {
                const oldPost = await Post.findById(postid);
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                    if (err) {
                        return next(new HttpError(err))
                    }
                })
                // Upload New Thumbnail
                const { thumbnail } = req.files;
                if (thumbnail.size > 2000000) {
                    return next(new HttpError("Thumbnail Size too big. should be less then 2mn"))
                }
                fileName = thumbnail.name;
                let splittedFileName = fileName.split('.')
                newFileName = splittedFileName[0] + uuid() + "." + splittedFileName[splittedFileName.length - 1];
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
                    if (err) {
                        return next(new HttpError(err))
                    }
                })

                updatedPost = await Post.findByIdAndUpdate(postid, { title, category, description, thumbnail: newFileName }, { new: true })
            }
            if (!updatedPost) {
                return next(new HttpError("Failed To Update"))
            }

            res.status(200).json(updatedPost)
        }
        else {
            return next(new HttpError("Failed To Edit the post"))
        }
    } catch (error) {
        return next(new HttpError(error))
    }
}

//==================================== DELETE POST =============================================
//DELETE : api/posts/:id
//PROTECTED

const deletePost = async (req, res, next) => {

    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError("Post Unavaulable", 400))
        }
        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;
        if (req.user.id == post.creator) {
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {

                if (err) {
                    return next(new HttpError(err))
                } else {
                    await Post.findByIdAndDelete(postId);
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
                    res.json(`Post ${postId} deleted successfully.`)
                }
            })
        }
        else {
            return next(new HttpError("Post cant be deleted"))
        }

    } catch (error) {
        return next(new HttpError(error))
    }

}


module.exports = { createPost, getPost, getPosts, getPostsByCategory, getUserPosts, editPost, deletePost }
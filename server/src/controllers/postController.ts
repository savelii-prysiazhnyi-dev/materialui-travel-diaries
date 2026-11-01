import type { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";

interface PostBody {
  title?: string;
  description?: string;
  image?: string;
  location?: string;
  date?: string;
  user?: string;
}

export const getAllPosts = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const posts = await Post.find().populate("user", "name email").sort({ date: -1 });
    return res.status(200).json({ posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Post Error] Fetch posts failed:", error);
    return res.status(500).json({ message: "Failed to fetch posts.", error: message });
  }
};

export const getPostById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }

  try {
    const post = await Post.findById(id).populate("user", "name email");
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    return res.status(200).json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Post Error] Fetch post failed:", error);
    return res.status(500).json({ message: "Failed to fetch post.", error: message });
  }
};

export const addPost = async (
  req: Request<Record<string, never>, unknown, PostBody>,
  res: Response
): Promise<Response> => {
  const { title, description, image, location, date, user } = req.body;

  if (!title || !description || !image || !location || !user) {
    return res.status(422).json({
      message: "Title, description, image, location, and user ID are required."
    });
  }

  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ message: "Author user not found." });
    }

    const post = new Post({
      title,
      description,
      image,
      location,
      date: date ? new Date(date) : new Date(),
      user: new mongoose.Types.ObjectId(user)
    });

    const savedPost = await post.save();
    existingUser.posts.push(savedPost._id);
    await existingUser.save();

    return res.status(201).json({
      message: "Travel diary post created successfully.",
      post: savedPost
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Post Error] Create post failed:", error);
    return res.status(500).json({ message: "Failed to create post.", error: message });
  }
};

export const updatePost = async (
  req: Request<{ id: string }, unknown, PostBody>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { title, description, image, location, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (title !== undefined) post.title = title;
    if (description !== undefined) post.description = description;
    if (image !== undefined) post.image = image;
    if (location !== undefined) post.location = location;
    if (date !== undefined) post.date = new Date(date);

    const updatedPost = await post.save();

    return res.status(200).json({
      message: "Post updated successfully.",
      post: updatedPost
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Post Error] Update post failed:", error);
    return res.status(500).json({ message: "Failed to update post.", error: message });
  }
};

export const deletePost = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid post ID format." });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    await User.findByIdAndUpdate(post.user, {
      $pull: { posts: post._id }
    });

    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Post successfully deleted."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Post Error] Delete post failed:", error);
    return res.status(500).json({ message: "Failed to delete post.", error: message });
  }
};

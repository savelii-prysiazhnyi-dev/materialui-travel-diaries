import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

interface SignupBody {
  name?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

export const signup = async (
  req: Request<Record<string, never>, unknown, SignupBody>,
  res: Response
): Promise<Response> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ message: "Name, email, and password are required." });
  }

  if (password.length < 6) {
    return res.status(422).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email address." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      posts: []
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Auth Error] Registration failed:", error);
    return res.status(500).json({ message: "Failed to register user.", error: message });
  }
};

export const login = async (
  req: Request<Record<string, never>, unknown, LoginBody>,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "Email and password are required." });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      return res.status(404).json({ message: "No user found with this email." });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials. Incorrect password." });
    }

    return res.status(200).json({
      message: "Login successful.",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Auth Error] Login failed:", error);
    return res.status(500).json({ message: "Failed to authenticate.", error: message });
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const user = await User.findById(id, "-password").populate("posts");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[User Error] Fetch user failed:", error);
    return res.status(500).json({ message: "Failed to fetch user.", error: message });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find({}, "-password");
    return res.status(200).json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[User Error] Fetch all users failed:", error);
    return res.status(500).json({ message: "Failed to fetch users.", error: message });
  }
};

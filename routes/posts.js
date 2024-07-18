import express from "express";
import { getFeedPosts, getUserPosts, likePost, getPopularPosts, deletePost,patchPost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/popular", verifyToken, getPopularPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.delete("/delete/:userId/:postId", verifyToken, deletePost);
router.patch("/patch/:userId/:postId", verifyToken, patchPost);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;

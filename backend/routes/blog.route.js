import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addCommenttoBlog, addNewBlog, bookmarkBlog, deleteBlog, dislikeBlog, getAllBlog, getCommentsOfBlog, getUserBlog, likeBlog } from "../controllers/blog.controller.js";


const router = express.Router();

router
  .route("/addblog")
  .post(isAuthenticated, upload.single("image"), addNewBlog);
router.route("/all").get(isAuthenticated, getAllBlog);
router.route("/userblog/all").get(isAuthenticated, getUserBlog);
router.route("/:id/like").post(isAuthenticated, likeBlog);
router.route("/:id/dislike").post(isAuthenticated, dislikeBlog);
router.route("/:id/comment").post(isAuthenticated, addCommenttoBlog);
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfBlog);
router.route("/delete/:id").delete(isAuthenticated, deleteBlog);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkBlog);

export default router;

import express from 'express';   
import { getCurrentUser } from '../controllers/userController.js';

const userRouter = express.Router();   

// `currentuser` returns `{user: null}` when no valid session, to avoid 400/401 loop from the frontend
userRouter.get("/currentuser", getCurrentUser);

export default userRouter;
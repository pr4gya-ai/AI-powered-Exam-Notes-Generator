import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { pdfDownload } from '../controllers/pdf.Controller.js';

const pdfRouter = express.Router();   

pdfRouter.post("/download-pdf", isAuth, pdfDownload);

export default pdfRouter;
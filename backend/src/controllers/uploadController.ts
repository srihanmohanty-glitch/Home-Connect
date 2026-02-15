import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';
import PdfDocument from '../models/PdfDocument';
import User from '../models/User';

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pdfs'); // Files will be saved in the 'uploads/pdfs' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// @desc    Upload PDF document
// @route   POST /api/upload/pdf
// @access  Private/Admin
const uploadPdf = asyncHandler(async (req: Request, res: Response) => {
  upload.single('pdf')(req, res, async (err) => {
    if (err) {
      res.status(400);
      throw new Error(err.message);
    }

    if (!req.file) {
      res.status(400);
      throw new Error('No PDF file uploaded');
    }

    const { title } = req.body;
    const user = (req as any).user; // User from protect middleware

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    const pdfDocument = await PdfDocument.create({
      title: title || req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: user._id,
    });

    res.status(201).json({
      message: 'PDF uploaded successfully',
      pdf: pdfDocument,
    });
  });
});

// @desc    Get all PDF documents
// @route   GET /api/upload/pdf
// @access  Private
const getPdfs = asyncHandler(async (req: Request, res: Response) => {
  const pdfs = await PdfDocument.find({}).populate('uploadedBy', 'username');
  res.json(pdfs);
});

export { uploadPdf, getPdfs };
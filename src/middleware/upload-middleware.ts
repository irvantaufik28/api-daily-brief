import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// File filter middleware untuk validasi tipe file
export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only doc, docx, pdf, jpeg, jpg, png files are allowed'));
  }
};

// Middleware multer upload menggunakan memoryStorage dan fileFilter
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter,
});

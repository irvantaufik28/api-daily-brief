"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = exports.fileFilter = void 0;
const multer_1 = __importDefault(require("multer"));
// File filter middleware untuk validasi tipe file
const fileFilter = (req, file, cb) => {
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
    }
    else {
        cb(new Error('Only doc, docx, pdf, jpeg, jpg, png files are allowed'));
    }
};
exports.fileFilter = fileFilter;
// Middleware multer upload menggunakan memoryStorage dan fileFilter
exports.uploadMiddleware = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: exports.fileFilter,
});
//# sourceMappingURL=upload-middleware.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../application/cloudinary"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UploadService {
    static uploadFile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { buffer, mimetype, originalname, alt } = params;
            // Upload ke Cloudinary pakai stream dengan throw error jika gagal
            const uploadToCloudinary = () => new Promise((resolve, reject) => {
                const stream = cloudinary_1.default.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        reject(new Error(`Cloudinary upload failed: ${error.message || error}`));
                    }
                    else {
                        resolve(result);
                    }
                });
                stream.end(buffer);
            });
            let result;
            try {
                result = yield uploadToCloudinary();
            }
            catch (error) {
                // Throw lagi supaya caller bisa catch error ini
                throw error;
            }
            // Tentukan tipe file sederhana
            let refType = 'other';
            if (mimetype.includes('pdf'))
                refType = 'pdf';
            else if (mimetype === 'application/msword' ||
                mimetype ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                refType = 'doc';
            else if (mimetype === 'image/jpeg' ||
                mimetype === 'image/jpg' ||
                mimetype === 'image/png')
                refType = 'image';
            // Simpan ke DB
            const upload = yield prisma.media.create({
                data: {
                    refType,
                    alt: alt || null,
                    filename: originalname,
                    url: result.secure_url,
                },
            });
            return upload;
        });
    }
}
exports.default = UploadService;
//# sourceMappingURL=UploadService.js.map
import cloudinary from '../application/cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UploadFileParams {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  alt?: string | null;
}
class UploadService {
  static async uploadFile(params: UploadFileParams) {
    const { buffer, mimetype, originalname, alt } = params;

    // Upload ke Cloudinary pakai stream dengan throw error jika gagal
    const uploadToCloudinary = () =>
      new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              reject(new Error(`Cloudinary upload failed: ${error.message || error}`));
            } else {
              resolve(result);
            }
          }
        );
        stream.end(buffer);
      });

    let result;
    try {
      result = await uploadToCloudinary();
    } catch (error) {
      // Throw lagi supaya caller bisa catch error ini
      throw error;
    }

    // Tentukan tipe file sederhana
    let refType = 'other';
    if (mimetype.includes('pdf')) refType = 'pdf';
    else if (
      mimetype === 'application/msword' ||
      mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      refType = 'doc';
    else if (
      mimetype === 'image/jpeg' ||
      mimetype === 'image/jpg' ||
      mimetype === 'image/png'
    )
      refType = 'image';

    // Simpan ke DB
    const upload = await prisma.media.create({
      data: {
        refType,
        alt: alt || null,
        filename: originalname,
        url: result.secure_url,
      },
    });

    return upload;
  }
}

export default UploadService;
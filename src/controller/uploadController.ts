import { NextFunction, Request, Response } from 'express';
import UploadService from '../service/UploadService';

const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }

        const alt = req.body.alt || null;

        const upload = await UploadService.uploadFile({
            buffer: req.file.buffer,
            mimetype: req.file.mimetype,
            originalname: req.file.originalname,
            alt,
        });

        const result = ({
            id: upload.id,
            url: upload.url,
            type: upload.refType,
            refId: upload.refId,
            filename: upload.filename,
            alt: upload.alt,
        });


        return res.status(200).json({
            message: "success",
            data: result
        });
    } catch (error: any) {
        next(error);
    }
}

export default {
    uploadFile
}

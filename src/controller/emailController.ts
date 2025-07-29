import { Request, Response, NextFunction, response } from 'express';
import PersonService from '../service/PersonService';
import { EmailService } from '../service/EmailService';




const sendEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const result = await EmailService.sendEmail(req.body);

        return res.status(200).json({
            message: `Email queued (${process.env.NODE_ENV === "production" ? "Gmail" : "Mailtrap"})`,
            to: result.to
        });
    } catch (error) {
        next(error);
    }
};

export default {
    sendEmail
};
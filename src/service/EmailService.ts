import { emailQueue } from "../queue/emailQueue";
import { prismaClient } from "../application/database";
import { ResponseError } from '../error/response-error';

export class EmailService {
    static async sendEmail(request: any): Promise<{ to: string }> {
        const data = await prismaClient.reportProject.findUnique({
            where: { id: parseInt(request.id) },
            include: {
                project: { include: { company: true } },
                person: true,
                ReportDetail: true,
            },
        });

        if (!data) {
            throw new ResponseError(404, "Report not found");
        }

        const { subject } = request;

        const company = data.project.company;

        const to =
            company.email ||
            company.altEmail1 ||
            company.altEmail2 ||
            company.altEmail3;

        if (!to) {
            throw new ResponseError(404, "Tidak ada email yang tersedia untuk perusahaan.");
        }

        await emailQueue.add("sendEmail", {
            to,
            subject: subject ?? "example subject",
            reports: {
                fullName: data.person.fullName,
                email: data.person.email,
                phone: data.person.phoneNumber,
                reportDetailId: data.id,
                reportDate: data.reportDate
                    ? new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }).format(new Date(data.reportDate))
                    : "Tanggal tidak tersedia",

                projectOwner: data.project.company.name,
                projectDescription: data.project.title,
                items: data.ReportDetail
            }
        });

        return { to };
    }
}
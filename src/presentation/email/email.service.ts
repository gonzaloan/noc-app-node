import nodemailer from 'nodemailer';
import {envs} from "../../config/plugins/envs.plugin";
import {LogEntity, LogSeverityLevel} from "../../domain/entities/log.entity";

interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments: Attachment[];
}

interface Attachment {
    filename: string;
    path: string;
}

export class EmailService {
    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    });

    constructor() {
    }
    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const {to, subject, htmlBody, attachments = []} = options;

        try {
            await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachments
            });
            const log = new LogEntity(
                {
                    message: `Email sent to ${to}`,
                    level: LogSeverityLevel.low,
                    origin: 'EmailService',
                }
            );

            return true;
        } catch (error) {
            const log = new LogEntity(
                {
                    message: `Email not sent to ${to}`,
                    level: LogSeverityLevel.high,
                    origin: 'EmailService',
                }
            );
            return false;
        }
    }

    async sendEmailWithFileSystemLogs(to: string | string[]): Promise<boolean> {
        const subject = 'Server Logs';
        const htmlBody = '<h1>Server Logs</h1>';
        const attachments: Attachment[] = [
            {filename: 'logs-high.log', path: './logs/logs-high.log'},
            {filename: 'logs-low.log', path: './logs/logs-low.log'},
            {filename: 'logs-medium.log', path: './logs/logs-medium.log'}
        ]

        return this.sendEmail({to, subject, htmlBody, attachments});
    }
}
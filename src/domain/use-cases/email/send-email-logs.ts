import {EmailService} from "../../../presentation/email/email.service";
import {LogRepository} from "../../repository/log.repository";
import {LogEntity, LogSeverityLevel} from "../../entities/log.entity";

interface SendEmailLogsUseCase{
    execute: (to: string | string[]) => Promise<boolean>
}

export class SendEmailLogs implements SendEmailLogsUseCase {
    constructor(
        private readonly emailService: EmailService,
        private readonly logRepository: LogRepository
    ) {
    }

    async execute(to: string | string[]): Promise<boolean> {
        try {
            const sent = await this.emailService.sendEmailWithFileSystemLogs(to);
            if (!sent) {
                new Error('Email log was not sent');
            }

            const log = new LogEntity({
                message: `Email logs sent to ${to}`,
                level: LogSeverityLevel.low,
                origin: 'SendEmailLogsUseCase'
            });
            this.logRepository.saveLog(log);
            return true;
        } catch (error) {
            const log = new LogEntity({
                message: `Error on send email logs ${error}`,
                level: LogSeverityLevel.high,
                origin: 'SendEmailLogsUseCase'
            });
            this.logRepository.saveLog(log);
            return false;
        }
    }
}
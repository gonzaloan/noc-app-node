import {LogRepositoryImpl} from "../infrastructure/repository/log.repository.impl";
import {FileSystemDatasource} from "../infrastructure/datasources/file-system.datasource";
import {CronService} from "./cron/cron-service";
import {MongoLogDatasource} from "../infrastructure/datasources/mongo-log.datasource";
import {PostgresLogDatasource} from "../infrastructure/datasources/postgres-log.datasource";
import {CheckServiceMultiple} from "../domain/use-cases/checks/check-service-multiple";

const fsLogRepository =
    new LogRepositoryImpl(
        new FileSystemDatasource()
    );
const postgresLogRepository =
    new LogRepositoryImpl(
        new PostgresLogDatasource()
    );
const mongoLogRepository =
    new LogRepositoryImpl(
        new MongoLogDatasource()
    );

export class Server {
    static start() {
        console.log('Server started');
        const url = 'https://www.github.com';
        CronService.createJob('*/5 * * * * *',
            () => {
                const url = 'https://www.google.com';
                new CheckServiceMultiple(
                    [fsLogRepository, postgresLogRepository, mongoLogRepository],
                    () => console.log(`${url} Service is Ok`),
                    (error) => console.log(error)
                ).execute(url);
            });
    }
}

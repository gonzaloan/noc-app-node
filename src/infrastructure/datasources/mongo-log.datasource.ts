import {LogDatasource} from "../../domain/datasources/log.datasource";
import {LogEntity, LogSeverityLevel} from "../../domain/entities/log.entity";
import {LogModel} from "../../data/mongo/models/log.model";

export class MongoLogDatasource implements LogDatasource {

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        const logs = await LogModel.find({
            level: severityLevel
        });
        return logs.map(LogEntity.fromObject);
    }

    async saveLog(log: LogEntity): Promise<void> {
        const newLog = await LogModel.create(log);
        console.log('Mongo Log Created: ', newLog.id);
    }
}
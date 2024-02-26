import {LogRepository} from "../../repository/log.repository";
import {LogEntity, LogSeverityLevel} from "../../entities/log.entity";

interface CheckServiceMultipleUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase{

    constructor(
        private readonly logRepository: LogRepository[],
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
    ){

    }

    private callLogs(log: LogEntity) {
        this.logRepository.forEach(async (logRepository) => {
            await logRepository.saveLog(log);
        });
    }
    async execute(url: string): Promise<boolean> {
        try{
            const req = await fetch(url);
            if (!req.ok) {
                new Error(`Error on check service ${url}`);
            }
            this.callLogs(new LogEntity({ message: `Service ${url} is working fine`,
                level: LogSeverityLevel.low,
                origin: 'CheckService'
            }));
            this.successCallback();
            return true;
        }catch (error){
            this.callLogs(new LogEntity({message: `${url} is not Ok. ${error} `,
                level: LogSeverityLevel.high,
                origin: 'CheckService'}));
            this.errorCallback(`${error}`);
            return false;
        }
    }
}


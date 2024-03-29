import {LogRepository} from "../../repository/log.repository";
import {LogEntity, LogSeverityLevel} from "../../entities/log.entity";

interface CheckServiceUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase{

    constructor(
        private readonly logRepository: LogRepository,
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback
    ){

    }
    async execute(url: string): Promise<boolean> {
        try{
            const req = await fetch(url);
            if (!req.ok) {
                new Error(`Error on check service ${url}`);
            }
            await this.logRepository.saveLog(
                new LogEntity({ message: `Service ${url} is working fine`,
                    level: LogSeverityLevel.low,
                    origin: 'CheckService'
                }));
            this.successCallback();
            return true;
        }catch (error){
            await this.logRepository.saveLog(
                new LogEntity({message: `${url} is not Ok. ${error} `,
                    level: LogSeverityLevel.high,
                    origin: 'CheckService'}));
            this.errorCallback(`${error}`);
            return false;
        }
    }
}


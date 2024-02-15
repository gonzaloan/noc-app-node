import {CronService} from "./cron/cron-service";
import {CheckService} from "../domain/use-cases/checks/check-service";

export class Server {
    static start() {
        console.log('Server started');

        CronService.createJob('*/5 * * * * *',
            () => {
                //new CheckService().execute('http://localhost:3001')
                const url = 'https://www.google.com';
                new CheckService(
                    () => console.log(`${url} Service is Ok`),
                    (error) => console.log(error)
                ).execute(url);
            });
    }
}

import { Logger, createLogger, transports } from 'winston';
import { Provider } from 'nconf';

export class MainController {

    private logger: Logger;

    public startProgram(winstonLogger: Logger, conf: Provider, args: string[]) {
        this.logger = winstonLogger;
        this.logger.info('Starting program.');
    }

}

import { Logger, createLogger, transports } from 'winston';
import { Provider } from 'nconf';

export class MainController {

    private logger: Logger;

    public startProgram(winstonLogger: Logger, conf: Provider) {
        this.logger = winstonLogger;
        this.logger.info('Starting program.');
    }

}

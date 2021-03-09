import { Logger, createLogger, transports } from 'winston';
import { Provider } from 'nconf';
import { ExampleGenerator } from './example.generator';

export class MainController {

    private logger: Logger;

    public startProgram(winstonLogger: Logger, conf: Provider, args: string[]) {
        this.logger = winstonLogger;
        this.logger.info('Starting program.');

        if (<boolean>conf.get('generateExamples')) {
            let exampleGenerator: ExampleGenerator = new ExampleGenerator();
            exampleGenerator.generateExamples(winstonLogger, <string>conf.get('intervalChecksFolder'));
        }
    }

}

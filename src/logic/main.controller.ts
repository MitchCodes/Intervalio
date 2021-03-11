import { Logger, createLogger, transports } from 'winston';
import { Provider } from 'nconf';
import { ExampleGenerator } from './example.generator';
import { readdirSync, statSync, readFileSync } from 'fs';
import * as path from 'path';
import { IntervalCheck } from '../models/interval-check';
import { IntervalFactory } from './interval-factory';
import { IntervalExecutor } from './interval-executor';

export class MainController {
    public intervals: NodeJS.Timer[] = [];
    private logger: Logger;

    public startProgram(winstonLogger: Logger, conf: Provider, args: string[]) {
        this.logger = winstonLogger;
        this.logger.info('Starting program.');

        let intervalChecksFolder: string = <string>conf.get('intervalChecksFolder');

        if (<boolean>conf.get('generateExamples') || args.indexOf('--generateExamples') !== -1) {
            let exampleGenerator: ExampleGenerator = new ExampleGenerator();
            exampleGenerator.generateExamples(winstonLogger, intervalChecksFolder);
            return;
        }

        let intervalChecks: IntervalCheck[] = this.getIntervalChecksFromFolder(winstonLogger, conf, intervalChecksFolder);
        this.setupIntervals(intervalChecks, winstonLogger, conf);
    }

    private setupIntervals(intervalChecks: IntervalCheck[], winstonLogger: Logger, conf: Provider) {
        this.intervals = [];
        let intervalExecutor: IntervalExecutor = new IntervalExecutor();
        for (let intervalCheck of intervalChecks) {
            if (intervalCheck.intervalFirstDelay > 0) {
                setTimeout(() => {
                    let interval = setInterval(() => {
                        intervalExecutor.executeInterval(intervalCheck);
                    }, intervalCheck.intervalSeconds * 1000);
        
                    this.intervals.push(interval);
                }, intervalCheck.intervalFirstDelay * 1000);                
            } else {
                let interval = setInterval(() => {
                    intervalExecutor.executeInterval(intervalCheck);
                }, intervalCheck.intervalSeconds * 1000);
    
                this.intervals.push(interval);
            }
        }
    }

    private getIntervalChecksFromFolder(winstonLogger: Logger, conf: Provider, intervalChecksFolder: string): IntervalCheck[] {
        let allIntervalCheckFiles: string[] = this.getFilesRecursive(intervalChecksFolder);
        this.logger.debug('Found ' + allIntervalCheckFiles.length + ' interval check(s).');

        let intervalCheckFactory: IntervalFactory = new IntervalFactory();
        
        let intervalChecks: IntervalCheck[] = [];
        for (let intervalFile of allIntervalCheckFiles) {
            let intervalJson: string = readFileSync(intervalFile, {
                encoding: 'utf8'
            });

            if (intervalJson !== undefined && intervalJson !== null && intervalJson.length > 0) {
                let intervalCheck: IntervalCheck = intervalCheckFactory.buildIntervalCheck(intervalJson, winstonLogger);
                if (intervalCheck !== undefined && intervalCheck !== null && intervalCheck.enabled) {
                    intervalChecks.push(intervalCheck);
                }
            }
        }

        return intervalChecks;
    }

    private getFilesRecursive(directory, allFiles: string[] = null): string[] {
        if (allFiles === null) {
            allFiles = [];
        }

        readdirSync(directory).forEach(file => {
            const fullPath = path.join(directory, file);
            if (statSync(fullPath).isDirectory()) {
                return this.getFilesRecursive(fullPath, allFiles);
            }
            else {
                return allFiles.push(fullPath);
            }
        });

        return allFiles;
    }
}

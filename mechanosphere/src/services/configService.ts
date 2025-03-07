import { dataTableDisplayService } from './dataTableDisplayService'; // Ensure this matches the export

class ConfigService {
    private config: { startTime: number; endTime: number };

    constructor() {
        this.config = {
            // Define your configuration properties here
            startTime: 0,
            endTime: 100,
        };
    }

    public updateConfig(newConfig: { startTime: number; endTime: number }) {
        this.config = newConfig;
    }

    public getConfig() {
        return this.config;
    }
}

export const configService = new ConfigService(); 
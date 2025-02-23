// src/services/mockDataService.ts
import { tables } from "@/app/dataRequirements";
import { DataTableValues } from "@/app/types";
 
class MockDataService {
    private mockData: { [key: string]: DataTableValues } = {};

    constructor() {
        // Rote-initialize empty tables here
        Object.keys(tables).forEach((table: string) => {
            this.mockData[table] = {};
            tables[table as keyof typeof tables].columns.forEach((column: string) => {
                this.mockData[table][column] = [];
            });
        });
    }

    retrieveData = (tableName: string): Promise<DataTableValues> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.mockData[tableName]);
            }, 100); // Simulate network delay
        });
    };

    uploadData = (tableName: string, data: DataTableValues) => {
        // Update the mockData with the new data
        Object.keys(data).forEach((column: string) => {
            this.mockData[tableName][column] = data[column];
        });
        
        // Simulate uploading data to a SQL server
        console.log("Data uploaded:", data);
        return Promise.resolve();
    };

    resetData = () => {
        // Logic to reset data
        this.mockData = {}; 
    };

    // Other methods...
}

export const mockDataService = new MockDataService();
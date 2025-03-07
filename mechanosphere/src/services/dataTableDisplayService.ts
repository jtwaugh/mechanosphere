// src/services/mockDataService.ts
import { tables } from "@/app/dataRequirements";
import { DataTableValues } from "@/app/types";
 
class DataTableDisplayService {
    private displayData: { [key: string]: DataTableValues } = {};

    constructor() {
        // Rote-initialize empty tables here
        Object.keys(tables).forEach((table: string) => {
            this.displayData[table] = {};
            tables[table as keyof typeof tables].columns.forEach((column: string) => {
                this.displayData[table][column] = [];
            });
        });
    }

    retrieveData = (tableName: string): Promise<DataTableValues> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.displayData[tableName]);
            }, 100); // Simulate network delay
        });
    };

    uploadData = (tableName: string, data: DataTableValues) => {
        // Update the mockData with the new data
        Object.keys(data).forEach((column: string) => {
            this.displayData[tableName][column] = data[column];
        });
        
        // Simulate uploading data to a SQL server
        console.log("Data uploaded:", data);
        return Promise.resolve();
    };

    resetData = () => {
        // Logic to reset data
        this.displayData = {}; 
    };

    public getData() {
        return this.displayData; // Ensure this method is defined
    }

    // New method to get all tables
    public getAllTables() {
        return this.displayData; // Return all tables data
    }

    // New method to get data by table name
    public getDataByName(tableName: string) {
        return this.displayData[tableName] || null; // Return data for specific table or null if not found
    }
}

export const dataTableDisplayService = new DataTableDisplayService();
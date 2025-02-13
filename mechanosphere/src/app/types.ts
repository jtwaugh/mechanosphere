export type DataTableRequirements = {
    index: string;
    columns: string[];
}; 
export type SymbolDataRequirements = {
  [key: string]: {
    requiredTables: {
      [tableName: string]: DataTableRequirements; // Use the imported type
    };
  };
};

export  type GlobalDataRequirements = {
  [tableName: string]: DataTableRequirements
};

// Define the type for shopFloorSetups
export type ShopFloorSetup = {
  name: string;
  nodes: { id: string; position: { x: number; y: number }; data: { label: string }; type: string }[];
  edges: { id: string; source: string; target: string }[];
};

export type ShopFloorSetups = {
  [key: string]: ShopFloorSetup; // Index signature
};

'use client'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import EntityMap from './EntityMap'; 
import { 
  machineEnvOptions, 
  constraintsOptions, 
  objectiveOptions, 
  globalDataRequirements, 
  machineEnvDataRequirements,
  constraintsDataRequirements,
  objectiveFunctionRequirements,
  tables
} from './dataRequirements'; // Import the new data
import { configService } from "@/services/configService";
import { FormulaProvider, useFormula } from "@/app/context/FormulaContext";
import { DataTableRequirements, DataTableValues } from "./types";

const DisplayedDataTable: React.FC<{ displayedData: DataTableValues, dataRequirements: DataTableRequirements }> = ({ displayedData, dataRequirements }) => {
  console.log(displayedData);
  return (
    <div className="grid" style={{ overflowX: 'auto', gridTemplateColumns: `repeat(${Object.keys(displayedData).length}, minmax(0, 1fr))` }}>
      {[dataRequirements.index].concat(dataRequirements.columns).map((column) => (
        <div key={column} className="grid grid-cols-1">
          {displayedData[column] && displayedData[column].map((value, rowIndex) => (
            <div key={rowIndex} className="border border-bg p-2">{value}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

type RequiredTableViewProps = {
  title: string;
  dataRequirements: DataTableRequirements;
  displayedData: DataTableValues;
  onGenerateDummyData: () => void;
};

export const RequiredTableView: React.FC<RequiredTableViewProps> = ({ title, dataRequirements, displayedData, onGenerateDummyData }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={title}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded mb-4" onClick={() => onGenerateDummyData()}>Generate Dummy Data</button>
          </div>
          <div key={title}>
            <div className="grid" style={{ overflowX: 'auto', gridTemplateColumns: `repeat(${1 + dataRequirements.columns.length}, minmax(0, 1fr))` }}>
              <div key={dataRequirements.index} className="font-bold border border-bg p-2">{dataRequirements.index}</div>
              {dataRequirements.columns.map((value, column) => (
                <div key={column} className="border border-bg p-2">{value}</div>
              ))}
            </div>
            <DisplayedDataTable displayedData={displayedData} dataRequirements={dataRequirements} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

type DataRequirementsSectionProps = {
  requiredTables: {
      [key: string]: DataTableRequirements;
  }
  displayedTables: {
      [key: string]: DataTableValues;
  }
};

const DataRequirementsSection: React.FC<DataRequirementsSectionProps> = ({ requiredTables, displayedTables }) => {
  return (
      <div className="p-2" style={{ width: '100%', position: 'relative', overflow: 'auto' }}>
          {
          Object.entries(requiredTables).map(([tableName, table]) => (
              <RequiredTableView 
                key={tableName}
                title={tableName}
                dataRequirements={requiredTables[tableName]}
                displayedData={displayedTables[tableName]}
                onGenerateDummyData={() => {}}
              />
          ))}
      </div>
  );
}

const Home = () => {
  const [displayedConfig, setDisplayedConfig] = useState(configService.getConfig());
  const { selectedMachineEnv, setSelectedMachineEnv, selectedConstraints, setSelectedConstraints, selectedObjective, setSelectedObjective } = useFormula();
  const previousConfigRef = useRef(configService.getConfig());
  const isConfigChanged = useRef(false);
  const [machineNodes, setMachineNodes] = useState<any[]>([]);
  const [machineEdges, setMachineEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState<{ [key: string]: DataTableValues }>({});

  const toggleConstraint = (constraint: { symbol: string, name: string, key: string }) => {
    console.log(`Attempting to toggle constraint: ${constraint.symbol}`);
    if (selectedConstraints.includes(constraint)) {
      console.log(`Constraint ${constraint.symbol} is already selected, removing it.`);
      setSelectedConstraints(selectedConstraints.filter(s => s !== constraint));
    } else {
      console.log(`Constraint ${constraint.symbol} is not selected, adding it.`);
      setSelectedConstraints([...selectedConstraints, constraint]);
    }
  };
  
  useEffect(() => {
    if (isConfigChanged.current) {
      isConfigChanged.current = false;
      setTimeout(() => {
        const confirmUpdate = window.confirm("Do you want to update the configuration?");
        if (confirmUpdate) {
          configService.updateConfig(displayedConfig);
          previousConfigRef.current = displayedConfig;
        } else {
          setDisplayedConfig(previousConfigRef.current);
        }
      }, 0);
    }
  }, [displayedConfig]);

  useEffect(() => {
    const [nodes, edges] = getMachinesForEnvironment(allData['Machines']); // Adjust this function to return nodes and edges
    setMachineNodes(nodes);
    setMachineEdges(edges);
    console.log(machineEnvDataRequirements[selectedMachineEnv.key as keyof typeof machineEnvDataRequirements]);
  }, [selectedMachineEnv, allData]); // Dependency array to refetch when selectedMachineEnv changes

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/dataTableDisplay'); // Call the API endpoint directly
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Parse the JSON data
        setAllData(data); // Store the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="gap-4">
        <h1 className="text-2xl font-bold text-center mb-8">Production Planning Formula Builder</h1>
        <div className="flex gap-4 justify-center">
          <div className="flex border border-bg rounded-md p-2">
            <div className="border-r border-black pr-2 mr-2">
              <Dropdown 
                name="Machine Environment"
                symbolWidth={40}
                selected={selectedMachineEnv.symbol} 
                options={machineEnvOptions} 
                onSelect={(option) => setSelectedMachineEnv(option)}
              />
            </div>
            <div className="border-r border-black pr-2 mr-2">
              <MultiSelectDropdown 
                name="Constraints"
                symbolWidth={50}
                selected={selectedConstraints.length > 0 ? selectedConstraints.map(constraint => constraint.symbol) : ['\\beta']} 
                options={constraintsOptions} 
                onSelect={(option) => toggleConstraint(option)}
              />
            </div>
            <div>
              <Dropdown 
                name="Objective"
                symbolWidth={80}
                selected={selectedObjective.symbol} 
                options={objectiveOptions} 
                onSelect={(option) => setSelectedObjective(option)}
              />  
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start" style={{ width: '100%', height: '100%' }}>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="views">
            <AccordionTrigger>Views</AccordionTrigger>
            <AccordionContent>
              <AccordionItem value="machine-topology" className="p-2">
                <AccordionTrigger>Machine Topology</AccordionTrigger>
                <AccordionContent>
                  <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                    <ReactFlow 
                      nodes={machineNodes}
                      edges={machineEdges}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <MiniMap />
                      <Controls />
                    </ReactFlow>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="entity-to-table-map" className="p-2">
                <AccordionTrigger>Entity-Table Map</AccordionTrigger>
                <AccordionContent>
                  <EntityMap 
                    requiredTables={{
                      ...globalDataRequirements,
                      ...machineEnvDataRequirements[selectedMachineEnv.key as keyof typeof machineEnvDataRequirements]?.requiredTables || {},
                      ...selectedConstraints.reduce((acc, constraint) => {
                        const constraintRequiredTables = constraintsDataRequirements[constraint.key as keyof typeof constraintsDataRequirements]?.requiredTables || {};
                        return { ...acc, ...constraintRequiredTables };
                      }, {}),
                      ...objectiveFunctionRequirements[selectedObjective.key as keyof typeof objectiveFunctionRequirements]?.requiredTables || {}
                    }} 
                    selectedSymbol={selectedMachineEnv.symbol} 
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="partial-order" className="p-2">
                <AccordionTrigger>Partial Order</AccordionTrigger>
                <AccordionContent>
                  <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                    <ReactFlow 
                      nodes={getAllRequiredTables(selectedMachineEnv, selectedConstraints, selectedObjective).map(tableName => ({
                        id: tableName,
                        data: { label: tableName },
                        position: { x: Math.random() * 1000, y: Math.random() * 1000 }, // Random positions for demo
                      }))}
                      edges={Object.entries(generatePartialOrder()).flatMap(([table, deps]) => 
                        deps.map(dep => ({
                          id: `${dep.table}-${table}`,
                          source: dep.table,
                          target: table,
                          endArrowHead: true,
                        }))
                      )}
                      nodesDraggable={true}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <MiniMap />
                      <Controls />
                    </ReactFlow>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="topological-sort" className="p-2">
                <AccordionTrigger>Table-Entity Order</AccordionTrigger>
                <AccordionContent>
                  <div key="table-entity-order" className="flex flex-col">
                    {topologicalSort(
                      getAllRequiredTables(selectedMachineEnv, selectedConstraints, selectedObjective)
                    ).reverse().map(tableName => (
                      <div key={tableName} className="flex justify-between p-2 border-b">
                        <span>{tableName}</span>
                        <span>
                          {getGeneratedEntities(tableName).join(', ') || 'None'}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="config">
            <AccordionTrigger>Configuration</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col">
                <div className="flex justify-between p-2 border-b">
                  <span>Start Time</span>
                  <input 
                    type="number" 
                    value={displayedConfig.startTime} 
                    onChange={(e) => {
                      previousConfigRef.current = displayedConfig; // Store previous config before changing
                      setDisplayedConfig({ ...displayedConfig, startTime: parseInt(e.target.value, 10) });
                      isConfigChanged.current = true; // Mark config as changed
                    }}
                    className="border p-1"
                  />
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span>End Time</span>
                  <input 
                    type="number" 
                    value={displayedConfig.endTime} 
                    onChange={(e) => {
                      previousConfigRef.current = displayedConfig; // Store previous config before changing
                      setDisplayedConfig({ ...displayedConfig, endTime: parseInt(e.target.value, 10) });
                      isConfigChanged.current = true; // Mark config as changed
                    }}
                    className="border p-1"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="data-requirements">
            <AccordionTrigger>Data Tables</AccordionTrigger>
            <AccordionContent>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <AccordionItem value="global-tables" className="p-2">
                  <AccordionTrigger>Business Tables</AccordionTrigger>
                  <AccordionContent>
                    <DataRequirementsSection 
                      requiredTables={globalDataRequirements}
                      displayedTables={allData}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
              <AccordionItem value="machine-env-tables" className="p-2">
                <AccordionTrigger>Machine Environment Tables</AccordionTrigger>
                <AccordionContent>
                  <DataRequirementsSection 
                    requiredTables={machineEnvDataRequirements[selectedMachineEnv.key as keyof typeof machineEnvDataRequirements]?.requiredTables || {}}
                    displayedTables={allData}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="constraints-tables" className="p-2">
                <AccordionTrigger>Constraints Tables</AccordionTrigger>
                <AccordionContent>
                  <DataRequirementsSection 
                    requiredTables={selectedConstraints.reduce((acc, constraint) => {
                      const requiredTables = constraintsDataRequirements[constraint.key as keyof typeof constraintsDataRequirements]?.requiredTables || {};
                      return { ...acc, ...requiredTables };
                    }, {})}
                    displayedTables={allData}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="objective-function-tables" className="p-2">
                <AccordionTrigger>Objective Function Tables</AccordionTrigger>
                <AccordionContent>
                  <DataRequirementsSection 
                    requiredTables={objectiveFunctionRequirements[selectedObjective.key as keyof typeof objectiveFunctionRequirements]?.requiredTables || {}}
                    displayedTables={allData}
                  />
                </AccordionContent>
              </AccordionItem>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
};

// Wrap the Home component with the FormulaProvider
const App = () => (
  <FormulaProvider>
    <Home />
  </FormulaProvider>
);

export default App;

function Dropdown({ name, symbolWidth, selected, options, onSelect }: { 
  name: string;
  symbolWidth: number;
  selected: string; 
  options: { symbol: string; name: string; key: string }[]; 
  onSelect: (option: { symbol: string; name: string; key: string }) => void; 
  mathSymbol?: string 
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="p-2">
          <BlockMath math={selected} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(option => (
          <DropdownMenuItem key={option.symbol} onClick={() => onSelect(option)}>
            <span style={{ width: `${symbolWidth}px` }} className="items-center border-r border-bg pr-4">
              <BlockMath math={option.symbol} />
            </span>
            <span className="whitespace-nowrap pl-4">{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MultiSelectDropdown({ name, symbolWidth, selected, options, onSelect }: { 
  name: string;
  symbolWidth: number;
  selected: string[];
  options: { symbol: string; name: string; key: string }[];
  onSelect: (option: { symbol: string; name: string; key: string }) => void;
  mathSymbol?: string 
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="p-2">
          <BlockMath math={selected.join(', ')} /> {/* Display selected items */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(option => (
          <DropdownMenuItem key={option.symbol} onClick={() => onSelect(option)}>
            <input 
              type="checkbox" 
              checked={selected.includes(option.symbol)} 
              onChange={() => onSelect(option)} 
              className="mr-2" 
            />
            <span style={{ width: `${symbolWidth}px` }} className="items-center border-r border-bg pr-4">
              <BlockMath math={option.symbol} />
            </span>
            <span className="whitespace-nowrap pl-4">{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getGeneratedEntities(tableName: string): string[] {
  // Logic to determine which entities can be generated from the given table
  // This is a placeholder function; implement the actual logic based on your data structure
  return []; // Return an array of entity names
}

function topologicalSort(tableNames: string[]): string[] {
  const dependencies = generatePartialOrder();

  const sorted: string[] = [];
  const visited: Record<string, boolean> = {};
  const tempMark: Record<string, boolean> = {};

  const visit = (table: string) => {
    if (tempMark[table]) throw new Error("Cyclic dependency detected");
    if (!visited[table]) {
      tempMark[table] = true;
      dependencies[table]?.forEach(dep => visit(dep.table));
      tempMark[table] = false;
      visited[table] = true;
      sorted.push(table);
    }
  };

  tableNames.forEach(tableName => visit(tableName));
  return sorted.reverse(); // Reverse to get the correct order
}

const getAllRequiredTables = (selectedMachineEnv: { key: string }, selectedConstraints: { key: string }[], selectedObjective: { key: string }): string[] => {
  const requiredTables = new Set<string>();

  // Union of all required tables
  Object.keys(globalDataRequirements).forEach(table => {
    requiredTables.add(table);
  });

  if (selectedMachineEnv.key in machineEnvDataRequirements) {
    Object.keys(machineEnvDataRequirements[selectedMachineEnv.key as keyof typeof machineEnvDataRequirements].requiredTables).forEach(table => {
      requiredTables.add(table);
    });
  }

  console.log(requiredTables);
  
  selectedConstraints.forEach(constraint => {
    if (constraint.key in constraintsDataRequirements) {
      const constraintTables = Object.keys(constraintsDataRequirements[constraint.key as keyof typeof constraintsDataRequirements].requiredTables);
      constraintTables.forEach(table => {
        requiredTables.add(table);
      });
    }
  });

  console.log(requiredTables);
  
  if (selectedObjective.key in objectiveFunctionRequirements) {
    Object.keys(objectiveFunctionRequirements[selectedObjective.key as keyof typeof objectiveFunctionRequirements].requiredTables).forEach(table => {
      requiredTables.add(table);
    });
  }

  console.log(requiredTables);

  return Array.from(requiredTables);
}

function generatePartialOrder(): Record<string, { table: string; column: string }[]> {
  const dependencies: Record<string, { table: string; column: string }[]> = {};

  // Initialize dependencies
  Object.keys(tables).forEach(tableName => {
    dependencies[tableName] = [];
  });

  // Populate dependencies based on the rule "A < B if A's index is a column in B"
  Object.keys(tables).forEach(A => {
    Object.keys(tables).forEach(B => {
      if (A !== B && tables[A].index && tables[B].columns.includes(tables[A].index)) {
        dependencies[B].push({ table: A, column: tables[A].index });
      }
    });
  });

  return dependencies;
}

type MachineNodeProps = {
  id: string;
  type: string;
  position: {
      x: number;
      y: number;
  };
  data: {
      label: any;
  };
}

type MachineEdgeProps = {
  id: string;
  source: string;
  target: string;
  type: string;
}

function getMachinesForEnvironment(machinesData: DataTableValues): [MachineNodeProps[], MachineEdgeProps[]] {
  const machines: MachineNodeProps[] = [];
  const edges: MachineEdgeProps[] = [];

  const jobSource = { id: "Job Source", type: "input", position: { x: 0, y: 0 }, data: { label: "Job Source" } };
  const jobCompleted = { id: "Job Completed", type: "output", position: { x: 300, y: 0 }, data: { label: "Job Completed" } };

  if (!machinesData || !machinesData['machine_id']) {
    return [[], []];
  }

  const length = machinesData['machine_id'].length;

  // Iterate over row number
  for (let rowNum = 0; rowNum < length; rowNum += 1) {
    const machineName = machinesData['machine_name'][rowNum];
    const machineNode = {
      id: machineName,
      type: "default",
      position: { x: 100 + rowNum * 100, y: 100 },
      data: { label: machineName } // Assuming machine has a name property
    };
    machines.push(machineNode);
    
    // Create edges for each machine to job source and job completed
    edges.push({ id: `${machineNode.id}-to-Job Source`, source: machineNode.id, target: "Job Source", type: "smoothstep" });
    edges.push({ id: `${machineNode.id}-to-Job Completed`, source: machineNode.id, target: "Job Completed", type: "smoothstep" });  
  }

  return [[jobSource, jobCompleted, ...machines], edges];
}
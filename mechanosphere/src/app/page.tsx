'use client'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { DataRequirementsSection } from "@/app/components/DataRequirementsSection";
import EntityMap from './EntityMap'; // Import the new EntityMap component
import shopFloorSetups from './shopFloorSetups';
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

export default function Home() {
  const [selectedMachineEnv, setSelectedMachineEnv] = useState<{ symbol: string, name: string, key: string }>({ symbol: '\\alpha', name: '', key: '' });
  const [selectedConstraints, setSelectedConstraints] = useState<{ symbol: string, name: string, key: string }[]>([]);
  const [selectedObjective, setSelectedObjective] = useState<{ symbol: string, name: string, key: string }>({ symbol: '\\gamma', name: '', key: '' });

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
          <AccordionItem value="data-relationships">
            <AccordionTrigger>Data Relationships</AccordionTrigger>
            <AccordionContent>
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
          <AccordionItem value="data-requirements">
            <AccordionTrigger>Data Tables</AccordionTrigger>
            <AccordionContent>
              <AccordionItem value="global-tables" className="p-2">
                <AccordionTrigger>Business Tables</AccordionTrigger>
                <AccordionContent>
                  <DataRequirementsSection 
                    requiredTables={globalDataRequirements}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="machine-env-tables" className="p-2">
                <AccordionTrigger>Machine Environment Tables</AccordionTrigger>
                <AccordionContent>
                  {Object.keys(machineEnvDataRequirements).includes(selectedMachineEnv.key) && 
                    <DataRequirementsSection 
                      requiredTables={machineEnvDataRequirements[selectedMachineEnv.key as keyof typeof machineEnvDataRequirements]?.requiredTables || {}}
                    />
                  }
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="constraints-tables" className="p-2">
                <AccordionTrigger>Constraints Tables</AccordionTrigger>
                <AccordionContent>
                  {/* Content for Constraints Tables */}
                  <DataRequirementsSection 
                    requiredTables={selectedConstraints.reduce((acc, constraint) => {
                      console.log(constraint);
                      const requiredTables = constraintsDataRequirements[constraint.key as keyof typeof constraintsDataRequirements]?.requiredTables || {};
                      return { ...acc, ...requiredTables };
                    }, {})}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="objective-function-tables" className="p-2">
                <AccordionTrigger>Objective Function Tables</AccordionTrigger>
                <AccordionContent>
                  {/* Content for Objective Function Tables */}
                  <DataRequirementsSection 
                    requiredTables={objectiveFunctionRequirements[selectedObjective.key as keyof typeof objectiveFunctionRequirements]?.requiredTables || {}}
                  />
                </AccordionContent>
              </AccordionItem>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="flow">
            <AccordionTrigger>Machine Topology</AccordionTrigger>
            <AccordionContent>
              <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                <ReactFlow nodes={selectedMachineEnv.key in shopFloorSetups ? shopFloorSetups[selectedMachineEnv.key].nodes : []} edges={selectedMachineEnv.key in shopFloorSetups ? shopFloorSetups[selectedMachineEnv.key].edges : [] } style={{ width: '100%', height: '100%' }}>
                  <MiniMap />
                  <Controls />
                </ReactFlow>
              </div>
            </AccordionContent>
            </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}

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
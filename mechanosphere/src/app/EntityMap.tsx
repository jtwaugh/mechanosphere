import React, { useEffect, useState } from 'react';
import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import { GlobalDataRequirements, SymbolDataRequirements } from './types';

function extractUniqueEntities(requiredTables: SymbolDataRequirements | GlobalDataRequirements) {
  const entities = new Set<string>();
  for (const table of Object.values(requiredTables)) {
    for (const column of table.columns) {
      entities.add(column);
    }
    entities.add(table.index);
  }
  return Array.from(entities);
}

const EntityMap = ({ requiredTables, selectedSymbol }: { requiredTables: SymbolDataRequirements | GlobalDataRequirements, selectedSymbol: string }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    // Create nodes for each table
    const newNodes = Object.keys(requiredTables).map((tableName, index) => ({
      id: tableName,
      data: { label: tableName },
      position: { x: 200 * index, y: 300 }, // Adjust position as needed
      type: 'default',
    }));

    // Extract unique entities from the required tables
    const uniqueEntities = extractUniqueEntities(requiredTables);
    // Add entities to the nodes
    newNodes.push(...uniqueEntities.map((entity, index) => ({
      id: entity,
      data: { label: entity },
      position: { x: 200 * index, y: 100 }, // Adjust position as needed
      type: 'default',
    })));

    const newEdges: { id: string; source: string; target: string; type: string; label: string; style?: { strokeWidth: number; stroke: string } }[] = [];
    
    // Create edges based on columns and index
    for (const [tableName, table] of Object.entries(requiredTables)) {
    
      newEdges.push({
        id: `${table.index}-${tableName}`,
        source: table.index,
        target: tableName,
        label: 'index',
        style: {
          strokeWidth: 1,
          stroke: '#000000',
        },
        type: 'bezier', // or any other edge type
      });
      
      // Connect columns to the table
      table.columns.forEach((column: string, columnIndex: number) => {
        newEdges.push({
          id: `${column}-${tableName}-${columnIndex}`,
          source: column,
          target: tableName,
          label: 'column',
          type: 'bezier', // or any other edge type
        });
      });
    }

    console.log(newNodes);
      
    setNodes(newNodes as any);
    setEdges(newEdges as any);
  }, [requiredTables, selectedSymbol]);

  return (
    <ReactFlow nodes={nodes} edges={edges} style={{ width: '100%', height: '400px' }} nodesDraggable={true}>
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
};

export default EntityMap; 
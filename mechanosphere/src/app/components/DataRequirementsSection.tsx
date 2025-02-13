'use client'

import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { DataTableRequirements } from '../types';

type RequiredTableViewProps = {
  title: string;
  dataRequirements: DataTableRequirements;
};

const RequiredTableView: React.FC<RequiredTableViewProps> = ({ title, dataRequirements }) => {
    return (
    <Accordion type="single" collapsible>
      <AccordionItem value={title}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <div key={title}>
            <div className="grid" style={{ overflowX: 'auto', gridTemplateColumns: `repeat(${1 + dataRequirements.columns.length}, minmax(0, 1fr))` }}>
              <div key={dataRequirements.index} className="font-bold border border-bg p-2">{dataRequirements.index}</div>
              {dataRequirements.columns.map((value, column) => (
                <div key={column} className="border border-bg p-2">{value}</div>
              ))}
            </div>
            <div className="grid" style={{ overflowX: 'auto', gridTemplateColumns: `repeat(${1 + dataRequirements.columns.length}, minmax(0, 1fr))` }}>
              {Array(1 + dataRequirements.columns.length).fill().map((_, i) => (
                <div key={i} className="border border-bg p-2"></div>
              ))}
            </div>
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
};

const DataRequirementsSection: React.FC<DataRequirementsSectionProps> = ({ requiredTables }) => {
    return (
        <div className="p-2" style={{ width: '100%', position: 'relative', overflow: 'auto' }}>
            {
            Object.entries(requiredTables).map(([tableName, table]) => (
                <RequiredTableView 
                key={tableName}
                title={tableName}
                dataRequirements={requiredTables[tableName]}
                />
            ))}
        </div>
    );
}

export { RequiredTableView, DataRequirementsSection }; 
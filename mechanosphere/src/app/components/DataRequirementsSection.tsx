'use client'

import React, { useState, useEffect } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { DataTableRequirements, DataTableValues } from '../types';
import { mockDataService } from '../../services/mockDataService';
import { fakeDataService, fakeDataGenerators, FakeDataTable } from '../../services/generateFakeDataService';
import { useFormula } from '../context/FormulaContext';

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
};

const RequiredTableView: React.FC<RequiredTableViewProps> = ({ title, dataRequirements }) => {
  const { selectedMachineEnv, selectedConstraints, selectedObjective } = useFormula();
  const [displayedData, setDisplayedData] = useState<DataTableValues>({
    [dataRequirements.index]: [],
    ...dataRequirements.columns.reduce((acc, column) => {
      acc[column] = [];
      return acc;
    }, {})
  });
  
  // Fetch data on initialization
  useEffect(() => {
    mockDataService.retrieveData(title).then(data => {
      setDisplayedData(data);
      console.log("Fetched Data on Initialization:", data); // Log the fetched data for verification
    });
  }, [title]); // Dependency array to refetch if title changes

  const generateDummyData = () => {
    const dummyData: FakeDataTable = fakeDataService.getFakeDataGenerators()[title]({selectedMachineEnv: selectedMachineEnv.key, selectedConstraints: selectedConstraints.map(constraint => constraint.key), selectedObjective: selectedObjective.key});

    // Upload the dummy data
    mockDataService.uploadData(title, dummyData);

    // Update the displayedData state immediately after generating dummy data
    setDisplayedData(dummyData);

    // Optionally, fetch the updated data from the mock service
    mockDataService.retrieveData(title).then(data => {
      setDisplayedData(data);
      console.log("Updated Data:", data); // Log the updated data for verification
    });
  };

  const downloadCSV = () => {
      mockDataService.retrieveData(title).then(data => {
          const csvContent = "data:text/csv;charset=utf-8," 
              + Object.values(data).map(e => Object.values(e).join(",")).join("\n");
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "dummy_data.csv");
          document.body.appendChild(link);
          link.click();
      });
  };

  // Don't worry about this yet
  const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
          const text = e.target.result;
          // Process the CSV text here
          console.log(text);
          // onUpload(text); // Use the callback to upload the uploaded data
      };
      reader.readAsText(file);
  };
    
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={title}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded mb-4" onClick={generateDummyData}>Generate Dummy Data</button>
              {/* <button className="bg-blue-500 text-white px-2 py-1 rounded mb-4" onClick={downloadCSV}>Download CSV</button>
              <input type="file" accept=".csv" onChange={handleFileUpload} /> */}
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
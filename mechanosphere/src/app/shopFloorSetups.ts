// This file contains the shop floor setups for the shop floor, to be hosted in the DB later
import { ShopFloorSetups } from "./types";

// Define the shopFloorSetups object with the new type
const shopFloorSetups: ShopFloorSetups = {
  identicalParallelMachines: {
    name: "Identical Parallel Machines",
    nodes: [
      { id: "Source", position: { x: 300, y: 50 }, data: { label: "Job Source" }, type: "input" },
      { id: "Machine1", position: { x: 100, y: 200 }, data: { label: "Machine 1" }, type: "default" },
      { id: "Machine2", position: { x: 300, y: 200 }, data: { label: "Machine 2" }, type: "default" },
      { id: "Machine3", position: { x: 500, y: 200 }, data: { label: "Machine 3" }, type: "default" },
      { id: "Sink", position: { x: 300, y: 350 }, data: { label: "Job Completed" }, type: "output" }
    ],
    edges: [
      { id: "source-machine1", source: "Source", target: "Machine1" },
      { id: "source-machine2", source: "Source", target: "Machine2" },
      { id: "source-machine3", source: "Source", target: "Machine3" },
      { id: "machine1-sink", source: "Machine1", target: "Sink" },
      { id: "machine2-sink", source: "Machine2", target: "Sink" },
      { id: "machine3-sink", source: "Machine3", target: "Sink" }
    ]
  },
  uniformParallelMachines: {
    name: "Uniform Parallel Machines",
    nodes: [
      { id: "Source", position: { x: 300, y: 50 }, data: { label: "Job Source" }, type: "input" },
      { id: "FastMachine", position: { x: 100, y: 200 }, data: { label: "Fast Machine" }, type: "default" },
      { id: "MediumMachine", position: { x: 300, y: 200 }, data: { label: "Medium Machine" }, type: "default" },
      { id: "SlowMachine", position: { x: 500, y: 200 }, data: { label: "Slow Machine" }, type: "default" },
      { id: "Sink", position: { x: 300, y: 350 }, data: { label: "Job Completed" }, type: "output" }
    ],
    edges: [
      { id: "source-fast", source: "Source", target: "FastMachine" },
      { id: "source-medium", source: "Source", target: "MediumMachine" },
      { id: "source-slow", source: "Source", target: "SlowMachine" },
      { id: "fast-sink", source: "FastMachine", target: "Sink" },
      { id: "medium-sink", source: "MediumMachine", target: "Sink" },
      { id: "slow-sink", source: "SlowMachine", target: "Sink" }
    ]
  },
  unrelatedParallelMachines: {
    name: "Unrelated Parallel Machines",
    nodes: [
      { id: "Source", position: { x: 300, y: 50 }, data: { label: "Job Source" }, type: "input" },
      { id: "DrillingMachine", position: { x: 100, y: 200 }, data: { label: "Drilling" }, type: "default" },
      { id: "MillingMachine", position: { x: 300, y: 200 }, data: { label: "Milling" }, type: "default" },
      { id: "GrindingMachine", position: { x: 500, y: 200 }, data: { label: "Grinding" }, type: "default" },
      { id: "Sink", position: { x: 300, y: 350 }, data: { label: "Job Completed" }, type: "output" }
    ],
    edges: [
      { id: "source-drill", source: "Source", target: "DrillingMachine" },
      { id: "source-mill", source: "Source", target: "MillingMachine" },
      { id: "source-grind", source: "Source", target: "GrindingMachine" },
      { id: "drill-sink", source: "DrillingMachine", target: "Sink" },
      { id: "mill-sink", source: "MillingMachine", target: "Sink" },
      { id: "grind-sink", source: "GrindingMachine", target: "Sink" }
    ]
  },
  flowShop: {
    name: "Flow Shop",
    nodes: [
      { id: "JobSource", position: { x: 100, y: 50 }, data: { label: "Job Source" }, type: "input" },
      { id: "Stage1", position: { x: 100, y: 100 }, data: { label: "Stage 1" }, type: "default" },
      { id: "Stage2", position: { x: 300, y: 200 }, data: { label: "Stage 2" }, type: "default" },
      { id: "Stage3", position: { x: 500, y: 300 }, data: { label: "Stage 3" }, type: "default" },
      { id: "JobEnd", position: { x: 500, y: 350 }, data: { label: "Job Completed" }, type: "output" }
    ],
    edges: [
      { id: "source-s1", source: "JobSource", target: "Stage1" },
      { id: "s1-s2", source: "Stage1", target: "Stage2" },
      { id: "s2-s3", source: "Stage2", target: "Stage3" },
      { id: "s3-end", source: "Stage3", target: "JobEnd" }
    ]
  },
  jobShop: {
    name: "Job Shop",
    nodes: [
      // Job Start
      { id: "JobStart", position: { x: 300, y: 50 }, data: { label: "Job Source" }, type: "input" },
    
        // Cutting Stage
        { id: "C1", position: { x: 100, y: 200 }, data: { label: "Cutting Machine 1" }, type: "default" },
        { id: "C2", position: { x: 500, y: 200 }, data: { label: "Cutting Machine 2" }, type: "default" },
    
        // Deburring Stage
        { id: "D1", position: { x: 100, y: 350 }, data: { label: "Deburring Machine 1" }, type: "default" },
        { id: "D2", position: { x: 500, y: 350 }, data: { label: "Deburring Machine 2" }, type: "default" },
    
        // Coating Stage
        { id: "Co1", position: { x: 100, y: 500 }, data: { label: "Coating Machine 1" }, type: "default" },
        { id: "Co2", position: { x: 500, y: 500 }, data: { label: "Coating Machine 2" }, type: "default" },
    
        // Job End
        { id: "JobEnd", position: { x: 300, y: 650 }, data: { label: "Job Completed" }, type: "output" }
      ],
      edges: [
        // Start → Cutting
        { id: "start-c1", source: "JobStart", target: "C1" },
        { id: "start-c2", source: "JobStart", target: "C2" },
    
        // Cutting → Deburring
        { id: "c1-d1", source: "C1", target: "D1" },
        { id: "c1-d2", source: "C1", target: "D2" },
        { id: "c2-d1", source: "C2", target: "D1" },
        { id: "c2-d2", source: "C2", target: "D2" },
    
        // Deburring → Coating
        { id: "d1-co1", source: "D1", target: "Co1" },
        { id: "d1-co2", source: "D1", target: "Co2" },
        { id: "d2-co1", source: "D2", target: "Co1" },
        { id: "d2-co2", source: "D2", target: "Co2" },
    
        // Coating → End
        { id: "co1-end", source: "Co1", target: "JobEnd" },
        { id: "co2-end", source: "Co2", target: "JobEnd" }
      ]
  },
  openShop: {
    name: "Open Shop",
    nodes: [
      { id: "JobSource", position: { x: 0, y: 50 }, data: { label: "Job Source" }, type: "input" },
      { id: "Station1", position: { x: 100, y: 100 }, data: { label: "Station 1" }, type: "default" },
      { id: "Station2", position: { x: 300, y: 200 }, data: { label: "Station 2" }, type: "default" },
      { id: "Station3", position: { x: 500, y: 300 }, data: { label: "Station 3" }, type: "default" },
      { id: "JobCompleted", position: { x: 600, y: 350 }, data: { label: "Job Completed" }, type: "output" }
    ],
    edges: [
      { id: "source-s1", source: "JobSource", target: "Station1" },
      { id: "source-s2", source: "JobSource", target: "Station2" },
      { id: "source-s3", source: "JobSource", target: "Station3" },
      { id: "s1-s2", source: "Station1", target: "Station2" },
      { id: "s1-s3", source: "Station1", target: "Station3" },
      { id: "s2-s3", source: "Station2", target: "Station3" },
      { id: "s1-end", source: "Station1", target: "JobCompleted" },
      { id: "s2-end", source: "Station2", target: "JobCompleted" },
      { id: "s3-end", source: "Station3", target: "JobCompleted" }
    ]
  },
  flexibleFlowShop: {
    name: "Flexible Flow Shop",
    nodes: [
      { id: "JobSource", position: { x: 0, y: 50 }, data: { label: "Job Source" }, type: "input" },
      { id: "Stage1", position: { x: 200, y: 100 }, data: { label: "Stage 1" }, type: "default" },
      { id: "MachineA", position: { x: 100, y: 200 }, data: { label: "Stage 2 - Machine A" }, type: "default" },
      { id: "MachineB", position: { x: 300, y: 200 }, data: { label: "Stage 2 - Machine B" }, type: "default" },
      { id: "Stage3", position: { x: 200, y: 300 }, data: { label: "Stage 3" }, type: "default" },
      { id: "JobCompleted", position: { x: 400, y: 350 }, data: { label: "Job Completed" }, type: "output" }
    ],
    edges: [
      { id: "source-s1", source: "JobSource", target: "Stage1" },
      { id: "s1-mA", source: "Stage1", target: "MachineA" },
      { id: "s1-mB", source: "Stage1", target: "MachineB" },
      { id: "mA-s3", source: "MachineA", target: "Stage3" },
      { id: "mB-s3", source: "MachineB", target: "Stage3" },
      { id: "s3-end", source: "Stage3", target: "JobCompleted" }
    ]
  }
};

export default shopFloorSetups; 
export const machineEnvOptions = [
  { symbol: 'P', name: 'Identical parallel machines', key: 'identicalParallelMachines' },
  { symbol: 'Q', name: 'Uniform parallel machines', key: 'uniformParallelMachines' },
  { symbol: 'R', name: 'Unrelated parallel machines', key: 'unrelatedParallelMachines' },
  { symbol: 'F', name: 'Flow Shop', key: 'flowShop' },
  { symbol: 'J', name: 'Job Shop', key: 'jobShop' },
  { symbol: 'O', name: 'Open Shop', key: 'openShop' },
  { symbol: 'FF', name: 'Flexible Flow Shop', key: 'flexibleFlowShop' }
];

export const constraintsOptions = [
  { symbol: 'prec', name: 'Precedence constraints', key: 'precedenceConstraints' },
  { symbol: 'res', name: 'Resource constraints', key: 'resourceConstraints' },
  { symbol: 'd_j', name: 'Due date constraints', key: 'dueDateConstraints' },
  { symbol: 'r_j', name: 'Release date constraints', key: 'releaseDateConstraints' },
  { symbol: 's_{ij}', name: 'Setup time constraints', key: 'setupTimeConstraints' }
];

export const objectiveOptions = [
  { symbol: 'C_{\max}', name: 'Minimize makespan', key: 'Cmax' },
  { symbol: '\\sum w_j C_j', name: 'Minimize total weighted completion time', key: 'wCj' },
  { symbol: '\\sum w_j T_j', name: 'Minimize total weighted tardiness', key: 'wTj' },
  { symbol: '\\sum w_j E_j', name: 'Minimize total weighted earliness', key: 'wEj' },
  { symbol: '\\sum w_j F_j', name: 'Minimize total weighted flow time', key: 'wFj' },
  { symbol: '\\sum w_j W_j', name: 'Minimize total weighted waiting time', key: 'wWj' }
];

export const globalDataRequirements = {
  Jobs: {
    index: "job_id",
    columns: ["job_name", "job_due_date"]
  }
};

export const tables = {
  Machines: { 
    index: "machine_id",  
    columns: ["machine_name"]
  },
  ProcessingTimes: { 
    index: "processing_time_id",
    columns: ["job_id", "processing_time"]
  },
  Routing: { 
    index: "routing_id",
    columns: ["job_id", "step_number", "machine_id"]
  },
  StageAssignments: { 
    index: "stage_assignment_id",
    columns: ["stage_id", "machine_id"]
  },
  PrecedenceConstraints: { 
    columns: ["job_id_before", "job_id_after"], 
    index: "precedence_constraint_id" 
  },
  ResourceConstraints: { 
    index: "resource_constraint_id", 
    columns: ["resource_id", "job_id", "amount_required"] 
  },
  Resources: { 
    index: "resource_id", 
    columns: ["resource_name", "total_available"] 
  },
  Weights: { 
    index: "weight_id", 
    columns: ["job_id", "weight"] 
  },
  Jobs: { 
    index: "job_id",  
    columns: ["job_name", "job_due_date"]
  },
  MachineSpeedFactors: { 
    index: "machine_speed_factor_id",
    columns: ["machine_id", "machine_speed_factor"]
  },
  SetupTimes: { 
    index: "setup_time_id",
    columns: ["job_id_before", "job_id_after", "machine_id", "setup_time"]
  }
};

export const machineEnvDataRequirements = {
  identicalParallelMachines: {
    requiredTables: {
      Machines: tables.Machines,
      ProcessingTimes: tables.ProcessingTimes,
    }
  },
  uniformParallelMachines: {
    requiredTables: {
      Machines: tables.Machines,
      ProcessingTimes: tables.ProcessingTimes,
      MachineSpeedFactors: tables.MachineSpeedFactors,
    }
  },
  unrelatedParallelMachines: {
    requiredTables: {
      Machines: tables.Machines,
      ProcessingTimes: tables.ProcessingTimes,
    }
  },
  flowShop: {
    requiredTables: {
      Machines: tables.Machines,
      ProcessingTimes: tables.ProcessingTimes,
      Routing: tables.Routing,
    }
  },
  jobShop: {
    requiredTables: {
      Machines: tables.Machines,
      ProcessingTimes: tables.ProcessingTimes,
      Routing: tables.Routing,
    }
  },
  openShop: {
    requiredTables: {
      Machines: tables.Machines,
      ProcessingTimes: tables.ProcessingTimes,
    }
  },
  flexibleFlowShop: {
    requiredTables: {
      Machines: tables.Machines,
      ProcessingTimes: tables.ProcessingTimes,
      Routing: tables.Routing,
      StageAssignments: tables.StageAssignments,
    }
  }
}; 

export const constraintsDataRequirements = {
    precedenceConstraints: {
      requiredTables: {
        PrecedenceConstraints: tables.PrecedenceConstraints
      }
    },
    resourceConstraints: {
      requiredTables: {
        ResourceConstraints: tables.ResourceConstraints,
        Resources: tables.Resources,
      }
    },
    dueDateConstraints: {
      requiredTables: {}
    },
    releaseDateConstraints: {
      requiredTables: {}
    },
    setupTimeConstraints: {
      requiredTables: {
        SetupTimes: tables.SetupTimes
      }
    }
  };
  
  export const objectiveFunctionRequirements = {
    Cmax: {
      requiredTables: {}
    },
    wCj: {
      requiredTables: {
        Weights: tables.Weights,
      }
    },
    wTj: {
      requiredTables: {
        Weights: tables.Weights,
      }
    },
    wEj: {
      requiredTables: {
        Weights: tables.Weights,
      }
    },
    wFj: {
      requiredTables: {
        Weights: tables.Weights,
      }
    },
    wWj: {
      requiredTables: {
        Weights: tables.Weights,
      }
    }
  };

  
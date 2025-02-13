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
    index: ["job_id"],
    columns: ["job_name", "job_due_date"]
  }
};

export const machineEnvDataRequirements = {
  identicalParallelMachines: {
    requiredTables: {
      Machines: { 
        index: ["machine_id"],  
        columns: ["machine_name"]
      },
      ProcessingTimes: { 
        index: ["job_id"],
        columns: ["processing_time"]
      },
    }
  },
  uniformParallelMachines: {
    requiredTables: {
      Machines: { 
        index: ["machine_id"],
        columns: ["machine_name"]
      },
      ProcessingTimes: { 
        index: ["job_id", "machine_id"],
        columns: ["processing_time"]
      },
      MachineSpeedFactors: { 
        index: ["machine_id"],
        columns: ["machine_speed_factor"]
      },
    }
  },
  unrelatedParallelMachines: {
    requiredTables: {
      Machines: { 
        index: ["machine_id"],
        columns: ["machine_name"]
      },
      ProcessingTimes: { 
        index: ["job_id", "machine_id"],
        columns: ["processing_time"]
      },
    }
  },
  flowShop: {
    requiredTables: {
      Machines: { 
        index: ["machine_id"],
        columns: ["machine_name"]
      },
      ProcessingTimes: { 
        index: ["job_id", "machine_id"],
        columns: ["processing_time"]
      },
      Routing: { 
        index: ["job_id", "step_number"],
        columns: ["step_id"]
      },
    }
  },
  jobShop: {
    requiredTables: {
      Machines: { 
        index: ["machine_id"],
        columns: ["machine_name"]
      },
      ProcessingTimes: { 
        index: ["job_id", "machine_id"],
        columns: ["processing_time"]
      },
      Routing: { 
        index: ["job_id", "step_number", "machine_id"],
        columns: ["step_id"]
      },
    }
  },
  openShop: {
    requiredTables: {
      Machines: { 
        index: ["machine_id"],
        columns: ["machine_name"]
      },
      ProcessingTimes: { 
        index: ["job_id", "machine_id"],
        columns: ["processing_time"]
      },
    }
  },
  flexibleFlowShop: {
    requiredTables: {
      Machines: { 
        index: ["machine_id", "stage_id"],
        columns: ["machine_name"]
      },
      ProcessingTimes: { 
        index: ["job_id", "machine_id", "stage_id"],
        columns: ["processing_time"]
      },
      Routing: { 
        index: ["job_id", "step_number", "stage_id"],
        columns: ["step_id"]
      },
      StageAssignments: { 
        index: ["stage_id", "machine_id"],
        columns: ["stage_assignment_id"]
      },
    }
  }
}; 

export const constraintsDataRequirements = {
    precedenceConstraints: {
      requiredTables: {
        PrecedenceConstraints: { columns: ["job_id_before", "job_id_after"], index: ["precedence_constraint_id"] }
      }
    },
    resourceConstraints: {
      requiredTables: {
        ResourceConstraints: { index: ["resource_id", "job_id"], columns: ["amount_required"] },
        Resources: { index: ["resource_id"], columns: ["total_available"] },
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
        SetupTimes: { index: ["job_id_before", "job_id_after", "machine_id"], columns: ["setup_time"] }
      }
    }
  };
  
  export const objectiveFunctionRequirements = {
    Cmax: {
      requiredTables: {}
    },
    wCj: {
      requiredTables: {
        Weights: { index: ["job_id"], columns: ["weight"] },
      }
    },
    wTj: {
      requiredTables: {
        Weights: { index: ["job_id"], columns: ["weight"] },
      }
    },
    wEj: {
      requiredTables: {
        Weights: { index: ["job_id"], columns: ["weight"] },
      }
    },
    wFj: {
      requiredTables: {
        Weights: { index: ["job_id"], columns: ["weight"] },
      }
    },
    wWj: {
      requiredTables: {
        Weights: { index: ["job_id"], columns: ["weight"] },
      }
    }
  };
  
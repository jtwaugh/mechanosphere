import { tables } from '../app/dataRequirements';
import { configService } from '../services/configService';

export type FakeDataTable = {[column: string]: any[]};

class FakeDataService {
  generateFakeDataForMachines(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    console.log(formula);
    
    const num_machines = 3;

    const machine_ids = [];
    const machine_names = [];

    for (let i = 0; i < num_machines; i++) {
      machine_ids.push(i);
      machine_names.push(`${formula.selectedMachineEnv} Machine ${i}`);
    }

    const result = {
      machine_id: machine_ids,
      machine_name: machine_names
    };

    console.log(result);
    return result;
  }

  generateFakeDataForProcessingTimes(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for ProcessingTimes
    const result = {
      job_id: [],
      processing_time: []
    };
    return result;
  }

  generateFakeDataForRouting(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for Routing
    const result = {
      job_id: [],
      step_number: [],
      machine_id: []
    };
    return result;
  }

  generateFakeDataForStageAssignments(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for StageAssignments
    const result = {
      stage_id: [],
      machine_id: []
    };
    return result;
  }

  generateFakeDataForPrecedenceConstraints(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for PrecedenceConstraints
    const result = {
      job_id_before: [],
      job_id_after: []
    };
    return result;
  }

  generateFakeDataForResourceConstraints(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for ResourceConstraints
    const result = {
      job_id: [],
      resource_id: [],
      resource_name: [],
      resource_type: []
    };
    return result;
  }

  generateFakeDataForResources(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for Resources
    const result = {
      resource_id: [],
      resource_name: [],
      resource_type: []
    };
    return result;
  }

  generateFakeDataForWeights(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for Weights
    const result = {
      job_id: [],
      weight: []
    };
    return result;
  }

  generateFakeDataForJobs(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    const num_jobs = 10;

    const job_ids = [];
    const job_names = [];
    const job_due_dates = [];

    const { startTime, endTime } = configService.getConfig();

    for (let i = 0; i < num_jobs; i++) {
      job_ids.push(i);
      job_names.push(`Job ${i}`);
      job_due_dates.push(Math.floor(Math.random() * (endTime - startTime + 1)) + startTime);
    }

    const result = {
      job_id: job_ids,
      job_name: job_names,
      job_due_date: job_due_dates
    };
    return result;
  }

  generateFakeDataForMachineSpeedFactors(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for MachineSpeedFactors
    const result = {
      machine_id: [],
      machine_speed_factor: []
    };
    return result;
  }

  generateFakeDataForSetupTimes(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for SetupTimes
    const result = {
      job_id: [],
      setup_time: []
    };
    return result;
  }

  generateFakeDataForFrozenJobs(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for FrozenJobs  
    const result = {
      job_id: [],
      frozen_time: []
    };
    return result;
  }

  generateFakeDataForBlockedIntervals(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for BlockedIntervals
    const result = {
      job_id: [],
      blocked_interval: []
    };
    return result;
  }

  generateFakeDataForPreemptionConstraints(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for PreemptionConstraints
    const result = {
      job_id: [],
      preemption_time: []
    };
    return result;
  }

  generateFakeDataForReleaseDates(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for ReleaseDates
    const result = {
      job_id: [],
      release_date: []
    };
    return result;
  }

  generateFakeDataForNoWaitConstraints(formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) : FakeDataTable {
    // TODO: Implement fake data generation for NoWaitConstraints
    const result = {
      job_id: [],
      no_wait_time: []
    };
    return result;
  }

  // Method to export a dictionary mapping table names to generator functions
  getFakeDataGenerators() : { [key: string]: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => FakeDataTable } {
    return {
      Machines: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForMachines(formula),
      ProcessingTimes: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForProcessingTimes(formula),
      Routing: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForRouting(formula),
      StageAssignments: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForStageAssignments(formula),
      PrecedenceConstraints: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForPrecedenceConstraints(formula),
      ResourceConstraints: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForResourceConstraints(formula),
      Resources: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForResources(formula),
      Weights: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForWeights(formula),
      Jobs: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForJobs(formula),
      MachineSpeedFactors: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForMachineSpeedFactors(formula),
      SetupTimes: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForSetupTimes(formula),
      FrozenJobs: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForFrozenJobs(formula),
      BlockedIntervals: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForBlockedIntervals(formula),
      PreemptionConstraints: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForPreemptionConstraints(formula),
      ReleaseDates: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForReleaseDates(formula),
      NoWaitConstraints: (formula: {selectedMachineEnv: string, selectedConstraints: string[], selectedObjective: string}) => this.generateFakeDataForNoWaitConstraints(formula),
    };
  }
}

export const fakeDataService = new FakeDataService();
export const fakeDataGenerators = fakeDataService.getFakeDataGenerators(); 
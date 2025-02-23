import { tables } from '../app/dataRequirements';

export type FakeDataTable = {[column: string]: any[]};

class FakeDataService {
  generateFakeDataForMachines() : FakeDataTable {
    const num_machines = 3;

    const machine_ids = [];
    const machine_names = [];

    for (let i = 0; i < num_machines; i++) {
      machine_ids.push(i);
      machine_names.push(`Machine ${i}`);
    }

    const result = {
      machine_id: machine_ids,
      machine_name: machine_names
    };

    console.log(result);
    return result;
  }

  generateFakeDataForProcessingTimes() : FakeDataTable {
    // TODO: Implement fake data generation for ProcessingTimes
    const result = {
      job_id: [],
      processing_time: []
    };
    return result;
  }

  generateFakeDataForRouting() : FakeDataTable {
    // TODO: Implement fake data generation for Routing
    const result = {
      job_id: [],
      step_number: [],
      machine_id: []
    };
    return result;
  }

  generateFakeDataForStageAssignments() : FakeDataTable {
    // TODO: Implement fake data generation for StageAssignments
    const result = {
      stage_id: [],
      machine_id: []
    };
    return result;
  }

  generateFakeDataForPrecedenceConstraints() : FakeDataTable {
    // TODO: Implement fake data generation for PrecedenceConstraints
    const result = {
      job_id_before: [],
      job_id_after: []
    };
    return result;
  }

  generateFakeDataForResourceConstraints() : FakeDataTable {
    // TODO: Implement fake data generation for ResourceConstraints
    const result = {
      job_id: [],
      resource_id: [],
      resource_name: [],
      resource_type: []
    };
    return result;
  }

  generateFakeDataForResources() : FakeDataTable {
    // TODO: Implement fake data generation for Resources
    const result = {
      resource_id: [],
      resource_name: [],
      resource_type: []
    };
    return result;
  }

  generateFakeDataForWeights() : FakeDataTable {
    // TODO: Implement fake data generation for Weights
    const result = {
      job_id: [],
      weight: []
    };
    return result;
  }

  generateFakeDataForJobs() : FakeDataTable {
    // TODO: Implement fake data generation for Jobs
    const num_jobs = 10;

    const job_ids = [];
    const job_names = [];
    const job_due_dates = [];

    for (let i = 0; i < num_jobs; i++) {
      job_ids.push(i);
      job_names.push(`Job ${i}`);
      job_due_dates.push(`2025-01-01`);
    }

    const result = {
      job_id: job_ids,
      job_name: job_names,
      job_due_date: job_due_dates
    };
    return result;
  }

  generateFakeDataForMachineSpeedFactors() : FakeDataTable {
    // TODO: Implement fake data generation for MachineSpeedFactors
    const result = {
      machine_id: [],
      machine_speed_factor: []
    };
    return result;
  }

  generateFakeDataForSetupTimes() : FakeDataTable {
    // TODO: Implement fake data generation for SetupTimes
    const result = {
      job_id: [],
      setup_time: []
    };
    return result;
  }

  generateFakeDataForFrozenJobs() : FakeDataTable {
    // TODO: Implement fake data generation for FrozenJobs  
    const result = {
      job_id: [],
      frozen_time: []
    };
    return result;
  }

  generateFakeDataForBlockedIntervals() : FakeDataTable {
    // TODO: Implement fake data generation for BlockedIntervals
    const result = {
      job_id: [],
      blocked_interval: []
    };
    return result;
  }

  generateFakeDataForPreemptionConstraints() : FakeDataTable {
    // TODO: Implement fake data generation for PreemptionConstraints
    const result = {
      job_id: [],
      preemption_time: []
    };
    return result;
  }

  generateFakeDataForReleaseDates() : FakeDataTable {
    // TODO: Implement fake data generation for ReleaseDates
    const result = {
      job_id: [],
      release_date: []
    };
    return result;
  }

  generateFakeDataForNoWaitConstraints() : FakeDataTable {
    // TODO: Implement fake data generation for NoWaitConstraints
    const result = {
      job_id: [],
      no_wait_time: []
    };
    return result;
  }

  // Method to export a dictionary mapping table names to generator functions
  getFakeDataGenerators() : { [key: string]: () => FakeDataTable } {
    return {
      Machines: this.generateFakeDataForMachines.bind(this),
      ProcessingTimes: this.generateFakeDataForProcessingTimes.bind(this),
      Routing: this.generateFakeDataForRouting.bind(this),
      StageAssignments: this.generateFakeDataForStageAssignments.bind(this),
      PrecedenceConstraints: this.generateFakeDataForPrecedenceConstraints.bind(this),
      ResourceConstraints: this.generateFakeDataForResourceConstraints.bind(this),
      Resources: this.generateFakeDataForResources.bind(this),
      Weights: this.generateFakeDataForWeights.bind(this),
      Jobs: this.generateFakeDataForJobs.bind(this),
      MachineSpeedFactors: this.generateFakeDataForMachineSpeedFactors.bind(this),
      SetupTimes: this.generateFakeDataForSetupTimes.bind(this),
      FrozenJobs: this.generateFakeDataForFrozenJobs.bind(this),
      BlockedIntervals: this.generateFakeDataForBlockedIntervals.bind(this),
      PreemptionConstraints: this.generateFakeDataForPreemptionConstraints.bind(this),
      ReleaseDates: this.generateFakeDataForReleaseDates.bind(this),
      NoWaitConstraints: this.generateFakeDataForNoWaitConstraints.bind(this),
    };
  }
}

export const fakeDataService = new FakeDataService();
export const fakeDataGenerators = fakeDataService.getFakeDataGenerators(); 
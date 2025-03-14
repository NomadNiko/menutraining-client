export interface StripeConnectStep {
    name: string;
    status: 'not_started' | 'in_progress' | 'completed';
  }
  
  export interface StripeConnectState {
    status: 'not_started' | 'in_progress' | 'completed';
    currentStep?: StripeConnectStep;
  }
  
  export interface StripeConnectEvent {
    type: 'step_changed' | 'completed' | 'exited';
    data?: {
      currentStep?: StripeConnectStep;
      state?: StripeConnectState;
    };
  }
  
  export interface StepChange {
    type: 'step_changed';
    currentStep: StripeConnectStep;
    state: StripeConnectState;
  }
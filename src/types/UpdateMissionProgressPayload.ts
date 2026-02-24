export type UpdateMissionProgressPayload = {
  currentStep: number;
  serviceRequestId: string;
  observationNote: string;
  isCompleted: boolean;
  currentStepId: number;
  stepStatus: string;
};

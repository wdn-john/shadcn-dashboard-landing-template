import { MissionStep } from './MissionStep';
import { TranslatedText } from './TranslatedText';

export type MissionProgressDTO = {
  id: number;
  isCompleted: boolean;
  title: TranslatedText;
  locked?: boolean;
  messageToExpert?: string;
  messageToClient?: string;
  showMissionContinuesModal: boolean;
  showMultiPhaseMissionPaymentMadeModal: boolean;
  missionContinues?: boolean;
  missionStatus: string;
  metaData?: Record<string, any>;
  currentStep: number;
  completionPercentage: number;
  steps: MissionStep[];
};

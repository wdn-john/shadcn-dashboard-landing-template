import { MissionStep } from './MissionStep';
import { TranslatedText } from './TranslatedText';

export type JobProgressDTO = {
  id: number;
  expertName: string;
  expertProfession: string;
  expertAvatarUrl: string;
  status: string;
  updatedAt: string;
  isCompleted: boolean;
  missionIsHalfwayCompleted: boolean;
  title: TranslatedText;
  missionSequence: string;
  currentStep: number;
  completionPercentage: number;
  steps: MissionStep[];
};

export const initialProgress: JobProgressDTO = {
  id: 0,
  expertName: '',
  expertProfession: '',
  expertAvatarUrl: '',
  status: 'PENDING',
  updatedAt: '',
  isCompleted: false,
  missionIsHalfwayCompleted: false,
  title: { en: 'Resolution Steps', fr: 'Étapes de résolution' },
  currentStep: 0,
  completionPercentage: 0,
  missionSequence: '',
  steps: [
    {
      id: 0,
      title: {
        en: 'Work should start soon',
        fr: 'Le travail devrait commencer bientôt',
      },
      orderIndex: 0,
      summary: {
        en: 'The expert is preparing to start work. Once ready the steps will be outlined.',
        fr: "L'expert se prépare à commencer le travail. Une fois prêt, les étapes seront décrites.",
      },
      instructions: { en: '', fr: '' },
      note: null,
      attachments: [],
      expanded: false,
      status: 'PENDING',
      isNew: false,
      isToDelete: false,
    },
  ],
};

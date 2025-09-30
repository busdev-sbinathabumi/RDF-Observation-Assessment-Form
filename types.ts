
export type Status = 'OK' | 'Not OK' | 'N/A' | null;

export interface ItemInstance {
  status: Status;
  description: string;
  photo: File | null;
}

export interface AssessmentItem {
  id: string;
  text: string;
  isRepeatable: boolean;
  instances: ItemInstance[];
}

export interface AssessmentSection {
  title: string;
  items: AssessmentItem[];
}

export interface FormHeaderData {
  assessmentDate: string;
  areaLocation: string;
  assessorName: string;
}

export interface FollowUpData {
  summary: string;
  recommendations: string;
  personInCharge: string;
  targetDate: string;
}

export interface FormData {
  header: FormHeaderData;
  sections: AssessmentSection[];
  followUp: FollowUpData;
}

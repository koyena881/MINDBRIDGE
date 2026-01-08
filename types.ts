
export enum UserRole {
  SEEKER = 'Seeker',
  STUDENT_PRACTITIONER = 'Student Practitioner',
  LICENSED_THERAPIST = 'Licensed Therapist',
  PSYCHIATRIST = 'Licensed Psychiatrist'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  licenseNumber?: string;
  studentId?: string;
  healingPoints: number; // New: Gamification for positive community impact
  subscriptionTier?: 'Free' | 'Plus' | 'Pro'; // New: Monetization
}

export interface VentPost {
  id: string;
  content: string;
  timestamp: number;
  tags: string[];
  hugs: number; // New: Anonymous support count
  hearts: number; // New: Anonymous support count
}

export interface TherapySession {
  id: string;
  title: string;
  description: string;
  type: 'Group' | 'One-on-One' | 'Practice';
  practitionerId: string;
  practitionerName: string;
  practitionerRole: UserRole;
  participants: number;
  maxParticipants: number;
  status: 'Open' | 'In Progress' | 'Completed';
  startTime: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: number;
}

export interface MoodEntry {
  id: string;
  date: number;
  mood: 'Very Happy' | 'Happy' | 'Neutral' | 'Sad' | 'Very Sad';
  note: string;
  analysis?: string;
}

export interface StudyTask {
  subject: string;
  topic: string;
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface StudyPlanResponse {
  plan: StudyTask[];
  recommendations: {
    title: string;
    reason: string;
    type: 'Academic' | 'Wellness';
  }[];
}

export interface SavedStudyPlan extends StudyPlanResponse {
  id: string;
  name: string;
  timestamp: number;
}

export interface MentalHealthAnalysis {
  mood: string;
  sentiment: string;
  recommendations: string[];
  alertLevel: 'Low' | 'Medium' | 'High';
}

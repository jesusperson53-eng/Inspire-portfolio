export interface DailyTaskEntity {
  date: string;
  messagesSent: number;
  ordersCompleted: number;
  assetsCreated: number;
  portfolioImproved: boolean;
  learningMinutes: number;
  clientsObtained: number;
  earnings: number;
  skillTasksCompleted: Record<string, boolean>;
  topicsRead?: number;
}

export interface UserProfile {
  fullName: string;
  phoneNumber: string;
  address: string;
  admissionDate: string;
  photoBase64: string;
}

export interface DailyReportEntity {
  id: string;
  date: string;
  messagesSent: number;
  repliesReceived: number;
  ordersTaken: number;
  ordersCompleted: number;
  earnings: number;
  newAccounts: number;
  newClients: number;
  problemsFaced: string;
  nextDayPlan: string;
}

export interface WeeklyReportEntity {
  id: string;
  weekNumber: string;
  totalMessages: number;
  totalClients: number;
  totalOrders: number;
  totalEarnings: number;
  bestService: string;
  weakPoint: string;
  nextWeekGoal: string;
}

export interface MonthlyReportEntity {
  id: string;
  month: string;
  totalEarnings: number;
  totalClients: number;
  totalOrders: number;
  topServices: string;
  biggestAchievement: string;
  biggestMistake: string;
  nextMonthTarget: string;
}

export interface PortfolioEntity {
  id: string;
  fileName: string;
  fileType: string;
  fileData: Blob;
  skillCategory: string;
  tag: string;
  description?: string;
  uploadDate: string;
  size: number;
  portfolioType?: 'showcase' | 'practice';
}

export interface LearningSubSection {
  subtitle: string;
  text: string;
}

export interface LearningContentEntity {
  id: string;
  title: string;
  category: string;
  iconName: string;
  content: LearningSubSection[];
}

export interface UserLearningProgressEntity {
  sectionId: string;
  isRead: boolean;
  isBookmarked: boolean;
}

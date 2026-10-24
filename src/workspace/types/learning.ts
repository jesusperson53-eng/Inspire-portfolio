export interface CourseTopic {
  id: string;
  title: string;
  content: string;
}

export interface CourseChapter {
  id: string;
  title: string;
  topics: CourseTopic[];
}

export interface CourseEntity {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  chapters: CourseChapter[];
}

export interface UserCourseProgress {
  courseId: string;
  completedTopics: string[]; // array of topic IDs
}

export interface GameProgress {
  xp: number;
  level: number;
  highScores: Record<string, number>; // gameId -> score
}

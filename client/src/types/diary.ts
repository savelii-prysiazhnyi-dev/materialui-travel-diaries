export interface UserSummary {
  _id: string;
  name: string;
  email: string;
}

export interface DiaryPost {
  _id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  user?: UserSummary | string;
}

export interface DiaryFormValues {
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
}

export interface UserProfile extends UserSummary {
  posts: DiaryPost[];
}

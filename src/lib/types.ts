export type PostCardData = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateLabel: string;
  category: string;
  tags: string[];
  stack: string[];
  topic: string;
  cover: string;
  readingTime: string;
};

export type FilterGroups = {
  categories: string[];
  topics: string[];
  stack: string[];
};

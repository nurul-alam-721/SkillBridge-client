export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { tutors: number };
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

export type CategoryConfig = {
  [key: string]: {
    icon: any;
    color: string;
    bgColor: string;
  };
};

interface ReviewProps {
  id: number;
  userId: string;
  text: string;
  rate: number;
}

interface MoviesProps {
  id?: string;
  userId?: string;
  name: string;
  image: string;
  description: string;
  country: string;
  rate?: number;
  registeredDate?: string;
  likes?: string[];
  reviews?: ReviewProps[];
}

export type { MoviesProps, ReviewProps };

interface ReviewProps {
  id: number;
  userId: string;
  text: string;
  rate: number;
}

interface LikeProps {
  userId: string;
  like: boolean;
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
  likes?: LikeProps[];
  reviews?: ReviewProps[];
}

export type { LikeProps, MoviesProps, ReviewProps };

interface ReviewProps {
  id: number;
  userId: string;
  text: string;
}

interface MoviesProps {
  id: number;
  name: string;
  image: string;
  description: string;
  rate: number;
  reviews: ReviewProps[];
}

export type { MoviesProps, ReviewProps };

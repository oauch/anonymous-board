import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MoviesProps } from "../types/Movies";
import { userId } from "../utils/userId";
import useMovieInfo from "./useMovieInfo";

function usePost() {
  const {
    movieName,
    movieImg,
    description,
    country,
    handleMovieName,
    handleMovieImg,
    handleDescription,
    handleCountry,
  } = useMovieInfo("korea");

  const navigate = useNavigate();

  const date = new Date();

  const handleMovieSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!movieName || !movieImg || !description)
      return alert("비어있는 입력 칸이 있습니다.");

    const newMovie: MoviesProps = {
      id: String(Date.now()),
      userId: userId,
      name: movieName,
      image: movieImg,
      description: description,
      country: country,
      registeredDate: date.toISOString(),
      rate: 0,
      reviews: [],
    };

    try {
      const response = await fetch(`http://localhost:3001/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to add review");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    movieName,
    movieImg,
    description,
    handleMovieSubmit,
    handleMovieName,
    handleMovieImg,
    handleDescription,
    handleCountry,
  };
}

export default usePost;

import { ChangeEvent, useState } from "react";

function useMovieInfo(countryType: string) {
  const [movieName, setMovieName] = useState("");
  const [movieImg, setMovieImg] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState(countryType);

  const handleMovieName = (e: ChangeEvent<HTMLInputElement>) => {
    setMovieName(e.target.value);
  };
  const handleMovieImg = (e: ChangeEvent<HTMLInputElement>) => {
    setMovieImg(e.target.value);
  };
  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  const handleCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

  return {
    movieName,
    movieImg,
    description,
    country,
    setMovieName,
    setMovieImg,
    setDescription,
    setCountry,
    handleMovieName,
    handleMovieImg,
    handleDescription,
    handleCountry,
  };
}

export default useMovieInfo;

import styled from "@emotion/styled";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoviesProps } from "../types/Movies";

function Post() {
  const [movieName, setMovieName] = useState("");
  const [movieImg, setMovieImg] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("korea");
  const date = new Date();

  const navigate = useNavigate();

  const generateUserId = () => {
    const newUserId = `user-${Date.now()}`;
    localStorage.setItem("userId", newUserId);
    return newUserId;
  };
  const userId = localStorage.getItem("userId") || generateUserId();

  const handleMovieName = (e: ChangeEvent<HTMLInputElement>) => {
    setMovieName(e.target.value);
  };
  const handleMovieImg = (e: ChangeEvent<HTMLInputElement>) => {
    setMovieImg(e.target.value);
  };
  const handleDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handleCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

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
      registeredDate: date.toLocaleString(),
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

  return (
    <MovieForm onSubmit={handleMovieSubmit}>
      <Label htmlFor="movieName">영화 제목</Label>
      <Input
        id="movieName"
        value={movieName}
        onChange={handleMovieName}
        placeholder="영화 제목을 입력하세요."
      />
      <Label htmlFor="movieImg">영화 이미지</Label>
      <Input
        id="movieImg"
        value={movieImg}
        onChange={handleMovieImg}
        placeholder="영화 이미지 주소를 입력하세요."
      />
      <Label htmlFor="description">영화 줄거리</Label>
      <Input
        id="description"
        value={description}
        onChange={handleDescription}
        placeholder="영화 줄거리를 입력하세요."
      />
      <select onChange={handleCountry}>
        <option value="korea">한국 영화</option>
        <option value="foreign">외국 영화</option>
      </select>
      <SubmitButton type="submit">영화 등록</SubmitButton>
    </MovieForm>
  );
}

export default Post;

const MovieForm = styled.form`
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-content: center;

  gap: 20px;
`;

const Label = styled.label`
  font-size: 1.8rem;
`;

const Input = styled.input`
  border-radius: 5px;
  padding: 5px 10px;
`;

const SubmitButton = styled.button`
  color: #fff;
`;

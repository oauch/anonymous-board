import styled from "@emotion/styled";
import Container from "../components/Container";
import HomeButton from "../components/HomeButton";
import Options from "../components/Options";
import { OPTIONS_COUNTRY } from "../constants/Option";
import usePost from "../hooks/usePost";
import { COLORS } from "../styles/colors";

function Post() {
  const {
    description,
    handleCountry,
    handleDescription,
    handleMovieImg,
    handleMovieName,
    handleMovieSubmit,
    movieImg,
    movieName,
  } = usePost();

  return (
    <Container>
      <HomeButton />
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
        <TextArea
          id="description"
          value={description}
          onChange={handleDescription}
          placeholder="영화 줄거리를 입력하세요."
        />
        <Label>영화 국적</Label>
        <Select onChange={handleCountry}>
          <Options data={OPTIONS_COUNTRY.slice(1, 3)} />
        </Select>
        <SubmitButton type="submit">영화 등록</SubmitButton>
      </MovieForm>
    </Container>
  );
}

export default Post;

const MovieForm = styled.form`
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-content: center;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 1.8rem;
`;

const Input = styled.input`
  padding: 5px 10px;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  height: 200px;
  border-radius: 5px;
`;

const Select = styled.select`
  width: fit-content;
`;

const SubmitButton = styled.button`
  color: ${COLORS.WHITE};
`;

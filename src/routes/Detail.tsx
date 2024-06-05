import styled from "@emotion/styled";
import { BiSolidLike } from "react-icons/bi";
import Container from "../components/Container";
import HomeButton from "../components/HomeButton";
import MoviePost from "../components/MoviePost";
import Options from "../components/Options";
import Rating from "../components/Rating";
import { OPTIONS_COUNTRY } from "../constants/Option";
import useDetail from "../hooks/useDetail";
import { COLORS } from "../styles/colors";
import { userId } from "../utils/userId";

function Detail() {
  const {
    data,
    movieName,
    movieImg,
    country,
    description,
    editReviewId,
    editReviewRate,
    editReviewText,
    reviewText,
    like,
    rate,
    isEditing,
    setIsEditing,
    handleCountry,
    handleDescription,
    handleEditRateChange,
    handleMovieDelete,
    handleMovieEdit,
    handleMovieImg,
    handleMovieName,
    handleRateChange,
    handleReviewSubmit,
    handleReviewChange,
    handleReviewDelete,
    handleReviewEdit,
    handleEditReviewChange,
    handleToggleLike,
    handleMovieValue,
    handleReviewValue,
  } = useDetail();

  if (!data) return <>데이터가 존재하지 않습니다.</>;

  return (
    <Container>
      <HomeButton />
      <MovieWrapper>
        <MoviePost width={200} height={300} src={data.image} alt={data.name} />
        <MovieInWrapper>
          <TitleWrapper>
            {isEditing ? (
              <EditWrapper>
                <EditInput value={movieName} onChange={handleMovieName} />
                <EditInput value={movieImg} onChange={handleMovieImg} />
                <EditTextArea
                  value={description}
                  onChange={handleDescription}
                />
                <select value={country} onChange={handleCountry}>
                  <Options data={OPTIONS_COUNTRY.slice(1, 3)} />
                </select>
              </EditWrapper>
            ) : (
              <>
                <MovieTitle>{data.name}</MovieTitle>
                <BiSolidLike
                  color={like ? COLORS.EDIT : COLORS.EMPTY_ICON}
                  size={20}
                  onClick={handleToggleLike}
                  style={{ cursor: "pointer" }}
                />
              </>
            )}
            {!isEditing && <Rating size={20} dataRate={data.rate || 0} />}
            {data.userId === userId && (
              <>
                {isEditing ? (
                  <>
                    <EditButton onClick={handleMovieEdit}>수정 완료</EditButton>
                    <DeleteButton onClick={() => setIsEditing(false)}>
                      취소
                    </DeleteButton>
                  </>
                ) : (
                  <>
                    <EditButton onClick={handleMovieValue}>수정</EditButton>
                    <DeleteButton onClick={handleMovieDelete}>
                      삭제
                    </DeleteButton>
                  </>
                )}
              </>
            )}
          </TitleWrapper>
          {!isEditing && <Description>{data.description}</Description>}
        </MovieInWrapper>
      </MovieWrapper>
      <ReviewContainer>
        <ReviewForm onSubmit={handleReviewSubmit}>
          <ReviewInput
            value={reviewText}
            onChange={handleReviewChange}
            placeholder="리뷰를 입력하세요"
          />
          <Rating size={20} dataRate={rate} onClick={handleRateChange} />
          <SubmitButton type="submit">리뷰 작성</SubmitButton>
        </ReviewForm>
        {data.reviews && data.reviews.length > 0 ? (
          data.reviews
            .map((review) => (
              <ReviewWrapper key={review.id}>
                {editReviewId === review.id ? (
                  <>
                    <ReviewInput
                      value={editReviewText}
                      onChange={handleEditReviewChange}
                    />
                    <Rating
                      size={20}
                      dataRate={editReviewRate}
                      onClick={handleEditRateChange}
                    />
                    <SubmitButton onClick={() => handleReviewEdit(review.id)}>
                      수정 완료
                    </SubmitButton>
                  </>
                ) : (
                  <>
                    <Review>
                      <Rating dataRate={review.rate} />
                      <ReviewText>{review.text}</ReviewText>
                    </Review>
                    {review.userId === userId && (
                      <ButtonWrapper>
                        <EditButton onClick={() => handleReviewValue(review)}>
                          수정
                        </EditButton>
                        <DeleteButton
                          onClick={() => handleReviewDelete(review.id)}
                        >
                          삭제
                        </DeleteButton>
                      </ButtonWrapper>
                    )}
                  </>
                )}
              </ReviewWrapper>
            ))
            .reverse()
        ) : (
          <Empty>리뷰가 없습니다.</Empty>
        )}
      </ReviewContainer>
    </Container>
  );
}

export default Detail;

const MovieWrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const MovieInWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MovieTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
`;

const Description = styled.p`
  font-size: 1.5rem;
`;

const ReviewContainer = styled.section`
  width: 600px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Review = styled.div`
  display: flex;
`;

const ReviewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const ReviewText = styled.span`
  margin-left: 10px;
  font-size: 1.5rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const DeleteButton = styled.button`
  background-color: ${COLORS.DELETE};
  color: ${COLORS.WHITE};
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
`;

const EditButton = styled.button`
  background-color: ${COLORS.EDIT};
  color: ${COLORS.WHITE};
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
`;

const ReviewForm = styled.form`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const ReviewInput = styled.input`
  width: 300px;
  border: 1px solid ${COLORS.WHITE};
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 10px;
`;

const SubmitButton = styled.button`
  background-color: ${COLORS.BROWN};
  color: ${COLORS.WHITE};
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
`;

const Empty = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  font-size: 1.5rem;
`;

const EditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditTextArea = styled.textarea`
  width: 320px;
  height: 150px;
  border-radius: 5px;
`;

const EditInput = styled.input`
  border-radius: 5px;
`;

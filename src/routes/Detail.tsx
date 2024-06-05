import styled from "@emotion/styled";
import { BiSolidLike } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import MoviePost from "../components/MoviePost";
import Container from "../components/common/Container";
import HomeButton from "../components/common/HomeButton";
import { RATE } from "../constants/Rate";
import useDetail from "../hooks/useDetail";
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
    setEditReviewId,
    setEditReviewRate,
    setEditReviewText,
    setIsEditing,
    setLike,
    handleCountry,
    handleDescription,
    handleEditRateChange,
    handleMovieDelete,
    handleMovieEdit,
    handleMovieEditInput,
    handleMovieImg,
    handleMovieName,
    handleRateChange,
    handleReviewSubmit,
    handleReviewChange,
    handleReviewDelete,
    handleReviewEdit,
    handleEditReviewChange,
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
                <input value={movieName} onChange={handleMovieName} />
                <input value={movieImg} onChange={handleMovieImg} />
                <textarea value={description} onChange={handleDescription} />
                <select value={country} onChange={handleCountry}>
                  <option value="korea">한국 영화</option>
                  <option value="foreign">외국 영화</option>
                </select>
              </EditWrapper>
            ) : (
              <>
                <MovieTitle>{data.name}</MovieTitle>
                <BiSolidLike
                  color={like ? "#43a800" : "#e4e5e9"}
                  size={20}
                  onClick={() => setLike((prev) => !prev)}
                  style={{ cursor: "pointer" }}
                />
              </>
            )}
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
                    <RateWrapper>
                      {RATE.map((star) => (
                        <FaStar
                          key={star}
                          color={
                            star <= (data.rate ?? 0) ? "#ffc107" : "#e4e5e9"
                          }
                          size={20}
                        />
                      ))}
                    </RateWrapper>
                    <EditButton onClick={handleMovieEditInput}>수정</EditButton>
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
      <ReviewWrapper>
        <ReviewForm onSubmit={handleReviewSubmit}>
          <ReviewInput
            value={reviewText}
            onChange={handleReviewChange}
            placeholder="리뷰를 입력하세요"
          />
          <StarRating>
            {RATE.map((star) => (
              <FaStar
                key={star}
                color={star <= rate ? "#ffc107" : "#e4e5e9"}
                size={20}
                onClick={() => handleRateChange(star)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </StarRating>
          <SubmitButton type="submit">리뷰 작성</SubmitButton>
        </ReviewForm>
        {data.reviews && data.reviews.length > 0 ? (
          data.reviews
            .map((review) => (
              <Review key={review.id}>
                {editReviewId === review.id ? (
                  <>
                    <ReviewInput
                      value={editReviewText}
                      onChange={handleEditReviewChange}
                    />
                    <StarRating>
                      {RATE.map((star) => (
                        <FaStar
                          key={star}
                          color={star <= editReviewRate ? "#ffc107" : "#e4e5e9"}
                          size={20}
                          onClick={() => handleEditRateChange(star)}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </StarRating>
                    <SubmitButton onClick={() => handleReviewEdit(review.id)}>
                      수정 완료
                    </SubmitButton>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex" }}>
                      <StarRating>
                        {RATE.map((star) => (
                          <FaStar
                            key={star}
                            color={star <= review.rate ? "#ffc107" : "#e4e5e9"}
                            size={10}
                          />
                        ))}
                      </StarRating>
                      <ReviewText>{review.text}</ReviewText>
                    </div>
                    {review.userId === userId && (
                      <ButtonWrapper>
                        <EditButton
                          onClick={() => {
                            setEditReviewId(review.id);
                            setEditReviewText(review.text);
                            setEditReviewRate(review.rate);
                          }}
                        >
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
              </Review>
            ))
            .reverse()
        ) : (
          <Empty>리뷰가 없습니다.</Empty>
        )}
      </ReviewWrapper>
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

const RateWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 5px;
`;

const Description = styled.p`
  font-size: 1.5rem;
`;

const ReviewWrapper = styled.section`
  width: 600px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Review = styled.div`
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
  background-color: #ff6a6a;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
`;

const EditButton = styled.button`
  background-color: #7474ff;
  color: #fff;
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
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 10px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const SubmitButton = styled.button`
  background-color: #43a800;
  color: #fff;
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

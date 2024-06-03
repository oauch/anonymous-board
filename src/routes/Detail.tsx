import styled from "@emotion/styled";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MoviePost from "../components/MoviePost";
import Container from "../components/common/Container";
import { MoviesProps, ReviewProps } from "../types/Movies";

function Detail() {
  const [data, setData] = useState<MoviesProps | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewId, setEditReviewId] = useState<number | null>(null);
  const params = useParams();

  const generateUserId = () => {
    const newUserId = `user-${Date.now()}`;
    localStorage.setItem("userId", newUserId);
    return newUserId;
  };

  const userId = localStorage.getItem("userId") || generateUserId();

  const handleReviewChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReviewText(e.target.value);
  };

  const handleEditReviewChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditReviewText(e.target.value);
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reviewText || !data) return;

    const newReview: ReviewProps = {
      id: Date.now(),
      text: reviewText,
      userId: userId,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/movies/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviews: [...(data.reviews || []), newReview],
          }),
        }
      );

      if (response.ok) {
        const updatedMovie = await response.json();
        setData(updatedMovie);
        setReviewText("");
      } else {
        console.error("Failed to add review");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewDelete = async (reviewId: number) => {
    if (!data) return;
    const updatedReviews = (data.reviews || []).filter(
      (review) => review.id !== reviewId
    );

    try {
      const response = await fetch(
        `http://localhost:3001/movies/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviews: updatedReviews,
          }),
        }
      );

      if (response.ok) {
        const updatedMovie = await response.json();
        setData(updatedMovie);
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewEdit = async (reviewId: number) => {
    if (!data || !editReviewText) return;
    const updatedReviews = (data.reviews || []).map((review) =>
      review.id === reviewId ? { ...review, text: editReviewText } : review
    );

    try {
      const response = await fetch(
        `http://localhost:3001/movies/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviews: updatedReviews,
          }),
        }
      );

      if (response.ok) {
        const updatedMovie = await response.json();
        setData(updatedMovie);
        setEditReviewId(null);
        setEditReviewText("");
      } else {
        console.error("Failed to edit review");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/movies/${params.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [params.id]);

  if (!data) return <>데이터가 존재하지 않습니다.</>;

  return (
    <Container>
      <BackButton to={"/"}>뒤로가기</BackButton>
      <MovieWrapper>
        <MoviePost width={200} height={300} src={data.image} alt={data.name} />
        <div>
          <MovieTitle>{data.name}</MovieTitle>
          <>{data.rate}</>
          <Description>{data.description}</Description>
        </div>
      </MovieWrapper>
      <ReviewWrapper>
        <ReviewForm onSubmit={handleReviewSubmit}>
          <ReviewInput
            value={reviewText}
            onChange={handleReviewChange}
            placeholder="리뷰를 입력하세요"
          />
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
                    <SubmitButton onClick={() => handleReviewEdit(review.id)}>
                      수정 완료
                    </SubmitButton>
                  </>
                ) : (
                  <>
                    <ReviewText>{review.text}</ReviewText>
                    {review.userId === userId && (
                      <ButtonWrapper>
                        <EditButton
                          onClick={() => {
                            setEditReviewId(review.id);
                            setEditReviewText(review.text);
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

const BackButton = styled(Link)`
  font-size: 1.5rem;
  color: #fff;
  text-decoration: none;
`;

const MovieTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
`;

const Description = styled.p`
  font-size: 1.5rem;
`;

const ReviewWrapper = styled.section`
  width: 500px;
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

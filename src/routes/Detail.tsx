import styled from "@emotion/styled";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import MoviePost from "../components/MoviePost";
import Container from "../components/common/Container";
import { MoviesProps, ReviewProps } from "../types/Movies";

const RATE = [1, 2, 3, 4, 5];

function Detail() {
  const [data, setData] = useState<MoviesProps | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewId, setEditReviewId] = useState<number | null>(null);

  const [rate, setRate] = useState(0);
  const [editReviewRate, setEditReviewRate] = useState(0);
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

  const handleRateChange = (rate: number) => {
    setRate(rate);
  };

  const handleEditRateChange = (rate: number) => {
    setEditReviewRate(rate);
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reviewText || !data || rate === 0) return;

    const newReview: ReviewProps = {
      id: Date.now(),
      text: reviewText,
      userId: userId,
      rate: rate,
    };

    // 기존 리뷰와 새로운 리뷰를 합친 리스트
    const updatedReviews = [...(data.reviews || []), newReview];

    // 새로운 리뷰가 추가된 후의 평균 평점 계산
    const totalRate = updatedReviews.reduce(
      (sum, review) => sum + review.rate,
      0
    );
    const averageRate = Math.floor(totalRate / updatedReviews.length);

    try {
      const response = await fetch(
        `http://localhost:3001/movies/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rate: averageRate,
            reviews: updatedReviews,
          }),
        }
      );

      if (response.ok) {
        const updatedMovie = await response.json();
        setData(updatedMovie);
        setReviewText("");
        setRate(0);
      } else {
        console.error("Failed to add review");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewEdit = async (reviewId: number) => {
    if (!data || !editReviewText || !editReviewRate) return;
    const updatedReviews = (data.reviews || []).map((review) =>
      review.id === reviewId
        ? { ...review, text: editReviewText, rate: editReviewRate }
        : review
    );

    // 새로운 리뷰가 추가된 후의 평균 평점 계산
    const totalRate = updatedReviews.reduce(
      (sum, review) => sum + review.rate,
      0
    );

    const averageRate = Math.floor(totalRate / updatedReviews.length);

    try {
      const response = await fetch(
        `http://localhost:3001/movies/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rate: averageRate,
            reviews: updatedReviews,
          }),
        }
      );

      if (response.ok) {
        const updatedMovie = await response.json();
        setData(updatedMovie);
        setEditReviewId(null);
        setEditReviewText("");
        setEditReviewRate(0);
      } else {
        console.error("Failed to edit review");
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

    // 새로운 리뷰가 추가된 후의 평균 평점 계산
    const totalRate = updatedReviews.reduce(
      (sum, review) => sum + review.rate,
      0
    );

    const averageRate = Math.floor(totalRate / updatedReviews.length);

    try {
      const response = await fetch(
        `http://localhost:3001/movies/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rate: averageRate,
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

  useEffect(() => {
    if (data && data.reviews.length > 0) {
      const totalRate = data.reviews.reduce(
        (sum, review) => sum + review.rate,
        0
      );
      const averageRate = Math.floor(totalRate / data.reviews.length);

      setData((prevData) => {
        if (prevData) {
          return { ...prevData, rate: averageRate };
        }
        return prevData;
      });
    }
    if (data?.reviews.length === 0) {
      setData((prevData) => {
        if (prevData) {
          return { ...prevData, rate: 0 };
        }
        return prevData;
      });
    }
  }, [data?.reviews]);

  if (!data) return <>데이터가 존재하지 않습니다.</>;

  return (
    <Container>
      <BackButton to={"/"}>뒤로가기</BackButton>
      <MovieWrapper>
        <MoviePost width={200} height={300} src={data.image} alt={data.name} />
        <MovieInWrapper>
          <MovieTitle>{data.name}</MovieTitle>
          <RateWrapper>
            {RATE.map((star) => (
              <FaStar
                key={star}
                color={star <= data.rate ? "#ffc107" : "#e4e5e9"}
                size={20}
              />
            ))}
          </RateWrapper>
          <Description>{data.description}</Description>
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

const BackButton = styled(Link)`
  font-size: 1.5rem;
  color: #fff;
  text-decoration: none;
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

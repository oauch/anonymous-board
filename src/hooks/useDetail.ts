import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoviesProps, ReviewProps } from "../types/Movies";
import { userId } from "../utils/userId";
import useMovieInfo from "./useMovieInfo";

function useDetail() {
  const {
    movieName,
    movieImg,
    description,
    country,
    setCountry,
    setDescription,
    setMovieImg,
    setMovieName,
    handleMovieName,
    handleMovieImg,
    handleDescription,
    handleCountry,
  } = useMovieInfo("");

  const [data, setData] = useState<MoviesProps | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewId, setEditReviewId] = useState<number | null>(null);
  const [rate, setRate] = useState(0);
  const [editReviewRate, setEditReviewRate] = useState(0);
  const [like, setLike] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

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

  const handleToggleLike = async () => {
    if (!data) return;

    const updatedLikes = (data.likes || []).map((likeObj) =>
      likeObj.userId === userId ? { ...likeObj, like: !like } : likeObj
    );

    if (!updatedLikes.some((likeObj) => likeObj.userId === userId)) {
      updatedLikes.push({ userId, like: true });
    }

    try {
      const response = await fetch(
        `http://localhost:3001/movies/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ likes: updatedLikes }),
        }
      );

      if (response.ok) {
        const updatedMovie = await response.json();
        setData(updatedMovie);
        setLike(!like);
      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * handleMovieEdit
   * @param e: Form 이벤트
   * @description 영화 수정하기
   */
  const handleMovieEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    if (!movieName || !movieImg || !description)
      return alert("비어있는 입력 칸이 있습니다.");

    const editMovie: MoviesProps = {
      ...data,
      name: movieName,
      image: movieImg,
      description: description,
      country: country,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/movies/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editMovie),
        }
      );

      if (response.ok) {
        const updatedMovie = await response.json();
        setData(updatedMovie);
        setIsEditing(false);
      } else {
        console.error("Failed to add review");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * handleMovieDelete
   * @description 영화 삭제하기
   */
  const handleMovieDelete = async () => {
    if (!data) return;
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      const response = await fetch(
        `http://localhost:3001/movies/${params.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const updatedMovie = await response.json();
        setData(updatedMovie);
        navigate("/");
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * handleReviewSubmit
   * @param e: Form 이벤트
   * @description 리뷰 작성하기
   */
  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reviewText || !data || rate === 0)
      return alert("비어 있는 입력이 있습니다.");

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

  /**
   * handleReviewEdit
   * @param reviewId: number
   * @description 리뷰 수정하기
   */
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

  /**
   * 리뷰 삭제하기
   * @param reviewId: number
   * @description 리뷰 삭제하기
   */
  const handleReviewDelete = async (reviewId: number) => {
    if (!data) return;
    if (!window.confirm("삭제하시겠습니까?")) return;
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

  // 영화 수정하기 버튼 누르면, input 값 세팅
  const handleMovieValue = () => {
    if (data) {
      setMovieName(data.name);
      setMovieImg(data.image);
      setDescription(data.description);
      setCountry(data.country);
      setIsEditing(true);
    }
  };

  const handleReviewValue = (review: ReviewProps) => {
    setEditReviewId(review.id);
    setEditReviewText(review.text);
    setEditReviewRate(review.rate);
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
        const userLike = data.likes
          ? data.likes.find((val: { userId: string }) => val.userId === userId)
          : null;
        setLike(userLike ? userLike.like : false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (data && data.reviews && data.reviews.length > 0) {
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
    if (data?.reviews && data.reviews.length === 0) {
      setData((prevData) => {
        if (prevData) {
          return { ...prevData, rate: 0 };
        }
        return prevData;
      });
    }
  }, [data?.reviews]);

  return {
    data,
    isEditing,
    movieName,
    movieImg,
    description,
    country,
    handleMovieName,
    handleMovieImg,
    handleDescription,
    handleCountry,
    like,
    handleMovieEdit,
    setIsEditing,
    handleMovieValue,
    handleMovieDelete,
    reviewText,
    handleReviewChange,
    handleRateChange,
    editReviewId,
    editReviewText,
    handleEditReviewChange,
    editReviewRate,
    handleEditRateChange,
    handleReviewEdit,
    setEditReviewId,
    setEditReviewText,
    setEditReviewRate,
    handleReviewDelete,
    rate,
    handleReviewSubmit,
    handleToggleLike,
    handleReviewValue,
  };
}

export default useDetail;

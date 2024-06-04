import styled from "@emotion/styled";
import { ChangeEvent, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import MoviePost from "../components/MoviePost";
import Container from "../components/common/Container";
import { RATE } from "../constants/Rate";
import { MoviesProps } from "../types/Movies";

function Main() {
  const [data, setData] = useState<MoviesProps[]>([]);
  const [searchVal, setSearchVal] = useState("");
  const [viewType, setViewType] = useState("list");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/movies", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const filterData = data.filter((val) =>
    val.name.toLowerCase().includes(searchVal)
  );

  // 오래된 순
  console.log(filterData.map((val) => val.registeredDate).sort());

  // 최신 순
  console.log(
    filterData
      .map((val) => val.registeredDate)
      .sort()
      .reverse()
  );

  return (
    <Container>
      <Title>영화 익명리뷰 게시판</Title>
      <Search
        value={searchVal}
        onChange={handleSearch}
        placeholder="영화 제목을 입력해주세요."
      />
      <Link to={"/post"} style={{ color: "#fff" }}>
        영화 등록
      </Link>
      <ViewTypeWrapper>
        <ViewType onClick={() => setViewType("list")}>리스트</ViewType>
        <ViewType onClick={() => setViewType("card")}>카드</ViewType>
      </ViewTypeWrapper>
      <MovieWrapper viewType={viewType}>
        {filterData.map((val) =>
          viewType === "list" ? (
            <List key={val.id} to={`/${val.id}`}>
              <MovieTitle>{val.name}</MovieTitle>
              <RateWrapper>
                {RATE.map((star) => (
                  <FaStar
                    key={star}
                    color={star <= (val.rate ?? 0) ? "#ffc107" : "#e4e5e9"}
                    size={10}
                  />
                ))}
              </RateWrapper>
            </List>
          ) : (
            <Card key={val.id} to={`/${val.id}`}>
              <PostWrapper
                style={{
                  display: "inline-block",
                  width: "200px",
                  height: "300px",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <MoviePost animation={true} src={val.image} alt={val.name} />
              </PostWrapper>
              <MovieInWrapper>
                <MovieTitle>{val.name}</MovieTitle>
                <RateWrapper>
                  {RATE.map((star) => (
                    <FaStar
                      key={star}
                      color={star <= (val.rate ?? 0) ? "#ffc107" : "#e4e5e9"}
                      size={10}
                    />
                  ))}
                </RateWrapper>
              </MovieInWrapper>
            </Card>
          )
        )}
      </MovieWrapper>
    </Container>
  );
}

export default Main;

const Title = styled.h1`
  font-size: 3rem;
`;

const Search = styled.input`
  margin-top: 20px;
  border: 1px solid #43a800;
  border-radius: 5px;

  padding: 5px 10px;
`;

const ViewTypeWrapper = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top: 50px;

  gap: 20px;
`;

const ViewType = styled.button`
  font-size: 1.5rem;

  color: #484848;
  background-color: #94ff4d;
  padding: 5px 10px;
  border-radius: 10px;
`;

const MovieWrapper = styled.div<{ viewType: string }>`
  width: 100%;
  height: 500px;
  margin-top: 50px;
  display: flex;
  flex-direction: ${({ viewType }) => (viewType === "list" ? "column" : "row")};
  flex-wrap: ${({ viewType }) => (viewType === "list" ? "no-wrap" : "wrap")};
  justify-content: ${({ viewType }) =>
    viewType === "list" ? "flex-start" : "center"};
  align-items: center;

  gap: ${({ viewType }) => (viewType === "list" ? "10px" : "50px")};
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const List = styled(Link)`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  padding: 10px;

  color: #fff;
  text-align: center;
  text-decoration: none;
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 15px;

  text-decoration: none;
  color: #fff;
`;

const PostWrapper = styled.div`
  display: inline-block;
  width: 200px;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
`;

const MovieInWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MovieTitle = styled.div`
  font-size: 2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
    scale: 1.1;
  }
`;

const RateWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

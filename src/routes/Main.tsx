import styled from "@emotion/styled";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import MoviePost from "../components/MoviePost";
import Container from "../components/common/Container";
import { RATE } from "../constants/Rate";
import useMain from "../hooks/useMain";

function Main() {
  const {
    handleCountry,
    handleSearch,
    handleSortChange,
    searchVal,
    setViewType,
    sortedData,
    viewType,
  } = useMain();

  return (
    <Container>
      <Title>영화 익명리뷰 게시판</Title>
      <Search
        value={searchVal}
        onChange={handleSearch}
        placeholder="영화 제목을 입력해주세요."
      />
      <SelectWrapper>
        <Select onChange={handleSortChange}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된 순</option>
        </Select>
        <Select onChange={handleCountry}>
          <option value="all">모두</option>
          <option value="korea">한국 영화</option>
          <option value="foreign">외국 영화</option>
        </Select>
      </SelectWrapper>
      <PostMovie to={"/post"}>영화 등록</PostMovie>
      <ViewTypeWrapper>
        <ViewType onClick={() => setViewType("list")}>리스트</ViewType>
        <ViewType onClick={() => setViewType("card")}>카드</ViewType>
      </ViewTypeWrapper>
      <MovieWrapper viewType={viewType}>
        {sortedData.map((val) =>
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

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
`;

const Select = styled.select`
  border-radius: 4px;
  background-color: #f8f8f8;

  color: #333;
  outline: none;

  &:focus {
    border-color: #43a800;
  }
`;

const PostMovie = styled(Link)`
  all: unset;
  position: absolute;
  right: 20px;
  top: 20px;
  padding: 5px 10px;
  font-size: 1.5rem;

  cursor: pointer;
  border-radius: 10px;
  color: #000;
  background-color: #94ff4d;
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

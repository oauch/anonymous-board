import styled from "@emotion/styled";
import { Link } from "react-router-dom";

function HomeButton() {
  return <Button to={"/"}>홈으로</Button>;
}

export default HomeButton;

const Button = styled(Link)`
  all: unset;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

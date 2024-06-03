import styled from "@emotion/styled";
import { ReactNode } from "react";

type ContainerProp = {
  children: ReactNode;
};

function Container({ children }: ContainerProp) {
  return <Wrapper>{children}</Wrapper>;
}

export default Container;

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 20px;
`;

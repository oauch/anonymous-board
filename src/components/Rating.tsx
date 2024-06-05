import styled from "@emotion/styled";
import { FaStar } from "react-icons/fa";
import { RATE } from "../constants/Rate";
import { COLORS } from "../styles/colors";

type RatingProp = {
  dataRate: number;
  size?: number;
  onClick?: (star: number) => void;
};

function Rating({ size, dataRate, onClick }: RatingProp) {
  return (
    <Wrapper>
      {RATE.map((star) => (
        <FaStar
          key={star}
          onClick={onClick ? () => onClick(star) : undefined}
          color={star <= dataRate ? COLORS.STAR : COLORS.EMPTY_ICON}
          size={size ?? 10}
          style={onClick && { cursor: "pointer" }}
        />
      ))}
    </Wrapper>
  );
}

export default Rating;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

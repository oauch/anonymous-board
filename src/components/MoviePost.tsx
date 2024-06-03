import styled from "@emotion/styled";

type MoviePostProps = {
  animation?: boolean;
  width?: number;
  height?: number;
  src?: string;
  alt?: string;
};

function MoviePost({ animation, src, alt, width, height }: MoviePostProps) {
  return (
    <Image
      animation={animation || false}
      width={width || "100%"}
      height={height || "100%"}
      src={src}
      alt={alt}
    />
  );
}

export default MoviePost;

const Image = styled.img<{ animation: boolean }>`
  display: block;

  ${({ animation }) => {
    return (
      animation === true &&
      `transition: all 0.2s ease-in-out;
        &:hover {
        scale: 1.1;
      }`
    );
  }}
`;

import { styled } from "@mui/material";

export const Triangle = () => {
  return (
    <TriangleHost>
      <TriangleElement />
    </TriangleHost>
  );
};

const TriangleHost = styled("span")``;

const TriangleElement = styled("span")`
  position: absolute;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 22px solid ${(p) => p.theme.palette.primary.main};
  height: 0;
  width: 0;
  left: 8px;
  bottom: -18px;

  &:after {
    content: "";
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 22px solid ${(p) => p.theme.palette.common.white};
    position: absolute;
    left: -10px;
    top: 10px;
    z-index: 3;
  }
`;

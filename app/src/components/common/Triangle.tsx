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
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-bottom: 16px solid ${(p) => p.theme.palette.primary.main};
  height: 0;
  width: 0;

  &:after {
    content: "";
    width: 0;
    height: 0;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    border-bottom: 16px solid ${(p) => p.theme.palette.common.white};
    position: absolute;
    left: -16px;
    top: 5px;
    z-index: 3;
  }
`;

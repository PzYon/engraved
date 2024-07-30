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
  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  border-bottom: 22px solid ${(p) => p.theme.palette.primary.main};
  height: 0;
  width: 0;
  left: 8px;
  bottom: -18px;

  &:after {
    content: "";
    width: 0;
    height: 0;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-bottom: 22px solid ${(p) => p.theme.palette.common.white};
    position: absolute;
    left: -11px;
    top: 9px;
    z-index: 3;
  }
`;

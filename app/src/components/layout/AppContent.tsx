import styled from "styled-components";
import { maxWidthInPx } from "../common/useDeviceWidth";

export const AppContent = styled.div`
  max-width: ${maxWidthInPx}px;
  box-sizing: border-box;
  margin: auto;
`;

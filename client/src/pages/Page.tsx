import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { Closer } from "../common/Closer";
import { DomUtil } from "../common/DomUtil";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { FaderContainer } from "../common/FaderContainer";
import { useDidMount, useTheme } from "../common/Hooks";

const Title = styled.h2`
  font-weight: ${p => p.theme.font.weight.bold};
  font-size: ${p => p.theme.font.size.large};
  color: ${p => p.theme.colors.accent};
  margin: 0 0 ${p => p.theme.defaultSpacing} 0;
`;

export interface IPageProps {
  children: ReactNode;
  title?: ReactNode;
  browserTitle?: string;
  noCloser?: boolean;
  backgroundColor?: string;
}

export const Page = (props: IPageProps) => {
  const theme = useTheme();

  useDidMount(() => {
    document.title = props.browserTitle
      ? "engraved. - " + props.browserTitle
      : "engraved.";
    document.body.style.backgroundColor =
      props.backgroundColor || theme.colors.pageBackground;
  });

  return (
    <FaderContainer style={{ padding: theme.defaultSpacing }}>
      <ErrorBoundary>
        {!props.noCloser && (
          <Closer
            onClose={() => window.history.back()}
            title={"Back to previous page"}
          />
        )}
        {DomUtil.shouldRender(props.title) && <Title>{props.title}</Title>}
        {props.children}
      </ErrorBoundary>
    </FaderContainer>
  );
};

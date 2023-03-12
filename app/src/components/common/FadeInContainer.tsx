import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import styled from "styled-components";

export const FadeInContainer = (props: {
  style?: CSSProperties;
  children: ReactNode;
}) => {
  const containerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => (containerEl.current.style.opacity = "1"));
  }, []);

  return (
    <ContainerSection style={props.style} ref={containerEl}>
      {props.children}
    </ContainerSection>
  );
};

const ContainerSection = styled.section`
  opacity: 0;
  transition: opacity 700ms;
`;

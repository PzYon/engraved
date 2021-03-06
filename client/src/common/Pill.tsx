import * as React from "react";
import styled, {
  css,
  DefaultTheme,
  ThemedStyledProps
} from "styled-components";

export interface IPillProps {
  onClick?: () => void;
  label: string;
  tooltip?: string;
  className?: string;
  isSecondary?: boolean;
}

export const Pill = (props: IPillProps) => (
  <ContainerSpan
    className={props.className}
    hasOnClick={!!props.onClick}
    onClick={() => (props.onClick ? props.onClick() : undefined)}
    isSecondary={props.isSecondary}
    title={props.tooltip}
  >
    {props.label}
  </ContainerSpan>
);

export const PillMargin: string = "3px";

type IContainerSpanProps = ThemedStyledProps<
  {
    hasOnClick: boolean;
    isSecondary?: boolean;
  },
  DefaultTheme
>;

const ContainerSpan = styled.span<IContainerSpanProps>`
  background-color: ${(props: IContainerSpanProps) =>
    props.isSecondary
      ? p => p.theme.colors.palette.shades.dark
      : p => p.theme.colors.accent};
  color: ${(props: IContainerSpanProps) =>
    props.isSecondary
      ? p => p.theme.colors.text
      : p => p.theme.colors.accentContrast};
  font-size: ${p => p.theme.font.size.small};
  padding: 0 9px;
  margin: ${PillMargin};
  word-wrap: break-word;
  border-radius: ${p => p.theme.borderRadius};

  ${(props: IContainerSpanProps) =>
    props.hasOnClick
      ? css`
          cursor: pointer;
          box-shadow: ${props.theme.discreetBoxShadow};
        `
      : css``};
`;

import React from "react";
import { IPropertyDefinition } from "./IPropertyDefinition";
import { styled, Typography } from "@mui/material";
import { MuiTheme } from "../../theming/engravedTheme";

export const Properties: React.FC<{ properties: IPropertyDefinition[] }> = ({
  properties,
}) => {
  const visibleProps = properties.filter((p) => !p.hideWhen || !p.hideWhen());

  if (!visibleProps.length) {
    return null;
  }

  return (
    <Host>
      {visibleProps.map((p) => (
        <Property as="span" key={p.key} className="ngrvd-property">
          <span className={p.highlightStyle?.() ?? ""}>
            {p.label ? (
              <Typography component="span" sx={{ fontWeight: "200" }}>
                {p.label}{" "}
              </Typography>
            ) : null}

            <Typography component="span" sx={{ color: "primary.main" }}>
              {p.node()}
            </Typography>
          </span>
        </Property>
      ))}
    </Host>
  );
};

const Host = styled("span")`
  display: flex;
  height: 100%;
  align-items: center;
  flex-wrap: wrap;

  .ngrvd-property {
    display: inline-flex;
    align-items: center;

    &:not(:last-of-type)::after {
      content: "\\00B7";
      margin: 0 0.6rem;
    }
  }
`;

const Property = styled(Typography)`
  word-break: break-word;
  height: 100%;

  .green {
    background-color: lightgreen;
    border-radius: 45px;
    padding: 0 8px;
    display: flex;
    gap: 5px;
    white-space: nowrap;
  }

  .yellow {
    background-color: #ffff8f;
    border-radius: 45px;
    padding: 0 8px;
    display: flex;
    gap: 5px;
    white-space: nowrap;
  }

  .red {
    background-color: #fbceb1;
    border-radius: 45px;
    padding: 0 8px;
    display: flex;
    gap: 5px;
    white-space: nowrap;
  }

  .transparent {
    border: 1px solid ${(p: MuiTheme) => p.theme.palette.primary.main};
    border-radius: 45px;
    padding: 0 8px;
    display: flex;
    gap: 5px;
    white-space: nowrap;
  }
`;

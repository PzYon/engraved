import React from "react";
import { IPropertyDefinition } from "./IPropertyDefinition";
import { styled, Typography } from "@mui/material";

export const Properties: React.FC<{ properties: IPropertyDefinition[] }> = ({
  properties,
}) => {
  return (
    <Host>
      {properties
        .filter((p) => !p.hideWhen || !p.hideWhen())
        .map((p) => (
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

const Host = styled("div")`
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
    border-radius: 4px;
    padding: 0 5px;
  }

  .yellow {
    background-color: #ffff8f;
    border-radius: 4px;
    padding: 0 5px;
  }

  .red {
    background-color: #fbceb1;
    border-radius: 4px;
    padding: 0 5px;
  }
`;

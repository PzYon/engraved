import React from "react";
import { IPropertyDefinition } from "./IPropertyDefinition";
import { styled, Typography } from "@mui/material";

export const Properties: React.FC<{ properties: IPropertyDefinition[] }> = ({
  properties,
}) => (
  <Host>
    {properties
      .filter((p) => !p.hideWhen || !p.hideWhen())
      .map((p) => (
        <span className="ngrvd-property" key={p.key}>
          <Property as="span">
            {p.label ? (
              <Typography component="span" sx={{ fontWeight: "200" }}>
                {p.label}{" "}
              </Typography>
            ) : null}

            <Typography sx={{ color: "primary.main" }} component="span">
              {p.node}
            </Typography>
          </Property>
        </span>
      ))}
  </Host>
);

const Host = styled("div")`
  .ngrvd-property {
    display: inline-block;

    &:not(:last-of-type)::after {
      content: "\\00B7";
      margin: 0 0.6rem;
    }
  }
`;

const Property = styled(Typography)`
  word-break: break-word;
  height: 100%;
`;

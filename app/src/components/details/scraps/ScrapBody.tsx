import React from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { styled, Typography } from "@mui/material";
import { FormatDate } from "../../common/FormatDate";
import { Actions } from "../../common/Actions";
import { DeleteOutlined } from "@mui/icons-material";

export const ScrapBody: React.FC<{
  scrapId: string;
  scrapDate: string;
  hideDate: boolean;
  children: React.ReactNode;
  actions: IIconButtonAction[];
}> = ({ scrapId, scrapDate, hideDate, children, actions }) => {
  return (
    <>
      {children}

      <FooterContainer>
        {hideDate ? null : (
          <Typography fontSize="small" component="span" sx={{ mr: 2 }}>
            {scrapDate ? <FormatDate value={scrapDate} /> : "now"}
          </Typography>
        )}

        <Actions
          actions={[
            ...actions,
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined fontSize="small" />,
              href: `measurements/${scrapId}/delete`,
            },
          ]}
        />
      </FooterContainer>
    </>
  );
};

const FooterContainer = styled("div")`
  display: flex;
  justify-content: end;
  align-items: center;
`;

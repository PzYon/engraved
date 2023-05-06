import React from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { styled, Typography } from "@mui/material";
import { FormatDate } from "../../common/FormatDate";
import { Actions } from "../../common/Actions";
import { DeleteOutlined } from "@mui/icons-material";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";

export const ScrapBody: React.FC<{
  scrap: IScrapMeasurement;
  hideDate: boolean;
  children: React.ReactNode;
  actions: IIconButtonAction[];
}> = ({ scrap, hideDate, children, actions }) => {
  return (
    <>
      {children}

      <FooterContainer>
        {hideDate ? null : (
          <Typography fontSize="small" component="span" sx={{ mr: 2 }}>
            {scrap.dateTime ? <FormatDate value={scrap.dateTime} /> : "now"}
          </Typography>
        )}

        <Actions
          actions={[
            ...actions,
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined fontSize="small" />,
              href: `/metric/${scrap.metricId}/measurements/${scrap.id}/delete`,
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

import React from "react";
import { IScrapMeasurement } from "../../../../serverApi/IScrapMeasurement";
import { useAppContext } from "../../../../AppContext";
import { ScrapBody } from "../ScrapBody";
import { ContentCopyOutlined } from "@mui/icons-material";
import { ScrapMarkdown } from "./ScrapMarkdown";

export const ScrapMarkdownBody: React.FC<{
  scrap: IScrapMeasurement;
  hideDate: boolean;
  editMode: boolean;
  value: string;
  onChange: (value: string) => void;
}> = ({ scrap, hideDate, editMode, value, onChange }) => {
  const { setAppAlert } = useAppContext();

  return (
    <ScrapBody
      scrapId={scrap.id}
      scrapDate={scrap.dateTime}
      hideDate={hideDate}
      actions={[
        {
          key: "copy",
          label: "Copy",
          icon: <ContentCopyOutlined fontSize="small" />,
          onClick: async () => {
            await navigator.clipboard.writeText(value);
            setAppAlert({
              type: "success",
              title: "Successfully copied text to clipboard.",
              hideDurationSec: 1,
            });
          },
        },
      ]}
    >
      <ScrapMarkdown isEditMode={editMode} value={value} onChange={onChange} />
    </ScrapBody>
  );
};

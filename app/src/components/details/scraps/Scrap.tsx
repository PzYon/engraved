import React, { CSSProperties, useEffect, useState } from "react";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import { useAppContext } from "../../../AppContext";
import { Button } from "@mui/material";
import { ScrapInner } from "./ScrapInner";

export const Scrap: React.FC<{
  scrap: IScrapMeasurement;
  hideDate?: boolean;
  hideActions?: boolean;
  onSuccess?: () => void;
  style?: CSSProperties;
}> = ({ scrap: currentScrap, hideDate, hideActions, onSuccess, style }) => {
  const { setAppAlert } = useAppContext();

  const [notes, setNotes] = useState<string>(currentScrap.notes);
  const [title, setTitle] = useState<string>(currentScrap.title);
  const [scrapToRender, setScrapToRender] = useState(currentScrap);

  const [isEditMode, setIsEditMode] = useState(!scrapToRender.id);

  useEffect(() => {
    if (
      !currentScrap.editedOn ||
      currentScrap.editedOn === scrapToRender.editedOn
    ) {
      return;
    }

    if (!isEditMode) {
      updateScrapInState();
      return;
    }

    setAppAlert({
      message: (
        <>
          <div>Would you like to update? Any changes will be lost.</div>
          <div style={{ margin: "8px 0" }}>
            <Button
              sx={{
                color: "common.white",
                border: "1px solid white;",
                marginRight: "10px",
              }}
              variant={"outlined"}
              onClick={() => {
                updateScrapInState();
                setAppAlert(null);
              }}
            >
              YES
            </Button>

            <Button
              sx={{
                color: "common.white",
                border: "1px solid white;",
                paddingRight: "10px",
              }}
              variant={"outlined"}
              onClick={() => {
                setAppAlert(null);
              }}
            >
              NO
            </Button>
          </div>
        </>
      ),
      type: "info",
      hideDurationSec: 2,
      title: "Scrap has changed...",
    });
  }, [currentScrap]);

  return (
    <ScrapInner
      scrap={scrapToRender}
      title={title}
      setTitle={setTitle}
      notes={notes}
      setNotes={setNotes}
      isEditMode={isEditMode}
      setIsEditMode={setIsEditMode}
      hideDate={hideDate}
      hideActions={hideActions}
      onSuccess={onSuccess}
      style={style}
    />
  );

  function updateScrapInState() {
    setScrapToRender(currentScrap);
    setTitle(currentScrap.title);
    setNotes(currentScrap.notes);
  }
};

import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import { useAppContext } from "../../../AppContext";
import { Button, styled } from "@mui/material";
import { ScrapInner } from "./ScrapInner";

import { ScrapWrapper } from "./ScrapWrapper";
import { IUpsertScrapsMeasurementCommand } from "../../../serverApi/commands/IUpsertScrapsMeasurementCommand";
import { useUpsertMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useUpsertMeasurementMutation";
import { MetricType } from "../../../serverApi/MetricType";
import { PageSection } from "../../layout/pages/PageSection";

export const Scrap: React.FC<{
  scrap: IScrapMeasurement;
  hideDate?: boolean;
  hideActions?: boolean;
  onSuccess?: () => void;
  style?: CSSProperties;
  addScrapWrapper?: (scrapWrapper: ScrapWrapper) => void;
  index?: number;
  withoutSection?: boolean;
  onClick?: () => void;
}> = ({
  scrap: currentScrap,
  hideDate,
  hideActions,
  onSuccess,
  style,
  addScrapWrapper,
  index,
  withoutSection,
  onClick,
}) => {
  const { setAppAlert } = useAppContext();

  const [notes, setNotes] = useState<string>(currentScrap.notes);
  const [title, setTitle] = useState<string>(currentScrap.title);
  const [scrapToRender, setScrapToRender] = useState(currentScrap);

  const [isEditMode, setIsEditMode] = useState(!scrapToRender.id);

  const domElementRef = useRef<HTMLDivElement>();

  const upsertMeasurementMutation = useUpsertMeasurementMutation(
    currentScrap.metricId,
    MetricType.Scraps,
    currentScrap.id
  );

  useEffect(() => {
    if (!addScrapWrapper) {
      return;
    }

    addScrapWrapper(
      new ScrapWrapper(
        domElementRef,
        currentScrap,
        () => setIsEditMode(!isEditMode),
        upsertScrap
      )
    );
  }, [isEditMode, notes, title, currentScrap.editedOn]);

  useEffect(() => {
    if (
      !currentScrap.editedOn ||
      currentScrap.editedOn === scrapToRender.editedOn ||
      (currentScrap.notes === notes && currentScrap.title === title)
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

  const Container = withoutSection ? SimpleDiv : PageSection;

  return (
    <Wrapper ref={domElementRef} tabIndex={index} onClick={onClick}>
      <Container>
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
          upsertScrap={upsertScrap}
          style={style}
        />
      </Container>
    </Wrapper>
  );

  function updateScrapInState() {
    setScrapToRender(currentScrap);
    setTitle(currentScrap.title);
    setNotes(currentScrap.notes);
  }

  async function upsertScrap() {
    if (currentScrap.notes === notes && currentScrap.title === title) {
      return;
    }

    if (!notes) {
      return;
    }

    await upsertMeasurementMutation.mutateAsync({
      command: {
        id: currentScrap?.id,
        scrapType: currentScrap.scrapType,
        notes: notes,
        title: title,
        metricAttributeValues: {},
        metricId: currentScrap.metricId,
        dateTime: new Date(),
      } as IUpsertScrapsMeasurementCommand,
    });

    onSuccess?.();
    setIsEditMode(false);
  }
};

const SimpleDiv = styled("div")``;

const Wrapper = styled("div")`
  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }

  border-radius: 3px;
`;

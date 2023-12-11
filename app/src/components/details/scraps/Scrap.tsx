import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { useAppContext } from "../../../AppContext";
import { Button, styled } from "@mui/material";
import { ScrapInner } from "./ScrapInner";
import { IUpsertScrapsEntryCommand } from "../../../serverApi/commands/IUpsertScrapsEntryCommand";
import { useUpsertEntryMutation } from "../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { JournalType } from "../../../serverApi/JournalType";
import { PageSection } from "../../layout/pages/PageSection";
import { ScrapItemWrapper } from "./ScrapItemWrapper";
import { Wrapper } from "../../common/wrappers/Wrapper";

export const Scrap: React.FC<{
  scrap: IScrapEntry;
  hideDate?: boolean;
  hideActions?: boolean;
  onSuccess?: () => void;
  style?: CSSProperties;
  addScrapWrapper?: (scrapWrapper: ScrapItemWrapper) => void;
  index?: number;
  withoutSection?: boolean;
  onClick?: () => void;
  hasFocus?: boolean;
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
  hasFocus,
}) => {
  const { setAppAlert } = useAppContext();

  const [notes, setNotes] = useState<string>(currentScrap.notes);
  const [title, setTitle] = useState<string>(currentScrap.title);
  const [scrapToRender, setScrapToRender] = useState(currentScrap);

  const [isEditMode, setIsEditMode] = useState(!scrapToRender.id);

  const domElementRef = useRef<HTMLDivElement>();

  const upsertEntryMutation = useUpsertEntryMutation(
    currentScrap.parentId,
    JournalType.Scraps,
    currentScrap.id,
  );

  const initialScrap = useMemo(() => {
    return currentScrap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDirty = useMemo(
    () => initialScrap.notes !== notes || initialScrap.title !== title,
    [initialScrap, notes, title],
  );

  useEffect(() => {
    if (!addScrapWrapper) {
      return;
    }

    addScrapWrapper(
      new ScrapItemWrapper(
        domElementRef,
        currentScrap,
        () => setIsEditMode(!isEditMode),
        upsertScrap,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, isEditMode, currentScrap.editedOn]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScrap]);

  const Container = withoutSection ? SimpleDiv : PageSection;

  return (
    <Wrapper ref={domElementRef} tabIndex={index} onClick={onClick}>
      <Container>
        <ScrapInner
          key={isEditMode.toString()}
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
          cancelEditing={getCancelEditingFunction()}
          hasFocus={hasFocus}
        />
      </Container>
    </Wrapper>
  );

  function getCancelEditingFunction() {
    if (!isEditMode) {
      return null;
    }

    return function () {
      setScrapToRender(initialScrap);
      setTitle(initialScrap.title);
      setNotes(initialScrap.notes);
      setIsEditMode(false);
    };
  }

  function updateScrapInState() {
    setScrapToRender(currentScrap);
    setTitle(currentScrap.title);
    setNotes(currentScrap.notes);
  }

  async function upsertScrap(notesToOverride?: string) {
    const notesToSave = notesToOverride ?? notes;

    if (
      (currentScrap.notes === notesToSave && currentScrap.title === title) ||
      !notesToSave
    ) {
      setIsEditMode(false);
      return;
    }

    await upsertEntryMutation.mutateAsync({
      command: {
        id: currentScrap?.id,
        scrapType: currentScrap.scrapType,
        notes: notesToSave,
        title: title,
        journalAttributeValues: {},
        journalId: currentScrap.parentId,
        dateTime: new Date(),
      } as IUpsertScrapsEntryCommand,
    });

    onSuccess?.();
    setIsEditMode(false);
  }
};

const SimpleDiv = styled("div")``;

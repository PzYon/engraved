import React from "react";
import { ILogBookJournal } from "../../../serverApi/ILogBookJournal";
import LazyRichTextEditor from "../../common/LazyRichTextEditor";
import { PageSection } from "../../layout/pages/PageSection";
import { FormControl } from "@mui/material";
import { CopyAllOutlined } from "@mui/icons-material";

export const EditLogBookProperties: React.FC<{
  journal: ILogBookJournal;
  setCustomProps: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}> = ({ journal, setCustomProps }) => {
  return (
    <PageSection title={"Log Entry Template"} icon={<CopyAllOutlined />}>
      <FormControl sx={{ width: "100%" }}>
        <LazyRichTextEditor
          setValue={(value) =>
            setCustomProps((currentCustomProps) => ({
              ...currentCustomProps,
              template: value,
            }))
          }
          initialValue={(journal.customProps?.template as string) ?? ""}
        />
      </FormControl>
    </PageSection>
  );
};

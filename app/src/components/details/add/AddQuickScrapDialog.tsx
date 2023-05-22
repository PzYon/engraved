import React, { useState } from "react";
import { IUser } from "../../../serverApi/IUser";
import { ScrapMarkdown } from "../scraps/markdown/ScrapMarkdown";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { Button } from "@mui/material";

export const AddQuickScrapDialog: React.FC<{ user: IUser }> = ({ user }) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <ScrapMarkdown
        isEditMode={true}
        value={value}
        onChange={(newValue) => {
          // this is called for every key press
          console.log("value from ScrapMarkdown: " + newValue);
          setValue(newValue);
        }}
      />
      <DialogFormButtonContainer>
        <Button
          variant="contained"
          onClick={() => alert(value)}
          disabled={!value}
        >
          Save
        </Button>
      </DialogFormButtonContainer>
    </div>
  );
};

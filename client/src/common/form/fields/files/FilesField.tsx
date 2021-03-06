import { IFile, SharedConstants } from "engraved-shared";
import React, { useRef } from "react";
import styled from "styled-components";
import { AuthenticatedServerApi } from "../../../../authentication/AuthenticatedServerApi";
import { FieldWrapper } from "../FieldWrapper";
import { IFilesFieldProps } from "./FilesFieldProps";
import { ItemFiles } from "./ItemFiles";

export const FilesField = (props: IFilesFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <FieldWrapper label={props.label} validationError={props.validationMessage}>
      {props.isReadOnly ? (
        <ItemFiles files={props.value} />
      ) : (
        <>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={uploadFile}
            id="fooBar"
            style={{ display: "none" }}
          />
          <Label htmlFor="fooBar">Click to add a file</Label>
          <ItemFiles files={props.value} onDelete={deleteFile} />
        </>
      )}
    </FieldWrapper>
  );

  function uploadFile(): void {
    const file = fileInputRef.current.files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append(SharedConstants.fileUpload.name, file, file.name);

    AuthenticatedServerApi.post("files", formData, {}, true).subscribe({
      next: (uploadedFile: IFile) => {
        console.log("uploaded file to server: ", uploadedFile);
        props.onValueChange([...(props.value || []), uploadedFile]);
      },
      error: (x: any) => {
        alert(x);
      }
    });
  }

  function deleteFile(file: IFile): void {
    props.onValueChange(
      props.value.filter(f => f.cloudFile_id !== file.cloudFile_id)
    );
  }
};

const Input = styled.input`
  &::-webkit-file-upload-button {
    visibility: hidden;
  }
`;

const Label = styled.label`
  border: 1px solid ${p => p.theme.colors.border};
  background-color: ${p => p.theme.colors.formElementBackground};
  color: ${p => p.theme.colors.palette.accent};
  cursor: pointer;
  font-size: ${p => p.theme.font.size.small};
  box-sizing: border-box;
  width: 100%;
  display: inline-block;
  padding: 5px;
  margin-bottom: ${p => p.theme.formElementPadding};
`;

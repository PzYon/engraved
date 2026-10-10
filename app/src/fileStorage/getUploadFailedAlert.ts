import { IAppAlert } from "../components/errorHandling/IAppAlert";

export function getUploadFailedAlert(file: File, error: unknown): IAppAlert {
  return {
    title: `Could not upload "${file.name}".`,
    message: error instanceof Error ? error.message : undefined,
    type: "error",
  };
}

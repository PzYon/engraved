import { IAppAlert } from "../../../components/errorHandling/IAppAlert";

// Builds the standard "something failed" alert for a mutation's onError handler,
// normalizing how the message is extracted from an unknown thrown value
// (Error.message - which for our ApiError is "<status>: <message>" - otherwise
// its string form).
export function getErrorAlert(title: string, error: unknown): IAppAlert {
  return {
    title,
    message: error instanceof Error ? error.message : String(error),
    type: "error",
  };
}

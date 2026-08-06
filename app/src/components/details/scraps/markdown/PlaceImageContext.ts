import { createContext, useContext } from "react";
import { IEditorImage } from "../../../common/IRichTextEditorProps";

// Lets the file chips put an image into the text. Deliberately not part of ScrapContext: that is
// about the scrap's data, while this is a capability of the editor, and it only exists for a
// markdown scrap that is currently being edited. Undefined everywhere else, which is also how the
// chips know not to offer it.
export const PlaceImageContext = createContext<
  ((image: IEditorImage) => void) | undefined
>(undefined);

export const usePlaceImage = () => {
  return useContext(PlaceImageContext);
};

import React from "react";
import { IUser } from "../../../serverApi/IUser";
import {
  IScrapMeasurement,
  ScrapType,
} from "../../../serverApi/IScrapMeasurement";
import { Scrap } from "../scraps/Scrap";

export const AddQuickScrapDialog: React.FC<{ user: IUser }> = ({ user }) => {
  return <Scrap scrap={getScrap()} />;

  // copied from ScrapsViewPage
  function getScrap(): IScrapMeasurement {
    debugger;
    return {
      id: null,
      dateTime: null,
      notes: "",
      title: "",
      metricId: user.favoriteMetricIds[0],
      scrapType: ScrapType.Markdown,
    };
  }

  /*
    return (
      <ScrapMarkdownBody
        scrap={
          {
            metricId: user.favoriteMetricIds[0],
            dateTime: new Date().toString(),
          } as any
        }
        value={""}
        editMode={true}
        hideDate={true}
        onChange={(v) => {
          setValue(v);
        }}
        setEditMode={(isEditMode) => {
          const isSave = !isEditMode;
          if (!isSave) {
            return;
          }

          upsertMeasurementMutation.mutate({
            command: {
              scrapType: ScrapType.Markdown,
              notes: value,
              metricId: user.favoriteMetricIds[0],
            } as IUpsertScrapsMeasurementCommand,
          });
        }}
      ></ScrapMarkdownBody>
    );
     */
};

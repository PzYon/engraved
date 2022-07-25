import React from "react";

export const SelectedAttributeValues: React.FC<{
  selectedAttributeValues: { [key: string]: string[] };
}> = ({ selectedAttributeValues }) => {
  return (
    <div>
      {Object.keys(selectedAttributeValues).map((x) => {
        return (
          <div key={x}>
            {x}: {selectedAttributeValues[x].join(",")}
          </div>
        );
      })}
    </div>
  );
};

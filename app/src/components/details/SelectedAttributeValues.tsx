import React from "react";

export const SelectedAttributeValues: React.FC<{
  selectedAttributeValues: { [key: string]: string[] };
}> = ({ selectedAttributeValues }) => {
  return (
    <div>
      {Object.keys(selectedAttributeValues).map((x) => {
        return (
          <span key={x}>
            {x}: {selectedAttributeValues[x].join(",")}
          </span>
        );
      })}
    </div>
  );
};

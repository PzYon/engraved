import MarkdownIt from "markdown-it";
import React, { useMemo } from "react";
import { Typography } from "@mui/material";

export const Markdown: React.FC<{ value: string }> = ({ value }) => {
  const mdAsHtml = useMemo(() => {
    return (
      MarkdownIt("default", { linkify: true })
        //.use(require("markdown-it-anchor").default)
        //.use(require("markdown-it-table-of-contents"))
        .render(value)
    );
  }, [value]);

  return (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: mdAsHtml }} />
    </Typography>
  );
};

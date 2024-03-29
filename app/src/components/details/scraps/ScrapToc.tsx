import { Chip, styled } from "@mui/material";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

export const ScrapToc: React.FC<{ entries: IScrapEntry[] }> = ({ entries }) => {
  if (!entries?.length) {
    return null;
  }

  return (
    <Host>
      {entries.map((s) => {
        return (
          <a key={s.id} href={"#" + s.id}>
            <Chip
              label={s.title}
              sx={{
                mr: 1,
                backgroundColor: "common.white",
                color: "primary.main",
              }}
            />
          </a>
        );
      })}
    </Host>
  );
};

const Host = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
`;

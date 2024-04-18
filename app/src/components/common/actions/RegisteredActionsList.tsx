import { Chip, Typography } from "@mui/material";
import { useActionContext } from "./ActionContext";

export const RegisteredActionsList: React.FC = () => {
  const actionContext = useActionContext();

  return (
    <div>
      {actionContext.getAllRegisteredActions().map((a) => (
        <Typography
          fontSize={"small"}
          key={a.key}
          sx={{ height: "30px", display: "flex", alignItems: "center" }}
        >
          {a.label}{" "}
          {a.hotkey ? (
            <Chip label={a.hotkey} sx={{ ml: 1, height: "25px" }}></Chip>
          ) : null}
        </Typography>
      ))}
    </div>
  );
};

import { Chip, Typography } from "@mui/material";
import { useActionContext } from "./ActionContext";

export const RegisteredActionsList: React.FC = () => {
  const actionContext = useActionContext();

  const allRegisteredActions = actionContext.getAllRegisteredActions();

  return (
    <div>
      <Typography fontSize="large" sx={{ pb: 2 }}>
        List of Shortcuts ({allRegisteredActions.length})
      </Typography>
      {allRegisteredActions.map((a) => (
        <Typography
          component="div"
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

import { Chip, Typography } from "@mui/material";
import { useActionContext } from "./ActionContext";

export const RegisteredActionsList: React.FC = () => {
  const actionContext = useActionContext();

  const allRegisteredActions = actionContext.getAllRegisteredActions();

  const filteredActions = allRegisteredActions.filter((a) => !!a.hotkey);

  return (
    <div>
      <Typography fontSize="large" sx={{ pb: 2 }}>
        List of Shortcuts ({filteredActions.length})
      </Typography>
      {filteredActions.map((a) => (
        <Typography
          component="div"
          key={a.key}
          sx={{ height: "30px", display: "flex", alignItems: "center" }}
        >
          {a.label}{" "}
          {a.hotkey ? (
            <Chip
              label={a.hotkey?.replaceAll("+", " + ")}
              sx={{ ml: 1, height: "25px", fontWeight: "bold" }}
            />
          ) : null}
        </Typography>
      ))}
    </div>
  );
};

import { styled, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";

export const GoToItemRow: React.FC<{
  children: React.ReactNode;
  icon: React.ReactNode;
  url: string;
  hasFocus: boolean;
}> = ({ children, icon, url, hasFocus }) => {
  const navigate = useNavigate();

  useEngravedHotkeys("enter", () => navigate(url), { enabled: hasFocus });

  return (
    <Typography>
      <Link
        to={url}
        style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}
      >
        <IconContainer>{icon}</IconContainer>
        <span>{children}</span>
      </Link>
    </Typography>
  );
};

const IconContainer = styled("span")`
  padding-right: 8px;
  padding-top: 4px;
`;

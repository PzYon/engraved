import { styled, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";

export const GoToItemRow: React.FC<{
  children: React.ReactNode;
  icon: React.ReactNode;
  url: string;
  hasFocus: boolean;
  renderAtEnd?: () => React.ReactNode;
  onClick?: () => void;
}> = ({ children, icon, url, hasFocus, renderAtEnd, onClick }) => {
  const navigate = useNavigate();

  useEngravedHotkeys("enter", () => navigate(url), { enabled: hasFocus });

  return (
    <Typography
      component="div"
      style={{ display: "flex", alignItems: "center", padding: "4px 8px" }}
    >
      <Link
        to={url}
        onClick={onClick}
        style={{ display: "flex", alignItems: "center", flexGrow: 1 }}
      >
        <IconContainer>{icon}</IconContainer>
        {children}
      </Link>
      {renderAtEnd ? <span>{renderAtEnd()}</span> : null}
    </Typography>
  );
};

const IconContainer = styled("div")`
  padding-right: 8px;
  padding-top: 4px;
`;

import { styled } from "@mui/material";
import { useHotkeys } from "react-hotkeys-hook";
import { Link, useNavigate } from "react-router-dom";

export const GoToItemRow: React.FC<{ title: string; url: string }> = ({
  title,
  url,
}) => {
  const navigate = useNavigate();

  useHotkeys("alt+enter", () => {
    navigate(url);
  });

  return (
    <Host>
      <Link to={url}>{title}</Link>
    </Host>
  );
};

const Host = styled("div")`
  padding: 8px 16px;
`;

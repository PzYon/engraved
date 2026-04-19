import React, { memo, useEffect, useLayoutEffect, useRef } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { paperBorderRadius } from "../../../theming/engravedTheme";
import { styled } from "@mui/material";
import { PageSection } from "../../layout/pages/PageSection";
import { useDisplayModeContext } from "./DisplayModeContext";
import { useScopeContext } from "../../common/actions/useScopeContext";

export const OverviewListItem: React.FC<{
  children: React.ReactNode;
  item: IEntity;
  hasFocus: boolean;
  onClick: () => void;
  showDaysBetween?: boolean;
}> = memo(({ children, item, hasFocus, onClick, showDaysBetween }) => {
  const domElementRef = useRef<HTMLLIElement>(undefined);

  const { isCompact } = useDisplayModeContext();
  const { setScope, scope } = useScopeContext();

  if (hasFocus && scope !== item.id) {
    setScope(item.id);
  }

  useLayoutEffect(() => {
    if (hasFocus) {
      domElementRef.current?.focus();
    }
  }, [hasFocus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasFocus) {
        return;
      }

      domElementRef.current?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [hasFocus]);

  return (
    <Host
      ref={domElementRef}
      tabIndex={0}
      id={item.id}
      data-testid={item.id}
      onClick={() => onClick?.()}
      className="overview-list-item"
    >
      <PageSection
        style={
          showDaysBetween
            ? { margin: 0 }
            : isCompact
              ? {
                  marginTop: "8px",
                  marginBottom: "8px",
                }
              : {}
        }
      >
        {children}
      </PageSection>
    </Host>
  );
});

const Host = styled("li")`
  margin: 0;
  border-radius: ${paperBorderRadius};

  &:focus {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
  }
`;

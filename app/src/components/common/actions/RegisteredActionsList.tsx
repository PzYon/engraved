import { useActionContext } from "./ActionContext";

export const RegisteredActionsList: React.FC = () => {
  const actionContext = useActionContext();

  return (
    <ul>
      {actionContext.getAllRegisteredActions().map((a) => {
        return (
          <li key={a.key}>
            {a.label} (hotkey: {a.hotkey})
          </li>
        );
      })}
    </ul>
  );
};

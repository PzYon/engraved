import { useAppContext } from "../../../AppContext";

export const ListOfTags: React.FC = () => {
  const { user } = useAppContext();

  const tagNames = Object.keys(user.tags ?? {});

  if (!tagNames.length) {
    return <div>no tags.</div>;
  }

  return (
    <ul>
      {tagNames.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
};

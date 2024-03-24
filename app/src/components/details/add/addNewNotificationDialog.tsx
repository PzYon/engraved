import { FunkyDate } from "../edit/FunkyDate";

// todo:
// - some print selection from FunkyDate -> user should easily see, what's going on
// - journal selector
// - what type do we select? md vs list.

export const AddNewNotificationDialog: React.FC<{
  onSuccess?: () => void;
}> = () => {
  return (
    <div>
      <FunkyDate onSelect={(x) => console.log(x)} sx={{}} />
    </div>
  );
};

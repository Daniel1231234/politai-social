import Button from "@/components/ui/Button";
import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
  isLoading: boolean;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
  isLoading,
}) => {
  return (
    <Button
      type="button"
      isLoading={isLoading}
      onClick={onClick}
      className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      <Icon />
    </Button>
  );
};

export default AuthSocialButton;

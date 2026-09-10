import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { TokenUtil } from "@/utils/tokenUtil";
import { useRouter } from "@tanstack/react-router";
import Dialog from "../compound/Dialog";

interface LogoutProps {
  isOpen: boolean;
  close: () => void;
}

const LogoutDialog: React.FC<LogoutProps> = (props) => {
  const { close, isOpen } = props;

  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout(); // This clears both token and auth state
    router.navigate({ to: ROUTES.LOGIN });
  };

  return (
   <Dialog
      isOpen={isOpen}
      close={close}
      title="Logout"
      actions={{
        primary: {
          children: "Logout",
          onClick: handleLogout,
        },
        secondary: {
          children: "Cancel",
          onClick: close,
          variant: "ghost",
        },
      }}
    >
      <h6 className="text-base-content">
        Are you sure you want to logout?
      </h6>
    </Dialog>
  );
};

export default LogoutDialog;

import { useRef, useState } from "react";
import SettingsChangePasswordPopup from "./SettingsChangePasswordPopup";
import { toast } from "react-toastify";
import { logoutAPI, resendVerifyEmailAPI } from "../../api/userAPI";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { LockClosed, Logout, Person } from "../../icons";

interface SettingsPageAccountProps {
  user: {
    _id: string;
    email: string;
    emailVerified: boolean;
  };
  getUser: () => void;
}

const SettingsPageAccount: React.FC<SettingsPageAccountProps> = ({
  user,
  getUser,
}) => {
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const lastSentEmailVerifiation = useRef(0);
  const navigate = useNavigate();

  const logoutClick = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure to logout?",
        text: "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#18181B",
        confirmButtonText: "Continue",
      });

      if (!result.value) return;

      await toast.promise(logoutAPI(), {
        pending: "Logging out...",
        success: "Logged out",
        error: "Error Logging Out",
      });

      window.localStorage.removeItem("hasPreviouslyLoggedIn");

      navigate("/");
    } catch (e) {
      console.log("Error logging out", e);
    }
  };

  const logoutAllClick = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure to logout all sessions?",
        text: "This action cannot be undone. This will permanently delete your all sessions and remove your data from our servers.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continue",
      });

      if (!result.value) return;

      await toast.promise(logoutAPI(), {
        pending: "Logging out all...",
        success: "Logged out all",
        error: "Error Logging Out all",
      });

      window.localStorage.removeItem("hasPreviouslyLoggedIn");

      navigate("/");
    } catch (e) {
      console.log("Error logging out", e);
    }
  };

  const resendEmailVerification = async () => {
    try {
      const currentDate = Date.now();
      if (currentDate - lastSentEmailVerifiation.current < 1000 * 60 * 1) {
        await Swal.fire({
          title: "Please wait 1 minute before resending",
          icon: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Okay",
        });
        return;
      }
      lastSentEmailVerifiation.current = Date.now();

      await toast.promise(resendVerifyEmailAPI(), {
        pending: "Resending email verification...",
        success: "Email Verification Resent",
        error: "Error Resending Email Verification",
      });

      getUser();
    } catch (e) {
      console.log("Error resending email verification", e);
    }
  };

  return (
    <div>
      {showChangePasswordPopup && (
        <SettingsChangePasswordPopup
          closePopup={() => setShowChangePasswordPopup(false)}
        />
      )}

     <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Account Settings</h3>
      </div>
      <div>
        <div className="py-4 flex flex-row justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <Person />
          <p className="text-gray-primary ml-2">Email</p>
          </div>
        
          <p>{user.email}</p>
        </div>
        {"emailVerified" in user && !user.emailVerified && (
          <div className="py-4 flex flex-row justify-between items-center border-b border-gray-200">
            <p className="text-gray-primary">Email not verified</p>
            {!user.emailVerified && (
              <button
                type="button"
                className="text-primary hover:text-primary-hover cursor-pointer"
                onClick={resendEmailVerification}
              >
                Resend
              </button>
            )}
          </div>
        )}
        <div className="py-4 flex flex-row justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <LockClosed />
          <p className="text-gray-primary ml-2">Change password</p>
          </div>
          <button
            type="button"
            className="text-primary hover:text-primary-hover cursor-pointer"
            onClick={() => setShowChangePasswordPopup(true)}
          >
            Change
          </button>
        </div>
        <div className="py-4 flex flex-row justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <Logout />
          <p className="text-gray-primary ml-2">Logout account</p>
          </div>
          <button
            type="button"
            className="text-primary hover:text-primary-hover cursor-pointer"
            onClick={logoutClick}
          >
            Logout
          </button>
        </div>
        <div className="py-4 flex flex-row justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
        <Logout />
          <p className="text-gray-primary ml-2">Logout all sessions</p>
          </div>
          <button
            type="button"
            className="text-primary hover:text-primary-hover cursor-pointer"
            onClick={logoutAllClick}
          >
            Logout all
          </button>
        </div>
      </div>
     </div>
    </div>
  );
};

export default SettingsPageAccount;

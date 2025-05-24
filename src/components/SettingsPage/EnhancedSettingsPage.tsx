import React, { useCallback, useEffect, useState } from "react";
import Header from "../Header/Header";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import SettingsAccountSection from "./SettingsAccountSection";
import { getUserDetailedAPI, logoutAPI } from "../../api/userAPI";
import Spinner from "../Spinner/Spinner";
import Swal from "sweetalert2";
import SettingsGeneralSection from "./SettingsGeneralSection";
import { useClickOutOfBounds } from "../../hooks/utils";
import MenuIcon from "../../icons/MenuIcon";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import HomeIconOutline from "../../icons/HomeIconOutline";
import AnimatedContainer from "../AnimatedContainer";
import RippleButton from "../RippleButton";

const EnhancedSettingsPage = () => {
  const [user, setUser] = useState(null);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const navigate = useNavigate();

  const getUser = useCallback(async () => {
    try {
      const userResponse = await getUserDetailedAPI();
      setUser(userResponse);
      // Add a slight delay to make the animation more noticeable
      setTimeout(() => {
        setSettingsLoaded(true);
      }, 100);
    } catch (e) {
      console.log("Loading user details error", e);
      const result = await Swal.fire({
        title: "Error loading user account",
        text: "There was an error loading your account, would you like to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout",
      });
      if (result.value) {
        await toast.promise(logoutAPI(), {
          pending: "Logging out...",
          success: "Logged out",
          error: "Error Logging Out",
        });

        window.localStorage.removeItem("hasPreviouslyLoggedIn");

        navigate("/");
      } else {
        navigate("/home");
      }
    }
  }, [navigate]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const { wrapperRef } = useClickOutOfBounds(() => setShowSidebarMobile(false));

  return (
    <div className="bg-white">
      <div className="hidden sm:block">
        <Header />
      </div>
      <div className="flex flex-row sm:mt-[70px]">
        <div
          ref={wrapperRef}
          className={classNames(
            "fixed sm:relative px-6 border-r border-gray-100 w-72 dynamic-height animate-movement bg-white shadow-sm smooth-transition",
            {
              "-ml-72 sm:ml-0": !showSidebarMobile,
              "ml-0": showSidebarMobile,
            }
          )}
        >
          <AnimatedContainer animation="slide-up" delay={100} className="pt-20 pb-6 mb-6 border-b border-gray-100">
            <div className="text-center mb-6 scale-in">
              <h1 className="text-xl font-bold text-gray-800">Settings</h1>
            </div>
            <RippleButton
              type="button"
              onClick={() => navigate("/home")}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg flex items-center justify-center transition-colors duration-200 border-0 button-hover"
            >
              <HomeIconOutline className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Home</span>
            </RippleButton>
          </AnimatedContainer>
        </div>
        {user && settingsLoaded ? (
          <div className="py-16 px-4 sm:px-8 lg:px-12 w-full bg-gray-50 transition-all duration-300">
            <div className="block sm:hidden mb-6">
              <RippleButton
                type="button"
                onClick={() => setShowSidebarMobile(!showSidebarMobile)}
                className="bg-transparent border-0 p-0"
              >
                <MenuIcon className="w-8 h-8 text-gray-700" />
              </RippleButton>
            </div>
            <div className="max-w-4xl mx-auto">
              <AnimatedContainer animation="slide-right" delay={100}>
                <h2 className="text-2xl font-bold text-gray-800 mb-8 pb-2 border-b border-gray-200 hidden sm:block">
                  Your Settings
                </h2>
              </AnimatedContainer>
              <div className="flex flex-col gap-10">
                <AnimatedContainer animation="slide-up" delay={200} className="card-hover bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <SettingsAccountSection user={user} getUser={getUser} />
                </AnimatedContainer>
                <AnimatedContainer animation="slide-up" delay={400} className="card-hover bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <SettingsGeneralSection />
                </AnimatedContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full dynamic-height flex justify-center items-center">
            <AnimatedContainer animation="scale" className="flex items-center justify-center h-full">
              <Spinner />
            </AnimatedContainer>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-left" pauseOnFocusLoss={false} />
    </div>
  );
};

export default EnhancedSettingsPage;

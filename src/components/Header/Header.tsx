// import { useNavigate } from "react-router-dom";
// import SearchBar from "../SearchBar/SearchBar";
// import MenuIcon from "../../icons/MenuIcon";
// import { useAppDispatch, useAppSelector } from "../../hooks/store";
// import { closeDrawer, openDrawer } from "../../reducers/leftSection";
// import { useUtils } from "../../hooks/utils";
// import ChevronOutline from "../../icons/ChevronOutline";
// import SettingsIconSolid from "../../icons/SettingsIconSolid";
// import HomeIconOutline from "../../icons/HomeIconOutline";
// import AccountIcon from "../../icons/AccountIcon";
// import SvgAccount from "../../icons/Account";
// import SettingsIcon from "../../icons/SettingsIcon";

// const Header = () => {
//   const drawerOpen = useAppSelector((state) => state.leftSection.drawOpen);
//   const { isSettings } = useUtils();
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const openDrawerClick = () => {
//     dispatch(openDrawer());
//   };

//   const closeDrawerClick = () => {
//     dispatch(closeDrawer());
//   };

//   return (
//     <header
//       id="header"
//       className="select-none border-b fixed top-0 left-0 w-full bg-white z-10"
//     >
//       <div className="px-6 flex justify-between  items-center py-3">
//         <div className="items-center w-[260px] hidden desktopMode:flex">
//           <a
//             className="inline-flex items-center justify-center cursor-pointer"
//             onClick={() => navigate("/")}
//           >
//             <img className="" src="/images/icon.png" alt="logo" />
//           </a>
//         </div>
//         {!isSettings && (
//           <div className="items-center flex desktopMode:hidden mr-4">
//             <div className="inline-flex items-center justify-center cursor-pointer">
//               {drawerOpen ? (
//                 <ChevronOutline
//                   id="menu-icon"
//                   onClick={closeDrawerClick}
//                   className="text-primary w-9 rotate-90"
//                 />
//               ) : (
//                 <MenuIcon
//                   id="menu-icon"
//                   onClick={openDrawerClick}
//                   className="text-primary w-9"
//                 />
//               )}
//             </div>
//           </div>
//         )}
//         <SearchBar />
//         <div className="justify-end w-[260px] h-full hidden desktopMode:flex">
//           <div className="flex flex-row">
            
//             <div>
//             <a
//                 onClick={() => navigate("/home")}
//                 className="cursor-pointer"
//               >
//             <SettingsIcon className="w-8 h-8 mr-4" />
//             </a>
//             </div>
//             <div>
//               <a
//                 onClick={() => navigate("/settings")}
//                 className="cursor-pointer"
//               >
//                 {/* set circle image like profile icon here using the image in public/images/profile.jpg */}

//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import MenuIcon from "../../icons/MenuIcon";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { closeDrawer, openDrawer } from "../../reducers/leftSection";
import { useUtils } from "../../hooks/utils";
import ChevronOutline from "../../icons/ChevronOutline";
import { LockClosed, Logout, Person, FileText, ArrowUpDown, MousePointerClick } from "../../icons";
import { getUserDetailedAPI, logoutAPI, logoutAllAPI } from "../../api/userAPI";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import SettingsChangePasswordPopup from "../SettingsPage/SettingsChangePasswordPopup";
import { usePreferenceSetter } from "../../hooks/preferenceSetter";

const Header = () => {
  const drawerOpen = useAppSelector((state) => state.leftSection.drawOpen);
  const { isSettings } = useUtils();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [user, setUser] = useState<{ email: string; _id: string } | null>(null);
  const [listViewStyle, setListViewStyle] = useState("list");
  const [sortBy, setSortBy] = useState("date");
  const { setPreferences } = usePreferenceSetter();
  const settingsRef = useRef<HTMLDivElement>(null);

  const openDrawerClick = () => {
    dispatch(openDrawer());
  };

  const closeDrawerClick = () => {
    dispatch(closeDrawer());
  };
  
  const toggleSettingsDropdown = () => {
    setShowSettingsDropdown(!showSettingsDropdown);
  };
  
  // Load user information
  const getUser = useCallback(async () => {
    try {
      const userResponse = await getUserDetailedAPI();
      setUser(userResponse);
    } catch (e) {
      console.log("Loading user details error", e);
    }
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure to logout?",
        text: "You will be redirected to the login page.",
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
      setShowSettingsDropdown(false);
      navigate("/");
    } catch (e) {
      console.log("Error logging out", e);
    }
  };
  
  // Handle logout all sessions
  const handleLogoutAll = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure to logout all sessions?",
        text: "This will log you out from all devices.",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continue",
      });

      if (!result.value) return;

      await toast.promise(logoutAllAPI(), {
        pending: "Logging out all sessions...",
        success: "Logged out from all sessions",
        error: "Error logging out from all sessions",
      });

      window.localStorage.removeItem("hasPreviouslyLoggedIn");
      setShowSettingsDropdown(false);
      navigate("/");
    } catch (e) {
      console.log("Error logging out all sessions", e);
    }
  };
  
  // Toggle file list style (list/grid)
  const toggleFileListStyle = () => {
    const newStyle = listViewStyle === "list" ? "grid" : "list";
    setListViewStyle(newStyle);
    
    if (newStyle === "list") {
      window.localStorage.setItem("list-mode", "true");
    } else {
      window.localStorage.removeItem("list-mode");
    }
    setPreferences();
    setShowSettingsDropdown(false);
  };
  
  // Toggle sort by (date/name)
  const toggleSortBy = () => {
    const newSortBy = sortBy === "date" ? "name" : "date";
    setSortBy(newSortBy);
    
    if (newSortBy === "name") {
      window.localStorage.setItem("sort-name", "true");
    } else {
      window.localStorage.removeItem("sort-name");
    }
    setPreferences();
    setShowSettingsDropdown(false);
  };
  
  // Load initial preferences
  useEffect(() => {
    const listModeLocalStorage = window.localStorage.getItem("list-mode");
    const listModeEnabled = listModeLocalStorage === "true";
    setListViewStyle(listModeEnabled ? "list" : "grid");
    
    const sortByLocalStorage = window.localStorage.getItem("sort-name");
    const sortByNameEnabled = sortByLocalStorage === "true";
    setSortBy(sortByNameEnabled ? "name" : "date");
    
    getUser();
  }, [getUser]);
  
  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {showChangePasswordPopup && (
        <SettingsChangePasswordPopup
          closePopup={() => setShowChangePasswordPopup(false)}
        />
      )}
      <header
        id="header"
        className="select-none border-b fixed top-0 left-0 w-full bg-white z-30"
      >
      <div className="px-6 flex justify-between  items-center py-3">
        <div className="items-center w-[260px] hidden desktopMode:flex">
          <button
            type="button"
            className="inline-flex items-center justify-center cursor-pointer border-0 bg-transparent p-0"
            onClick={() => navigate("/")}
          >
            <img className="" src="/images/icon.png" alt="logo" />
          </button>
        </div>
        {!isSettings && (
          <div className="items-center flex desktopMode:hidden mr-4">
            <div className="inline-flex items-center justify-center cursor-pointer">
              {drawerOpen ? (
                <ChevronOutline
                  id="menu-icon"
                  onClick={closeDrawerClick}
                  className="text-primary w-9 rotate-90"
                />
              ) : (
                <MenuIcon
                  id="menu-icon"
                  onClick={openDrawerClick}
                  className="text-primary w-9"
                />
              )}
            </div>
          </div>
        )}
        <SearchBar />
        <div className="justify-end w-[260px] h-full hidden desktopMode:flex">
          <div className="flex flex-row items-center relative" ref={settingsRef}>
            <div>
              <button
                type="button"
                onClick={toggleSettingsDropdown}
                className="cursor-pointer bg-transparent border-0 p-0"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src="/images/profile.jpg" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
              
              {showSettingsDropdown && (
                <div className="absolute right-0 top-16 z-50 w-80 bg-white rounded-md shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-medium">Settings</h3>
                  </div>
                  
                  {/* Account Settings */}
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="text-base font-bold mb-3">Account</h4>
                    
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Person className="w-5 h-5 mr-2" />
                          <span className="text-sm">Email</span>
                        </div>
                        {user && (
                          <span className="text-sm text-gray-600">{user.email}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <LockClosed className="w-5 h-5 mr-2" />
                          <span className="text-sm">Change Password</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowChangePasswordPopup(true);
                            setShowSettingsDropdown(false);
                          }}
                          className="text-primary text-sm hover:text-primary-hover cursor-pointer bg-transparent border-0 p-0"
                        >
                          Change
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Logout className="w-5 h-5 mr-2" />
                          <span className="text-sm">Logout</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="text-primary text-sm hover:text-primary-hover cursor-pointer bg-transparent border-0 p-0"
                        >
                          Logout
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Logout className="w-5 h-5 mr-2" />
                          <span className="text-sm">Logout all sessions</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleLogoutAll}
                          className="text-primary text-sm hover:text-primary-hover cursor-pointer bg-transparent border-0 p-0"
                        >
                          Logout all
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* General Settings */}
                  <div className="p-4">
                    <h4 className="text-base font-bold mb-3">General</h4>
                    
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          <span className="text-sm">File list style</span>
                        </div>
                        <button
                          type="button"
                          onClick={toggleFileListStyle}
                          className="text-primary text-sm hover:text-primary-hover cursor-pointer bg-transparent border-0 p-0"
                        >
                          {listViewStyle === "list" ? "List" : "Grid"}
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <ArrowUpDown className="w-5 h-5 mr-2" />
                          <span className="text-sm">Sort by</span>
                        </div>
                        <button
                          type="button"
                          onClick={toggleSortBy}
                          className="text-primary text-sm hover:text-primary-hover cursor-pointer bg-transparent border-0 p-0"
                        >
                          {sortBy === "date" ? "Date" : "Name"}
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MousePointerClick className="w-5 h-5 mr-2" />
                          <span className="text-sm">Advanced settings</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSettingsDropdown(false);
                            navigate("/settings");
                          }}
                          className="text-primary text-sm hover:text-primary-hover cursor-pointer bg-transparent border-0 p-0"
                        >
                          View All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    <ToastContainer position="bottom-left" pauseOnFocusLoss={false} />
    </>
  );
};

export default Header;
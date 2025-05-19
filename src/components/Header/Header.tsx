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


import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import MenuIcon from "../../icons/MenuIcon";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { closeDrawer, openDrawer } from "../../reducers/leftSection";
import { useUtils } from "../../hooks/utils";
import ChevronOutline from "../../icons/ChevronOutline";
import SettingsIconSolid from "../../icons/SettingsIconSolid";
import HomeIconOutline from "../../icons/HomeIconOutline";
import AccountIcon from "../../icons/AccountIcon";
import SvgAccount from "../../icons/Account";
import SettingsIcon from "../../icons/SettingsIcon";

const Header = () => {
  const drawerOpen = useAppSelector((state) => state.leftSection.drawOpen);
  const { isSettings } = useUtils();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const openDrawerClick = () => {
    dispatch(openDrawer());
  };

  const closeDrawerClick = () => {
    dispatch(closeDrawer());
  };

  return (
    <header
      id="header"
      className="select-none border-b fixed top-0 left-0 w-full bg-white z-10"
    >
      <div className="px-6 flex justify-between  items-center py-3">
        <div className="items-center w-[260px] hidden desktopMode:flex">
          <a
            className="inline-flex items-center justify-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img className="" src="/images/icon.png" alt="logo" />
          </a>
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
          <div className="flex flex-row items-center">
            
            <div>
              <a
                onClick={() => navigate("/home")}
                className="cursor-pointer"
              >
                <SettingsIcon className="w-8 h-8 mr-4" />
              </a>
            </div>
            <div>
              <a
                onClick={() => navigate("/settings")}
                className="cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src="/images/profile.jpg" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import { useEffect, useState } from "react";
import { usePreferenceSetter } from "../../hooks/preferenceSetter";
import { ArrowUpDown, FileText, ListOrdered, MousePointerClick } from "../../icons";

const SettingsPageGeneral = () => {
  const [listViewStyle, setListViewStyle] = useState("list");
  const [sortBy, setSortBy] = useState("date");
  const [orderBy, setOrderBy] = useState("descending");
  const [singleClickFolders, setSingleClickFolders] = useState("disabled");

  const { setPreferences } = usePreferenceSetter();

  const fileListStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setListViewStyle(value);
    if (value === "list") {
      window.localStorage.setItem("list-mode", "true");
    } else {
      window.localStorage.removeItem("list-mode");
    }
    setPreferences();
  };

  const sortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    if (value === "name") {
      window.localStorage.setItem("sort-name", "true");
    } else {
      window.localStorage.removeItem("sort-name");
    }
    setPreferences();
  };

  const orderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setOrderBy(value);

    if (value === "ascending") {
      window.localStorage.setItem("order-asc", "true");
    } else {
      window.localStorage.removeItem("order-asc");
    }
    setPreferences();
  };

  const singleClickFoldersChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSingleClickFolders(value);

    if (value === "enabled") {
      window.localStorage.setItem("single-click-folders", "true");
    } else {
      window.localStorage.removeItem("single-click-folders");
    }
    setPreferences();
  };



  useEffect(() => {
    const listModeLocalStorage = window.localStorage.getItem("list-mode");
    const listModeEnabled = listModeLocalStorage === "true";

    const sortByLocalStorage = window.localStorage.getItem("sort-name");
    const sortByNameEnabled = sortByLocalStorage === "true";

    const orderByLocalStorage = window.localStorage.getItem("order-asc");
    const orderByAscendingEnabled = orderByLocalStorage === "true";

    const singleClickFoldersLocalStorage = window.localStorage.getItem(
      "single-click-folders"
    );
    const singleClickFoldersEnabled = singleClickFoldersLocalStorage === "true";

    setListViewStyle(listModeEnabled ? "list" : "grid");
    setSortBy(sortByNameEnabled ? "name" : "date");
    setOrderBy(orderByAscendingEnabled ? "ascending" : "descending");
    setSingleClickFolders(singleClickFoldersEnabled ? "enabled" : "disabled");
  }, []);

  return (
    <div>
      <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">General Settings</h3>
      </div>
      <div>
        <div className="py-4 flex flex-row justify-between items-center border-b border-gray-200">
         <div className="flex items-center">
          <FileText />
          <p className="text-gray-primary ml-2">File list style</p>
         </div>
          <select
            value={listViewStyle}
            onChange={fileListStyleChange}
            className="text-sm font-medium appearance-none bg-white text-primary"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
        <div className="py-4 flex flex-row justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
        <ArrowUpDown />
        <p className="text-gray-primary ml-2">Sort by</p>
        </div>
          <select
            value={sortBy}
            onChange={sortByChange}
            className="text-sm font-medium appearance-none bg-white text-primary"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="py-4 flex flex-row justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
        <ListOrdered />
        <p className="text-gray-primary ml-2">Order by</p>
        </div>
          <select
            value={orderBy}
            onChange={orderByChange}
            className="text-sm font-medium appearance-none bg-white text-primary"
          >
            <option value="descending">Descending</option>
            <option value="ascending">Ascending</option>
          </select>
        </div>
        <div className="py-4 flex flex-row justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
        <MousePointerClick />
        <p className="text-gray-primary ml-2">Single click to enter folders</p>
        </div>
          <select
            value={singleClickFolders}
            onChange={singleClickFoldersChange}
            className="text-sm font-medium appearance-none bg-white text-primary"
          >
            <option value="disabled">Disabled</option>
            <option value="enabled">Enabled</option>
          </select>
        </div>

      </div>
    </div>
    </div>
    
  );
};

export default SettingsPageGeneral;

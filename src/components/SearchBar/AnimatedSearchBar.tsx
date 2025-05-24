import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "../../hooks/store";
import { useQuickFiles, useSearchSuggestions } from "../../hooks/files";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { useUtils } from "../../hooks/utils";
import SearchBarItem from "../SearchBarItem/SearchBarItem";
import type { FolderInterface } from "../../types/folders";
import type { FileInterface } from "../../types/file";
import classNames from "classnames";
import { closeDrawer } from "../../reducers/leftSection";
import { setPopupSelect } from "../../reducers/selected";
import CloseIcon from "../../icons/CloseIcon";
import Spinner from "../Spinner/Spinner";
import SearchIcon from "../../icons/SearchIcon";

const AnimatedSearchBar = memo(() => {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const dispatch = useAppDispatch();
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [showAllFiles, setShowAllFiles] = useState(false);
  const { data: searchSuggestions, isLoading: isLoadingSearchSuggestions } =
    useSearchSuggestions(debouncedSearchText);
  const { data: allFiles, isLoading: isLoadingAllFiles } = useQuickFiles(showAllFiles);
  const navigate = useNavigate();
  const { isTrash, isMedia } = useUtils();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const debouncedSetSearchText = useMemo(
    () => debounce(setDebouncedSearchText, 300), // Faster debounce for better responsiveness
    []
  );

  useEffect(() => {
    debouncedSetSearchText(searchText);
    return () => {
      debouncedSetSearchText.cancel();
    };
  }, [searchText, debouncedSetSearchText]);

  const resetState = () => {
    setSearchText("");
    setDebouncedSearchText("");
    // When search is cleared manually, show all files
    setShowAllFiles(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Add an event listener for clicks outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setFocused(false);
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    };
     
    document.addEventListener('mousedown', handleGlobalClick);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    
    if (searchText.trim().length === 0) return;

    if (isMedia) {
      if (searchText.length) {
        navigate(`/search-media/${searchText}`);
      } else {
        navigate("/media");
      }
      return;
    }
    
    if (isTrash) {
      if (searchText.length) {
        navigate(`/search-trash/${searchText}`);
      } else {
        navigate("/trash");
      }
      return;
    }
    
    if (searchText.length) {
      navigate(`/search/${searchText}`);
    } else {
      navigate("/home");
    }
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchText(newValue);
    
    if (newValue.length > 0) {
      setShowSuggestions(true);
      setShowAllFiles(false);
    } else if (focused) {
      // When text is cleared but search bar is still focused, show all files
      setShowSuggestions(true);
      setShowAllFiles(true);
    }
  };

  const fileClick = (file: FileInterface) => {
    dispatch(setPopupSelect({ type: "file", file }));
    resetState();
    setShowSuggestions(false);
    setFocused(false);
  };

  const folderClick = (folder: FolderInterface) => {
    if (!isTrash) {
      navigate(`/folder/${folder?._id}`);
    } else {
      navigate(`/folder-trash/${folder?._id}`);
    }

    resetState();
    setShowSuggestions(false);
    setFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Add keyboard navigation functionality for suggestions
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const onFocus = () => {
    dispatch(closeDrawer());
    setFocused(true);
    if (searchText.length > 0) {
      setShowSuggestions(true);
      setShowAllFiles(false);
    } else {
      // When focused with empty search, show all files
      setShowSuggestions(true);
      setShowAllFiles(true);
    }
  };
  
  const onBlur = () => {
    // Small delay to allow click handlers to fire first
    setTimeout(() => {
      // Only blur if not clicking within our form
      if (formRef.current && !formRef.current.contains(document.activeElement)) {
        setFocused(false);
        setShowSuggestions(false);
      }
    }, 100);
  };

  const searchTextPlaceholder = (() => {
    if (isMedia) {
      return "Search Media";
    }
    if (isTrash) {
      return "Search Trash";
    }
    return "Search files and folders";
  })();

  // Maximum height for suggestions dropdown is fixed at 400px

  return (
    <form
      ref={formRef}
      onSubmit={onSearch}
      className="w-full max-w-[700px] relative flex items-center justify-center flex-col transition-all duration-300"
    >
      <div className={classNames(
        "w-full flex items-center transition-all duration-300 bg-white overflow-hidden",
        focused 
          ? "ring-2 ring-primary ring-opacity-70 rounded-full shadow-md" 
          : "border border-gray-200 hover:border-gray-300 rounded-full"
      )}>
        <div className={classNames(
          "flex items-center justify-center w-12 h-12 transition-all duration-300",
          {
            "text-primary": focused || searchText.length > 0,
            "text-gray-400": !focused && searchText.length === 0
          }
        )}>
          {searchText.length !== 0 && !isLoadingSearchSuggestions && (
            <button
              type="button"
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-primary focus:outline-none transition-colors duration-200"
              onClick={resetState}
              aria-label="Clear search"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
          {isLoadingSearchSuggestions && (
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
            </div>
          )}
          {searchText.length === 0 && !isLoadingSearchSuggestions && (
            <SearchIcon className="w-5 h-5" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          onChange={onChangeSearch}
          value={searchText}
          placeholder={searchTextPlaceholder}
          className="w-full h-12 border-none outline-none text-base text-black pr-4 bg-transparent placeholder-gray-400"
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          id="search-bar"
          autoComplete="off"
          aria-label="Search"
        />
        {searchText.length > 0 && (
          <button
            type="submit"
            className="px-4 py-2 mr-2 text-sm bg-primary text-white rounded-full hover:bg-primary-hover transition-colors duration-200"
            aria-label="Search"
          >
            Search
          </button>
        )}
      </div>

      {/* Search suggestions dropdown */}
      <div
        className={classNames(
          "absolute left-0 top-14 bg-white w-full overflow-hidden z-50 transition-all duration-300",
          showSuggestions && debouncedSearchText.length
            ? "opacity-100 translate-y-0 pointer-events-auto ring-1 ring-gray-200 shadow-lg rounded-xl"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
        style={{
          maxHeight: showSuggestions && debouncedSearchText.length ? 400 : 0,
          overflowY: "auto",
          boxShadow: showSuggestions && debouncedSearchText.length ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "none"
        }}
      >
        {/* Loading indicator */}
        {isLoadingSearchSuggestions && (
          <div className="flex justify-center items-center py-6">
            <Spinner />
          </div>
        )}

        {/* No results message */}
        {!isLoadingSearchSuggestions && 
         debouncedSearchText.length > 0 &&
         !showAllFiles &&
         searchSuggestions?.folderList.length === 0 &&
         searchSuggestions?.fileList.length === 0 && (
          <div className="flex flex-col justify-center items-center py-8 px-4 text-gray-500">
            <SearchIcon className="w-12 h-12 mb-2 text-gray-300" />
            <p className="text-center">No matching files or folders found</p>
            <p className="text-sm text-center mt-1">Try different keywords or check your spelling</p>
          </div>
        )}

        {/* Show all files when empty search */}
        {debouncedSearchText.length === 0 && showAllFiles && (
          <div className="py-2">
            {isLoadingAllFiles ? (
              <div className="flex justify-center items-center py-6">
                <Spinner />
              </div>
            ) : (
              <>
                {allFiles && allFiles.length > 0 ? (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                      Recent Files
                    </div>
                    {allFiles.map((file) => (
                      <SearchBarItem
                        type="file"
                        file={file}
                        folderClick={folderClick}
                        fileClick={fileClick}
                        key={file._id}
                      />
                    ))}
                  </>
                ) : (
                  <div className="p-2 text-center text-gray-500">
                    <p>No recent files found</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Search results */}
        {!isLoadingSearchSuggestions && 
         debouncedSearchText.length > 0 && 
         (searchSuggestions?.folderList.length > 0 || searchSuggestions?.fileList.length > 0) && (
          <div className="py-2">
            {/* Folders section */}
            {searchSuggestions?.folderList.length > 0 && (
              <>
                <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">
                  Folders
                </div>
                {searchSuggestions?.folderList.map((folder: FolderInterface) => (
                  <SearchBarItem
                    type="folder"
                    folder={folder}
                    folderClick={folderClick}
                    fileClick={fileClick}
                    key={folder._id}
                  />
                ))}
              </>
            )}

            {/* Files section */}
            {searchSuggestions?.fileList.length > 0 && (
              <>
                <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">
                  Files
                </div>
                {searchSuggestions?.fileList.map((file: FileInterface) => (
                  <SearchBarItem
                    type="file"
                    file={file}
                    folderClick={folderClick}
                    fileClick={fileClick}
                    key={file._id}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </form>
  );
});

export default AnimatedSearchBar;

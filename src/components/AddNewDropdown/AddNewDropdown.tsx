import { useParams } from "react-router-dom";
import { createFolderAPI } from "../../api/foldersAPI";
import { useClickOutOfBounds } from "../../hooks/utils";
import { showCreateFolderPopup } from "../../popups/folder";
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useUploader } from "../../hooks/files";
import UploadFileIcon from "../../icons/UploadFileIcon";
import CreateFolderIcon from "../../icons/CreateFolderIcon";
import FolderUploadIcon from "../../icons/FolderUploadIcon";
import Swal from "sweetalert2";
import { useFolders } from "../../hooks/folders";

interface AddNewDropdownProps {
  closeDropdown: () => void;
  isDropdownOpen: boolean;
}

const AddNewDropdown: React.FC<AddNewDropdownProps> = ({
  closeDropdown,
  isDropdownOpen,
}) => {
  const params = useParams();
  const { refetch: refetchFolders } = useFolders(false);
  const [supportsWebkitDirectory, setSupportsWebkitDirectory] = useState(false);
  const { wrapperRef } = useClickOutOfBounds(closeDropdown, true);
  const uploadRef: RefObject<HTMLInputElement> = useRef(null);
  const uploadFolderRef: RefObject<HTMLInputElement> = useRef(null);
  const { uploadFiles, uploadFolder } = useUploader();

  const createFolder = async () => {
    closeDropdown();
    const folderName = await showCreateFolderPopup();

    if (folderName === undefined || folderName === null) {
      return;
    }

    await createFolderAPI(folderName, params.id);
    refetchFolders();
  };

  const handleUpload = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    closeDropdown();

    const files = uploadRef.current?.files;
    if (!files) return;

    uploadFiles(files);
  };

  const checkForWebkitDirectory = (items: FileList) => {
    for (let i = 0; i < items.length; i++) {
      if (!items[i].webkitRelativePath) {
        return false;
      }
    }
    return true;
  };

  const handleFolderUpload = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    closeDropdown();

    const items = uploadFolderRef.current?.files;

    if (!items || !items.length) {
      Swal.fire({
        title: "No items selected",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Okay",
      });
      return;
    }

    const hasWebkitDirectory = checkForWebkitDirectory(items);

    if (!hasWebkitDirectory) {
      uploadFiles(items);
    } else {
      uploadFolder(items);
    }
  };

  const triggerFileUpload = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const triggerFolderUpload = () => {
    if (uploadFolderRef.current) {
      uploadFolderRef.current.click();
    }
  };

  useEffect(() => {
    if (uploadFolderRef.current) {
      setSupportsWebkitDirectory("webkitdirectory" in uploadFolderRef.current);
    }
  }, []);

  // Get the position of the button to properly position the dropdown
  // Using useEffect to ensure this runs after DOM is ready
  useEffect(() => {
    if (isDropdownOpen) {
      const handlePositioning = () => {
        const dropdown = document.getElementById('add-new-dropdown');
        const button = document.getElementById('add-new-button');
        if (dropdown && button) {
          const buttonRect = button.getBoundingClientRect();
          dropdown.style.top = `${buttonRect.bottom + 5}px`;
          dropdown.style.left = `${buttonRect.left}px`;
          dropdown.style.width = `${buttonRect.width}px`;
        }
      };
      
      handlePositioning();
      window.addEventListener('resize', handlePositioning);
      return () => window.removeEventListener('resize', handlePositioning);
    }
  }, [isDropdownOpen]);
  
  return (
    <div
      ref={wrapperRef}
      className="fixed text-gray-500 z-[999]"
      id="add-new-dropdown"
      style={{
        position: 'fixed',
        display: isDropdownOpen ? 'block' : 'none'
      }}
    >
      <input
        className="hidden"
        ref={uploadRef}
        type="file"
        multiple={true}
        onChange={handleUpload}
      />
      <input
        className="hidden"
        ref={uploadFolderRef}
        type="file"
        // @ts-expect-error webkitdirectory is a non-standard attribute
        webkitdirectory="true"
        onChange={handleFolderUpload}
      />
      <ul
        className="rounded-md overflow-hidden shadow-xl border border-gray-200 bg-white animate transition-all duration-200 opacity-100 visible max-h-[200px]"
      >
        <li>
          <div>
            <button
              type="button"
              className="flex w-full items-center justify-start px-5 py-3 border-0 bg-white hover:bg-white-hover text-sm"
              onClick={triggerFileUpload}
            >
              <UploadFileIcon className="w-4 h-4 mr-2.5 text-primary" />
              <p className="text-sm">Upload Files</p>
            </button>
          </div>
        </li>
        <li>
          <button
            type="button"
            className="flex w-full items-center justify-start px-5 py-3 border-0 bg-white hover:bg-white-hover text-sm"
            onClick={createFolder}
          >
            <CreateFolderIcon className="w-4 h-4 mr-2.5 text-primary" />
            <p className="text-sm">Create Folder</p>
          </button>
        </li>
        {supportsWebkitDirectory && (
          <li>
            <button
              type="button"
              className="flex w-full items-center justify-start px-5 py-3 border-0 bg-white hover:bg-white-hover text-sm"
              onClick={triggerFolderUpload}
            >
              <FolderUploadIcon className="w-4 h-4 mr-2.5 text-primary" />
              <p className="text-sm">Upload Folder</p>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default AddNewDropdown;

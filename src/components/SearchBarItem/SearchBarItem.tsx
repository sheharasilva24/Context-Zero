import type { FileInterface } from "../../types/file";
import type { FolderInterface } from "../../types/folders";
import { getFileColor, getFileExtension } from "../../utils/files";
import { memo } from "react";

interface SearchBarItemProps {
  file?: FileInterface;
  folder?: FolderInterface;
  type: "file" | "folder";
  fileClick: (file: FileInterface) => void;
  folderClick: (folder: FolderInterface) => void;
}

const SearchBarItem = memo((props: SearchBarItemProps) => {
  const { type, folder, file, fileClick, folderClick } = props;

  const fileExtension = file ? getFileExtension(file.filename, 3) : "";

  const imageColor = file ? getFileColor(file.filename) : "";

  if (type === "folder" && folder) {
    return (
      <button
        type="button"
        className="flex flex-row items-center w-full text-left py-3 px-4 overflow-hidden hover:bg-gray-100 transition-colors duration-150 rounded-md mx-1 my-0.5"
        key={folder._id}
        onClick={() => folderClick(folder)}
        aria-label={`Open folder ${folder.name}`}
      >
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-primary transition-transform duration-200 transform group-hover:scale-110"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="folder"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{folder.name}</div>
          <div className="text-xs text-gray-500">Folder</div>
        </div>
      </button>
    );
  }
  
  if (type === "file" && file) {
    return (
      <button
        type="button"
        className="flex flex-row items-center w-full text-left py-3 px-4 overflow-hidden hover:bg-gray-100 transition-colors duration-150 rounded-md mx-1 my-0.5"
        key={file._id}
        onClick={() => fileClick(file)}
        aria-label={`Open file ${file.filename}`}
      >
        <div className="flex-shrink-0">
          <div
            className="h-6 w-6 rounded-md flex items-center justify-center transition-transform duration-200 transform group-hover:scale-110 shadow-sm"
            style={{ background: imageColor }}
          >
            <span className="font-semibold text-[9.5px] text-white">
              {fileExtension}
            </span>
          </div>
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{file.filename}</div>
          <div className="text-xs text-gray-500 truncate">
            File
          </div>
        </div>
      </button>
    );
  }
  return null;
});

export default SearchBarItem;

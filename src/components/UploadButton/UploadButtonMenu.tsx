import { useState } from 'react';
import UploadFileIcon from '../../icons/UploadFileIcon';
import FolderUploadIcon from '../../icons/FolderUploadIcon';

interface UploadButtonMenuProps {
  onFileUpload: () => void;
  onFolderUpload: () => void;
  className?: string;
}

const UploadButtonMenu: React.FC<UploadButtonMenuProps> = ({ 
  onFileUpload, 
  onFolderUpload, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleFileUpload = () => {
    onFileUpload();
    setIsOpen(false);
  };

  const handleFolderUpload = () => {
    onFolderUpload();
    setIsOpen(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-20 ${className}`}>
      {/* Upload options menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 min-w-[180px] animate-fade-in">
          <button
            type="button"
            onClick={handleFileUpload}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150"
          >
            <UploadFileIcon className="w-5 h-5 mr-3 text-primary" />
            <span>Upload files</span>
          </button>
          <button
            type="button"
            onClick={handleFolderUpload}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150"
          >
            <FolderUploadIcon className="w-5 h-5 mr-3 text-primary" />
            <span>Upload folder</span>
          </button>
        </div>
      )}

      {/* Main upload button */}
      <button
        onClick={toggleMenu}
        className={`bg-primary hover:bg-primary-hover text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-110 hover:shadow-xl ${isOpen ? 'rotate-45' : ''}`}
        aria-label="Upload options"
        title="Upload options"
        type="button"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-transform duration-200"
        >
          <title>Add Icon</title>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
};

export default UploadButtonMenu;

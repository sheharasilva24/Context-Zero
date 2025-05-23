import { useRef } from 'react';
import { useUploader } from '../../hooks/files';
import UploadButtonMenu from './UploadButtonMenu';
import { toast } from 'react-toastify';

interface UploadButtonProps {
  className?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({ className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles, uploadFolder } = useUploader();

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFolderUploadClick = () => {
    folderInputRef.current?.click();
  };

  const handleFiles = (files: FileList) => {
    if (!files || files.length === 0) return;
    
    const totalFiles = files.length;
    if (totalFiles > 0) {
      toast.info(`Uploading ${totalFiles} file${totalFiles > 1 ? 's' : ''}`);
    }
    
    // Use the proper uploader hook to upload files to S3
    uploadFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    
    // Reset the input so the same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast.info('Uploading folder...');
      uploadFolder(e.target.files);
    }
    
    // Reset the input so the same folder can be uploaded again
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  return (
    <>
      <UploadButtonMenu 
        onFileUpload={handleFileUploadClick}
        onFolderUpload={handleFolderUploadClick}
        className={className}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderChange}
        className="hidden"
        // @ts-expect-error - webkitdirectory and directory are valid HTML attributes but not in TypeScript definitions
        webkitdirectory=""
        directory=""
        multiple
      />
    </>
  );
};

export default UploadButton;

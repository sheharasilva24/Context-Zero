import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import UploadFileIcon from '../../icons/UploadFileIcon';
import { useUploader } from '../../hooks/files';

const DragUploadZone: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFiles } = useUploader();

  // Define all handlers within useEffect to avoid dependency issues
  useEffect(() => {
    // Function to handle file uploads
    const handleFiles = (files: FileList) => {
      if (!files || files.length === 0) return;
      
      const totalFiles = files.length;
      if (totalFiles > 0) {
        toast.info(`Uploading ${totalFiles} file${totalFiles > 1 ? 's' : ''}`);
      }
      
      // Use the proper uploader hook to upload files to S3
      uploadFiles(files);
    };
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    };

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Check if the target is the document or body to make sure we're actually leaving the window
      if (e.target === document || e.target === document.body) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (e.dataTransfer?.files) {
        handleFiles(e.dataTransfer.files);
      }
    };

    // Add event listeners
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    // Clean up
    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [isDragging, uploadFiles]); // Only depend on required external dependencies



  return (
    <div className={`drag-upload-zone ${isDragging ? 'active' : ''}`}>
      <div className="drag-upload-zone-content">
        <UploadFileIcon className="w-16 h-16" />
        <h3>Drop files to upload</h3>
        <p>Your files will be uploaded to this folder</p>
      </div>
    </div>
  );
};

export default DragUploadZone;

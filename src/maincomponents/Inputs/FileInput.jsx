import React, { useRef, useState } from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@maincomponents/components/ui/form';
import { Input } from '@maincomponents/components/ui/input';
import { X } from 'lucide-react';

const FileUploadInput = ({ label, field, existingFileUrl }) => {
  const fileInputRef = useRef(null);
  const [showExistingFile, setShowExistingFile] = useState(!!existingFileUrl);

  const file = field.value;

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/'))) {
      selectedFile.previewUrl = URL.createObjectURL(selectedFile);
      field.onChange(selectedFile); // update form value
      setShowExistingFile(false); // hide existing image
    } else {
      alert('Only PDF or image files are allowed');
      e.target.value = '';
    }
  };

  const handleRemove = () => {
    if (file && typeof file !== 'string') {
      URL.revokeObjectURL(file.previewUrl);
    }

    field.onChange(null); // remove selected file
    setShowExistingFile(false); // hide existing backend preview

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderPreview = () => {
    if (file && typeof file !== 'string') {
      if (file.type === 'application/pdf') {
        return <p className='text-sm text-gray-500 mt-2'>PDF: {file.name}</p>;
      } else {
        return <img src={file.previewUrl} alt='Preview' className='mt-2 rounded border' width={120} height={80} />;
      }
    } else if (showExistingFile && existingFileUrl) {
      if (existingFileUrl.endsWith('.pdf')) {
        return (
          <a
            href={`${import.meta.env.VITE_FILE_URL}/${existingFileUrl}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 underline mt-2 block text-sm'
          >
            View existing PDF
          </a>
        );
      } else {
        return (
          <img
            src={`${import.meta.env.VITE_FILE_URL}/${existingFileUrl}`}
            alt='Existing file'
            className='mt-2 rounded border'
            width={120}
            height={80}
          />
        );
      }
    }

    return null;
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className='relative'>
          <Input type='file' accept='image/*,.pdf' onChange={handleFileChange} ref={fileInputRef} />
          {(field.value || showExistingFile) && (
            <button
              type='button'
              onClick={handleRemove}
              className='absolute right-2 top-1/2 -translate-y-1/2 text-red-500'
              title='Remove file'
            >
              <X size={18} />
            </button>
          )}
        </div>
      </FormControl>
      {renderPreview()}
      <FormMessage />
    </FormItem>
  );
};

export default FileUploadInput;

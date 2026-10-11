import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiFile,
  FiX,
  FiImage,
  FiFileText,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMIT,
} from '../../utils/constants';
import { formatFileSize } from '../../utils/helpers';

const FileUpload = ({
  label,
  name,
  value,
  onChange,
  error,
  required,
  disabled,
  accept = ALLOWED_FILE_TYPES,
  maxSize = FILE_SIZE_LIMIT,
  multiple = false,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState(value || []);
  const inputRef = useRef(null);

  const acceptStr = Array.isArray(accept) ? accept.join(',') : accept;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (selectedFiles) => {
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach((file) => {
      if (Array.isArray(accept) && !accept.includes(file.type)) {
        errors.push(`Invalid file type: ${file.name}`);
        return;
      }
      if (file.size > maxSize) {
        errors.push(
          `File too large: ${file.name} (max ${formatFileSize(maxSize)})`
        );
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      errors.forEach((msg) => toast.error(msg));
      return;
    }

    const newFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(newFiles);
    if (onChange) {
      onChange(multiple ? newFiles : newFiles[0] || null);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onChange) {
      onChange(multiple ? newFiles : newFiles[0] || null);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return FiImage;
    return FiFileText;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200
          ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={acceptStr}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-3">
            <FiUpload className="text-2xl" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Drag & drop files here or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supported: JPG, PNG, PDF, DOC, XLS
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Max size: {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 space-y-2"
          >
            {files.map((file, index) => {
              const Icon = getFileIcon(file);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FiX className="text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FileUpload;
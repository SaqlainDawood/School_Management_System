import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUploadCloud,
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
  helperText,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState(value ? (Array.isArray(value) ? value : [value]) : []);
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
      if (Array.isArray(accept) && accept.length > 0 && !accept.includes(file.type)) {
        errors.push(`Invalid file type: ${file.name}`);
        return;
      }
      if (file.size > maxSize) {
        errors.push(
          `File exceeds limit: ${file.name} (max ${formatFileSize(maxSize)})`
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
    if (file.type?.startsWith('image/')) return FiImage;
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
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1" title="Required">*</span>}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-150 text-center
          ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/40'
          }
          ${error ? 'border-rose-500' : ''}
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

        <div className="flex flex-col items-center justify-center">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-2.5">
            <FiUploadCloud className="text-2xl" />
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            <span className="text-indigo-600 dark:text-indigo-400 hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            PNG, JPG, PDF or DOC up to {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 space-y-2"
          >
            {files.map((file, index) => {
              const Icon = getFileIcon(file);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-subtle"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                      <Icon className="text-base" />
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {file.name || 'Uploaded File'}
                      </p>
                      {file.size && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {formatFileSize(file.size)}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-2"
                    aria-label="Remove file"
                  >
                    <FiX className="text-base" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
        >
          {error}
        </motion.p>
      )}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FileUpload;

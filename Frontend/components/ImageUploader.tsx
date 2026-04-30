"use client";

import React, { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function ImageUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative w-full py-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
          isDragging
            ? 'border-[#0071e3] bg-blue-500/5'
            : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
        }`}
      >
        <div className={`p-4 rounded-full mb-4 transition-colors ${
          isDragging ? 'bg-[#0071e3] text-white' : 'bg-white dark:bg-[#2c2c2e] text-[#6e6e73]'
        }`}>
          <Upload size={32} />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-[#1d1d1f] dark:text-white mb-1">
            Drag and drop vehicle photos here
          </p>
          <p className="text-xs text-[#6e6e73]">
            Support JPG, PNG and HEIC. Max 10MB per file.
          </p>
        </div>
        <input 
          type="file" 
          multiple 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => {
            if (e.target.files) {
              setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
            }
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/5 rounded-xl animate-in fade-in slide-in-from-bottom-1"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                  <FileText size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#1d1d1f] dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-[#6e6e73]">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-2 hover:bg-red-500/10 text-[#6e6e73] hover:text-red-500 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

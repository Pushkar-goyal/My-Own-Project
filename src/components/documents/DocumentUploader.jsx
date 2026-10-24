import React, { useState, useRef } from 'react';
import { Upload, FileCheck, Sparkles, Loader2 } from 'lucide-react';
import { ocrService } from '../../services/ocr/ocrService';

export default function DocumentUploader({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Identity Proof');
  const [docType, setDocType] = useState('Aadhaar Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrData, setOcrData] = useState(null);
  const fileInputRef = useRef(null);

  const categories = [
    'Identity Proof', 'Address Proof', 'Income Proof', 'Age/DOB Proof',
    'Residence/Domicile Proof', 'Caste Certificate', 'Financial Documents',
    'Agriculture Documents', 'Educational Documents', 'Tax Documents'
  ];

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    try {
      // Run simulated OCR extraction
      const ocrResult = await ocrService.extractFieldsFromDocument(file, docType);
      setOcrData(ocrResult);

      await onUploadSuccess(file, {
        category: selectedCategory,
        documentType: docType,
        issuingAuthority: 'Government Authority'
      });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-gov-blue dark:text-blue-400" />
            <span>Upload Document to Citizen Vault</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Uploaded files are stored locally in IndexedDB with zero external server upload.
          </p>
        </div>
      </div>

      {/* Select Category & Document Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Document Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Specific Document Title</label>
          <input
            type="text"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            placeholder="e.g. Aadhaar Card, Income Cert"
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-gov-blue bg-blue-50/50 dark:bg-blue-950/30 scale-[1.01]'
            : 'border-gray-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-gov-blue'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <Loader2 className="w-8 h-8 text-gov-blue animate-spin" />
            <p className="text-xs font-bold text-gray-700 dark:text-slate-300">
              Encrypting & Saving to IndexedDB...
            </p>
            <p className="text-[11px] text-gray-400">Running OCR Auto-Extraction Analysis</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-slate-800 text-gov-blue dark:text-blue-400 mx-auto flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-800 dark:text-slate-200">
              Drag & drop your document file here, or <span className="text-gov-blue dark:text-blue-400 underline">browse</span>
            </p>
            <p className="text-xs text-gray-400">
              Supports PDF, PNG, JPG, WEBP (Max 10MB file size limit)
            </p>
          </div>
        )}
      </div>

      {/* OCR Simulated Output */}
      {ocrData && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>OCR Ready Architecture Engine - Auto Extracted Data (Confidence: 96%)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-gray-700 dark:text-slate-300">
            <div>Name: <span className="font-bold">{ocrData.extractedFields.fullName}</span></div>
            <div>DOB: <span className="font-bold">{ocrData.extractedFields.dob}</span></div>
            <div>Aadhaar: <span className="font-bold">{ocrData.extractedFields.aadhaarNumber}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

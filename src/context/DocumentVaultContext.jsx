import React, { createContext, useContext, useState, useEffect } from 'react';
import { indexedDBService } from '../services/storage/indexedDBService';

const DocumentVaultContext = createContext();
const initialDocs = [
  { documentType: 'Aadhaar Card', status: 'Available', demoOnly: true },
  { documentType: 'Marksheet', status: 'Available', demoOnly: true },
  { documentType: 'Income Certificate', status: 'Available', demoOnly: true }
];

export function DocumentVaultProvider({ children }) {
  const [documents, setDocuments] = useState(() => {
    try { const saved = localStorage.getItem('demo_document_vault'); return saved ? JSON.parse(saved).map(d => ({ ...d, demoOnly: d.demoOnly ?? true })) : initialDocs; }
    catch { return initialDocs; }
  });
  useEffect(() => { localStorage.setItem('demo_document_vault', JSON.stringify(documents.map(({ file, ...d }) => d))); }, [documents]);

  const addDocument = async (metadata, file = null) => {
    const id = metadata.id || `${(metadata.documentType || 'document').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const saved = { ...metadata, id, status: 'Available', demoOnly: !file, fileName: file?.name || metadata.fileName || null, mimeType: file?.type || metadata.mimeType || null, size: file?.size || metadata.size || null, updatedAt: new Date().toISOString() };
    if (file) await indexedDBService.saveDocument({ id, documentType: saved.documentType, name: file.name, mimeType: file.type, size: file.size, blob: file, updatedAt: saved.updatedAt });
    setDocuments(prev => [...prev.filter(d => d.documentType !== metadata.documentType), saved]);
    return saved;
  };
  const getStoredFile = async (doc) => doc?.id ? indexedDBService.getDocument(doc.id) : null;
  const removeDocument = async (docName) => {
    const target = documents.find(d => d.documentType === docName);
    if (target?.id && !target.demoOnly) await indexedDBService.deleteDocument(target.id);
    setDocuments(prev => prev.filter(d => d.documentType !== docName));
  };
  const clearAllDocuments = async () => { await indexedDBService.clearAll(); setDocuments([]); };
  return <DocumentVaultContext.Provider value={{ documents, addDocument, removeDocument, clearAllDocuments, getStoredFile }}>{children}</DocumentVaultContext.Provider>;
}
export const useDocumentVault = () => useContext(DocumentVaultContext);

import { useState, useCallback } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  Loader2,
  FileSpreadsheet,
  Plug,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../lib/i18n';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'csv';
  progress: number;
}

export function IngestionPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation();

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((f, i) => ({
      id: `${Date.now()}_${i}`,
      name: f.name,
      size: f.size,
      type: f.name.endsWith('.csv') ? 'csv' : 'pdf',
      progress: 100,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleProcess = () => {
    setProcessing(true);
    setTimeout(() => setProcessing(false), 2000);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('ingestion.title')}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {t('ingestion.subtitle')}
        </p>
      </div>

      {/* 3 import methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Drag & Drop */}
        <div className="md:col-span-2">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer min-h-[260px]',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40 hover:bg-muted/30'
            )}
          >
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <UploadCloud className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold">{t('ingestion.dropzone.title')}</p>
              <p className="text-xs text-muted-foreground">{t('ingestion.dropzone.subtitle')} — {t('ingestion.dropzone.max')}</p>
            </div>
            <label className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 cursor-pointer transition-colors">
              {t('ingestion.dropzone.browse')}
              <input
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.csv"
                onChange={e => { if (e.target.files) addFiles(e.target.files); }}
              />
            </label>
          </div>
        </div>

        {/* Side options */}
        <div className="flex flex-col gap-4">
          {/* CSV */}
          <div className="flex-1 bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 text-center hover:border-primary/40 transition-colors cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-sm">{t('ingestion.csv.title')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('ingestion.csv.subtitle')}</p>
            </div>
          </div>

          {/* API */}
          <div className="flex-1 bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center gap-3 text-center hover:border-primary/40 transition-colors cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Plug className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-sm">{t('ingestion.api.title')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('ingestion.api.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">
              {t('ingestion.files.count', { count: files.length })}
            </h3>
            <button
              onClick={handleProcess}
              disabled={processing}
              className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {processing ? t('ingestion.action.processing') : t('ingestion.action.process')}
            </button>
          </div>
          <ul className="divide-y divide-border max-h-72 overflow-y-auto">
            {files.map(file => (
              <li key={file.id} className="flex items-center gap-3 px-5 py-3">
                <FileText className={cn('h-5 w-5 shrink-0', file.type === 'csv' ? 'text-emerald-500' : 'text-primary')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <button onClick={() => removeFile(file.id)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors" title={t('ingestion.file.remove')}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

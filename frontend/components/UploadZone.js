'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageUp, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function UploadZone({ onInserted }) {
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [message, setMessage] = useState('');

  const processFile = useCallback(async (file) => {
    setStatus('uploading');
    setMessage('');

    try {
      // Convert to Base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // strip data URL prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch(`${API_URL}/api/vision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_b64: base64,
          mime_type: file.type || 'image/png',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Server error');
      }

      setStatus('success');
      setMessage(`Stashed: ${data.extracted?.product_name || 'Unknown product'}`);
      onInserted?.();

      // Reset after 3 seconds
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 3000);
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
      setTimeout(() => { setStatus('idle'); setMessage(''); }, 4000);
    }
  }, [onInserted]);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) processFile(accepted[0]);
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: status === 'uploading',
  });

  const borderColor = isDragActive
    ? 'border-purple-500 bg-purple-500/5'
    : status === 'success'
    ? 'border-emerald-500/50 bg-emerald-500/5'
    : status === 'error'
    ? 'border-red-500/50 bg-red-500/5'
    : 'border-zinc-800 hover:border-purple-500/40 hover:bg-zinc-800/50';

  const Icon =
    status === 'uploading' ? Loader2
    : status === 'success' ? CheckCircle2
    : status === 'error' ? XCircle
    : ImageUp;

  const iconColor =
    status === 'success' ? 'text-emerald-400'
    : status === 'error' ? 'text-red-400'
    : 'text-purple-400';

  return (
    <div
      {...getRootProps()}
      className={`
        relative flex flex-row items-center justify-center gap-4
        w-full rounded-xl border border-dashed py-4 px-6 cursor-pointer
        transition-all duration-300 bg-zinc-900/50 backdrop-blur-sm
        ${borderColor}
        ${status === 'uploading' ? 'pointer-events-none opacity-70' : ''}
      `}
    >
      <input {...getInputProps()} />
      <Icon
        size={20}
        className={`${iconColor} ${status === 'uploading' ? 'animate-spin' : ''} transition-colors duration-300`}
      />
      <div className="flex flex-row items-center gap-2">
        {isDragActive ? (
          <p className="text-purple-400 font-medium text-sm">Drop it to stash it →</p>
        ) : status === 'uploading' ? (
          <p className="text-zinc-400 text-sm">Extracting with Gemini…</p>
        ) : status === 'success' ? (
          <p className="text-emerald-400 font-medium text-sm">{message}</p>
        ) : status === 'error' ? (
          <p className="text-red-400 text-sm">{message}</p>
        ) : (
          <p className="text-zinc-300 font-medium text-sm">Drop a screenshot here <span className="text-zinc-500 font-normal ml-1">or click to browse (PNG, JPG, WEBP)</span></p>
        )}
      </div>
    </div>
  );
}

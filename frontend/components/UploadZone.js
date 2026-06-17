'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageUp, Loader2, CheckCircle2, XCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
        headers: { 
          'Content-Type': 'application/json'
        },
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
    ? 'border-white bg-white/5'
    : status === 'success'
    ? 'border-white/50 bg-white/5'
    : status === 'error'
    ? 'border-zinc-500/50 bg-zinc-500/5'
    : 'border-zinc-800 hover:border-white/40 hover:bg-zinc-800/50';

  const Icon =
    status === 'uploading' ? Loader2
    : status === 'success' ? CheckCircle2
    : status === 'error' ? XCircle
    : ImageUp;

  const iconColor =
    status === 'success' ? 'text-white'
    : status === 'error' ? 'text-zinc-400'
    : 'text-zinc-400';

  return (
    <div
      {...getRootProps()}
        className={`
          inline-flex flex-row items-center justify-center gap-3
          rounded-full border py-2 px-5 cursor-pointer shadow-xl
          transition-all duration-300 bg-zinc-900/80 backdrop-blur-md
          ${borderColor}
          ${status === 'uploading' ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Icon
          size={16}
          className={`${iconColor} ${status === 'uploading' ? 'animate-spin' : ''} transition-colors duration-300`}
        />
        <div className="flex flex-row items-center gap-2">
          {isDragActive ? (
            <p className="text-white font-medium text-sm">Drop here</p>
          ) : status === 'uploading' ? (
            <p className="text-zinc-400 text-sm">Extracting…</p>
          ) : status === 'success' ? (
            <p className="text-white font-medium text-sm">{message}</p>
          ) : status === 'error' ? (
            <p className="text-zinc-400 text-sm">{message}</p>
          ) : (
            <p className="text-zinc-300 font-medium text-sm">Upload Screenshot</p>
          )}
        </div>
      </div>
  );
}

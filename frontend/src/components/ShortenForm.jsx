import { useState } from 'react';
import { Link2, Copy, Check, Loader2 } from 'lucide-react';
import api from '../lib/axios';
import Button from './ui/Button';
import Input from './ui/Input';
import Toast from './ui/Toast';

export default function ShortenForm({ onSuccess }) {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    setError('');
    setShortUrl('');
    setLoading(true);
    try {
      const { data } = await api.post('/urls/shorten', { originalUrl: url });
      setShortUrl(window.location.origin + data.shortUrl);
      setToast({ message: 'URL shortened successfully!', type: 'success' });
      setUrl('');
      if (onSuccess) onSuccess(data);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to shorten URL';
      setError(message);
      setToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToast({ message: 'Failed to copy', type: 'error' });
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder="Paste your long URL here..."
            className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
              error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        <Button type="submit" size="lg" loading={loading} className="flex-shrink-0">
          {loading ? 'Shortening...' : 'Shorten'}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {shortUrl && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-green-600 font-medium mb-0.5">Your shortened URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 truncate block"
            >
              {shortUrl}
            </a>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-green-300 rounded-lg text-sm font-medium text-green-700 hover:bg-green-100 transition-colors cursor-pointer flex-shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
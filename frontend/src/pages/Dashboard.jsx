import { useState, useEffect, useCallback } from 'react';
import { Link2, Copy, Check, BarChart3, Link, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import api from '../lib/axios';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Toast from '../components/ui/Toast';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0 });
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchLinks = useCallback(async () => {
    try {
      const { data } = await api.get('/urls/my-links');
      const linksArr = Array.isArray(data) ? data : [];
      setLinks(linksArr);
      setStats({
        totalLinks: linksArr.length,
        totalClicks: linksArr.reduce((sum, l) => sum + (l.clickCount || 0), 0),
      });
    } catch {
      setToast({ message: 'Failed to load links', type: 'error' });
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = { originalUrl: originalUrl.trim() };
      if (customAlias.trim()) payload.customAlias = customAlias.trim();
      if (expiresAt) payload.expiresAt = expiresAt + 'T23:59:59';

      await api.post('/urls/shorten', payload);
      setToast({ message: 'URL shortened successfully!', type: 'success' });
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresAt('');
      fetchLinks();
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to shorten URL';
      setError(message);
      setToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (shortUrl, id) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setToast({ message: 'Failed to copy', type: 'error' });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user}
        </h1>
        <p className="text-gray-500 mt-1">Manage and track all your shortened links.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Link className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Links</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalLinks}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BarChart3 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Clicks</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
          </div>
        </Card>
      </div>

      {/* Shorten Form */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Link</h2>
        <form onSubmit={handleShorten} className="space-y-4">
          <Input
            label="Original URL *"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={originalUrl}
            onChange={(e) => { setOriginalUrl(e.target.value); setError(''); }}
            error={error}
            required
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Custom Alias (Optional)"
              type="text"
              placeholder="my-custom-link"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
            <Input
              label="Expiration Date (Optional)"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          <Button type="submit" loading={loading}>
            <Link2 className="h-4 w-4 mr-1.5" />
            {loading ? 'Shortening...' : 'Shorten URL'}
          </Button>
        </form>
      </Card>

      {/* Links Table */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Links</h2>
        {fetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-12">
            <Link2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No links yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Original URL</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Short URL</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-500">Clicks</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 hidden sm:table-cell">Expires</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 max-w-[200px]">
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 truncate"
                      >
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{link.originalUrl}</span>
                      </a>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-indigo-600 font-medium truncate max-w-[120px] sm:max-w-[200px]">
                          {window.location.origin + link.shortUrl}
                        </span>
                        <button
                          onClick={() => copyToClipboard(window.location.origin + link.shortUrl, link.id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors cursor-pointer flex-shrink-0"
                          title="Copy"
                        >
                          {copiedId === link.id ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-gray-900">
                      {link.clickCount || 0}
                    </td>
                    <td className="py-3 px-2 text-gray-500 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(link.expiresAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://tarotm-production.up.railway.app';

const Admin = ({ user, navigateTo }) => {
  const [activeTab, setActiveTab] = useState('news');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    type: 'news',
  });

  const ADMIN_EMAILS = ['admin@suntarot.mn', 'manal0511@gmail.com'];
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (!isAdmin) {
      setError('❌ Админ эрх шаардлагатай');
      setLoading(false);
      return;
    }
    fetchArticles();
  }, [isAdmin]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const token = await user?.getIdToken?.();
      const res = await fetch(`${API_URL}/api/articles/admin/all`, {
        headers: { 
          'Authorization': `Bearer ${token || localStorage.getItem('firebaseToken')}` 
        },
      });
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Нийтлэл татахад алдаа гарлаа');
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      setError('Бүх талбарыг бөглөнө үү');
      return;
    }

    try {
      const token = await user?.getIdToken?.();
      const res = await fetch(`${API_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('firebaseToken')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess('✅ Нийтлэл амжилттай үүсгэгдлээ');
        setFormData({ title: '', excerpt: '', content: '', type: activeTab });
        setShowForm(false);
        fetchArticles();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Алдаа гарлаа');
      console.error(err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const token = await user?.getIdToken?.();
      const res = await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('firebaseToken')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess('✅ Нийтлэл амжилттай засагдлаа');
        setEditingId(null);
        setFormData({ title: '', excerpt: '', content: '', type: 'news' });
        fetchArticles();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Алдаа гарлаа');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Энэ нийтлэлийг устгах уу?')) return;

    try {
      const token = await user?.getIdToken?.();
      const res = await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token || localStorage.getItem('firebaseToken')}`,
        },
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess('✅ Нийтлэл устгагдлаа');
        fetchArticles();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Алдаа гарлаа');
      console.error(err);
    }
  };

  const startEdit = (article) => {
    setEditingId(article._id);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      type: article.type,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', excerpt: '', content: '', type: 'news' });
  };

  useEffect(() => {
    if (error) setTimeout(() => setError(''), 5000);
    if (success) setTimeout(() => setSuccess(''), 5000);
  }, [error, success]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center bg-purple-900/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Нэвтрэх шаардлагатай</h2>
          <p className="text-purple-300 mb-6">Админ хуудас руу нэвтрэхийн тулд эхлээд нэвтэрнэ үү</p>
          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
          >
            Нүүр хуудас руу буцах
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center bg-purple-900/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Админ эрх шаардлагатай</h2>
          <p className="text-purple-300 mb-2">Зөвхөн админ хэрэглэгчид энэ хуудсанд нэвтрэх эрхтэй.</p>
          <p className="text-sm text-purple-400 mb-6">Таны и-мэйл: {user.email}</p>
          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
          >
            Нүүр хуудас руу буцах
          </button>
        </div>
      </div>
    );
  }

  const filteredArticles = articles.filter(a => a.type === activeTab);

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2 text-purple-300">
            🛠️ Админ хяналтын самбар
          </h1>
          <p className="text-purple-400">Мэдээ, блог удирдах</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200">
            {success}
          </div>
        )}

        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'news' ? 'bg-purple-600 text-white' : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40'
            }`}
          >
            📰 Мэдээ ({articles.filter(a => a.type === 'news').length})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'blog' ? 'bg-purple-600 text-white' : 'bg-purple-900/40 text-purple-300 hover:bg-purple-800/40'
            }`}
          >
            ✍️ Блог ({articles.filter(a => a.type === 'blog').length})
          </button>
          <button
            onClick={() => { setShowForm(true); setFormData({ ...formData, type: activeTab }); }}
            className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Шинэ нэмэх
          </button>
        </div>

        {(showForm || editingId) && (
          <div className="mb-6 bg-purple-900/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-semibold mb-4 text-purple-200">
              {editingId ? '✏️ Засах' : '➕ Шинэ нийтлэл'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Гарчиг"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
              />
              <textarea
                placeholder="Товч тайлбар"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                rows="2"
              />
              <textarea
                placeholder="Бүрэн агуулга"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 bg-purple-950/60 border-2 border-purple-500/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                rows="10"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? 'Хадгалах' : 'Нэмэх'}
                </button>
                <button
                  onClick={() => { setShowForm(false); cancelEdit(); }}
                  className="px-6 py-3 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300 hover:bg-purple-500/30 transition flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Болих
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-purple-300">Уншиж байна...</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12 bg-purple-900/20 rounded-2xl border border-purple-500/20">
                <p className="text-purple-400">Одоогоор {activeTab === 'news' ? 'мэдээ' : 'блог'} байхгүй байна</p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div key={article._id} className="bg-purple-900/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
                      <p className="text-purple-300 text-sm mb-3">{article.excerpt}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-purple-400">
                        <span>📅 {new Date(article.createdAt).toLocaleDateString('mn-MN')}</span>
                        <span>👤 {article.author}</span>
                        <span>📝 {article.type === 'news' ? 'Мэдээ' : 'Блог'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(article)} className="p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg">
                        <Edit2 className="w-5 h-5 text-blue-400" />
                      </button>
                      <button onClick={() => handleDelete(article._id)} className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg">
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
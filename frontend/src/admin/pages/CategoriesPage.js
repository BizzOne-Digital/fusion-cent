import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { getCategories, createCategory, updateCategory, deleteCategory, uploadImage } from '../utils/api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', isActive: true };

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [catImage, setCatImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try { const { data } = await getCategories(); setCategories(data); }
    catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setCatImage(null); setModal(true); };
  const openEdit = (cat) => {
    setEditing(cat._id);
    setForm({ name: cat.name, description: cat.description || '', isActive: cat.isActive });
    setCatImage(cat.image || null);
    setModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadImage(file);
      setCatImage(data);
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.name) { toast.error('Category name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, ...(catImage ? { image: catImage } : {}) };
      if (editing) { await updateCategory(editing, payload); toast.success('Category updated'); }
      else { await createCategory(payload); toast.success('Category created'); }
      setModal(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try { await deleteCategory(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div><h1>Categories</h1><p>{categories.length} categories</p></div>
        <button className="adm-btn adm-btn-primary" onClick={openCreate}><FiPlus /> Add Category</button>
      </div>

      {loading ? <div className="adm-spinner" /> : (
        <div className="categories-grid-admin">
          {categories.map(cat => (
            <div key={cat._id} className="cat-card adm-card">
              <div className="cat-img">
                {cat.image?.url ? <img src={cat.image.url} alt={cat.name} /> : <span>🏷️</span>}
              </div>
              <div className="cat-info">
                <strong>{cat.name}</strong>
                {cat.description && <p>{cat.description}</p>}
                <span className={`adm-status-badge ${cat.isActive ? 'adm-status-delivered' : 'adm-status-cancelled'}`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="cat-actions">
                <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEdit(cat)}><FiEdit2 /></button>
                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(cat._id, cat.name)}><FiTrash2 /></button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--adm-gray-400)' }}>
              No categories yet. Click "Add Category" to get started.
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="adm-modal-overlay" onClick={() => setModal(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button className="adm-modal-close" onClick={() => setModal(false)}><FiX /></button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-form-group">
                <label>Category Image</label>
                <div className="image-upload-area" onClick={() => fileRef.current.click()}>
                  {catImage?.url ? (
                    <img src={catImage.url} alt="category" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
                  ) : (
                    <><FiUpload /><span>{uploading ? 'Uploading...' : 'Upload Image'}</span></>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              </div>
              <div className="adm-form-group">
                <label>Category Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Floral" />
              </div>
              <div className="adm-form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Optional description" />
              </div>
              <label className="checkbox-label">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                <span>Active (visible in store)</span>
              </label>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving || uploading}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

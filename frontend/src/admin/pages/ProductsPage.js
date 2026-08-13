import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiSearch } from 'react-icons/fi';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadImages, deleteImage } from '../utils/api';
import toast from 'react-hot-toast';
import './ProductsPage.css';

const emptyForm = { name: '', shortDescription: '', description: '', price: '', comparePrice: '', category: '', gender: 'Unisex', size: '8ml', stock: 0, isFeatured: false, isBestSeller: false, isNewArrival: false, tags: '' };

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getProducts({ search, page, limit: 15 }), getCategories()]);
      setProducts(p.data.products || []);
      setTotal(p.data.total || 0);
      setCategories(c.data || []);
    } catch (e) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, page]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImages([]);
    setModal(true);
  };

  const openEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: product.price,
      comparePrice: product.comparePrice || '',
      category: product.category?._id || '',
      gender: product.gender,
      size: product.size || '8ml',
      stock: product.stock,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
      tags: product.tags?.join(', ') || '',
    });
    setImages(product.images || []);
    setModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const { data } = await uploadImages(files);
      setImages(prev => [...prev, ...data]);
      toast.success(`${data.length} image(s) uploaded`);
    } catch { toast.error('Upload failed. Check Cloudinary config.'); }
    finally { setUploading(false); }
  };

  const removeImage = async (img, i) => {
    if (img.public_id) {
      try { await deleteImage(img.public_id); } catch { }
    }
    setImages(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.description || !form.category) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        comparePrice: Number(form.comparePrice) || 0,
        stock: Number(form.stock),
        images,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editing) {
        await updateProduct(editing, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
      }
      setModal(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try { await deleteProduct(id); toast.success('Product deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1>Products</h1>
          <p>{total} products in your store</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={openCreate}><FiPlus /> Add Product</button>
      </div>

      <div className="adm-card">
        <div className="table-toolbar">
          <div className="search-wrap">
            <FiSearch />
            <input placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>

        {loading ? <div className="adm-spinner" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Gender</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Badges</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--adm-gray-400)', padding: '2rem' }}>No products found</td></tr>
                ) : products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-thumb">
                          {p.images?.[0]?.url ? <img src={p.images[0].url} alt={p.name} /> : <span>🌸</span>}
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.88rem' }}>{p.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--adm-gray-500)' }}>{p.size}</span>
                        </div>
                      </div>
                    </td>
                    <td>{p.category?.name || '—'}</td>
                    <td>{p.gender}</td>
                    <td>
                      <strong>${p.price}</strong>
                      {p.comparePrice > p.price && <span style={{ color: 'var(--adm-gray-400)', fontSize: '0.78rem', textDecoration: 'line-through', marginLeft: '0.4rem' }}>${p.comparePrice}</span>}
                    </td>
                    <td>
                      <span style={{ color: p.stock < 5 ? 'var(--adm-danger)' : 'var(--adm-success)', fontWeight: 600 }}>{p.stock}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {p.isFeatured && <span className="mini-badge featured">Featured</span>}
                        {p.isBestSeller && <span className="mini-badge bestseller">Best Seller</span>}
                        {p.isNewArrival && <span className="mini-badge new">New</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEdit(p)}><FiEdit2 /></button>
                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(p._id, p.name)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {Math.ceil(total / 15) > 1 && (
          <div className="table-pagination">
            {[...Array(Math.ceil(total / 15))].map((_, i) => (
              <button key={i} className={`adm-page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="adm-modal-overlay" onClick={() => setModal(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="adm-modal-close" onClick={() => setModal(false)}><FiX /></button>
            </div>
            <div className="adm-modal-body">
              {/* Images */}
              <div className="adm-form-group">
                <label>Product Images (Cloudinary)</label>
                <div className="image-upload-area" onClick={() => fileRef.current.click()}>
                  <FiUpload />
                  <span>{uploading ? 'Uploading...' : 'Click to upload images'}</span>
                  <small>JPG, PNG, WebP · Max 6 images</small>
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                {images.length > 0 && (
                  <div className="image-preview-row">
                    {images.map((img, i) => (
                      <div key={i} className="image-preview-item">
                        <img src={img.url} alt={`img-${i}`} />
                        <button className="img-remove" onClick={() => removeImage(img, i)}><FiX /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-grid-2">
                <div className="adm-form-group">
                  <label>Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Velvet Rose" />
                </div>
                <div className="adm-form-group">
                  <label>Size</label>
                  <input value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="8ml" />
                </div>
              </div>
              <div className="adm-form-group">
                <label>Short Description</label>
                <input value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="One-liner shown on product card" />
              </div>
              <div className="adm-form-group">
                <label>Full Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Detailed product description..." />
              </div>
              <div className="form-grid-3">
                <div className="adm-form-group">
                  <label>Price ($) *</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="25.00" />
                </div>
                <div className="adm-form-group">
                  <label>Compare Price ($)</label>
                  <input type="number" min="0" step="0.01" value={form.comparePrice} onChange={e => setForm(f => ({ ...f, comparePrice: e.target.value }))} placeholder="35.00" />
                </div>
                <div className="adm-form-group">
                  <label>Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="adm-form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="adm-form-group">
                  <label>Gender</label>
                  <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                    <option>For Her</option>
                    <option>For Him</option>
                    <option>Unisex</option>
                  </select>
                </div>
              </div>
              <div className="adm-form-group">
                <label>Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="floral, rose, summer" />
              </div>
              <div className="checkbox-row">
                {[
                  { key: 'isFeatured', label: '⭐ Featured' },
                  { key: 'isBestSeller', label: '🏆 Best Seller' },
                  { key: 'isNewArrival', label: '🆕 New Arrival' },
                ].map(cb => (
                  <label key={cb.key} className="checkbox-label">
                    <input type="checkbox" checked={form[cb.key]} onChange={e => setForm(f => ({ ...f, [cb.key]: e.target.checked }))} />
                    <span>{cb.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn adm-btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving || uploading}>
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

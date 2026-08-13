import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi';
import { getSettings, updateSettings, uploadImage } from '../utils/api';
import toast from 'react-hot-toast';
import './SettingsPage.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const logoRef = useRef();

  useEffect(() => {
    getSettings().then(r => setSettings(r.data)).catch(() => toast.error('Failed to load settings')).finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await uploadImage(file);
      set('logo', data);
      toast.success('Logo uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const addFaq = () => setSettings(s => ({ ...s, faqItems: [...(s.faqItems || []), { question: '', answer: '' }] }));
  const removeFaq = (i) => setSettings(s => ({ ...s, faqItems: s.faqItems.filter((_, idx) => idx !== i) }));
  const updateFaq = (i, key, val) => setSettings(s => ({ ...s, faqItems: s.faqItems.map((f, idx) => idx === i ? { ...f, [key]: val } : f) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'hero', label: 'Hero & Banner' },
    { key: 'contact', label: 'Contact & Social' },
    { key: 'offers', label: 'Offers' },
    { key: 'faq', label: 'FAQ' },
    { key: 'seo', label: 'SEO' },
  ];

  if (loading) return <div className="adm-spinner" />;

  return (
    <div>
      <div className="adm-page-header">
        <div><h1>Site Settings</h1><p>Manage all site-wide content and configuration</p></div>
        <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
          <FiSave /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="settings-layout">
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map(t => (
            <button key={t.key} className={`settings-tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content adm-card">
          {/* General */}
          {activeTab === 'general' && (
            <div>
              <h3>General Settings</h3>
              <div className="adm-form-group">
                <label>Site Name</label>
                <input value={settings.siteName || ''} onChange={e => set('siteName', e.target.value)} />
              </div>
              <div className="adm-form-group">
                <label>Tagline</label>
                <input value={settings.tagline || ''} onChange={e => set('tagline', e.target.value)} />
              </div>
              <div className="adm-form-group">
                <label>Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {settings.logo?.url && <img src={settings.logo.url} alt="logo" style={{ height: 50, borderRadius: 8 }} />}
                  <button className="adm-btn adm-btn-outline" onClick={() => logoRef.current.click()}>
                    <FiUpload /> Upload Logo
                  </button>
                  <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
                </div>
              </div>
              <div className="adm-form-group">
                <label>Banner Text</label>
                <input value={settings.bannerText || ''} onChange={e => set('bannerText', e.target.value)} placeholder="Announcement bar text" />
              </div>
              <div className="adm-form-group">
                <label>About Us Content</label>
                <textarea rows={6} value={settings.aboutContent || ''} onChange={e => set('aboutContent', e.target.value)} placeholder="About page content..." />
              </div>
            </div>
          )}

          {/* Hero */}
          {activeTab === 'hero' && (
            <div>
              <h3>Hero Section</h3>
              <div className="adm-form-group">
                <label>Hero Title</label>
                <input value={settings.heroTitle || ''} onChange={e => set('heroTitle', e.target.value)} />
              </div>
              <div className="adm-form-group">
                <label>Hero Subtitle</label>
                <textarea rows={3} value={settings.heroSubtitle || ''} onChange={e => set('heroSubtitle', e.target.value)} />
              </div>
            </div>
          )}

          {/* Contact & Social */}
          {activeTab === 'contact' && (
            <div>
              <h3>Contact Information</h3>
              <div className="adm-form-group"><label>Email</label><input type="email" value={settings.email || ''} onChange={e => set('email', e.target.value)} /></div>
              <div className="adm-form-group"><label>Phone</label><input value={settings.phone || ''} onChange={e => set('phone', e.target.value)} /></div>
              <div className="adm-form-group"><label>Website</label><input value={settings.website || ''} onChange={e => set('website', e.target.value)} /></div>
              <h3 style={{ marginTop: '1.5rem' }}>Social Links</h3>
              {['facebook', 'instagram', 'tiktok', 'pinterest'].map(s => (
                <div key={s} className="adm-form-group">
                  <label style={{ textTransform: 'capitalize' }}>{s}</label>
                  <input placeholder={`https://${s}.com/fusionscent`}
                    value={settings.socialLinks?.[s] || ''}
                    onChange={e => set('socialLinks', { ...settings.socialLinks, [s]: e.target.value })} />
                </div>
              ))}
            </div>
          )}

          {/* Offers */}
          {activeTab === 'offers' && (
            <div>
              <h3>Special Offers</h3>
              <div className="adm-form-group">
                <label>Free Shipping Threshold ($)</label>
                <input type="number" value={settings.freeShippingThreshold || 100}
                  onChange={e => set('freeShippingThreshold', Number(e.target.value))} />
              </div>
              <div className="adm-form-group">
                <label>First Order Discount (%)</label>
                <input type="number" value={settings.firstOrderDiscount || 10}
                  onChange={e => set('firstOrderDiscount', Number(e.target.value))} />
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3>FAQ Items</h3>
                <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={addFaq}><FiPlus /> Add FAQ</button>
              </div>
              {(settings.faqItems || []).map((faq, i) => (
                <div key={i} className="faq-edit-item">
                  <div style={{ flex: 1 }}>
                    <div className="adm-form-group">
                      <label>Question {i + 1}</label>
                      <input value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)} placeholder="Enter question..." />
                    </div>
                    <div className="adm-form-group">
                      <label>Answer</label>
                      <textarea rows={3} value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} placeholder="Enter answer..." />
                    </div>
                  </div>
                  <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => removeFaq(i)}><FiTrash2 /></button>
                </div>
              ))}
              {(settings.faqItems || []).length === 0 && (
                <p style={{ color: 'var(--adm-gray-400)', fontSize: '0.88rem' }}>No FAQ items yet. Click "Add FAQ" to get started.</p>
              )}
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div>
              <h3>SEO Settings</h3>
              <div className="adm-form-group"><label>Meta Title</label><input value={settings.metaTitle || ''} onChange={e => set('metaTitle', e.target.value)} /></div>
              <div className="adm-form-group"><label>Meta Description</label><textarea rows={4} value={settings.metaDescription || ''} onChange={e => set('metaDescription', e.target.value)} /></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import ProductCard from '../components/common/ProductCard';
import { getProducts, getCategories } from '../utils/api';
import './ShopPage.css';

const GENDERS = [
  { value: 'For Her', label: 'Women' },
  { value: 'For Him', label: 'Men' },
  { value: 'Unisex', label: 'Unisex' },
];
const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'priceLow', label: 'Price: Low to High' },
  { value: 'priceHigh', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    gender: searchParams.get('gender') || '',
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    bestseller: searchParams.get('bestseller') || '',
    newarrival: searchParams.get('newarrival') || '',
  });

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = { ...filters, page, limit: 12 };
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
        const { data } = await getProducts(params);
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters, page]);

  const setFilter = (key, val) => {
    setFilters(f => ({ ...f, [key]: val }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ gender: '', category: '', search: '', sort: 'newest', bestseller: '', newarrival: '' });
    setPage(1);
  };

  return (
    <>
      <Helmet><title>Shop - FusionScent</title></Helmet>

      <div className="shop-hero">
        <div className="container">
          <h1>Our Collection</h1>
          <p>Mini refillable luxury perfumes — for every mood, every moment</p>
        </div>
      </div>

      <div className="shop-layout container">
        {/* Sidebar */}
        <aside className={`shop-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters">Clear All</button>
            <button className="sidebar-close mobile-only" onClick={() => setShowFilters(false)}><FiX /></button>
          </div>

          <div className="filter-group">
            <h4>Search</h4>
            <div className="search-input-wrap">
              <FiSearch />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={e => setFilter('search', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            {categories.map(cat => (
              <label key={cat._id} className="filter-option">
                <input type="radio" name="category" value={cat._id}
                  checked={filters.category === cat._id}
                  onChange={() => setFilter('category', cat._id)} />
                <span>{cat.name}</span>
              </label>
            ))}
            <label className="filter-option">
              <input type="radio" name="category" value=""
                checked={filters.category === ''}
                onChange={() => setFilter('category', '')} />
              <span>All Categories</span>
            </label>
          </div>

          <div className="filter-group">
            <h4>Gender</h4>
            {GENDERS.map(g => (
              <label key={g.value} className="filter-option">
                <input type="radio" name="gender" value={g.value}
                  checked={filters.gender === g.value}
                  onChange={() => setFilter('gender', g.value)} />
                <span>{g.label}</span>
              </label>
            ))}
            <label className="filter-option">
              <input type="radio" name="gender" value=""
                checked={filters.gender === ''}
                onChange={() => setFilter('gender', '')} />
              <span>All</span>
            </label>
          </div>

          <div className="filter-group">
            <h4>Collection</h4>
            <label className="filter-option">
              <input type="checkbox" checked={!!filters.bestseller}
                onChange={e => setFilter('bestseller', e.target.checked ? 'true' : '')} />
              <span>Best Sellers</span>
            </label>
            <label className="filter-option">
              <input type="checkbox" checked={!!filters.newarrival}
                onChange={e => setFilter('newarrival', e.target.checked ? 'true' : '')} />
              <span>New Arrivals</span>
            </label>
          </div>
        </aside>

        {/* Main */}
        <main className="shop-main">
          <div className="shop-toolbar">
            <div className="shop-count">
              {loading ? 'Loading...' : `${total} products found`}
            </div>
            <div className="shop-toolbar-right">
              <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)} className="sort-select">
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button className="btn btn-outline btn-sm mobile-only" onClick={() => setShowFilters(true)}>
                <FiFilter /> Filters
              </button>
            </div>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <p>No products found. Try adjusting your filters.</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="shop-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {Math.ceil(total / 12) > 1 && (
            <div className="pagination">
              {[...Array(Math.ceil(total / 12))].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => setPage(i + 1)}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ShopPage;

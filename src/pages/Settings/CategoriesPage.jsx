import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import Swal from 'sweetalert2';
import './CategoriesPage.css';

export default function CategoriesPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: '', color: '#1976d2' });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const res = await api.getCategories();
      setList(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to load categories', 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();

  
    const name = form.name.trim();
    if (!name) {
      Swal.fire('Validation', 'Category name cannot be empty', 'warning');
      return;
    }

    const duplicate = list.find(c => c.name.toLowerCase() === name.toLowerCase() && (!editing || c._id !== editing._id));
    if (duplicate) {
      Swal.fire('Validation', 'Category with this name already exists', 'warning');
      return;
    }

    try {
      if (editing) {
        await api.updateCategory(editing._id, { ...form, name });
        Swal.fire('Updated', 'Category updated successfully', 'success');
        setEditing(null);
      } else {
        await api.createCategory({ ...form, name });
        Swal.fire('Added', 'Category added successfully', 'success');
      }
      setForm({ name: '', color: '#1976d2' });
      load();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const remove = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.deleteCategory(id);
        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        load();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete category', 'error');
      }
    }
  };

  return (
    <div className="categories-page">
      <h2>Categories</h2>

      <form onSubmit={submit} className="category-form">
        <input 
          placeholder="Name" 
          value={form.name} 
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
        />
        <div className="color-picker">
          <input 
            type="color" 
            value={form.color} 
            onChange={e => setForm(f => ({ ...f, color: e.target.value }))} 
          />
          <span className="color-preview" style={{ background: form.color }} />
        </div>
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && 
          <button type="button" onClick={() => { 
            setEditing(null); 
            setForm({ name: '', color: '#1976d2' }); 
          }}>Cancel</button>
        }
      </form>

      <ul className="category-list">
        {list.map(c => (
          <li key={c._id}>
            <div className="category-color" style={{ background: c.color }} />
            <div className="category-name">{c.name}</div>
            <div className="category-actions">
              <button onClick={() => { setEditing(c); setForm({ name: c.name, color: c.color }); }}>Edit</button>
              <button onClick={() => remove(c._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

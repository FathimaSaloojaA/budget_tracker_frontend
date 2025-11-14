import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function CategoriesPage(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name:'', color:'#1976d2' });
  const [editing, setEditing] = useState(null);

  const load = async ()=>{ const res = await api.getCategories(); setList(res.data); }
  useEffect(()=>{ load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try{
      if (editing) {
        await api.updateCategory(editing._id, form);
        setEditing(null);
      } else {
        await api.createCategory(form);
      }
      setForm({ name:'', color:'#1976d2' });
      load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  }

  const remove = async (id) => { if (!confirm('Delete?')) return; await api.deleteCategory(id); load(); }

  return (
    <div style={{ padding: 20 }}>
      <h2>Categories</h2>
      <form onSubmit={submit} style={{ marginBottom: 12 }}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} required />
        <input placeholder="Color" value={form.color} onChange={e=>setForm(f=>({...f, color: e.target.value}))} />
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" onClick={()=>{ setEditing(null); setForm({ name:'', color:'#1976d2' }) }}>Cancel</button>}
      </form>
      <ul>
        {list.map(c=> (
          <li key={c._id} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:14, height:14, background: c.color }} />
            <div style={{ flex:1 }}>{c.name}</div>
            <button onClick={()=>{ setEditing(c); setForm({ name:c.name, color:c.color }) }}>Edit</button>
            <button onClick={()=>remove(c._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useState } from 'react';
import API from '../lib/api';
import Router from 'next/router';
export default function Login(){ 
  const [f, setF] = useState({ email:'', password:'' });
  const submit = async (e)=>{ 
    e.preventDefault(); 
    try {
      const { data } = await API.post('/auth/login', f);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      Router.push('/');
    } catch (err) {
      alert('Failed to login: '+(err.response?.data?.message || err.message));
    }
  };
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" onSubmit={submit}>
          <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Login</h2>
          <input
            placeholder="Email"
            value={f.email}
            onChange={e=>setF({...f,email:e.target.value})}
            className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Password"
            type="password"
            value={f.password}
            onChange={e=>setF({...f,password:e.target.value})}
            className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold">Login</button>
        </form>
      </div>
    );
}

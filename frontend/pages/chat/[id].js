import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import API from '../../lib/api';
import { io } from 'socket.io-client';
let socket;
export default function ChatPage(){
  const router = useRouter(); const { id } = router.query;
  const [messages,setMessages] = useState([]); const [text,setText]=useState(''); const fileRef = useRef();
  useEffect(()=>{
    if (!id) return;
    const f = async ()=>{ try{ const { data } = await API.get(`/messages/${id}`); setMessages(data); }catch(e){ console.log(e); } };
    f();
    const token = localStorage.getItem('accessToken');
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', { auth: { token } });
    socket.emit('joinConversation', id);
    socket.on('newMessage', (m)=> { if(String(m.conversationId)===String(id)) setMessages(prev=>[...prev,m]); });
    return ()=> { if (socket) socket.disconnect(); }
  },[id]);
  const send = async (e)=>{ e.preventDefault();
    const form = new FormData(); form.append('text', text); if (fileRef.current.files[0]) form.append('image', fileRef.current.files[0]);
    try { await API.post(`/messages/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }); } catch(e){ console.log(e); }
    setText(''); fileRef.current.value = null;
  };
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <aside className="w-80 bg-white shadow-lg p-6 flex flex-col gap-6">
          <a href="/" className="text-blue-500 hover:underline font-semibold">← Back</a>
        </aside>
        <main className="flex-1 flex flex-col justify-between p-8">
          <div className="flex-1 overflow-y-auto mb-6">
            <div className="space-y-4">
              {messages.map(m => {
                const isMine = m.senderId === JSON.parse(localStorage.getItem('user')||'null')?.id;
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-lg p-3 rounded-lg shadow ${isMine ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                      <div className="text-xs font-bold mb-1">{isMine ? 'You' : `User ${m.senderId}`}</div>
                      <div>{m.text}</div>
                      {m.imageUrl && <img src={`${process.env.NEXT_PUBLIC_API_BASE?.replace('/api','')||'http://localhost:4000'}${m.imageUrl}`} className="mt-2 rounded" width={140} />}
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && <div className="text-gray-400 text-center">No messages yet.</div>}
            </div>
          </div>
          <form onSubmit={send} className="flex gap-2 items-center">
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input type="file" ref={fileRef} className="border rounded px-2 py-1" />
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Send</button>
          </form>
        </main>
      </div>
    );
}

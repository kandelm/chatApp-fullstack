import Link from 'next/link';
import { useEffect, useState } from 'react';
import API from '../lib/api';
export default function Inbox(){
  const [convs,setConvs] = useState([]);
  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(()=>{
    const user = localStorage.getItem('user');
    if (user) {
      setLoggedInUser(JSON.parse(user));
      const fetchConvs = async()=>{ try{ const {data} = await API.get('/conversations'); setConvs(data); }catch(e){ console.log('err',e); } };
      const fetchUsers = async()=>{ try{ const {data} = await API.get('/users'); setUsers(data); }catch(e){ setError('Could not fetch users. Are you logged in?'); } };
      fetchConvs();
      fetchUsers();
    }
  },[]);

  const startConversation = async (otherUserId) => {
    setLoading(true);
    try {
      const { data } = await API.post('/conversations/start', { otherUserId });
      window.location.href = `/chat/${data.id}`;
    } catch (e) {
      alert('Failed to start conversation');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-80 bg-white shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-3xl font-bold mb-2 text-blue-700">Inbox</h2>
        {loggedInUser && (
          <div className="mb-4 text-lg font-bold text-blue-700">Welcome, {loggedInUser.username}</div>
        )}
        <div className="flex gap-2 mb-4">
          {loggedInUser ? (
            <button
              className="text-red-500 hover:underline font-semibold"
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.reload();
              }}
            >Logout</button>
          ) : (
            <>
              <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
              <span>|</span>
              <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
            </>
          )}
        </div>
        {loggedInUser ? (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-2">Chats with Users</h3>
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <ul className="space-y-2">
                {users.length === 0 && !error ? <li className="text-gray-400">No other users found.</li> : null}
                {users.map(u => {
                  // Find conversation with this user
                  const conv = convs.find(c => (c.user1Id === u.id || c.user2Id === u.id));
                  // Count unread messages (all messages not sent by me and not marked as read)
                  let unread = 0;
                  const myId = loggedInUser?.id;
                  if (conv && conv.Messages) {
                    unread = conv.Messages.filter(m => m.senderId !== myId && !m.read).length;
                  }
                  return (
                    <li key={u.id} className="flex flex-col gap-1 p-2 rounded-lg bg-gray-100">
                      <button
                        disabled={loading}
                        onClick={() => {
                          startConversation(u.id);
                          // Mark messages as read (simulate by removing badge)
                          if (conv && conv.Messages) {
                            conv.Messages.forEach(m => { if (m.senderId !== myId) m.read = true; });
                          }
                        }}
                        className="font-medium px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {u.username}
                        {conv && unread > 0 && (
                          <span className="inline-block bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">{unread}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        ) : (
          <div className="mt-8 text-gray-500 text-center">
            <h3 className="text-2xl font-bold mb-4">Welcome to Chat App</h3>
            <p className="text-lg">Please login or register to start chatting.</p>
          </div>
        )}
      </aside>
      <main className="flex-1 flex flex-col items-center justify-center p-12">
        <h3 className="text-4xl font-bold text-blue-700 mb-4">Welcome</h3>
        <p className="text-lg text-gray-600">Select a conversation or start one.</p>
      </main>
    </div>
  );
}

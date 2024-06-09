// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleJoinRoom = () => {
    if (roomId) {
      router.push(`/chat/${roomId}`);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Enter Room ID</h1>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="border p-2 mb-4 w-full"
        placeholder="Enter Room ID"
      />
      <button
        onClick={handleJoinRoom}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Join Room
      </button>
    </Layout>
  );
}

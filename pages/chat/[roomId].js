// pages/chat/[roomId].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { db, auth, provider } from '../../firebaseConfig';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const Chat = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (roomId) {
      const q = query(collection(db, 'chatrooms', roomId, 'messages'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let msgs = [];
        querySnapshot.forEach((doc) => {
          msgs.push(doc.data());
        });
        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [roomId]);

  const sendMessage = async () => {
    if (message.trim() && roomId) {
      await addDoc(collection(db, 'chatrooms', roomId, 'messages'), {
        text: message,
        uid: user.uid,
        createdAt: new Date(),
      });
      setMessage('');
    }
  };

  const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button onClick={signInWithGoogle} className="bg-blue-500 text-white py-2 px-4 rounded">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-2 ${msg.uid === user.uid ? 'bg-blue-200' : 'bg-gray-200'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Enter your message"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white py-2 px-4 rounded ml-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

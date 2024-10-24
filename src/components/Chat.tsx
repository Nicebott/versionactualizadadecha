import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, DataSnapshot, get } from "firebase/database";
import { db } from '../firebase';
import { MessageCircle, X, Smile, Send } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface Message {
  id: string;
  text: string;
  timestamp: number;
  username: string;
  isAdmin: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatRef = ref(db, 'chat');
    onValue(chatRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        setMessages(messageList);
      }
    });
  }, []);

  useEffect(() => {
    if (isChatOpen && isUsernameSet) {
      scrollToBottom();
    }
  }, [messages, isChatOpen, isUsernameSet]);

  useEffect(() => {
    setShowPasswordInput(username.toLowerCase() === 'admin');
  }, [username]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      const chatRef = ref(db, 'chat');
      push(chatRef, {
        text: newMessage,
        timestamp: Date.now(),
        username: username,
        isAdmin: isAdmin
      });
      setNewMessage('');
    }
  };

  const handleSetUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() !== '') {
      if (username.toLowerCase() === 'admin') {
        const adminRef = ref(db, 'user/admin');
        const snapshot = await get(adminRef);
        if (snapshot.exists()) {
          const adminData = snapshot.val();
          if (password === adminData.password) {
            setIsAdmin(true);
            setIsUsernameSet(true);
          } else {
            alert('Contraseña de administrador incorrecta');
            return;
          }
        } else {
          alert('No se encontraron datos de administrador');
          return;
        }
      } else {
        setIsUsernameSet(true);
      }
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const renderChatContent = () => {
    if (!isUsernameSet) {
      return (
        <form onSubmit={handleSetUsername} className="flex flex-col">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-md px-2 py-1 mb-2"
            placeholder="Ingresa tu nombre..."
          />
          {showPasswordInput && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-md px-2 py-1 mb-2"
              placeholder="Contraseña de administrador"
            />
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded-md"
          >
            Ingresar al chat
          </button>
        </form>
      );
    }

    return (
      <>
        <div className="h-48 sm:h-64 md:h-80 overflow-y-auto mb-4" ref={chatContainerRef}>
          {messages.map((message) => (
            <div key={message.id} className="mb-2">
              <p className="text-sm break-words">
                <span className={`font-bold ${message.isAdmin ? 'text-blue-600' : ''}`}>
                  {message.username}
                  {message.isAdmin && ' ✓'}:
                </span>{' '}
                {message.text}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col relative">
          <div className="flex mb-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow border rounded-l-md px-2 py-2 text-sm"
              placeholder="Escribe un mensaje..."
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="bg-gray-200 px-2 py-2 flex-shrink-0"
            >
              <Smile size={20} />
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded-r-md flex items-center justify-center flex-shrink-0"
            >
              <Send size={20} />
            </button>
          </div>
          {showEmojiPicker && (
            <div className="absolute right-0 bottom-full mb-2 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </form>
      </>
    );
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
      >
        <MessageCircle size={24} />
      </button>
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 bg-white shadow-md rounded-lg p-4 w-11/12 max-w-sm sm:w-80 md:w-96 z-40">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Chat en tiempo real</h2>
            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          {renderChatContent()}
        </div>
      )}
    </>
  );
};

export default Chat;
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const THEMES = {
  dark: {
    bg: "bg-black text-white",
    sidebar: "bg-zinc-950/90 border-white/10",
    header: "border-white/10",
    btnNew: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
    convItemActive: "bg-emerald-500/20 text-emerald-200",
    convItemInactive: "text-zinc-400 hover:bg-white/5 hover:text-white",
    btnLogout: "bg-red-500/80 hover:bg-red-600 text-white",
    emptyTitle: "text-zinc-500",
    userBubble: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
    aiBubble: "bg-zinc-800 text-white",
    inputArea: "bg-zinc-950 border-white/10",
    inputBox: "bg-zinc-900 text-white",
    sendBtn: "bg-emerald-500 hover:bg-emerald-600 text-white",
    themeBtn: "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
  },
  light: {
    bg: "bg-gray-50 text-gray-900",
    sidebar: "bg-white border-gray-200 shadow-md",
    header: "border-gray-200 text-gray-800",
    btnNew: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
    convItemActive: "bg-blue-100 text-blue-700 font-medium",
    convItemInactive: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    btnLogout: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
    emptyTitle: "text-gray-400",
    userBubble: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm",
    aiBubble: "bg-white border border-gray-200 text-gray-800 shadow-sm",
    inputArea: "bg-white border-gray-200 shadow-sm z-10",
    inputBox: "bg-gray-100 text-gray-900 placeholder-gray-500 border border-transparent focus:border-blue-300 focus:bg-white",
    sendBtn: "bg-blue-600 hover:bg-blue-700 text-white",
    themeBtn: "bg-gray-100 hover:bg-gray-200 text-gray-600"
  },
  calm: {
    bg: "bg-[#fdfbf7] text-[#5c544d]",
    sidebar: "bg-[#f5f1e8] border-[#e6dfd3]",
    header: "border-[#e6dfd3] text-[#7a6b5c]",
    btnNew: "bg-[#d8c3a5] hover:bg-[#c0af93] text-white",
    convItemActive: "bg-[#eae3d5] text-[#7a6b5c] font-medium border border-[#d8c3a5]",
    convItemInactive: "text-[#a69c8f] hover:bg-[#eae3d5] hover:text-[#5c544d]",
    btnLogout: "bg-transparent hover:bg-red-50 text-[#d98074] border border-[#d98074]/30",
    emptyTitle: "text-[#c4bbb0]",
    userBubble: "bg-[#d8c3a5] text-[#4a4238] shadow-sm",
    aiBubble: "bg-white border border-[#e6dfd3] text-[#5c544d] shadow-sm",
    inputArea: "bg-[#fdfbf7] border-[#e6dfd3]",
    inputBox: "bg-white text-[#5c544d] border border-[#e6dfd3] placeholder-[#c4bbb0]",
    sendBtn: "bg-[#d8c3a5] hover:bg-[#c0af93] text-white",
    themeBtn: "bg-[#eae3d5] hover:bg-[#e0d6c8] text-[#7a6b5c]"
  }
};

export default function ChatPage() {
  const router = useRouter();

  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [themeMode, setThemeMode] = useState("calm");

  const messagesEndRef = useRef(null);
  const token = Cookies.get("access_token");

  const t = THEMES[themeMode];

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      fetchConversations();
    }
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return router.push("/login");

      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/chat/conversations/${id}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) return router.push("/login");

      const data = await res.json();
      setChat(data);
    } catch (err) {
      console.error(err);
    }
  };

  const startNewChat = () => {
    setActiveConvId(null);
    setChat([]);
  };

  const loadConversation = (id) => {
    setActiveConvId(id);
    setChat([]);
    fetchMessages(id);
  };

  const deleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/chat/conversations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return router.push("/login");
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConvId === id) {
          setActiveConvId(null);
          setChat([]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    const trimmed = msg.trim();
    if (!trimmed) return;

    let convId = activeConvId;

    // Create conversation
    if (!convId) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/chat/conversations?title=${encodeURIComponent(
            trimmed
          )}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 401) return router.push("/login");

        const newConv = await res.json();
        convId = newConv.id;

        setActiveConvId(convId);
        setConversations((prev) => [newConv, ...prev]);
      } catch (err) {
        console.error(err);
        return;
      }
    }

    setChat((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);

    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/chat/stream/?query=${encodeURIComponent(
          trimmed
        )}&conversation_id=${convId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        setChat((prev) => {
          const newChat = [...prev];
          const lastIndex = newChat.length - 1;
          const lastMsg = { ...newChat[lastIndex] };
          lastMsg.content += chunk;
          newChat[lastIndex] = lastMsg;
          return newChat;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleTheme = () => {
    if (themeMode === "dark") setThemeMode("light");
    else if (themeMode === "light") setThemeMode("calm");
    else setThemeMode("dark");
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${t.bg}`}>

      {/* Sidebar */}
      <div className={`w-72 hidden md:flex flex-col border-r transition-colors duration-300 ${t.sidebar}`}>

        <div className={`p-5 font-bold text-lg border-b ${t.header}`}>
          ⚡ AI Assistant
        </div>

        <button
          onClick={startNewChat}
          className={`m-4 p-3 rounded-xl transition font-medium ${t.btnNew}`}
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => loadConversation(conv.id)}
              className={`px-4 py-3 rounded-xl cursor-pointer text-sm transition flex justify-between items-center group ${activeConvId === conv.id ? t.convItemActive : t.convItemInactive
                }`}
            >
              <div className="flex items-center overflow-hidden flex-1 truncate pr-2">
                <span className={`inline-block mr-2 ${activeConvId === conv.id ? "scale-110" : ""}`}>•</span>
                <span className="truncate">{conv.title}</span>
              </div>
              <button
                onClick={(e) => deleteConversation(e, conv.id)}
                className={`opacity-50 hover:opacity-100 p-1.5 rounded-lg transition-all flex-shrink-0 ${t.delBtn || 'text-red-400 hover:text-red-500'}`}
                title="Delete Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className={`p-4 border-t flex flex-col gap-2 ${t.header}`}>
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-xl font-medium transition flex items-center gap-2 ${t.themeBtn}`}
          >
            <span>🎨</span> Theme: <span className="capitalize">{themeMode}</span>
          </button>
          <button
            onClick={() => router.push("/analytics")}
            className={`p-3 rounded-xl font-medium border border-transparent transition text-center ${t.convItemInactive}`}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => {
              Cookies.remove("access_token");
              Cookies.remove("refresh_token");
              router.push("/login");
            }}
            className={`p-3 rounded-xl font-medium transition ${t.btnLogout}`}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {chat.length === 0 && (
            <div className={`h-full flex flex-col items-center justify-center ${t.emptyTitle}`}>
              <div className="text-5xl mb-4">⚡</div>
              <h2 className="text-2xl font-semibold tracking-wide">Ready to assist you</h2>
            </div>
          )}

          {chat.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === "user"
                  ? "justify-end"
                  : "justify-start"
                }`}
            >
              <div
                className={`px-5 py-3 rounded-2xl max-w-[85%] sm:max-w-[70%] leading-relaxed ${message.role === "user"
                    ? `${t.userBubble} rounded-tr-sm`
                    : `${t.aiBubble} rounded-tl-sm`
                  }`}
              >
                <div className="whitespace-pre-wrap">
                  {message.content || (loading && i === chat.length - 1 && "...")}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input */}
        <div className={`p-4 md:p-6 border-t transition-colors duration-300 ${t.inputArea}`}>
          <div className="max-w-4xl mx-auto flex gap-3 relative">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className={`flex-1 p-4 rounded-2xl outline-none resize-none min-h-[56px] delay-0 transition-all ${t.inputBox}`}
              rows={1}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !msg.trim()}
              className={`px-6 rounded-2xl font-medium shadow-sm transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center ${t.sendBtn}`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import './Dashboard.css';

interface Feedback {
  id: number;
  title: string;
  status: string;
  admin_name?: string;
  user_name?: string;
  created_at: string;
}

interface Message {
  id: number;
  author_type: 'ADMINISTRADOR' | 'MODERADOR' | 'COMUM';
  author_name: string;
  content: string;
  created_at: string;
}

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const token = localStorage.getItem('acess_token');
  
  // Extrair dados do token
  let role: string | null = null;
  let userName: string = "Usuário";
  if (token && token.includes('.')) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      role = payload.role;
      userName = payload.name || "Usuário";
    } catch (e) { console.error("Erro JWT:", e); }
  }

  const authHeaders = { 
    'Authorization': `Bearer ${token}`, 
    'Content-Type': 'application/json' 
  };

  const selectedFeedback = feedbacks.find(f => f.id === selectedId);
  const isClosed = selectedFeedback?.status === 'CLOSED';

  useEffect(() => {
    if (!token || !role) return;
    const url = role === 'COMUM' 
      ? 'http://localhost:3000/feedbacks' 
      : 'http://localhost:3000/feedbacks/admin';

    fetch(url, { headers: authHeaders })
      .then(res => res.json())
      .then(data => Array.isArray(data) && setFeedbacks(data))
      .catch(console.error);
  }, [token, role]);

  const openFeedback = (id: number) => {
    setSelectedId(id);
    setIsExpanded(true);
    const url = role === 'COMUM' 
      ? `http://localhost:3000/feedbacks/${id}/messages` 
      : `http://localhost:3000/feedbacks/admin/messages/${id}`;

    fetch(url, { headers: authHeaders })
      .then(res => res.json())
      .then(setMessages);
  };

  const closeChat = () => {
    setIsExpanded(false);
    setSelectedId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('acess_token');
    window.location.reload(); 
  };

  const sendMessage = () => {
    if (!reply.trim() || !selectedId || isClosed) return;
    fetch(`http://localhost:3000/feedbacks/${selectedId}/message`, {
      method: 'POST', 
      headers: authHeaders, 
      body: JSON.stringify({ content: reply })
    }).then(res => { 
      if (res.ok) { 
        setReply(''); 
        openFeedback(selectedId); 
      } 
    });
  };

  return (
    <main className={`cartesian-plane ${isExpanded ? 'focus-mode' : ''}`}>
      {/* 2º Quadrante */}
      <div className="quadrant q2">
        <div className="placeholder-content"><h3>📊 Estatísticas</h3></div>
      </div>

      {/* 1º Quadrante */}
      <div className="quadrant q1">
        <section className="forum-wrapper">
          {!isExpanded && (
            <aside className="sidebar">
              <header className="sidebar-header">
                <div>
                  <h3>Tópicos</h3>
                  <span className="role-badge">{role}</span>
                </div>
                <button className="logout-icon-btn" onClick={handleLogout} title="Sair">🚪</button>
              </header>
              <div className="topic-list">
                {feedbacks.map(fb => (
                  <div 
                    key={fb.id} 
                    className={`topic-card ${selectedId === fb.id ? 'active' : ''}`} 
                    onClick={() => openFeedback(fb.id)}
                  >
                    <div className="topic-info">
                      <strong>{fb.title}</strong>
                      <small className={fb.status.toLowerCase()}>{fb.status}</small>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          )}

          <div className="chat-window">
            {selectedId ? (
              <>
                <header className="chat-header-focus">
                  <button className="back-btn" onClick={closeChat}>← Voltar</button>
                  <div className="chat-title-info">
                    <strong>{selectedFeedback?.title}</strong>
                    <span className={`status-tag ${selectedFeedback?.status.toLowerCase()}`}>
                      {selectedFeedback?.status}
                    </span>
                  </div>
                </header>

                <div className="chat-messages">
                  {messages.map(msg => (
                    <div key={msg.id} className={`message-row ${msg.author_type.toLowerCase()}`}>
                      <div className="msg-avatar">{msg.author_name.charAt(0)}</div>
                      <div className="msg-bubble">
                        <header>
                          <span className="name">{msg.author_name}</span>
                          <span className="tag">{msg.author_type}</span>
                        </header>
                        <p>{msg.content}</p>
                        <footer>{new Date(msg.created_at).toLocaleTimeString()}</footer>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`chat-input-container ${isClosed ? 'disabled-area' : ''}`}>
                  {isClosed ? (
                    <div className="closed-notice">🔒 Tópico encerrado. Não são permitidas novas mensagens.</div>
                  ) : (
                    <>
                      <input 
                        value={reply} 
                        onChange={e => setReply(e.target.value)} 
                        placeholder="Digite sua mensagem..." 
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <button onClick={sendMessage} className="send-btn">➤</button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-state">Selecione uma conversa para começar</div>
            )}
          </div>
        </section>
      </div>

      {/* 3º Quadrante */}
      <div className="quadrant q3">
        <div className="placeholder-content"><h3>⚙️ Configurações</h3></div>
      </div>

      {/* 4º Quadrante */}
      <div className="quadrant q4">
        <div className="profile-card">
          <div className="profile-avatar">{userName.charAt(0)}</div>
          <h3>{userName}</h3>
          <p>{role}</p>
          <button className="logout-full-btn" onClick={handleLogout}>Sair do Sistema</button>
        </div>
      </div>
    </main>
  );
}
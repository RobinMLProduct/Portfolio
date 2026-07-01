// chat-widget.js
// "Ask about Robin" floating chat widget.
// Include this script (after nav.js) on every page: <script src="chat-widget.js"></script>
// Uses the site's existing CSS custom properties (--bg, --fg, --hl, --border, etc.)

(function () {
  const MAX_MESSAGES_PER_SESSION = 10;
  const SESSION_KEY = "robin-chat-count";
  const HISTORY_KEY = "robin-chat-history";
  const ENDPOINT = "/.netlify/functions/chat";

  function getCount() {
    return parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
  }
  function incrementCount() {
    sessionStorage.setItem(SESSION_KEY, String(getCount() + 1));
  }
  function getHistory() {
    try {
      return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      return [];
    }
  }
  function saveHistory(history) {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-8)));
  }

  // --- Build DOM ---
  const style = document.createElement("style");
  style.textContent = `
    #robin-chat-bubble {
      position: fixed; bottom: 24px; right: 24px; z-index: 999;
      width: 56px; height: 56px; border-radius: 50%;
      background: var(--fg); color: var(--bg);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      font-size: 24px; transition: transform 0.15s ease;
    }
    #robin-chat-bubble:hover { transform: scale(1.06); }
    #robin-chat-panel {
      position: fixed; bottom: 92px; right: 24px; z-index: 999;
      width: 340px; max-width: calc(100vw - 32px);
      height: 440px; max-height: 70vh;
      background: var(--card-bg, var(--bg));
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'Inter', sans-serif;
    }
    #robin-chat-panel.open { display: flex; }
    #robin-chat-header {
      padding: 14px 16px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      background: var(--bg-alt, var(--bg));
    }
    #robin-chat-header strong { color: var(--fg); font-size: 14px; }
    #robin-chat-close { background: none; border: none; cursor: pointer; color: var(--fg-muted); font-size: 18px; }
    #robin-chat-messages {
      flex: 1; overflow-y: auto; padding: 12px 16px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .robin-chat-msg { max-width: 85%; padding: 8px 12px; border-radius: 10px; font-size: 13px; line-height: 1.45; }
    .robin-chat-msg.user { align-self: flex-end; background: var(--hl); color: var(--hl-dark, #0a0a0a); }
    .robin-chat-msg.bot { align-self: flex-start; background: var(--bg-alt, #f5f5f5); color: var(--fg); border: 1px solid var(--border); }
    .robin-chat-msg.bot.loading { opacity: 0.6; font-style: italic; }
    #robin-chat-form { display: flex; gap: 8px; padding: 12px; border-top: 1px solid var(--border); }
    #robin-chat-input {
      flex: 1; padding: 8px 10px; border: 1px solid var(--border); border-radius: 8px;
      background: var(--bg); color: var(--fg); font-family: inherit; font-size: 13px;
    }
    #robin-chat-send {
      padding: 8px 14px; border: none; border-radius: 8px;
      background: var(--fg); color: var(--bg); cursor: pointer; font-size: 13px;
    }
    #robin-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
    #robin-chat-limit-note { padding: 8px 16px; font-size: 11px; color: var(--fg-muted); text-align: center; }
  `;
  document.head.appendChild(style);

  const bubble = document.createElement("button");
  bubble.id = "robin-chat-bubble";
  bubble.setAttribute("aria-label", "Ask about Robin");
  bubble.textContent = "\u{1F4AC}"; // speech bubble emoji

  const panel = document.createElement("div");
  panel.id = "robin-chat-panel";
  panel.innerHTML = `
    <div id="robin-chat-header">
      <strong>Ask about Robin</strong>
      <button id="robin-chat-close" aria-label="Close chat">&times;</button>
    </div>
    <div id="robin-chat-messages"></div>
    <form id="robin-chat-form">
      <input id="robin-chat-input" type="text" placeholder="Ask a question about Robin's career..." autocomplete="off" maxlength="500" />
      <button id="robin-chat-send" type="submit">Send</button>
    </form>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector("#robin-chat-messages");
  const formEl = panel.querySelector("#robin-chat-form");
  const inputEl = panel.querySelector("#robin-chat-input");
  const sendBtn = panel.querySelector("#robin-chat-send");
  const closeBtn = panel.querySelector("#robin-chat-close");

  function addMessage(text, role) {
    const el = document.createElement("div");
    el.className = `robin-chat-msg ${role}`;
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function renderSavedHistory() {
    const history = getHistory();
    if (history.length === 0) {
      addMessage("Hi! I can answer questions about Robin's experience, skills, and background. What would you like to know?", "bot");
      return;
    }
    history.forEach((turn) => addMessage(turn.text, turn.role === "user" ? "user" : "bot"));
  }

  function checkLimit() {
    if (getCount() >= MAX_MESSAGES_PER_SESSION) {
      inputEl.disabled = true;
      sendBtn.disabled = true;
      const note = document.createElement("div");
      note.id = "robin-chat-limit-note";
      note.textContent = "You've reached the message limit for this session. Please refresh later or use the contact page.";
      panel.appendChild(note);
      return true;
    }
    return false;
  }

  bubble.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (panel.classList.contains("open") && messagesEl.children.length === 0) {
      renderSavedHistory();
      checkLimit();
    }
  });
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (checkLimit()) return;

    const message = inputEl.value.trim();
    if (!message) return;

    inputEl.value = "";
    inputEl.disabled = true;
    sendBtn.disabled = true;

    addMessage(message, "user");
    const history = getHistory();
    history.push({ role: "user", text: message });

    const loadingEl = addMessage("Thinking...", "bot loading");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      loadingEl.remove();

      if (!res.ok) {
        addMessage(data.error || "Something went wrong. Please try again.", "bot");
      } else {
        addMessage(data.reply, "bot");
        history.push({ role: "model", text: data.reply });
        saveHistory(history);
        incrementCount();
      }
    } catch (err) {
      loadingEl.remove();
      addMessage("Network error. Please check your connection and try again.", "bot");
    }

    inputEl.disabled = false;
    sendBtn.disabled = false;
    checkLimit();
    inputEl.focus();
  });
})();

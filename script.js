function goBackToPreviousPage() {
  if (history.length > 1) {
    history.back();
    return;
  }
  window.location.href = 'index.html';
}

function initSidebar() {
  const btn     = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const close   = document.getElementById('sidebarClose');
  const logout  = document.getElementById('logoutBtn');
  if (!btn || !sidebar) return;

  const menu = sidebar.querySelector('.sidebar-menu');
  if (menu) {
    const menuGroups = [
      {
        label: 'Trang chính',
        items: [['index.html', '🏠', 'Trang chủ']]
      },
      {
        label: 'Chủ đề môi trường',
        items: [
          ['dat.html', '🌱', 'Môi trường đất'],
          ['nuoc.html', '💧', 'Môi trường nước'],
          ['khongkhi.html', '💨', 'Môi trường không khí'],
          ['sinhvat.html', '🦋', 'Môi trường sinh vật']
        ]
      },
      {
        label: 'Khám phá',
        items: [
          ['trochoi.html', '🧩', 'Trò chơi'],
          ['thuvien.html', '📷', 'Thư viện ảnh'],
          ['baihat.html', '🎵', 'Bài hát']
        ]
      },
      {
        label: 'Tiện ích',
        items: [
          ['troly.html', '<img class="mini-mam-icon" src="image/mam2-transparent.png" alt="Mầm" />', 'Trợ lý AI'],
          ['phanhoi.html', '📝', 'Phiếu phản hồi']
        ]
      }
    ];
    const links = new Map([...menu.querySelectorAll('a[href]')].map(link => [link.getAttribute('href'), link]));
    menu.replaceChildren();
    menuGroups.forEach(group => {
      const heading = document.createElement('div');
      heading.className = 'sidebar-group-label';
      heading.textContent = group.label;
      menu.appendChild(heading);
      group.items.forEach(([href, icon, label]) => {
        let link = links.get(href);
        if (!link) {
          link = document.createElement('a');
          link.href = href;
          link.className = 'sidebar-item';
          link.innerHTML = `<div class="si-icon">${icon}</div><span class="si-text">${label}</span>`;
        }
        menu.appendChild(link);
      });
    });
    if (logout) menu.appendChild(logout);
  }

  function open()  { sidebar.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow='hidden'; }
  function shut()  { sidebar.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow=''; }

  btn.addEventListener('click', open);
  close && close.addEventListener('click', shut);
  overlay && overlay.addEventListener('click', shut);
  logout && logout.addEventListener('click', () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('appEntered');
    localStorage.removeItem('feedbackEmail');
    shut();
    window.location.href = 'login.html';
  });
}

function initBottomNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return;

  const items = [
    { href: 'index.html', icon: '🏠', label: 'Trang chủ', type: 'link' },
    { href: 'dat.html', icon: '📖', label: 'Học', type: 'link' },
    { href: 'troly.html', icon: '📷', label: 'Trợ lý AI', type: 'center' },
    { href: 'trochoi.html', icon: '🧩', label: 'Trò chơi', type: 'link' },
    { href: 'thuvien.html', icon: '📷', label: 'Thư viện', type: 'link' }
  ];

  nav.innerHTML = '';

  items.forEach(item => {
    if (item.type === 'center') {
      const center = document.createElement('div');
      center.className = 'nav-item-center';
      center.onclick = () => window.location.href = item.href;
      center.innerHTML = `
        <div class="nav-center-circle"><img class="logo-image" src="image/mam2-transparent.png" alt="Logo Mầm"/></div>
        <span>${item.label}</span>
      `;
      nav.appendChild(center);
      return;
    }

    const link = document.createElement('a');
    link.href = item.href;
    link.className = 'nav-item';
    link.dataset.page = item.href;
    link.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${item.label}</span>`;
    if (item.href === path) link.classList.add('active');
    nav.appendChild(link);
  });
}

function initReveal() {
  const els = document.querySelectorAll('.game-card, .topic-chip, .feature-card, .gallery-grid img');
  els.forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${(i % 6) * 55}ms`;
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

function initLightbox() {
  const lb    = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src; lb.classList.add('open'); document.body.style.overflow = 'hidden';
    });
  });
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

function initTopicIntro() {
  const modal = document.getElementById('topicIntro');
  if (!modal) return;
  const icon = document.getElementById('topicIntroIcon');
  const title = document.getElementById('topicIntroTitle');
  const description = document.getElementById('topicIntroDescription');
  const link = document.getElementById('topicIntroLink');
  const closeButton = document.getElementById('topicIntroClose');
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };

  document.querySelectorAll('.topic-chip[data-topic-title]').forEach(topic => {
    topic.addEventListener('click', event => {
      event.preventDefault();
      icon.textContent = topic.dataset.topicIcon;
      title.textContent = topic.dataset.topicTitle;
      description.textContent = topic.dataset.topicDescription;
      link.href = topic.dataset.topicLink;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
  closeButton.addEventListener('click', close);
  modal.addEventListener('click', event => { if (event.target === modal) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
}

function initGreeting() {
  const el = document.getElementById('greetingName');
  if (!el) return;
  const name = localStorage.getItem('userName');
  el.textContent = name ? `Xin chào ${name} 👋` : 'Xin chào 👋';
}

function initAssistant() {
  const form = document.getElementById('assistantForm');
  const input = document.getElementById('assistantInput');
  const messages = document.getElementById('assistantMessages');
  const suggestions = document.getElementById('assistantSuggestions');
  const status = document.getElementById('assistantStatus');
  if (!form || !input || !messages) return;

  const history = [];
  const addMessage = (text, sender) => {
    const row = document.createElement('div');
    row.className = `assistant-message assistant-message-${sender}`;
    const avatar = document.createElement('div');
    avatar.className = 'assistant-avatar';
    if (sender === 'bot') {
      const img = document.createElement('img');
      img.src = 'image/mam2-transparent.png';
      img.alt = 'Mầm';
      img.className = 'assistant-avatar-image';
      avatar.appendChild(img);
    } else {
      avatar.textContent = '🙂';
    }
    const bubble = document.createElement('div');
    bubble.className = 'assistant-bubble';
    bubble.textContent = text;
    row.append(avatar, bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  };

  const askGemini = async question => {
    const contents = history.slice(-8).map(item => ({
      role: item.role,
      parts: [{ text: item.text }]
    }));
    const response = await fetch('https://mam-api.vercel.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Không thể kết nối với Gemini.');
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Mình chưa có câu trả lời phù hợp.';
  };

  const submitQuestion = async question => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    input.value = '';
    input.disabled = true;
    form.classList.add('is-loading');
    addMessage(cleanQuestion, 'user');
    history.push({ role: 'user', text: cleanQuestion });
    if (suggestions) suggestions.hidden = true;
    try {
      const answer = await askGemini(cleanQuestion);
      addMessage(answer, 'bot');
      history.push({ role: 'model', text: answer });
      if (status) status.textContent = 'Mầm AI đang trực tuyến';
    } catch (error) {
      addMessage(error.message, 'bot');
      if (status) status.textContent = 'Chưa kết nối được Mầm AI';
    } finally {
      input.disabled = false;
      form.classList.remove('is-loading');
      input.focus();
    }
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    submitQuestion(input.value);
  });
  suggestions?.addEventListener('click', event => {
    const button = event.target.closest('[data-question]');
    if (button) submitQuestion(button.dataset.question);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
}

function initSpiritBeast() {
  if (document.querySelector('.spirit-beast')) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  const pageMessages = {
    'index.html': [
      'Xin chào! Mình là Mầm, cùng mình khám phá thiên nhiên nhé!',
      'Hôm nay mình cùng khám phá điều gì nhỉ?',
      'Mỗi chiếc lá, giọt nước và chú bướm đều có một câu chuyện đó!'
    ],
    'dat.html': [
      'Xin chào! Hôm nay mình cùng khám phá thế giới dưới chân mình nhé!',
      'Đất nuôi cây lớn lên và là ngôi nhà của nhiều sinh vật nhỏ bé đấy!',
      'Nhớ giữ cho đất sạch để cây cối luôn xanh tốt nhé!'
    ],
    'nuoc.html': [
      'Xin chào! Cùng mình theo dòng nước bắt đầu hành trình khám phá nhé!',
      'Mỗi giọt nước đều rất quý giá, chúng mình cùng tiết kiệm nước nào!',
      'Nước sạch giúp con người, cây cối và muôn loài khỏe mạnh đấy!'
    ],
    'khongkhi.html': [
      'Xin chào! Bạn có cảm nhận được bầu không khí quanh mình không?',
      'Cây xanh giúp không khí trong lành hơn, mình cùng chăm sóc cây nhé!',
      'Hãy cùng tìm hiểu cách giữ bầu không khí luôn sạch và mát lành nào!'
    ],
    'sinhvat.html': [
      'Xin chào! Cùng mình gặp gỡ những người bạn sinh vật đáng yêu nhé!',
      'Mỗi loài vật đều có một ngôi nhà riêng trong thiên nhiên đấy!',
      'Chúng mình hãy yêu thương và bảo vệ các loài vật quanh mình nhé!'
    ],
    'thuvien.html': [
      'Xin chào! Cùng mình ngắm những hình ảnh thật đẹp về thiên nhiên nhé!',
      'Bạn thích bức ảnh nào nhất? Hãy quan sát thật kỹ nhé!',
      'Mỗi bức ảnh đều lưu giữ một khoảnh khắc đáng yêu đấy!'
    ],
    'trochoi.html': [
      'Xin chào! Bạn đã sẵn sàng vừa học vừa chơi chưa?',
      'Cùng thử sức và khám phá những điều thú vị qua trò chơi nhé!',
      'Chơi thật vui, nhớ đọc kỹ và chọn câu trả lời thật thông minh nào!'
    ],
    'phanhoi.html': [
      'Xin chào! Ý kiến của bạn sẽ giúp website ngày càng tốt hơn đấy!',
      'Hãy chia sẻ cảm nhận của bạn với chúng mình nhé!',
      'Mỗi lời góp ý nhỏ đều rất đáng quý, cảm ơn bạn nhiều!'
    ]
  };
  const messages = pageMessages[page] || pageMessages['index.html'];
  const beast = document.createElement('img');
  beast.className = 'spirit-beast';
  beast.src = 'image/mam3.png';
  beast.alt = 'Linh thú đồng hành';
  beast.title = 'Chạm để linh thú vui nhảy, kéo để di chuyển';
  document.body.appendChild(beast);
  const message = document.createElement('div');
  message.className = 'spirit-message';
  message.setAttribute('role', 'status');
  message.setAttribute('aria-live', 'polite');
  document.body.appendChild(message);
  let messageIndex = 0;
  const showMessage = () => {
    message.textContent = messages[messageIndex % messages.length];
    messageIndex += 1;
    message.classList.remove('show');
    void message.offsetWidth;
    message.classList.add('show');
    window.setTimeout(() => message.classList.remove('show'), 4000);
  };
  showMessage();
  window.setInterval(showMessage, 15000);
  beast.addEventListener('click', () => {
    beast.classList.remove('happy');
    void beast.offsetWidth;
    beast.classList.add('happy');
  });
  let dragging = false, offsetX = 0, offsetY = 0;
  beast.addEventListener('pointerdown', e => {
    dragging = true;
    const rect = beast.getBoundingClientRect();
    offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
    beast.setPointerCapture(e.pointerId);
  });
  beast.addEventListener('pointermove', e => {
    if (!dragging) return;
    beast.style.left = `${Math.max(8, Math.min(window.innerWidth - beast.offsetWidth - 8, e.clientX - offsetX))}px`;
    beast.style.top = `${Math.max(8, Math.min(window.innerHeight - beast.offsetHeight - 8, e.clientY - offsetY))}px`;
    beast.style.right = 'auto'; beast.style.bottom = 'auto';
  });
  beast.addEventListener('pointerup', () => { dragging = false; });
}

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initBottomNav();
  initReveal();
  initLightbox();
  initTopicIntro();
  initGreeting();
  initAssistant();
  initSpiritBeast();
});

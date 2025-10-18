/* Happy Birthday page interactions */
(function() {
  const qs = (sel, el = document) => el.querySelector(sel);
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  const gate = qs('#gate');
  const gateForm = qs('#gate-form');
  const gfNameInput = qs('#gfName');
  const fromNameInput = qs('#fromName');
  const nameTarget = qs('#nameTarget');

  const revealBtn = qs('#revealBtn');
  const musicBtn = qs('#musicBtn');
  const shareBtn = qs('#shareBtn');

  const wishesSection = qs('#wishes');
  const typewriterEl = qs('#typewriter');

  const heartsContainer = qs('#hearts-container');
  const toastEl = qs('#toast');
  const audio = qs('#bgMusic');

  let heartsIntervalId = null;
  let musicOn = false;
  let typedIndex = 0;
  let messages = [];
  let typing = false;

  function showToast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    window.setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  function personalize(gfName, fromName) {
    nameTarget.textContent = gfName || 'Beautiful';
    messages = [
      `To my dearest ${gfName},`,
      'Today the world sparkles a little brighter,',
      'because it gets to celebrate someone as wonderful as you.',
      'You are my sunshine, my safe place, and my favorite person.',
      'I wish you laughter that echoes, dreams that bloom,',
      'and a year filled with everything your heart desires.',
      `Happy Birthday, my love. — ${fromName} 💖`
    ];
  }

  function typeLine() {
    if (typing) return;
    typing = true;

    if (typedIndex >= messages.length) {
      typing = false;
      return;
    }

    const text = messages[typedIndex];
    typeText(typewriterEl, text, 0, () => {
      typewriterEl.appendChild(document.createElement('br'));
      typedIndex += 1;
      typing = false;
      // Auto-continue next line with a short delay
      window.setTimeout(typeLine, 400);
    });
  }

  function typeText(el, text, idx, done) {
    if (idx === 0) {
      // Add slight pause between lines
      window.setTimeout(() => typeText(el, text, 1, done), 100);
      return;
    }
    if (idx > text.length) {
      done && done();
      return;
    }
    el.textContent += text.charAt(idx - 1);
    const delay = 22 + Math.random() * 30; // type speed
    window.setTimeout(() => typeText(el, text, idx + 1, done), delay);
  }

  function fireConfetti(burst = 0.25) {
    try {
      // canvas-confetti global
      const count = Math.floor(200 * burst);
      const defaults = { origin: { y: 0.7 } };
      confetti({ ...defaults, particleCount: count, spread: 70, angle: 60 });
      confetti({ ...defaults, particleCount: count, spread: 70, angle: 120 });
    } catch (e) {
      // no-op if library unavailable
    }
  }

  function spawnHearts() {
    // Create a floating heart element with random size/position
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = '♥';
    const size = 12 + Math.random() * 26; // px
    const left = Math.random() * 100; // vw
    const duration = 6 + Math.random() * 6; // s
    const delay = Math.random() * 2; // s
    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heartsContainer.appendChild(heart);
    // Clean up after animation
    window.setTimeout(() => heart.remove(), (duration + delay) * 1000 + 200);
  }

  function startHearts() {
    if (heartsIntervalId) return;
    // burst a few hearts at start
    for (let i = 0; i < 12; i += 1) spawnHearts();
    heartsIntervalId = window.setInterval(spawnHearts, 600);
  }

  function stopHearts() {
    if (heartsIntervalId) window.clearInterval(heartsIntervalId);
    heartsIntervalId = null;
  }

  function tryPlayMusic() {
    audio.volume = 0.6;
    audio.play().then(() => {
      musicOn = true;
      musicBtn.textContent = 'Music: On 🎵';
    }).catch(() => {
      musicOn = false;
      musicBtn.textContent = 'Music: Off 🔇';
    });
  }

  function toggleMusic() {
    if (!musicOn) {
      tryPlayMusic();
    } else {
      audio.pause();
      musicOn = false;
      musicBtn.textContent = 'Music: Off 🔇';
    }
  }

  function enableTapConfetti() {
    document.addEventListener('click', (ev) => {
      // Reduce accidental triggers on control buttons by checking target roles
      const t = ev.target;
      const isButton = t.closest && t.closest('button');
      if (!isButton) fireConfetti(0.12);
    });
  }

  async function shareLove() {
    const gfName = nameTarget.textContent || 'my love';
    const text = `Happy Birthday, ${gfName}! 💖\nI made you a little surprise.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Happy Birthday 💖', text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        showToast('Link copied to clipboard 💌');
      }
    } catch (e) {
      showToast('Could not share. You can copy the link.');
    }
  }

  function hydrateFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem('hb-personalization') || '{}');
      if (saved.gfName) gfNameInput.value = saved.gfName;
      if (saved.fromName) fromNameInput.value = saved.fromName;
      if (saved.gfName && saved.fromName) {
        personalize(saved.gfName, saved.fromName);
      }
    } catch (_) {}
  }

  function saveToStorage(gfName, fromName) {
    try {
      localStorage.setItem('hb-personalization', JSON.stringify({ gfName, fromName }));
    } catch (_) {}
  }

  // Event wiring
  document.addEventListener('DOMContentLoaded', () => {
    hydrateFromStorage();

    gateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const gfName = gfNameInput.value.trim() || 'Beautiful';
      const fromName = fromNameInput.value.trim() || 'Me';
      personalize(gfName, fromName);
      saveToStorage(gfName, fromName);

      // Close gate with a soft fade
      gate.style.transition = 'opacity 320ms ease, visibility 0s linear 320ms';
      gate.style.opacity = '0';
      gate.style.visibility = 'hidden';

      // Start magic
      startHearts();
      fireConfetti(0.8);
      typewriterEl.textContent = '';
      typedIndex = 0;
      typeLine();
      tryPlayMusic();
      enableTapConfetti();
    });

    revealBtn.addEventListener('click', () => {
      wishesSection.classList.remove('hidden');
      wishesSection.setAttribute('aria-hidden', 'false');
      fireConfetti(0.5);
      if (!typing) typeLine();
    });

    musicBtn.addEventListener('click', toggleMusic);
    shareBtn.addEventListener('click', shareLove);
  });
})();

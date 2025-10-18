/* Happy Birthday page interactions */
(function() {
  const qs = (sel, el = document) => el.querySelector(sel);
  const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  // Fixed names per request
  const GF_NAME = 'Archana';
  const FROM_NAME = 'Jishnu';

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
      const count = Math.floor(200 * burst);
      const defaults = { origin: { y: 0.7 } };
      confetti({ ...defaults, particleCount: count, spread: 70, angle: 60 });
      confetti({ ...defaults, particleCount: count, spread: 70, angle: 120 });
    } catch (e) {
      // confetti lib may be blocked; ignore
    }
  }

  function spawnHearts() {
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
    window.setTimeout(() => heart.remove(), (duration + delay) * 1000 + 200);
  }

  function startHearts() {
    if (heartsIntervalId) return;
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
      const t = ev.target;
      const isButton = t.closest && t.closest('button');
      if (!isButton) fireConfetti(0.12);
    });
  }

  async function shareLove() {
    const text = `Happy Birthday, ${GF_NAME}! 💖\nA little surprise for you.`;
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

  // Event wiring
  document.addEventListener('DOMContentLoaded', () => {
    personalize(GF_NAME, FROM_NAME);

    startHearts();
    fireConfetti(0.8);
    enableTapConfetti();

    typewriterEl.textContent = '';
    typedIndex = 0;

    revealBtn.addEventListener('click', () => {
      wishesSection.classList.remove('hidden');
      wishesSection.setAttribute('aria-hidden', 'false');
      fireConfetti(0.5);
      if (!typing) typeLine();
    });

    musicBtn.addEventListener('click', toggleMusic);
    shareBtn.addEventListener('click', shareLove);

    // Attempt gentle autoplay (may be blocked by browser)
    window.setTimeout(tryPlayMusic, 300);
  });
})();

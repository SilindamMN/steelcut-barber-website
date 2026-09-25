// Steelcut AI — simple frontend-only assistant for GitHub Pages.
// No API key, backend, or server is required.
(function () {
  function initSteelcutAI() {
    const button = document.getElementById('steelcutAiButton');
    const panel = document.getElementById('steelcutAiPanel');
    const close = document.getElementById('steelcutAiClose');
    const messages = document.getElementById('steelcutAiMessages');
    const form = document.getElementById('steelcutAiForm');
    const input = document.getElementById('steelcutAiInput');
    if (!button || !panel || !close || !messages || !form || !input) return;

    const addMessage = (text, type) => {
      const el = document.createElement('div');
      el.className = 'steelcut-ai-message ' + type;
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    };

    const reply = (text) => {
      const q = text.toLowerCase();

      if (/\b(hours?|open|opening|close|closing)\b/.test(q)) {
        return 'Our hours are Monday–Friday 09:00–19:00, Saturday 08:00–17:00, and Sunday closed.';
      }
      if (q.includes('beard oil')) {
        return 'Our Beard Oil is R140. It helps condition the beard and reduce dry-feeling facial hair. You can find it in our Products section.';
      }
      if (q.includes('pomade')) {
        return 'Steelcut Pomade is R150, with medium hold and high shine. It is great for side parts and slick-back styles.';
      }
      if (q.includes('texture spray')) {
        return 'Texture Spray is R165. It gives lightweight texture and natural movement for crops, fringes and textured styles.';
      }
      if (q.includes('matte clay')) {
        return 'Matte Clay is R170. It gives strong hold with a low-shine finish and works well for textured short hair.';
      }
      if (/\b(price|prices|cost|costs|how much)\b/.test(q)) {
        return 'Our services start at R120 for a Beard Trim. Classic Haircut is R180, Skin Fade R220, Cut & Beard Combo R280, Kids Cut R130, and Hot Towel Shave R200.';
      }
      if (q.includes('classic haircut')) return 'Classic Haircut is R180 and takes about 30 minutes.';
      if (q.includes('skin fade') || q.includes('fade')) return 'Skin Fade is R220 and takes about 45 minutes. It is ideal for a clean, sharp fade.';
      if (q.includes('beard trim')) return 'Beard Trim is R120 and takes about 20 minutes.';
      if (q.includes('combo') || q.includes('haircut and beard')) return 'Cut & Beard Combo is R280 and takes about 60 minutes.';
      if (q.includes('kids')) return 'Kids Cut (under 12) is R130 and takes about 25 minutes.';
      if (q.includes('shave') || q.includes('hot towel')) return 'Hot Towel Shave is R200 and takes about 35 minutes.';
      if (q.includes('barber') || q.includes('team')) {
        return 'We have 7 professional barbers. You can choose your preferred barber during booking, subject to availability.';
      }
      if (/\b(book|booking|appointment|reserve)\b/.test(q)) {
        return 'Absolutely. Click “Book Now” in the navigation or “Book an appointment” on the home page. You can choose your service, barber, date and available time.';
      }
      if (/\b(recommend|suggest|which service|what service)\b/.test(q)) {
        return 'For a clean professional look, I recommend starting with a Classic Haircut. If you also wear a beard, the Cut & Beard Combo gives you a complete look.';
      }
      if (/\b(location|where|address|contact|phone|email)\b/.test(q)) {
        return 'We are at 14 Fox Street, Marshalltown, Johannesburg, 2001. Use the Contact section on the website for the available contact details and map.';
      }
      return 'I can help with services, prices, barbers, products, opening hours and booking. Try asking “How much is a skin fade?” or “What are your opening hours?”';
    };

    function send(text) {
      const clean = text.trim();
      if (!clean) return;
      addMessage(clean, 'user');
      input.value = '';
      const typing = document.createElement('div');
      typing.className = 'steelcut-ai-message bot typing';
      typing.textContent = 'Thinking…';
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;

      window.setTimeout(() => {
        typing.remove();
        addMessage(reply(clean), 'bot');
      }, 250);
    }

    button.addEventListener('click', () => {
      panel.hidden = false;
      input.focus();
    });

    close.addEventListener('click', () => {
      panel.hidden = true;
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      send(input.value);
    });

    document.querySelectorAll('[data-ai-prompt]').forEach((item) => {
      item.addEventListener('click', () => send(item.dataset.aiPrompt || ''));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSteelcutAI);
  } else {
    initSteelcutAI();
  }
})();

// Steelcut AI — frontend-only assistant for GitHub Pages.
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

    const findService = (q) => {
      const aliases = [
        ['Cut & Beard Combo', ['cut & beard', 'cut and beard', 'haircut and beard', 'haircut + beard', 'combo']],
        ['Skin Fade', ['skin fade', 'fade']],
        ['Classic Haircut', ['classic haircut', 'classic cut', 'haircut']],
        ['Beard Trim', ['beard trim', 'beard tidy', 'beard shaping']],
        ['Kids Cut (under 12)', ['kids cut', 'kid cut', 'children cut', 'child cut']],
        ['Hot Towel Shave', ['hot towel shave', 'hot towel', 'shave']],
        ['Other Hairstyle', ['other hairstyle', 'other style', 'custom hairstyle']]
      ];
      for (const [name, words] of aliases) if (words.some(w => q.includes(w))) return SERVICES.find(s => s.name === name);
      return null;
    };

    const findBarber = (q) => {
      const normalized = q.replace(/[^a-z0-9 ]/g, ' ');
      return BARBERS.find(b => {
        const full = b.name.toLowerCase();
        const first = full.split(' ')[0];
        return normalized.includes(full) || normalized.split(/\s+/).includes(first);
      }) || null;
    };

    const parseDate = (q) => {
      const now = new Date();
      if (q.includes('today')) return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (q.includes('tomorrow')) return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const days = {sunday:0, monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6};
      for (const [name, target] of Object.entries(days)) {
        if (q.includes(name)) {
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          let delta = (target - d.getDay() + 7) % 7;
          if (delta === 0 && q.includes('next')) delta = 7;
          d.setDate(d.getDate() + delta);
          return d;
        }
      }
      const match = q.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/);
      if (match) {
        const year = match[3] ? (match[3].length === 2 ? 2000 + +match[3] : +match[3]) : now.getFullYear();
        return new Date(year, +match[2] - 1, +match[1]);
      }
      return null;
    };

    const isoDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const prettyDate = d => d.toLocaleDateString('en-ZA', {weekday:'long', day:'numeric', month:'long'});

    const availableTimes = (date, service, barberName) => {
      if (!date || !service) return [];
      const iso = isoDate(date);
      const day = date.getDay();
      if (!HOURS[day] || iso < todayISO()) return [];
      if (demoDayStatus(iso).full) return [];
      const [open, close] = HOURS[day];
      const start = timeToMinutes(open), last = timeToMinutes(close) - service.mins;
      const result = [];
      for (let t = start; t <= last; t += 15) {
        const time = minutesToTime(t);
        if (!isAtLeastOneHourFromNow(iso, time) || demoSlotBusy(iso, time)) continue;
        const available = barberName ? isSlotAvailable(iso, time, barberName, service.mins) : isAnyBarberAvailable(iso, time, service.mins);
        if (available) result.push(time);
      }
      return result;
    };

    const openBooking = (service, barber) => {
      const modalEl = document.getElementById('bookingModal');
      if (!modalEl || !window.bootstrap) return false;
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
      window.setTimeout(() => {
        if (service) {
          const select = document.getElementById('m-service');
          if (select) {
            select.value = String(service.id);
            select.dispatchEvent(new Event('change', {bubbles:true}));
          }
        }
        if (barber) {
          const option = document.querySelector(`.barber-option[data-barber="${CSS.escape(barber.name)}"]`);
          if (option) option.click();
        }
      }, 350);
      return true;
    };

    const reply = (text) => {
      const q = text.toLowerCase().trim();
      const service = findService(q);
      const barber = findBarber(q);

      if (/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(q)) {
        return 'Hi! I’m Steelcut AI. I can help you choose a service, check booking times, find a barber, get prices, products, hours, location or contact details. What do you need?';
      }

      if (/\b(book|booking|appointment|reserve|make an appointment)\b/.test(q)) {
        if (service) {
          openBooking(service, barber);
          return `Sure. I’ve opened the booking form with ${service.name}${barber ? ` and ${barber.name}` : ''} selected. Choose your date and time, then enter your details to confirm.`;
        }
        openBooking(null, null);
        return 'Absolutely. I’ve opened the booking form. Choose your service, barber, date and time, then enter your details to confirm.';
      }

      if (/\b(available|availability|slots?|times?|earliest|after\s*\d{1,2})\b/.test(q)) {
        const requestedService = service || SERVICES[0];
        const date = parseDate(q);
        if (!date) return `Tell me the day you want, for example “What times are available on Saturday?” I’ll check the ${requestedService.name} slots.`;
        const day = date.getDay();
        if (!HOURS[day]) return `${prettyDate(date)} is Sunday, and we are closed on Sundays.`;
        const times = availableTimes(date, requestedService, barber && barber.name);
        if (!times.length) return `I couldn't find an available ${requestedService.name} slot for ${prettyDate(date)}${barber ? ` with ${barber.name}` : ''}. Try another day or barber.`;
        const shown = times.slice(0, 8).join(', ');
        return `For ${requestedService.name} on ${prettyDate(date)}${barber ? ` with ${barber.name}` : ''}, available times include ${shown}${times.length > 8 ? ', and more.' : '.'} These are the website's current demo availability times.`;
      }

      if (/\b(walk.?ins?|appointment required|need an appointment)\b/.test(q)) {
        return 'The website is set up around appointments. Use Book Now to choose a service, barber, date and time. Walk-in availability is not specified in the current shop information.';
      }
      if (/\b(reschedule|change my appointment|move my appointment)\b/.test(q)) return 'The current website does not provide a self-service rescheduling flow. Please contact Steelcut on 081 400 2277 or hello@steelcutbarber.co.za to request a change.';
      if (/\b(cancel|cancellation)\b/.test(q)) return 'The policy asks customers to give at least 4 hours’ notice when cancelling or rescheduling. Repeated late cancellations or no-shows may lead to a deposit or other booking restriction.';

      if (/\b(who are your barbers|list (your )?barbers|barbers|team|staff)\b/.test(q) && !barber) {
        return 'Our barbers are: Thabo Mokoena (Owner · Master Barber — fades, tapers and beard sculpting); Siya Ndlovu (Senior Barber — classic cuts and hot towel shaves); Lwazi Khumalo (Barber — kids cuts and modern crops); Anele Dlamini (Senior Barber — textured crops and modern fades); Kabelo Maseko (Barber — clean cuts and beard detailing); Musa Nkosi (Barber — tapers, line-ups and styling); and Sibusiso Zulu (Barber — classic cuts and precision fades).';
      }
      if (/\b(best|speciali[sz]e|specialty|good for)\b/.test(q) && barber) return `${barber.name} is listed as a ${barber.role.toLowerCase()}, specializing in ${barber.style.toLowerCase()}`;
      if (/\b(owner)\b/.test(q)) return 'Thabo Mokoena is the owner and Master Barber. His listed specialties are fades, tapers and beard sculpting.';
      if (/\b(kids|children)\b/.test(q) && /barber|who|does/.test(q)) return 'Lwazi Khumalo is listed as the barber specializing in kids cuts and modern crops.';
      if (/\b(beard|beard sculpt|sculpting)\b/.test(q) && /who|barber|speciali/.test(q)) return 'Thabo Mokoena is listed for beard sculpting, while Kabelo Maseko is listed for beard detailing.';

      if (service && /\b(price|cost|how much|rate|include|difference|what is|do you do|offer)\b/.test(q)) {
        const price = service.price ? `R${service.price}` : 'price confirmed before the service';
        return `${service.name} is ${price} and takes about ${service.mins} minutes. ${service.desc} ${service.details}`;
      }
      if (/\b(price|prices|cost|costs|how much)\b/.test(q)) {
        return 'Our listed services are: Beard Trim R120 (20 min), Kids Cut R130 (25 min), Classic Haircut R180 (30 min), Hot Towel Shave R200 (35 min), Skin Fade R220 (45 min), and Cut & Beard Combo R280 (60 min). Other Hairstyle is 45 minutes with the price confirmed before the service.';
      }
      if (/\b(services|service menu|what do you offer|what services)\b/.test(q)) return 'We offer Classic Haircut, Skin Fade, Beard Trim, Cut & Beard Combo, Kids Cut (under 12), Hot Towel Shave, and Other Hairstyle. Ask me for a price or the details of any service.';
      if (/\b(student|discount)\b/.test(q)) return 'The current website does not list a student discount.';
      if (/\b(women|women\'s|ladies|female)\b/.test(q) && /hair|cut/.test(q)) return 'The current service menu does not list a dedicated women’s haircut service. You can contact the shop on 081 400 2277 to ask about a specific style.';

      if (/\b(pomade)\b/.test(q)) return 'Steelcut Pomade is R150. It has medium hold and high shine, and is suited to side parts and slick-back styles. You can buy products without booking a cut.';
      if (/\b(texture spray)\b/.test(q)) return 'Texture Spray is R165. It gives lightweight texture and natural movement for crops, fringes and textured styles.';
      if (/\b(beard oil|beard dryness|dry beard)\b/.test(q)) return 'Beard Oil is R140. It conditions the beard and helps reduce dry-feeling facial hair. Apply a few drops to your palms and work through the beard.';
      if (/\b(matte clay|strongest hold|strong hold)\b/.test(q)) return 'Matte Clay is R170. It gives strong hold with a low-shine finish and works well for textured styles, fades and structured short hair.';
      if (/\b(products|sell|buy product|buy products|ship|shipping|in-store)\b/.test(q)) return 'We list Steelcut Pomade (R150), Texture Spray (R165), Beard Oil (R140) and Matte Clay (R170). The website supports in-store product information; product shipping is not specified.';
      if (/\b(difference).*(matte clay|pomade)|\b(mattee? clay).*(pomade)|\b(pomade).*(matte clay)/.test(q)) return 'Pomade gives medium hold with high shine, while Matte Clay gives strong hold with a low-shine finish.';

      if (/\b(hours?|open|opening|close|closing|saturday|sunday|monday)\b/.test(q)) {
        if (/sunday/.test(q)) return 'We are closed on Sundays. Monday–Friday: 09:00–19:00. Saturday: 08:00–17:00.';
        if (/saturday/.test(q)) return 'Saturday hours are 08:00–17:00.';
        if (/monday/.test(q)) return 'Monday hours are 09:00–19:00.';
        if (/public holiday|holiday/.test(q)) return 'Public-holiday hours are not specified on the current website.';
        return 'Our hours are Monday–Friday 09:00–19:00, Saturday 08:00–17:00, and Sunday closed.';
      }

      if (/\b(address|where are you|where.*located|location|parking|how do i get there)\b/.test(q)) return 'Steelcut Barber Co. is at 14 Fox Street, Marshalltown, Johannesburg, 2001. The Contact/Visit section on the website includes the map. Parking information is not specified.';
      if (/\b(phone|telephone|call)\b/.test(q)) return 'You can call Steelcut on 081 400 2277.';
      if (/\b(email|mail)\b/.test(q)) return 'The Steelcut email is hello@steelcutbarber.co.za.';
      if (/\b(instagram|facebook|social)\b/.test(q)) return 'Instagram and Facebook links are shown in the website footer. The current site does not provide a specific social profile URL.';
      if (/\b(terms|privacy|refund|policy)\b/.test(q)) return 'The footer contains Terms & Conditions, Refund & Cancellation Policy, and Privacy Notice. The cancellation policy asks for at least 4 hours’ notice.';
      if (/\b(refund)\b/.test(q)) return 'For completed services, refunds are considered where there is a genuine service issue and should be raised with the shop promptly. Rework may be offered where appropriate.';

      if (/\b(what do you guys do|barbershop|salon|about steelcut|tell me about steelcut)\b/.test(q)) return 'Steelcut Barber Co. is a professional barbershop in Marshalltown, Johannesburg, focused on clean technique, clear communication and a consistent finish across haircuts, fades, beard grooming and hot towel shaves.';
      if (/\b(why choose|why steelcut)\b/.test(q)) return 'The website highlights professional barbers, clear service pricing and booking checks, with a focus on clean technique, clear communication and consistent finishes.';
      if (/\b(how long have you been open|how long.*open)\b/.test(q)) return 'The current website does not state when Steelcut Barber Co. first opened.';
      if (/\b(recommend|suggest|which service)\b/.test(q)) return 'For a clean everyday look, the Classic Haircut is a versatile option. If you want a sharper fade, choose Skin Fade. If you want hair and beard done together, choose the Cut & Beard Combo.';

      return 'I can help with booking, availability, services, prices, barbers, products, hours, location, policies and contact details. Try “Who are your barbers?”, “What times are available Saturday?”, or “Book a skin fade with Thabo.”';
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
      }, 220);
    }

    button.addEventListener('click', () => { panel.hidden = false; input.focus(); });
    close.addEventListener('click', () => { panel.hidden = true; });
    form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
    document.querySelectorAll('[data-ai-prompt]').forEach(item => item.addEventListener('click', () => send(item.dataset.aiPrompt || '')));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSteelcutAI); else initSteelcutAI();
})();

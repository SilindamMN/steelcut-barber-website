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

    const state = { service: null, barber: null, date: null, time: null };
    const addMessage = (text, type='bot') => {
      const el = document.createElement('div');
      el.className = 'steelcut-ai-message ' + type;
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    };
    const money = s => s ? (s.price ? `R${s.price}` : 'Price on request') : '';
    const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const pretty = d => d.toLocaleDateString('en-ZA',{weekday:'long',day:'numeric',month:'long'});
    const normalize = s => s.toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9: ]/g,' ').replace(/\s+/g,' ').trim();

    function findService(q) {
      const aliases = [
        ['Cut & Beard Combo',['cut & beard','cut and beard','haircut and beard','haircut + beard','combo','hair and beard']],
        ['Skin Fade',['skin fade','skin-fade','fade']],
        ['Classic Haircut',['classic haircut','classic cut','haircut','hair cut']],
        ['Beard Trim',['beard trim','beard tidy','beard shaping','beard line up','beard lineup']],
        ['Kids Cut (under 12)',['kids cut','kid cut','children cut','child cut']],
        ['Hot Towel Shave',['hot towel shave','hot towel','shave']],
        ['Other Hairstyle',['other hairstyle','other style','custom hairstyle']]
      ];
      for (const [name, words] of aliases) if (words.some(w=>q.includes(w))) return SERVICES.find(s=>s.name===name) || null;
      return null;
    }

    function findBarber(q) {
      const clean = normalize(q);
      return BARBERS.find(b => {
        const parts=b.name.toLowerCase().split(' ');
        return clean.includes(b.name.toLowerCase()) || parts.some(p=>p.length>3 && new RegExp(`\\b${p}\\b`).test(clean));
      }) || null;
    }

    function parseDate(q) {
      const now=new Date();
      if (q.includes('today')) return new Date(now.getFullYear(),now.getMonth(),now.getDate());
      if (q.includes('tomorrow')) return new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
      const days={sunday:0,monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6};
      for(const [name,target] of Object.entries(days)) if(q.includes(name)){
        const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
        let delta=(target-d.getDay()+7)%7;
        if(delta===0 || q.includes('next')) delta=delta===0?7:delta;
        d.setDate(d.getDate()+delta); return d;
      }
      const m=q.match(/\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/);
      if(m){const y=m[3]?(m[3].length===2?2000+Number(m[3]):Number(m[3])):now.getFullYear(); return new Date(y,Number(m[2])-1,Number(m[1]));}
      return null;
    }

    function parseAfter(q){
      const m=q.match(/(?:after|from|later than|from around)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
      if(!m) return null;
      let h=Number(m[1]), min=Number(m[2]||0); const ap=m[3];
      if(ap==='pm' && h<12) h+=12; if(ap==='am' && h===12) h=0;
      return h*60+min;
    }

    function availableTimes(date, service, barberName) {
      if(!date || !service) return [];
      const day=date.getDay(), dateISO=iso(date);
      if(!HOURS[day] || dateISO<todayISO() || demoDayStatus(dateISO).full) return [];
      const [open,close]=HOURS[day], result=[];
      for(let t=timeToMinutes(open); t<=timeToMinutes(close)-service.mins; t+=15){
        const time=minutesToTime(t);
        if(!isAtLeastOneHourFromNow(dateISO,time) || demoSlotBusy(dateISO,time)) continue;
        if(barberName ? isSlotAvailable(dateISO,time,barberName,service.mins) : isAnyBarberAvailable(dateISO,time,service.mins)) result.push(time);
      }
      return result;
    }

    function slotList(date, service, barberName, afterMinutes=null){
      let times=availableTimes(date,service,barberName);
      if(afterMinutes!==null) times=times.filter(t=>timeToMinutes(t)>=afterMinutes);
      return times;
    }

    function openBooking(service, barber, date, time) {
      const modal=document.getElementById('bookingModal'); if(!modal) return;
      const apply=()=>{
        if(service){const s=document.getElementById('m-service'); if(s){s.value=String(service.id); s.dispatchEvent(new Event('change',{bubbles:true}));}}
        if(barber){const o=[...document.querySelectorAll('.barber-option')].find(x=>x.dataset.barber===barber.name); if(o)o.click();}
        if(date){const d=document.getElementById('m-date'); if(d){d.value=iso(date); d.dispatchEvent(new Event('change',{bubbles:true}));}}
        if(time){setTimeout(()=>{const slot=[...document.querySelectorAll('.time-slot')].find(x=>x.textContent.trim()===time&&!x.disabled); if(slot)slot.click(); else {const ti=document.getElementById('m-time');if(ti)ti.value=time;const td=document.getElementById('timeDisplay');if(td)td.textContent=time;}},180);}
      };
      if(window.bootstrap?.Modal){bootstrap.Modal.getOrCreateInstance(modal).show();setTimeout(apply,350);} else {document.querySelector('[data-bs-target="#bookingModal"]')?.click();setTimeout(apply,500);}
    }

    function barberList(){
      return 'Our 7 barbers are:\n\n'+BARBERS.map((b,i)=>`${i+1}. ${b.name} — ${b.role}\n   ${b.style}`).join('\n\n');
    }

    function allBarberAvailability(date,service,after){
      const rows=BARBERS.map(b=>{const times=slotList(date,service,b.name,after).slice(0,5);return {b,times};}).filter(x=>x.times.length);
      if(!rows.length)return '';
      return rows.map(x=>`• ${x.b.name}: ${x.times.join(', ')}`).join('\n');
    }

    function servicesText(){return SERVICES.map(s=>`• ${s.name} — ${money(s)}, ${s.mins} min`).join('\n');}

    function respond(raw){
      const q=normalize(raw);
      const service=findService(q) || state.service;
      const barber=findBarber(q) || state.barber;
      const date=parseDate(q) || state.date;
      const after=parseAfter(q);

      if(/^(hi|hello|hey|yo|good morning|good afternoon|good evening)\b/.test(q)) return 'Hi! I’m Steelcut AI. I can help you book, check live demo availability, find a barber, compare services, get prices, find the shop, or answer product and policy questions. What would you like to do?';

      if(/(who.*barber|list.*barber|barber.*list|your barbers|team|staff|who works)/.test(q)) return barberList();

      if(/(what services|service menu|list services|what do you offer|services do you)/.test(q)) return `Here’s our service menu:\n${servicesText()}\n\nTell me a service if you want the details or want to book it.`;

      if(/(price|cost|how much|rate)/.test(q) && service) return `${service.name} is ${money(service)} and takes about ${service.mins} minutes. ${service.desc}`;
      if(/(price|prices|costs|how much)/.test(q)) return `Our listed prices are:\n${servicesText()}\nOther Hairstyle is quoted before the service starts.`;

      if(/(available|availability|slots?|times?|earliest|after\s*\d)/.test(q)){
        const chosenService=service || SERVICES[0];
        if(!date) return `Sure. Which day should I check? For example: “What slots are available Saturday?” You can also say “Saturday after 18:00”.`;
        if(!HOURS[date.getDay()]) return `${pretty(date)} is Sunday and Steelcut is closed.`;
        const times=slotList(date,chosenService,barber?.name||null,after);
        if(barber){
          if(!times.length)return `I couldn't find an available ${chosenService.name} slot for ${barber.name} on ${pretty(date)}${after!==null?' after '+minutesToTime(after):''}. I can check the other barbers too.`;
          return `Available ${chosenService.name} times with ${barber.name} on ${pretty(date)}${after!==null?' after '+minutesToTime(after):''}:\n\n${times.join(' · ')}\n\nWant me to open the booking form with ${barber.name} selected?`;
        }
        const byBarber=allBarberAvailability(date,chosenService,after);
        if(!byBarber)return `I couldn't find an available ${chosenService.name} slot on ${pretty(date)}. Try another day or service.`;
        return `Here are available ${chosenService.name} times on ${pretty(date)}:\n\n${byBarber}\n\nTell me a barber and time if you'd like me to open the booking form.`;
      }

      if(/(book|booking|appointment|reserve|schedule|make an appointment)/.test(q)){
        if(!service){state.barber=barber||state.barber; state.date=date||state.date; return 'Absolutely. What service would you like? For example: “Skin Fade”, “Classic Haircut”, or “Cut & Beard Combo”.';}
        if(!date){state.service=service;state.barber=barber||state.barber;return `Great — ${service.name} (${money(service)}, ${service.mins} min). What day would you like? For example “Saturday”.`;}
        if(!HOURS[date.getDay()])return `${pretty(date)} is Sunday and we’re closed. Choose Monday to Saturday.`;
        const times=slotList(date,service,barber?.name||null,after);
        if(!times.length)return `I couldn't find an available ${service.name} slot on ${pretty(date)}${barber?' with '+barber.name:''}. Ask me for another day or barber.`;
        const chosen=times[0]; state.service=service;state.barber=barber||null;state.date=date;state.time=chosen;
        openBooking(service,barber,date,chosen);
        return `Great — I found ${times.length} available slot${times.length===1?'':'s'} on ${pretty(date)}${barber?' with '+barber.name:''}. I opened the booking form with ${service.name}${barber?' and '+barber.name:''} selected and suggested ${chosen}. You can choose another available time before confirming.`;
      }

      if(/(walk.?in|need an appointment)/.test(q))return 'The website is set up around appointments. Walk-in availability is not specified in the current shop information, so booking ahead is the safer option.';
      if(/(reschedule|change.*appointment|move.*appointment)/.test(q))return 'The current site does not have a self-service rescheduling flow. Please contact Steelcut on 081 400 2277 or hello@steelcutbarber.co.za to request a change.';
      if(/(cancel|cancellation)/.test(q))return 'Please give at least 4 hours’ notice when cancelling or rescheduling. Repeated late cancellations or no-shows may require a deposit or another booking restriction.';

      if(/(owner)/.test(q))return 'Thabo Mokoena is the Owner · Master Barber. He is listed for fades, tapers and beard sculpting.';
      if(/(kids|children).*(barber|who|does)/.test(q))return 'Lwazi Khumalo is listed for kids cuts and modern crops.';
      if(/(beard).*(barber|who|special)/.test(q))return 'Thabo Mokoena is listed for beard sculpting, while Kabelo Maseko is listed for beard detailing.';
      if(/(best|speciali[sz]e|good for)/.test(q) && barber)return `${barber.name} is listed as ${barber.role}, with ${barber.style.toLowerCase()}`;

      if(service && /(include|difference|what is|do you do|offer|tell me)/.test(q))return `${service.name}: ${money(service)}, about ${service.mins} minutes. ${service.desc} ${service.details}`;
      if(/(student|discount)/.test(q))return 'The current website does not list a student discount.';
      if(/(women|ladies|female).*(hair|cut)/.test(q))return 'The current service menu does not list a dedicated women’s haircut service. You can contact the shop on 081 400 2277 about a specific style.';

      if(/(pomade)/.test(q))return 'Steelcut Pomade is R150 — medium hold and high shine, suited to side parts and slick-backs.';
      if(/(texture spray)/.test(q))return 'Texture Spray is R165 — lightweight texture and natural movement for crops, fringes and textured styles.';
      if(/(beard oil|beard dryness|dry beard)/.test(q))return 'Beard Oil is R140 — it conditions the beard and helps reduce dry-feeling facial hair.';
      if(/(matte clay|strongest hold|strong hold)/.test(q))return 'Matte Clay is R170 — strong hold with a low-shine finish, useful for textured styles, fades and structured short hair.';
      if(/(products|sell|buy product|buy products|ship|shipping|in-store)/.test(q))return 'We list Pomade R150, Texture Spray R165, Beard Oil R140 and Matte Clay R170. The site supports in-store product information; shipping is not specified.';
      if(/(difference).*(matte clay|pomade)|(matte clay).*(pomade)|(pomade).*(matte clay)/.test(q))return 'Pomade gives medium hold with high shine. Matte Clay gives strong hold with a low-shine finish.';

      if(/(hours|open|opening|close|closing|saturday|sunday|monday|public holiday|holiday)/.test(q)){
        if(q.includes('sunday'))return 'Sunday: Closed. Monday–Friday: 09:00–19:00. Saturday: 08:00–17:00.';
        if(q.includes('saturday'))return 'Saturday: 08:00–17:00.';
        if(q.includes('monday'))return 'Monday: 09:00–19:00.';
        if(q.includes('holiday'))return 'Public-holiday hours are not specified on the current website.';
        return 'Monday–Friday: 09:00–19:00. Saturday: 08:00–17:00. Sunday: Closed.';
      }

      if(/(address|where are you|where.*located|location|parking|how do i get)/.test(q))return 'Steelcut Barber Co. is at 14 Fox Street, Marshalltown, Johannesburg, 2001. The Contact/Visit section includes the map. Parking information is not specified on the current website.';
      if(/(phone|telephone|call)/.test(q))return 'You can call Steelcut on 081 400 2277.';
      if(/(email|mail)/.test(q))return 'The Steelcut email is hello@steelcutbarber.co.za.';
      if(/(instagram|facebook|social)/.test(q))return 'Instagram and Facebook links are shown in the footer, but the current site does not provide specific profile URLs.';
      if(/(terms|privacy|refund|policy)/.test(q))return 'The footer contains Terms & Conditions, Refund & Cancellation Policy, and Privacy Notice. The cancellation policy asks for at least 4 hours’ notice.';
      if(/(refund)/.test(q))return 'For completed services, refunds are considered where there is a genuine service issue and should be raised with the shop promptly. Rework may be offered where appropriate.';

      if(/(what do you guys do|barbershop|salon|about steelcut|tell me about steelcut)/.test(q))return 'Steelcut Barber Co. is a professional barbershop in Marshalltown, Johannesburg, focused on clean technique, clear communication and consistent finishes across haircuts, fades, beard grooming and hot towel shaves.';
      if(/(why choose|why steelcut)/.test(q))return 'The website highlights professional barbers, clear service pricing and booking checks, with a focus on clean technique, clear communication and consistent finishes.';
      if(/(how long have you been open|how long.*open)/.test(q))return 'The current website does not state when Steelcut Barber Co. first opened.';
      if(/(recommend|suggest|which service)/.test(q))return 'For an everyday look, Classic Haircut is versatile. For sharper sides, choose Skin Fade. For hair and beard together, choose Cut & Beard Combo.';

      return 'I can help with booking, availability, services, prices, barbers, products, hours, location, policies and contact details. Try “List your barbers”, “What slots are available Saturday?”, or “Book a skin fade with Thabo on Saturday”.';
    }

    function send(text){
      const clean=text.trim(); if(!clean)return;
      addMessage(clean,'user'); input.value='';
      const typing=document.createElement('div');typing.className='steelcut-ai-message bot typing';typing.textContent='Thinking…';messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
      setTimeout(()=>{typing.remove();addMessage(respond(clean),'bot');},180);
    }

    button.addEventListener('click',()=>{panel.hidden=false;input.focus();});
    close.addEventListener('click',()=>{panel.hidden=true;});
    form.addEventListener('submit',e=>{e.preventDefault();send(input.value);});
    document.querySelectorAll('[data-ai-prompt]').forEach(item=>item.addEventListener('click',()=>send(item.dataset.aiPrompt||'')));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initSteelcutAI);else initSteelcutAI();
})();

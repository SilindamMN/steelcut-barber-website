const SERVICES=[
{id:0,name:"Classic Haircut",price:180,mins:30,img:"https://images.pexels.com/photos/35157692/pexels-photo-35157692.jpeg?auto=compress&cs=tinysrgb&w=900",desc:"Scissor or clipper cut with a clean finish and styling.",suits:"A versatile everyday cut for most hair types and face shapes.",details:"A balanced cut using scissors, clippers or both depending on the desired finish. Your barber will confirm the shape and length before starting."},
{id:1,name:"Skin Fade",price:220,mins:45,img:"https://images.pexels.com/photos/19664876/pexels-photo-19664876.jpeg?auto=compress&cs=tinysrgb&w=900",desc:"Precision fade blended down to a clean skin line.",suits:"Ideal when you want strong contrast and clean sides.",details:"The sides are faded progressively down to skin while the top is shaped to your preferred length. The finish is detailed around the hairline and ears."},
{id:2,name:"Beard Trim",price:120,mins:20,img:"https://images.pexels.com/photos/4190568/pexels-photo-4190568.jpeg?auto=compress&cs=tinysrgb&w=900",desc:"Shape, line-up and tidy beard finish.",suits:"For maintaining an existing beard or resetting its shape.",details:"Includes beard shaping, neckline and cheek-line clean-up and a finishing treatment. Bring your preferred beard shape or let the barber recommend one."},
{id:3,name:"Cut & Beard Combo",price:280,mins:60,img:"https://images.pexels.com/photos/4625627/pexels-photo-4625627.jpeg?auto=compress&cs=tinysrgb&w=900",desc:"Full haircut plus beard shape in one appointment.",suits:"For a complete matched haircut and beard look.",details:"Combines the Classic Haircut service with a professional beard trim and finishing treatment. It is designed to give the hair and beard a consistent overall shape."},
{id:4,name:"Kids Cut (under 12)",price:130,mins:25,img:"https://images.pexels.com/photos/19028067/pexels-photo-19028067.jpeg?auto=compress&cs=tinysrgb&w=900",desc:"Patient, practical cuts for younger clients.",suits:"Designed for children under 12 and shorter appointment times.",details:"A simple, age-appropriate haircut with a focus on comfort and a clean finish. A parent or responsible adult should remain available during the appointment."},
{id:5,name:"Hot Towel Shave",price:200,mins:35,img:"https://images.pexels.com/photos/7518742/pexels-photo-7518742.jpeg?auto=compress&cs=tinysrgb&w=900",desc:"Traditional shave with hot towel preparation.",suits:"For clients wanting a smooth, classic grooming finish.",details:"The service includes hot towel preparation, shaving, clean-up and a finishing treatment. Customers with sensitive skin should tell the barber before the service begins."},
{id:6,name:"Other Hairstyle",price:0,mins:45,img:"images/classic-haircut.jpg",desc:"Tell us the hairstyle you have in mind and we will discuss the best option with you.",suits:"For styles not listed in the standard service menu.",details:"Price is confirmed before the service starts. Add your requested hairstyle in the booking notes."}
];

const PRODUCTS=[
{name:"Steelcut Pomade",price:150,img:"https://images.pexels.com/photos/7697641/pexels-photo-7697641.jpeg?auto=compress&cs=tinysrgb&w=900",desc:"Medium hold and high shine for side parts and slick-backs.",details:"Use a small amount on damp or dry hair. Add gradually until the desired hold and shine are reached."},
{name:"Texture Spray",price:165,img:"https://images.pexels.com/photos/5192490/pexels-photo-5192490.jpeg?auto=compress&cs=tinysrgb&w=900",desc:"Lightweight texture for crops, fringes and natural movement.",details:"Spray lightly through damp or dry hair and work through with your fingers. Add more only when needed."},
{name:"Beard Oil",price:140,img:"images/beard-oil.jpg",desc:"Conditions the beard and helps reduce dry-feeling facial hair.",details:"Apply a few drops to the palms, rub together and work through the beard. Avoid contact with the eyes."},
{name:"Matte Clay",price:170,img:"https://images.pexels.com/photos/9511913/pexels-photo-9511913.jpeg?auto=compress&cs=tinysrgb&w=900",desc:"Strong hold with a low-shine finish.",details:"Warm a small amount between the palms before applying. Best for textured styles, fades and structured short hair."}
];

const BARBERS=[
 {name:"Thabo Mokoena",role:"Owner · Master Barber",style:"Fades, tapers and beard sculpting.",initials:"TM"},
 {name:"Siya Ndlovu",role:"Senior Barber",style:"Classic cuts and hot towel shaves.",initials:"SN"},
 {name:"Lwazi Khumalo",role:"Barber",style:"Kids cuts and modern crops.",initials:"LK"},
 {name:"Anele Dlamini",role:"Senior Barber",style:"Textured crops and modern fades.",initials:"AD"},
 {name:"Kabelo Maseko",role:"Barber",style:"Clean cuts and beard detailing.",initials:"KM"},
 {name:"Musa Nkosi",role:"Barber",style:"Tapers, line-ups and styling.",initials:"MN"},
 {name:"Sibusiso Zulu",role:"Barber",style:"Classic cuts and precision fades.",initials:"SZ"}
];
const BARBER_NAMES=BARBERS.map(b=>b.name);
const HAIRSTYLES=[
 {name:"Classic Taper",label:"Clean sides · Natural finish",img:"images/classic-haircut.jpg"},
 {name:"Skin Fade",label:"Sharp contrast · Clean finish",img:"images/skin-fade.jpg"},
 {name:"Textured Crop",label:"Short texture · Easy styling",img:"images/texture-spray.jpg"},
 {name:"Classic Cut",label:"Timeless · Polished finish",img:"images/classic-haircut.jpg"},
 {name:"Fade & Beard",label:"Faded sides · Defined beard",img:"images/combo.jpg"},
 {name:"Kids Cut",label:"Simple · Comfortable finish",img:"images/kids-cut.jpg"},
 {name:"Beard Line-Up",label:"Crisp lines · Clean shape",img:"images/beard-trim.jpg"},
 {name:"Hot Towel Shave",label:"Smooth · Traditional finish",img:"images/hot-shave.jpg"},
 {name:"Modern Crop",label:"Short top · Textured look",img:"images/texture-spray.jpg"},
 {name:"Sharp Combo",label:"Haircut · Beard styling",img:"images/combo.jpg"}
];

const HOURS={1:["09:00","19:00"],2:["09:00","19:00"],3:["09:00","19:00"],4:["09:00","19:00"],5:["09:00","19:00"],6:["08:00","17:00"]};

// Demo-only availability: deterministic "random" busy times and a few fully booked days.
// This makes the calendar feel realistic while keeping the same result when the page reloads.
function availabilitySeed(value){let n=0;for(let i=0;i<value.length;i++)n=((n<<5)-n+value.charCodeAt(i))|0;return Math.abs(n);} 
function demoDayStatus(date){
 const today=todayISO();
 if(date<=today)return {full:false,busy:new Set()};
 const seed=availabilitySeed(date);
 const full=(seed%17===0)||(seed%29===0);
 const busy=new Set();
 if(!full){
  const count=2+(seed%3);
  for(let i=0;i<count;i++){
   const slotSeed=availabilitySeed(date+"-"+i);
   busy.add(slotSeed%40);
  }
 }
 return {full,busy};
}
function demoSlotBusy(date,time){
 const status=demoDayStatus(date);
 if(status.full)return true;
 const [h,m]=time.split(":").map(Number);
 const slotIndex=((h*60+m)-480)/15;
 const seed=availabilitySeed(date+"-slot-"+slotIndex);
 return status.busy.has(seed%40);
}
function isAtLeastOneHourFromNow(date,time){
 const now=new Date();
 const chosen=new Date(date+"T"+time+":00");
 if(date!==todayISO())return true;
 return chosen.getTime()>=now.getTime()+60*60*1000;
}
let pendingServiceId="";
const EMAIL_CONFIG={enabled:false,serviceId:"YOUR_EMAILJS_SERVICE_ID",templateId:"YOUR_EMAILJS_TEMPLATE_ID",publicKey:"YOUR_EMAILJS_PUBLIC_KEY"};
let calendarCursor=new Date();
calendarCursor.setDate(1);

function $(id){return document.getElementById(id)}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function dateParts(v){const d=new Date(v+"T00:00:00");return {date:d,day:d.getDay()}}
function todayISO(){const d=new Date();d.setHours(0,0,0,0);return d.toISOString().slice(0,10)}
function timeToMinutes(t){const [h,m]=t.split(":").map(Number);return h*60+m}
function minutesToTime(n){n=Math.max(0,n);return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")}
function overlaps(aStart,aEnd,bStart,bEnd){return aStart<bEnd && bStart<aEnd}
function getBookings(){try{return JSON.parse(localStorage.getItem("steelcut_bookings")||"[]")}catch(e){return[]}}
function isSlotAvailable(date,time,barber,mins){
 const start=timeToMinutes(time),end=start+mins;
 return !getBookings().some(b=>b.date===date && b.barber===barber && overlaps(start,end,timeToMinutes(b.time),timeToMinutes(b.endTime)));
}
function isAnyBarberAvailable(date,time,mins){return BARBERS.some(b=>isSlotAvailable(date,time,b.name,mins))}
function chooseBarber(date,time,mins){
 const requested=$("m-barber").value;
 if(requested)return isSlotAvailable(date,time,requested,mins)?requested:null;
 return BARBERS.find(b=>isSlotAvailable(date,time,b.name,mins))?.name||null;
}
function fmtDate(v){return new Date(v+"T00:00:00").toLocaleDateString("en-ZA",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
function fmtICS(d){return d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,"0")+String(d.getUTCDate()).padStart(2,"0")+"T"+String(d.getUTCHours()).padStart(2,"0")+String(d.getUTCMinutes()).padStart(2,"0")+"00Z"}

function renderStyles(){
 const wrap=$("serviceCards"),sel=$("m-service");
 wrap.innerHTML="";sel.innerHTML='<option value="">Select a service</option>';
 SERVICES.forEach(s=>{
  wrap.insertAdjacentHTML("beforeend",`<div class="col-6 col-lg-3"><article class="compact-service-card"><img src="${s.img}" alt="${esc(s.name)}"><div class="compact-service-body"><div class="service-title-row"><h3>${esc(s.name)}</h3><span class="price">${s.id===6?"Quote":"R"+s.price}</span></div><div class="service-meta"><span>${s.mins} min</span><span>Professional service</span></div><div class="service-more d-none" id="service-more-${s.id}"><p>${esc(s.desc)}</p><p><strong>Who it suits:</strong> ${esc(s.suits)}</p><p>${esc(s.details)}</p></div><button type="button" class="btn btn-link show-more-service" data-target="service-more-${s.id}">Show more</button><button type="button" class="btn btn-gold btn-sm book-style" data-id="${s.id}">Book</button></div></article></div>`);
  sel.insertAdjacentHTML("beforeend",`<option value="${s.id}">${esc(s.name)} — ${s.id===6?"Price on request":"R"+s.price+" · "+s.mins+" min"}</option>`);
 });
 document.querySelectorAll(".show-more-service").forEach(b=>b.onclick=()=>{
  const card=b.closest(".compact-service-card");
  const el=$(b.dataset.target);
  const open=!el.classList.contains("d-none");
  el.classList.toggle("d-none",open);
  card.classList.toggle("is-expanded",!open);
  b.textContent=open?"Show more":"Show less";
 });
 document.querySelectorAll(".book-style").forEach(b=>{b.onclick=()=>{
  pendingServiceId=b.dataset.id;
  $("m-service").value=b.dataset.id;
  resetBookingPickers();
  bootstrap.Modal.getOrCreateInstance($("bookingModal")).show();
 }});
}
function renderHairstyles(){
 const grid=$("hairstyleGrid"); if(!grid)return;
 grid.innerHTML=HAIRSTYLES.map(h=>`<article class="hairstyle-card"><img src="${h.img}" alt="${esc(h.name)} hairstyle"><div><h3>${esc(h.name)}</h3><span>${esc(h.label)}</span></div></article>`).join("");
}
function renderBarberTeam(){
 const slider=$("barberSlider"),picker=$("barberPicker"); if(!slider||!picker)return;
 slider.innerHTML=BARBERS.map((b,i)=>`<article class="barber-team-card"><div class="barber-team-avatar">${b.initials}</div><h3>${esc(b.name)}</h3><span>${esc(b.role)}</span><p>${esc(b.style)}</p></article>`).join("");
 picker.innerHTML=`<button type="button" class="barber-option active" data-barber=""><span class="barber-option-avatar any-avatar">ALL</span><span><strong>Any available barber</strong><small>We will assign the first available barber</small></span></button>`+BARBERS.map(b=>`<button type="button" class="barber-option" data-barber="${esc(b.name)}"><span class="barber-option-avatar">${b.initials}</span><span><strong>${esc(b.name)}</strong><small>${esc(b.role)}</small></span></button>`).join("");
 document.querySelectorAll(".barber-option").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".barber-option").forEach(x=>x.classList.remove("active"));btn.classList.add("active");$("m-barber").value=btn.dataset.barber;$("m-time").value="";$("timeDisplay").textContent="Choose a time";if($("m-date").value)renderTimeSlots()}));
 const step=()=>Math.max(280,slider.clientWidth*.8);$("barberPrev").onclick=()=>slider.scrollBy({left:-step(),behavior:"smooth"});$("barberNext").onclick=()=>slider.scrollBy({left:step(),behavior:"smooth"});
}

function renderProducts(){
 const wrap=$("productCards");
 PRODUCTS.forEach((p,i)=>wrap.insertAdjacentHTML("beforeend",`<div class="col-6 col-lg-3"><div class="product-card"><img src="${p.img}" alt="${esc(p.name)}"><div class="body"><h3 class="h6 mb-1">${esc(p.name)}</h3><div class="price mb-2">R${p.price}</div><p class="text-muted-c small mb-2">${esc(p.desc)}</p><button class="btn btn-outline-cream btn-sm read-product" data-id="${i}">Read more</button></div></div></div>`));
 document.querySelectorAll(".read-product").forEach(b=>b.onclick=()=>showDetail(PRODUCTS[b.dataset.id],false));
}
function showDetail(item,isService){
 $("detailTitle").textContent=item.name;$("detailImage").src=item.img;$("detailImage").alt=item.name;
 $("detailBody").innerHTML=`<p class="text-muted-c">${esc(item.desc)}</p><p class="text-muted-c">${esc(item.details)}</p>${isService?`<div class="booking-policy"><strong>Price:</strong> R${item.price} &nbsp; <strong>Duration:</strong> ${item.mins} minutes</div>`:`<div class="booking-policy"><strong>Price:</strong> R${item.price}</div>`}`;
 $("detailBook").style.display=isService?"inline-block":"none";
 if(isService)$("detailBook").onclick=()=>{pendingServiceId=item.id;$("m-service").value=item.id;bootstrap.Modal.getOrCreateInstance($("detailModal")).hide();setTimeout(()=>{resetBookingPickers();bootstrap.Modal.getOrCreateInstance($("bookingModal")).show()},250)};
 bootstrap.Modal.getOrCreateInstance($("detailModal")).show();
}

function resetBookingPickers(){
 $("m-barber").value="";
 document.querySelectorAll(".barber-option").forEach(b=>b.classList.toggle("active",b.dataset.barber===""));
 $("m-date").value="";$("m-time").value="";$("dateDisplay").textContent="Choose a date";$("timeDisplay").textContent="Choose a time";
 $("dateHelp").textContent="Sunday is closed. Choose Monday–Saturday. Today is available from 1 hour from now.";$("timeHelp").textContent="Select a date to see available times.";
 $("datePickerPanel").classList.add("d-none");$("timePickerPanel").classList.add("d-none");
 calendarCursor=new Date();calendarCursor.setDate(1);renderCalendar();
}
function renderCalendar(){
 const year=calendarCursor.getFullYear(),month=calendarCursor.getMonth();
 $("calendarMonth").textContent=new Intl.DateTimeFormat("en-ZA",{month:"long",year:"numeric"}).format(calendarCursor);
 const grid=$("calendarGrid");grid.innerHTML="";
 const firstDay=new Date(year,month,1).getDay();const days=new Date(year,month+1,0).getDate();const today=todayISO();
 for(let i=0;i<firstDay;i++)grid.insertAdjacentHTML("beforeend",`<span class="calendar-empty"></span>`);
 for(let d=1;d<=days;d++){
  const iso=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const dow=new Date(iso+"T00:00:00").getDay();
  const past=iso<today,closed=dow===0,status=demoDayStatus(iso),full=status.full;
  const disabled=past||closed||full;
  const selected=iso===$("m-date").value;
  const classes=["calendar-day",selected?"selected":"",closed?"closed":"",full?"full-booked":""].filter(Boolean).join(" ");
  grid.insertAdjacentHTML("beforeend",`<button type="button" class="${classes}" data-date="${iso}" ${disabled?"disabled":""} title="${full?"Fully booked":""}"><span>${d}</span>${full?"<small>FULL</small>":""}</button>`);
 }
 grid.querySelectorAll(".calendar-day:not([disabled])").forEach(b=>b.onclick=()=>selectDate(b.dataset.date));
}
function selectDate(iso){
 const {day}=dateParts(iso);if(day===0)return;
 $("m-date").value=iso;$("dateDisplay").textContent=fmtDate(iso);$("dateHelp").textContent=`Open ${HOURS[day][0]}–${HOURS[day][1]}. Times shown below account for service duration.`;
 $("datePickerPanel").classList.add("d-none");$("m-time").value="";$("timeDisplay").textContent="Choose a time";renderTimeSlots();
 $("timePickerPanel").classList.remove("d-none");
}
function renderTimeSlots(){
 const grid=$("timeGrid"),date=$("m-date").value,svc=SERVICES[+$("m-service").value];
 grid.innerHTML="";
 if(!date||!svc){$("timePanelNote").textContent="Choose a service and date first.";return}
 const {day}=dateParts(date);if(!HOURS[day])return;
 const [open,close]=HOURS[day],start=timeToMinutes(open),last=timeToMinutes(close)-svc.mins;
 const status=demoDayStatus(date);
 $("timePanelNote").textContent=status.full?`${open}–${close} · Fully booked demo day`:`${open}–${close} · ${svc.mins} min service`;
 for(let t=start;t<=last;t+=15){
  const time=minutesToTime(t);
  const tooSoon=!isAtLeastOneHourFromNow(date,time);
  const demoBusy=demoSlotBusy(date,time);
  const realAvailable=$("m-barber").value?isSlotAvailable(date,time,$("m-barber").value,svc.mins):isAnyBarberAvailable(date,time,svc.mins);
  const available=!tooSoon&&!demoBusy&&realAvailable;
  const reason=tooSoon?"Bookings must be made at least 1 hour from now":demoBusy?"Unavailable in demo availability":realAvailable?"Available":"No barber available at this time";
  const b=document.createElement("button");b.type="button";b.className="time-slot"+(time===$("m-time").value?" selected":"")+(demoBusy?" demo-busy":"");b.textContent=time;b.disabled=!available;b.title=reason;
  b.onclick=()=>selectTime(time);grid.appendChild(b);
 }
}
function selectTime(time){
 $("m-time").value=time;$("timeDisplay").textContent=time;$("timeHelp").textContent="Selected time is checked again when you confirm.";
 document.querySelectorAll(".time-slot").forEach(b=>b.classList.toggle("selected",b.textContent===time));
 $("timePickerPanel").classList.add("d-none");
}
function toggleDatePicker(){
 $("timePickerPanel").classList.add("d-none");$("datePickerPanel").classList.toggle("d-none");renderCalendar();
}
function toggleTimePicker(){
 if(!$("m-date").value){$("dateHelp").textContent="Choose your appointment date first.";$("datePickerPanel").classList.remove("d-none");renderCalendar();return}
 $("datePickerPanel").classList.add("d-none");renderTimeSlots();$("timePickerPanel").classList.toggle("d-none");
}
function buildCalendarICS(svc,booking){
 const start=new Date(booking.date+"T"+booking.time+":00"),end=new Date(start.getTime()+svc.mins*60000);
 return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Steelcut Barber Co.//Booking//EN","CALSCALE:GREGORIAN","BEGIN:VEVENT","UID:steelcut-"+Date.now()+"@steelcutbarber.co.za","DTSTAMP:"+fmtICS(new Date()),"DTSTART:"+fmtICS(start),"DTEND:"+fmtICS(end),"SUMMARY:"+svc.name+" at Steelcut Barber Co.","DESCRIPTION:Appointment for "+booking.name+" with "+booking.barber+". Service: "+svc.name+" (R"+svc.price+").","LOCATION:14 Fox Street\, Marshalltown\, Johannesburg\, 2001","END:VEVENT","END:VCALENDAR"].join("\r\n");
}
function googleCalendarUrl(svc,booking){
 const start=new Date(booking.date+"T"+booking.time+":00"),end=new Date(start.getTime()+svc.mins*60000);
 const fmt=d=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/, "Z");
 const params=new URLSearchParams({action:"TEMPLATE",text:svc.name+" at Steelcut Barber Co.",dates:fmt(start)+"/"+fmt(end),details:"Appointment for "+booking.name+" with "+booking.barber+". Service: "+svc.name+" (R"+svc.price+").\nPhone: "+booking.phone,location:"14 Fox Street, Marshalltown, Johannesburg, 2001"});
 return "https://calendar.google.com/calendar/render?"+params.toString();
}
function addCalendarFile(svc,booking){
 const blob=new Blob([buildCalendarICS(svc,booking)],{type:"text/calendar;charset=utf-8"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="steelcut-appointment.ics";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function sendAutomaticEmail(svc,booking){
 if(!EMAIL_CONFIG.enabled||!window.emailjs)return false;
 try{emailjs.init({publicKey:EMAIL_CONFIG.publicKey});await emailjs.send(EMAIL_CONFIG.serviceId,EMAIL_CONFIG.templateId,{to_email:booking.email,to_name:booking.name,service:svc.name,price:`R${svc.price}`,barber:booking.barber,date:fmtDate(booking.date),time:booking.time,phone:booking.phone,notes:booking.notes||""});return true}catch(e){console.warn("Automatic email failed",e);return false}
}

$("m-service").addEventListener("change",()=>{if($("m-date").value)renderTimeSlots()});
$("datePickerCard").addEventListener("click",toggleDatePicker);$("datePickerCard").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")toggleDatePicker()});
$("timePickerCard").addEventListener("click",toggleTimePicker);$("timePickerCard").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")toggleTimePicker()});
$("prevMonth").addEventListener("click",()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar()});
$("nextMonth").addEventListener("click",()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar()});

function validateCustomerFields(){
 const email=$("m-email"),phone=$("m-phone"),name=$("m-name");
 const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
 const phoneOk=/^0\d{9}$/.test(phone.value.trim());
 const nameOk=name.value.trim().length>=2;
 email.setCustomValidity(emailOk?"":"Enter a valid email address.");
 phone.setCustomValidity(phoneOk?"":"Use exactly 10 digits starting with 0.");
 name.setCustomValidity(nameOk?"":"Enter your full name.");
 email.classList.toggle("is-invalid",!emailOk);
 phone.classList.toggle("is-invalid",!phoneOk);
 name.classList.toggle("is-invalid",!nameOk);
 return emailOk&&phoneOk&&nameOk;
}

$("m-email").addEventListener("input",validateCustomerFields);
$("m-phone").addEventListener("input",()=>{
 const input=$("m-phone");
 input.value=input.value.replace(/\D/g,"").slice(0,10);
 validateCustomerFields();
});
$("m-name").addEventListener("input",validateCustomerFields);

$("bookingForm").addEventListener("submit",async e=>{
 e.preventDefault();const err=$("bookingErr");err.classList.add("d-none");err.textContent="";
 const svc=SERVICES[+$("m-service").value],date=$("m-date").value,time=$("m-time").value,name=$("m-name").value.trim(),email=$("m-email").value.trim(),phone=$("m-phone").value.trim(),notes=$("m-notes").value.trim();
 if(!svc||!date||!time||!name||!email||!phone){err.textContent="Please complete service, barber, date, time, name, email and cellphone.";err.classList.remove("d-none");return}
 if(!validateCustomerFields()||!e.target.checkValidity()){err.textContent="Please correct the highlighted customer details before confirming.";err.classList.remove("d-none");e.target.classList.add("was-validated");return}
 const {day}=dateParts(date);if(day===0||!HOURS[day]){err.textContent="Sunday is closed. Please choose Monday to Saturday.";err.classList.remove("d-none");return}
 const [open,close]=HOURS[day],t=timeToMinutes(time),end=t+svc.mins;if(!isAtLeastOneHourFromNow(date,time)){err.textContent="Same-day bookings must be made at least 1 hour from the current time.";err.classList.remove("d-none");renderTimeSlots();return}
 if(demoDayStatus(date).full||demoSlotBusy(date,time)){err.textContent="That time is unavailable in the demo calendar. Please choose another time.";err.classList.remove("d-none");renderTimeSlots();return}
 if(t<timeToMinutes(open)||end>timeToMinutes(close)){err.textContent=`This service must finish within operating hours. On this day we are open ${open}–${close}.`;err.classList.remove("d-none");return}
 const barber=chooseBarber(date,time,svc.mins);if(!barber){err.textContent=$("m-barber").value?`${$("m-barber").value} is already booked for this time. Please choose another available time.`:"All barbers are booked for this time. Please choose another available time.";err.classList.remove("d-none");renderTimeSlots();return}
 const booking={date,time,endTime:minutesToTime(end),barber,name,email,phone,notes,serviceId:svc.id,createdAt:Date.now()};const bookings=getBookings();bookings.push(booking);localStorage.setItem("steelcut_bookings",JSON.stringify(bookings));
 const googleBtn=$("googleCalendarBtn");googleBtn.href=googleCalendarUrl(svc,booking);$("calendarFileBtn").onclick=()=>addCalendarFile(svc,booking);const emailSent=await sendAutomaticEmail(svc,booking);
 $("successText").textContent=`${name}, your ${svc.name} with ${barber} is confirmed for ${fmtDate(date)} at ${time}.`;
 $("bookingSuccess").classList.remove("d-none");e.target.classList.add("d-none");e.target.querySelector("button[type=submit]").disabled=true;err.classList.add("d-none");
 $("calendarHelp").textContent=emailSent?"Confirmation email sent. Add the appointment to your calendar using one of the options above.":"Add the appointment to your calendar using one of the options above. Email confirmation will be sent automatically once the site's email service is connected.";
});

$("bookingModal").addEventListener("show.bs.modal",()=>{
 const selectedService=pendingServiceId;
 $("bookingSuccess").classList.add("d-none");
 $("bookingForm").classList.remove("d-none");
 $("bookingForm").reset();
 $("bookingForm").querySelector("button[type=submit]").disabled=false;
 resetBookingPickers();
 if(selectedService!=="")$("m-service").value=selectedService;
 pendingServiceId="";
});
renderStyles();renderHairstyles();renderBarberTeam();renderProducts();renderCalendar();




// Steelcut AI Assistant
(function(){
  const button=document.getElementById('steelcutAiButton');
  const panel=document.getElementById('steelcutAiPanel');
  const close=document.getElementById('steelcutAiClose');
  const messages=document.getElementById('steelcutAiMessages');
  const form=document.getElementById('steelcutAiForm');
  const input=document.getElementById('steelcutAiInput');
  if(!button||!panel||!close||!messages||!form||!input)return;

  const addMessage=(text,type)=>{
    const el=document.createElement('div');el.className='steelcut-ai-message '+type;el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;return el;
  };
  const localReply=(text)=>{
    const q=text.toLowerCase();
    if(q.includes('hour')||q.includes('open')||q.includes('close')) return 'Our hours are Monday–Friday 09:00–19:00, Saturday 08:00–17:00, and Sunday closed.';
    if(q.includes('beard oil')) return 'Our Beard Oil is available in the Products section. It is a grooming option for keeping the beard conditioned and looking neat.';
    if(q.includes('price')||q.includes('cost')) return 'You can see current service prices in the Services section. I can also help you choose a service based on the look you want.';
    if(q.includes('book')||q.includes('appointment')) return 'Absolutely. Use the Book a Cut button to open the booking form. You can choose your service, barber, date and available time.';
    if(q.includes('barber')) return 'We have a team of seven barbers. You can choose a barber during booking, subject to availability.';
    if(q.includes('recommend')||q.includes('professional')||q.includes('wedding')) return 'For a clean professional look, I would start with one of our haircut services and add a beard trim if you wear facial hair. If you tell me your hair length and the look you want, I can narrow it down.';
    return 'I can help with services, prices, barbers, products, opening hours and booking. What would you like to know?';
  };
  function send(text){
    const clean=text.trim();if(!clean)return;
    addMessage(clean,'user');input.value='';
    // Frontend-only assistant: works on GitHub Pages and other static hosting.
    window.setTimeout(()=>addMessage(localReply(clean),'bot'),250);
  }
  button.addEventListener('click',()=>{panel.hidden=false;input.focus()});
  close.addEventListener('click',()=>panel.hidden=true);
  form.addEventListener('submit',e=>{e.preventDefault();send(input.value)});
  document.querySelectorAll('[data-ai-prompt]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.aiPrompt)));
})();


// Close the Bootstrap mobile navigation after a link is selected.
(function(){
  const navMenu=document.getElementById('navMenu');
  if(!navMenu || !window.bootstrap)return;
  document.querySelectorAll('#navMenu .nav-link').forEach(link=>{
    link.addEventListener('click',()=>{
      if(navMenu.classList.contains('show')){
        bootstrap.Collapse.getOrCreateInstance(navMenu,{toggle:false}).hide();
      }
    });
  });
})();

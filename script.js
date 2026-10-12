/* LBDN — single script for the public site AND the admin dashboard.
   Each section runs only on the page that has its elements. Reads config.js (window.LBDN). */

/* ================= PUBLIC SITE ================= */
(() => {
  const C = window.LBDN, $ = id => document.getElementById(id);
  if (!$('lawsGrid')) return; // not the public page
  const fmt = n => '₦' + Number(n).toLocaleString('en-NG');
  let toastTimer;
  const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); };

  /* ---- API (Google Apps Script). text/plain avoids CORS preflight ---- */
  const api = (action, data = {}) => fetch(C.API_URL, { method: 'POST', body: JSON.stringify({ action, ...data }) }).then(r => r.json());

  /* ---- Static content ---- */
  const LAWS = [ // ✏️ placeholder titles — replace with the real chapter titles
    ['Positioning','M6 3h12M7 6h10M8 6v12M12 6v12M16 6v12M7 18h10M4 21h16'],
    ['Timing','M3 20h5v-4h4v-4h4v-4h5"/><circle cx="19" cy="4.5" r="2'],
    ['Favour','M5 21v-9a7 7 0 0 1 14 0v9M3 21h18M12 5V2.5M6 7L4.5 5.5M18 7l1.5-1.5'],
    ['Value','M4 21v-8a8 8 0 0 1 16 0v8M3 21h18"/><path d="M12 3.5l2.6 4L12 14l-2.6-6.5z" style="fill:#f2b23e;stroke:none'],
    ['Loyalty','M4 21h16M6 21V10h12v11M6 10V6l2 1.4L10 6l2 1.4L14 6l2 1.4L18 6v4M12 21v-6'],
    ['Legacy','M10 21L11 8l1-4.5L13 8l1 13M8 21h8M9.5 8h5']];
  $('lawsGrid').innerHTML = LAWS.map(([n, d], i) => `<div class="law-card reveal"><svg viewBox="0 0 24 24"><path d="${d}"/></svg><div class="num">LAW ${String(i+1).padStart(2,'0')}</div><div class="name">The Law of ${n}</div></div>`).join('')
    + '<div class="more-laws reveal">…and 18 more laws waiting inside.</div>';
  const WA = [['2348109176095','+234 810 917 6095','WhatsApp — orders'],['2348111787247','+234 811 178 7247','WhatsApp — enquiries'],['2348038182013','+234 803 818 2013','WhatsApp — bulk copies']];
  const WA_ICON = '<svg viewBox="0 0 24 24" fill="#25D366"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.3 1.3z"/></svg>';
  $('waGrid').innerHTML = WA.map(([n, t, s]) => `<a class="wa-btn reveal" href="https://wa.me/${n}" target="_blank" rel="noopener">${WA_ICON}<span><span class="n">${t}</span><span class="s">${s}</span></span></a>`).join('');
  const words = ['The Law of Positioning','The Law of Timing','The Law of Favour','The Law of Value','The Law of Loyalty','The Law of Legacy','Leadership','Influence','Purpose','Wisdom','Kingdom Impact','Excellence'].map(w => `<span>${w} <b>✦</b></span>`).join('');
  $('marqueeTrack').innerHTML = words + words;
  $('yr').textContent = new Date().getFullYear();

  /* ---- Hero effects ---- */
  const pc = $('particles');
  for (let i = 0; i < 22; i++){ const s = document.createElement('span'), z = Math.random()*5+2;
    s.style.cssText = `left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${(Math.random()*9+8).toFixed(1)}s;animation-delay:${(-Math.random()*12).toFixed(1)}s;opacity:${(Math.random()*.45+.25).toFixed(2)}`; pc.appendChild(s); }
  /* ---- Author photos: fall back to initials if a photo is missing ---- */
  document.querySelectorAll('.avatar img').forEach(img => {
    const drop = () => img.remove();
    img.addEventListener('error', drop);
    if (img.complete && img.naturalWidth === 0) drop();
  });

  /* ---- Scroll ruler ---- */
  const rl = document.querySelector('.ruler'), rt = $('rulerThumb');
  if (rl){ const upd = () => { const m = document.documentElement.scrollHeight - innerHeight; rt.style.top = ((m > 0 ? scrollY / m : 0) * (rl.clientHeight - 36)) + 'px'; };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd(); }

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return;
    const el = e.target, t = +el.dataset.count, t0 = performance.now();
    (function f(now){ const p = Math.min(1, (now-t0)/1300); el.textContent = Math.round(t*(p<.5?2*p*p:-1+(4-2*p)*p)); if (p<1) requestAnimationFrame(f); })(t0);
    cio.unobserve(el); }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ---- Referral: validated against the Sheet, click counted once per session ---- */
  let ref = null;
  const priceNow = () => fmt(C.PRICE * (Math.max(1, +$('fQty').value || 1)));
  function showRef(name){
    document.querySelectorAll('.price-text').forEach(e => e.textContent = fmt(C.PRICE));
    $('ctaDirect').hidden = true; $('ctaRef').hidden = false; $('stickyBuy').hidden = false;
    $('heroChip').textContent = $('modalRefChip').textContent = 'Referred by ' + name + ' ✓';
    document.body.style.paddingBottom = '64px';
  }
  (async function initRef(){
    const code = (new URLSearchParams(location.search).get('ref') || localStorage.getItem('lbdn_ref') || '').trim().toUpperCase();
    if (!code) return;
    try {
      const r = await api('validateRef', { code });
      if (!r.ok){ localStorage.removeItem('lbdn_ref'); return; }
      ref = code; localStorage.setItem('lbdn_ref', code); showRef(r.name);
      if (!sessionStorage.getItem('lbdn_clicked_' + code)){ sessionStorage.setItem('lbdn_clicked_' + code, '1'); api('click', { code }); }
    } catch (e) { /* offline: leave direct view */ }
  })();

  /* ---- Buy flow ---- */
  const modal = $('buyModal');
  const openBuy = () => { $('buyFormWrap').hidden = false; $('paySuccess').hidden = true; $('payBtn').disabled = false; $('fTotal').textContent = priceNow(); modal.classList.add('open'); };
  const closeBuy = () => modal.classList.remove('open');
  document.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', openBuy));
  $('buyClose').onclick = $('doneBtn').onclick = closeBuy;
  modal.addEventListener('click', e => { if (e.target === modal) closeBuy(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBuy(); });
  $('fQty').addEventListener('input', () => $('fTotal').textContent = priceNow());

  function showResult(ok, reference, msg){
    $('buyFormWrap').hidden = true; $('paySuccess').hidden = false;
    $('successIcon').textContent = ok ? '✓' : '!'; $('successIcon').classList.toggle('warn', !ok);
    $('successTitle').textContent = ok ? 'Order confirmed!' : 'Payment received';
    $('successRef').textContent = reference; if (msg) $('successMsg').textContent = msg;
  }

  $('buyForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!ref) return toast('Please use your marketer\u2019s referral link to buy.');
    if (!window.PaystackPop) return toast('Payment service failed to load. Refresh and try again.');
    const qty = Math.max(1, Math.min(50, parseInt($('fQty').value, 10) || 1));
    const o = { name: $('fName').value.trim(), email: $('fEmail').value.trim(), phone: $('fPhone').value.trim(), qty, ref,
      reference: 'LBDN-' + ref + '-' + Date.now().toString(36).toUpperCase() };
    $('payBtn').disabled = true;
    PaystackPop.setup({
      key: C.PAYSTACK_PUBLIC_KEY, email: o.email, amount: qty * C.PRICE * 100, currency: 'NGN', ref: o.reference,
      metadata: { custom_fields: [{ display_name: 'Referral Code', variable_name: 'referral_code', value: ref }, { display_name: 'Quantity', variable_name: 'qty', value: qty }] },
      callback: () => {
        // Server verifies with Paystack before recording
        api('order', o).then(r => r.ok ? showResult(true, o.reference)
          : showResult(false, o.reference, 'We could not auto-confirm your order. Please WhatsApp us your reference and we will confirm it.'))
          .catch(() => showResult(false, o.reference, 'Confirmation is delayed. Please WhatsApp us your reference and we will confirm it.'));
      },
      onClose: () => { $('payBtn').disabled = false; toast('Payment cancelled'); }
    }).openIframe();
  });
})();


/* ================= ADMIN / MARKETER DASHBOARD ================= */
(() => {
  const C = window.LBDN, $ = id => document.getElementById(id);
  if (!$('loginForm')) return; // not the admin page
  const fmt = n => '₦' + Number(n).toLocaleString('en-NG');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let t, orders = [];
  const toast = m => { const e = $('toast'); e.textContent = m; e.classList.add('show'); clearTimeout(t); t = setTimeout(() => e.classList.remove('show'), 2600); };
  const tok = () => sessionStorage.getItem('lbdn_tok') || '';
  const api = (action, data = {}) => fetch(C.API_URL, { method: 'POST', body: JSON.stringify({ action, token: tok(), ...data }) }).then(r => r.json());
  const link = code => new URL('index.html?ref=' + code, location.href).href;
  const show = ok => { $('login').hidden = ok; $('dash').hidden = !ok; };
  const copy = (txt, msg) => navigator.clipboard.writeText(txt).then(() => toast(msg || 'Copied ✓'), () => prompt('Copy this:', txt));

  async function load(){
    const r = await api('data');
    if (!r.ok){ sessionStorage.removeItem('lbdn_tok'); show(false); if (r.error && r.error !== 'Not signed in') toast(r.error); return; }
    show(true); const admin = r.role === 'admin'; orders = r.orders;
    document.querySelectorAll('.admin-only').forEach(e => e.hidden = !admin);
    document.querySelectorAll('.mkt-only').forEach(e => e.hidden = admin);
    $('dashTitle').textContent = admin ? 'Admin Dashboard' : 'My Referral Dashboard';
    $('who').textContent = 'Signed in as ' + r.username + (admin ? ' (admin)' : ' (marketer)');
    $('sClicks').textContent = r.clicks; $('sSold').textContent = r.sold; $('sRev').textContent = fmt(r.revenue);
    $('sTop').textContent = admin ? r.top : r.code; $('sTopL').textContent = admin ? 'Top marketer' : 'Your code';
    if (!admin) $('myLink').value = link(r.code);
    $('mBody').innerHTML = r.marketers.length ? r.marketers.map(m => `<tr><td><strong>${esc(m.name)}</strong></td><td><code>${esc(m.code)}</code></td>
      <td class="link-cell" title="${esc(link(m.code))}">${esc(link(m.code))}</td><td>${m.clicks}</td><td>${m.sold}</td><td>${fmt(m.revenue)}</td>
      <td><div class="acts"><button class="mini" data-copy="${esc(m.code)}">Copy link</button><button class="mini" data-reset="${esc(m.code)}">Reset password</button><button class="mini danger" data-del="${esc(m.code)}">✕</button></div></td></tr>`).join('')
      : '<tr><td colspan="7" class="empty">No marketers yet.</td></tr>';
    $('oHead').innerHTML = admin ? '<tr><th>Date</th><th>Buyer</th><th>Qty</th><th>Amount</th><th>Referral</th><th>Reference</th><th>Status</th></tr>' : '<tr><th>Date</th><th>Buyer</th><th>Qty</th><th>Amount</th><th>Status</th></tr>';
    $('oTitle').textContent = admin ? 'Recent orders' : 'Your sales';
    const cols = admin ? 7 : 5;
    $('oBody').innerHTML = r.orders.length ? r.orders.map(o => admin
      ? `<tr><td>${new Date(o.ts).toLocaleString()}</td><td>${esc(o.name)}<br><span class="tiny dimmed">${esc(o.email)}</span></td><td>${o.qty}</td><td>${fmt(o.amount)}</td><td><code>${esc(o.ref)}</code></td><td class="link-cell">${esc(o.reference)}</td><td>${esc(o.status)}</td></tr>`
      : `<tr><td>${new Date(o.ts).toLocaleDateString()}</td><td>${esc(o.name)}</td><td>${o.qty}</td><td>${fmt(o.amount)}</td><td>${esc(o.status)}</td></tr>`).join('')
      : `<tr><td colspan="${cols}" class="empty">No orders yet.</td></tr>`;
    return r;
  }
  function creds(r, reset){
    $('credText').textContent = `Hello ${r.name}, your ${reset ? 'new ' : ''}Living by Design Nation referral login:\n\nSign in: ${new URL('admin.html', location.href).href}\nUsername: ${r.code}\nTemporary password: ${r.tempPassword}\n\nYour referral link: ${link(r.code)}\n(Please change your password after signing in.)`;
    $('credBox').hidden = false; $('credBox').scrollIntoView({ behavior: 'smooth' });
  }

  $('loginForm').addEventListener('submit', async e => { e.preventDefault();
    try {
      const r = await api('login', { username: $('uname').value, password: $('pw').value });
      if (!r.ok) return toast(r.error);
      sessionStorage.setItem('lbdn_tok', r.token); $('pw').value = ''; await load();
      if (r.temp){ $('pwPanel').hidden = false; toast('Please set your own password'); }
    } catch (err) { toast('Could not reach server'); } });
  $('logout').onclick = async () => { try { await api('logout'); } catch (e) {} sessionStorage.removeItem('lbdn_tok'); $('credBox').hidden = true; show(false); };
  $('refresh').onclick = () => load().then(() => toast('Refreshed'));
  $('pwToggle').onclick = () => $('pwPanel').hidden = !$('pwPanel').hidden;
  $('pwForm').addEventListener('submit', async e => { e.preventDefault();
    const r = await api('changePassword', { oldPassword: $('oldPw').value, newPassword: $('newPw').value });
    if (r.ok){ $('oldPw').value = $('newPw').value = ''; $('pwPanel').hidden = true; toast('Password updated ✓'); } else toast(r.error); });
  $('addM').onclick = async () => { const n = $('mName').value.trim(); if (!n) return toast('Enter a name first');
    const r = await api('addMarketer', { name: n }); if (r.ok){ $('mName').value = ''; creds(r, false); load(); } else toast(r.error); };
  $('credCopy').onclick = () => copy($('credText').textContent, 'Message copied ✓');
  $('myCopy').onclick = () => copy($('myLink').value, 'Link copied ✓');
  $('mBody').addEventListener('click', async e => {
    const c = e.target.dataset.copy, d = e.target.dataset.del, rs = e.target.dataset.reset;
    if (c) copy(link(c), 'Link copied ✓');
    if (rs && confirm('Reset the password for ' + rs + '?')){ const r = await api('resetPassword', { code: rs }); r.ok ? creds(r, true) : toast(r.error); }
    if (d && confirm('Remove marketer ' + d + '? Their link and login stop working; past sales stay in the Sheet.')){ await api('deleteMarketer', { code: d }); load(); }
  });
  $('csv').onclick = () => { if (!orders.length) return toast('No orders yet');
    const rows = orders.map(o => [new Date(o.ts).toLocaleString(), o.name, o.email, o.phone, o.qty, o.amount, o.ref, o.reference, o.status].map(v => '"' + String(v ?? '').replace(/"/g,'""') + '"').join(','));
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent('Date,Name,Email,Phone,Qty,Amount,Referral,Reference,Status\n' + rows.join('\n')); a.download = 'lbdn-orders.csv'; a.click(); };
  if (tok()) load().catch(() => show(false)); else show(false);
})();

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
  /* ---- Day / night theme (default = device setting; choice is remembered) ---- */
  const root = document.documentElement, meta = document.querySelector('meta[name="theme-color"]');
  const applyTheme = t => { root.dataset.theme = t; if (meta) meta.content = t === 'dark' ? '#0d1322' : '#fff4df'; };
  applyTheme(root.dataset.theme || 'light');
  const tt = $('themeToggle');
  if (tt) tt.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next); try { localStorage.setItem('lbdn_theme', next); } catch (e) {}
  });

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
  const unit = () => C.PRICE + (C.SHIPPING || 0);      // book + delivery, per copy
  const qtyNow = () => Math.max(1, +$('fQty').value || 1);
  const priceNow = () => fmt(unit() * qtyNow());
  const breakNow = () => { const q = qtyNow(); const b = $('fBreak');
    if (b) b.textContent = fmt(C.PRICE) + ' × ' + q + (q > 1 ? ' copies' : ' copy') + ' + ' + fmt(C.SHIPPING || 0) + ' delivery × ' + q; };
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

  /* ---- Delivery location: state → LGA cascade (window.NG_STATES from ng-states.js) ---- */
  const fState = $('fState'), fLga = $('fLga');
  if (fState && window.NG_STATES){
    fState.innerHTML = '<option value="">Select state</option>' + window.NG_STATE_NAMES.map(s => '<option>' + s + '</option>').join('');
    fState.addEventListener('change', () => {
      const lg = window.NG_STATES[fState.value] || [];
      fLga.disabled = !lg.length;
      fLga.innerHTML = '<option value="">' + (lg.length ? 'Select LGA' : 'Select state first') + '</option>' + lg.map(l => '<option>' + l + '</option>').join('');
    });
  }
  const modalSub = $('modalSub');
  if (modalSub) modalSub.textContent = 'The Architecture of Influence · ' + fmt(C.PRICE) + ' + ' + fmt(C.SHIPPING || 0) + ' delivery per copy';

  /* ---- Buy flow ---- */
  const modal = $('buyModal');
  const openBuy = () => { $('buyFormWrap').hidden = false; $('paySuccess').hidden = true; $('payBtn').disabled = false; $('fTotal').textContent = priceNow(); breakNow(); modal.classList.add('open'); };
  const closeBuy = () => modal.classList.remove('open');
  document.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', openBuy));
  $('buyClose').onclick = $('doneBtn').onclick = closeBuy;
  modal.addEventListener('click', e => { if (e.target === modal) closeBuy(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBuy(); });
  $('fQty').addEventListener('input', () => { $('fTotal').textContent = priceNow(); breakNow(); });

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
    if (fState && fLga && (!fState.value || !fLga.value)) return toast('Please select your delivery state and local government.');
    const o = { name: $('fName').value.trim(), email: $('fEmail').value.trim(), phone: $('fPhone').value.trim(), qty, ref,
      state: fState ? fState.value : '', lga: fLga ? fLga.value : '',
      reference: 'LBDN-' + ref + '-' + Date.now().toString(36).toUpperCase() };
    $('payBtn').disabled = true;
    PaystackPop.setup({
      key: C.PAYSTACK_PUBLIC_KEY, email: o.email, amount: qty * (C.PRICE + (C.SHIPPING || 0)) * 100, currency: 'NGN', ref: o.reference,
      metadata: { custom_fields: [{ display_name: 'Referral Code', variable_name: 'referral_code', value: ref }, { display_name: 'Quantity', variable_name: 'qty', value: qty }, { display_name: 'Delivery', variable_name: 'delivery_location', value: (o.state || '—') + ' / ' + (o.lga || '—') }] },
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
  let t, orders = [], lastData = null;
  const toast = m => { const e = $('toast'); e.textContent = m; e.classList.add('show'); clearTimeout(t); t = setTimeout(() => e.classList.remove('show'), 2600); };
  const tok = () => sessionStorage.getItem('lbdn_tok') || '';
  const api = (action, data = {}) => fetch(C.API_URL, { method: 'POST', body: JSON.stringify({ action, token: tok(), ...data }) }).then(r => r.json());
  const link = code => new URL('index.html?ref=' + code, location.href).href;
  const show = ok => { $('login').hidden = ok; $('dash').hidden = !ok; };
  const copy = (txt, msg) => navigator.clipboard.writeText(txt).then(() => toast(msg || 'Copied ✓'), () => prompt('Copy this:', txt));

  /* ---- Day / night theme (shares "lbdn_theme" with the public site) ---- */
  const rootEl = document.documentElement, metaT = document.querySelector('meta[name="theme-color"]');
  const applyTheme = t => { rootEl.dataset.theme = t; if (metaT) metaT.content = t === 'dark' ? '#0b101d' : '#f7f1e3'; };
  applyTheme(rootEl.dataset.theme || 'dark');
  $('themeToggle').addEventListener('click', () => {
    const next = rootEl.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next); try { localStorage.setItem('lbdn_theme', next); } catch (e) {}
  });

  /* ---- Sign-in choreography: staged progress overlay + entrance stagger ---- */
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const overlay = $('authOverlay'), steps = [$('st1'), $('st2'), $('st3')], fill = $('authFill');
  async function runSteps(title, sub, fast){
    $('authTitle').textContent = title; $('authSub').textContent = sub;
    overlay.classList.remove('hide'); overlay.hidden = false;
    fill.style.width = '6%';
    steps.forEach(s => s.classList.remove('active', 'done'));
    await wait(80);
    const d = fast ? 300 : 560;
    for (let i = 0; i < steps.length; i++){
      steps[i].classList.add('active');
      await wait(d);
      steps[i].classList.remove('active'); steps[i].classList.add('done');
      fill.style.width = (38 + i * 31) + '%';
    }
    await wait(fast ? 150 : 300);
  }
  const hideOverlay = () => { overlay.classList.add('hide'); setTimeout(() => { overlay.hidden = true; }, 400); };
  const staggerIn = () => { let i = 0;
    document.querySelectorAll('#dash .stats .stat, #dash .panel').forEach(el => {
      if (el.hidden) return;
      el.classList.remove('enter-item'); void el.offsetWidth;
      el.style.animationDelay = (i++ * 75) + 'ms';
      el.classList.add('enter-item');
    });
  };

  async function loadData_(){
    const r = await api('data');
    if (!r.ok){ sessionStorage.removeItem('lbdn_tok'); show(false); if (r.error && r.error !== 'Not signed in') toast(r.error); return; }
    show(true); const admin = r.role === 'admin'; orders = r.orders; lastData = r;
    document.querySelectorAll('.admin-only').forEach(e => e.hidden = !admin);
    document.querySelectorAll('.mkt-only').forEach(e => e.hidden = admin);
    $('dashTitle').textContent = admin ? 'Admin Dashboard' : 'My Referral Dashboard';
    $('who').textContent = 'Signed in as ' + r.username + (admin ? ' (admin)' : ' (marketer)');
    $('sClicks').textContent = r.clicks;
    $('sSold').textContent = admin ? r.sold : r.monthBooks;
    $('sSoldL').textContent = admin ? 'Books sold' : 'Books sold · this month';
    $('sRev').textContent = fmt(admin ? r.revenue : r.commission);
    $('sRevL').textContent = admin ? 'Revenue' : 'Commission earned · this month';
    $('sTop').textContent = admin ? r.top : fmt(r.allTime ? r.allTime.amount : 0);
    $('sTopL').textContent = admin ? 'Top marketer' : 'Commission · all time';
    $('sTop').style.fontSize = admin ? '19px' : '';
    const revCard = $('sRev').closest('.stat'), revSub = $('sRevSub');
    if (revCard) revCard.classList.toggle('commission', !admin);
    if (revSub){ revSub.hidden = !!admin; revSub.textContent = admin ? '' : 'at ' + fmt(r.rate || 0) + ' per book'; }
    if (!admin){
      $('myLink').value = link(r.code);
      const ts = $('tierStrip');
      if (ts){ ts.hidden = false; ts.innerHTML = tierStripHtml(r.monthBooks || 0, r.tier); }
    }
    $('mBody').innerHTML = r.marketers.length ? r.marketers.map(m => `<tr><td><button class="mlink" data-mk="${esc(m.code)}" type="button" title="View details">${esc(m.name)}</button></td><td><code>${esc(m.code)}</code></td>
      <td class="link-cell" title="${esc(link(m.code))}">${esc(link(m.code))}</td><td>${m.clicks}</td><td>${m.sold}</td><td>${fmt(m.revenue)}</td>
      <td><div class="acts"><button class="mini" data-copy="${esc(m.code)}">Copy link</button><button class="mini" data-reset="${esc(m.code)}">Reset password</button><button class="mini danger" data-del="${esc(m.code)}">✕</button></div></td></tr>`).join('')
      : '<tr><td colspan="7" class="empty">No marketers yet.</td></tr>';
    $('oHead').innerHTML = admin ? '<tr><th>Date</th><th>Buyer</th><th>Qty</th><th>Amount</th><th>Referral</th><th>Reference</th><th>Status</th></tr>' : '<tr><th>Date</th><th>Buyer</th><th>Qty</th><th>Amount</th><th>Commission</th><th>Status</th></tr>';
    $('oTitle').textContent = admin ? 'Recent orders' : 'Your sales';
    const cols = admin ? 7 : 6;
    $('oBody').innerHTML = r.orders.length ? r.orders.map(o => admin
      ? `<tr><td>${new Date(o.ts).toLocaleString()}</td><td>${esc(o.name)}<br><span class="tiny dimmed">${esc(o.email)}</span>${o.state ? `<br><span class="tiny dimmed">${esc(o.state)} · ${esc(o.lga)}</span>` : ''}</td><td>${o.qty}</td><td>${fmt(o.amount)}</td><td><code>${esc(o.ref)}</code></td><td class="link-cell">${esc(o.reference)}</td><td>${esc(o.status)}</td></tr>`
      : `<tr><td>${new Date(o.ts).toLocaleDateString()}</td><td>${esc(o.name)}${o.state ? `<br><span class="tiny dimmed">${esc(o.state)} · ${esc(o.lga)}</span>` : ''}</td><td>${o.qty}</td><td>${fmt(o.amount)}</td><td>${o.status === 'Failed' ? '—' : fmt(o.comm || 0)}</td><td>${esc(o.status)}</td></tr>`).join('')
      : `<tr><td colspan="${cols}" class="empty">No orders yet.</td></tr>`;
    if (!admin && r.needsProfile) openOb(r);
    return r;
  }
  /* tier progress strip (marketer dashboard + admin drill-down) */
  const naira = n => '₦' + Number(n || 0).toLocaleString('en-NG');
  const tierStripHtml = (books, t) => { if (!t) return '';
    const pct = Math.min(100, Math.round(books / t.tierBooks * 100)), left = Math.max(0, t.tierBooks - books);
    return `<div class="bar"><i style="width:${pct}%"></i></div><p><strong>${naira(left ? t.base : t.tierRate)}/book</strong> · ${books} of ${t.tierBooks} books this month · ` +
      (left ? `sell <strong>${left}</strong> more to unlock ${naira(t.tierRate)}/book`
            : `<strong>top tier unlocked</strong> — the whole month pays ${naira(t.tierRate)}/book`) + '. Resets every month.</p>';
  };

  /* ---- onboarding: payout details, prompted after first login ---- */
  const openOb = d => { const p = (d && d.profile) || {};
    $('obEmail').value = p.email || ''; $('obPhone').value = p.phone || '';
    $('obBank').value = p.bank || ''; $('obAcct').value = p.accountNumber || '';
    $('obAcctName').value = p.accountName || (d && d.username) || '';
    $('obModal').hidden = false; };
  $('obSkip').onclick = () => { $('obModal').hidden = true; };
  $('obForm').addEventListener('submit', async e => { e.preventDefault();
    const b = $('obSave'); b.disabled = true;
    try { const r = await api('updateProfile', { email: $('obEmail').value.trim(), phone: $('obPhone').value.trim(),
        bank: $('obBank').value.trim(), accountNumber: $('obAcct').value.trim(), accountName: $('obAcctName').value.trim() });
      if (r.ok){ $('obModal').hidden = true; if (lastData){ lastData.needsProfile = false; lastData.profile = r.profile; } toast('Payout details saved ✓'); }
      else toast(r.error);
    } catch (err) { toast('Could not reach server'); }
    b.disabled = false; });

  /* ---- admin: marketer drill-down modal ---- */
  let mkCode = null;
  async function openMk(code){
    mkCode = code; $('mkModal').hidden = false;
    $('mkName').textContent = '…'; $('mkMeta').textContent = code;
    $('mkStats').innerHTML = ''; $('mkTier').innerHTML = '';
    let d; try { d = await api('marketerDetails', { code }); } catch (e) { d = { ok:false, error:'No connection' }; }
    if (!d.ok){ toast(d.error || 'Could not load details'); $('mkModal').hidden = true; mkCode = null; return; }
    if (mkCode !== code) return;
    $('mkName').textContent = d.name;
    $('mkMeta').textContent = 'Code ' + d.code + (d.active ? '' : ' · deactivated');
    [['Books · this month', d.month.books], ['Earnings · this month', naira(d.month.amount)], ['Rate / book now', naira(d.month.rate)],
     ['Books all-time', d.allTime.books], ['Earnings all-time', naira(d.allTime.amount)], ['Revenue all-time', naira(d.allTime.revenue)],
     ['Referral clicks', d.clicks], ['Payouts recorded', d.payouts.length]]
      .forEach(([l, v]) => { const c = document.createElement('div'); c.className = 'cell'; c.innerHTML = `<b>${v}</b><span>${l}</span>`; $('mkStats').appendChild(c); });
    $('mkTier').innerHTML = tierStripHtml(d.month.books, d.tier);
    const p = d.profile;
    $('mkProfile').innerHTML = p
      ? [['Email', p.email], ['Phone', p.phone], ['Bank', p.bank], ['Account number', p.accountNumber], ['Account name', p.accountName], ['Updated', p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '']]
        .map(([l, v]) => `<div><span>${l}</span><b>${esc(v || '—')}</b></div>`).join('')
      : '<div><span>Payout account</span><b>No details on file yet — onboarding not completed.</b></div>';
    $('mkHist').innerHTML = d.history.length ? d.history.map(h => `<tr><td>${esc(h.month)}</td><td>${h.books}</td><td>${naira(h.rate)}</td><td><strong>${naira(h.amount)}</strong></td></tr>`).join('')
      : '<tr><td colspan="4" class="empty">No sales yet.</td></tr>';
    $('mkPayouts').innerHTML = d.payouts.length ? d.payouts.map(x => `<div class="po-row"><span>${esc(x.month)}</span><b>${x.books} books · ${naira(x.amount)}</b><span class="tiny dimmed">by ${esc(x.markedBy)}</span></div>`).join('')
      : '<p class="tiny dimmed" style="margin:4px 0 0">Nothing marked paid yet.</p>';
    $('mkPaid').disabled = !d.active || !d.month.books;
  }
  $('mkClose').onclick = () => { $('mkModal').hidden = true; mkCode = null; };
  $('mkPaid').onclick = async () => { if (!mkCode) return;
    if (!confirm('Mark ' + mkCode + ' paid for this month?')) return;
    const r = await api('markPaid', { code: mkCode });
    if (r.ok){ toast('Marked paid: ' + r.books + ' books · ' + fmt(r.amount) + ' ✓'); openMk(mkCode); load(); } else toast(r.error); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape'){ $('mkModal').hidden = true; $('obModal').hidden = true; } });
  /* busy wrapper: golden sheen on panels, tables dim, refresh icon spins */
  let busyDepth = 0;
  async function load(){
    busyDepth++; document.body.classList.add('busy');
    const rb = $('refresh'); if (rb) rb.classList.add('busy');
    try { return await loadData_(); }
    finally { if (--busyDepth === 0){ document.body.classList.remove('busy'); const rb2 = $('refresh'); if (rb2) rb2.classList.remove('busy'); } }
  }
  function creds(r, reset){
    $('credText').textContent = `Hello ${r.name}, your ${reset ? 'new ' : ''}Living by Design Nation referral login:\n\nSign in: ${new URL('admin.html', location.href).href}\nUsername: ${r.code}\nTemporary password: ${r.tempPassword}\n\nYour referral link: ${link(r.code)}\n(Please change your password after signing in.)`;
    $('credBox').hidden = false; $('credBox').scrollIntoView({ behavior: 'smooth' });
  }

  let signingIn = false;
  $('loginForm').addEventListener('submit', async e => { e.preventDefault();
    if (signingIn) return; signingIn = true;
    const btn = $('loginBtn'), card = $('login'), orig = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Verifying…';
    const t0 = Date.now(); let r = null, netErr = false;
    try { r = await api('login', { username: $('uname').value, password: $('pw').value }); }
    catch (err) { netErr = true; }
    const elapsed = Date.now() - t0;
    if (netErr || !r || !r.ok){
      await wait(Math.max(0, 700 - elapsed)); // let the spinner breathe before the verdict
      btn.classList.add('error-state'); btn.textContent = netErr ? '✕ No connection' : '✕ Access denied';
      card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 500);
      toast(netErr ? 'Could not reach server' : (r && r.error) || 'Invalid username or password');
      setTimeout(() => { btn.classList.remove('error-state'); btn.innerHTML = orig; btn.disabled = false; }, 1900);
      signingIn = false; return;
    }
    btn.innerHTML = '<span class="spin"></span>Opening…';
    sessionStorage.setItem('lbdn_tok', r.token); $('pw').value = '';
    await wait(Math.max(0, 500 - elapsed));
    const stepsDone = runSteps('Signing you in', 'Secure area · Living by Design Nation');
    const dataDone = load().catch(() => {});
    await Promise.all([stepsDone, dataDone]);
    hideOverlay(); staggerIn();
    if (r.temp){ $('pwPanel').hidden = false; toast('Please set your own password'); } else toast('Welcome back ✓');
    if (lastData && lastData.role === 'marketer' && lastData.needsProfile) openOb(lastData);
    btn.innerHTML = orig; btn.disabled = false; signingIn = false; });
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
    const c = e.target.dataset.copy, d = e.target.dataset.del, rs = e.target.dataset.reset, mk = e.target.dataset.mk;
    if (mk) return openMk(mk);
    if (c) copy(link(c), 'Link copied ✓');
    if (rs && confirm('Reset the password for ' + rs + '?')){ const r = await api('resetPassword', { code: rs }); r.ok ? creds(r, true) : toast(r.error); }
    if (d && confirm('Remove marketer ' + d + '? Their link and login stop working; past sales stay in the Sheet.')){ await api('deleteMarketer', { code: d }); load(); }
  });
  $('reverify').onclick = async () => { const b = $('reverify'); b.disabled = true;
    try { const r = await api('reverify');
      if (r.ok){ toast('Checked ' + r.checked + ' · confirmed ' + r.paid + (r.stillPending ? ' · ' + r.stillPending + ' still pending' : '')); if (r.checked) load(); }
      else toast(r.error);
    } catch (e) { toast('Could not reach server'); }
    b.disabled = false; };
  $('csv').onclick = () => { if (!orders.length) return toast('No orders yet');
    const rows = orders.map(o => [new Date(o.ts).toLocaleString(), o.name, o.email, o.phone, o.qty, o.amount, o.ref, o.reference, o.status, o.state, o.lga].map(v => '"' + String(v ?? '').replace(/"/g,'""') + '"').join(','));
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent('Date,Name,Email,Phone,Qty,Amount,Referral,Reference,Status,State,LGA\n' + rows.join('\n')); a.download = 'lbdn-orders.csv'; a.click(); };
  if (tok()){
    const p = load().catch(() => {});
    Promise.all([p, runSteps('Restoring your session', 'Checking your saved sign-in', true)]).then(() => { hideOverlay(); if (!$('dash').hidden) staggerIn();
      if (lastData && lastData.role === 'marketer' && lastData.needsProfile) openOb(lastData); });
  } else show(false);
})();

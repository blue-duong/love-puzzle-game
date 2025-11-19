// script.js
const data = {
  questions: [
    { q: "Nhờ loại rượu nào mà mình đến được với nhau?", a: ["Sake", "sake", "ruou sake"] },
    { q: "Hồi lúc còn cốt Na đồn a Dương là gì? :)))))", a: ["gay", "bede", "bê đê"] },
    { q: "Cho biết 1 trong nhiều từ mà hai đứa dùng để ẩn dụ để nói với nhau ở chỗ đông người ?", a: ["rán gà", "nướng", "grill", "hầm gà"
    ] },
    { q: "Na lúc lớp 9 đã nói với bạn lớp học kèm lớp tiếng Anh sẽ không bao giờ làm gì?", a: ["son môi", "son moi"] },
    { q: "Chuẩn bị mở món quà bí mật rồi. Na có chịu iu a Blue quài luôn k? :33", a: ["ok", "chịu", "yes", "e iu a", "em yêu anh", "em iu anh"] }
  ],
  finalMessage: `Chúc mừng 1 tháng chúng mình yêu nhau! Mình có lẽ cũng hiểu nhau hơn, yêu nhiều hơn. Chúc cho a và Na sẽ luôn yêu nhau mãi, dự định của 2 đứa sẽ được thuận lợi. A mong rằng sau này sẽ được chăm sóc e, bảo vệ e, là chỗ để e có thể dựa vào. Như a đã nói á, A vẫn luôn ở đây và hướng về Na, nên là Na cứ yên tâm ở anh ha. Yêu e ❤️.
- Blue -`,
  finalAlt:
    "Một trái tim màu hồng pastel trên nền trắng, được ghép từ 5 mảnh, viền đen mảnh; có hiệu ứng lấp lánh nhẹ."
};

const $qText = document.getElementById("question-text");
const $input = document.getElementById("answer-input");
const $submit = document.getElementById("submit-btn");
const $feedback = document.getElementById("feedback");
const $progress = document.getElementById("progress");
const $final = document.getElementById("final-section");
const $restart = document.getElementById("restart-btn");
const $video = document.getElementById("final-video");
const $finalMessage = document.getElementById("final-message");
const $stickyAnniv = document.getElementById("sticky-anniv");
const $helpBtn = document.getElementById("help-btn");
const $helpModal = document.getElementById("help-modal");
const $helpClose = document.querySelector("#help-modal .close");
const $fxLayer = document.getElementById("fx-layer");
const $helpTooltip = document.getElementById("help-tooltip");
const $puzzleVideo = document.getElementById("puzzle-video");
const $puzzleCongrats = document.getElementById("puzzle-congrats");
const $bgNote = document.getElementById("bg-note");
const $noteToggle = document.getElementById("note-toggle");
const $notePanel = document.getElementById("note-panel");
const $noteBody = document.getElementById("note-body");
const $noteClose = document.querySelector("#note-panel .note-close");
const $noteHint = document.getElementById("note-hint");
const $noteInput = document.getElementById("note-input");
const $noteSend = document.getElementById("note-send");
const $noteStatus = document.getElementById("note-status");
const $successModal = document.getElementById("success-modal");
const $successMsg = document.getElementById("success-msg");
const $successClose = document.getElementById("success-close");
const $dimOverlay = document.getElementById("dim-overlay");
const $puzzle = document.querySelector(".puzzle");
const $container = document.querySelector(".container");

const covers = Array.from(document.querySelectorAll(".cover"));
const TOTAL_PIECES = covers.length;
let idx = 0;
let noteTimer;
let fwInterval;
let fwStopTimer;

function normalizeAnswer(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9:\/ ]/g, "");
}

function match(input, accepted) {
  const n = normalizeAnswer(input);
  return accepted.some((a) => {
    const expected = normalizeAnswer(a);
    if (/[:/]/.test(expected)) {
      const cleanExpected = expected.replace(/[^a-z0-9]/g, "");
      const cleanInput = n.replace(/[^a-z0-9]/g, "");
      return cleanInput === cleanExpected;
    }
    return n === expected;
  });
}

function renderQuestion() {
  if (idx >= data.questions.length) return;
  const q = data.questions[idx];
  $qText.textContent = q.q;
  $input.value = "";
  $input.focus();
  $feedback.textContent = "";
  $feedback.className = "feedback";
  $progress.textContent = `Mảnh ghép: ${idx}/${TOTAL_PIECES}`;
}

function revealPiece(pieceIndex) {
  const target = covers.find((c) => c.getAttribute("data-piece") === String(pieceIndex));
  if (target) target.classList.add("revealed");
}

function handleSubmit() {
  if (idx >= data.questions.length) return;
  const q = data.questions[idx];
  const val = $input.value;
  if (!val) {
    $feedback.textContent = "Hãy nhập đáp án nhé!";
    $feedback.className = "feedback err";
    return;
  }
  if (match(val, q.a)) {
    revealPiece(idx + 1);
    idx += 1;
    $feedback.textContent = "Đúng rồi! Mảnh ghép đã khớp.";
    $feedback.className = "feedback ok";
    playCorrectFx();
    $progress.textContent = `Mảnh ghép: ${idx}/${TOTAL_PIECES}`;
    if (idx === TOTAL_PIECES) {
      finishGame();
    } else {
      setTimeout(renderQuestion, 600);
    }
  } else {
    $feedback.textContent = "Sai rồi! Hãy thử lại.";
    $feedback.className = "feedback err";
    playWrongFx();
  }
}

function finishGame() {
  $qText.textContent = "Happy Anniversary! 💖";
  $qText.classList.add('celebrate');
  $input.disabled = true;
  $submit.disabled = true;
  document.querySelector(".puzzle-section").setAttribute("aria-label", data.finalAlt);
  if ($dimOverlay) { $dimOverlay.hidden = false; $dimOverlay.classList.add('show'); }
  if ($puzzle) { $puzzle.classList.add('focus'); }
  if ($container) { $container.classList.add('focus-mode'); }
  launchFireworks();
  setTimeout(() => {
    if ($puzzleVideo) {
      try {
        $puzzleVideo.hidden = false;
        $puzzleVideo.currentTime = 0;
        const p = $puzzleVideo.play();
        if (p && typeof p.then === "function") p.catch(() => {});
      } catch {}
    }
    if ($puzzleCongrats) { $puzzleCongrats.hidden = true; }
    startVideoFireworks();
    if (noteTimer) { clearTimeout(noteTimer); }
    noteTimer = setTimeout(() => { showNoteHint(); }, 20000);
  }, 1000);
}

function playCorrectFx() {
  if ($fxLayer) {
    spawnHearts(12, false);
  }
  playCorrectSound();
}
function playWrongFx() {
  const row = document.querySelector('.input-row');
  if (row) { row.classList.add('shake'); setTimeout(() => row.classList.remove('shake'), 420); }
  if ($fxLayer) {
    spawnHearts(6, true);
  }
  playWrongSound();
}
function spawnHearts(n = 10, broken = false) {
  const box = document.querySelector('.input-row')?.getBoundingClientRect();
  const cx = (box?.left || window.innerWidth/2) + (box?.width || 0)/2 + window.scrollX;
  const cy = (box?.top || window.innerHeight/2) + (box?.height || 0)*0.5 + window.scrollY - 6;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('span');
    el.className = 'fx-heart' + (broken ? ' broken' : '');
    const dx = (Math.random() - 0.5) * 120;
    const dy = -60 - Math.random() * 90;
    el.style.left = `${cx + (Math.random()-0.5)*60}px`;
    el.style.top = `${cy + (Math.random()-0.5)*14}px`;
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);
    $fxLayer.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

function launchFireworks() {
  const box = document.querySelector('.puzzle')?.getBoundingClientRect();
  const x = (box?.left || 0) + (box?.width || 0)/2 + window.scrollX;
  const y = (box?.top || 0) + (box?.height || 0)*0.35 + window.scrollY;
  fireworkBurst(x, y, 28);
  setTimeout(() => fireworkBurst(x, y + 40, 24), 300);
  setTimeout(() => fireworkBurst(x - 60, y + 20, 20), 520);
  setTimeout(() => fireworkBurst(x + 60, y + 20, 20), 740);
}
function fireworkBurst(x, y, count = 24) {
  if (!$fxLayer) return;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'firework-dot';
    const ang = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 140;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.setProperty('--fxdx', `${dx}px`);
    dot.style.setProperty('--fxdy', `${dy}px`);
    $fxLayer.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }
}

function startVideoFireworks() {
  stopVideoFireworks();
  const target = ($video && !$video.hidden) ? $video : (($puzzleVideo && !$puzzleVideo.hidden) ? $puzzleVideo : document.querySelector('.puzzle'));
  const emit = () => {
    const box = target?.getBoundingClientRect();
    if (!box) return;
    const midX = (box.left + box.width/2) + window.scrollX;
    const midY = (box.top + box.height/2) + window.scrollY;
    const marginX = Math.max(20, Math.min(120, box.width * 0.12));
    const marginY = Math.max(20, Math.min(120, box.height * 0.12));
    const topY = box.top + window.scrollY - marginY;
    const bottomY = box.bottom + window.scrollY + marginY;
    const leftX = box.left + window.scrollX - marginX;
    const rightX = box.right + window.scrollX + marginX;
    fireworkBurst(midX, topY, 16);
    fireworkBurst(midX, bottomY, 16);
    fireworkBurst(leftX, midY, 14);
    fireworkBurst(rightX, midY, 14);
    fireworkBurst(leftX, topY, 12);
    fireworkBurst(rightX, topY, 12);
    fireworkBurst(leftX, bottomY, 12);
    fireworkBurst(rightX, bottomY, 12);
  };
  emit();
  fwInterval = setInterval(emit, 900);
}
function stopVideoFireworks() {
  if (fwInterval) { clearInterval(fwInterval); fwInterval = null; }
  if (fwStopTimer) { clearTimeout(fwStopTimer); fwStopTimer = null; }
}
let audioCtx;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function beep(freq, dur, type = 'sine', vol = 0.06) {
  ensureAudio();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(audioCtx.destination);
  g.gain.setValueAtTime(vol, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
  o.start();
  o.stop(audioCtx.currentTime + dur);
}
function playCorrectSound() {
  beep(880, 0.12, 'triangle', 0.08);
  setTimeout(() => beep(1320, 0.12, 'triangle', 0.06), 100);
}
function playWrongSound() {
  beep(220, 0.18, 'sawtooth', 0.05);
}

function saveTxt(name, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function showSuccess(msg) {
  if ($successModal) {
    if ($successMsg) $successMsg.textContent = msg;
    $successModal.hidden = false;
  }
}
function ghRepoInfo() {
  const host = location.hostname;
  const owner = (host.split('.')[0] || '').trim();
  const parts = location.pathname.split('/').filter(Boolean);
  const repo = (parts[0] || '').trim();
  return { owner, repo };
}
function openIssueOnGitHub(title, body) {
  const { owner, repo } = ghRepoInfo();
  if (!owner || !repo) return false;
  const url = `https://github.com/${owner}/${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  try { window.open(url, '_blank'); return true; } catch { return false; }
}
function handleNoteSend() {
  const msg = ($noteInput?.value || '').trim();
  if (!msg) {
    if ($noteStatus) { $noteStatus.textContent = 'Hãy viết điều gì đó nhé'; $noteStatus.style.color = '#c1164f'; }
    playWrongSound();
    return;
  }
  const now = new Date();
  const pad = (n)=> String(n).padStart(2,'0');
  const fname = `loi_nhan_den_Blue_${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.txt`;
  const content = `To: Blue\nTime: ${now.toLocaleString()}\n\n${msg}\n`;
  saveTxt(fname, content);
  const issued = openIssueOnGitHub('Lời nhắn từ site', content);
  if ($noteStatus) { $noteStatus.textContent = issued ? 'Đã mở trang tạo Issue trên GitHub' : 'Đã tạo file TXT'; $noteStatus.style.color = '#0b8f4c'; }
  showSuccess(issued ? 'Mở trang tạo Issue trên GitHub 💖' : 'Đã gửi lời nhắn thành công 💖');
  playCorrectFx();
}

function showNoteHint() {
  if ($bgNote) {
    $bgNote.hidden = false;
    if ($noteBody) { try { $noteBody.textContent = data.finalMessage || 'Lời nhắn yêu thương 💌'; } catch {} }
    if ($noteToggle) { $noteToggle.classList.add('pulse'); }
    if ($noteHint) { $noteHint.hidden = false; }
  }
}

function restart() {
  idx = 0;
  covers.forEach((c) => c.classList.remove("revealed"));
  $final.hidden = true;
  $input.disabled = false;
  $submit.disabled = false;
  if ($finalMessage) $finalMessage.hidden = true;
  if ($video) {
    try { $video.pause(); $video.currentTime = 0; $video.hidden = true; } catch {}
  }
  if ($puzzleVideo) {
    try { $puzzleVideo.pause(); $puzzleVideo.currentTime = 0; $puzzleVideo.hidden = true; } catch {}
  }
  if ($puzzleCongrats) $puzzleCongrats.hidden = true;
  if ($bgNote) $bgNote.hidden = true;
  if ($notePanel) $notePanel.classList.remove('show');
  if ($noteToggle) $noteToggle.classList.remove('pulse');
  if ($noteHint) $noteHint.hidden = true;
  if ($successModal) $successModal.hidden = true;
  if ($dimOverlay) { $dimOverlay.classList.remove('show'); $dimOverlay.hidden = true; }
  if ($puzzle) { $puzzle.classList.remove('focus'); }
  if ($container) { $container.classList.remove('focus-mode'); }
  stopVideoFireworks();
  if (noteTimer) { clearTimeout(noteTimer); noteTimer = null; }
  renderQuestion();
}
(function setupStickyAnniv(){
  const header = document.querySelector('.site-header');
  if (!$stickyAnniv || !header) return;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (e && e.isIntersecting) {
        $stickyAnniv.hidden = true;
        $stickyAnniv.classList.remove('show');
      } else {
        $stickyAnniv.hidden = false;
        $stickyAnniv.classList.add('show');
      }
    }, { root: null, threshold: 0 });
    io.observe(header);
  } else {
    const onScroll = () => {
      const rect = header.getBoundingClientRect();
      if (rect.bottom <= 0) { $stickyAnniv.hidden = false; $stickyAnniv.classList.add('show'); }
      else { $stickyAnniv.hidden = true; $stickyAnniv.classList.remove('show'); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();


$submit.addEventListener("click", handleSubmit);
$input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});
$restart.addEventListener("click", restart);
if ($helpBtn && $helpModal) {
  const openGuide = () => {
    $helpModal.hidden = false;
    if ($helpTooltip) $helpTooltip.hidden = true;
    $helpBtn.classList.remove('pulse');
    try { localStorage.setItem('guideHintSeen','1'); } catch {}
  };
  $helpBtn.addEventListener('click', openGuide);
  if ($helpTooltip) $helpTooltip.addEventListener('click', openGuide);
  if ($helpClose) $helpClose.addEventListener('click', () => { $helpModal.hidden = true; });
  $helpModal.addEventListener('click', (e) => { if (e.target === $helpModal) $helpModal.hidden = true; });
}

renderQuestion();

if ($successClose && $successModal) {
  $successClose.addEventListener('click', () => { $successModal.hidden = true; });
}

if ($noteToggle && $notePanel) {
  const openPanel = () => {
    if ($notePanel.hidden) $notePanel.hidden = false;
    $notePanel.classList.add('show');
    if ($noteToggle) $noteToggle.classList.remove('pulse');
    if ($noteHint) $noteHint.hidden = true;
  };
  $noteToggle.addEventListener('click', openPanel);
  if ($noteClose) $noteClose.addEventListener('click', () => {
    $notePanel.classList.remove('show');
    setTimeout(() => { $notePanel.hidden = true; }, 280);
  });
  if ($noteSend) $noteSend.addEventListener('click', handleNoteSend);
}

(function initHelpHint(){
  if ($helpTooltip && $helpBtn) {
    let seen = false;
    try { seen = localStorage.getItem('guideHintSeen') === '1'; } catch {}
    if (!seen) { $helpTooltip.hidden = false; $helpBtn.classList.add('pulse'); }
  }
})();
function spawnSparkle() {
  const s = document.createElement("div");
  s.className = "sparkle";
  s.style.left = Math.random() * window.innerWidth + "px";
  s.style.top = Math.random() * window.innerHeight + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 3000);
}
setInterval(spawnSparkle, 220);


/* ===================== */
/* CUTE FLOATING ICONS   */
/* ===================== */
const cuteIcons = ["💖", "✨", "🌸", "💗"];
function spawnCuteIcon() {
  const el = document.createElement("div");
  el.className = "floating-icon";
  el.textContent = cuteIcons[Math.floor(Math.random() * cuteIcons.length)];
  el.style.left = Math.random() * window.innerWidth + "px";
  el.style.top = Math.random() * window.innerHeight + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}
setInterval(spawnCuteIcon, 4800);


/* ===================== */
/* PINK SNOW             */
/* ===================== */
function spawnSnow() {
  const n = document.createElement("div");
  n.className = "snow";
  n.style.left = Math.random() * window.innerWidth + "px";
  n.style.top = "-10px";
  n.style.opacity = Math.random() * 0.8 + 0.2;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 6000);
}
setInterval(spawnSnow, 180);


/* ===================== */
/* UI CLICK SOUND        */
/* ===================== */
document.addEventListener("click", () => {
  try { beep(600, 0.05, "sine", 0.03); } catch {}
});


/* ===================== */
/* FINAL TYPEWRITER      */
/* ===================== */
function applyTypewriter() {
  if ($finalMessage) {
    $finalMessage.classList.add("typewriter");
  }
}

/* Override finishGame để thêm glow + typewriter */
const oldFinish = finishGame;
finishGame = function () {
  oldFinish();  
  setTimeout(applyTypewriter, 300);

  // thêm hiệu ứng glow cho video
  if ($video) $video.classList.add("glow");
};
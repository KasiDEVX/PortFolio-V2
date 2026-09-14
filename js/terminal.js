
/* ==================================================
   SECRET KASI TERMINAL CONTROLLER (Type 'KASI')
================================================== */
let isTerminalOpen = false;

function openTerminal() {
  const modal = document.getElementById('kasi-terminal');
  const input = document.getElementById('terminal-input');
  if (!modal) return;

  isTerminalOpen = true;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  if (input) {
    setTimeout(() => {
      input.focus({ preventScroll: true });
      const body = document.getElementById('terminal-body');
      if (body && !body.querySelector('.term-entry')) {
        body.scrollTop = 0;
      }
    }, 80);
  }
}

function closeTerminal() {
  const modal = document.getElementById('kasi-terminal');
  if (!modal) return;

  isTerminalOpen = false;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function initSecretTerminal() {
  const modal = document.getElementById('kasi-terminal');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const body = document.getElementById('terminal-body');
  const closeBtn = document.getElementById('terminal-close-btn');
  const closeDot = document.getElementById('terminal-close-dot');
  const backdrop = document.getElementById('terminal-backdrop');
  const footerBrandStage = document.getElementById('footer-brand-stage');
  const headerClock = document.getElementById('terminal-clock');
  const promptClock = document.getElementById('term-live-time');
  const uptimeEl = document.getElementById('rice-uptime');
  if (!modal || !form || !input) return;

  // Live Rice Terminal Clocks
  const updateTerminalClocks = () => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    if (headerClock) headerClock.textContent = formatted;
    if (promptClock) promptClock.textContent = formatted;

    // Dynamic session uptime
    if (uptimeEl && window.performance) {
      const sec = Math.floor(performance.now() / 1000);
      const m = Math.floor(sec / 60);
      const h = Math.floor(m / 60);
      const remainingM = m % 60;
      if (h > 0) {
        uptimeEl.textContent = `${h} hour${h > 1 ? 's' : ''}, ${remainingM} min${remainingM !== 1 ? 's' : ''}`;
      } else {
        uptimeEl.textContent = `${m} min${m !== 1 ? 's' : ''}, ${sec % 60} secs`;
      }
    }
  };

  updateTerminalClocks();
  setInterval(updateTerminalClocks, 5000);

  // Key buffer listening for "kasi" anywhere on desktop
  let keyBuffer = '';
  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const isFormEl = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && activeEl !== input;

    if (!isFormEl && !isTerminalOpen && e.key && e.key.length === 1) {
      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-4);
      if (keyBuffer === 'kasi') {
        openTerminal();
        keyBuffer = '';
      }
    }

    if (isTerminalOpen && e.key === 'Escape') {
      closeTerminal();
    }
  });

  // Footer KASI Wordmark Direct Launch Trigger
  if (footerBrandStage) {
    footerBrandStage.addEventListener('click', (e) => {
      e.preventDefault();
      openTerminal();
    });

    footerBrandStage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openTerminal();
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  if (closeDot) closeDot.addEventListener('click', closeTerminal);
  if (backdrop) backdrop.addEventListener('click', closeTerminal);

  const executeCommand = (cmdText) => {
    const cleanCmd = (cmdText || '').trim().toLowerCase();
    if (!cleanCmd) return;

    let response = '';

    switch (cleanCmd) {
      case 'help':
        response = "Available commands:\n  projects  - View featured case studies\n  about     - Developer bio and philosophy\n  skills    - Core disciplines & technical toolkit\n  contact   - Direct channels & email\n  sasageyo  - Attack on Titan Survey Corps salute\n  fetch     - Display system info & rice stats\n  clear     - Wipe terminal output\n  exit      - Close this terminal session";
        break;
      case 'projects':
        response = "→ 06 Projects / 02 Flagships available.\nScrolling background to #work section...";
        const workSec = document.getElementById('work');
        if (workSec) workSec.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'about':
        response = "→ Kasi Vishwanathan P\nComputer Science & Business Systems @ Ramco Institute of Technology.\nBased in Tenkasi, Tamil Nadu.\n\"I refine. I remove. I rebuild.\"";
        break;
      case 'skills':
        response = "→ Technical Matrix:\nFrontend: HTML5, CSS3, Modern JS, GSAP, Responsive Layouts\nEngineering: Node.js, Express, Python, Git, Clean Architecture\nDesign: Interaction Design, Typography, Glassmorphic Aesthetics";
        break;
      case 'contact':
        response = "→ Email: kasi.offcl@gmail.com\nLocation: Tenkasi, Tamil Nadu, India\nGitHub: github.com/KasiDEVX\nLinkedIn: linkedin.com/in/kasivishwanathanp";
        break;
      case 'sasageyo':
      case 'aot':
      case 'shingeki':
      case 'titan':
        response = "心臓を捧げよ! (SHINZOU WO SASAGEYO!)\nSurvey Corps // 調査兵団 — Wings of Freedom [自由の翼]\n\"If you win, you live. If you lose, you die. If you don't fight, you can't win.\"\nArchitected with passion, courage, and relentless precision.";
        break;
      case 'fetch':
      case 'neofetch':
      case 'fastfetch':
        response = "→ Kasi Vishwanathan // Developer Profile\nRole: Frontend Engineer & UI Designer\nStack: Modern JS, React, GSAP, Node.js\nWorks: 06 Featured Projects / 02 Flagships (SkillForge & GitInsight)\nCredentials: Meta Frontend, AWS, Cisco, NPTEL\nLocation: Tenkasi, Tamil Nadu, India\nStatus: Available for High-Impact Roles • Zero Bloat.";
        break;
      case 'clear':
        if (output) output.innerHTML = '';
        input.value = '';
        return;
      case 'exit':
      case 'quit':
        closeTerminal();
        return;
      default:
        response = `Command not recognized: "${cleanCmd}". Type 'help' for available actions.`;
    }

    if (output) {
      const entry = document.createElement('div');
      entry.className = 'term-entry';
      entry.innerHTML = `
        <span class="term-entry-cmd">&gt; ${cleanCmd}</span>
        <span class="term-entry-resp">${response}</span>
      `;
      output.appendChild(entry);
      if (body) {
        body.scrollTop = body.scrollHeight;
      }
    }

    if (cleanCmd && (commandHistory.length === 0 || commandHistory[0] !== cleanCmd)) {
      commandHistory.unshift(cleanCmd);
    }
    historyIndex = -1;
    tabMatches = [];
    tabIndex = -1;
    tabPrefix = '';
    input.value = '';
  };

  // Tab Autocomplete & Shell History
  const AUTOCOMPLETE_COMMANDS = [
    'projects',
    'about',
    'skills',
    'contact',
    'sasageyo',
    'fetch',
    'help',
    'clear',
    'exit'
  ];

  let tabMatches = [];
  let tabIndex = -1;
  let tabPrefix = '';
  const commandHistory = [];
  let historyIndex = -1;

  // Reset tab cycle on input edit
  input.addEventListener('input', () => {
    tabMatches = [];
    tabIndex = -1;
    tabPrefix = '';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      const rawVal = input.value.trim().toLowerCase();

      // If starting new tab cycle or current value isn't the active cycle item
      if (tabMatches.length === 0 || rawVal !== tabMatches[tabIndex]) {
        tabPrefix = rawVal;
        tabMatches = AUTOCOMPLETE_COMMANDS.filter(cmd => cmd.startsWith(tabPrefix));
        tabIndex = 0;
      } else {
        // Cycling through matches
        tabIndex = (tabIndex + 1) % tabMatches.length;
      }

      if (tabMatches.length > 0) {
        input.value = tabMatches[tabIndex];
        input.setSelectionRange(input.value.length, input.value.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (commandHistory.length > 0) {
        e.preventDefault();
        if (historyIndex + 1 < commandHistory.length) {
          historyIndex++;
          input.value = commandHistory[historyIndex];
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex > 0) {
        e.preventDefault();
        historyIndex--;
        input.value = commandHistory[historyIndex];
        input.setSelectionRange(input.value.length, input.value.length);
      } else if (historyIndex === 0) {
        e.preventDefault();
        historyIndex = -1;
        input.value = '';
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    executeCommand(input.value);
  });

  const chips = modal.querySelectorAll('.term-chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) executeCommand(cmd);
    });
  });
}

initSecretTerminal();

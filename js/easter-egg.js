/* ==================================================
   DEVTOOLS CONSOLE SIGNATURE & HELPER API
================================================== */
function initDevToolsEasterEgg() {
  const brandStyle = 'color: #c8a96e; font-family: monospace; font-size: 13px; font-weight: bold; line-height: 1.25;';
  const subtitleStyle = 'color: #f3eedb; font-family: system-ui, sans-serif; font-size: 13px; font-weight: 600; padding: 4px 0;';
  const hintStyle = 'color: #38bdf8; font-family: system-ui, sans-serif; font-size: 11px; padding: 2px 0;';
  const apiStyle = 'color: #10b981; font-family: monospace; font-size: 11px;';

  const asciiBanner = [
    "",
    " _  __     _    ____ ___ ",
    "| |/ /__ _| |__/ ___|_ _|",
    "| ' // _` | __/\\___ \\| | ",
    "| . \\ (_| | |__ ___) | | ",
    "|_|\\_\\__,_|\\__|____/|___|",
    ""
  ].join("\n").replace("_`", "_'");

  console.log("%c" + asciiBanner, brandStyle);

  console.log('%cCrafted with precision by Kasi Vishwanathan — Tenkasi, Tamil Nadu', subtitleStyle);
  console.log('%cPssst... type "KASI" on your keyboard anywhere on the page to launch terminal.', hintStyle);
  console.log('%cExposed Dev API: try running %ckasi.terminal()%c, %ckasi.projects()%c, or %ckasi.hireMe()',
    'color: rgba(255,255,255,0.7); font-size: 11px;',
    apiStyle,
    'color: rgba(255,255,255,0.7); font-size: 11px;',
    apiStyle,
    'color: rgba(255,255,255,0.7); font-size: 11px;',
    apiStyle
  );

  window.kasi = {
    terminal: () => {
      openTerminal();
      return 'Terminal launched.';
    },
    projects: () => {
      const work = document.getElementById('work');
      if (work) work.scrollIntoView({ behavior: 'smooth' });
      return 'Showing 6 featured projects & 2 flagships.';
    },
    about: () => 'Kasi Vishwanathan — Computer Science & Business Systems @ RIT.',
    skills: () => [
      'HTML5', 'CSS3', 'JavaScript (ES6+)', 'GSAP & ScrollTrigger',
      'React', 'Node.js', 'Express', 'Python', 'PostgreSQL', 'UI/UX Design'
    ],
    hireMe: () => {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth' });
      return 'Navigating to contact form. Let\'s build together!';
    }
  };
}

initDevToolsEasterEgg();

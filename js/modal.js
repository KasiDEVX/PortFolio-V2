const projectModal = document.getElementById('project-modal');
const projectModalClose = document.getElementById('project-modal-close');
const projectModalImage = document.getElementById('project-modal-image');
const projectModalLabel = document.getElementById('project-modal-label');
const projectModalTitle = document.getElementById('project-modal-title');
const projectModalDesc = document.getElementById('project-modal-desc');
const projectModalTech = document.getElementById('project-modal-tech');

const projectModalProblem = document.getElementById('project-modal-problem');
const projectModalRole = document.getElementById('project-modal-role');
const projectModalResult = document.getElementById('project-modal-result');
const caseBlockProblem = document.getElementById('case-block-problem');
const caseBlockRole = document.getElementById('case-block-role');
const caseBlockResult = document.getElementById('case-block-result');

function openProjectModal(card) {
  if (!projectModal || !projectModalImage || !projectModalTitle) return;
  const image = card.dataset.projectImage || '';
  const title = card.dataset.projectTitle || '';
  const label = card.dataset.projectLabel || '';
  const desc = card.dataset.projectDesc || '';
  const tech = (card.dataset.projectTech || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const problem = card.dataset.projectProblem || '';
  const role = card.dataset.projectRole || '';
  const result = card.dataset.projectResult || '';

  projectModalImage.src = image;
  projectModalImage.alt = `${title} project image`;
  if (projectModalLabel) projectModalLabel.textContent = label;
  if (projectModalTitle) projectModalTitle.textContent = title;
  if (projectModalDesc) projectModalDesc.textContent = desc;

  const caseStudyContainer = projectModal.querySelector('.project-modal-case-study');
  if (caseStudyContainer) caseStudyContainer.style.display = '';

  if (projectModalProblem && caseBlockProblem) {
    if (problem) { projectModalProblem.textContent = problem; caseBlockProblem.style.display = 'block'; }
    else caseBlockProblem.style.display = 'none';
  }
  if (projectModalRole && caseBlockRole) {
    if (role) { projectModalRole.textContent = role; caseBlockRole.style.display = 'block'; }
    else caseBlockRole.style.display = 'none';
  }
  if (projectModalResult && caseBlockResult) {
    if (result) { projectModalResult.textContent = result; caseBlockResult.style.display = 'block'; }
    else caseBlockResult.style.display = 'none';
  }

  if (projectModalTech) {
    projectModalTech.innerHTML = '';
    if (tech.length) {
      projectModalTech.style.display = 'flex';
      tech.forEach((item) => {
        const badge = document.createElement('span');
        badge.textContent = item;
        projectModalTech.appendChild(badge);
      });
    } else {
      projectModalTech.style.display = 'none';
    }
  }

  const liveLink = card.dataset.liveLink || '';
  const liveBtn = document.getElementById('project-modal-live');
  if (liveBtn) {
    if (liveLink) {
      liveBtn.href = liveLink;
      liveBtn.style.display = 'inline-flex';
    } else {
      liveBtn.style.display = 'none';
    }
  }

  const githubLink = card.dataset.githubLink || '';
  const githubBtn = document.getElementById('project-modal-github');
  if (githubBtn) {
    if (githubLink) {
      githubBtn.href = githubLink;
      githubBtn.style.display = 'inline-flex';
    } else {
      githubBtn.style.display = 'none';
    }
  }

  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const focusable = projectModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();

    if (currentTrapFocusHandler) {
      projectModal.removeEventListener('keydown', currentTrapFocusHandler);
    }

    currentTrapFocusHandler = function trapFocus(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    projectModal.addEventListener('keydown', currentTrapFocusHandler);
  }
}

let currentTrapFocusHandler = null;

function closeProjectModal() {
  if (!projectModal || !projectModalImage) return;
  if (currentTrapFocusHandler) {
    projectModal.removeEventListener('keydown', currentTrapFocusHandler);
    currentTrapFocusHandler = null;
  }
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    projectModalImage.src = '';
  }, 250);
}

document.querySelectorAll('.work-card').forEach((card) => {
  if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Open project: ${card.dataset.projectTitle || 'Project'}`);
  card.addEventListener('click', () => openProjectModal(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(card);
    }
  });
});

function openCertificateModal(card) {
  if (!projectModal || !projectModalImage || !projectModalTitle) return;
  const imageEl = card.querySelector('img');
  const nameEl = card.querySelector('.cert-name');
  const descEl = card.querySelector('.cert-desc');
  const image = card.dataset.lightbox || imageEl?.getAttribute('src') || '';
  const title = nameEl?.textContent?.trim() || 'Certificate';
  const desc = descEl?.textContent?.trim() || '';

  projectModalImage.src = image;
  projectModalImage.alt = `${title} certificate image`;
  if (projectModalLabel) projectModalLabel.textContent = 'Certificate';
  if (projectModalTitle) projectModalTitle.textContent = title;
  if (projectModalDesc) projectModalDesc.textContent = desc;
  if (projectModalTech) {
    projectModalTech.innerHTML = '';
    projectModalTech.style.display = 'none';
  }

  if (caseBlockProblem) caseBlockProblem.style.display = 'none';
  if (caseBlockRole) caseBlockRole.style.display = 'none';
  if (caseBlockResult) caseBlockResult.style.display = 'none';

  const caseStudyContainer = projectModal.querySelector('.project-modal-case-study');
  if (caseStudyContainer) caseStudyContainer.style.display = 'none';

  const githubBtn = document.getElementById('project-modal-github');
  if (githubBtn) githubBtn.style.display = 'none';

  const liveBtn = document.getElementById('project-modal-live');
  if (liveBtn) liveBtn.style.display = 'none';

  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

if (projectModalClose) {
  projectModalClose.addEventListener('click', closeProjectModal);
}
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });
}

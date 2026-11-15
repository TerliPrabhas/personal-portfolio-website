document.addEventListener('DOMContentLoaded', () => {
  // State
  let dsaProblems = [];
  let activeDsaTopic = 'All';

  // DOM Elements
  const typingElement = document.getElementById('typingElement');
  const educationTimeline = document.getElementById('educationTimeline');
  const projectsGrid = document.getElementById('projectsGrid');
  const dsaTopicChips = document.getElementById('dsaTopicChips');
  const dsaSearchInput = document.getElementById('dsaSearchInput');
  const dsaGrid = document.getElementById('dsaGrid');
  const jdInput = document.getElementById('jdInput');
  const evaluateJdBtn = document.getElementById('evaluateJdBtn');
  const presetJdBtn = document.getElementById('presetJdBtn');
  const evalResultCard = document.getElementById('evalResultCard');
  const matchPercentNum = document.getElementById('matchPercentNum');
  const evalTailoredPitch = document.getElementById('evalTailoredPitch');
  const matchingSkillsChips = document.getElementById('matchingSkillsChips');

  // Contact Form DOM
  const contactForm = document.getElementById('contactForm');
  const contactName = document.getElementById('contactName');
  const contactEmail = document.getElementById('contactEmail');
  const contactSubject = document.getElementById('contactSubject');
  const contactMessage = document.getElementById('contactMessage');
  const sendMsgBtn = document.getElementById('sendMsgBtn');

  // AI Drawer DOM
  const openAiChatBtn = document.getElementById('openAiChatBtn');
  const heroAiChatBtn = document.getElementById('heroAiChatBtn');
  const aiDrawerOverlay = document.getElementById('aiDrawerOverlay');
  const closeAiBtn = document.getElementById('closeAiBtn');
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatInput = document.getElementById('aiChatInput');
  const sendAiBtn = document.getElementById('sendAiBtn');
  const aiQuickPrompts = document.getElementById('aiQuickPrompts');
  const toastContainer = document.getElementById('toastContainer');

  // Initialize
  initTypingEffect();
  fetchProfile();
  fetchProjects();
  fetchDsaProblems();
  setupEventListeners();

  // ==========================================
  // TYPING EFFECT
  // ==========================================
  function initTypingEffect() {
    const words = [
      "Full-Stack MERN Platforms",
      "250+ LeetCode DSA Solutions",
      "Generative AI Agent Systems",
      "Interactive 60 FPS Web Apps"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 1800; // pause at word end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }

    type();
  }

  // ==========================================
  // FETCH PROFILE & EDUCATION
  // ==========================================
  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success && data.profile.education) {
        renderEducation(data.profile.education);
      }
    } catch (err) {
      console.error("Profile load error:", err);
    }
  }

  function renderEducation(educationList) {
    educationTimeline.innerHTML = educationList.map(edu => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-period">${edu.period}</div>
          <h3>${edu.degree}</h3>
          <h4>${edu.institution} &bull; <strong>${edu.score}</strong></h4>
          <p>${edu.highlights}</p>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // FETCH FEATURED PROJECTS
  // ==========================================
  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        renderProjects(data.projects);
      }
    } catch (err) {
      console.error("Projects load error:", err);
    }
  }

  function renderProjects(projects) {
    projectsGrid.innerHTML = projects.map(proj => `
      <div class="project-card">
        <span class="project-badge"><i class="fa-solid fa-code-commit"></i> ${proj.category}</span>
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
        
        <ul class="project-highlights">
          ${proj.highlights.map(h => `<li><i class="fa-solid fa-circle-check"></i> <span>${h}</span></li>`).join('')}
        </ul>

        <div class="project-tech-tags">
          ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <div class="project-links">
          <a href="${proj.demoUrl}" target="_blank" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo (${proj.demoUrl.split(':').pop()})
          </a>
          <a href="${proj.github}" target="_blank" class="btn btn-secondary btn-sm">
            <i class="fa-brands fa-github"></i> Codebase
          </a>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // FETCH LEETCODE DSA PROBLEMS
  // ==========================================
  async function fetchDsaProblems() {
    try {
      const res = await fetch('/api/dsa');
      const data = await res.json();
      if (data.success) {
        dsaProblems = data.problems;
        renderDsaTopics();
        renderDsaGrid(dsaProblems);
      }
    } catch (err) {
      console.error("DSA catalog load error:", err);
    }
  }

  function renderDsaTopics() {
    const topics = ["All", ...new Set(dsaProblems.map(p => p.topic))];
    dsaTopicChips.innerHTML = topics.map(t => `
      <button class="dsa-chip ${t === activeDsaTopic ? 'active' : ''}" data-topic="${t}">
        ${t}
      </button>
    `).join('');

    dsaTopicChips.querySelectorAll('.dsa-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeDsaTopic = btn.dataset.topic;
        dsaTopicChips.querySelectorAll('.dsa-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterDsaGrid();
      });
    });
  }

  function filterDsaGrid() {
    const q = dsaSearchInput.value.trim().toLowerCase();
    let filtered = dsaProblems;

    if (activeDsaTopic !== 'All') {
      filtered = filtered.filter(p => p.topic.toLowerCase() === activeDsaTopic.toLowerCase());
    }

    if (q) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q));
    }

    renderDsaGrid(filtered);
  }

  function renderDsaGrid(problems) {
    if (!problems || problems.length === 0) {
      dsaGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 2rem;">No matching DSA problems found.</p>`;
      return;
    }

    dsaGrid.innerHTML = problems.map(p => `
      <div class="dsa-card">
        <div class="dsa-card-top">
          <span class="dsa-topic">${p.topic}</span>
          <span class="difficulty-badge ${p.difficulty}">${p.difficulty}</span>
        </div>
        <h4>${p.title}</h4>
        <div class="dsa-complexities">
          <span class="complexity-tag">Time: ${p.timeComplexity}</span>
          <span class="complexity-tag">Space: ${p.spaceComplexity}</span>
        </div>
        <p class="dsa-intuition">${p.intuition}</p>
        <a href="${p.leetcodeUrl}" target="_blank" class="dsa-link">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> LeetCode Problem Link
        </a>
      </div>
    `).join('');
  }

  dsaSearchInput.addEventListener('input', filterDsaGrid);

  // ==========================================
  // AI RECRUITER JOB FIT EVALUATOR
  // ==========================================
  presetJdBtn.addEventListener('click', () => {
    jdInput.value = "Seeking a Full-Stack Software Engineer with strong proficiency in Node.js, Express, MongoDB, JavaScript/React, and proven Data Structures & Algorithms problem-solving skills with Generative AI API integrations.";
  });

  evaluateJdBtn.addEventListener('click', async () => {
    const text = jdInput.value.trim();
    if (!text) {
      showToast("Please paste a job description or list of required skills", "error");
      return;
    }

    evaluateJdBtn.disabled = true;
    evaluateJdBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Calculating Fit...`;

    try {
      const res = await fetch('/api/ai/recruiter-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: text })
      });
      const data = await res.json();
      if (data.success) {
        evalResultCard.style.display = 'block';
        matchPercentNum.textContent = `${data.matchPercentage}%`;
        evalTailoredPitch.textContent = data.tailoredPitch;

        matchingSkillsChips.innerHTML = data.matchingSkills.map(s => `
          <span class="tech-tag" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.4); color: var(--accent-emerald);">
            <i class="fa-solid fa-check"></i> ${s}
          </span>
        `).join('');

        showToast(`Match Score: ${data.matchPercentage}%!`, "success");
      }
    } catch (err) {
      showToast("Error evaluating job description.", "error");
    } finally {
      evaluateJdBtn.disabled = false;
      evaluateJdBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> Evaluate Candidate Match`;
    }
  });

  // ==========================================
  // CONTACT FORM SUBMISSION
  // ==========================================
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    sendMsgBtn.disabled = true;
    sendMsgBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.value.trim(),
          email: contactEmail.value.trim(),
          subject: contactSubject.value.trim(),
          message: contactMessage.value.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        contactForm.reset();
        showToast(`Message sent! Reference: ${data.messageId}`, "success");
      } else {
        showToast(data.message || "Failed to send message.", "error");
      }
    } catch (err) {
      showToast("Network error. Please try again or email directly.", "error");
    } finally {
      sendMsgBtn.disabled = false;
      sendMsgBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Direct Message`;
    }
  });

  // ==========================================
  // PRABHAS AI CLONE CHAT DRAWER
  // ==========================================
  const toggleAiDrawer = () => aiDrawerOverlay.classList.toggle('active');
  openAiChatBtn.addEventListener('click', toggleAiDrawer);
  heroAiChatBtn.addEventListener('click', () => aiDrawerOverlay.classList.add('active'));
  closeAiBtn.addEventListener('click', () => aiDrawerOverlay.classList.remove('active'));
  aiDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === aiDrawerOverlay) aiDrawerOverlay.classList.remove('active');
  });

  // Quick Prompts
  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      aiChatInput.value = chip.dataset.prompt;
      sendAiMessage();
    });
  });

  sendAiBtn.addEventListener('click', sendAiMessage);
  aiChatInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') sendAiMessage();
  });

  async function sendAiMessage() {
    const text = aiChatInput.value.trim();
    if (!text) return;

    appendChatMessage('user', text);
    aiChatInput.value = '';

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'ai-message bot typing';
    typingIndicator.innerHTML = `
      <div class="message-bubble" style="display: flex; gap: 0.4rem; align-items: center;">
        <i class="fa-solid fa-spinner fa-spin" style="color: var(--accent-indigo);"></i>
        <span>Prabhas AI Clone is thinking...</span>
      </div>
    `;
    aiChatMessages.appendChild(typingIndicator);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      typingIndicator.remove();

      if (data.success) {
        appendChatMessage('bot', data.reply);

        if (data.quickPrompts && data.quickPrompts.length > 0) {
          aiQuickPrompts.innerHTML = data.quickPrompts.map(p => `
            <button class="prompt-chip" data-prompt="${p}"><i class="fa-solid fa-bolt"></i> ${p}</button>
          `).join('');

          aiQuickPrompts.querySelectorAll('.prompt-chip').forEach(b => {
            b.addEventListener('click', () => {
              aiChatInput.value = b.dataset.prompt;
              sendAiMessage();
            });
          });
        }
      }
    } catch (err) {
      typingIndicator.remove();
      appendChatMessage('bot', "Encountered a slight network hiccup. Feel free to re-ask!");
    }
  }

  function appendChatMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${sender}`;

    // Convert basic markdown formatting (bold, newlines, links)
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">$1</a>')
      .replace(/\n/g, '<br>');

    msgDiv.innerHTML = `<div class="message-bubble"><p>${formatted}</p></div>`;
    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  // Toast
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  function setupEventListeners() {
    // Smooth scroll for nav anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Typing Effect Animation
  const words = ["Full-Stack Web Applications", "RESTful APIs with Express", "Dynamic Modern UI/UX", "Scalable Backend Architectures"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingEl = document.getElementById('typingEffect');

  function typeEffect() {
    if (!typingEl) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // Fetch Projects from API
  const projectsGrid = document.getElementById('projectsGrid');
  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && projectsGrid) {
        renderProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  }

  function renderProjects(projects) {
    projectsGrid.innerHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-top">
          <span class="project-category">${p.category}</span>
          <span style="color:var(--text-muted); font-size:0.8rem;">${p.date}</span>
        </div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tech-tags">
          ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${p.github}" target="_blank"><i class="fa-brands fa-github"></i> Repository</a>
          <a href="${p.demoUrl}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>
        </div>
      </div>
    `).join('');
  }

  fetchProjects();

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  const toastContainer = document.getElementById('toastContainer');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`🎉 ${data.message} Ticket: ${data.ticketId}`);
          contactForm.reset();
        } else {
          showToast("Failed to send message: " + data.message);
        }
      } catch (err) {
        console.error(err);
        showToast("Error sending message. Please try again.");
      }
    });
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--accent-cyan);"></i> ${msg}`;
    toastContainer.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }
});

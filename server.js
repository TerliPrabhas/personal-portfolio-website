const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Profile Data
const profileData = {
  name: "Terli Jogiswara Prabhas",
  title: "Full Stack Web Developer & Computer Science Undergraduate",
  institution: "National Institute of Technology, Agartala (NIT Agartala)",
  cgpa: "8.23",
  location: "Agartala, Tripura / Vijayawada, Andhra Pradesh, India",
  email: "prabhasterli@gmail.com",
  phone: "+91-8074811487",
  github: "https://github.com/TerliPrabhas",
  linkedin: "https://linkedin.com/in/TerliPrabhas",
  skills: {
    languages: ["C++", "JavaScript (ES6+)", "Python", "HTML5", "CSS3", "SQL"],
    frameworks: ["Node.js", "Express.js", "Tailwind CSS", "Bootstrap"],
    databases: ["MongoDB", "MySQL", "SQL"],
    tools: ["Git", "GitHub", "VS Code", "Postman"],
    coursework: ["Data Structures & Algorithms", "Object-Oriented Programming", "DBMS", "Operating Systems", "Computer Networks"]
  },
  dsaStats: {
    leetcodeSolved: "150+",
    topics: ["Arrays", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", "Recursion", "Binary Search"]
  },
  certifications: [
    { title: "Full Stack Web Development with Generative AI", issuer: "Udemy / Recognized Platform", year: "2026" },
    { title: "Full Stack Web Development", issuer: "Udemy / Recognized Platform", year: "2026" },
    { title: "Data Structures and Algorithms (DSA)", issuer: "Udemy", year: "2025" }
  ]
};

// Projects Data
const projectsData = [
  {
    id: 1,
    title: "E-Commerce Web Application",
    category: "Full Stack",
    date: "2025–2026",
    tech: ["HTML5", "CSS3", "JavaScript", "Node.js", "Express.js", "MongoDB"],
    description: "Full-stack e-commerce web application featuring product searching, category filtering, quick-view modals, cart management, promo discount flows, and order checkout APIs.",
    github: "https://github.com/TerliPrabhas/ecommerce-web-app",
    demoUrl: "http://localhost:3001",
    featured: true
  },
  {
    id: 2,
    title: "Music Player Web Application",
    category: "Full Stack",
    date: "2025–2026",
    tech: ["HTML5 Audio API", "JavaScript", "Node.js", "Express.js", "Canvas Visualizer"],
    description: "Sleek synthwave web music player with audio controls, playlist creation, live audio spectrum canvas visualizer, lyrics drawer, and REST APIs.",
    github: "https://github.com/TerliPrabhas/music-player-app",
    demoUrl: "http://localhost:3002",
    featured: true
  },
  {
    id: 3,
    title: "Personal Portfolio Website",
    category: "Full Stack",
    date: "2025–2026",
    tech: ["HTML5", "CSS Variables", "JavaScript", "Node.js", "Express.js"],
    description: "Dynamic full-stack portfolio showcasing technical skills, academic achievements at NIT Agartala, interactive project modals, and integrated contact form backend API.",
    github: "https://github.com/TerliPrabhas/personal-portfolio-website",
    demoUrl: "http://localhost:3003",
    featured: true
  }
];

// Contact Submissions Log
let contactMessages = [];

// API Endpoints
app.get('/api/profile', (req, res) => {
  res.json({ success: true, profile: profileData });
});

app.get('/api/projects', (req, res) => {
  res.json({ success: true, projects: projectsData });
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required." });
  }

  const newMessage = {
    id: 'MSG-' + Date.now(),
    name,
    email,
    subject: subject || "Portfolio Inquiry",
    message,
    timestamp: new Date().toISOString()
  };

  contactMessages.push(newMessage);
  console.log("New Contact Form Submission:", newMessage);

  res.json({
    success: true,
    message: "Thank you for reaching out! Your message has been received.",
    ticketId: newMessage.id
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio Server running on http://localhost:${PORT}`);
});

import {
  Portfolio,
  Profile,
  Fact,
  Project,
  Experience,
  Education,
  Course,
  Award,
  Leadership,
  Testimonial,
  SkillGroup,
  Link,
} from '../models/Models.js';

// ---------------------------------------------------------------------------
// Profile: hero, nav, statement and contact
// ---------------------------------------------------------------------------
const profile = new Profile({
  name: 'Ng Jian An',
  role: 'Software Engineer, Singapore',
  // Shown next to the logo in the nav (desktop). Update when your status changes.
  // The ONLY place with your graduation date: update this when you graduate,
  // e.g. 'NUS Computer Science graduate, open to software engineering and technical product roles'.
  availability: 'Graduating Dec 2026, open to software engineering and technical product roles',
  tagline:
    'Final-year Computer Science student at NUS, specialising in networking, distributed systems and parallel computing, with interests in UI/UX, FinTech and MedTech.',
  // Quick facts under your name: new Fact(label, lines, equalEmphasis, icon).
  // Icons: 'work' | 'study' | 'focus' | 'interest' (see ui/FactIcon.jsx).
  facts: [
    new Fact('Currently', ['Software Engineering Intern', 'MedLyves'], false, 'work'),
    new Fact('Studying', ['Bachelor of Computing, Computer Science', 'National University of Singapore'], false, 'study'),
    // `true` = both focus areas shown with equal emphasis
    new Fact('Focus', ['Networking & Distributed Systems (Distinction)', 'Parallel Computing'], true, 'focus'),
    new Fact('Interests', ['UI/UX, FinTech, MedTech', 'Open to all domains'], false, 'interest'),
  ],
  // Revealed one word at a time as you scroll. A blank line (\n\n) starts a
  // new paragraph: the first is set large as a headline, the rest smaller.
  statement:
    'Engineering taught me how things are built. Business taught me why they matter to people.\n\n' +
    "I'm looking to start my career as a software engineer or technical product manager, on a team that cares about the details: reliable systems, thoughtful interfaces and products people genuinely enjoy. I'm most excited by UI/UX, FinTech and MedTech, but open to any field with the right problem to solve.",
  location: 'Singapore',
  email: 'ngjianan@gmail.com',
  // Web copy of your résumé in /public (phone number removed for privacy).
  // Opens in a new tab. Replace the file to update it; set to '' to hide it.
  resume: './Ng_Jian_An_Resume.pdf',
  links: [
    new Link('GitHub', 'https://github.com/nja99'),
    new Link('LinkedIn', 'https://www.linkedin.com/in/ngjianan'),
  ],
});

// ---------------------------------------------------------------------------
// Projects: horizontal scroll panels
// Add links with: links: [new Link('View on GitHub', 'https://github.com/...')]
// ---------------------------------------------------------------------------
const projects = [
  new Project({
    title: 'Personal Portfolio',
    role: 'Designer and developer',
    period: 'Nov 2026',
    summary:
      'A scroll-driven personal website, designed and built from scratch, with reusable animated scenes and an accessible design system for light and dark themes.',
    highlights: [
      'Designed a four-colour system that meets the highest accessibility standard for text contrast (WCAG AAA) in both light and dark themes',
      'Built pinned scroll scenes, a scroll-drawn timeline and animated canvas backgrounds from scratch, without animation libraries',
      'Written with function components and custom React hooks, with shared layouts for scroll scenes and sections, and all content kept in a single data file',
      'Supports reduced motion, full keyboard navigation and screen readers',
    ],
    stack: {
      Frontend: ['React', 'Tailwind CSS', 'Canvas API', 'SVG'],
      Backend: [], // static site: no server
      Tools: ['Vite', 'Git'],
    },
  }),
  new Project({
    title: 'A Caring Book',
    role: 'Software developer, CS2103T',
    period: 'Jan – Apr 2025',
    summary:
      'A desktop application with command-line and graphical interfaces that helps patient care coordinators manage patient information. Extended from an existing Java codebase by a five-person team.',
    highlights: [
      'Co-led Agile sprint planning and workload allocation across the team',
      'Independently designed and delivered usability features, including light and dark themes, full keyboard navigation and shortcut commands',
      'Conducted code reviews to maintain consistent quality across features',
    ],
    stack: {
      Frontend: ['JavaFX'],
      Backend: ['Java'],
      Tools: ['Git'],
    },
  }),
  new Project({
    title: 'HealthPLUS',
    role: 'Full-stack developer, NUS Orbital',
    period: 'May – Aug 2024',
    summary:
      'A cross-platform health management app that brings medications, appointments and family health records together in one place.',
    highlights: [
      'Applied user-centred design so core tasks, such as logging medication or booking an appointment, stay quick and intuitive',
      'Built with Flutter on Firebase and Google Cloud, with authentication, cloud storage and real-time sync across devices',
      'Set up CI/CD, modularised the codebase with dependency injection, and secured API keys and stored data with encryption',
    ],
    stack: {
      Frontend: ['Flutter', 'Dart'],
      Backend: ['Firebase', 'Google Cloud'],
      Tools: ['CI/CD'],
    },
  }),
];

// ---------------------------------------------------------------------------
// Experience: timeline, newest first
// ---------------------------------------------------------------------------
const experience = [
  new Experience({
    company: 'MedLyves Pte Ltd',
    role: 'Software Engineering Intern',
    start: 'Jun 2026',
    end: 'Present',
    points: [
      'Develop and maintain the MediCase and MediKiosk Android applications in Flutter, covering feature development, defect resolution, testing and deployment.',
      'Provide software development support to sister company JLK Technology on a quality-control inspection system.',
      'Collaborate with cross-functional teams to troubleshoot issues, implement requirements and improve reliability.',
    ],
  }),
  new Experience({
    company: 'Singapore Armed Forces (National Service)',
    role: 'Combat Medic & Service Medic',
    start: 'Dec 2021',
    end: 'Aug 2023',
    points: [
      'Trained and certified as an Emergency Medical Technician (EMT) at the SAF Medical Training Institute',
      'Served as a Platoon Medic with the 3rd Singapore Infantry Regiment, then as a Service Medic at Maju Medical Centre',
      'Provided first aid and medical cover for training and public events, including Army Open House 2022',
    ],
  }),
  new Experience({
    company: 'Hoffmann Quality Tools Asia Pacific',
    role: 'Product Management & Engineering Intern',
    start: 'Mar 2020',
    end: 'Aug 2020',
    points: [
      'Evaluated automation solutions for CNC machine-tending operations, informing decisions on six-figure client opportunities.',
      'Conducted global and regional PPE market analysis and presented findings to management, supporting decisions that generated six-figure revenue.',
      'Researched competitors’ B2C strategies, accelerating a new B2C channel and a five-figure pilot with prospective clients.',
    ],
  }),
  new Experience({
    company: 'Self-hosted Steam Trading Cards bot',
    role: 'Host & Maintainer',
    start: 'Jul 2018',
    end: 'May 2021',
    points: [
      'Deployed and maintained an existing trading bot on a VPS, automating the buying and selling of Steam Trading Cards',
      'Learned SSH and server basics hands-on, keeping the bot running alongside full-time studies',
      'Completed more than 12,000 trades over almost three years',
    ],
  }),
];

// ---------------------------------------------------------------------------
// Testimonials: shown just before Contact. Use people's exact words, with their
// permission. Leave the list empty ([]) to hide the section.
// ---------------------------------------------------------------------------
const testimonials = [
  new Testimonial({
    quote:
      'Jian An is a quick learner and is able to work independently without close supervision… He was assigned to different tasks which highlighted his skills in organization, decision making and problem solving… He asks in-depth questions about the industry in order to gain as much information as possible… I highly recommend Jian An to all future employers.',
    name: 'Louis Tee',
    role: 'Product Management Director',
    organisation: 'Hoffmann Quality Tools Asia Pacific',
    // year: '2020', // optional: shows in the card's top-right corner
  }),
];

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
const education = [
  new Education({
    school: 'National University of Singapore',
    qualification: 'Bachelor of Computing in Computer Science',
    start: 'Aug 2023',
    end: 'Dec 2026',
    focusAreas: ['Networking & Distributed Systems (Distinction)', 'Parallel Computing'],
    minor: 'Statistics',
    // Selected from your transcript: the courses closest to your focus areas.
    coursework: [
      new Course('CS2103T', 'Software Engineering'),
      new Course('CS2040S', 'Data Structures & Algorithms'),
      new Course('CS2105', 'Computer Networks'),
      new Course('CS4226', 'Internet Architecture'),
      new Course('CS4222', 'Wireless Networking'),
      new Course('CS2106', 'Operating Systems'),
      new Course('CS3210', 'Parallel Computing'),
      new Course('CS3211', 'Concurrent Programming'),
      new Course('CS4223', 'Multi-core Architectures'),
      new Course('CS2109S', 'AI & Machine Learning'),
    ],
  }),
  new Education({
    school: 'Ngee Ann Polytechnic',
    qualification: 'Diploma with Merit in Electronics & Computer Engineering',
    start: 'Apr 2018',
    end: 'May 2021',
    minor: 'Business Management',
    extras: [{ label: 'Diploma Plus', value: 'Certificate in Advanced Engineering Mathematics' }],
    honours: [
      new Award('Director’s List, three semesters', '', '2018 – 2020'),
      new Award('Top in cohort, Computer Programming', '', '2018'),
    ],
    gpa: '3.87 / 4.00',
    showGpa: true,
  }),
  new Education({
    school: 'Ngee Ann Polytechnic',
    qualification: 'Polytechnic Foundation Programme (PFP), Engineering cluster',
    start: 'Apr 2017',
    end: '2018',
    extras: [{ label: 'Pathway to', value: 'Diploma in Electronics & Computer Engineering' }],
  }),
];

// ---------------------------------------------------------------------------
// Certifications: their own section, between Education and Leadership.
// new Award(title, issuer, year, link). Leave year or link as '' to hide them.
// Add a link only where there's a public certificate/verification page.
// ---------------------------------------------------------------------------
const certifications = [
  new Award('Networking and Distributed Systems Focus Area (Distinction)', 'National University of Singapore', '2026', 'https://credentials.nus.edu.sg/65ca29a8-58e4-4e8b-8d1c-5fa9a71da0f1'),
  new Award('NUS Orbital Project (Apollo 11)', 'National University of Singapre', '2024', 'https://credentials.nus.edu.sg/10583c57-71e4-4335-b9b6-22ccb254f253'),
  new Award('CS50’s Introduction to Databases with SQL', 'Harvard University (edX)', '2024', 'https://courses.edx.org/certificates/ae93e9f1176448b4b1c973fb24078511'),
  new Award('Higher Certificate in Healthcare (Nursing)', 'SAF Medical Training Institute, Emergency Medical Technician (EMT) course', '2022'),
];

// ---------------------------------------------------------------------------
// Leadership & activities (academic honours now live under each school above)
// `period` and `summary` are optional; fill them in when you have them.
// ---------------------------------------------------------------------------
const leadership = [
  new Leadership({
    role: 'Silver Generation Ambassador (Volunteer)',
    organisation: 'Agency for Integrated Care (AIC)',
    period: '2025 – 2026',
    points: [
      'Visited seniors at home to explain new government health and social policies',
      'Checked in on their wellbeing and identified any needs for further support',
      'Contributed around 60 hours of volunteering over the year',
    ],
  }),
  new Leadership({
    role: 'Welfare Subcommittee Member',
    organisation: 'NUS Computing Club',
    period: '2023 – 2024',
    points: [
      'Facilitated the set-up of ad-hoc events organised by the committee',
      'Packed and distributed exam welfare packs to support computing students during examinations',
    ],
  }),
  new Leadership({
    role: 'Committee Member',
    organisation: 'Ngee Ann ECE Academic Club',
    period: '2019 – 2021',
    points: ['Organised community-building events for students across the Electronics & Computer Engineering course'],
  }),
  new Leadership({
    role: 'Camp Crew',
    organisation: 'Ngee Ann School of Engineering Society',
    period: '2019 – 2021',
    points: [
      'Volunteered as crew for several student camps',
      'Supported logistics, set-up and the smooth running of activities for participants',
    ],
  }),
  new Leadership({
    role: 'Third Sergeant',
    organisation: 'National Cadet Corps',
    period: '2012 – 2016',
    points: [
      'Served as Acting Platoon Commander at the 2015 annual camp, leading a platoon of junior cadets',
      'Won Bronze in the Free-Style Drill Competition (2015) and 2nd place in the Annual Orienteering Competition (2014)',
    ],
  }),
];

/** Non-academic awards, shown as a short list under Leadership. */
const awards = [
  new Award('National Youth Achievement Award (Bronze)', 'NYAA Council'),
  new Award('Edusave Merit Bursary', 'Ministry of Education', '2016 – 2018'),
];

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
const skills = [
  new SkillGroup('Languages', ['Java', 'Python', 'Dart', 'C++', 'C#', 'JavaScript', 'TypeScript', 'SQL', 'HTML/CSS']),
  new SkillGroup('Frontend', ['React', 'Flutter (Android & cross-platform)', 'Tailwind CSS', 'JavaFX']),
  new SkillGroup('Backend & databases', ['FastAPI', 'REST APIs', 'Firebase', 'PostgreSQL', 'MongoDB']),
  new SkillGroup('Cloud & infrastructure', ['Google Cloud', 'Docker', 'CI/CD', 'Linux servers (VPS)', 'SSH']),
  new SkillGroup('Tools', ['Git', 'Jira', 'Figma', 'Agile (Scrum)']),
  new SkillGroup('UI & UX design', [
    'User research and interviews',
    'Usability testing',
    'User journeys and flows',
    'Interaction and visual design',
    'Accessibility (WCAG)',
  ]),
  new SkillGroup('Spoken', ['English', 'Mandarin']),
];

/** The single object the whole app reads from. */
export const portfolio = new Portfolio({
  profile,
  projects,
  experience,
  testimonials,
  education,
  certifications,
  leadership,
  awards,
  skills,
});

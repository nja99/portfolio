/**
 * =============================================================================
 * App: puts the page together, top to bottom.
 * -----------------------------------------------------------------------------
 * PROJECT MAP
 *   src/data/portfolio.js         ← all your text (edit this most often)
 *   src/models/Models.js          ← classes describing the data's shape
 *   src/services/ThemeService.js  ← light/dark mode logic
 *   src/services/ScrollService.js ← one shared scroll loop + maths helpers
 *   src/hooks/                    ← custom React hooks
 *       useScrollFrame.js           run code on scroll, once per frame
 *       useReducedMotion.js         the visitor's "reduce motion" setting
 *       useTheme.js                 current theme + theme colours for canvases
 *   src/components/layout/        ← page structure
 *       ScrollScene.jsx             pinned, scroll-driven animation
 *       Section.jsx                 standard two-column content section
 *       Navbar, ThemeToggle, BackgroundFX, NetworkCanvas
 *   src/components/scenes/        ← the 3 animated scenes (built on ScrollScene)
 *   src/components/sections/      ← static sections (built on Section), incl. Testimonials
 *   src/components/ui/            ← small reusable pieces (Logo, Button, ProjectCard, Timeline, GlobeCanvas)
 *   src/index.css                 ← the 4 colour tokens + global styles
 *
 * Every component is a function component using React hooks.
 *
 * To reorder the page, move the components below. To remove a section,
 * delete its line (and its link in LINKS in Navbar.jsx).
 * =============================================================================
 */
import { useEffect } from 'react';
import { portfolio } from './data/portfolio.js';
import { scrollService } from './services/ScrollService.js';

import Navbar from './components/layout/Navbar.jsx';
import BackgroundFX from './components/layout/BackgroundFX.jsx';
import HeroScene from './components/scenes/HeroScene.jsx';
import StatementScene from './components/scenes/StatementScene.jsx';
import ProjectsScene from './components/scenes/ProjectsScene.jsx';
import ExperienceSection from './components/sections/ExperienceSection.jsx';
import TestimonialsSection from './components/sections/TestimonialsSection.jsx';
import EducationSection from './components/sections/EducationSection.jsx';
import CertificationsSection from './components/sections/CertificationsSection.jsx';
import LeadershipSection from './components/sections/LeadershipSection.jsx';
import SkillsSection from './components/sections/SkillsSection.jsx';
import ContactSection from './components/sections/ContactSection.jsx';

export default function App() {
  const { profile, projects, experience, testimonials, education, certifications, awards, leadership, skills } = portfolio;

  // Fonts change text widths, which changes the projects track length.
  // Re-measure all scenes once the web font has finished loading.
  useEffect(() => {
    document.fonts?.ready.then(() => scrollService.refresh());
  }, []);

  return (
    <>
      <BackgroundFX />
      <Navbar name={profile.name} resume={profile.resume} />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroScene profile={profile} />
        <StatementScene profile={profile} />
        <ProjectsScene projects={projects} />
        <ExperienceSection experience={experience} />
        <EducationSection education={education} />
        <CertificationsSection certifications={certifications} />
        <LeadershipSection leadership={leadership} awards={awards} />
        <SkillsSection skills={skills} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection profile={profile} />
      </main>
    </>
  );
}
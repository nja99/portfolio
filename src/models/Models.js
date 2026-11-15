/**
 * =============================================================================
 * DATA MODELS
 * -----------------------------------------------------------------------------
 * Plain JavaScript classes that describe the *shape* of the portfolio content.
 * Components receive instances of these classes, so they never have to guess
 * which fields exist. Want a new field (e.g. a project image)? Add it to the
 * class constructor here, fill it in src/data/portfolio.js, then render it.
 *
 * Every model extends `Entity`, which provides a stable `id` (used as the
 * React `key` when rendering lists).
 * =============================================================================
 */

/** Base class for anything that appears in a list. */
export class Entity {
  static #counter = 0;

  constructor() {
    // Private static counter gives every instance a unique id.
    this.id = `${this.constructor.name.toLowerCase()}-${++Entity.#counter}`;
  }
}

/** A clickable external link (GitHub, LinkedIn, email, demo...). */
export class Link extends Entity {
  /**
   * @param {string} label  Visible text, e.g. "GitHub"
   * @param {string} href   URL or mailto:
   */
  constructor(label, href) {
    super();
    this.label = label;
    this.href = href;
  }

  /** External links open in a new tab; mailto/anchors do not. */
  get isExternal() {
    return this.href.startsWith('http');
  }
}

/** Who you are: used by the hero, nav, statement and contact sections. */
export class Profile {
  constructor({ name, role, availability, tagline, facts = [], statement, location, email, resume = '', links }) {
    this.name = name;
    this.role = role;
    this.availability = availability; // short status line under your title
    /** @type {Fact[]} quick facts shown under the hero name */
    this.facts = facts;
    this.tagline = tagline; // one-sentence intro (not currently shown)
    this.statement = statement; // the long sentence revealed word-by-word
    this.location = location;
    this.email = email;
    /** Path to a PDF résumé in /public ('' hides the Résumé links) */
    this.resume = resume;
    /** @type {Link[]} */
    this.links = links;
  }

  /** Splits the statement into words for the scroll-reveal animation. */
  get statementWords() {
    return this.statement.split(' ');
  }
}

/**
 * A labelled quick fact for the hero, e.g. ("Currently", "Intern at MedLyves").
 * `value` can be a string, or an array of strings to show on separate lines:
 *   new Fact('Studying', ['Bachelor of Computing, Computer Science', 'National University of Singapore'])
 */
export class Fact extends Entity {
  /**
   * @param {boolean} equal  true = every line has the same emphasis (e.g. two
   *                         focus areas); false = first line main, rest muted
   * @param {string} icon     icon name from PATHS in ui/FactIcon.jsx ('work', 'study', ...)
   */
  constructor(label, value, equal = false, icon = '') {
    super();
    this.label = label;
    this.value = value;
    this.equal = equal;
    this.icon = icon;
  }

  /** Always returns an array of lines, whatever was passed in. */
  get lines() {
    return Array.isArray(this.value) ? this.value : [this.value];
  }
}

/** A project card in the horizontal-scrolling projects scene. */
export class Project extends Entity {
  constructor({ title, role, period, summary, highlights = [], stack = [], links = [] }) {
    super();
    this.title = title;
    this.role = role;
    this.period = period;
    this.summary = summary;
    /** @type {string[]} bullet points */
    this.highlights = highlights;
    /**
     * Technologies, grouped by what they do. An object of layer → items:
     *   { Frontend: ['Flutter', 'Dart'], Backend: ['Firebase'] }
     * (A plain array still works; it becomes one "Built with" group.)
     */
    this.stack = stack;
    /** @type {Link[]} */
    this.links = links;
  }
}

/**
 * The same rows appear on EVERY project, in this order, so the panels line up
 * and read consistently. A project with nothing in a row shows "Not needed".
 * Change this list to change the rows everywhere.
 */
Project.STACK_LAYERS = ['Frontend', 'Backend', 'Tools'];

/** @returns {{label: string, items: string[]}[]} one entry per STACK_LAYERS row */
Project.prototype.stackGroups = function stackGroups() {
  const stack = Array.isArray(this.stack) ? { Tools: this.stack } : this.stack;
  return Project.STACK_LAYERS.map((label) => ({ label, items: stack[label] ?? [] }));
};

/** A job / internship in the experience timeline. */
export class Experience extends Entity {
  /**
   * @param {boolean} compact  true = a smaller, one-paragraph entry for minor
   *                           or older roles (e.g. a side business)
   */
  constructor({ company, role, start, end, points = [], compact = false }) {
    super();
    this.compact = compact;
    this.company = company;
    this.role = role;
    this.start = start;
    this.end = end; // use 'Present' for an ongoing role
    this.points = points;
  }

  get isCurrent() {
    return this.end === 'Present';
  }

  get period() {
    return `${this.start} – ${this.end}`;
  }
}

/**
 * A school / qualification. Fields are explicit (focus areas, minor, ...) so
 * EducationSection can show each one as a clearly labelled row.
 */
export class Education extends Entity {
  constructor({
    school,
    qualification,
    start,
    end,
    focusAreas = [],
    minor = '',
    extras = [],
    honours = [],
    gpa = null,
    showGpa = true,
    coursework = [],
  }) {
    super();
    this.school = school;
    this.qualification = qualification;
    this.start = start;
    this.end = end;
    /** @type {string[]} e.g. ['Networking & Distributed Systems (Distinction)'] */
    this.focusAreas = focusAreas;
    this.minor = minor;
    /** @type {{label: string, value: string}[]} any other labelled row */
    this.extras = extras;
    /** @type {Award[]} academic honours earned at this school */
    this.honours = honours;
    this.gpa = gpa; // e.g. '3.87 / 4.00'
    this.showGpa = showGpa; // flip to false to hide the GPA on the site
    /** @type {Course[]} */
    this.coursework = coursework;
  }

  get period() {
    return `${this.start} – ${this.end}`;
  }

  /**
   * Labelled rows for the section, skipping anything empty.
   * Each row: { label, lines: string[] }
   */
  get rows() {
    const rows = [];
    if (this.focusAreas.length) rows.push({ label: this.focusAreas.length > 1 ? 'Focus areas' : 'Focus area', lines: this.focusAreas });
    if (this.minor) rows.push({ label: 'Minor', lines: [this.minor] });
    this.extras.forEach((x) => rows.push({ label: x.label, lines: [x.value] }));
    if (this.honours.length) {
      rows.push({ label: 'Honours', lines: this.honours.map((h) => (h.year ? `${h.title} (${h.year})` : h.title)) });
    }
    if (this.showGpa && this.gpa) rows.push({ label: 'GPA', lines: [this.gpa] });
    return rows;
  }
}

/** A single university course (from the transcript). */
export class Course extends Entity {
  constructor(code, title) {
    super();
    this.code = code;
    this.title = title;
  }
}

/** An award, honour or certification. */
export class Award extends Entity {
  /**
   * @param {string} title   e.g. "Director's List"
   * @param {string} issuer  e.g. "Ngee Ann Polytechnic"
   * @param {string} year    e.g. "2018 – 2020" ('' to hide)
   * @param {string} url     optional verification link (certifications)
   */
  constructor(title, issuer = '', year = '', url = '') {
    super();
    this.title = title;
    this.issuer = issuer;
    this.year = year;
    this.url = url;
  }
}

/** A leadership or co-curricular role. */
export class Leadership extends Entity {
  /** `period` is optional: leave '' to hide it. `points` are short bullet points. */
  constructor({ role, organisation, period = '', points = [] }) {
    super();
    this.role = role;
    this.organisation = organisation;
    this.period = period;
    /** @type {string[]} */
    this.points = points;
  }
}

/**
 * A quote from someone you've worked with. Use their exact words (trim with
 * "…" if needed), and only with their permission.
 */
export class Testimonial extends Entity {
  /**
   * @param {string} quote         the words, exactly as written
   * @param {string} name          who said it
   * @param {string} role          their job title
   * @param {string} organisation  where they work(ed)
   * @param {string} year          when it was written, e.g. '2020' ('' to hide)
   * @param {string} relationship  how they know you, e.g. 'My supervisor' ('' to hide)
   * @param {string} url           optional link to the original, e.g. a LinkedIn recommendation
   */
  constructor({ quote, name, role, organisation, year = '', relationship = '', url = '' }) {
    super();
    this.quote = quote;
    this.name = name;
    this.role = role;
    this.organisation = organisation;
    this.year = year;
    this.relationship = relationship;
    this.url = url;
  }
}

/** A labelled group of skills, e.g. "Languages". */
export class SkillGroup extends Entity {
  constructor(label, items) {
    super();
    this.label = label;
    /** @type {string[]} */
    this.items = items;
  }
}

/** Everything the site needs, in one object. */
export class Portfolio {
  constructor({ profile, projects, experience, testimonials = [], education, certifications = [], leadership, awards = [], skills }) {
    this.profile = profile;
    this.projects = projects;
    this.experience = experience;
    /** @type {Testimonial[]} quotes from people you've worked with */
    this.testimonials = testimonials;
    this.education = education;
    /** @type {Award[]} certifications (title, issuer, year) */
    this.certifications = certifications;
    this.leadership = leadership;
    /** @type {Award[]} non-academic awards (shown with leadership) */
    this.awards = awards;
    this.skills = skills;
  }
}
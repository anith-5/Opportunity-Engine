const studentProfileInput = document.getElementById("studentProfile");
const opportunitiesInput = document.getElementById("opportunities");
const output = document.getElementById("output");
const resultCards = document.getElementById("resultCards");
const resultStatus = document.getElementById("resultStatus");
const inputHint = document.getElementById("inputHint");
const analyzeButton = document.getElementById("analyzeButton");
const analyzeCatalogButton = document.getElementById("analyzeCatalogButton");
const loadSampleButton = document.getElementById("loadSampleButton");
const copyButton = document.getElementById("copyButton");
const loadCatalogButton = document.getElementById("loadCatalogButton");
const catalogGrid = document.getElementById("catalogGrid");

let latestJson = `{
  "top_opportunities": []
}`;

const catalogOpportunities = [
  {
    name: "Summer Science Research Program (SSRP)",
    organization: "Rockefeller University",
    type: "program",
    location: "New York, NY",
    duration: "Jun 24 - Aug 8",
    deadline: "Jan 4, 2027",
    difficulty: "very hard",
    eligibility: "High school juniors and seniors interested in scientific careers; full-time summer commitment required.",
    tags: ["research", "science", "lab", "stem"],
    description: "A free seven-week research program where students work in small lab teams, learn research methods, and present a final poster.",
    link: "https://www.snow.day/learning-opportunities/622ff0be-8074-4560-b4a7-202abed1c9fe/summer-science-research-program-ssrp",
    competitiveness: "Highly competitive",
    requirements: "Strong interest in science, research commitment, full-time weekday availability",
    upside: "Free research experience, poster presentation, professional network"
  },
  {
    name: "MITES Summer",
    organization: "MIT",
    type: "program",
    location: "Cambridge, MA",
    duration: "Jun - Sep",
    deadline: "Feb 2, 2027",
    difficulty: "very hard",
    eligibility: "Rising high school seniors interested in STEM.",
    tags: ["stem", "engineering", "math", "college prep"],
    description: "A free residential STEM immersion with advanced coursework, electives, and college readiness support for rising seniors.",
    link: "https://www.snow.day/learning-opportunities/0cb45d42-14f6-40b4-92b3-41afce318d26/mites-summer",
    competitiveness: "Highly competitive",
    requirements: "Strong STEM interest, rising senior status, full summer academic commitment",
    upside: "Prestigious STEM program, advanced coursework, residential experience"
  },
  {
    name: "Broad Summer Scholars Program (BSSP)",
    organization: "Broad Institute",
    type: "program",
    location: "Cambridge, MA",
    duration: "Jun 30 - Aug 8",
    deadline: "Jan 22, 2027",
    difficulty: "very hard",
    eligibility: "Highly motivated high school students with strong interest in science.",
    tags: ["research", "biology", "science", "stem"],
    description: "A free six-week summer research program pairing students with Broad scientists for original projects and scientific presentations.",
    link: "https://www.snow.day/learning-opportunities/9bdfe6ec-ade5-4501-b125-3cc721fad01c/broad-summer-scholars-program-bssp",
    competitiveness: "Highly competitive",
    requirements: "Strong science interest, ability to contribute to research teams, motivation for intensive summer work",
    upside: "Mentored research, scientific talks, college fair exposure"
  },
  {
    name: "Princeton Summer Journalism Program (PSJP)",
    organization: "Princeton University",
    type: "program",
    location: "Princeton, NJ",
    duration: "Jul 27 - Aug 6",
    deadline: "Feb 25, 2027",
    difficulty: "hard",
    eligibility: "High-achieving high school juniors from low-income backgrounds interested in journalism.",
    tags: ["journalism", "writing", "media", "college prep"],
    description: "A journalism and college-prep program blending summer workshops, writing assignments, and an on-campus residential institute.",
    link: "https://www.snow.day/learning-opportunities/f2e8d330-39b9-4736-9c83-620f25f12a4b/princeton-summer-journalism-program-psjp",
    competitiveness: "Competitive",
    requirements: "High academic achievement, junior status, journalism interest, low-income eligibility",
    upside: "Selective journalism training, college counseling, campus experience"
  },
  {
    name: "Athena Summer Innovation Institute",
    organization: "Barnard College",
    type: "program",
    location: "New York, NY",
    duration: "Jun 30 - Jul 18",
    deadline: "Rolling",
    difficulty: "medium",
    eligibility: "High school students interested in entrepreneurship and social impact.",
    tags: ["business", "entrepreneurship", "leadership", "innovation"],
    description: "A three-week entrepreneurship program where students build venture ideas through workshops, mentorship, and team collaboration.",
    link: "https://www.snow.day/learning-opportunities/ec1d7b93-011e-48ff-a881-9b1d521ad2a5/athena-summer-innovation-institute",
    competitiveness: "Moderate",
    requirements: "Interest in innovation, teamwork, and entrepreneurial problem-solving",
    upside: "Mentorship, venture-building experience, leadership development"
  },
  {
    name: "Project SEED Program",
    organization: "American Chemical Society",
    type: "program",
    location: "Washington, DC",
    duration: "8 - 10 weeks",
    deadline: "May 1",
    difficulty: "hard",
    eligibility: "High school students from diverse identities and socioeconomic backgrounds interested in chemistry research.",
    tags: ["chemistry", "research", "science", "college readiness"],
    description: "A summer research and college-readiness program connecting students with chemistry-focused mentors in academia and industry.",
    link: "https://www.snow.day/learning-opportunities/a3c2e64f-5fd8-4783-9042-780da92a4e2d/project-seed-program",
    competitiveness: "Competitive",
    requirements: "Science interest, ability to participate in research, chemistry-related curiosity",
    upside: "Mentored research, virtual camp, professional development"
  },
  {
    name: "Summer Law Institute",
    organization: "Legal Outreach",
    type: "program",
    location: "New York City, NY",
    duration: "5 weeks",
    deadline: null,
    difficulty: "medium",
    eligibility: "Rising ninth graders interested in law and professional skills development.",
    tags: ["law", "public speaking", "leadership", "career exposure"],
    description: "A five-week law-focused summer experience where students learn legal topics, meet attorneys, and take part in a mock trial.",
    link: "https://www.snow.day/learning-opportunities/89e0fffe-6425-49d3-9481-b721261b5eef/summer-law-institute",
    competitiveness: "Moderate",
    requirements: "Rising ninth grade status and interest in law, professional exposure, and mock trial work",
    upside: "Legal career exposure, mentor access, pathway to later program participation"
  },
  {
    name: "Stanford Institutes of Medicine Summer Research Program",
    organization: "Stanford University",
    type: "program",
    location: "Stanford, CA",
    duration: "Jun 9 - Jul 31",
    deadline: "Feb 22, 2027",
    difficulty: "very hard",
    eligibility: "U.S. juniors or seniors age 16+ with strong interest in medicine or biological sciences.",
    tags: ["medicine", "research", "biology", "stem"],
    description: "An eight-week biomedical research program where students work with Stanford mentors on medically oriented projects.",
    link: "https://www.snow.day/learning-opportunities/c5f0bcae-77ba-4f1f-b068-44e11ef5a7c6/stanford-institute-of-medicine-summer-research-program",
    competitiveness: "Highly Selective",
    requirements: "Junior or senior standing, age 16+, U.S. citizenship or permanent residency",
    upside: "Top-tier medical research exposure, mentored project work, strong resume impact"
  },
  {
    name: "Global Sports and Entertainment Business Summer Program",
    organization: "Loyola Marymount University (LMU)",
    type: "program",
    location: "Los Angeles, CA",
    duration: "2 weeks",
    deadline: null,
    difficulty: "medium",
    eligibility: "Rising high school sophomores, juniors, and seniors interested in sports and entertainment business.",
    tags: ["business", "sports", "media", "leadership"],
    description: "A residential business program exploring sports and entertainment careers through workshops, team projects, and industry-facing learning.",
    link: "https://www.snow.day/learning-opportunities/dda32a82-5f2c-448f-bd85-2cde05690627/global-sports-and-entertainment-business-summer-program",
    competitiveness: "Moderate",
    requirements: "Interest in business, media, sports, or entertainment with willingness to collaborate in teams",
    upside: "Career exposure, leadership development, residential business experience"
  }
];

const keywordGroups = {
  leadership: ["leader", "leadership", "captain", "president", "founder", "organize"],
  writing: ["writing", "essay", "journalism", "editor", "blog", "storytelling"],
  research: ["research", "analysis", "science fair", "investigation", "lab"],
  stem: ["math", "science", "engineering", "robotics", "coding", "computer science", "stem"],
  business: ["business", "entrepreneurship", "marketing", "finance", "deca"],
  art: ["art", "design", "illustration", "photography", "creative"],
  publicSpeaking: ["debate", "speech", "public speaking", "model un", "presentation"],
  community: ["community service", "volunteer", "service", "nonprofit", "mentoring", "tutoring"],
  athletics: ["sports", "athlete", "varsity", "track", "basketball", "soccer"],
};

const upsideKeywords = {
  95: ["full ride", "$10000", "$20,000", "$25,000", "national recognition", "paid internship"],
  82: ["$5000", "$2,500", "$3000", "stipend", "statewide", "regional"],
  68: ["certificate", "local recognition", "$1000", "$500", "resume"],
};

const competitivenessKeywords = {
  20: ["highly competitive", "national", "international", "selective", "top 1%", "prestigious"],
  45: ["competitive", "statewide", "limited spots", "rigorous"],
  70: ["moderate", "regional", "district"],
  88: ["local", "school-based", "community", "open enrollment", "beginner-friendly"],
};

const difficultyKeywords = {
  advanced: ["advanced", "expert", "published research", "portfolio required", "prior internship", "college-level"],
  intermediate: ["intermediate", "some experience", "project-based", "essay", "recommendation"],
  beginner: ["beginner", "entry-level", "no experience required", "introductory"],
};

const gradePattern = /\b(8th|9th|10th|11th|12th|freshman|sophomore|junior|senior)\b/gi;

analyzeButton.addEventListener("click", () => {
  if (!studentProfileInput.value.trim()) {
    showMissingProfileState("Add a student profile first, then I can score your pasted opportunities.");
    return;
  }

  if (!opportunitiesInput.value.trim()) {
    resultStatus.textContent = "Paste at least one opportunity or use the website catalog button.";
    opportunitiesInput.focus();
    return;
  }

  const result = rankOpportunities(studentProfileInput.value, opportunitiesInput.value);
  renderResults(result);
  resultStatus.textContent = "Ranked opportunities from your pasted list.";
});

analyzeCatalogButton.addEventListener("click", () => {
  if (!studentProfileInput.value.trim()) {
    showMissingProfileState("Add a student profile first, then I can match it against the website opportunity catalog.");
    return;
  }

  const result = rankCatalog(studentProfileInput.value);
  renderResults(result);
  resultStatus.textContent = `Matched the student against ${catalogOpportunities.length} built-in website opportunities.`;
});

loadSampleButton.addEventListener("click", () => {
  studentProfileInput.value = `11th grade student interested in business, debate, and community service.
Skills: public speaking, writing, research, Canva, event planning.
Achievements: DECA state qualifier, student council secretary, school newspaper contributor.
Experience: volunteer tutor, organized a school donation drive, some internship exposure through job shadowing.`;

  opportunitiesInput.value = `Name: County Youth Leadership Scholarship
Type: Scholarship
Eligibility: High school juniors and seniors in the county
Requirements: Essay, leadership examples, community service
Competitiveness: Moderate
Difficulty: Intermediate
Upside: $2,500 and local recognition

Name: National STEM Research Fellowship
Type: Internship
Eligibility: High school juniors with strong lab research experience
Requirements: Prior research project, recommendation letters, technical interview
Competitiveness: Highly competitive
Difficulty: Advanced
Upside: Paid internship and national recognition

Name: Community Impact Essay Contest
Type: Competition
Eligibility: High school students
Requirements: 1,000-word essay on service leadership
Competitiveness: Local
Difficulty: Intermediate
Upside: $1,000 and local media feature

Name: Startup Pitch Challenge
Type: Competition
Eligibility: High school students interested in entrepreneurship
Requirements: Business idea pitch deck and live presentation
Competitiveness: Regional
Difficulty: Intermediate
Upside: $3,000 and mentor access`;

  const result = rankOpportunities(studentProfileInput.value, opportunitiesInput.value);
  renderResults(result);
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(latestJson);
    copyButton.textContent = "Copied";
    setTimeout(() => {
      copyButton.textContent = "Copy JSON";
    }, 1400);
  } catch (_error) {
    copyButton.textContent = "Copy failed";
    setTimeout(() => {
      copyButton.textContent = "Copy JSON";
    }, 1400);
  }
});

loadCatalogButton.addEventListener("click", () => {
  opportunitiesInput.value = catalogToTextarea(catalogOpportunities);
  resultStatus.textContent = `Loaded ${catalogOpportunities.length} website opportunities into the input box.`;
  opportunitiesInput.focus();
});

function rankOpportunities(studentProfile, rawOpportunities) {
  const opportunities = parseOpportunities(rawOpportunities);

  if (!studentProfile.trim() || opportunities.length === 0) {
    return { top_opportunities: [] };
  }

  const studentSignals = buildStudentSignals(studentProfile);
  const ranked = opportunities
    .map((opportunity) => scoreOpportunity(opportunity, studentSignals))
    .sort((a, b) => b.chance_score - a.chance_score)
    .slice(0, 3)
    .map(formatOpportunity);

  return { top_opportunities: ranked };
}

function rankCatalog(studentProfile) {
  if (!studentProfile.trim()) {
    return { top_opportunities: [] };
  }

  const studentSignals = buildStudentSignals(studentProfile);
  const ranked = catalogOpportunities
    .map((opportunity) => scoreOpportunity(opportunity, studentSignals))
    .sort((a, b) => b.chance_score - a.chance_score)
    .slice(0, 3)
    .map(formatOpportunity);

  return { top_opportunities: ranked };
}

function parseOpportunities(rawText) {
  return rawText
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      const fields = {};

      for (const line of lines) {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          fields[match[1].toLowerCase()] = match[2];
        }
      }

      return {
        raw: block,
        name: fields.name || lines[0] || "Unnamed Opportunity",
        organization: fields.organization || "",
        type: fields.type || "",
        location: fields.location || "",
        duration: fields.duration || "",
        deadline: fields.deadline || null,
        tags: parseTags(fields.tags || ""),
        description: fields.description || "",
        link: fields.link || null,
        eligibility: fields.eligibility || "",
        requirements: fields.requirements || "",
        competitiveness: fields.competitiveness || "",
        difficulty: fields.difficulty || "",
        upside: fields.upside || "",
      };
    });
}

function buildStudentSignals(profile) {
  const text = profile.toLowerCase();
  const keywordHits = Object.entries(keywordGroups)
    .filter(([, words]) => words.some((word) => text.includes(word)))
    .map(([group]) => group);

  return {
    text,
    gradeLevel: extractGradeLevel(text),
    keywordHits,
    hasStrongTrackRecord: /(finalist|winner|captain|editor|president|founder|qualifier|officer)/i.test(profile),
    hasExperience: /(internship|research|volunteer|job shadow|leadership|project|competition)/i.test(profile),
  };
}

function extractGradeLevel(text) {
  const match = text.match(gradePattern);
  return match ? match[0].toLowerCase() : "";
}

function scoreOpportunity(opportunity, studentSignals) {
  const searchable = [
    opportunity.name,
    opportunity.organization || "",
    opportunity.type,
    opportunity.location || "",
    opportunity.duration || "",
    opportunity.deadline || "",
    Array.isArray(opportunity.tags) ? opportunity.tags.join(" ") : "",
    opportunity.description || "",
    opportunity.eligibility,
    opportunity.requirements,
    opportunity.competitiveness,
    opportunity.difficulty,
    opportunity.upside,
  ].join(" ").toLowerCase();

  const fit = scoreFit(searchable, studentSignals);
  const difficultyMatch = scoreDifficulty(searchable, studentSignals);
  const competitiveness = scoreCompetitiveness(searchable);
  const accessibility = scoreAccessibility(searchable, studentSignals);
  const upside = scoreUpside(searchable);

  const chanceScore = Math.round(
    fit * 0.4 +
    difficultyMatch * 0.25 +
    competitiveness * 0.2 +
    accessibility * 0.1 +
    upside * 0.05
  );

  const keyStrengthMatch = determineStrengthMatch(searchable, studentSignals);
  const riskFactor = determineRiskFactor(searchable, studentSignals, accessibility, difficultyMatch, competitiveness);

  return {
    ...opportunity,
    chance_score: clamp(chanceScore, 0, 100),
    chance_level: chanceScore >= 78 ? "HIGH" : chanceScore >= 58 ? "MEDIUM" : "LOW",
    reason: buildReason(opportunity, fit, difficultyMatch, competitiveness, accessibility, studentSignals),
    key_strength_match: keyStrengthMatch,
    risk_factor: riskFactor,
    action_plan: buildActionPlan(opportunity, keyStrengthMatch),
  };
}

function scoreFit(searchable, studentSignals) {
  const matches = studentSignals.keywordHits.filter((group) =>
    keywordGroups[group].some((word) => searchable.includes(word))
  ).length;

  const base = 35 + matches * 16;
  const bonus = /essay|leadership|community service|pitch|presentation|research|writing/i.test(searchable) && studentSignals.hasExperience ? 10 : 0;
  return clamp(base + bonus, 20, 98);
}

function scoreDifficulty(searchable, studentSignals) {
  let target = 72;

  if (difficultyKeywords.advanced.some((word) => searchable.includes(word))) {
    target = studentSignals.hasStrongTrackRecord ? 60 : 34;
  } else if (difficultyKeywords.intermediate.some((word) => searchable.includes(word))) {
    target = studentSignals.hasExperience ? 82 : 62;
  } else if (difficultyKeywords.beginner.some((word) => searchable.includes(word))) {
    target = 86;
  }

  if (/technical interview|published research|prior internship/i.test(searchable) && !studentSignals.text.includes("research")) {
    target -= 16;
  }

  return clamp(target, 15, 95);
}

function scoreCompetitiveness(searchable) {
  for (const [score, words] of Object.entries(competitivenessKeywords)) {
    if (words.some((word) => searchable.includes(word))) {
      return Number(score);
    }
  }

  return 58;
}

function scoreAccessibility(searchable, studentSignals) {
  let score = 75;

  if (studentSignals.gradeLevel) {
    const gradeTerms = normalizeGradeAliases(studentSignals.gradeLevel);
    const mentionsGrade = gradeTerms.some((term) => searchable.includes(term));

    if (mentionsGrade) {
      score = 92;
    } else if (/college|undergraduate|graduate/.test(searchable)) {
      score = 18;
    }
  }

  if (/no experience required|open to all high school students|high school students/i.test(searchable)) {
    score = Math.max(score, 88);
  }

  if (/prerequisite|must have prior/i.test(searchable) && !studentSignals.hasExperience) {
    score -= 18;
  }

  return clamp(score, 10, 96);
}

function scoreUpside(searchable) {
  for (const [score, words] of Object.entries(upsideKeywords)) {
    if (words.some((word) => searchable.includes(word.toLowerCase()))) {
      return Number(score);
    }
  }

  return 60;
}

function determineStrengthMatch(searchable, studentSignals) {
  for (const group of studentSignals.keywordHits) {
    if (keywordGroups[group].some((word) => searchable.includes(word))) {
      return readableGroupName(group);
    }
  }

  return studentSignals.hasExperience ? "General experience alignment" : "Broad eligibility fit";
}

function determineRiskFactor(searchable, studentSignals, accessibility, difficultyMatch, competitiveness) {
  if (accessibility < 40) {
    return "Eligibility looks weak or unclear for this student's grade level.";
  }

  if (difficultyMatch < 45) {
    return "The requirements appear more advanced than the student's current experience.";
  }

  if (competitiveness < 35) {
    return "Strong fit, but the selection pool is likely very competitive.";
  }

  if (/recommendation|interview|portfolio/i.test(searchable)) {
    return "Application quality will depend on preparing strong supporting materials.";
  }

  return "Main risk is execution quality rather than fit.";
}

function buildReason(opportunity, fit, difficultyMatch, competitiveness, accessibility, studentSignals) {
  const strengths = studentSignals.keywordHits.length
    ? studentSignals.keywordHits.map(readableGroupName).slice(0, 2).join(" and ")
    : "their current profile";

  const difficultyText = difficultyMatch >= 75
    ? "The difficulty level appears well matched to the student's current stage."
    : "The difficulty is somewhat stretch-level but still workable.";

  const competitionText = competitiveness >= 70
    ? "It also appears less saturated than national prestige options."
    : "Competition is meaningful, but still more realistic than top-tier prestige options.";

  const accessText = accessibility >= 80
    ? "Eligibility fit is strong."
    : "Eligibility should be checked carefully before applying.";

  return `${opportunity.name} is a strong match because it aligns with ${strengths}, which show up directly in the opportunity requirements. ${difficultyText} ${competitionText} ${accessText}`;
}

function buildActionPlan(opportunity, keyStrengthMatch) {
  const parts = [
    `Pull the exact application requirements for ${opportunity.name}.`,
    `Draft a response that highlights ${keyStrengthMatch.toLowerCase()}.`,
  ];

  if (/essay/i.test(opportunity.requirements)) {
    parts.push("Write the first essay draft today and tailor one concrete example to the prompt.");
  } else if (/interview/i.test(opportunity.requirements)) {
    parts.push("Prepare three concise stories that prove readiness for the interview.");
  } else if (/presentation|pitch/i.test(opportunity.requirements)) {
    parts.push("Build a one-page pitch outline and rehearse a 60-second version immediately.");
  } else {
    parts.push("Create a submission checklist and finish the strongest required artifact first.");
  }

  return parts.join(" ");
}

function formatOpportunity(opportunity) {
  return {
    name: opportunity.name,
    chance_score: opportunity.chance_score,
    chance_level: opportunity.chance_level,
    reason: opportunity.reason,
    key_strength_match: opportunity.key_strength_match,
    risk_factor: opportunity.risk_factor,
    action_plan: opportunity.action_plan,
    organization: opportunity.organization || null,
    type: opportunity.type || null,
    location: opportunity.location || null,
    duration: opportunity.duration || null,
    deadline: opportunity.deadline || null,
    difficulty: opportunity.difficulty || null,
    eligibility: opportunity.eligibility || null,
    tags: opportunity.tags || [],
    description: opportunity.description || null,
    link: opportunity.link || null,
  };
}

function readableGroupName(group) {
  const labels = {
    leadership: "Leadership experience",
    writing: "Writing strength",
    research: "Research experience",
    stem: "STEM alignment",
    business: "Business interest",
    art: "Creative skill",
    publicSpeaking: "Public speaking ability",
    community: "Community service record",
    athletics: "Athletic involvement",
  };

  return labels[group] || "Relevant experience";
}

function normalizeGradeAliases(gradeLevel) {
  const aliasMap = {
    "9th": ["9th", "freshman"],
    freshman: ["9th", "freshman"],
    "10th": ["10th", "sophomore"],
    sophomore: ["10th", "sophomore"],
    "11th": ["11th", "junior"],
    junior: ["11th", "junior"],
    "12th": ["12th", "senior"],
    senior: ["12th", "senior"],
    "8th": ["8th"],
  };

  return aliasMap[gradeLevel] || [gradeLevel];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function renderResults(result) {
  latestJson = JSON.stringify(result, null, 2);
  output.textContent = latestJson;
  renderCards(result.top_opportunities);
  if (!resultStatus.textContent || resultStatus.textContent.startsWith("Waiting")) {
    updateResultStatus(result.top_opportunities);
  }
}

function renderCards(opportunities) {
  if (!opportunities.length) {
    resultCards.innerHTML = `
      <article class="result-card">
        <p>No ranked opportunities yet. Add a student profile and at least one opportunity block to generate results.</p>
      </article>
    `;
    return;
  }

  resultCards.innerHTML = opportunities.map((opportunity, index) => `
    <article class="result-card">
      <div class="result-card-header">
        <div class="result-title-wrap">
          <span class="result-rank">${index + 1}</span>
          <h3>${escapeHtml(opportunity.name)}</h3>
        </div>
        <div class="result-score">
          <strong>${opportunity.chance_score}</strong>
          <span>Chance Score</span>
        </div>
      </div>
      <div class="chance-pill ${chanceClass(opportunity.chance_level)}">${escapeHtml(opportunity.chance_level)}</div>
      <p><span class="result-label">Why it fits:</span> ${escapeHtml(opportunity.reason)}</p>
      <p><span class="result-label">Strength match:</span> ${escapeHtml(opportunity.key_strength_match)}</p>
      <p><span class="result-label">Risk:</span> ${escapeHtml(opportunity.risk_factor)}</p>
      <p><span class="result-label">Next move:</span> ${escapeHtml(opportunity.action_plan)}</p>
      ${opportunity.link ? `<p><span class="result-label">Source:</span> <a href="${escapeHtml(opportunity.link)}" target="_blank" rel="noreferrer">View program</a></p>` : ""}
    </article>
  `).join("");
}

function updateResultStatus(opportunities) {
  if (!opportunities.length) {
    resultStatus.textContent = "Waiting for enough input to rank opportunities.";
    return;
  }

  const highCount = opportunities.filter((item) => item.chance_level === "HIGH").length;
  resultStatus.textContent = `Ranked ${opportunities.length} opportunities. ${highCount} marked as high-probability plays.`;
}

function showMissingProfileState(message) {
  resultStatus.textContent = message;
  studentProfileInput.focus();
  renderCards([]);
  latestJson = `{
  "top_opportunities": []
}`;
  output.textContent = latestJson;
}

function chanceClass(level) {
  if (level === "HIGH") {
    return "chance-high";
  }

  if (level === "MEDIUM") {
    return "chance-medium";
  }

  return "chance-low";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseTags(value) {
  if (!value.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function catalogToTextarea(items) {
  return items.map((item) => {
    const fields = [
      `Name: ${item.name}`,
      `Organization: ${item.organization}`,
      `Type: ${item.type}`,
      `Location: ${item.location}`,
      `Duration: ${item.duration}`,
      `Deadline: ${item.deadline ?? "null"}`,
      `Difficulty: ${item.difficulty}`,
      `Eligibility: ${item.eligibility}`,
      `Tags: ${item.tags.join(", ")}`,
      `Description: ${item.description}`,
      `Requirements: ${item.requirements}`,
      `Competitiveness: ${item.competitiveness}`,
      `Upside: ${item.upside}`,
      `Link: ${item.link}`
    ];

    return fields.join("\n");
  }).join("\n\n");
}

function renderCatalog(items) {
  catalogGrid.innerHTML = items.map((item) => `
    <article class="catalog-card">
      <div class="catalog-meta">
        <span class="catalog-pill">${escapeHtml(item.type)}</span>
        <span class="catalog-pill">${escapeHtml(item.difficulty)}</span>
      </div>
      <h3>${escapeHtml(item.name)}</h3>
      <p><span class="result-label">Organization:</span> ${escapeHtml(item.organization)}</p>
      <p><span class="result-label">Location:</span> ${escapeHtml(item.location)}</p>
      <p><span class="result-label">Duration:</span> ${escapeHtml(item.duration)}</p>
      <p><span class="result-label">Eligibility:</span> ${escapeHtml(item.eligibility)}</p>
      <p>${escapeHtml(item.description)}</p>
      <div class="catalog-tags">
        ${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
      </div>
      <a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">Open source listing</a>
    </article>
  `).join("");
}

renderCatalog(catalogOpportunities);
inputHint.textContent = "Generate Top 3 uses the pasted list. Use Website Opportunities ranks the student against the built-in Snowday catalog.";

const studentProfileInput = document.getElementById("studentProfile");
const opportunitiesInput = document.getElementById("opportunities");
const resultCards = document.getElementById("resultCards");
const resultStatus = document.getElementById("resultStatus");
const inputHint = document.getElementById("inputHint");
const analyzeButton = document.getElementById("analyzeButton");
const analyzeCatalogButton = document.getElementById("analyzeCatalogButton");
const loadSampleButton = document.getElementById("loadSampleButton");
const loadCatalogButton = document.getElementById("loadCatalogButton");
const catalogGrid = document.getElementById("catalogGrid");
const catalogCount = document.getElementById("catalogCount");

const catalogOpportunities = Array.isArray(window.catalogOpportunities) ? window.catalogOpportunities : [];

const keywordGroups = {
  leadership: ["leader", "leadership", "captain", "president", "founder", "organize", "advocacy"],
  writing: ["writing", "essay", "journalism", "editor", "blog", "storytelling", "media"],
  research: ["research", "analysis", "science fair", "investigation", "lab", "biomedical", "genetics"],
  stem: ["math", "science", "engineering", "robotics", "coding", "computer science", "stem", "technology"],
  business: ["business", "entrepreneurship", "marketing", "finance", "startup", "deca"],
  art: ["art", "design", "illustration", "photography", "creative", "acting", "theater", "film", "game design"],
  publicSpeaking: ["debate", "speech", "public speaking", "model un", "presentation", "pitch"],
  community: ["community service", "volunteer", "service", "nonprofit", "mentoring", "tutoring", "social impact"],
  athletics: ["sports", "athlete", "varsity", "track", "basketball", "soccer"],
  medicine: ["medicine", "healthcare", "doctor", "clinical", "hospital", "patient"],
  law: ["law", "legal", "policy", "government", "justice"]
};

const competitivenessKeywords = {
  18: ["highly competitive", "highly selective", "selective", "prestigious", "elite"],
  42: ["competitive", "rigorous", "application required"],
  70: ["moderate", "regional"],
  90: ["open enrollment", "rolling", "beginner-friendly"]
};

const gradePattern = /\b(8th|9th|10th|11th|12th|freshman|sophomore|junior|senior)\b/gi;

analyzeButton.addEventListener("click", () => {
  if (!studentProfileInput.value.trim()) {
    showMissingProfileState("Add a student profile first, then I can score the custom opportunity list.");
    return;
  }

  if (!opportunitiesInput.value.trim()) {
    resultStatus.textContent = "Paste at least one opportunity block or use the website opportunity catalog.";
    opportunitiesInput.focus();
    return;
  }

  renderResults(rankOpportunities(studentProfileInput.value, opportunitiesInput.value), "Recommendations built from your pasted opportunity list.");
});

analyzeCatalogButton.addEventListener("click", () => {
  if (!studentProfileInput.value.trim()) {
    showMissingProfileState("Add a student profile first, then I can match it against the website opportunity catalog.");
    return;
  }

  renderResults(rankCatalog(studentProfileInput.value), `Matched the student against ${catalogOpportunities.length} built-in website opportunities.`);
});

loadCatalogButton.addEventListener("click", () => {
  opportunitiesInput.value = catalogToTextarea(catalogOpportunities);
  resultStatus.textContent = `Loaded ${catalogOpportunities.length} website opportunities into the custom input box.`;
  opportunitiesInput.focus();
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

  renderResults(rankOpportunities(studentProfileInput.value, opportunitiesInput.value), "Loaded the sample profile and sample opportunities.");
});

function rankOpportunities(studentProfile, rawOpportunities) {
  const opportunities = parseOpportunities(rawOpportunities);
  return !studentProfile.trim() || opportunities.length === 0
    ? emptyResult()
    : buildRecommendationResult(opportunities, buildStudentSignals(studentProfile));
}

function rankCatalog(studentProfile) {
  return !studentProfile.trim()
    ? emptyResult()
    : buildRecommendationResult(catalogOpportunities, buildStudentSignals(studentProfile));
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
        name: fields.name || lines[0] || "Unnamed Opportunity",
        organization: fields.organization || "",
        type: fields.type || "",
        location: fields.location || "",
        duration: fields.duration || "",
        deadline: normalizeNullable(fields.deadline),
        difficulty: normalizeNullable(fields.difficulty) || "",
        eligibility: fields.eligibility || "",
        tags: parseTags(fields.tags || ""),
        description: fields.description || "",
        link: normalizeNullable(fields.link),
        requirements: fields.requirements || "",
        competitiveness: fields.competitiveness || "",
        upside: fields.upside || ""
      };
    });
}

function buildStudentSignals(profile) {
  const text = profile.toLowerCase();
  return {
    text,
    keywordHits: Object.entries(keywordGroups)
      .filter(([, words]) => words.some((word) => text.includes(word)))
      .map(([group]) => group),
    gradeLevel: extractGradeLevel(text),
    hasStrongTrackRecord: /(finalist|winner|captain|editor|president|founder|qualifier|officer|published|award)/i.test(profile),
    hasExperience: /(internship|research|volunteer|job shadow|leadership|project|competition|club|tutor)/i.test(profile)
  };
}

function buildRecommendationResult(opportunities, studentSignals) {
  const scored = opportunities.map((opportunity) => scoreOpportunity(opportunity, studentSignals));
  const kept = scored.filter((item) => !item.rejection_reason);
  const rejected = scored.filter((item) => item.rejection_reason);
  const recommendations = (kept.length >= 3 ? kept : scored)
    .sort((a, b) => b.chance_score - a.chance_score)
    .slice(0, 3);

  return {
    recommendations,
    rejected_summary: buildRejectedSummary(rejected, opportunities.length, recommendations.length)
  };
}

function scoreOpportunity(opportunity, studentSignals) {
  const searchable = [
    opportunity.name,
    opportunity.organization,
    opportunity.type,
    opportunity.location,
    opportunity.duration,
    opportunity.deadline || "",
    opportunity.difficulty,
    opportunity.eligibility,
    opportunity.tags.join(" "),
    opportunity.description,
    opportunity.requirements,
    opportunity.competitiveness,
    opportunity.upside
  ].join(" ").toLowerCase();

  const fit = scoreFit(searchable, studentSignals);
  const difficultyMatch = scoreDifficulty(opportunity, searchable, studentSignals);
  const competitiveness = scoreCompetitiveness(searchable);
  const accessibility = scoreAccessibility(opportunity, searchable, studentSignals);
  const chanceScore = Math.round(fit * 0.42 + difficultyMatch * 0.25 + competitiveness * 0.18 + accessibility * 0.15);

  return {
    ...opportunity,
    chance_score: clamp(chanceScore, 0, 100),
    chance_level: chanceScore >= 78 ? "HIGH" : chanceScore >= 58 ? "MEDIUM" : "LOW",
    why_best_match: buildReason(opportunity, difficultyMatch, competitiveness, accessibility, studentSignals),
    next_step: buildActionPlan(opportunity),
    risk_factor: buildRiskFactor(opportunity, difficultyMatch, competitiveness, accessibility),
    rejection_reason: getRejectionReason(opportunity, fit, difficultyMatch, accessibility, studentSignals, searchable)
  };
}

function scoreFit(searchable, studentSignals) {
  const matches = studentSignals.keywordHits.filter((group) =>
    keywordGroups[group].some((word) => searchable.includes(word))
  ).length;
  const base = 28 + matches * 17;
  const bonus = studentSignals.hasExperience && /research|leadership|pitch|writing|science|business|coding|law|medicine/.test(searchable) ? 10 : 0;
  return clamp(base + bonus, 18, 98);
}

function scoreDifficulty(opportunity, searchable, studentSignals) {
  const difficultyText = `${opportunity.difficulty} ${searchable}`;
  if (/very hard|highly selective|elite|advanced/.test(difficultyText)) return studentSignals.hasStrongTrackRecord ? 56 : 30;
  if (/hard|competitive|intensive/.test(difficultyText)) return studentSignals.hasExperience ? 68 : 48;
  if (/easy|open enrollment|rolling/.test(difficultyText)) return 88;
  return studentSignals.hasExperience ? 78 : 62;
}

function scoreCompetitiveness(searchable) {
  for (const [score, words] of Object.entries(competitivenessKeywords)) {
    if (words.some((word) => searchable.includes(word))) return Number(score);
  }
  return 58;
}

function scoreAccessibility(opportunity, searchable, studentSignals) {
  let score = 76;
  if (studentSignals.gradeLevel) {
    const gradeTerms = normalizeGradeAliases(studentSignals.gradeLevel);
    if (gradeTerms.some((term) => searchable.includes(term))) {
      score = 92;
    } else if (/undergraduate|college student|graduate/.test(searchable)) {
      score = 18;
    }
  }
  if (/open to all high school students|high school students|teen/.test(searchable)) score = Math.max(score, 88);
  if (/age 16\+|18\+/.test(searchable) && !/16|17|18/.test(studentSignals.text)) score -= 12;
  if (/financial need|low-income/.test(searchable) && !/low-income|financial need/.test(studentSignals.text)) score -= 10;
  return clamp(score, 10, 96);
}

function getRejectionReason(opportunity, fit, difficultyMatch, accessibility, studentSignals, searchable) {
  if (accessibility < 34) return "they do not clearly meet the grade-level or eligibility requirements";
  if (difficultyMatch < 34) return "the program appears too advanced for the student's current experience";
  if (fit < 40) return "the opportunity has weak alignment with the student's interests and strengths";
  if (/rising ninth graders/i.test(opportunity.eligibility) && !matchesGrade(searchable, studentSignals.gradeLevel)) return "the opportunity targets a different grade band";
  return "";
}

function buildReason(opportunity, difficultyMatch, competitiveness, accessibility, studentSignals) {
  const strengths = studentSignals.keywordHits.length
    ? studentSignals.keywordHits.map(readableGroupName).slice(0, 2).join(" and ")
    : "the student's current profile";
  const difficultyText = difficultyMatch >= 72 ? "The difficulty level looks appropriate for where the student is now." : "The program is a mild stretch, but still realistic.";
  const competitionText = competitiveness >= 70 ? "It is more accessible than the most selective prestige-heavy options." : "Competition is still meaningful, but the fit justifies keeping it near the top.";
  const accessText = accessibility >= 82 ? "Eligibility alignment is strong." : "Eligibility should be checked carefully before applying.";
  return `${opportunity.name} stands out because it lines up with ${strengths}, which match the program's focus areas. ${difficultyText} ${competitionText} ${accessText}`;
}

function buildActionPlan(opportunity) {
  const steps = [`Open the official listing for ${opportunity.name}.`];
  if (/essay|writing|journalism/i.test(opportunity.requirements)) {
    steps.push("Draft one short example today that proves writing strength or thoughtful reflection.");
  } else if (/pitch|startup|entrepreneurship|presentation/i.test(opportunity.requirements)) {
    steps.push("Create a one-page idea outline and practice a 60-second pitch immediately.");
  } else if (/research|lab|biomedical|science/i.test(opportunity.requirements)) {
    steps.push("Write a short research-interest paragraph and list the strongest science experiences to highlight.");
  } else if (/acting|theater|art|game design/i.test(opportunity.requirements + " " + opportunity.tags.join(" "))) {
    steps.push("Collect the strongest creative sample or performance example and tailor it to the program theme.");
  } else {
    steps.push("Make a simple checklist of requirements and finish the hardest application item first.");
  }
  return steps.join(" ");
}

function buildRiskFactor(opportunity, difficultyMatch, competitiveness, accessibility) {
  if (accessibility < 45) return "Eligibility is the biggest risk for this one.";
  if (difficultyMatch < 45) return "The program may expect more experience than the student currently shows.";
  if (competitiveness < 35) return "The main risk is intense selectivity rather than poor fit.";
  if ((opportunity.deadline || "").toLowerCase() === "rolling") return "Rolling programs get harder later, so timing matters.";
  return "Execution quality is the main swing factor here.";
}

function buildRejectedSummary(rejected, totalCount, selectedCount) {
  if (!rejected.length) {
    return selectedCount < totalCount
      ? "Some lower-scoring opportunities were left out because stronger realistic fits were available."
      : "No opportunities were filtered out before choosing the top three.";
  }
  const reasons = {};
  for (const item of rejected) reasons[item.rejection_reason] = (reasons[item.rejection_reason] || 0) + 1;
  const summary = Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([reason]) => reason).join(" and ");
  return `Rejected ${rejected.length} opportunities mainly because ${summary}.`;
}

function renderResults(result, prefix) {
  renderCards(result.recommendations, result.rejected_summary);
  if (!result.recommendations.length) {
    resultStatus.textContent = "Waiting for enough input to generate recommendations.";
    return;
  }
  const highCount = result.recommendations.filter((item) => item.chance_level === "HIGH").length;
  resultStatus.textContent = `${prefix} ${highCount} of the selected recommendations are high-probability matches. ${result.rejected_summary}`;
}

function renderCards(opportunities, rejectedSummary) {
  if (!opportunities.length) {
    resultCards.innerHTML = `<article class="result-card"><p>No recommendations yet. Add a student profile and either paste opportunities or use the website catalog.</p></article>`;
    return;
  }

  resultCards.innerHTML = opportunities.map((opportunity, index) => `
    <article class="result-card">
      <div class="result-card-header">
        <div class="result-title-wrap">
          <span class="result-rank">${index + 1}</span>
          <div>
            <h3>${escapeHtml(opportunity.name)}</h3>
            <p><span class="result-label">${escapeHtml(opportunity.organization || "Opportunity")}</span>${opportunity.location ? ` • ${escapeHtml(opportunity.location)}` : ""}</p>
          </div>
        </div>
        <div class="result-score"><strong>${opportunity.chance_score}</strong><span>Chance Score</span></div>
      </div>
      <div class="chance-pill ${chanceClass(opportunity.chance_level)}">${escapeHtml(opportunity.chance_level)}</div>
      <p><span class="result-label">Why it fits:</span> ${escapeHtml(opportunity.why_best_match)}</p>
      <p><span class="result-label">Risk:</span> ${escapeHtml(opportunity.risk_factor)}</p>
      <p><span class="result-label">Next step:</span> ${escapeHtml(opportunity.next_step)}</p>
      ${opportunity.link ? `<p><a href="${escapeHtml(opportunity.link)}" target="_blank" rel="noreferrer">Open source listing</a></p>` : ""}
    </article>
  `).join("") + `<article class="result-card"><p><span class="result-label">Rejected summary:</span> ${escapeHtml(rejectedSummary)}</p></article>`;
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
      <p><span class="result-label">Duration:</span> ${escapeHtml(item.duration || "Not listed")}</p>
      <p><span class="result-label">Eligibility:</span> ${escapeHtml(item.eligibility)}</p>
      <p>${escapeHtml(item.description)}</p>
      <div class="catalog-tags">${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">View on Snowday</a>` : ""}
    </article>
  `).join("");
}

function showMissingProfileState(message) {
  resultStatus.textContent = message;
  studentProfileInput.focus();
  renderCards([], "");
}

function parseTags(value) {
  return value.trim() ? value.split(",").map((tag) => tag.trim()).filter(Boolean) : [];
}

function normalizeNullable(value) {
  if (!value) return null;
  const normalized = value.trim();
  return /^(null|none|n\/a)$/i.test(normalized) ? null : normalized;
}

function catalogToTextarea(items) {
  return items.map((item) => [
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
    `Link: ${item.link ?? "null"}`
  ].join("\n")).join("\n\n");
}

function matchesGrade(searchable, gradeLevel) {
  return !gradeLevel || normalizeGradeAliases(gradeLevel).some((term) => searchable.includes(term));
}

function normalizeGradeAliases(gradeLevel) {
  const aliasMap = {
    "8th": ["8th"],
    "9th": ["9th", "freshman", "ninth"],
    freshman: ["9th", "freshman", "ninth"],
    "10th": ["10th", "sophomore", "tenth"],
    sophomore: ["10th", "sophomore", "tenth"],
    "11th": ["11th", "junior", "eleventh"],
    junior: ["11th", "junior", "eleventh"],
    "12th": ["12th", "senior", "twelfth"],
    senior: ["12th", "senior", "twelfth"]
  };
  return aliasMap[gradeLevel] || [gradeLevel];
}

function extractGradeLevel(text) {
  const match = text.match(gradePattern);
  return match ? match[0].toLowerCase() : "";
}

function readableGroupName(group) {
  const labels = {
    leadership: "leadership experience",
    writing: "writing strength",
    research: "research experience",
    stem: "STEM alignment",
    business: "business interest",
    art: "creative ability",
    publicSpeaking: "public speaking ability",
    community: "community service",
    athletics: "athletic involvement",
    medicine: "healthcare interest",
    law: "law or policy interest"
  };
  return labels[group] || "relevant experience";
}

function chanceClass(level) {
  if (level === "HIGH") return "chance-high";
  if (level === "MEDIUM") return "chance-medium";
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function emptyResult() {
  return { recommendations: [], rejected_summary: "" };
}

catalogCount.textContent = String(catalogOpportunities.length);
renderCatalog(catalogOpportunities);
inputHint.textContent = "Analyze My List scores the pasted opportunities. Use Website Opportunities ranks the student against the built-in Snowday catalog.";

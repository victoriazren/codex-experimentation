const form = document.querySelector("#event-form");
const summary = document.querySelector("#summary");
const checklist = document.querySelector("#checklist");
const options = document.querySelector("#options");
const watch = document.querySelector("#watch");
const questions = document.querySelector("#questions");

const OFFICIAL_GUIDELINES = {
  label: "Stanford OSE Event Planning Guidelines",
  url: "https://ose.stanford.edu/student-orgs/event-planning/event-planning-guidelines",
};

const requiredFields = [
  { name: "eventType", label: "Event type and purpose" },
  { name: "dateTime", label: "Date and time" },
  { name: "location", label: "Location" },
  { name: "attendance", label: "Expected attendance" },
  { name: "host", label: "Hosting group" },
  { name: "food", label: "Food or drink plans" },
  { name: "av", label: "Audio/visual needs" },
  { name: "budget", label: "Budget range and funding source" },
  { name: "accessibility", label: "Accessibility needs" },
];

const riskLabels = {
  alcohol: "Alcohol",
  minors: "Minors",
  amplified: "Amplified sound",
  outdoors: "Outdoors",
  latenight: "Late-night",
  ticketing: "Ticketing or cash handling",
  vendors: "External vendors or contracts",
  cooking: "Cooking, flames, or special equipment",
};

const getFormData = () => {
  const data = new FormData(form);
  const risks = data.getAll("risk");
  return {
    eventType: data.get("eventType")?.trim(),
    dateTime: data.get("dateTime")?.trim(),
    location: data.get("location")?.trim(),
    attendance: data.get("attendance")?.trim(),
    host: data.get("host")?.trim(),
    food: data.get("food")?.trim(),
    av: data.get("av")?.trim(),
    budget: data.get("budget")?.trim(),
    accessibility: data.get("accessibility")?.trim(),
    risks,
  };
};

const renderList = (items) => {
  if (!items.length) {
    return "<p class=\"muted\">None.</p>";
  }
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
};

const formatValue = (value, fallback = "Not provided") =>
  value && value.length ? value : fallback;

const buildSummary = (data) => {
  const riskItems = data.risks.map((risk) => riskLabels[risk]);
  const keyNeeds = [
    data.food && data.food !== "none" ? `Food/drink: ${data.food}` : null,
    data.av ? `A/V: ${data.av}` : null,
    data.accessibility ? `Accessibility: ${data.accessibility}` : null,
    riskItems.length ? `Risk flags: ${riskItems.join(", ")}` : null,
  ].filter(Boolean);

  return `
    <p><strong>Event:</strong> ${formatValue(data.eventType)}</p>
    <p><strong>Date & time:</strong> ${formatValue(data.dateTime)}</p>
    <p><strong>Location:</strong> ${formatValue(data.location)}</p>
    <p><strong>Size:</strong> ${formatValue(data.attendance)}</p>
    <p><strong>Hosting group:</strong> ${formatValue(data.host)}</p>
    <p><strong>Key needs detected:</strong></p>
    ${renderList(keyNeeds)}
  `;
};

const buildChecklist = (data) => {
  const steps = [
    {
      owner: "Office of Student Engagement (OSE)",
      why: "Central Stanford guidance for student event planning and required routing.",
      lead: "Not specified — confirm with owner",
      cost: "Not specified",
      link: OFFICIAL_GUIDELINES,
      access: "Public",
      notes: "Review before booking venues or signing agreements.",
    },
    {
      owner: "Venue or building manager",
      why: "Venue-specific availability, capacity, and safety constraints.",
      lead: "Not specified — confirm with owner",
      cost: "Not specified",
      link: OFFICIAL_GUIDELINES,
      access: "Public",
      notes: "Confirm room reservations, occupancy limits, and equipment rules.",
    },
  ];

  if (data.food && data.food !== "none") {
    steps.push({
      owner: "Venue or Stanford dining service",
      why: "Food service often requires approved caterers or venue rules.",
      lead: "Not specified — confirm with owner",
      cost: "Not specified",
      link: OFFICIAL_GUIDELINES,
      access: "Public",
      notes:
        "Ask about approved caterers, food safety, and cleanup requirements.",
    });
  }

  if (data.av) {
    steps.push({
      owner: "Venue AV or campus tech support",
      why: "Ensure microphones, projectors, or livestreams meet venue standards.",
      lead: "Not specified — confirm with owner",
      cost: "Not specified",
      link: OFFICIAL_GUIDELINES,
      access: "Public",
      notes: "Verify any setup or technician requirements.",
    });
  }

  if (data.risks.length) {
    steps.push({
      owner: "OSE and venue-specific approvers",
      why: "High-risk elements may require additional approvals or safety plans.",
      lead: "Not specified — confirm with owner",
      cost: "Not specified",
      link: OFFICIAL_GUIDELINES,
      access: "Public",
      notes:
        "Contact OSE for routing and confirm with your venue who must approve each risk flag.",
    });
  }

  return `
    <ol class="checklist">
      ${steps
        .map(
          (step) => `
        <li>
          <p><strong>Owner:</strong> ${step.owner}</p>
          <p><strong>Why:</strong> ${step.why}</p>
          <p><strong>Lead time:</strong> ${step.lead}</p>
          <p><strong>Cost:</strong> ${step.cost}</p>
          <p><strong>Link:</strong> <a href="${step.link.url}" target="_blank" rel="noopener">${step.link.label}</a></p>
          <p><strong>Access note:</strong> ${step.access}</p>
          <p><strong>Notes / constraints:</strong> ${step.notes}</p>
        </li>
      `
        )
        .join("")}
    </ol>
  `;
};

const buildOptions = (data) => {
  const optionItems = [];

  if (data.food && data.food !== "none") {
    optionItems.push(
      "Option 1: Use venue-approved or Stanford-affiliated catering (confirm requirements with the venue manager).",
      "Option 2: Adjust to light refreshments if catering approvals are not available in time."
    );
  }

  if (data.av) {
    optionItems.push(
      "Option 1: Use venue-provided AV to ensure compatibility with room systems.",
      "Option 2: Bring portable equipment only if the venue permits it."
    );
  }

  if (!optionItems.length) {
    return "<p class=\"muted\">No options to compare yet.</p>";
  }

  return `${renderList(optionItems)}
    <p class="links">Reference: <a href="${OFFICIAL_GUIDELINES.url}" target="_blank" rel="noopener">${OFFICIAL_GUIDELINES.label}</a></p>
  `;
};

const buildWatchList = (data) => {
  const items = [];
  if (data.location) {
    items.push("Venue-specific rules may override general guidance; confirm with the venue manager.");
  }
  if (data.risks.length) {
    items.push(
      "High-risk elements require additional approvals; confirm the owning office for each risk flag."
    );
  }
  if (data.food && data.food !== "none") {
    items.push("Food service rules vary by venue; ask about approved caterers and cleanup.");
  }
  if (data.attendance) {
    items.push("Attendance estimates affect room capacity and safety requirements.");
  }
  if (!items.length) {
    items.push("Add event details to surface policy dependencies.");
  }

  return renderList(items);
};

const buildQuestions = (data) => {
  const missing = requiredFields.filter((field) => !data[field.name]);
  if (!missing.length) {
    return "<p class=\"muted\">No further questions needed right now.</p>";
  }

  return renderList(
    missing.map((field) => `Please provide: ${field.label}.`)
  );
};

const updateOutput = (data) => {
  summary.innerHTML = buildSummary(data);
  checklist.innerHTML = buildChecklist(data);
  options.innerHTML = buildOptions(data);
  watch.innerHTML = buildWatchList(data);
  questions.innerHTML = buildQuestions(data);

  [summary, checklist, options, watch, questions].forEach((section) => {
    section.classList.remove("muted");
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = getFormData();
  updateOutput(data);
});

form.addEventListener("reset", () => {
  [summary, checklist, options, watch, questions].forEach((section) => {
    section.innerHTML = section.dataset.placeholder || section.innerHTML;
    section.classList.add("muted");
  });
});

[summary, checklist, options, watch, questions].forEach((section) => {
  section.dataset.placeholder = section.innerHTML;
});

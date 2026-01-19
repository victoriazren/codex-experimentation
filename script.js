const feelingRange = document.querySelector("#feeling-range");
const feelingLabel = document.querySelector("#feeling-label");
const saveButton = document.querySelector("#save-button");
const saveMessage = document.querySelector("#save-message");
const calendarGrid = document.querySelector("#calendar-grid");

const feelingMap = {
  0: "Bright & Breezy",
  1: "Little Under the Weather",
  2: "Resting by the Fire",
  3: "Shire-Healer Visit",
  4: "Athelas Needed",
};

const today = new Date();
const currentYear = today.getFullYear();
const storageKey = `shire-wellness-${currentYear}`;

const loadEntries = () => {
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : {};
};

const saveEntries = (entries) => {
  localStorage.setItem(storageKey, JSON.stringify(entries));
};

const entries = loadEntries();

const updateFeelingLabel = (value) => {
  feelingLabel.textContent = feelingMap[value];
};

const pad = (value) => String(value).padStart(2, "0");

const createDayElement = (date, level) => {
  const day = document.createElement("div");
  day.className = "day";
  day.dataset.day = date.getDate();
  day.dataset.date = date.toISOString().slice(0, 10);
  if (typeof level !== "undefined") {
    day.classList.add(`level-${level}`);
  }
  return day;
};

const renderCalendar = () => {
  calendarGrid.innerHTML = "";
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });

  for (let month = 0; month < 12; month += 1) {
    const monthWrapper = document.createElement("div");
    monthWrapper.className = "month";

    const title = document.createElement("div");
    title.className = "month-title";
    title.textContent = monthFormatter.format(new Date(currentYear, month, 1));

    const grid = document.createElement("div");
    grid.className = "day-grid";

    const firstDay = new Date(currentYear, month, 1);
    const lastDay = new Date(currentYear, month + 1, 0);
    const startOffset = firstDay.getDay();

    for (let i = 0; i < startOffset; i += 1) {
      const spacer = document.createElement("div");
      spacer.className = "day";
      spacer.setAttribute("aria-hidden", "true");
      spacer.style.visibility = "hidden";
      grid.appendChild(spacer);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const date = new Date(currentYear, month, day);
      const key = date.toISOString().slice(0, 10);
      const level = entries[key];
      grid.appendChild(createDayElement(date, level));
    }

    monthWrapper.appendChild(title);
    monthWrapper.appendChild(grid);
    calendarGrid.appendChild(monthWrapper);
  }
};

const saveTodayFeeling = () => {
  const value = Number(feelingRange.value);
  const key = `${currentYear}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  entries[key] = value;
  saveEntries(entries);
  renderCalendar();
  saveMessage.textContent = "Noted in the Red Book!";
  saveMessage.classList.add("visible");
};

feelingRange.addEventListener("input", (event) => {
  updateFeelingLabel(event.target.value);
});

saveButton.addEventListener("click", () => {
  saveTodayFeeling();
});

updateFeelingLabel(feelingRange.value);
renderCalendar();

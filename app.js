const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let cpiData = {};

function updateMonthOptions(year, select, defaultToEnd = false) {
  const current = select.value;
  select.innerHTML = "";
  const available = months.filter((m) => cpiData[year] && cpiData[year][m] !== undefined);
  available.forEach((m) => {
    const opt = document.createElement("option");
    opt.textContent = m;
    select.appendChild(opt);
  });
  if (available.length === 0) return;
  if (available.includes(current)) {
    select.value = current;
  } else {
    select.value = defaultToEnd ? available[available.length - 1] : available[0];
  }
}

async function loadCpiData() {
  const res = await fetch("CPI-Jan13-To-May25.xlsx");
  const buffer = await res.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });
  const headerRowIndex = 2; // Row number 3 in the sheet
  const header = rows[headerRowIndex];
  const yearCol = header.indexOf("Year");
  const monthCol = header.indexOf("Month");
  const indexCol = header.indexOf("Combined");
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    const year = row[yearCol];
    const month = row[monthCol];
    const value = parseFloat(row[indexCol]);
    if (year && month && !isNaN(value)) {
      if (!cpiData[year]) cpiData[year] = {};
      cpiData[year][month] = value;
    }
  }
}

function populateSelects() {
  const startMonthSel = document.getElementById("start-month");
  const endMonthSel = document.getElementById("end-month");
  const startYearSel = document.getElementById("start-year");
  const endYearSel = document.getElementById("end-year");

  const years = Object.keys(cpiData).sort();
  years.forEach((year) => {
    const opt1 = document.createElement("option");
    opt1.textContent = year;
    startYearSel.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.textContent = year;
    endYearSel.appendChild(opt2);
  });

  startYearSel.value = years[0];
  endYearSel.value = years[years.length - 1];

  updateMonthOptions(startYearSel.value, startMonthSel);
  updateMonthOptions(endYearSel.value, endMonthSel, true);

  startYearSel.addEventListener("change", () => {
    updateMonthOptions(startYearSel.value, startMonthSel);
  });

  endYearSel.addEventListener("change", () => {
    updateMonthOptions(endYearSel.value, endMonthSel, true);
  });
}

function calculate() {
  const amount = parseFloat(document.getElementById("amount").value);
  const startMonth = document.getElementById("start-month").value;
  const startYear = document.getElementById("start-year").value;
  const endMonth = document.getElementById("end-month").value;
  const endYear = document.getElementById("end-year").value;

  const startIndex = cpiData[startYear][startMonth];
  const endIndex = cpiData[endYear][endMonth];

  const result = (amount * endIndex) / startIndex;
  document.getElementById("result").textContent = result.toFixed(2);
}

document.getElementById("calc-form").addEventListener("submit", (e) => {
  e.preventDefault();
  calculate();
});

loadCpiData().then(() => {
  populateSelects();
  calculate();
});

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

function populateSelects() {
  const startMonthSel = document.getElementById("start-month");
  const endMonthSel = document.getElementById("end-month");
  const startYearSel = document.getElementById("start-year");
  const endYearSel = document.getElementById("end-year");

  months.forEach((m) => {
    const opt1 = document.createElement("option");
    opt1.textContent = m;
    startMonthSel.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.textContent = m;
    endMonthSel.appendChild(opt2);
  });

  Object.keys(cpiData).forEach((year) => {
    const opt1 = document.createElement("option");
    opt1.textContent = year;
    startYearSel.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.textContent = year;
    endYearSel.appendChild(opt2);
  });

  startMonthSel.value = "January";
  endMonthSel.value = "January";
  startYearSel.value = Object.keys(cpiData)[0];
  endYearSel.value = Object.keys(cpiData)[Object.keys(cpiData).length - 1];
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

populateSelects();
calculate();

// Import stylesheets
import "./style.css";

const buttonContainer = document.getElementById("buttons");
const tableDate = document.getElementById("pickedDate");
const table = document.getElementById("table");
const dropdownList = document.getElementById("dropdownList");
const rows = {};
const defaultBase = "RUB";

const dates = [];

function calculateDates(num) {
  for (let i = 0; i < num; ++i) {
    let date = new Date(Date.now() - 24 * 60 * 60 * 1000 * i);
    dates.push(
      date.getFullYear() +
        "-" +
        align(date.getMonth() + 1) +
        "-" +
        align(date.getDate())
    );
  }
}

function createButtons() {
  for (let date of dates) {
    const newButton = document.createElement("button");
    newButton.setAttribute("class", "button");
    newButton.innerHTML = date;
    newButton.onclick = () => {
      onButtonClick(newButton);
    };
    buttonContainer.appendChild(newButton);
  }
}

function onButtonClick(button) {
  tableDate.innerHTML = button.innerHTML;
  fetchRates(button.innerHTML, dropdownList.value);
}

function getTodayDate() {
  let date = new Date(Date.now());
  return (
    date.getFullYear() +
    "-" +
    align(date.getMonth() + 1) +
    "-" +
    align(date.getDate())
  );
}

function firstUpdateDate() {
  tableDate.innerHTML = getTodayDate();
}

function addCode(code, value) {
  const newRow = document.createElement("tr");
  const newCode = document.createElement("td");
  const newValue = document.createElement("td");
  const newOption = document.createElement("option");

  newRow.setAttribute("class", "row");
  newCode.setAttribute("class", "code");
  newValue.setAttribute("class", "value");
  newOption.setAttribute("class", "option");

  newCode.innerHTML = code;
  newValue.innerHTML = value;
  newOption.innerHTML = code;

  table.appendChild(newRow);
  newRow.appendChild(newCode);
  newRow.appendChild(newValue);
  dropdownList.appendChild(newOption);
  if (code === defaultBase) newOption.setAttribute("selected", "selected");

  rows[code] = newValue;
}

function onBaseChange() {
  fetchRates(tableDate.innerHTML, dropdownList.value);
}
dropdownList.onchange = onBaseChange;

function updateValues(code, value) {
  rows[code].innerHTML = value;
}

function fetchRates(date, code) {
  fetch(`https://api.exchangeratesapi.io/${date}?base=${code}`)
    .then(d => d.json())
    .then(d => {
      for (let [key, value] of Object.entries(d.rates)) {
        if (rows[key] != undefined) {
          updateValues(key, value);
        } else {
          addCode(key, value);
        }
      }
    });
}

function align(num, len = 2) {
  return ("0000" + num).slice(-len);
}

//insert number of buttons (days)
calculateDates(7);
createButtons();
firstUpdateDate();
fetchRates(getTodayDate(), defaultBase);

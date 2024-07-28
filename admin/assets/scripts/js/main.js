const getElement = (id) => document.getElementById(id);
const writeData = (data, element) => (element.textContent = data);

const turnover = getElement("#turnover");
const classicWash = getElement("#total-classic-wash");
const Options = getElement("#total-options");
const Finishing = getElement("#total-finishing");
const costs = getElement("#total-costs");
const results = getElement("#total-results");
const revenuPerCar = getElement("#revenu-per-car");
const totalVehicules = getElement("#total-vehicules");
const netMargin = getElement("#net-margin");
const profit = getElement("#profit");
const loss = getElement("#loss");

const fetchData = async (url = "", method = "GET", data = {}) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const queries = [""];

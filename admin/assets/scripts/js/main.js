const getElement = (id) => document.getElementById(id);
const writeData = (value, element) => (element.textContent = value);

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

const data = {
  turnover: {
    element: getElement("turnover"),
    url: "../assets/scripts/php/getTurnover.php",
  },
  turnoverCurYear: {
    element: getElement("turnover-curr-year"),
    url: "../assets/scripts/php/getCurrTurnover.php",
  },
};

const fetchData = async (url = "", method = "GET", data = {}) => {
  const options = {
    method,
    headers: {
      "Content-Type": "text; charset=utf-8",
    },
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.text();
};

const getData = () =>
  Object.keys(data).forEach(async (key) => {
    const element = data[key].element;
    const value = await fetchData(data[key].url)
      .then((response) => response)
      .catch((error) => console.error(error));

    writeData(value, element);
  });

const writeCurrYear = () =>
  (getElement("curr-year").textContent = new Date().getFullYear());

getData();
writeCurrYear();

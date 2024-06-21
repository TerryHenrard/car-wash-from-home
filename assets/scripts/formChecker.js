import services from "./services.js";

const getElement = (id) => document.getElementById(id);
const getElements = (selector) => [...document.querySelectorAll(selector)];

const createElement = (tag, textContent = null, attributes = null) => {
  const element = document.createElement(tag);

  if (textContent) {
    element.textContent = textContent;
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );
  }

  return element;
};

let order = {
  personnalInfos: {
    lastName: "",
    firstName: "",
    email: "",
    tel: "",
    address: "",
    city: "",
  },
  washingInfos: {
    carSize: "",
    classic: [],
    options: [],
    finishing: [],
    message: "",
    time: 0,
    price: 0,
  },
  appoitmentInfos: {
    date: null,
    hour: null,
  },
};

const form = getElement("contact-form");

const modal = {
  overlay: getElement("modal_overlay"),
  content: getElement("modal_content"),
  recap: getElement("modal_recap"),
  infoLeft: getElement("modal_info_left"),
  infoRight: getElement("modal_info_right"),
  closeButton: getElement("modal_close_button"),
  cancelButton: getElement("modal_button_cancel"),
  confirmButton: getElement("modal_button_confirm"),
};

const checkboxes = {
  classicWashes: getElements(".classicWash"),
  washOptions: getElements(".option"),
  washFinishing: getElements(".finishing"),
  termesAndConditions: getElement("courant-eau"),
  selectCarSize: getElement("taille"),
  priceSpan: getElement("price_value"),
  timeSpan: getElement("time_value"),
};

const carSizes = [
  "citadine",
  "berline_coupe",
  "break_suv",
  "camionnette_s",
  "camionnette_m",
  "camionnette_l",
];

const customerInfos = {
  lastName: {
    input: getElement("lastName"),
    label: getElement("label_lastName"),
    errorElement: getElement("message-error-lastName"),
    errorMsg: "le format du nom de famille est incorrect.",
    regex: /^[\p{L}\s\-.']{2,100}$/u,
  },
  firstName: {
    input: getElement("firstName"),
    label: getElement("label_firstName"),
    errorElement: getElement("message-error-firstName"),
    errorMsg: "le format du prénom est incorrect.",
    regex: /^[\p{L}\s\-.']{2,100}$/u,
  },
  email: {
    input: getElement("email"),
    label: getElement("label_email"),
    errorElement: getElement("message-error-email"),
    errorMsg: "le format de l'email est incorrect.",
    regex: /^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  tel: {
    input: getElement("tel"),
    label: getElement("label_tel"),
    errorElement: getElement("message-error-tel"),
    errorMsg: "le format du numéro de téléphone est incorrect.",
    regex:
      /^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/,
  },
  address: {
    input: getElement("adresse"),
    label: getElement("label_adresse"),
    errorElement: getElement("message-error-adresse"),
    errorMsg: "le format de l'adresse est incorrect.",
    regex: /^[\p{L}\d\s\.,#‘’'\-]{2,100}$/u,
  },
  city: {
    input: getElement("ville"),
    label: getElement("label_ville"),
    errorElement: getElement("message-error-ville"),
    errorMsg: "le format de la ville est incorrect.",
    regex: /^[\p{L}][\p{L}\d\s\.,#‘’'\-]{2,100}$/u,
  },
  message: {
    input: getElement("message"),
    label: getElement("label_message"),
    errorElement: getElement("message-error-message"),
    errorMsg: "Le texte est trop long ou contient des caractères interdits.",
    regex: /^[\p{L}a-zA-Z\d\s/,#‘’'"+:;?!+=$€*/@().-]{0,250}$/u,
  },
};

const supplements = {
  polissage: { element: getElement("polissage"), price: 50, time: 30 },
  ceramique_carrosserie: {
    element: getElement("ceramique_carrosserie"),
    price: 30,
    time: 15,
  },
};

const appointment = {
  date: {
    element: getElement("datepicker"),
  },
  hour: {
    element: getElement("time"),
    slots: ["08:30", "13:00"],
  },
};

const fetchData = async (method = "GET", url = "", data = {}) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  if (method === "POST") {
    options.body = JSON.stringify(data);
  } else if (method === "GET") {
    url += `?${new URLSearchParams(data).toString()}`;
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const updatePriceAndTimeAndDisplay = (price, time) => {
  order.washingInfos.price += price;
  order.washingInfos.time += time;
  checkboxes.priceSpan.textContent = `${order.washingInfos.price}€`;
  checkboxes.timeSpan.textContent =
    order.washingInfos.time > 60
      ? formatTime(order.washingInfos.time)
      : `${order.washingInfos.time}min`;
};

const formatTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}h${String(
    minutes % 60
  ).padStart(2, "0")}`;

const getWashServiceDetails = (type, id) =>
  type === "classic"
    ? services[id][checkboxes.selectCarSize.value]
    : services.options[id] || services.finishing[id];

const addSupplementForPolishAndCeramicAccordingToCarSize = (id, checked) => {
  const index = carSizes.indexOf(checkboxes.selectCarSize.value);
  const { price, time } = supplements[id];

  updatePriceAndTimeAndDisplay(
    checked ? price * index : -price * index,
    checked ? time * index : -time * index
  );
};

const handleCheckboxEvents = (checkboxes, type) => {
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("input", ({ target }) => {
      const { id, checked } = target;
      const { price, time } = getWashServiceDetails(type, id);

      if (id === "polissage" || id === "ceramique_carrosserie") {
        addSupplementForPolishAndCeramicAccordingToCarSize(id, checked);
      }

      updatePriceAndTimeAndDisplay(
        checked ? price : -price,
        checked ? time : -time
      );

      const dataName = target.getAttribute("data-name");

      checked
        ? order.washingInfos[type].push(dataName)
        : order.washingInfos[type].splice(
            order.washingInfos[type].indexOf(dataName),
            1
          );
    });
  });
};

const handleChangingCarSizeEvent = () => {
  let lastCarSize = checkboxes.selectCarSize.value;
  order.washingInfos.carSize = lastCarSize;

  checkboxes.selectCarSize.addEventListener("input", () => {
    const updateService = (oldPrice, newPrice, oldTime, newTime) =>
      updatePriceAndTimeAndDisplay(newPrice - oldPrice, newTime - oldTime);

    const getPriceTime = (service, carSize, isFinishing) => {
      if (isFinishing) {
        const supplement = supplements[service.id];
        const basePriceTime = services.finishing[service.id];
        const index = carSizes.indexOf(carSize);

        return {
          price: basePriceTime.price + index * supplement.price,
          time: basePriceTime.time + index * supplement.time,
        };
      }
      return services[service.id][carSize];
    };

    [
      ...checkboxes.classicWashes,
      supplements.polissage.element,
      supplements.ceramique_carrosserie.element,
    ].forEach((service) => {
      if (service.checked) {
        const oldValues = getPriceTime(
          service,
          lastCarSize,
          service.id !== "interiors" && service.id !== "exteriors"
        );
        const newValues = getPriceTime(
          service,
          checkboxes.selectCarSize.value,
          service.id !== "interiors" && service.id !== "exteriors"
        );
        updateService(
          oldValues.price,
          newValues.price,
          oldValues.time,
          newValues.time
        );
      }
    });

    lastCarSize = checkboxes.selectCarSize.value;
    order.washingInfos.carSize = lastCarSize;
  });
};

const handleRegexEvents = () => {
  Object.keys(customerInfos).forEach((key) => {
    const { input, regex, label, errorElement, errorMsg } = customerInfos[key];

    input.addEventListener("input", ({ target }) => {
      const isValid = regex.test(target.value);
      const hasValue = target.value !== "";
      const showError = !isValid && hasValue;

      [input, label, errorElement].forEach((el) =>
        el.classList.toggle("error-input", showError)
      );
      errorElement.textContent = showError ? errorMsg : "";

      if (isValid && hasValue) {
        const targetKey =
          target.tagName.toLowerCase() === "textarea"
            ? "washingInfos"
            : "personnalInfos";
        order[targetKey][key] = target.value;
      }
    });
  });
};

const setDatepicker = () => {
  const date = new Date();
  const minDate = new Date(date.setDate(date.getDate() + 2));
  const maxDate = new Date(date.setDate(date.getDate() + 60));

  const pad = (number) => (number < 10 ? `0${number}` : number);
  const reverseDate = (date) => date.split("-").reverse().join("/");
  const addDays = (date, days) => new Date(date.setDate(date.getDate() + days));

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
  };

  const getSpecificWeekdaysBetweenDates = (startDate, endDate, weekdays) => {
    const result = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    weekdays.forEach((weekday) => {
      let day = new Date(currentDate);
      day.setDate(day.getDate() + ((weekday - day.getDay() + 7) % 7));
      while (day <= end) {
        result.push(new Date(day));
        day.setDate(day.getDate() + 7);
      }
    });

    return result;
  };

  const findFirstNonExcludedDate = (startDate, excludedDates) => {
    const excludedSet = new Set(
      excludedDates.map((date) => new Date(date).getTime())
    );
    let currentDate = addDays(new Date(startDate), 1);

    while (excludedSet.has(currentDate.getTime())) {
      currentDate = addDays(currentDate, 1);
    }

    return formatDate(currentDate);
  };

  //TODO: not working
  /*const disableKeayboardOnFocus = () => {
    appointment.date.element.addEventListener("focus", (ev) =>
      ev.preventDefault()
    );
  };*/

  const unavailableDates = getSpecificWeekdaysBetweenDates(
    minDate,
    maxDate,
    [2, 7]
  );
  const firstNonExcludedDate = reverseDate(
    findFirstNonExcludedDate(
      formatDate(minDate),
      unavailableDates.map(formatDate)
    )
  );

  const options = {
    min: minDate,
    max: maxDate,
    without: unavailableDates,
  };

  appointment.date.element.setAttribute("placeholder", firstNonExcludedDate);
  new Datepicker(appointment.date.element, options);
};

const setTimeSlots = () => {
  appointment.hour.slots.forEach((slot) => {
    const option = createElement("option", slot, { value: slot });
    appointment.hour.element.appendChild(option);
  });

  order.appoitmentInfos.hour = appointment.hour.element.value;
};

const handleHourEvent = () => {
  appointment.hour.element.addEventListener(
    "input",
    ({ target: { value } }) => (order.appoitmentInfos.hour = value)
  );
};

const checkEmptyfieldOrder = () =>
  order.personnalInfos.lastName === "" ||
  order.personnalInfos.firstName === "" ||
  order.personnalInfos.email === "" ||
  order.personnalInfos.tel === "" ||
  order.personnalInfos.address === "" ||
  order.personnalInfos.city === ""
    ? true
    : false;

const openModal = () => toggleModalDisplay(true);
const closeModal = () => {
  toggleModalDisplay(false);
  clearModal();
};

const clearModal = () => {
  modal.infoLeft.innerHTML = "";
  modal.infoRight.innerHTML = "";
};

const toggleModalDisplay = (show) => {
  modal.overlay.style.display = show ? "block" : "none";
  document.body.classList.toggle("no-scroll", show);
};

const addInfosToModal = (objectKey, title, headers) => {
  const container = createModalContainer(objectKey);
  container.appendChild(createElement("h4", title));

  Object.values(order[objectKey]).forEach((value, index) => {
    const modalRow = createElement("div", null, { class: "modal_row" });
    const modalHeader = createElement("p", `${headers[index]} :`, {
      class: "modal_header",
    });
    const modalValue = createElement(
      "p",
      headers[index] === "Prix" ? `${value}€` : value,
      { class: "modal_value" }
    );

    modalRow.appendChild(modalHeader);
    modalRow.appendChild(modalValue);
    container.appendChild(modalRow);
  });

  modal.infoLeft.appendChild(container);
};

const addWashingInfosToModal = () => {
  const headers = [
    "Taille",
    "Lavage",
    "Options",
    "Finitions",
    "Message",
    "Durée",
    "Prix",
  ];
  const container = createModalContainer("washingInfos");
  container.appendChild(createElement("h4", "Information sur le nettoyage"));

  Object.values(order.washingInfos).forEach((value, index) => {
    const modalRow = createElement("div", null, { class: "modal_row" });
    const modalHeader = createElement("p", `${headers[index]} :`, {
      class: "modal_header",
    });
    const modalValue = createElement("div", null, { class: "modal_value" });

    if (Array.isArray(value)) {
      value.forEach((val, idx) => {
        modalValue.appendChild(createElement("p", `${idx + 1}. ${val}`));
      });
    } else if (headers[index] === "Durée") {
      modalValue.appendChild(createElement("p", formatTime(value)));
    } else if (headers[index] === "Prix") {
      modalValue.appendChild(createElement("p", `${value}€`));
    } else {
      modalValue.appendChild(createElement("p", value));
    }

    modalRow.appendChild(modalHeader);
    modalRow.appendChild(modalValue);
    container.appendChild(modalRow);
  });

  modal.infoRight.appendChild(container);
};

const createModalContainer = (className) =>
  createElement("div", null, { class: `modal_recap_${className}` });

const buildModal = () => {
  addInfosToModal("personnalInfos", "Informations personnelles", [
    "Nom",
    "Prénom",
    "Email",
    "Téléphone",
    "Adresse",
    "Ville",
  ]);
  addWashingInfosToModal();
  addInfosToModal("appoitmentInfos", "Informations sur le rendez-vous", [
    "Date",
    "Heure",
  ]);
};

const handleCloseModalEvent = () => {
  [modal.cancelButton, modal.closeButton, modal.overlay].forEach((button) =>
    button.addEventListener("click", () => closeModal())
  );
  modal.content.addEventListener("click", (ev) => ev.stopPropagation());
};

const handleConfirmModalEvent = () => {
  modal.confirmButton.addEventListener("click", () => {
    order.csrf_token = getElement("csrf_token").value;

    fetchData("POST", "./assets/scripts/mail.php", order)
      .then((response) => {
        if (response.success) {
          location.reload();
        }
      })
      .catch((error) => {
        console.log("Error handling submission:", error);
      });
  });
};

const handleSubmitEvent = () => {
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    order.appoitmentInfos.date = appointment.date.element.value
      ? appointment.date.element.value
      : appointment.date.element.getAttribute("placeholder");

    if (!checkEmptyfieldOrder() && checkboxes.termesAndConditions.checked) {
      buildModal();
      openModal();
    }
  });
};

const addCSRFToForm = () => {
  fetchData("GET", "./assets/scripts/generateCSRF.php")
    .then((csrf) => {
      form.appendChild(
        createElement("input", null, {
          type: "hidden",
          name: "csrf_token",
          value: csrf.csrf_token,
          id: "csrf_token",
        })
      );
    })
    .catch((error) => console.log(error));
};

document.addEventListener("DOMContentLoaded", () => addCSRFToForm());

handleRegexEvents();
handleChangingCarSizeEvent();
handleCheckboxEvents(checkboxes.classicWashes, "classic");
handleCheckboxEvents(checkboxes.washOptions, "options");
handleCheckboxEvents(checkboxes.washFinishing, "finishing");
handleRegexEvents();
setTimeSlots();
setDatepicker();
handleHourEvent();
handleCloseModalEvent();
handleConfirmModalEvent();
handleSubmitEvent();

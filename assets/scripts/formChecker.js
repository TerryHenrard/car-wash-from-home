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
  lastName: "",
  firstName: "",
  email: "",
  tel: "",
  address: "",
  city: "",
  carSize: "",
  message: "",
  classic: [],
  options: [],
  finishing: [],
  price: 0,
  time: 0,
  date: null,
  hour: null,
};

const form = getElement("contact-form");
const modal_overlay = getElement("modal_overlay");
const modal_content = getElement("modal_content");

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

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

const updatePriceAndTimeAndDisplay = (price, time) => {
  order.price += price;
  order.time += time;
  checkboxes.priceSpan.textContent = `${order.price}€`;
  checkboxes.timeSpan.textContent =
    order.time > 60 ? formatTime(order.time) : `${order.time}min`;
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
    checkbox.addEventListener("input", ({ target: { id, checked } }) => {
      const { price, time } = getWashServiceDetails(type, id);

      if (id === "polissage" || id === "ceramique_carrosserie") {
        addSupplementForPolishAndCeramicAccordingToCarSize(id, checked);
      }

      updatePriceAndTimeAndDisplay(
        checked ? price : -price,
        checked ? time : -time
      );

      checked
        ? order[type].push(id)
        : order[type].splice(order[type].indexOf(id), 1);
    });
  });
};

const handleChangingCarSizeEvent = () => {
  let lastCarSize = checkboxes.selectCarSize.value;
  order.carSize = lastCarSize;

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
    order.carSize = lastCarSize;
  });
};

const handleRegexEvents = () => {
  Object.keys(customerInfos).forEach((key) => {
    const { input, regex, label, errorElement, errorMsg } = customerInfos[key];

    input.addEventListener("input", ({ target: { value } }) => {
      const isValid = regex.test(value);
      const hasValue = value !== "";

      input.classList.toggle("error-input", !isValid && hasValue);
      label.classList.toggle("error-label", !isValid && hasValue);
      errorElement.classList.toggle("message-error", !isValid && hasValue);
      errorElement.textContent = hasValue && !isValid ? errorMsg : "";

      if (isValid && hasValue) {
        order[key] = value;
      }
    });
  });
};

handleRegexEvents();

const setDatepicker = () => {
  const date = new Date();
  const minDate = new Date(date.setDate(date.getDate() + 1));
  const maxDate = new Date(date.setDate(date.getDate() + 60));

  const formatDate = (date) => date.toISOString().split("T")[0];
  const reverseDate = (date) => date.split("-").reverse().join("/");
  const addDays = (date, days) => new Date(date.setDate(date.getDate() + days));

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
    [1, 6]
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

  order.hour = appointment.hour.element.value;
};

const handleHourEvent = () => {
  appointment.hour.element.addEventListener(
    "input",
    ({ target: { value } }) => (order.hour = value)
  );
};

const checkEmptyfieldOrder = () =>
  order.lastName === "" ||
  order.firstName === "" ||
  order.email === "" ||
  order.tel === "" ||
  order.address === "" ||
  order.city === ""
    ? true
    : false;

const openModal = () => {
  modal_overlay.style.display = "block";
  document.body.classList.add("no-scroll");
};

const closeModal = () => {
  modal_overlay.style.display = "none";
  document.body.classList.remove("no-scroll");
};

const buildModal = () => {
  const headers = [
    "Nom",
    "Prénom",
    "Email",
    "Téléphone",
    "Adresse",
    "Ville",
    "Taille",
    "Message",
    "Lavage",
    "Options",
    "Finitions",
    "Prix",
    "Temps",
    "Date",
    "Heure",
  ];

  const modalRecap = createElement("div", null, { class: "modal_recap" });

  Object.values(order).forEach((value, index) => {
    const modalRow = createElement("div", null, { class: "modal_row" });
    const modalHeader = createElement("p", headers[index] + " :", {
      class: "modal_header",
    });
    const modalValue = createElement("p", value, { class: "modal_value" });

    modalRow.appendChild(modalHeader);
    modalRow.appendChild(modalValue);

    modalRecap.appendChild(modalRow);
  });

  modal_content.appendChild(modalRecap);
};

const handleSubmitEvent = () => {
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    order.date = appointment.date.element.value
      ? appointment.date.element.value
      : appointment.date.element.getAttribute("placeholder");

    if (!checkEmptyfieldOrder() && checkboxes.termesAndConditions.checked) {
      buildModal();
      openModal();
    }

    /*postData("./assets/scripts/mail.php", order).then((data) => {
      console.log(data);
    });*/
  });
};

handleChangingCarSizeEvent();
handleCheckboxEvents(checkboxes.classicWashes, "classic");
handleCheckboxEvents(checkboxes.washOptions, "options");
handleCheckboxEvents(checkboxes.washFinishing, "finishing");
handleRegexEvents();
setTimeSlots();
setDatepicker();
handleHourEvent();
handleSubmitEvent();

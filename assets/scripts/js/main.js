import services from "./services.js";
import availableSlots from "./planning.js";

const MILLISECONDS_PER_DAY = 86400000;
const NUMBER_OF_DAY_BEFORE_COOKIE_EXPIRATION = 400;

let toastCount = 0;

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
  appointmentInfos: {
    date: null,
    hour: null,
  },
};

const form = getElement("contact-form");
const loadingHamsterOverlay = getElement("loading-hamster-overlay");

const checkboxes = {
  classicWashes: getElements(".classicWash"),
  washOptions: getElements(".option"),
  washFinishing: getElements(".finishing"),
  termesAndConditions: getElement("courant-eau"),
  selectCarSize: getElement("taille"),
  priceSpan: getElement("price_value"),
  timeSpan: getElement("time_value"),
};

const addInOrderButtons = {
  option: getElements(".add_btn_option"),
  finishing: getElements(".add_btn_finishing"),
};

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

const carSizes = [
  "citadine",
  "berline_coupe",
  "break_suv",
  "camionnette_s",
  "camionnette_m",
  "camionnette_l",
];

const cookiesName = [
  "lastName",
  "firstName",
  "email",
  "tel",
  "address",
  "city",
];

const customerInfos = {
  lastName: {
    input: getElement("lastName"),
    label: getElement("label_lastName"),
    errorElement: getElement("message-error-lastName"),
    errorMsg: "le format du nom est incorrect.",
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
  date: getElement("datepicker"),
  hour: getElement("time"),
};

const fetchData = async (method, url, data = {}) => {
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
  const priceSupplement = price * index;
  const timeSupplement = time * index;

  updatePriceAndTimeAndDisplay(
    checked ? priceSupplement : -priceSupplement,
    checked ? timeSupplement : -timeSupplement
  );

  return {
    priceSupplement,
    timeSupplement,
  };
};

const updateButton = (button, bool) => {
  button.classList.toggle("clicked-btn", bool);
  button.textContent = bool ? "Retirer" : "Ajouter";
};

const handleCheckboxEvent = (checkboxes, type) =>
  checkboxes.forEach((checkbox) =>
    checkbox.addEventListener("input", ({ target }) => {
      const { id, checked } = target;
      const { price, time } = getWashServiceDetails(type, id);
      const name = target.getAttribute("data-name");
      let priceSupplement = 0;
      let timeSupplement = 0;

      if (id === "polissage" || id === "ceramique_carrosserie") {
        ({ priceSupplement, timeSupplement } =
          addSupplementForPolishAndCeramicAccordingToCarSize(id, checked));
      }

      if (id !== "exteriors" && id !== "interiors") {
        updateButton(getElement(target.getAttribute("data-btn-id")), checked);
      }

      updatePriceAndTimeAndDisplay(
        checked ? price : -price,
        checked ? time : -time
      );

      const service = {
        name,
        price: price + priceSupplement,
        time: time + timeSupplement,
      };

      if (checked) {
        order.washingInfos[type].push(service);
      } else {
        // Trouver l'index du service à supprimer en comparant par `name`
        const indexToRemove = order.washingInfos[type].findIndex(
          (s) => s.name === service.name
        );
        if (indexToRemove !== -1) {
          order.washingInfos[type].splice(indexToRemove, 1);
        }
      }

      console.log(order.washingInfos);
    })
  );

const handleCheckboxEvents = () => {
  handleCheckboxEvent(checkboxes.classicWashes, "classic");
  handleCheckboxEvent(checkboxes.washOptions, "options");
  handleCheckboxEvent(checkboxes.washFinishing, "finishing");
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

    const updateServiceWithSupplement = (dataName, newValues) => {
      const serviceType =
        dataName === "Extérieur" || dataName === "Intérieur"
          ? order.washingInfos.classic
          : order.washingInfos.finishing;
      const index = serviceType.findIndex(({ name }) => name === dataName);

      serviceType[index].price = newValues.price;
      serviceType[index].time = newValues.time;
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

        updateServiceWithSupplement(
          service.getAttribute("data-name"),
          newValues
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

const setDatepicker = async () => {
  const today = new Date();
  const minDate = new Date(today.setDate(today.getDate() + 1));
  const maxDate = new Date(availableSlots[availableSlots.length - 1].date);

  const pad = (number) => (number < 10 ? `0${number}` : number);
  const reverseDate = (date) => date.split("-").reverse().join("/");
  const addDays = (date, days) => {
    const newDate = new Date(date); // Créer une copie de l'objet Date
    newDate.setDate(newDate.getDate() + days); // Modifier la copie
    return newDate; // Retourner la nouvelle instance
  };
  const convertToDate = (dateString) => new Date(dateString);
  const formatDate = (date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const convertToCorrectDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  };
  const resetTime = (date) => {
    date.setHours(0, 0, 0, 0); // Réinitialise l'heure à minuit (00:00:00)
    return date;
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

  const getAllDatesBetween = (startDate, endDate) => {
    let dates = [];
    let currentDate = new Date(startDate);
    endDate = new Date(endDate);

    while (currentDate <= endDate) {
      dates.push(formatDate(currentDate));
      currentDate = addDays(currentDate, 1);
    }

    return dates;
  };

  const getUnavailableDates = () => {
    const unavailableDates = [];
    let startDate = resetTime(new Date());
    let endDate = resetTime(
      new Date(availableSlots[availableSlots.length - 1].date)
    );

    while (startDate <= endDate) {
      const isFound = availableSlots.find(
        (availableDate) => availableDate.date === formatDate(startDate)
      );

      if (!isFound) {
        unavailableDates.push(startDate);
      }

      startDate = addDays(startDate, 1);
    }

    return unavailableDates;
  };

  const getTakenDates = async () => {
    const takenDates = [];
    const takenSlots = await getFuturAppointmentDateAndHour();

    takenSlots.forEach((takenSlot) => {
      console.log(takenSlot);

      const index = availableSlots.findIndex(
        (availableSlot) => availableSlot.date === takenSlot.appointment_date
      );

      if (index !== -1) {
        const takenHourIndex = availableSlots[index].hours.findIndex(
          (availableHour) =>
            availableHour === takenSlot.appointment_hour.slice(0, 5)
        );

        if (takenHourIndex !== -1) {
          availableSlots[index].hours.splice(takenHourIndex, 1);

          if (availableSlots[index].hours.length === 0) {
            availableSlots.splice(index, 1);
            takenDates.push(takenSlot.appointment_date);
          }
        }
      }
    });

    return takenDates.map((date) => new Date(date));
  };

  const unavailableDates = [
    // ...getSpecificWeekdaysBetweenDates(minDate, maxDate, [2, 7]), // mardi et dimanche
    ...getUnavailableDates(),
    ...(await getTakenDates()),
  ];

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
    openOn: convertToCorrectDate(firstNonExcludedDate),
    yearRange: 0,
    weekStart: 1,
  };

  appointment.date.setAttribute("placeholder", firstNonExcludedDate);
  new Datepicker(appointment.date, options);
};

const addTimeSlot = (date) => {
  const slot = availableSlots.find(
    (slot) => slot.date === date.split("/").reverse().join("-")
  );

  appointment.hour.innerHTML = "";
  slot.hours.forEach((hour) =>
    appointment.hour.appendChild(createElement("option", hour, { value: hour }))
  );
};

const setHourPicker = () => {
  setTimeout(
    () => addTimeSlot(appointment.date.getAttribute("placeholder")),
    500
  );

  appointment.hour.addEventListener("click", ({ target: { options } }) => {
    const changedDate =
      options[0].textContent === "Veuillez sélectionner une heure";

    if (changedDate) {
      addTimeSlot(
        appointment.date.value || appointment.date.getAttribute("placeholder")
      );
    }
  });

  appointment.date.addEventListener("blur", () => {
    appointment.hour.innerHTML = "";
    appointment.hour.appendChild(
      createElement("option", "Veuillez sélectionner une heure")
    );
  });
};

const handleHourEvent = () =>
  appointment.hour.addEventListener("change", ({ target: { value } }) => {
    console.log(value);

    order.appointmentInfos.hour = value;
  });

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
        modalValue.appendChild(
          createElement("p", `${idx + 1}. ${val.name} (${val.price}€)`)
        );
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
  addInfosToModal("appointmentInfos", "Informations sur le rendez-vous", [
    "Date",
    "Heure",
  ]);
};

const toggleLoadingHamsterDisplay = (show) =>
  (loadingHamsterOverlay.style.display = show ? "block" : "none");

const handleCloseModalEvent = () => {
  [modal.cancelButton, modal.closeButton, modal.overlay].forEach((button) =>
    button.addEventListener("click", () => closeModal())
  );
  modal.content.addEventListener("click", (ev) => ev.stopPropagation());
};

const displayErrorSwal = () => {
  swal({
    title: "Une error s'est produite...",
    text: "Si le problème persiste merci de prendre contact avec nous à contact@carwashfromhome.com",
    icon: "error",
  });
};

const displaySuccessSwal = () => {
  swal({
    title: "Votre réservation à bien été prise en compte!",
    text: "Vous avez reçu un email de confirmation.",
    icon: "success",
  });
};

const handleFormErrorPossibilities = () => {
  const { washingInfos } = order;
  const { classic, finishing, options, price, time } = washingInfos;

  const showError = (message) => {
    let messageCopy = message;
    let match = messageCopy.match(/^Le lavage (intérieur|extérieur)\b/);
    if (match) {
      match = match[1];
    }
    let configs;

    if (match === "extérieur" || match === "intérieur") {
      message = match;
      configs = {
        extérieur: {
          text: messageCopy,
          icon: "warning",
          title: "Attention...",
          buttons: {
            confirm: {
              text: "Ajouter!",
              value: "add",
              closeModal: false,
            },
            ok: "ok",
          },
          action: () => {
            checkboxes.classicWashes[0].click();
          },
        },
        intérieur: {
          text: messageCopy,
          icon: "warning",
          title: "Attention...",
          buttons: {
            confirm: {
              text: "Ajouter!",
              value: "add",
              closeModal: false,
            },
            ok: "ok",
          },
          action: () => {
            checkboxes.classicWashes[1].click();
          },
        },
      };
    } else {
      configs = {
        "Veuillez confirmer avoir lu et accepté les conditions générales de ventes et la politique de confidentialité":
          {
            text: messageCopy,
            icon: "warning",
            title: "Attention...",
            buttons: {
              confirm: {
                text: "Confirmer!",
                value: "confirm",
                closeModal: false,
              },
              ok: "ok",
            },
            action: () => {
              checkboxes.termesAndConditions.click();
            },
          },
        "Nettoyage extérieur et polissage carrosserie nécessaires avant une céramique":
          {
            text: messageCopy,
            icon: "warning",
            title: "Attention...",
            buttons: {
              confirm: {
                text: "Ajouter!",
                value: "add",
                closeModal: false,
              },
              ok: "ok",
            },
            action: () => {
              if (!checkboxes.classicWashes[0].checked) {
                checkboxes.classicWashes[0].click();
              }
              if (!checkboxes.washFinishing[0].checked) {
                checkboxes.washFinishing[0].click();
              }
            },
          },
      };
    }

    console.log(message);

    const config = configs[message] || {
      text: messageCopy,
      icon: "warning",
      title: "Attention...",
    };

    swal(config).then((value) => {
      if (value === "confirm" || value === "add") {
        config.action?.();
        swal.stopLoading();
        swal.close();
      }
    });

    return false;
  };

  const checkEmptyfieldOrder = () =>
    !order.personnalInfos.lastName ||
    !order.personnalInfos.firstName ||
    !order.personnalInfos.email ||
    !order.personnalInfos.tel ||
    !order.personnalInfos.address ||
    !order.personnalInfos.city;

  const checkRequiredClassicWash = (services, requiredClassicWash) => {
    const invalidOptions = services.filter(
      (service) =>
        (options.some((option) => option.name === service) ||
          finishing.some((finishing) => finishing.name === service)) &&
        !classic.some((classic) => classic.name === requiredClassicWash)
    );
    return invalidOptions.length > 0 ? invalidOptions : null;
  };

  const formatInvalidOptions = (invalidOptions) =>
    invalidOptions.map((option) => `- ${option}`).join("\n");

  const getErrorMessage = (invalidOptions, requiredClassicWash) => {
    const isOptionSelected = options.length > 0;
    const isFinishingSelected = finishing.length > 0;
    const isBothSelected = isOptionSelected && isFinishingSelected;
    const optionCount = options.length;
    const finishingCount = finishing.length;

    let selectionText = "";

    if (isBothSelected) {
      selectionText =
        optionCount > 1 && finishingCount > 1
          ? "les options et les finitions sélectionnées"
          : optionCount > 1
          ? "les options et la finition sélectionnée"
          : finishingCount > 1
          ? "l'option et les finitions sélectionnées"
          : "l'option et la finition sélectionnée";
    } else if (isOptionSelected) {
      selectionText =
        optionCount > 1 ? "les options sélectionnées" : "l'option sélectionnée";
    } else if (isFinishingSelected) {
      selectionText =
        finishingCount > 1
          ? "les finitions sélectionnées"
          : "la finition sélectionnée";
    }

    const requiredText =
      requiredClassicWash === "Extérieur"
        ? "Le lavage extérieur"
        : "Le lavage intérieur";

    return `${requiredText} est nécessaire pour ${selectionText} :\n${formatInvalidOptions(
      invalidOptions
    )}`;
  };

  const conditions = [
    {
      condition: checkEmptyfieldOrder(),
      message: "Veuillez remplir tous les champs",
    },
    {
      condition: price <= 0 && time <= 0,
      message: "Veuillez sélectionner au moins une prestation",
    },
    {
      condition: classic.length === 0,
      message: "Veuillez sélectionner au moins un lavage classique",
    },
    {
      condition:
        finishing.some((fin) => fin.name === "Céramique carrosserie") &&
        (!finishing.some((fin) => fin.name === "Polissage carrosserie") ||
          !classic.some((cl) => cl.name === "Extérieur")),
      message:
        "Nettoyage extérieur et polissage carrosserie nécessaires avant une céramique",
    },
    {
      condition: checkRequiredClassicWash(
        [
          "Nettoyage bloc moteur",
          "Polissage carrosserie",
          "Céramique jantes",
          "Céramique vitres",
          "Rénovateur pneus",
          "Rénovateur joints",
        ],
        "Extérieur"
      ),
      message: (invalidOptions) => getErrorMessage(invalidOptions, "Extérieur"),
    },
    {
      condition: checkRequiredClassicWash(
        [
          "Nettoyage cuir et alcantara",
          "Shampoing sièges en tissus",
          "Shampoing tapis et coffre",
          "Shampoing moquette",
          "Imperméabilisant textiles",
          "Protection cuir",
          "Anti buée",
          "Protection plastiques",
        ],
        "Intérieur"
      ),
      message: (invalidOptions) => getErrorMessage(invalidOptions, "Intérieur"),
    },
    {
      condition: !checkboxes.termesAndConditions.checked,
      message:
        "Veuillez confirmer avoir lu et accepté les conditions générales de ventes et la politique de confidentialité",
    },
    {
      condition:
        order.appointmentInfos.hour === "Veuillez sélectionner une heure",
      message: "Veuillez sélectionner une heure",
    },
  ];

  for (const { condition, message } of conditions) {
    const invalidOptions =
      typeof condition === "function" ? condition() : condition;
    if (invalidOptions) {
      return showError(
        typeof message === "function" ? message(invalidOptions) : message
      );
    }
  }

  return true;
};

const handleAddBtnInOrderEvents = () => {
  Object.values(addInOrderButtons).forEach((buttons) =>
    buttons.forEach((button) =>
      button.addEventListener("click", ({ target }) => {
        const checkbox = getElement(target.getAttribute("data-checkbox-id"));

        checkbox.click();
        const isAdded = checkbox.checked ? true : false;
        target.textContent = isAdded ? "Retirer" : "Ajouter";
        target.classList.toggle("clicked-btn", isAdded);

        const dataName = getElement(
          target.getAttribute("data-checkbox-id")
        ).getAttribute("data-name");

        isAdded
          ? createToast(
              "success-toast",
              " a été ajouté à votre commande!",
              `"${dataName}"`,
              "./assets/images/check-icon.png"
            )
          : createToast(
              "error-toast",
              " a été supprimé de votre commande!",
              `"${dataName}"`,
              "./assets/images/error-icon.png"
            );
      })
    )
  );
};

const addCSRFToForm = () =>
  fetchData("GET", "./assets/scripts/php/generateCSRF.php")
    .then((csrf) => {
      form.appendChild(
        createElement("input", null, {
          type: "hidden",
          value: csrf.csrf_token,
          id: "csrf_token",
        })
      );
    })
    .catch((error) => console.log(error));

const createToast = (toastClass, text, optionOrFinishing, imagePath) => {
  const toast = createElement("figure", null, {
    class: `toast show-toast ${toastClass}`,
    style: `z-index: ${1000 + toastCount++};`,
  });
  const img = createElement("img", null, {
    src: imagePath,
    alt: "icon",
    class: "icon",
  });
  const p = createElement("p", text);
  const span = createElement("span", optionOrFinishing, {
    style: "font-weight: bold",
  });

  p.prepend(span);
  toast.appendChild(img);
  toast.appendChild(p);
  document.body.prepend(toast);

  setTimeout(() => {
    toast.classList.add("hide-toast");
    setTimeout(() => toast.remove(), 500);
  }, 5000);
};

const checkCookie = (name) => {
  let cookieName = getCookie(name);
  if (cookieName != "") {
    return true;
  } else {
    return false;
  }
};

const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * MILLISECONDS_PER_DAY);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

const createCookiesFromFormInfos = () =>
  cookiesName.forEach((cookieName) => {
    if (!checkCookie(cookieName)) {
      setCookie(
        cookieName,
        order.personnalInfos[cookieName],
        NUMBER_OF_DAY_BEFORE_COOKIE_EXPIRATION
      );
    }
  });

const preFillPersonnalInfos = () => {
  cookiesName.forEach((cookieName) => {
    if (checkCookie(cookieName)) {
      const cookieValue = getCookie(cookieName);
      customerInfos[cookieName].input.value = cookieValue;
      order.personnalInfos[cookieName] = cookieValue;
    }
  });
};

const handleSubmitEvent = () =>
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    order.appointmentInfos.date =
      appointment.date.value || appointment.date.getAttribute("placeholder");

    order.appointmentInfos.hour = appointment.hour.value;

    if (handleFormErrorPossibilities()) {
      buildModal();
      openModal();
    }
  });

const handleConfirmModalEvent = () =>
  modal.confirmButton.addEventListener("click", () => {
    order.csrf_token = getElement("csrf_token").value;

    toggleLoadingHamsterDisplay(true);

    fetchData("POST", "./assets/scripts/php/main.php", order)
      .then((response) => {
        if (response.success) {
          toggleLoadingHamsterDisplay(false);
          closeModal();
          displaySuccessSwal();
          createCookiesFromFormInfos();
        } else {
          toggleLoadingHamsterDisplay(false);
          displayErrorSwal();
        }
      })
      .catch((error) => {
        console.error("Error handling submission:", error);
        toggleLoadingHamsterDisplay(false);
        displayErrorSwal();
      });
  });

const getFuturAppointmentDateAndHour = async () => {
  try {
    const response = await fetchData(
      "GET",
      "./assets/scripts/php/getFuturAppointmentDateAndHour.php"
    );
    return response;
  } catch (error) {
    return console.error(error);
  }
};

const findDuplicates = (array) => {
  const seen = new Set();
  const duplicates = new Set();

  array.forEach((element) => {
    if (seen.has(element)) {
      duplicates.add(element);
    } else {
      seen.add(element);
    }
  });

  return [...duplicates];
};

addCSRFToForm();
preFillPersonnalInfos();
handleAddBtnInOrderEvents();
handleRegexEvents();
handleChangingCarSizeEvent();
handleCheckboxEvents();
handleRegexEvents();
setDatepicker();
setHourPicker();
// handleHourEvent();
handleCloseModalEvent();
handleConfirmModalEvent();
handleSubmitEvent();

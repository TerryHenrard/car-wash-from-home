const form = document.getElementById("contact-form");
const inputsCkb = document.querySelectorAll("input[type='checkbox']");
const inputsText = document.querySelectorAll(
  "input[type='text'], input[type='email'], textarea"
);
const spanPrice = document.querySelector(".price p span");
const spanTime = document.querySelector(".estimated-time p span");
const inputDate = document.getElementById("date");
const inputTime = document.getElementById("time");
const validAnim = document.querySelector(".valid-inscription");
const errorAnim = document.querySelector(".error-inscription");

let price = 0;
let time = 0;

let lastName,
  firstName,
  email,
  phoneNumber,
  streetAndNumber,
  postcode,
  date,
  hours,
  message;
let formule = [];
let abonnement = [];
let options = [];

const errorDisplay = (tag, message, valid) => {
  const input = document.getElementById(tag);
  const label = document.querySelector("label[for='" + tag + "']");
  const inputErrorMessage = document.querySelector(
    "." + "message-error-" + tag
  );

  if (!valid) {
    input.classList.add("error-input");
    label.classList.add("error-label");
    inputErrorMessage.classList.add("message-error");
    inputErrorMessage.textContent = message;
  } else {
    input.classList.remove("error-input");
    label.classList.remove("error-label");
    inputErrorMessage.classList.remove("message-error");
    inputErrorMessage.textContent = message;
  }
};

const errorDisplayTextarea = (tag, message, valid) => {
  const textarea = document.getElementById("message");
  const inputErrorMessage = document.querySelector(
    "." + "message-error-" + tag
  );

  if (!valid) {
    textarea.classList.add("error-input");
    inputErrorMessage.classList.add("message-error");
    inputErrorMessage.textContent = message;
  } else {
    textarea.classList.remove("error-input");
    inputErrorMessage.classList.remove("message-error");
    inputErrorMessage.textContent = message;
  }
};

const lastNameChecker = (value) => {
  if (value.length > 47) {
    errorDisplay(
      "lastName",
      "le nom de famille ne peut pas faire plus de 47 caractères"
    );
    lastName = null;
  } else if (!value.match(/^[a-zA-Z\p{L}\s'-]*$/gmu)) {
    errorDisplay("lastName", "les caractères spéciaux ne sont pas autorisés");
    lastName = null;
  } else {
    errorDisplay("lastName", "", true);
    lastName = value;
  }
};

const firstNameChecker = (value) => {
  if (value.length > 59) {
    errorDisplay(
      "firstName",
      "le prénom ne peut pas faire plus de 59 caractères"
    );
    firstName = null;
  } else if (!value.match(/^[a-zA-Z\p{L}\s'-]*$/gmu)) {
    errorDisplay("firstName", "les caractères spéciaux ne sont pas autorisés");
    firstName = null;
  } else {
    errorDisplay("firstName", "", true);
    firstName = value;
  }
};

const emailChecker = (value) => {
  if (!value.match(/^[\w\._-]+@[\w-]+\.[a-z]{2,4}$/i)) {
    errorDisplay("email", "Le mail n'est pas valide");
    email = null;
  } else {
    errorDisplay("email", "", true);
    email = value;
  }
};

const phoneNumberChecker = (value) => {
  if (
    !value.match(
      /^(((\+|00)32[ ]?(?:\(0\)[ ]?)?)|0){1}(4(60|[789]\d)\/?(\s?\d{2}\.?){2}(\s?\d{2})|(\d\/?\s?\d{3}|\d{2}\/?\s?\d{2})(\.?\s?\d{2}){2})$/
    )
  ) {
    errorDisplay(
      "tel",
      "utilisez uniquement des espaces pour séparer les chiffres, ou laissé tout attaché"
    );
    phoneNumber = null;
  } else {
    errorDisplay("tel", "", true);
    phoneNumber = value;
  }
};

const streetAndNumberChecker = (value) => {
  if (!value.match(/^[\p{L}\d\s\.,#'\-]*$/gmu)) {
    errorDisplay("rue", "cette adresse n'est pas valide");
    streetAndNumber = null;
  } else {
    errorDisplay("rue", "", true);
    streetAndNumber = value;
  }
};

const postcodeChecker = (value) => {
  if (!value.match(/^[\d]{0,4}$/)) {
    errorDisplay("ville", "ce code postal n'est pas valide");
    postcode = null;
  } else {
    errorDisplay("ville", "", true);
    postcode = value;
  }
};

const messageChecker = (value) => {
  if (value.length >= 250) {
    errorDisplayTextarea("message", "250 caractères autorisés uniquement");
    message = null;
  } else {
    errorDisplayTextarea("message", "", true);
    message = value;
  }
};

inputsText.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "lastName":
        lastNameChecker(e.target.value);
        break;
      case "firstName":
        firstNameChecker(e.target.value);
        break;
      case "email":
        emailChecker(e.target.value);
        break;
      case "tel":
        phoneNumberChecker(e.target.value);
        break;
      case "rue":
        streetAndNumberChecker(e.target.value);
        break;
      case "ville":
        postcodeChecker(e.target.value);
        break;
      case "message":
        messageChecker(e.target.value);
      default:
        null;
    }
  });
});

inputsCkb.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "exterieur1":
        if (e.target.checked) {
          price += 15;
          time += 20;
          formule.push(e.target.value);
        } else {
          price -= 15;
          time -= 20;
          formule.pop();
        }
        break;
      case "interieur1":
        if (e.target.checked) {
          price += 25;
          time += 30;
          formule.push(e.target.value);
        } else {
          price -= 25;
          time -= 30;
          formule.pop();
        }
        break;
      case "exterieur3":
        if (e.target.checked) {
          price += 40;
          abonnement.push(e.target.value);
        } else {
          price -= 40;
          abonnement.pop();
        }
        break;
      case "exterieur5":
        if (e.target.checked) {
          price += 63;
          abonnement.push(e.target.value);
        } else {
          price -= 63;
          abonnement.pop();
        }
        break;
      case "exterieur10":
        if (e.target.checked) {
          price += 120;
          abonnement.push(e.target.value);
        } else {
          price -= 120;
          abonnement.pop();
        }
        break;
      case "interieur3":
        if (e.target.checked) {
          price += 66;
          abonnement.push(e.target.value);
        } else {
          price -= 66;
          abonnement.pop();
        }
        break;
      case "interieur5":
        if (e.target.checked) {
          price += 105;
          abonnement.push(e.target.value);
        } else {
          price -= 105;
          abonnement.pop();
        }
        break;
      case "interieur10":
        if (e.target.checked) {
          price += 200;
          abonnement.push(e.target.value);
        } else {
          price -= 200;
          abonnement.pop();
        }
        break;
      case "polissage":
        if (e.target.checked) {
          price += 80;
          time += 150;
          options.push(e.target.value);
        } else {
          price -= 80;
          time -= 150;
          options.pop();
        }
        break;
      case "shampoing-siege":
        if (e.target.checked) {
          price += 60;
          time += 20;
          options.push(e.target.value);
        } else {
          price -= 60;
          time -= 20;
          options.pop();
        }
        break;
      case "shampoing-tapis":
        if (e.target.checked) {
          price += 30;
          time += 10;
          options.push(e.target.value);
        } else {
          price -= 30;
          time -= 10;
          options.pop();
        }
        break;
      default:
        null;
    }
    spanPrice.textContent = price + "€";
    spanTime.textContent = time + "min";
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  date = inputDate.value;
  hours = inputTime.value;

  if (
    lastName &&
    firstName &&
    email &&
    phoneNumber &&
    streetAndNumber &&
    postcode &&
    date &&
    hours
  ) {
    const data = {
      lastName,
      firstName,
      email,
      phoneNumber,
      streetAndNumber,
      postcode,
      formule,
      abonnement,
      options,
      date,
      hours,
      message,
    };

    console.log(data);

    validAnim.classList.add("valid-inscription-anim");
    setTimeout(() => {
      validAnim.classList.remove("valid-inscription-anim");
    }, 5001);

    inputsText.forEach((input) => (input.value = ""));
    inputsCkb.forEach((input) => (input.checked = false));
    inputDate.value = "";
    inputTime.value = "";
    spanPrice.textContent = "";
    spanTime.textContent = "";
  } else {
    errorAnim.classList.add("error-inscription-anim");
    setTimeout(() => {
      errorAnim.classList.remove("error-inscription-anim");
    }, 5001);
  }
});

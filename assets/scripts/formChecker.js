const form = document.getElementById("contact-form");
const inputsCkb = document.querySelectorAll("input[type='checkbox']");
const inputsText = document.querySelectorAll(
  "input[type='text'], input[type='email'], textarea"
);
const ckbExt = document.getElementById("exterieur1");
const ckbInt = document.getElementById("interieur1");
const inputSelect = document.querySelector("select");
const spanPrice = document.querySelector(".price p span");
const spanTime = document.querySelector(".estimated-time p span");
const inputDate = document.getElementById("date");
const inputTime = document.getElementById("time");
const validAnim = document.querySelector(".valid-inscription");
const pValidAnim = document.querySelector(".valid-inscription p");
const errorAnim = document.querySelector(".error-inscription");
const pErrorAnim = document.querySelector(".error-inscription p");
const ckbPolissage = document.getElementById("polissage");
const ckbNettoyageBlocMmoteur = document.getElementById(
  "nettoyage-bloc-moteur"
);
const ckbProtectionCeramique = document.getElementById("protection-ceramique");
const ckbNettoyageCuirAlcantara = document.getElementById(
  "nettoyage-sieges-cuir-alcantara"
);
const ckbShampoingSiege = document.getElementById("shampoing-siege");
const ckbShampoingTapis = document.getElementById("shampoing-tapis");
const ckbProtectionPlastiques = document.getElementById(
  "protection-plastiques"
);
const ckbImpermeabilisantTextiles = document.getElementById(
  "impermeabilisant-textiles"
);

console.log(inputSelect);
let price = 0;
let time = 0;

let lastName,
  firstName,
  email,
  phoneNumber,
  address,
  city,
  dateAppointement,
  hours,
  message;
let formule = [];
let abonnement = [];
let option = [];
let taille;

let date = new Date();
let jour = date.getDate();
let mois = (date.getMonth() + 1).toString().padStart(2, "0");
let annee = date.getFullYear();

let dayDate =
  annee.toString() + "-" + mois + "-" + jour.toString().padStart(2, "0");

inputDate.value =
  annee.toString() + "-" + mois + "-" + (jour + 2).toString().padStart(2, "0");
inputTime.value = "08:00";

let dateMin =
  annee.toString() + "-" + mois + "-" + (jour + 2).toString().padStart(2, "0");
let dateMax =
  (annee + 1).toString() + "-" + mois + "-" + jour.toString().padStart(2, "0");

inputDate.setAttribute("min", dateMin);
inputDate.setAttribute("max", dateMax);

function errorDisplay(tag, message, valid) {
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
}

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    switch (e.target.id) {
      case "btPolissage":
        if (!ckbPolissage.checked) {
          ckbPolissage.checked = !ckbPolissage.checked;
          pValidAnim.textContent = '"Polissage carrosserie" ajouté au panier';
          validAnim.classList.add("valid-inscription-anim");
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 90;
          time += 90;
        } else {
          ckbPolissage.checked = !ckbPolissage.checked;
          pErrorAnim.textContent = '"Polissage carrosserie" enlevé du panier';
          errorAnim.classList.add("error-inscription-anim");
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 90;
          time -= 90;
        }
        break;
      case "btNettoyage-bloc-moteur":
        if (!ckbNettoyageBlocMmoteur.checked) {
          ckbNettoyageBlocMmoteur.checked = !ckbNettoyageBlocMmoteur.checked;
          pValidAnim.textContent = '"nettoyage bloc moteur" ajouté au panier';
          validAnim.classList.add("valid-inscription-anim");
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 25;
          time += 30;
        } else {
          ckbNettoyageBlocMmoteur.checked = !ckbNettoyageBlocMmoteur.checked;
          pErrorAnim.textContent = '"nettoyage bloc moteur" enlevé du panier';
          errorAnim.classList.add("error-inscription-anim");
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 25;
          time -= 30;
        }
        break;
      case "btProtection-ceramique":
        if (!ckbProtectionCeramique.checked) {
          ckbProtectionCeramique.checked = !ckbProtectionCeramique.checked;
          pValidAnim.textContent = '"protection céramique" ajouté au panier';
          validAnim.classList.add("valid-inscription-anim");
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 55;
          time += 30;
        } else {
          ckbProtectionCeramique.checked = !ckbProtectionCeramique.checked;
          pErrorAnim.textContent = '"protection céramique" enlevé du panier';
          errorAnim.classList.add("error-inscription-anim");
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 55;
          time -= 30;
        }
        break;
      case "btNettoyage-cuir-alcantara":
        if (!ckbNettoyageCuirAlcantara.checked) {
          ckbNettoyageCuirAlcantara.checked =
            !ckbNettoyageCuirAlcantara.checked;
          pValidAnim.textContent =
            '"nettoyage cuir et alcantara" ajouté au panier';
          validAnim.classList.add("valid-inscription-anim");
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 20;
          time += 20;
        } else {
          ckbNettoyageCuirAlcantara.checked =
            !ckbNettoyageCuirAlcantara.checked;
          pErrorAnim.textContent =
            '"nettoyage cuir et alcantara" enlevé du panier';
          errorAnim.classList.add("error-inscription-anim");
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 20;
          time -= 20;
        }
        break;
      case "btShampoing-siege-tissus":
        if (!ckbShampoingSiege.checked) {
          ckbShampoingSiege.checked = !ckbShampoingSiege.checked;
          pValidAnim.textContent =
            '"shampoing sièges en tissus" ajouté au panier';
          validAnim.classList.add("valid-inscription-anim");
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 60;
          time += 45;
        } else {
          ckbShampoingSiege.checked = !ckbShampoingSiege.checked;
          pErrorAnim.textContent =
            '"shampoing sièges en tissus" enlevé du panier';
          errorAnim.classList.add("error-inscription-anim");
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 60;
          time -= 45;
        }
        break;
      case "btShampoing-tapis-coffre":
        if (!ckbShampoingTapis.checked) {
          ckbShampoingTapis.checked = !ckbShampoingTapis.checked;
          pValidAnim.textContent =
            '"shampoing tapis et coffre" ajouté au panier';
          validAnim.classList.add("valid-inscription-anim");
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 30;
          time += 20;
        } else {
          ckbShampoingTapis.checked = !ckbShampoingTapis.checked;
          pErrorAnim.textContent =
            '"shampoing tapis et coffre" enlevé du panier';
          errorAnim.classList.add("error-inscription-anim");
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 30;
          time -= 20;
        }
        break;
      case "btProtection-plastique":
        if (!ckbProtectionPlastiques.checked) {
          ckbProtectionPlastiques.checked = !ckbProtectionPlastiques.checked;
          pValidAnim.textContent = '"protection plastique" ajouté au panier';
          validAnim.classList.add("valid-inscription-anim");
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 20;
          time += 15;
        } else {
          ckbProtectionPlastiques.checked = !ckbProtectionPlastiques.checked;
          pErrorAnim.textContent = '"protection plastique" enlevé du panier';
          errorAnim.classList.add("error-inscription-anim");
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 20;
          time -= 15;
        }
        break;
      case "btImpermeabilisant-textiles":
        if (!ckbImpermeabilisantTextiles.checked) {
          ckbImpermeabilisantTextiles.checked =
            !ckbImpermeabilisantTextiles.checked;
          pValidAnim.textContent =
            '"imperméabilisant textiles" ajouté au panier';
          validAnim.classList.add("valid-inscription-anim");
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 25;
          time += 20;
        } else {
          ckbImpermeabilisantTextiles.checked =
            !ckbImpermeabilisantTextiles.checked;
          pErrorAnim.textContent =
            '"imperméabilisant textiles" enlevé du panier';
          errorAnim.classList.add("error-inscription-anim");
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 25;
          time -= 20;
        }
        break;
      default:
        break;
    }
    spanPrice.textContent = price + "€";

    if (time >= 60) {
      spanTime.textContent = convertMinutestoHoursMinutes(time);
    } else {
      spanTime.textContent = time + "min";
    }
  });
});

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
      /^(((\+|00)32[ ]?(?:\(0\)[ ]?)?)|0){1}(4(60|[6789]\d)\/?(\s?\d{2}\.?){2}(\s?\d{2})|(\d\/?\s?\d{3}|\d{2}\/?\s?\d{2})(\.?\s?\d{2}){2})$/
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

const adressChecker = (value) => {
  if (!value.match(/^[\p{L}\d\s\.,#‘’'\-]*$/gmu)) {
    errorDisplay("adresse", "cette adresse n'est pas valide");
    address = null;
  } else {
    errorDisplay("adresse", "", true);
    address = value;
  }
};

const cityChecker = (value) => {
  if (!value.match(/^([a-zA-Z\p{L}]+(?:. |-| |'))*[a-zA-Z\p{L}]*$/gmu)) {
    errorDisplay("ville", "cette ville n'est pas valide");
    city = null;
  } else {
    errorDisplay("ville", "", true);
    city = value;
  }
};

const dateChecher = (value) => {
  if (value < dateMin) {
    errorDisplay(
      "date",
      "Veuillez sélectionner une date supérieur au " +
        (jour + 1).toString().padStart(2, "0") +
        "-" +
        mois +
        "-" +
        annee.toString()
    );
    date = null;
  } else {
    errorDisplay("date", "", true);
    date = value;
  }
};

const timeChecker = (value) => {
  if (value < "08:00" || value > "17:00") {
    errorDisplay("time", "nous somme disponibles de 08:00 à 17:00");
    hours = null;
  } else {
    errorDisplay("time", "", true);
    hours = value;
  }
};

const messageChecker = (value) => {
  if (value.length >= 250) {
    errorDisplay("message", "250 caractères autorisés uniquement");
    message = null;
  } else {
    errorDisplay("message", "", true);
    message = value;
  }
};

const convertMinutestoHoursMinutes = (minutes) => {
  let hours = Math.floor(minutes / 60);
  let minutesRemaining = minutes % 60;

  if (minutesRemaining < 10) {
    minutesRemaining = minutesRemaining.toString().padStart(2, "0");
  }

  return hours + "h" + minutesRemaining;
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
      case "adresse":
        adressChecker(e.target.value);
        break;
      case "ville":
        cityChecker(e.target.value);
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
    let index;
    switch (e.target.id) {
      case "exterieur1":
        if (e.target.checked) {
          if (inputSelect.value === "citadine") {
            price += 15;
            time += 30;
          }
          if (inputSelect.value === "berline-coupe") {
            price += 20;
            time += 45;
          }
          if (inputSelect.value === "suv-break") {
            price += 25;
            time += 60;
          }
          formule.push(e.target.value);
        } else {
          if (inputSelect.value === "citadine") {
            price -= 15;
            time -= 30;
          }
          if (inputSelect.value === "berline-coupe") {
            price -= 20;
            time -= 45;
          }
          if (inputSelect.value === "suv-break") {
            price -= 25;
            time -= 60;
          }

          index = formule.indexOf(e.target.value);

          if (index !== -1) {
            formule.splice(index, 1);
          }
        }
        break;
      case "interieur1":
        if (e.target.checked) {
          if (inputSelect.value === "citadine") {
            price += 25;
            time += 60;
          } else if (inputSelect.value === "berline-coupe") {
            price += 30;
            time += 75;
          } else if (inputSelect.value === "suv-break") {
            price += 35;
            time += 90;
          }
          formule.push(e.target.value);
        } else {
          if (inputSelect.value === "citadine") {
            price -= 25;
            time -= 60;
          } else if (inputSelect.value === "berline-coupe") {
            price -= 30;
            time -= 75;
          } else if (inputSelect.value === "suv-break") {
            price -= 35;
            time -= 90;
          }

          index = formule.indexOf(e.target.value);

          if (index !== -1) {
            formule.splice(index, 1);
          }
        }
        break;
      case "polissage":
        if (e.target.checked) {
          price += 90;
          time += 90;
          option.push(e.target.value);
        } else {
          price -= 90;
          time -= 90;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "shampoing-siege":
        if (e.target.checked) {
          price += 60;
          time += 45;
          option.push(e.target.value);
        } else {
          price -= 60;
          time -= 45;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "shampoing-tapis":
        if (e.target.checked) {
          price += 30;
          time += 20;
          option.push(e.target.value);
        } else {
          price -= 30;
          time -= 20;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "nettoyage-bloc-moteur":
        if (e.target.checked) {
          price += 25;
          time += 30;
          option.push(e.target.value);
        } else {
          price -= 25;
          time -= 30;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "protection-ceramique":
        if (e.target.checked) {
          price += 50;
          time += 20;
          option.push(e.target.value);
        } else {
          price -= 50;
          time -= 20;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      case "nettoyage-sieges-cuir-alcantara":
        if (e.target.checked) {
          price += 20;
          time += 20;
          option.push(e.target.value);
        } else {
          price -= 20;
          time -= 20;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      case "protection-plastiques":
        if (e.target.checked) {
          price += 15;
          time += 10;
          option.push(e.target.value);
        } else {
          price -= 15;
          time -= 10;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      case "impermeabilisant-textiles":
        if (e.target.checked) {
          price += 20;
          time += 10;
          option.push(e.target.value);
        } else {
          price -= 20;
          time -= 10;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      default:
        null;
    }

    spanPrice.textContent = price + "€";

    if (time >= 60) {
      spanTime.textContent = convertMinutestoHoursMinutes(time);
    } else {
      spanTime.textContent = time + "min";
    }
  });
});

let currentSelect = inputSelect.value;
inputSelect.addEventListener("input", () => {
  if (ckbExt.checked) {
    if (currentSelect === "citadine") {
      price -= 15;
      time -= 30;
    } else if (currentSelect === "berline-coupe") {
      price -= 20;
      time -= 45;
    } else if (currentSelect === "suv-break") {
      price -= 25;
      time -= 60;
    }
  }

  if (ckbInt.checked) {
    if (currentSelect === "citadine") {
      price -= 25;
      time -= 60;
    } else if (currentSelect === "berline-coupe") {
      price -= 30;
      time -= 75;
    } else if (currentSelect === "suv-break") {
      price -= 35;
      time -= 90;
    }
  }

  if (inputSelect.value === "citadine") {
    if (ckbExt.checked) {
      price += 15;
      time += 30;
    }
    if (ckbInt.checked) {
      price += 25;
      time += 60;
    }
  } else if (inputSelect.value === "berline-coupe") {
    if (ckbExt.checked) {
      price += 20;
      time += 45;
    }
    if (ckbInt.checked) {
      price += 30;
      time += 75;
    }
  } else if (inputSelect.value === "suv-break") {
    if (ckbExt.checked) {
      price += 25;
      time += 60;
    }
    if (ckbInt.checked) {
      price += 35;
      time += 90;
    }
  }

  spanPrice.textContent = price + "€";

  if (time >= 60) {
    spanTime.textContent = convertMinutestoHoursMinutes(time);
  } else {
    spanTime.textContent = time + "min";
  }

  currentSelect = inputSelect.value;
});

const changeDate = (value) => {
  let part = value.split("-");
  let year = part[0];
  let month = part[1];
  let day = part[2];

  let dateInverse = day + "-" + month + "-" + year;

  return dateInverse;
};

setInterval(() => {
  dateChecher(inputDate.value);
  timeChecker(inputTime.value);
}, 500);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  dateAppointement = inputDate.value;
  dateAppointement = changeDate(dateAppointement);
  taille = inputSelect.value;

  if (
    lastName &&
    firstName &&
    email &&
    phoneNumber &&
    address &&
    city &&
    dateAppointement &&
    hours &&
    taille
  ) {
    const data = {
      lastName,
      firstName,
      email,
      phoneNumber,
      address,
      city,
      taille,
      formule,
      abonnement,
      option,
      dateAppointement,
      hours,
      price,
      time,
      message,
    };

    pValidAnim.textContent = "rendez-vous validé";
    validAnim.classList.add("valid-inscription-anim");
    setTimeout(() => {
      validAnim.classList.remove("valid-inscription-anim");
    }, 5001);

    inputsText.forEach((input) => (input.value = ""));
    inputsCkb.forEach((input) => (input.checked = false));
    formule = [];
    abonnement = [];
    option = [];
    inputDate.value =
      annee.toString() +
      "-" +
      mois +
      "-" +
      (jour + 2).toString().padStart(2, "0");
    inputTime.value = "08:00";
    price = 0;
    time = 0;
    spanPrice.textContent = "";
    spanTime.textContent = "";

    let jsonData = JSON.stringify(data);

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "assets/scripts/mail.php", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log(xhr.responseText);
    }

    xhr.send(jsonData);
  } else {
    pErrorAnim.textContent = "veuillez remplir correctement les champs";
    errorAnim.classList.add("error-inscription-anim");
    setTimeout(() => {
      errorAnim.classList.remove("error-inscription-anim");
    }, 5001);
  }
});

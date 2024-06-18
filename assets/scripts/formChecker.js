/*const form = document.getElementById("contact-form");
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
const ckbProtectionCeramique = document.getElementById("ceramique-carrosserie");
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
const buttons = document.querySelectorAll("button");

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
let option = [];
let taille;

let date = new Date();
let jour = date.getDate();
let mois = (date.getMonth() + 1).toString().padStart(2, "0");
let annee = date.getFullYear();

let dayDate =
  annee.toString() + "-" + mois + "-" + jour.toString().padStart(2, "0");
if (parseInt(mois) == 12) {
  if (jour == 30) {
    jour = -1;
    mois = "01";
    annee++;
  } else if (jour == 31) {
    jour = 0;
    mois = "01";
    annee++;
  }
} else {
  if (jour == 30) {
    jour = -1;
    mois = (parseInt(mois) + 1).toString().padStart(2, "0");
  } else if (jour == 31) {
    jour = 0;
    mois = (parseInt(mois) + 1).toString().padStart(2, "0");
  }
}

inputDate.value = "2024-06-17";
// inputDate.value =
//   annee.toString() + "-" + mois + "-" + (jour + 2).toString().padStart(2, "0");
inputTime.value = "08:00";

let dateMin = "2024-06-17";
// let dateMin =
//   annee.toString() + "-" + mois + "-" + (jour + 2).toString().padStart(2, "0");
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
          pValidAnim.textContent =
            '"Polissage carrosserie" ajouté à la commande';
          validAnim.classList.add("valid-inscription-anim");
          button.textContent = "Retirer";
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 250;
          time += 90;
        } else {
          ckbPolissage.checked = !ckbPolissage.checked;
          pErrorAnim.textContent =
            '"Polissage carrosserie" retiré de la commande';
          errorAnim.classList.add("error-inscription-anim");
          button.textContent = "Ajouter";
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 250;
          time -= 90;
        }
        break;
      case "btNettoyage-bloc-moteur":
        if (!ckbNettoyageBlocMmoteur.checked) {
          ckbNettoyageBlocMmoteur.checked = !ckbNettoyageBlocMmoteur.checked;
          pValidAnim.textContent =
            '"nettoyage bloc moteur" ajouté à la commande';
          validAnim.classList.add("valid-inscription-anim");
          button.textContent = "Retirer";
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 30;
          time += 30;
        } else {
          ckbNettoyageBlocMmoteur.checked = !ckbNettoyageBlocMmoteur.checked;
          pErrorAnim.textContent =
            '"nettoyage bloc moteur" retiré de la commande';
          errorAnim.classList.add("error-inscription-anim");
          button.textContent = "Ajouter";
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 30;
          time -= 30;
        }
        break;
      case "btProtection-ceramique":
        if (!ckbProtectionCeramique.checked) {
          ckbProtectionCeramique.checked = !ckbProtectionCeramique.checked;
          pValidAnim.textContent = '"protection céramique" ajouté au nettoyage';
          validAnim.classList.add("valid-inscription-anim");
          button.textContent = "Retirer";
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 120;
          time += 45;
        } else {
          ckbProtectionCeramique.checked = !ckbProtectionCeramique.checked;
          pErrorAnim.textContent = '"protection céramique" retiré du nettoyage';
          errorAnim.classList.add("error-inscription-anim");
          button.textContent = "Ajouter";
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 120;
          time -= 45;
        }
        break;
      case "btNettoyage-cuir-alcantara":
        if (!ckbNettoyageCuirAlcantara.checked) {
          ckbNettoyageCuirAlcantara.checked =
            !ckbNettoyageCuirAlcantara.checked;
          pValidAnim.textContent =
            '"nettoyage cuir et alcantara" ajouté au nettoyage';
          validAnim.classList.add("valid-inscription-anim");
          button.textContent = "Retirer";
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 25;
          time += 20;
        } else {
          ckbNettoyageCuirAlcantara.checked =
            !ckbNettoyageCuirAlcantara.checked;
          pErrorAnim.textContent =
            '"nettoyage cuir et alcantara" retiré du nettoyage';
          errorAnim.classList.add("error-inscription-anim");
          button.textContent = "Ajouter";
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 25;
          time -= 20;
        }
        break;
      case "btShampoing-siege-tissus":
        if (!ckbShampoingSiege.checked) {
          ckbShampoingSiege.checked = !ckbShampoingSiege.checked;
          pValidAnim.textContent =
            '"shampoing sièges en tissus" ajouté au nettoyage';
          validAnim.classList.add("valid-inscription-anim");
          button.textContent = "Retirer";
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 70;
          time += 45;
        } else {
          ckbShampoingSiege.checked = !ckbShampoingSiege.checked;
          pErrorAnim.textContent =
            '"shampoing sièges en tissus" retiré du nettoyage';
          errorAnim.classList.add("error-inscription-anim");
          button.textContent = "Ajouter";
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 70;
          time -= 45;
        }
        break;
      case "btShampoing-tapis-coffre":
        if (!ckbShampoingTapis.checked) {
          ckbShampoingTapis.checked = !ckbShampoingTapis.checked;
          pValidAnim.textContent =
            '"shampoing tapis et coffre" ajouté au nettoyage';
          validAnim.classList.add("valid-inscription-anim");
          button.textContent = "Retirer";
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 30;
          time += 20;
        } else {
          ckbShampoingTapis.checked = !ckbShampoingTapis.checked;
          pErrorAnim.textContent =
            '"shampoing tapis et coffre" retiré du nettoyage';
          errorAnim.classList.add("error-inscription-anim");
          button.textContent = "Ajouter";
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
          pValidAnim.textContent = '"protection plastique" ajouté au nettoyage';
          validAnim.classList.add("valid-inscription-anim");
          button.textContent = "Retirer";
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 25;
          //time += 15;
        } else {
          ckbProtectionPlastiques.checked = !ckbProtectionPlastiques.checked;
          pErrorAnim.textContent = '"protection plastique" retiré du nettoyage';
          errorAnim.classList.add("error-inscription-anim");
          button.textContent = "Ajouter";
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 25;
          //time -= 15;
        }
        break;
      case "btImpermeabilisant-textiles":
        if (!ckbImpermeabilisantTextiles.checked) {
          ckbImpermeabilisantTextiles.checked =
            !ckbImpermeabilisantTextiles.checked;
          pValidAnim.textContent =
            '"imperméabilisant textiles" ajouté au nettoyage';
          validAnim.classList.add("valid-inscription-anim");
          button.textContent = "Retirer";
          setTimeout(() => {
            validAnim.classList.remove("valid-inscription-anim");
          }, 5001);
          price += 25;
          //time += 20;
        } else {
          ckbImpermeabilisantTextiles.checked =
            !ckbImpermeabilisantTextiles.checked;
          pErrorAnim.textContent =
            '"imperméabilisant textiles" retiré du nettoyage';
          errorAnim.classList.add("error-inscription-anim");
          button.textContent = "Ajouter";
          setTimeout(() => {
            errorAnim.classList.remove("error-inscription-anim");
          }, 5001);
          price -= 25;
          //time -= 20;
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
  if (value < "2024-06-17") {
    errorDisplay(
      "date",
      "Veuillez sélectionner une date supérieur au 17-06-2024" //<<<<<<<<<<<<<<<<<
    );
    date = null;
  } else {
    errorDisplay("date", "", true);
    date = value;
  }
};
// const dateChecher = (value) => {
//   if (value < dateMin) {
//     errorDisplay(
//       "date",
//       "Veuillez sélectionner une date supérieur au " +
//         (jour + 1).toString().padStart(2, "0") +
//         "-" +
//         mois +
//         "-" +
//         annee.toString()
//     );
//     date = null;
//   } else {
//     errorDisplay("date", "", true);
//     date = value;
//   }
// };

const timeChecker = (value) => {
  if (value < "08:00" || value > "15:00") {
    errorDisplay("time", "nous somme disponibles de 08:00 à 15:00");
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

  if (minutesRemaining < 10)
    minutesRemaining = minutesRemaining.toString().padStart(2, "0");

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

let lastCarSize;
inputsCkb.forEach((input) => {
  input.addEventListener("input", (e) => {
    let index;
    switch (e.target.id) {
      case "exterieur1":
        if (e.target.checked) {
          if (inputSelect.value === "citadine") {
            price += 25;
            time += 30;
          } else if (inputSelect.value === "berline-coupe") {
            price += 30;
            time += 45;
          } else if (inputSelect.value === "suv-break") {
            price += 35;
            time += 60;
          } else if (inputSelect.value === "camionette-s") {
            price += 50;
            time += 75;
          } else if (inputSelect.value === "camionette-m") {
            price += 60;
            time += 90;
          } else if (inputSelect.value === "camionette-l") {
            price += 70;
            time += 105;
          }
          formule.push(e.target.value);
        } else {
          if (inputSelect.value === "citadine") {
            price -= 25;
            time -= 30;
          } else if (inputSelect.value === "berline-coupe") {
            price -= 30;
            time -= 45;
          } else if (inputSelect.value === "suv-break") {
            price -= 35;
            time -= 60;
          } else if (inputSelect.value === "camionette-s") {
            price -= 50;
            time -= 75;
          } else if (inputSelect.value === "camionette-m") {
            price -= 60;
            time -= 90;
          } else if (inputSelect.value === "camionette-l") {
            price -= 70;
            time -= 105;
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
            price += 35;
            time += 60;
          } else if (inputSelect.value === "berline-coupe") {
            price += 40;
            time += 75;
          } else if (inputSelect.value === "suv-break") {
            price += 45;
            time += 90;
          } else if (inputSelect.value === "camionette-s") {
            price += 40;
            time += 105;
          } else if (inputSelect.value === "camionette-m") {
            price += 40;
            time += 120;
          } else if (inputSelect.value === "camionette-l") {
            price += 40;
            time += 135;
          }
          formule.push(e.target.value);
        } else {
          if (inputSelect.value === "citadine") {
            price -= 35;
            time -= 60;
          } else if (inputSelect.value === "berline-coupe") {
            price -= 40;
            time -= 75;
          } else if (inputSelect.value === "suv-break") {
            price -= 45;
            time -= 90;
          } else if (inputSelect.value === "camionette-s") {
            price -= 40;
            time -= 105;
          } else if (inputSelect.value === "camionette-m") {
            price -= 40;
            time -= 120;
          } else if (inputSelect.value === "camionette-l") {
            price -= 40;
            time -= 135;
          }

          index = formule.indexOf(e.target.value);

          if (index !== -1) {
            formule.splice(index, 1);
          }
        }
        break;
      case "polissage":
        if (e.target.checked) {
          let carSize = document.getElementById("taille").value;
          lastCarSize = carSize;
          // +50€ par taille de véhicule pour le polissage
          switch (carSize) {
            case "citadine":
              price += 250;
              time += 90;
              break;
            case "berline-coupe":
              price += 300;
              time += 105;
              break;
            case "suv-break":
              price += 350;
              time += 120;
              break;
            case "camionette-s":
              price += 400;
              time += 135;
              break;
            case "camionette-m":
              price += 450;
              time += 150;
              break;
            case "camionette-l":
              price += 500;
              time += 165;
              break;
            default:
              break;
          }

          option.push(e.target.value);
        } else {
          // -50€ par taille de véhicule pour le polissage
          switch (lastCarSize) {
            case "citadine":
              price -= 250;
              time -= 90;
              break;
            case "berline-coupe":
              price -= 300;
              time -= 105;
              break;
            case "suv-break":
              price -= 350;
              time -= 120;
              break;
            case "camionette-s":
              price -= 400;
              time -= 135;
              break;
            case "camionette-m":
              price -= 450;
              time -= 150;
              break;
            case "camionette-l":
              price -= 500;
              time -= 165;
              break;
            default:
              break;
          }

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "shampoing-siege":
        if (e.target.checked) {
          price += 70;
          time += 45;
          option.push(e.target.value);
        } else {
          price -= 70;
          time -= 45;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "shampoing-tapis":
        if (e.target.checked) {
          price += 40;
          time += 20;
          option.push(e.target.value);
        } else {
          price -= 40;
          time -= 20;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "nettoyage-bloc-moteur":
        if (e.target.checked) {
          price += 30;
          time += 30;
          option.push(e.target.value);
        } else {
          price -= 30;
          time -= 30;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "ceramique-carrosserie":
        if (e.target.checked) {
          let carSize = document.getElementById("taille").value;
          lastCarSize = carSize;
          // +50€ par taille de véhicule pour le polissage
          switch (carSize) {
            case "citadine":
              price += 120;
              time += 45;
              break;
            case "berline-coupe":
              price += 150;
              time += 50;
              break;
            case "suv-break":
              price += 180;
              time += 120;
              break;
            case "camionette-s":
              price += 210;
              time += 135;
              break;
            case "camionette-m":
              price += 240;
              time += 150;
              break;
            case "camionette-l":
              price += 270;
              time += 165;
              break;
            default:
              break;
          }
          option.push(e.target.value);
        } else {
          switch (lastCarSize) {
            case "citadine":
              price -= 120;
              time -= 45;
              break;
            case "berline-coupe":
              price -= 150;
              time -= 50;
              break;
            case "suv-break":
              price -= 180;
              time -= 120;
              break;
            case "camionette-s":
              price -= 210;
              time -= 135;
              break;
            case "camionette-m":
              price -= 240;
              time -= 150;
              break;
            case "camionette-l":
              price -= 270;
              time -= 165;
              break;
            default:
              break;
          }

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "ceramique-jantes":
        if (e.target.checked) {
          price += 80;
          time += 30;
          option.push(e.target.value);
        } else {
          price -= 80;
          time -= 30;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "ceramique-vitres":
        if (e.target.checked) {
          price += 70;
          time += 15;
          option.push(e.target.value);
        } else {
          price -= 70;
          time -= 15;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "renovateur-pneus":
        if (e.target.checked) {
          price += 30;
          //time += 15;
          option.push(e.target.value);
        } else {
          price -= 30;
          //time -= 15;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;
      case "nettoyage-sieges-cuir-alcantara":
        if (e.target.checked) {
          price += 25;
          time += 20;
          option.push(e.target.value);
        } else {
          price -= 25;
          time -= 20;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      case "protection-plastiques":
        if (e.target.checked) {
          price += 25;
          //time += 10;
          option.push(e.target.value);
        } else {
          price -= 25;
          //time -= 10;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      case "impermeabilisant-textiles":
        if (e.target.checked) {
          price += 25;
          //time += 10;
          option.push(e.target.value);
        } else {
          price -= 25;
          //time -= 10;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      case "protection-cuir":
        if (e.target.checked) {
          price += 30;
          //time += 10;
          option.push(e.target.value);
        } else {
          price -= 30;
          //time -= 10;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      case "anti-buee":
        if (e.target.checked) {
          price += 20;
          //time += 10;
          option.push(e.target.value);
        } else {
          price -= 20;
          //time -= 10;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      case "renovateur-joints":
        if (e.target.checked) {
          price += 30;
          time += 30;
          option.push(e.target.value);
        } else {
          price -= 30;
          time -= 30;

          index = option.indexOf(e.target.value);

          if (index !== -1) {
            option.splice(index, 1);
          }
        }
        break;

      case "shampoing-moquette":
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

//gère lorsque l'utilisateur change de taille de voiture alors que certaines checkboxs sont déjà cochées
let currentSelect = inputSelect.value;
inputSelect.addEventListener("input", () => {
  if (ckbPolissage.checked) {
    if (currentSelect === "citadine") {
      price -= 250;
      time -= 90;
    } else if (currentSelect === "berline-coupe") {
      price -= 300;
      time -= 105;
    } else if (currentSelect === "suv-break") {
      price -= 350;
      time -= 120;
    } else if (currentSelect === "camionette-s") {
      price -= 400;
      time -= 135;
    } else if (currentSelect === "camionette-m") {
      price -= 450;
      time -= 150;
    } else if (currentSelect === "camionette-l") {
      price -= 500;
      time -= 165;
    }
  }
  if (ckbProtectionCeramique.checked) {
    if (currentSelect === "citadine") {
      price -= 120;
      time -= 45;
    } else if (currentSelect === "berline-coupe") {
      price -= 150;
      time -= 60;
    } else if (currentSelect === "suv-break") {
      price -= 180;
      time -= 75;
    } else if (currentSelect === "camionette-s") {
      price -= 210;
      time -= 90;
    } else if (currentSelect === "camionette-m") {
      price -= 240;
      time -= 105;
    } else if (currentSelect === "camionette-l") {
      price -= 270;
      time -= 120;
    }
  }
  if (ckbExt.checked) {
    if (currentSelect === "citadine") {
      price -= 25;
      time -= 30;
    } else if (currentSelect === "berline-coupe") {
      price -= 30;
      time -= 45;
    } else if (currentSelect === "suv-break") {
      price -= 35;
      time -= 60;
    } else if (currentSelect === "camionette-s") {
      price -= 50;
      time -= 75;
    } else if (currentSelect === "camionette-m") {
      price -= 60;
      time -= 90;
    } else if (currentSelect === "camionette-l") {
      price -= 70;
      time -= 105;
    }
  }
  if (ckbInt.checked) {
    if (currentSelect === "citadine") {
      price -= 35;
      time -= 60;
    } else if (currentSelect === "berline-coupe") {
      price -= 40;
      time -= 75;
    } else if (currentSelect === "suv-break") {
      price -= 45;
      time -= 90;
    } else if (currentSelect === "camionette-s") {
      price -= 40;
      time -= 105;
    } else if (currentSelect === "camionette-m") {
      price -= 40;
      time -= 120;
    } else if (currentSelect === "camionette-l") {
      price -= 40;
      time -= 135;
    }
  }

  if (inputSelect.value === "citadine") {
    if (ckbExt.checked) {
      price += 25;
      time += 30;
    }
    if (ckbInt.checked) {
      price += 35;
      time += 60;
    }
    if (ckbPolissage.checked) {
      price += 250;
      time += 90;
    }
    if (ckbProtectionCeramique.checked) {
      price += 120;
      time += 45;
    }
  } else if (inputSelect.value === "berline-coupe") {
    if (ckbExt.checked) {
      price += 30;
      time += 45;
    }
    if (ckbInt.checked) {
      price += 40;
      time += 75;
    }
    if (ckbPolissage.checked) {
      price += 300;
      time += 105;
    }
    if (ckbProtectionCeramique.checked) {
      price += 150;
      time += 60;
    }
  } else if (inputSelect.value === "suv-break") {
    if (ckbExt.checked) {
      price += 35;
      time += 60;
    }
    if (ckbInt.checked) {
      price += 45;
      time += 90;
    }
    if (ckbPolissage.checked) {
      price += 350;
      time += 120;
    }
    if (ckbProtectionCeramique.checked) {
      price += 180;
      time += 75;
    }
  } else if (inputSelect.value === "camionette-s") {
    if (ckbExt.checked) {
      price += 50;
      time += 75;
    }
    if (ckbInt.checked) {
      price += 40;
      time += 105;
    }
    if (ckbPolissage.checked) {
      price += 400;
      time += 135;
    }
    if (ckbProtectionCeramique.checked) {
      price += 210;
      time += 90;
    }
  } else if (inputSelect.value === "camionette-m") {
    if (ckbExt.checked) {
      price += 60;
      time += 90;
    }
    if (ckbInt.checked) {
      price += 40;
      time += 120;
    }
    if (ckbPolissage.checked) {
      price += 450;
      time += 150;
    }
    if (ckbProtectionCeramique.checked) {
      price += 240;
      time += 105;
    }
  } else if (inputSelect.value === "camionette-l") {
    if (ckbExt.checked) {
      price += 70;
      time += 105;
    }
    if (ckbInt.checked) {
      price += 40;
      time += 135;
    }
    if (ckbPolissage.checked) {
      price += 500;
      time += 165;
    }
    if (ckbProtectionCeramique.checked) {
      price += 270;
      time += 120;
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
    option = [];
    inputDate.value = "2024-06-17";
    // inputDate.value =
    //   annee.toString() +
    //   "-" +
    //   mois +
    //   "-" +
    //   (jour + 2).toString().padStart(2, "0");
    inputTime.value = "08:00";
    price = 0;
    time = 0;
    spanPrice.textContent = "";
    spanTime.textContent = "";

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "assets/scripts/mail.php", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
      }
    };

    xhr.send(JSON.stringify(data));
  } else {
    pErrorAnim.textContent = "veuillez remplir correctement les champs";
    errorAnim.classList.add("error-inscription-anim");
    setTimeout(() => {
      errorAnim.classList.remove("error-inscription-anim");
    }, 5001);
  }
});*/

import services from "./services.js";

const getElement = (id) => document.getElementById(id);
const getElements = (selector) => [...document.querySelectorAll(selector)];
const createElement = (_element, _textContent = null, attributes = null) => {
  const element = document.createElement(_element);

  if (_textContent != null || _textContent != undefined) {
    element.textContent = _textContent;
  }

  if (attributes != null || attributes != undefined) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }

  return element;
};

const elements = {
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
    element: getElement("date"),
    minDayBefore: 2,
  },
  hour: {
    element: getElement("time"),
    slots: ["08:30", "13:00"],
  },
};

let order = {
  classic: [],
  options: [],
  finishing: [],
  price: 0,
  time: 0,
  date: null,
  hour: null,
};

const updatePriceAndTimeAndDisplay = (price, time) => {
  order.price += price;
  order.time += time;
  elements.priceSpan.textContent = `${order.price}€`;
  elements.timeSpan.textContent =
    order.time > 60 ? formatTime(order.time) : `${order.time}min`;
};

const formatTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}h${String(
    minutes % 60
  ).padStart(2, "0")}`;

const getWashServiceDetails = (type, id) =>
  type === "classic"
    ? services[id][elements.selectCarSize.value]
    : services.options[id] || services.finishing[id];

const addSupplementForPolishAndCeramicAccordingToCarSize = (id, checked) => {
  const index = carSizes.indexOf(elements.selectCarSize.value);
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
  let lastCarSize = elements.selectCarSize.value;

  elements.selectCarSize.addEventListener("input", () => {
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
      ...elements.classicWashes,
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
          elements.selectCarSize.value,
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

    lastCarSize = elements.selectCarSize.value;
  });
};

const handleRegexEvents = () => {
  Object.values(customerInfos).forEach(
    ({ input, regex, label, errorElement, errorMsg }) => {
      input.addEventListener("input", ({ target: { value } }) => {
        const isValid = regex.test(value);
        const hasValue = value !== "";
        input.classList.toggle("error-input", !isValid && hasValue);
        label.classList.toggle("error-label", !isValid && hasValue);
        errorElement.classList.toggle("message-error", !isValid && hasValue);
        errorElement.textContent = hasValue && !isValid ? errorMsg : "";
      });
    }
  );
};

const setDatepicker = () => {
  const date = new Date();
  const minDate = date.setDate(date.getDate() + 1);
  const maxDate = date.setDate(date.getDate() + 60);

  const options = {
    min: minDate,
    max: maxDate,
    without: ["2024/06/22"], //TODO: implémenter la logique pour bannir tous les dimanches et mardis
  };

  const constraints = {};

  new Datepicker("#datepicker", options);
};

const setTimeSlots = () => {
  appointment.hour.slots.forEach((slot) => {
    const option = createElement("option", slot, { value: slot });
    appointment.hour.element.appendChild(option);
  });
};

handleChangingCarSizeEvent();
handleCheckboxEvents(elements.classicWashes, "classic");
handleCheckboxEvents(elements.washOptions, "options");
handleCheckboxEvents(elements.washFinishing, "finishing");
handleRegexEvents();
setTimeSlots();
setDatepicker();

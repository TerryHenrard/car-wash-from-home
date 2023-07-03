const form = document.getElementById("contact-form");
const inputsCkb = document.querySelectorAll("input[type='checkbox']");
const inputsText = document.querySelectorAll("input[type='text']");
const spanPrice = document.querySelector(".price p span");
const spanTime = document.querySelector(".estimated-time p span");

let price = 0;
let time = 0;

let nom, prenom, email, rueEtNum, ville, date, heure, message;
let formule = [];
let abonnement = [];
let options = [];

// TODO fonctionne pas
const errorDisplay = (tag, message, valid) => {
  const input = document.getElementById(tag);
  const label = document.querySelector("label[for='" + tag + "']");
  const inputErrorMessage = document.querySelector(
    "." + "message-error-" + tag
  );

  if (!valid) {
    input.classList.add("error-input");
    label.classList.add("error-label");
    inputErrorMessage.textContent = message;
  } else {
    input.classList.remove("error-input");
    label.classList.remove("error-label");
    input.classList.add("input-valid");

    inputErrorMessage.textContent = message;
  }
};

const lastNameChecker = (value) => {
  if (value.lenght > 47) {
    // errorDisplay(
    //   lastName,
    //   "le nom de famille ne peut faire plus de 47 caractères"
    // );
  } else if (!value.match(/^[a-zA-Z\p{L}\s'-]+$/gmu)) {
    // errorDisplay(lastName, "les caractères spéciaux ne sont pas autorisés");
    console.log("matche pas");
  }
};

inputsText.forEach((input) => {
  input.addEventListener("input", (e) => {
    lastNameChecker(e.target.value);
  });
});

inputsCkb.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "exterieur1":
        if (e.target.checked) {
          price += 15;
          time += 20;
        } else {
          price -= 15;
          time -= 20;
        }
        break;
      case "interieur1":
        if (e.target.checked) {
          price += 25;
          time += 30;
        } else {
          price -= 25;
          time -= 30;
        }
        break;
      case "exterieur3":
        if (e.target.checked) {
          price += 40;
        } else {
          price -= 40;
        }
        break;
      case "exterieur5":
        if (e.target.checked) {
          price += 63;
        } else {
          price -= 63;
        }
        break;
      case "exterieur10":
        if (e.target.checked) {
          price += 120;
        } else {
          price -= 120;
        }
        break;
      case "interieur3":
        if (e.target.checked) {
          price += 66;
        } else {
          price -= 66;
        }
        break;
      case "interieur5":
        if (e.target.checked) {
          price += 105;
        } else {
          price -= 105;
        }
        break;
      case "interieur10":
        if (e.target.checked) {
          price += 200;
        } else {
          price -= 200;
        }
        break;
      case "polissage":
        if (e.target.checked) {
          price += 80;
          time += 150;
        } else {
          price -= 80;
          time -= 150;
        }
        break;
      case "shampoing-siege":
        if (e.target.checked) {
          price += 60;
          time += 20;
        } else {
          price -= 60;
          time -= 20;
        }
        break;
      case "shampoing-tapis":
        if (e.target.checked) {
          price += 30;
          time += 10;
        } else {
          price -= 30;
          time -= 10;
        }
        break;
    }
    spanPrice.textContent = price + "€";
    spanTime.textContent = time + "min";
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

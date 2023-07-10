const body = document.querySelector("body");
const h1MainTitle = document.querySelector(".h1-main-title");
const h2MainTitle = document.querySelector(".h2-main-title");
const pMainTitle = document.querySelector(".p-main-title");
const rightExt = document.querySelector(".right-ext");
const leftExt = document.querySelector(".left-ext");
const leftInt = document.querySelector(".left-int");
const rightInt = document.querySelector(".right-int");
const bronze = document.querySelector(".bronze");
const silver = document.querySelector(".silver");
const gold = document.querySelector(".gold");
const premium = document.querySelector(".premium");
const vip = document.querySelector(".vip");
const diamant = document.querySelector(".diamant");
const ecoP1 = document.querySelector(".eco-part1");
const ecoP2 = document.querySelector(".eco-part2");
const ecoP3 = document.querySelector(".eco-part3");
const arrowQ1 = document.querySelector(".question1 > h5 > i");
const arrowQ2 = document.querySelector(".question2 > h5 > i");
const arrowQ3 = document.querySelector(".question3 > h5 > i");
const arrowQ4 = document.querySelector(".question4 > h5 > i");
const arrowQ5 = document.querySelector(".question5 > h5 > i");
const arrowQ6 = document.querySelector(".question6 > h5 > i");
const arrowQ7 = document.querySelector(".question7 > h5 > i");
const arrowQ8 = document.querySelector(".question8 > h5 > i");
const question1 = document.querySelector(".question1 > p");
const question2 = document.querySelector(".question2 > p");
const question3 = document.querySelector(".question3 > p");
const question4 = document.querySelector(".question4 > p");
const question5 = document.querySelector(".question5 > p");
const question6 = document.querySelector(".question6 > p");
const question7 = document.querySelector(".question7 > p");
const question8 = document.querySelector(".question8 > p");
const sidebar = document.getElementById("side-bar");
const btn = document.getElementById("btn");
const navbar = document.getElementById("navbar");
const faqContainers = document.querySelectorAll(".q");
const faqTitles = document.querySelectorAll(".q > h5");
const faqparagraphs = document.querySelectorAll(".q > p");

btn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

let lastScroll = 0;
let navbarAnimation = () => {
  if (scrollY < lastScroll) {
    navbar.style.top = 50 + "px";
  } else {
    navbar.style.top = -23 + "px";
  }

  lastScroll = scrollY;
};

let tarifAnimations = () => {
  if (scrollY === 0) {
    rightExt.classList.remove("tarif-anim");
    leftExt.classList.remove("tarif-anim");
    leftInt.classList.remove("tarif-anim");
    rightInt.classList.remove("tarif-anim");
  }
  if (scrollY > 150) {
    rightExt.classList.add("tarif-anim");
    leftExt.classList.add("tarif-anim");
  }
  if (scrollY > 500) {
    leftInt.classList.add("tarif-anim");
    rightInt.classList.add("tarif-anim");
  }
};

let abonnementAnimations = () => {
  if (scrollY < 850) {
    bronze.classList.remove("abonnement-anim");
    silver.classList.remove("abonnement-anim");
    gold.classList.remove("abonnement-anim");
    premium.classList.remove("abonnement-anim");
    vip.classList.remove("abonnement-anim");
    diamant.classList.remove("abonnement-anim");
  }

  if (scrollY > 1100) {
    setTimeout(() => {
      bronze.classList.add("abonnement-anim");
    }, 100);
    setTimeout(() => {
      silver.classList.add("abonnement-anim");
    }, 250);
    setTimeout(() => {
      gold.classList.add("abonnement-anim");
    }, 400);
    setTimeout(() => {
      premium.classList.add("abonnement-anim");
    }, 400);
    setTimeout(() => {
      vip.classList.add("abonnement-anim");
    }, 250);
    setTimeout(() => {
      diamant.classList.add("abonnement-anim");
    }, 100);
  }
};

let ecologieAnimations = () => {
  if (scrollY > 1855) {
    ecoP1.style.opacity = "1";
  } else {
    ecoP1.style.opacity = "0";
  }

  if (scrollY > 1950) {
    ecoP2.style.opacity = "1";
  } else {
    ecoP2.style.opacity = "0";
  }

  if (scrollY > 2100) {
    ecoP3.style.opacity = "1";
  } else {
    ecoP3.style.opacity = "0";
  }
};

let loadAnimations = () => {
  body.style.opacity = "1";
  h1MainTitle.classList.add("h1-anim");
  h2MainTitle.classList.add("h2-anim");
  pMainTitle.classList.add("p-anim");
  navbar.classList.add("nav-anim");
};

faqTitles.forEach((title) => {
  title.addEventListener("click", (e) => {
    switch (e.target.id) {
      case "q1h5":
        question1.classList.toggle("revealAnswer");
        arrowQ1.classList.toggle("arrowUp");
        break;
      case "q2h5":
        question2.classList.toggle("revealAnswer");
        arrowQ2.classList.toggle("arrowUp");
        break;
      case "q3h5":
        question3.classList.toggle("revealAnswer");
        arrowQ3.classList.toggle("arrowUp");
        break;
      case "q4h5":
        question4.classList.toggle("revealAnswer");
        arrowQ4.classList.toggle("arrowUp");
        break;
      case "q5h5":
        question5.classList.toggle("revealAnswer");
        arrowQ5.classList.toggle("arrowUp");
        break;
      case "q6h5":
        question6.classList.toggle("revealAnswer");
        arrowQ6.classList.toggle("arrowUp");
        break;
      case "q7h5":
        question7.classList.toggle("revealAnswer");
        arrowQ7.classList.toggle("arrowUp");
        break;
      case "q8h5":
        question8.classList.toggle("revealAnswer");
        arrowQ8.classList.toggle("arrowUp");
        break;
      default:
        break;
    }
  });
});

faqparagraphs.forEach((paragraph) => {
  paragraph.addEventListener("click", (e) => {
    switch (e.target.id) {
      case "q1p":
        question1.classList.toggle("revealAnswer");
        arrowQ1.classList.toggle("arrowUp");
        break;
      case "q2p":
        question2.classList.toggle("revealAnswer");
        arrowQ2.classList.toggle("arrowUp");
        break;
      case "q3p":
        question3.classList.toggle("revealAnswer");
        arrowQ3.classList.toggle("arrowUp");
        break;
      case "q4p":
        question4.classList.toggle("revealAnswer");
        arrowQ4.classList.toggle("arrowUp");
        break;
      case "q5p":
        question5.classList.toggle("revealAnswer");
        arrowQ5.classList.toggle("arrowUp");
        break;
      case "q6p":
        question6.classList.toggle("revealAnswer");
        arrowQ6.classList.toggle("arrowUp");
        break;
      case "q7p":
        question7.classList.toggle("revealAnswer");
        arrowQ7.classList.toggle("arrowUp");
        break;
      case "q8p":
        question8.classList.toggle("revealAnswer");
        arrowQ8.classList.toggle("arrowUp");
        break;
      default:
        break;
    }
  });
});

faqContainers.forEach((container) => {
  container.addEventListener("click", (e) => {
    switch (e.target.id) {
      case "q1":
        question1.classList.toggle("revealAnswer");
        arrowQ1.classList.toggle("arrowUp");
        break;
      case "q2":
        question2.classList.toggle("revealAnswer");
        arrowQ2.classList.toggle("arrowUp");
        break;
      case "q3":
        question3.classList.toggle("revealAnswer");
        arrowQ3.classList.toggle("arrowUp");
        break;
      case "q4":
        question4.classList.toggle("revealAnswer");
        arrowQ4.classList.toggle("arrowUp");
        break;
      case "q5":
        question5.classList.toggle("revealAnswer");
        arrowQ5.classList.toggle("arrowUp");
        break;
      case "q6":
        question6.classList.toggle("revealAnswer");
        arrowQ6.classList.toggle("arrowUp");
        break;
      case "q7":
        question7.classList.toggle("revealAnswer");
        arrowQ7.classList.toggle("arrowUp");
        break;
      case "q8":
        question8.classList.toggle("revealAnswer");
        arrowQ8.classList.toggle("arrowUp");
        break;
      default:
        break;
    }
  });
});

window.addEventListener("scroll", () => {
  tarifAnimations();
  abonnementAnimations();
  ecologieAnimations();
  navbarAnimation();
});

navbar.addEventListener("mouseover", () => {
  navbar.style.top = 50 + "px";
});

window.addEventListener("load", () => {
  loadAnimations();
});

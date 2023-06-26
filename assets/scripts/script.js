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
const question1 = document.querySelector(".question1");
const question2 = document.querySelector(".question2");
const question3 = document.querySelector(".question3");
const question4 = document.querySelector(".question4");
const question5 = document.querySelector(".question5");
const question6 = document.querySelector(".question6");

let tarifAnimations = () => {
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
  if (scrollY > 1955) {
    ecoP1.style.opacity = 1;
  }

  if (scrollY > 2050) {
    ecoP2.style.opacity = 1;
  }

  if (scrollY > 2200) {
    ecoP3.style.opacity = 1;
  }
};

let faqAnimations = () => {
  if (scrollY > 2500) {
    question1.style.opacity = 1;
  }

  if (scrollY > 2600) {
    question2.style.opacity = 1;
  }

  if (scrollY > 2800) {
    question3.style.opacity = 1;
  }

  if (scrollY > 2900) {
    question4.style.opacity = 1;
  }

  if (scrollY > 3100) {
    question5.style.opacity = 1;
  }

  if (scrollY > 3200) {
    question6.style.opacity = 1;
  }
};

let lastScroll = 0;
let navbarAnimation = () => {
  if (scrollY < lastScroll) {
    navbar.style.top = 50 + "px";
  } else {
    navbar.style.top = -20 + "px";
  }

  lastScroll = scrollY;
};

let loadAnimations = () => {
  body.style.opacity = "1";
  h1MainTitle.classList.add("h1-anim");
  h2MainTitle.classList.add("h2-anim");
  pMainTitle.classList.add("p-anim");
  navbar.classList.add("nav-anim");
};

window.addEventListener("scroll", () => {
  tarifAnimations();
  abonnementAnimations();
  ecologieAnimations();
  faqAnimations();
});

navbar.addEventListener("mouseover", () => {
  navbar.style.top = 50 + "px";
});

window.addEventListener("load", () => {
  loadAnimations();
});

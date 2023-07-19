const body = document.querySelector("body");
const imgHeader = document.getElementById("start");
const navbar = document.getElementById("navbar");
const imgOptions = document.getElementById("options");
const buttons = document.querySelectorAll("button");
const headerText = document.getElementById("header-text");
const sTtitle = document.getElementById("s-title");
const sTarif = document.getElementById("s-tarif");
const mTtitle = document.getElementById("m-title");
const mTarif = document.getElementById("m-tarif");
const lTtitle = document.getElementById("l-title");
const lTarif = document.getElementById("l-tarif");
const h3Exterieur = document.querySelector(".exterieur h3");
const h3Interieur = document.querySelector(".interieur h3");
const liExterieur = document.querySelectorAll(".exterieur ul li");
const liInterieur = document.querySelectorAll(".interieur ul li");
const h3Options = document.querySelector(".options-title h3");
const boxesOptions = document.querySelectorAll(".box");

const parallaxEffects = () => {
  if (window.scrollY < 1000) {
    imgHeader.style.backgroundPosition = window.scrollY * 0.25 + "px";
  }
  imgOptions.style.backgroundSize = 3000 - window.scrollY / 3 + "px";
};

let lastScroll = 0;
const navbarAnimation = () => {
  if (scrollY < lastScroll) {
    navbar.style.top = 0 + "px";
  } else {
    navbar.style.top = -100 + "px";
  }

  lastScroll = scrollY;
};

const headerTextAnimation = () => {
  setTimeout(() => {
    headerText.style.opacity = 1;
    headerText.style.bottom = 0;
  }, 1250);
};

const tarifAnim = () => {
  if (scrollY >= 130) {
    setTimeout(() => {
      sTtitle.style.transform = "translateY(0px)";
      sTtitle.style.opacity = 1;
      sTarif.style.transform = "translateY(0px)";
      sTarif.style.opacity = 1;
    }, 500);
    setTimeout(() => {
      mTtitle.style.transform = "translateY(0px)";
      mTtitle.style.opacity = 1;
      mTarif.style.transform = "translateY(0px)";
      mTarif.style.opacity = 1;
    }, 750);
    setTimeout(() => {
      lTtitle.style.transform = "translateY(0px)";
      lTtitle.style.opacity = 1;
      lTarif.style.transform = "translateY(0px)";
      lTarif.style.opacity = 1;
    }, 1000);
  }
};

const explicationAnim = () => {
  if (scrollY >= 500) {
    setTimeout(() => {
      h3Exterieur.style.opacity = 1;
      h3Exterieur.style.transform = "translateY(0px)";
    }, 100);

    setTimeout(() => {
      h3Interieur.style.opacity = 1;
      h3Interieur.style.transform = "translateY(0px)";
    }, 200);

    setTimeout(() => {
      liExterieur.forEach((li) => {
        li.style.opacity = 1;
      });

      liInterieur.forEach((li) => {
        li.style.opacity = 1;
      });
    }, 500);
  }
};

const optionsAnim = () => {
  if (scrollY >= 1230) {
    h3Options.style.opacity = 1;
    h3Options.style.transform = "translateY(0px)";

    boxesOptions.forEach((box, index) => {
      const delay = index * 0.2;

      box.style.opacity = 1;
      box.style.transform = "translate(0px) scale(1)";
      box.style.transitionDelay = `${delay}s`;
    });
  }
};

window.addEventListener("load", () => {
  body.style.opacity = "1";
  headerTextAnimation();
});

window.addEventListener("scroll", () => {
  parallaxEffects();
  navbarAnimation();
  tarifAnim();
  explicationAnim();
  optionsAnim();
});

const body = document.querySelector("body");
const imgOptions = document.getElementById("options");
const headerText = document.getElementById("header-text");
const sTtitle = document.getElementById("s-title");
const sTarif = document.getElementById("s-tarif");
const mTtitle = document.getElementById("m-title");
const mTarif = document.getElementById("m-tarif");
const lTtitle = document.getElementById("l-title");
const lTarif = document.getElementById("l-tarif");
const utiLTarif = document.getElementById("uti-l-title");
const utiLTitle = document.getElementById("uti-l-tarif");
const utiMTarif = document.getElementById("uti-m-title");
const utiMTitle = document.getElementById("uti-m-tarif");
const utiXLTarif = document.getElementById("uti-xl-tarif");
const utiXLTitle = document.getElementById("uti-xl-title");
const h3Exterieur = document.querySelector(".exterieur h3");
const h3Interieur = document.querySelector(".interieur h3");
const liExterieur = document.querySelectorAll(".exterieur ul li");
const liInterieur = document.querySelectorAll(".interieur ul li");
const h3Options = document.querySelector(".options-title h3");
const h3Finitions = document.querySelector(".finitions-title h3");
const boxesOptions = document.querySelectorAll(".box");
const sidebar = document.getElementById("side-bar");
const aSideBar = document.querySelectorAll(".aSideBar");
const spanToggle = document.querySelector(".toggle-btn");

btn.addEventListener("click", () => sidebar.classList.toggle("active"));

aSideBar.forEach((a) => {
  a.addEventListener("click", () => {
    sidebar.classList.remove("active");
    spanToggle.classList.toggle("active-btn");
  });
});

spanToggle.addEventListener("click", () =>
  spanToggle.classList.toggle("active-btn")
);

const headerTextAnimation = () => {
  setTimeout(() => {
    headerText.style.opacity = 1;
    headerText.style.bottom = 0;
  }, 1250);
};

const fadeInTitleAndTarif = (el1, el2) => {
  el1.style.transform = "translateY(0px)";
  el1.style.opacity = 1;
  el2.style.transform = "translateY(0px)";
  el2.style.opacity = 1;
};

const tarifAnim = () => {
  if (scrollY >= 130) {
    setTimeout(() => fadeInTitleAndTarif(sTtitle, sTarif), 0);
    setTimeout(() => fadeInTitleAndTarif(mTtitle, mTarif), 250);
    setTimeout(() => fadeInTitleAndTarif(lTtitle, lTarif), 500);
    setTimeout(() => fadeInTitleAndTarif(utiMTarif, utiMTitle), 750);
    setTimeout(() => fadeInTitleAndTarif(utiLTarif, utiLTitle), 1000);
    setTimeout(() => fadeInTitleAndTarif(utiXLTarif, utiXLTitle), 1250);
  }
};

const fadeInTitleAndExplication = (el, lis) => {
  el.style.opacity = 1;
  el.style.transform = "translateY(0px)";
  lis.forEach((li) => {
    li.style.opacity = 1;
    li.style.transform = "translateY(0px)";
  });
};

const explicationAnim = () => {
  if (scrollY >= 500) {
    setTimeout(() => fadeInTitleAndExplication(h3Exterieur, liExterieur), 750);
    setTimeout(() => fadeInTitleAndExplication(h3Interieur, liInterieur), 1000);
  }
};

const optionsAnim = () => {
  if (scrollY >= 1230) {
    fadeInTitleAndTarif(h3Options, h3Finitions);

    boxesOptions.forEach((box, index) => {
      const delay = index * 0.2;

      box.style.opacity = 1;
      box.style.transform = "translate(0px)";
      box.style.transitionDelay = `${delay}s`;
    });
  }
};

window.addEventListener("load", () => {
  body.style.opacity = "1";
  headerTextAnimation();
});

window.addEventListener("scroll", () => {
  tarifAnim();
  explicationAnim();
  optionsAnim();
});

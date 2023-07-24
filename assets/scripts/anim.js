const body = document.querySelector("body");
const navbar = document.getElementById("navbar");
const imgOptions = document.getElementById("options");
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
const sidebar = document.getElementById("side-bar");
const aSideBar = document.querySelectorAll(".aSideBar");
const spanToggle = document.querySelector(".toggle-btn");

btn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

aSideBar.forEach((a) => {
  a.addEventListener("click", () => {
    sidebar.classList.remove("active");
    spanToggle.classList.toggle("active-btn");
  });
});

spanToggle.addEventListener("click", () => {
  spanToggle.classList.toggle("active-btn");
});

const parallaxEffects = () => {
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
  console.log(scrollY);
  if (scrollY >= 130) {
    setTimeout(() => {
      sTtitle.style.transform = "translateY(0px)";
      sTtitle.style.opacity = 1;
      sTarif.style.transform = "translateY(0px)";
      sTarif.style.opacity = 1;
    }, 0);
    setTimeout(() => {
      mTtitle.style.transform = "translateY(0px)";
      mTtitle.style.opacity = 1;
      mTarif.style.transform = "translateY(0px)";
      mTarif.style.opacity = 1;
    }, 250);
    setTimeout(() => {
      lTtitle.style.transform = "translateY(0px)";
      lTtitle.style.opacity = 1;
      lTarif.style.transform = "translateY(0px)";
      lTarif.style.opacity = 1;
    }, 500);
  }
};

const explicationAnim = () => {
  if (scrollY >= 500) {
    setTimeout(() => {
      h3Exterieur.style.opacity = 1;
      h3Exterieur.style.transform = "translateY(0px)";
      liExterieur.forEach((li) => {
        li.style.opacity = 1;
        li.style.transform = "translateY(0px)";
      });
    }, 750);

    setTimeout(() => {
      h3Interieur.style.opacity = 1;
      h3Interieur.style.transform = "translateY(0px)";
      liInterieur.forEach((li) => {
        li.style.opacity = 1;
        li.style.transform = "translateY(0px)";
      });
    }, 1000);
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

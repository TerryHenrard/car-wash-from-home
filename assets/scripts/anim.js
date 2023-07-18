const body = document.querySelector("body");
const imgHeader = document.getElementById("start");
const navbar = document.getElementById("navbar");
const imgOptions = document.getElementById("options");
const buttons = document.querySelectorAll("button");

const parallaxEffects = () => {
  if (window.scrollY < 1000) {
    imgHeader.style.backgroundSize = 2175 - window.scrollY / 3 + "px";
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

window.addEventListener("load", () => {
  body.style.opacity = "1";
});

window.addEventListener("scroll", () => {
  parallaxEffects();
  navbarAnimation();
});

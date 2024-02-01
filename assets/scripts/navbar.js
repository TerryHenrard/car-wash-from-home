const navbar = document.getElementById("navbar");

let lastScroll = 0;
const navbarAnimation = () => {
  if (scrollY < 400) {
    navbar.style.top = 0 + "px";
  } else if (scrollY < lastScroll) {
    navbar.style.top = 0 + "px";
  } else {
    navbar.style.top = -100 + "px";
  }

  lastScroll = scrollY;
};
window.addEventListener("scroll", () => {
  navbarAnimation();
});

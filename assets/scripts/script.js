const body = document.querySelector("body");
const h1MainTitle = document.querySelector(".h1-main-title");
const h2MainTitle = document.querySelector(".h2-main-title");
const pMainTitle = document.querySelector(".p-main-title");

let lastScroll = 0;

window.addEventListener("scroll", () => {
  if (scrollY < lastScroll) {
    navbar.style.top = 50 + "px";
  } else {
    navbar.style.top = -20 + "px";
  }

  lastScroll = scrollY;
});

navbar.addEventListener("mouseover", () => {
  navbar.style.top = 50 + "px";
});

window.addEventListener("load", () => {
  body.style.opacity = "1";
  h1MainTitle.classList.add("h1-anim");
  h2MainTitle.classList.add("h2-anim");
  pMainTitle.classList.add("p-anim");
  navbar.classList.add("nav-anim");
});

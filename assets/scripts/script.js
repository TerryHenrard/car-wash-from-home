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

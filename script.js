"use strict";

/////////////////////////////////////////
// All variables for queries

// For cookies
const header = document.querySelector(".header");
const message = document.createElement("div");
// For learn more button
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
// For modal window/ popout
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
// For operations tabs
const tabsContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContent = document.querySelectorAll(".operations__content");
// For hover effect on nav bar (menu fade)
const nav = document.querySelector(".nav");
// For revealing sections with scroll (section fade in)
const allSections = document.querySelectorAll(".section");
// For lazy loading (select img with data-src attribute)
const imgTargets = document.querySelectorAll("img[data-src]");
// For slider slides
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

/////////////////////////////////////////
// Cookies notification bar

// For cookies notification only
message.classList.add("cookie-message");
message.innerHTML = `We uses cookies to improve functionality. <button class = "btn btn--close-cookie">Got it!</button>`;
header.append(message);

// Style for cookie
message.style.backgroundColor = "#37383d";
message.style.width = "100%";
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

// For adding event listener to close cookie notification
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });

/////////////////////////////////////////
// Learn more button - smooth scrolling

btnScrollTo.addEventListener("click", function (e) {
  e.preventDefault();
  section1.scrollIntoView({ behavior: "smooth" });
});

/////////////////////////////////////////
// Nav link - smooth scrolling

// Event delegation to add smooth scrolling in parents
// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   e.preventDefault();

//   if (
//     e.target.classList.contains("nav__link") &&
//     !e.target.classList.contains("nav__link--btn")
//   ) {
//     const id = e.target.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//     console.log("link");
//   }
// });

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");

    if (id === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }
  }
});

/////////////////////////////////////////
// Modal / popup windows

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// To open the modal box
btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

// To close the modal box
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

/////////////////////////////////////////
// Operation tab

// Use event delegation (add event handler at parent)
tabsContainer.addEventListener("click", function (e) {
  // DOM traversing upwards (closest to find operations__tab)
  const clicked = e.target.closest(".operations__tab");

  // test output in developing stage
  console.log(clicked);
  console.log(clicked.dataset.tab);

  // Guard clause to prevent null reading from clicking in between
  if (!clicked) return;

  // Remove current active tabs and add new active tab
  tabs.forEach(t => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");

  // Remove current active content and add new active content
  tabsContent.forEach(c => c.classList.remove("operations__content--active"));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

/////////////////////////////////////////
// Hover effect on nav bar (menu fade)

// Function to be called in event handler
const handleHover = function (e, opacity) {
  // if clicked target is a nav__link
  if (e.target.classList.contains("nav__link")) {
    // set the link to target and find all nav link from the parents again, also the logo
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    // change the style for all links except the clicked click
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });

    // Change the style for logo when links hovered
    logo.style.opacity = opacity;
  }
  // Debugging code
  // console.log(e);
};

// Event handler for mouseover
nav.addEventListener("mouseover", e => handleHover(e, 0.5));
// nav.addEventListener("mouseover", function (e) {
//   handleHover(e, 0.5);
// });
// nav.addEventListener("mouseover", handleHover.bind(0.5));

// Event handler for mouseout
nav.addEventListener("mouseout", e => handleHover(e, 1));
// nav.addEventListener("mouseout", function (e) {
//   handleHover(e, 1);
// });
// nav.addEventListener("mouseout", handleHover.bind(1));

/////////////////////////////////////////
// Sticky header

// Bad performance style to do sticky header
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

// intersectionObserver method
// Get nav height dynamicly for rootMargin
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  // Since we only have 1 threshold, no need to use for each loop
  // This is the same as writing const entry = entries[0]
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

/////////////////////////////////////////
// Revealing Sections on Scroll

// Create callback for observer
const revealSection = function (entries, observer) {
  // const [entry] = entries;

  entries.forEach(entry => {
    // console.log(entry);

    // Return if not intersect
    if (!entry.isIntersecting) return;

    // If section intersected, remove the hidden class and unobserve the section
    entry.target.classList.remove("section--hidden");
    // Unobserve to stop observing after its job is done
    observer.unobserve(entry.target);
  });
};

// Create observer for sections
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

/////////////////////////////////////////
// Lazy loading with javascript

// Callback function for img observer
const loadImg = function (entries, observer) {
  entries.forEach(entry => {
    // console.log(entry);

    // Return if not intersecting
    if (!entry.isIntersecting) return;

    // If intersecting, replace target src with data-src
    entry.target.src = entry.target.dataset.src;

    // Upon load, remove the lazy img class
    entry.target.addEventListener("load", () =>
      entry.target.classList.remove("lazy-img")
    );

    // Unobserve once everything is done
    observer.unobserve(entry.target);
  });
};

// Create img observer
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

// Add observer to all img with lazy load class
imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////
// Slider / Carousel

// Wrap everything in a slider function to not clutter the global scope (rmb to call it at the end)
const slider = function () {
  // current slide in 0 base (for dot button and to change slide)
  let currentSlide = 0;

  // Prevent unlimited next slide
  const maxSlide = slides.length;

  // Function to create dots
  const createDots = function () {
    // we using slides.forEach just because we need to loop it for the amount of slides
    slides.forEach(function (_, index) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class = "dots__dot" data-slide= "${index}"></button>`
      );
    });
  };

  // Funtion to activate active dot
  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach(dot => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  // Function to go to slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, index) =>
        (s.style.transform = `translateX(${100 * (index - slide)}%)`)
    );
    activateDot(slide);
  };

  // Function to go next slide
  const nextSlide = function () {
    // -1 because current slide is in 0 base
    // only add if not the end, if reach the end, go back to first slide (0 base)
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    // we want the slide to change position (index 0) 0%-> -100%,  (index1) 100%-> 0%,  (index 2) 200%->100%
    goToSlide(currentSlide);
  };

  // Function to go prev slide
  const prevSlide = function () {
    // only decrease if not the beginning, if reach the beginning, go back to the last slide (0 base)
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
  };

  // Function to initialize the carousel
  const init = function () {
    // Set initial layout, create dots
    createDots();

    // Set default slide is slide 0 (// (index 0) 0% (index1) 100% (index 2) 200%)
    goToSlide(0);
  };

  // Initialize default
  init();

  // Add event listener to the left and right button
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  // Add event listener to keyboard as well
  document.addEventListener("keydown", function (e) {
    console.log(e);
    // if left arrow key pressed, go prev slide (if method)
    if (e.key === "ArrowLeft") prevSlide();
    // if right arrow key pressed, go next slide (shortcircuiting method, both methods works)
    e.key === "ArrowRight" && nextSlide();
  });

  // Add event listener to the slide dots
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      currentSlide = Number(e.target.dataset.slide);
      // For debugging
      // console.log(currentSlide, typeof currentSlide);

      // const slide = e.target.dataset.slide;
      // console.log(e.target.dataset);
      // console.log(slide, typeof slide);

      goToSlide(currentSlide);
    }
  });
};

// Call the whole slider function
slider();

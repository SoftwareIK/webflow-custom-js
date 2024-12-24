let popupShown = false;
let highIntentClickCount = 0; // Counter for high intent clicks
const highIntentThreshold = 1; // Number of clicks to mark a user as high intent
const highIntentCookieName = "highIntentUser";

function fetchCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function getDeviceType() {
  var e = navigator.userAgent;
  return /mobile/i.test(e)
    ? "Mobile"
    : /iPad|Android|Touch/i.test(e)
      ? "Tablet"
      : "Desktop";
}

function mobileDevice() {
  return getDeviceType() === "Mobile";
}

function desktopDevice() {
  return getDeviceType() == "Desktop";
}

function splitTraffic() {
  let isVarient = false;
  try {
    uuid = fetchCookie("unique_visitor_id6") || "";
    const trimmedUuid = uuid.slice(0, 50);
    const lastTwoDigits = parseInt(trimmedUuid.slice(-2)); // Defaults to base 10
    isVarient = lastTwoDigits >= weightageOfVariant;

    if(location.host.includes("learn") && !desktopDevice()){
      isVarient = lastTwoDigits >= 0;
    }

    if (window.clarity) {
      window.clarity(
        "set",
        "intent-variant",
        isVarient ? "variant" : "control"
      );
    }
  } catch (error) {
    console.log(error);
  }
  return isVarient;
}

function trackHighIntentClicks() {
  document.addEventListener("click", (e) => {
    // Check if the clicked element is a link
    const target = e.target.closest("a");
    if (target) {
      const href = target.getAttribute("href");

      // Ignore in-page links and JavaScript links
      if (
        !href || // No href attribute
        href.startsWith("#") || // In-page links
        target.pathname === window.location.pathname // Same page links
      ) {
        return;
      }

      // Increment the high intent click counter
      highIntentClickCount++;

      console.log(`Valid navigation link clicked. Total clicks: ${highIntentClickCount}`);

      if (highIntentClickCount >= highIntentThreshold) {
        // Set a cookie to suppress the popup for high intent users
        setCookie(highIntentCookieName, "true", 6); // Suppress popup for 6 hours
        console.log("High intent user detected. Suppressing popup.");
      }
    }
  });
}

function hideCurrentModalOnBlogPage() {
  const pathname = window.location.pathname;

  if (pathname.includes("/blogs/")) {
    const modalElements = document.querySelectorAll(".fs_modal-2_component");
    modalElements.forEach((element) => {
      element.style.display = "none";
    });
  }
}

function initExitIntentPopup(eagerLoadImage, options = {}) {
  const COOKIE_NAME = "exitIntentPopupShown";

  // Configurable parameters with default values
  const {
    downScrollThreshold = 50, // Minimum scroll down percentage to start tracking upward scroll
    upScrollThreshold = 5, // Minimum upward scroll percentage to trigger popup after scrolling down
    upScrollSpeedThreshold = 10, // Minimum upward scroll speed in percentage per second
    popupTimeoutHours = 6, // Timeout duration to prevent reappearing in hours
    checkInterval = 100, // Interval to check scroll status in milliseconds
    initialScrollIgnore = 10, // Initial scroll percentage to ignore (avoids accidental triggers on load)
    bottomIgnoreThreshold = 5, // Bottom 5% of the page to ignore upward scrolls
    outsideViewportDelay = 500, // Minimum time outside viewport to trigger popup (in ms)
  } = options;

  let maxScrollPercent = 0; // Maximum scroll percentage reached by the user
  let popupInitialized = false;
  let exitPopup = null;
  let isTrackingUpScroll = false; // Flag to start tracking upward scroll only after downScrollThreshold is reached
  let lastUpScrollTimestamp = Date.now(); // Timestamp of the last upward scroll detected
  let contextMenuOpen = false; // Flag to track if the context menu was opened
  let outsideViewportTimer; // Timer for tracking time outside viewport

  // Utility to set a cookie with a specified expiry in hours
  const setCookie = (name, value, hours) => {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/;`;
  };

  // Utility to get the value of a specific cookie by name
  const fetchCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) return cookie[1];
    }
    return null;
  };

  const closePopup = (overlay, trackClick = true) => {
    // Close popup
    overlay.style.display = "none";

    if (trackClick) {
      saveClickActivity("exit_intent_clicked", new Date().getTime());
    }
  }

  const createExitIntentPopup = () => {
    // Overlay
    const overlay = document.createElement("div");
    overlay.id = "exit-intent-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";

    // Popup container
    const popup = document.createElement("div");
    popup.id = "exit-intent-popup";
    popup.style.position = "relative";
    popup.style.backgroundColor = "white";
    popup.style.borderRadius = "8px";
    if (mobileDevice()) {
      popup.style.paddingTop = "30px";
      popup.style.paddingBottom = "30px";
      popup.style.maxWidth = "80%";
    } else {
      popup.style.maxWidth = "800px";
    }
    popup.style.maxHeight = "80%";
    popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    popup.style.textAlign = "center";

    // Image element
    const image = document.createElement("img");
    image.src = eagerLoadImage.src;
    image.alt = "IKIQ thumbnail";
    image.style.maxWidth = "100%";
    image.style.height = "auto";
    image.style.cursor = "pointer";
    image.style.borderRadius = "8px";

    // Image click event to redirect, close popup, and track activity
    image.onclick = () => {
      const targetUrl = new URL(
        "https://ikiq.interviewkickstart.com/resume-analysis"
      );

      const appendUTMParams = () => {
        const urlParams = new URLSearchParams(window.location.search);

        if ([...urlParams].length > 0) {
          urlParams.forEach((value, key) =>
            targetUrl.searchParams.append(key, value)
          );
        } else {
          const vLatestCookie = fetchCookie("v_latest");
          if (vLatestCookie) {
            try {
              const utmParams = JSON.parse(decodeURIComponent(vLatestCookie));
              Object.keys(utmParams).forEach((key) => {
                if (utmParams[key]) {
                  targetUrl.searchParams.append(key, utmParams[key]);
                }
              });
            } catch (error) {
              console.error("Failed to parse v_latest cookie:", error);
            }
          }
        }
      };

      appendUTMParams();
      window.open(targetUrl.toString(), "_blank");

      // Track image click activity
      saveClickActivity("exit_intent_image_clicked", new Date().getTime());

      closePopup(overlay, false);
    };

    popup.appendChild(image);

    // Close button
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.style.position = "absolute";
    closeButton.style.top = "0";
    closeButton.style.right = "14px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "32px";
    closeButton.style.color = "#555";

    // Close button click event to close popup and track activity
    closeButton.onclick = () => {
      closePopup(overlay);
    };

    popup.appendChild(closeButton);

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Close popup when clicking outside
    overlay.onclick = (event) => {
      if (event.target === overlay) {
        closePopup(overlay);
      }
    };

    return overlay;
  };

  const shouldShowPopup = () => {
    let isFormOpened = false;
    let isVideoOpened = false;
    let isHighIntentUser = fetchCookie(highIntentCookieName) === "true";

    try {
      isFormOpened = !!document.querySelector('.webinar__lightbox') && getComputedStyle(document.querySelector('.webinar__lightbox')).display != 'none';
      isVideoOpened = !!document.querySelector('.w-lightbox-backdrop') && getComputedStyle(document.querySelector('.w-lightbox-backdrop')).display != 'none';
    } catch (error) {
      console.error("Failed to check if form or video is opened:", error);
    }

    const isSwitchup = webinarType === "SWITCH_UP";

    const shouldShow = !fetchCookie(COOKIE_NAME) && !popupShown && !isFormOpened && !isVideoOpened && !isSwitchup && !isHighIntentUser;
    if (shouldShow && window.location.pathname.includes("/blogs/") && typeof(blogPopupShown) != undefined) {
      return !blogPopupShown;
    }
    return shouldShow;
  };

  const showPopup = () => {
    if (!popupInitialized && shouldShowPopup()) {
      exitPopup = createExitIntentPopup();
      popupInitialized = true;
    }
    if (shouldShowPopup()) {
      exitPopup.style.display = "flex";
      popupShown = true; // Mark the popup as shown in the current session
      setCookie(COOKIE_NAME, "true", popupTimeoutHours);
      hideCurrentModalOnBlogPage();
    }
  };

  // Detect scroll behavior to trigger popup on exit intent
  const detectExitIntentScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Calculate the current scroll percentage
    const currentScrollPercent =
      (scrollTop / (documentHeight - windowHeight)) * 100;

    // Ignore initial scrolls if they haven't reached the initialScrollIgnore threshold
    if (currentScrollPercent < initialScrollIgnore) {
      return;
    }

    // Track max scroll percentage and start tracking upward scroll after downScrollThreshold
    maxScrollPercent = Math.max(maxScrollPercent, currentScrollPercent);
    if (maxScrollPercent >= downScrollThreshold) {
      isTrackingUpScroll = true;
    }

    // Check for upward scroll only if downScrollThreshold was reached and not within the bottom ignore threshold
    if (
      isTrackingUpScroll &&
      currentScrollPercent <= maxScrollPercent - upScrollThreshold &&
      currentScrollPercent < 100 - bottomIgnoreThreshold
    ) {
      // Calculate the scroll-up speed
      const now = Date.now();
      const timeElapsed = (now - lastUpScrollTimestamp) / 1000; // Convert to seconds
      const scrollUpSpeed = upScrollThreshold / timeElapsed;

      // Check if the scroll-up speed exceeds the threshold
      if (scrollUpSpeed >= upScrollSpeedThreshold) {
        showPopup();
      }

      // Update timestamp
      lastUpScrollTimestamp = now;
    }
  };

  // Set interval for detecting scroll behavior
  const initializeScrollDetection = () => {
    setInterval(detectExitIntentScroll, checkInterval);
  };

  // Mobile: Detect back button or history change attempt
  const detectBackButton = () => {
    window.addEventListener("popstate", () => {
      showPopup();
    });

    // Push a state to history to capture 'back' press
    window.history.pushState(null, "", window.location.href);
  };

  // Mobile & Desktop: Detect visibility change (tab or app going to background)
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      showPopup();
    }
  };

  // Mobile & Desktop: Detect blur event when focus leaves the browser window
  const onWindowBlur = () => {
    showPopup();
  };

  // Desktop: Detect mouseleave event to identify exit intent
  const onMouseLeave = (e) => {
    if (contextMenuOpen) return; // Ignore if context menu is open

    if (e.clientY <= 0 || e.relatedTarget === null) {
      // Set a timeout to show popup if user stays outside viewport for more than the specified delay
      outsideViewportTimer = setTimeout(() => {
        showPopup();
      }, outsideViewportDelay);
    }
  };

  // Cancel the popup if the user re-enters within 500ms
  const onMouseEnter = () => {
    clearTimeout(outsideViewportTimer); // Clear the timer if user returns within delay
  };

  // Track context menu open/close state
  window.addEventListener("contextmenu", () => {
    contextMenuOpen = true;
  });

  window.addEventListener("click", () => {
    contextMenuOpen = false;
  });

  // Add event listeners based on device type
  const initializeExitIntentDetection = () => {
    if (!mobileDevice()) {
      // Desktop-specific exit intent triggers
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mouseenter", onMouseEnter); // Track re-entering viewport
    } else {
      // Mobile-specific exit intent triggers
      detectBackButton();
      initializeScrollDetection(); // Only initialize scroll detection on mobile
    }

    // General triggers for both mobile and desktop
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
  };

  // Run the initialization function when DOM is fully loaded
  document.addEventListener("DOMContentLoaded", initializeExitIntentDetection);
}

function ignorePath() {
  const finalStepPages = [
    "signup-final-step",
    "signup-final-step-v6",
    "signup-final-step-switchup",
    "signup-final-step-switchup-v6",
    "ikiq-webinar-registration",
    "/webinar-registration"
  ];

  // Check if current URL matches any of the predefined final step pages
  const isFinalStepPage = finalStepPages.some((step) =>
    window.location.pathname.includes(step)
  );

  // Check for paths matching "/su/*"
  const isSuPage =
    window.location.pathname.startsWith("/su/") &&
    window.location.hostname === "www.interviewkickstart.com";

  return isFinalStepPage || isSuPage;
}

if (!ignorePath()) {
  const isVariant = splitTraffic();
  if (isVariant) {
    const eagerLoadImage = new Image();
    if (mobileDevice()) {
      eagerLoadImage.src =
        "https://cdn.prod.website-files.com/65b0a8bbe7894a07737a1710/6735d41ebced5e2946456b47_Mobile.webp";
    } else {
      eagerLoadImage.src =
        "https://cdn.prod.website-files.com/65b0a8bbe7894a07737a1710/6736c3bbc05aac9dc828b94f_exit-intent-web.webp";
    }

    console.log("Current variant", "variant");
    initExitIntentPopup(eagerLoadImage, {
      downScrollThreshold: 1,
      upScrollThreshold: 5,
      upScrollSpeedThreshold: 30,
      popupTimeoutHours: 3,
      checkInterval: 100,
      initialScrollIgnore: 15,
      bottomIgnoreThreshold: 5,
      outsideViewportDelay: 500, // Minimum time outside viewport to trigger popup (500ms)
    });
  } else {
    console.log("Current variant", "control");
  }
}

trackHighIntentClicks();

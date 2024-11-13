const weightageOfVariant = 50;
let popupShown = false;

function splitTraffic() {
  let isVarient = false;
  try {
    uuid = getCookie("unique_visitor_id6") || "";
    const trimmedUuid = uuid.slice(0, 50);
    const lastTwoDigits = parseInt(trimmedUuid.slice(-2)); // Defaults to base 10
    isVarient = lastTwoDigits >= weightageOfVariant;

    if(window.clarity) {
      window.clarity("set", "intent-variant", isVarient ? "variant" : "control");
    }
  } catch (error) {
    console.log(error)
  }
  return isVarient;
}

function initExitIntentPopup(imageUrl, options = {}) {
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
  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) return cookie[1];
    }
    return null;
  };

  const createExitIntentPopup = () => {
    const popup = document.createElement("div");
    popup.id = "exit-intent-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.padding = "20px";
    popup.style.backgroundColor = "white";
    popup.style.border = "1px solid #ddd";
    popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    popup.style.zIndex = "9999";
    popup.style.textAlign = "center";
    popup.style.display = "none";

    // Add image to the popup
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = "Special Offer";
    image.style.maxWidth = "100%";
    image.style.height = "auto";
    popup.appendChild(image);

    // Close button
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.style.marginTop = "10px";
    closeButton.onclick = () => {
      popup.style.display = "none";
      setCookie(COOKIE_NAME, "true", popupTimeoutHours);
      popupShown = true; // Mark the popup as shown in the current session
    };
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
    return popup;
  };

  const shouldShowPopup = () => {
    return !popupShown;
    return !getCookie(COOKIE_NAME) && !popupShown;
  };

  const showPopup = () => {
    if (!popupInitialized && shouldShowPopup()) {
      exitPopup = createExitIntentPopup();
      popupInitialized = true;
    }
    if (shouldShowPopup()) {
      exitPopup.style.display = "block";
      popupShown = true; // Mark the popup as shown in the current session
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

  let mouseY = 0;
  let timer;

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

  // Desktop: Detect when the user moves the mouse upwards quickly
  const onMouseMove = (e) => {
    if (e.clientY < mouseY && mouseY > window.innerHeight - 100) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!contextMenuOpen) showPopup(); // Show popup only if context menu wasn't open
      }, outsideViewportDelay);
    }
    mouseY = e.clientY;
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
    if (window.innerWidth > 768) {
      // Desktop-specific exit intent triggers
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mouseenter", onMouseEnter); // Track re-entering viewport
      document.addEventListener("mousemove", onMouseMove);
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

function showScrollInfo() {
  // Create a div for displaying scroll information
  const scrollInfo = document.createElement("div");
  scrollInfo.style.position = "fixed";
  scrollInfo.style.top = "10px";
  scrollInfo.style.left = "10px";
  scrollInfo.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  scrollInfo.style.color = "white";
  scrollInfo.style.padding = "5px 10px";
  scrollInfo.style.borderRadius = "5px";
  scrollInfo.style.fontSize = "14px";
  scrollInfo.style.zIndex = "1000";
  document.body.appendChild(scrollInfo);

  let lastScrollTop = window.scrollY;
  let lastTime = performance.now();

  function updateScrollInfo() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;

    // Calculate scroll speed
    const currentTime = performance.now();
    const timeElapsed = currentTime - lastTime;
    const distanceScrolled = Math.abs(scrollTop - lastScrollTop);
    const speed = ((distanceScrolled / timeElapsed) * 1000).toFixed(2); // px per second

    // Get display width, height, and device type
    const width = window.innerWidth;
    const height = window.innerHeight;
    const deviceType = width > 768 ? "Desktop" : "Mobile";

    // Update display with scroll percentage, speed, screen dimensions, and device type
    scrollInfo.textContent = `Scroll: ${Math.round(
      scrolled
    )}% | Speed: ${speed} px/s | Width: ${width}px | Height: ${height}px | Device: ${deviceType} | Popup shown?: ${
      popupShown ? "yes" : "no"
    }`;

    // Update last scroll position and time for next calculation
    lastScrollTop = scrollTop;
    lastTime = currentTime;
  }

  // Update scroll info on scroll and resize events
  window.addEventListener("scroll", updateScrollInfo);
  window.addEventListener("resize", updateScrollInfo);
}

// const isVariant = splitTraffic();
// if(isVariant){
  initExitIntentPopup(
    "https://cdn.prod.website-files.com/5d0cef7a72ca1b074065dfda/6614e5e55597d19627c656ba_blog-ik-thumbnail-p-500.png",
    {
      downScrollThreshold: 1,
      upScrollThreshold: 1,
      upScrollSpeedThreshold: 5,
      popupTimeoutHours: 6,
      checkInterval: 100,
      initialScrollIgnore: 10,
      bottomIgnoreThreshold: 5,
      outsideViewportDelay: 500, // Minimum time outside viewport to trigger popup (500ms)
    }
  );
  showScrollInfo();
// }
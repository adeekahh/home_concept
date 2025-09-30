class MWG007Component extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.loadTemplate();
    this.loadExternalScripts();
  }

  async loadTemplate() {
    try {
      const response = await fetch("scroll-gallery.html");
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const template = doc.getElementById("mwg-007-template");

      if (template) {
        const templateContent = template.content;
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
      }
    } catch (error) {
      console.error("Failed to load template:", error);
    }
  }

  async loadExternalScripts() {
    // Load GSAP if not already loaded
    if (!window.gsap) {
      await this.loadScript(
        "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"
      );
    }

    // Load ScrollTrigger if not already loaded
    if (!window.ScrollTrigger) {
      await this.loadScript(
        "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
      );
    }

    // Load Lenis if not already loaded
    if (!window.Lenis) {
      await this.loadScript("https://unpkg.com/lenis@1.1.16/dist/lenis.min.js");
    }

    // Initialize the animation after scripts are loaded
    this.initializeAnimation();
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  initializeAnimation() {
    // Register ScrollTrigger plugin
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize Lenis smooth scroll (optional)
    if (window.Lenis && !window.lenis) {
      window.lenis = new Lenis({
        autoRaf: true,
      });
    }

    const root = this.shadowRoot.querySelector(".mwg_effect007");
    const scrollText = root.querySelector(".scroll");
    const pinHeight = root.querySelector(".pin-height");
    const container = root.querySelector(".container");
    const description = root.querySelector(".description");
    const description2 = root.querySelector(".description-2");
    const description3 = root.querySelector(".description-3");
    const circles = root.querySelectorAll(".circle");
    const titles = root.querySelectorAll(".title");
    const debuggerElement = root.querySelector(".debugger");
    const circleIndexElement = root.querySelector("#circle-index");
    const scrollProgressElement = root.querySelector("#scroll-progress");
    const backgroundImages = root.querySelectorAll(".background-image");

    // Track current circle index (-1 means no circle is active yet)
    let currentCircleIndex = -1;

    // Track floating image animations for each circle
    const floatingAnimations = new Map();

    // Function to animate floating images when circle becomes active
    const animateFloatingImages = (circleIndex) => {
      const circle = circles[circleIndex];
      if (!circle) return;

      const floatingImages = circle.querySelectorAll(".floating");
      if (floatingImages.length === 0) return;

      // Kill any existing animation for this circle
      if (floatingAnimations.has(circleIndex)) {
        floatingAnimations.get(circleIndex).kill();
      }

      // Create new timeline with elastic animation and stagger
      const tl = gsap.timeline();

      // Animate from scale 0 to 0.75 with elastic ease and stagger
      tl.fromTo(
        floatingImages,
        { scale: 0 },
        {
          scale: 0.75,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.1,
        }
      );

      // Store the timeline for potential cleanup
      floatingAnimations.set(circleIndex, tl);
    };

    // Function to hide floating images when circle becomes inactive
    const hideFloatingImages = (circleIndex) => {
      const circle = circles[circleIndex];
      if (!circle) return;

      const floatingImages = circle.querySelectorAll(".floating");
      if (floatingImages.length === 0) return;

      // Kill any existing animation for this circle
      if (floatingAnimations.has(circleIndex)) {
        floatingAnimations.get(circleIndex).kill();
      }

      // Animate to scale 0
      const tl = gsap.timeline();
      tl.to(floatingImages, {
        scale: 0,
        duration: 0.3,
        ease: "power2.inOut",
        stagger: 0.05,
      });

      // Store the timeline for potential cleanup
      floatingAnimations.set(circleIndex, tl);
    };

    // Function to update debugger display
    const updateDebugger = (index, progress) => {
      if (circleIndexElement) {
        circleIndexElement.textContent = index;
      }
      if (scrollProgressElement) {
        scrollProgressElement.textContent = `${Math.round(progress * 100)}%`;
      }
    };

    // Function to update background images with sequential fade transition
    const updateBackgroundImage = (index) => {
      const currentActive = root.querySelector(".background-image.active");
      const newActive = backgroundImages[index];

      // If same image, do nothing
      if (currentActive === newActive) return;

      // Animation timeline for sequential fade
      const tl = gsap.timeline();

      // First, fade in the new background image
      if (newActive) {
        gsap.set(newActive, { opacity: 0 });
        newActive.classList.add("active");

        tl.to(newActive, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }

      // Then, fade out the current active image
      if (currentActive) {
        tl.to(
          currentActive,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => {
              currentActive.classList.remove("active");
            },
          },
          "-=0.1"
        ); // Start slightly before the fade-in completes for smoother transition
      }
    };

    // Function to update active class on descriptions with animations
    const updateDescriptionActive = (index) => {
      const descriptions = [description, description2, description3];

      // Find currently active description
      const currentActive = descriptions.find(
        (desc) => desc && desc.classList.contains("active")
      );

      // Find new description to activate
      const newActive = descriptions[index];

      // If same description, do nothing
      if (currentActive === newActive) return;

      // Animation timeline
      const tl = gsap.timeline();

      // Fade out current active description to the top
      if (currentActive) {
        tl.to(currentActive, {
          y: -30,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            currentActive.classList.remove("active");
          },
        });
      }

      // Fade in new active description from bottom
      if (newActive) {
        // Set initial state for new description
        gsap.set(newActive, {
          y: 30,
          opacity: 0,
        });

        // Add active class and animate in
        newActive.classList.add("active");

        tl.to(
          newActive,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.inOut",
          },
          currentActive ? "-=0.2" : "0"
        ); // Overlap animations if there's a current active
      }
    };

    // Initialize all floating images to scale 0
    circles.forEach((circle) => {
      const floatingImages = circle.querySelectorAll(".floating");
      if (floatingImages.length > 0) {
        gsap.set(floatingImages, { scale: 0 });
      }
    });

    // Don't initialize any active states since currentCircleIndex starts at -1
    // The first circle will be activated when scroll progress reaches the threshold

    // Hide scroll text animation
    gsap.to(scrollText, {
      autoAlpha: 0,
      duration: 0.2,
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "top top-=1",
        toggleActions: "play none reverse none",
      },
    });

    // Pin the container
    ScrollTrigger.create({
      trigger: pinHeight,
      start: "top top",
      end: "bottom bottom",
      pin: container,
    });

    // Pin all description elements
    ScrollTrigger.create({
      trigger: pinHeight,
      start: "top top",
      end: "bottom bottom",
      pin: description,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: pinHeight,
      start: "top top",
      end: "bottom bottom",
      pin: description2,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: pinHeight,
      start: "top top",
      end: "bottom bottom",
      pin: description3,
      pinSpacing: false,
    });

    // Animate circles rotation
    gsap.fromTo(
      circles,
      {
        rotation: 30,
      },
      {
        rotation: -30,
        ease: "power2.inOut",
        stagger: 0.2,
        scrollTrigger: {
          trigger: pinHeight,
          start: "top 125%",
          end: "bottom 50%",
          scrub: true,
        },
      }
    );

    // Animate title images rotation
    const titleImages = root.querySelectorAll(".circle img.title");
    gsap.fromTo(
      titleImages,
      {
        x: "-25%",
      },
      {
        x: "-75%",
        ease: "power2.inOut",
        stagger: 0.2,
        scrollTrigger: {
          trigger: pinHeight,
          start: "top 125%",
          end: "bottom 50%",
          scrub: true,
        },
      }
    );

    // Animate background images based on pin scroll progress
    ScrollTrigger.create({
      trigger: pinHeight,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;

        // Determine current circle index based on progress
        // Keep activeIndex at -1 until first circle is almost fully on screen
        let newCircleIndex;
        if (progress <= 0.025) {
          newCircleIndex = -1; // No circle active yet
        } else if (progress <= 0.33) {
          newCircleIndex = 0;
        } else if (progress <= 0.66) {
          newCircleIndex = 1;
        } else {
          newCircleIndex = 2;
        }

        // Update circle index if changed
        if (newCircleIndex !== currentCircleIndex) {
          const previousCircleIndex = currentCircleIndex;
          currentCircleIndex = newCircleIndex;

          // Hide floating images from previous circle (if it was a valid index)
          if (
            previousCircleIndex >= 0 &&
            previousCircleIndex !== newCircleIndex
          ) {
            hideFloatingImages(previousCircleIndex);
          }

          // Only update UI elements if we have a valid circle index
          if (currentCircleIndex >= 0) {
            // Update background image with fade transition
            updateBackgroundImage(currentCircleIndex);
            // Update active class when circle index changes
            updateDescriptionActive(currentCircleIndex);
            // Animate floating images for new active circle
            animateFloatingImages(currentCircleIndex);
          }
        }

        // Update debugger display
        updateDebugger(currentCircleIndex, progress);
      },
    });

    // Animate color backgrounds for each media
    circles.forEach((circle, index) => {
      const background = circle.querySelector(".media-background");

      if (!background) {
        console.error(`No background found for circle ${index}`);
        return;
      }
    });
  }
}

// Define the custom element
customElements.define("mwg-007", MWG007Component);

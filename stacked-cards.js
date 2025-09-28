class StackedCardsComponent extends HTMLElement {
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
      const response = await fetch("stacked-cards.html");
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const template = doc.getElementById("stacked-cards-template");

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

    const root = this.shadowRoot.querySelector(".stacked_cards");
    const pinHeight = root.querySelector(".pin-height");
    const container = root.querySelector(".container");

    // Pin the container
    ScrollTrigger.create({
      trigger: pinHeight, // Listen to pin-height
      start: "top top",
      end: "bottom bottom",
      pin: container, // The pinned section
    });

    let gap = 30;
    const medias = root.querySelectorAll(".media");
    const distPerMedia =
      (pinHeight.clientHeight - window.innerHeight) / medias.length;

    // Set initial positions for medias (stacked effect)
    gsap.set(medias, {
      y: gap * (medias.length - 1),
      z: -gap * (medias.length - 1),
    });

    medias.forEach((media, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinHeight, // Listen to pin-height position
          start: "top top+=" + distPerMedia * index,
          end: "bottom bottom+=" + distPerMedia * index,
          scrub: 0.5,
          // Progresses with the scroll and takes 0.5s to reach the scrollbar
        },
      });

      // Move medias up in the stack
      for (let i = 0; i < medias.length - 1; i++) {
        tl.to(media, {
          // Gains one position in the deck queue
          y: "-=" + gap,
          z: "+=" + gap,
          ease: "back.inOut(3)", // Light bounce at the start and end of the animation
        });
      }

      // Final animation - media flies away
      tl.to(media, {
        yPercent: -80, // Moves up by 80% of its height
        y: "-50vh", // Moves up to half the screen
        scale: 1.2, // The media slightly enlarges as it disappears
        rotation: (Math.random() - 0.5) * 50, // Will be different for each media
        ease: "power4.in", // Starts gradually
      });
    });
  }
}

// Define the custom element
customElements.define("stacked-cards", StackedCardsComponent);

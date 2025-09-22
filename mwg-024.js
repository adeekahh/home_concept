class MWG024Component extends HTMLElement {
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
      const response = await fetch("mwg-024.html");
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const template = doc.getElementById("mwg-024-template");

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
    // Wait for fonts to load
    document.fonts.ready.then(() => {
      if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        /* LENIS SMOOTH SCROLL (OPTIONAL) */
        if (window.Lenis && !window.lenis) {
          window.lenis = new Lenis({
            autoRaf: true,
          });
        }

        const sentence1 = this.shadowRoot.querySelector(
          ".mwg_effect024 .sentence1 p"
        );
        const sentence2 = this.shadowRoot.querySelector(
          ".mwg_effect024 .sentence2 p"
        );

        const pinHeight = this.shadowRoot.querySelector(
          ".mwg_effect024 .pin-height"
        );
        const container = this.shadowRoot.querySelector(
          ".mwg_effect024 .container"
        );

        if (sentence1 && sentence2 && pinHeight && container) {
          ScrollTrigger.create({
            trigger: pinHeight, // Listens to the position of pin-height
            start: "top top", // Starts when the top is at 0% of the viewport
            end: "bottom bottom", // Ends when the bottom is at 100% of the viewport
            pin: container,
          });

          // Animate the text marquee
          gsap.to(sentence1, {
            // gsap.to() for forward movement
            x: -sentence1.clientWidth / 2, // Half the width of the phrase
            ease: "none", // Linear movement
            duration: 10,
            repeat: -1, // Infinite repetition
          });

          gsap.from(sentence2, {
            // gsap.from() for backward movement
            x: -sentence2.clientWidth / 2,
            ease: "none", // Linear movement
            duration: 10,
            repeat: -1, // Infinite repetition
          });

          gsap.to([sentence1, sentence2], {
            yPercent: "-=100", // Non-linear movement
            ease: "power1.inOut", // Non-linear movement
            scrollTrigger: {
              trigger: pinHeight, // Listens to pinHeight
              start: "top top", // Starts when the top is at 0% of the viewport
              end: "bottom bottom", // Ends when the bottom is at 100% of the viewport
              scrub: 0.4, // Progresses with the scroll, takes 0.4s to update
            },
          });
        }
      }
    });
  }
}

// Define the custom element
customElements.define("mwg-024", MWG024Component);

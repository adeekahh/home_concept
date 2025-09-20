class ParallaxColumnsComponent extends HTMLElement {
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
      const response = await fetch("parallax-columns.html");
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const template = doc.getElementById("parallax-columns-template");

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
    // Wait for DOM to be ready
    requestAnimationFrame(() => {
      let incr = 0;
      let scrollProgress = 0; // Track scroll progress from 0 to 1

      const col1 = this.shadowRoot.querySelector(
        ".parallax-columns .container1"
      );
      const col2 = this.shadowRoot.querySelector(
        ".parallax-columns .container2"
      );
      const col3 = this.shadowRoot.querySelector(
        ".parallax-columns .container3"
      );
      const col4 = this.shadowRoot.querySelector(
        ".parallax-columns .container4"
      );

      if (!col1 || !col2 || !col3 || !col4) {
        console.error("Could not find container elements");
        return;
      }

      // Calculate the scroll range based on half the height of each column
      const half1 = col1.clientHeight / 2;
      const half2 = col2.clientHeight / 2;
      const half3 = col3.clientHeight / 2;
      const half4 = col4.clientHeight / 2;

      // Create quickTo functions without wrap for finite scrolling
      const yTo1 = gsap.quickTo(col1, "y", {
        duration: 0.5,
        ease: "power3",
      });

      const yTo2 = gsap.quickTo(col2, "y", {
        duration: 0.8,
        ease: "power3",
      });

      const yTo3 = gsap.quickTo(col3, "y", {
        duration: 0.6,
        ease: "power3",
      });

      const yTo4 = gsap.quickTo(col4, "y", {
        duration: 0.2,
        ease: "power3",
      });

      // Total scroll distance needed to complete one full cycle
      const maxScrollDistance = Math.max(half1, half2, half3, half4) * 2;

      // Add wheel event listener for scroll interaction
      const handleWheel = (e) => {
        // Update scroll progress
        const delta = e.deltaY / 2;
        incr -= delta;

        // Clamp incr to stay within bounds (0 to -maxScrollDistance)
        incr = Math.max(-maxScrollDistance, Math.min(0, incr));

        // Calculate scroll progress (0 = start, 1 = end)
        scrollProgress = Math.abs(incr) / maxScrollDistance;

        // Apply different scroll distances to each column for staggered effect
        yTo1(incr);
        yTo2(incr * 0.8); // Slower movement
        yTo3(incr * 1.2); // Faster movement
        yTo4(incr * 1.5); // Fastest movement
      };

      // Bind the wheel event to the host element
      this.addEventListener("wheel", handleWheel, { passive: true });

      // Store reference for cleanup
      this._wheelHandler = handleWheel;
    });
  }

  disconnectedCallback() {
    // Clean up event listener when component is removed
    if (this._wheelHandler) {
      this.removeEventListener("wheel", this._wheelHandler);
    }
  }
}

// Define the custom element
customElements.define("parallax-columns", ParallaxColumnsComponent);

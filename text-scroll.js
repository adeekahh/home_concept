class TextScrollComponent extends HTMLElement {
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
      const response = await fetch("text-scroll.html");
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const template = doc.getElementById("text-scroll-template");

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

    const root = this.shadowRoot.querySelector(".mwg_effect009");
    const sentences = root.querySelectorAll(".sentence");
    const pinHeight = root.querySelector(".pin-height");
    const container = root.querySelector(".container");

    // Wrap letters in spans for animation
    sentences.forEach((sentence) => {
      this.wrapLettersInSpan(sentence);
    });

    // Pin the container
    ScrollTrigger.create({
      trigger: pinHeight,
      start: "top top",
      end: "bottom bottom",
      pin: container,
    });

    // Create timeline for text animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinHeight,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    sentences.forEach((sentence, index) => {
      if (sentences[index + 1]) {
        // Move the sentence above the viewport using y & yPercent
        tl.to(sentences[index], {
          yPercent: -50,
          y: "-50vh",
          ease: "power4.in",
        });

        // Move the letters above the sentence using y & yPercent
        tl.to(
          sentences[index].querySelectorAll("span"),
          {
            yPercent: -50,
            y: "-50vh",
            stagger: -0.02,
            ease: "power2.in",
          },
          "<"
        );

        // Move the next sentence to the middle of the viewport
        tl.from(
          sentences[index + 1],
          {
            yPercent: 50,
            y: "50vh",
            ease: "power4.out",
          },
          "<"
        );

        // Move the next letters to the middle of the viewport
        tl.from(
          sentences[index + 1].querySelectorAll("span"),
          {
            yPercent: 50,
            y: "50vh",
            ease: "power2.out",
            stagger: -0.02,
          },
          "<"
        );
      }
    });
  }

  // Utility method to wrap letters in spans
  wrapLettersInSpan(element) {
    const text = element.textContent;
    element.innerHTML = text
      .split("")
      .map((char) =>
        char === " " ? "<span>&nbsp;</span>" : `<span>${char}</span>`
      )
      .join(" ");
  }
}

// Define the custom element
customElements.define("text-scroll", TextScrollComponent);

class GalleryScrollComponent extends HTMLElement {
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
      const response = await fetch("gallery-scroll.html");
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const template = doc.getElementById("gallery-scroll-template");

      if (template) {
        const templateContent = template.content;
        this.shadowRoot.appendChild(templateContent.cloneNode(true));
      }
    } catch (error) {
      console.error("Failed to load gallery template:", error);
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

    const galleryScroll = document.querySelector(".gallery-scroll");
    const container = this.shadowRoot.querySelector(".container");
    const cardsContainer = this.shadowRoot.querySelector(".cards");
    const cards = this.shadowRoot.querySelectorAll(".card");

    if (container && cardsContainer && cards.length > 0) {
      const distance = cardsContainer.scrollWidth - window.innerWidth;

      const scrollPin = gsap.to(galleryScroll, {
        start: "top top",
        end: "bottom bottom",
        pin: container,
        markers: true,
      });

      /* const scrollTween = gsap.to(cardsContainer, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: true,
          start: "top top",
          end: "",
          markers: true,
        },
      }); */

      // Optional: Add individual card animations
      /*  cards.forEach((card) => {
        const values = {
          x: (Math.random() * 20 + 30) * (Math.random() < 0.5 ? 1 : -1),
          y: (Math.random() * 6 + 10) * (Math.random() < 0.5 ? 1 : -1),
          rotation: (Math.random() * 10 + 10) * (Math.random() < 0.5 ? 1 : -1),
        };

        gsap.fromTo(
          card,
          {
            rotation: values.rotation,
            xPercent: values.x,
            yPercent: values.y,
          },
          {
            rotation: -values.rotation,
            xPercent: -values.x,
            yPercent: -values.y,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: "left 120%",
              end: "right -20%",
              scrub: true,
            },
          }
        );
      }); */
    }
  }
}

// Define the custom element
customElements.define("gallery-scroll", GalleryScrollComponent);

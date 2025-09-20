gsap.registerPlugin(ScrollTrigger)

window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LIENIS SMOOTH SCROLL (OPTIONAL) */

    gsap.to('.scroll', {
        autoAlpha:0,
        duration:0.2,
        scrollTrigger: {
            trigger:'.mwg_effect007',
            start:'top top',
            end:'top top-=1',
            toggleActions: "play none reverse none"
        }
    })

    const root = document.querySelector('.mwg_effect007')
    const pinHeight = root.querySelector('.mwg_effect007 .pin-height')
    const container = root.querySelector('.mwg_effect007 .container')
    const circles = root.querySelectorAll('.circle')
        
    ScrollTrigger.create({
        trigger: pinHeight, // Listening to pin-height
        start: 'top top',
        end: 'bottom bottom',
        pin: container // The pinned section
    })

    gsap.fromTo(circles, {
        rotation: 30 // Starting angle
    },{
        rotation: -30, // Ending angle
        ease:'power2.inOut', // Non-linear movement
        stagger:0.06, // Delay between the start of each circle
        scrollTrigger:{
            trigger: pinHeight, // Listening to pinHeight
            start:'top top',
            end: 'bottom bottom',
            scrub: true // Animation progresses with scrolling
        }  
    })
})
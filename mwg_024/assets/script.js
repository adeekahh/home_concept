gsap.registerPlugin(ScrollTrigger)

window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LIENIS SMOOTH SCROLL (OPTIONAL) */

    const sentence1 = document.querySelector('.mwg_effect024 .sentence1 p')
    const sentence2 = document.querySelector('.mwg_effect024 .sentence2 p')
    
    const pinHeight = document.querySelector('.mwg_effect024 .pin-height')
    const container = document.querySelector('.mwg_effect024 .container')

    ScrollTrigger.create({
        trigger: pinHeight, // Listens to the position of pin-height
        start: 'top top', // Starts when the top is at 0% of the viewport
        end: 'bottom bottom', // Ends when the bottom is at 100% of the viewport
        pin: container,
    })
    
    document.fonts.ready.then(() => {
        gsap.to(sentence1, { // gsap.to() for forward movement
            x: -sentence1.clientWidth / 2, // Half the width of the phrase
            ease: 'none', // Linear movement
            duration: 10,
            repeat: -1, // Infinite repetition
        })
        gsap.from(sentence2, { // gsap.from() for backward movement
            x: -sentence2.clientWidth / 2,
            ease: 'none', // Linear movement
            duration: 10,
            repeat: -1, // Infinite repetition
        })
    })

    gsap.to([sentence1, sentence2], {
        yPercent: '-=100', // Non-linear movement
        ease:'power1.inOut', // Non-linear movement
        scrollTrigger:{
            trigger: pinHeight, // Listens to pinHeight
            start: 'top top', // Starts when the top is at 0% of the viewport
            end: 'bottom bottom', // Ends when the bottom is at 100% of the viewport
            scrub: 0.4 // Progresses with the scroll, takes 0.4s to update
        }
    })
})
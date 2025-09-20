gsap.registerPlugin(ScrollTrigger)

window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LIENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect009')
    const sentences = root.querySelectorAll('.sentence')

    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')
    
    sentences.forEach(sentence => {
        wrapLettersInSpan(sentence)
    })

    ScrollTrigger.create({
        trigger: pinHeight, // Monitor the position of pin-height
        start: 'top top',
        end: 'bottom bottom',
        pin: container // The pinned section
    })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: pinHeight,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true // Progress linked to scrolling
        }
    })

    sentences.forEach((sentence, index) => {

        if(sentences[index+1]) {
            // Move the sentence above the viewport using y & yPercent
            tl.to(sentences[index], {
                yPercent: -50,
                y: '-50vh',
                ease: 'power4.in',
            })

            // Move the letters above the sentence using y & yPercent
            tl.to(sentences[index].querySelectorAll('span'), {
                yPercent: -50,
                y: '-50vh',
                stagger: -0.02, // Stagger in the appearance
                ease: 'power2.in',
            }, '<') // Means the animation starts at the start of the previous tween

            // Move the next sentence (index+1) 
            // to the middle of the viewport using y & yPercent
            tl.from(sentences[index+1], {
                yPercent: 50, // Starts at 50 and ends at 0
                y: '50vh', // Starts at 50vh and ends at 0
                ease: 'power4.out',
            }, '<')

            // Move the next letters (index+1)
            // to the middle of the viewport using y & yPercent
            tl.from(sentences[index+1].querySelectorAll('span'), {
                yPercent: 50, // Starts at 50 and ends at 0
                y: '50vh', // Starts at 50vh and ends at 0
                ease: 'power2.out',
                stagger: -0.02, // Stagger in the appearance
            }, '<')
        }
    })
})

// UTIL METHOD
function wrapLettersInSpan(element) {
    const text = element.textContent;
    element.innerHTML = text
        .split('')
        .map(char => char === ' ' ? '<span>&nbsp;</span>' : `<span>${char}</span>`)
        .join(' ');
}
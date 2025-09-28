gsap.registerPlugin(ScrollTrigger)

window.addEventListener("DOMContentLoaded", () => {

    /* LENIS SMOOTH SCROLL (OPTIONAL) */
    lenis = new Lenis({
        autoRaf: true,
    })
    /* LIENIS SMOOTH SCROLL (OPTIONAL) */

    const root = document.querySelector('.mwg_effect042')
    const pinHeight = root.querySelector('.pin-height')
    const container = root.querySelector('.container')

    ScrollTrigger.create({
        trigger: pinHeight, // Listen to pin-height
        start:'top top',
        end:'bottom bottom',
        pin: container, // The pinned section
    })

    let gap = 30
    const medias = root.querySelectorAll('.media')
    const distPerMedia = (pinHeight.clientHeight - window.innerHeight) / medias.length

    
    gsap.set(medias, {
        y: gap * (medias.length - 1),
        z: -gap * (medias.length -1)
    })
    
    medias.forEach((media, index) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinHeight, // Listen to pin-height position
                start: 'top top+=' + (distPerMedia * index),
                end: 'bottom bottom+=' + (distPerMedia * index),
                scrub: 0.5 
                // Progresses with the scroll and takes 0.5s to reach the scrollbar
                
            }
        })

        for(let i = 0; i < medias.length - 1; i++){
            tl.to(media, {
                // Gains one position in the deck queue
                y: "-=" + gap,
                z: "+=" + gap,
                ease:'back.inOut(3)' // Light bounce at the start and end of the animation
            })
        }
        
        tl.to(media, {
            yPercent: -80, // Moves up by 80% of its height
            y: '-50vh', // Moves up to half the screen
            scale: 1.2, // The card slightly enlarges as it disappears
            rotation: (Math.random() - 0.5) * 50, // Will be different for each media
            ease:'power4.in' // Starts gradually
        })
    })
    
})
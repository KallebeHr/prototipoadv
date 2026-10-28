import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initSiteMotion () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const context = gsap.context(() => {
    gsap.from('.hero .eyebrow, .hero h1, .hero .subtitle, .hero .actions, .hero .principles', {
      y: 22,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
    })

    gsap.to('.hero-media', {
      yPercent: 7,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
    })

    for (const section of document.querySelectorAll('.page-flow > section')) {
      const heading = section.querySelector('h1, h2')
      const copy = section.querySelector('.intro, .section-subtitle, .sub-titulo, .section-heading > p')
      const items = section.querySelectorAll('article, .card, .form-card, .info-card, .radio-inputs, .map-wrapper, .card-wrapper')

      if (heading) {
        gsap.from(heading, {
          y: 18, opacity: 0, duration: 0.58, ease: 'power2.out',
          scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
        })
      }
      if (copy) {
        gsap.from(copy, {
          y: 12, opacity: 0, duration: 0.52, delay: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: copy, start: 'top 90%', once: true },
        })
      }
      if (items.length > 0) {
        gsap.from(items, {
          y: 18, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: items[0], start: 'top 88%', once: true },
        })
      }
    }
  })

  return () => {
    context.revert()
    for (const trigger of ScrollTrigger.getAll()) {
      trigger.kill()
    }
  }
}

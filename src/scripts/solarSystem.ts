// TODO:  After some time (my tab was open but I did not visit her) the proportions of canvas content was shrinked. Fix it

interface Orbit {
    /** Orbit radius as a fraction of the largest orbit that fits the canvas. */
    radius: number
    /** Radians per second, shared by every planet on the orbit. */
    speed: number
    /** Starting angle, so the orbits do not all line up on load. */
    phase: number
    /** One per planet; the planets sit evenly spaced around the orbit. */
    colors: string[]
}

const TAU = Math.PI * 2

/** Planet radius as a fraction of the canvas' shortest side. */
const PLANET_SIZE = 0.018

const ORBIT_COLOR = 'rgb(255 255 255 / 18%)'

interface Logo {
    /** Glow tint behind it, as rgb channels, so it can be interpolated. */
    glow: [number, number, number]
    /** Width of the source viewBox. The drawing is scaled up from these units. */
    unit: number
}

// Each glow is roughly the complement of its logo's colour, so the mark stands
// out against it. Where two complements landed close (Node, Vue and Nuxt are all
// green, so all three came out purple-pink), the hues are pushed apart so every
// glow stays distinct. Next.js is the exception, see below.
// Cyan logo, orange glow.
const REACT_LOGO: Logo = { glow: [240, 125, 76], unit: 23 }
// Green logo, magenta glow.
const NODE_LOGO: Logo = { glow: [236, 81, 223], unit: 289 }
// Green logo, violet glow.
const VUE_LOGO: Logo = { glow: [166, 99, 233], unit: 128 }
// The "dj" glyph is taller than wide (266 x 340), so it is sized by its height
// to sit at the same visual size as the others.
// A softened take on Python's yellow (#ffd43b) for the glyph; the full-strength
// yellow was too loud against the navy. Blue glow.
const DJANGO_LOGO: Logo = { glow: [85, 129, 231], unit: 340 }
// Near-black mark lit from behind by React's cyan, so it reads as a silhouette
// against the glow rather than a white cut-out.
const NEXT_LOGO: Logo = { glow: [97, 218, 251], unit: 15 }
// Sized by the mountains' width (44..468), not the 512 viewBox. Green logo, rose glow.
const NUXT_LOGO: Logo = { glow: [241, 85, 124], unit: 424 }

// Path data from the official logo SVGs. Path2D speaks SVG path syntax, so
// these need no conversion.
const VUE_DARK = 'M25.997 9.393l23.002.009L64.035 34.36 79.018 9.404 102 9.398 64.15 75.053z'
const VUE_GREEN = 'M.91 9.569l25.067-.172 38.15 65.659L101.98 9.401l25.11.026-62.966 108.06z'
// Hexagon with the "JS" cut out, viewBox "-16.5 0 289 289".
const NODE_PATH =
    'M127.999999,288.463771 C124.024844,288.463771 120.314699,287.403728 116.869564,285.548656 L81.6231884,264.612838 C76.32298,261.697724 78.9730854,260.637682 80.5631458,260.107661 C87.7184259,257.72257 89.0434775,257.192547 96.4637688,252.952381 C97.2587979,252.422361 98.3188405,252.687372 99.1138718,253.217392 L126.144927,269.383024 C127.20497,269.913045 128.530021,269.913045 129.325053,269.383024 L235.064182,208.165634 C236.124225,207.635611 236.654245,206.575571 236.654245,205.250519 L236.654245,83.0807467 C236.654245,81.7556929 236.124225,80.6956526 235.064182,80.1656324 L129.325053,19.2132506 C128.26501,18.6832305 126.939959,18.6832305 126.144927,19.2132506 L20.4057954,80.1656324 C19.3457551,80.6956526 18.8157349,82.0207041 18.8157349,83.0807467 L18.8157349,205.250519 C18.8157349,206.31056 19.3457551,207.635611 20.4057954,208.165634 L49.2919247,224.861286 C64.9275364,232.811595 74.7329196,223.536234 74.7329196,214.260871 L74.7329196,93.681159 C74.7329196,92.0910985 76.0579711,90.5010358 77.9130428,90.5010358 L91.4285716,90.5010358 C93.0186343,90.5010358 94.6086948,91.8260873 94.6086948,93.681159 L94.6086948,214.260871 C94.6086948,235.196689 83.2132512,247.387164 63.3374737,247.387164 C57.2422362,247.387164 52.4720502,247.387164 38.9565214,240.761906 L11.1304347,224.861286 C4.24016581,220.886129 5.68434189e-14,213.46584 5.68434189e-14,205.515528 L5.68434189e-14,83.3457557 C5.68434189e-14,75.3954465 4.24016581,67.9751552 11.1304347,64.0000006 L116.869564,2.78260752 C123.494824,-0.927535841 132.505176,-0.927535841 139.130436,2.78260752 L244.869565,64.0000006 C251.759834,67.9751552 256,75.3954465 256,83.3457557 L256,205.515528 C256,213.46584 251.759834,220.886129 244.869565,224.861286 L139.130436,286.078676 C135.685299,287.668739 131.710145,288.463771 127.999999,288.463771 L127.999999,288.463771 Z M160.596274,204.455488 C114.219461,204.455488 104.679089,183.254659 104.679089,165.233955 C104.679089,163.643893 106.004141,162.053832 107.859212,162.053832 L121.639752,162.053832 C123.229813,162.053832 124.554864,163.113872 124.554864,164.703935 C126.674947,178.749484 132.770187,185.639753 160.861283,185.639753 C183.122154,185.639753 192.662526,180.604556 192.662526,168.67909 C192.662526,161.788821 190.012423,156.753624 155.296065,153.308489 C126.409938,150.393375 108.389235,144.033126 108.389235,120.977226 C108.389235,99.5113875 126.409938,86.7908901 156.621119,86.7908901 C190.542443,86.7908901 207.238095,98.4513472 209.358178,123.89234 C209.358178,124.687371 209.093167,125.482403 208.563147,126.277434 C208.033127,126.807454 207.238095,127.337474 206.443064,127.337474 L192.662526,127.337474 C191.337475,127.337474 190.012423,126.277434 189.747412,124.952382 C186.567289,110.376813 178.351966,105.606625 156.621119,105.606625 C132.240165,105.606625 129.325053,114.086957 129.325053,120.447205 C129.325053,128.132506 132.770187,130.5176 165.631471,134.757766 C198.227744,138.997931 213.598344,145.093169 213.598344,167.884058 C213.333333,191.20497 194.252589,204.455488 160.596274,204.455488 L160.596274,204.455488 Z'
// Just the "dj" glyph from the 512 x 512 tile; the dark green tile itself is
// dropped so it reads as a bare mark like the others.
const DJANGO_PATH =
    'M227 101h56v257c-29 5-50 8-73 8-69 0-104-31-104-90 0-57 37-93 96-93 9 0 16 0 25 2zm0 129c-7-2-12-3-19-3-29 0-45 18-45 48s15 46 44 46c6 0 11 0 20-2zm145-44v129c0 45-3 66-13 84-9 18-21 29-46 42l-52-25c25-11 37-22 44-37 8-16 11-34 11-83V186zm-56-85h56v57h-56z'
// Outlined "N in a circle", viewBox "0 0 15 15".
const NEXT_PATH =
    'M4.5 4.5L4.90534 4.20725C4.77836 4.03144 4.55252 3.95753 4.34617 4.02425C4.13981 4.09098 4 4.28313 4 4.5H4.5ZM7.5 14C3.91015 14 1 11.0899 1 7.5H0C0 11.6421 3.35786 15 7.5 15V14ZM14 7.5C14 11.0899 11.0899 14 7.5 14V15C11.6421 15 15 11.6421 15 7.5H14ZM7.5 1C11.0899 1 14 3.91015 14 7.5H15C15 3.35786 11.6421 0 7.5 0V1ZM7.5 0C3.35786 0 0 3.35786 0 7.5H1C1 3.91015 3.91015 1 7.5 1V0ZM5 12V4.5H4V12H5ZM4.09466 4.79275L10.5947 13.7927L11.4053 13.2073L4.90534 4.20725L4.09466 4.79275ZM10 4V10H11V4H10Z'
// viewBox "0 0 512 512".
const NUXT_PATH =
    'M281.44 397.667H438.32C443.326 397.667 448.118 395.908 452.453 393.427C456.789 390.946 461.258 387.831 463.76 383.533C466.262 379.236 468.002 374.36 468 369.399C467.998 364.437 466.266 359.563 463.76 355.268L357.76 172.947C355.258 168.65 352.201 165.534 347.867 163.053C343.532 160.573 337.325 158.813 332.32 158.813C327.315 158.813 322.521 160.573 318.187 163.053C313.852 165.534 310.795 168.65 308.293 172.947L281.44 219.587L227.733 129.13C225.229 124.834 222.176 120.307 217.84 117.827C213.504 115.346 208.713 115 203.707 115C198.701 115 193.909 115.346 189.573 117.827C185.238 120.307 180.771 124.834 178.267 129.13L46.8267 355.268C44.3208 359.563 44.0022 364.437 44 369.399C43.9978 374.36 44.3246 379.235 46.8267 383.533C49.3288 387.83 53.7979 390.946 58.1333 393.427C62.4688 395.908 67.2603 397.667 72.2667 397.667H171.2C210.401 397.667 238.934 380.082 258.827 346.787L306.88 263.4L332.32 219.587L410.053 352.44H306.88L281.44 397.667ZM169.787 352.44H100.533L203.707 174.36L256 263.4L221.361 323.784C208.151 345.387 193.089 352.44 169.787 352.44Z'

/** Logo width as a fraction of the canvas' shortest side. */
const LOGO_SCALE = 0.16
/** Seconds each logo holds the centre before the other takes over. */
const LOGO_INTERVAL = 3
/** Length of the crossfade, taken out of the end of each interval. */
const LOGO_FADE = 0.6

/** `paint` draws in the logo's own viewBox units, centred on the origin. */
type LogoState = Logo & { paint: () => void }

const mix = (from: number, to: number, t: number) => from + (to - from) * t
/** Smoothstep, so the fade eases in and out instead of running linearly. */
const ease = (t: number) => t * t * (3 - 2 * t)

const ORBITS: Orbit[] = [
    { radius: 0.4, speed: 0.5, phase: 3.8, colors: ['#4f8fd8', '#b8b0a8', '#e0a86a'] },
    { radius: 0.67, speed: 0.34, phase: 5.2, colors: ['#c05a3a', '#e3d2a2', '#4f8fd8'] },
    { radius: 0.95, speed: 0.22, phase: 1.2, colors: ['#d8a878', '#c05a3a', '#b8b0a8'] },
]

export function initSolarSystem() {
    const canvas = document.querySelector<HTMLCanvasElement>('.hero-canvas')
    if (!canvas) return

    // getContext returns null when 2d is unsupported, and is not implemented at
    // all under jsdom, so the tests fall out here.
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Arrow functions rather than declarations: TypeScript only keeps the null
    // narrowing above inside closures that cannot be hoisted past it.
    let width = 0
    let height = 0

    // Built here rather than at module scope: Path2D is not implemented in jsdom,
    // and the test suite imports this file. Past the ctx guard it is never reached.
    const vueDark = new Path2D(VUE_DARK)
    const vueGreen = new Path2D(VUE_GREEN)
    const nodePath = new Path2D(NODE_PATH)
    const djangoPath = new Path2D(DJANGO_PATH)
    const nextPath = new Path2D(NEXT_PATH)
    const nuxtPath = new Path2D(NUXT_PATH)

    const reactLogo: LogoState = {
        ...REACT_LOGO,
        // viewBox "-11.5 -10.23174 23 20.46348" is already centred on the origin.
        paint: () => {
            ctx.fillStyle = '#61dafb'
            ctx.beginPath()
            ctx.arc(0, 0, 2.05, 0, TAU)
            ctx.fill()

            // lineWidth 1 in viewBox units matches the SVG's stroke-width="1":
            // the transform scales the stroke exactly as the viewBox would.
            ctx.strokeStyle = '#61dafb'
            ctx.lineWidth = 1
            for (const degrees of [0, 60, 120]) {
                ctx.beginPath()
                ctx.ellipse(0, 0, 11, 4.2, (degrees * Math.PI) / 180, 0, TAU)
                ctx.stroke()
            }
        },
    }

    const vueLogo: LogoState = {
        ...VUE_LOGO,
        paint: () => {
            // viewBox "0 0 128 128" measures from a corner, so recentre it.
            ctx.translate(-64, -64)

            ctx.fillStyle = '#35495e'
            ctx.fill(vueDark)
            ctx.fillStyle = '#41b883'
            ctx.fill(vueGreen)
        },
    }

    const nodeLogo: LogoState = {
        ...NODE_LOGO,
        paint: () => {
            // The hexagon spans 0..256 x 0..288.46 inside the viewBox; recentre on it.
            ctx.translate(-128, -144.23)

            ctx.fillStyle = '#539e43'
            ctx.fill(nodePath)
        },
    }

    const djangoLogo: LogoState = {
        ...DJANGO_LOGO,
        paint: () => {
            // The glyph spans 106..372 x 101..441 of the tile; recentre on it.
            ctx.translate(-239, -271)

            ctx.fillStyle = '#e6cc78'
            ctx.fill(djangoPath)
        },
    }

    const nextLogo: LogoState = {
        ...NEXT_LOGO,
        paint: () => {
            // viewBox "0 0 15 15" measures from a corner, so recentre it.
            ctx.translate(-7.5, -7.5)

            ctx.fillStyle = '#0b1120'
            ctx.fill(nextPath)
        },
    }

    const nuxtLogo: LogoState = {
        ...NUXT_LOGO,
        paint: () => {
            // The mark spans 44..468 x 115..397.67 of the viewBox; recentre on it.
            ctx.translate(-256, -256.33)

            ctx.fillStyle = '#00dc82'
            ctx.fill(nuxtPath)
        },
    }

    /** Centre logos in display order; the cycle wraps back to the first. */
    const logos = [reactLogo, nodeLogo, nextLogo, vueLogo, djangoLogo, nuxtLogo]
    // The modulo keeps the index in range; the fallback only satisfies noUncheckedIndexedAccess.
    const logoAt = (index: number) => logos[index % logos.length] ?? reactLogo

    const drawLogo = (logo: LogoState, alpha: number, scale: number) => {
        if (alpha <= 0.002) return

        const logoWidth = Math.min(width, height) * LOGO_SCALE * scale

        // save/restore also puts back the device-pixel-ratio transform set in resize().
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(width / 2, height / 2)
        ctx.scale(logoWidth / logo.unit, logoWidth / logo.unit)
        logo.paint()
        ctx.restore()
    }

    const resize = () => {
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()

        width = rect.width
        height = rect.height
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)

        // Draw in CSS pixels and let the transform handle the device ratio.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (seconds: number) => {
        const centerX = width / 2
        const centerY = height / 2
        const shortestSide = Math.min(width, height)
        const planetRadius = shortestSide * PLANET_SIZE
        // Leave room for a planet to sit on the outermost orbit.
        const maxOrbit = shortestSide / 2 - planetRadius
        const logoWidth = shortestSide * LOGO_SCALE

        // Cycle the centre logo. `seconds` only advances while the loop is
        // running, so the cycle pauses along with everything else off screen.
        const interval = Math.floor(seconds / LOGO_INTERVAL)
        const current = logoAt(interval)
        const next = logoAt(interval + 1)

        // The crossfade sits at the tail of each interval, so it finishes exactly
        // on the boundary where `current` flips to `next`.
        const elapsed = seconds - interval * LOGO_INTERVAL
        const holdFor = LOGO_INTERVAL - LOGO_FADE
        const fade = elapsed <= holdFor ? 0 : ease((elapsed - holdFor) / LOGO_FADE)

        ctx.clearRect(0, 0, width, height)

        ctx.lineWidth = 1
        ctx.strokeStyle = ORBIT_COLOR
        for (const orbit of ORBITS) {
            ctx.beginPath()
            ctx.arc(centerX, centerY, orbit.radius * maxOrbit, 0, TAU)
            ctx.stroke()
        }

        const glowRadius = logoWidth * 1.7
        const glow = ctx.createRadialGradient(
            centerX,
            centerY,
            logoWidth * 0.12,
            centerX,
            centerY,
            glowRadius,
        )
        const tint = [
            Math.round(mix(current.glow[0], next.glow[0], fade)),
            Math.round(mix(current.glow[1], next.glow[1], fade)),
            Math.round(mix(current.glow[2], next.glow[2], fade)),
        ].join(' ')

        glow.addColorStop(0, 'rgb(' + tint + ' / 42%)')
        glow.addColorStop(0.55, 'rgb(' + tint + ' / 14%)')
        glow.addColorStop(1, 'rgb(' + tint + ' / 0%)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(centerX, centerY, glowRadius, 0, TAU)
        ctx.fill()

        // Outgoing shrinks away, incoming grows into place.
        drawLogo(current, 1 - fade, 1 - 0.25 * fade)
        drawLogo(next, fade, 0.75 + 0.25 * fade)

        for (const orbit of ORBITS) {
            const orbitRadius = orbit.radius * maxOrbit

            orbit.colors.forEach((color, index) => {
                const angle =
                    orbit.phase + seconds * orbit.speed + (index * TAU) / orbit.colors.length

                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(
                    centerX + Math.cos(angle) * orbitRadius,
                    centerY + Math.sin(angle) * orbitRadius,
                    planetRadius,
                    0,
                    TAU,
                )
                ctx.fill()
            })
        }
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let seconds = 0
    let lastFrame = 0
    let frameId = 0
    let onScreen = false

    const frame = (now: number) => {
        // Accumulate real time so the orbits keep their speed on any refresh rate.
        if (lastFrame) seconds += (now - lastFrame) / 1000
        lastFrame = now

        draw(seconds)
        frameId = requestAnimationFrame(frame)
    }

    const start = () => {
        // Nothing to run while scrolled away or in a background tab, and never
        // two loops at once.
        if (!onScreen || document.hidden || frameId) return

        // Reduced motion: the canvas is hidden in CSS, so nothing is drawn at all.
        if (reducedMotion.matches) return

        // Resuming from a pause: drop the stale timestamp so the elapsed clock
        // does not jump by however long the canvas was off screen.
        lastFrame = 0
        frameId = requestAnimationFrame(frame)
    }

    const stop = () => {
        cancelAnimationFrame(frameId)
        frameId = 0
    }

    /** Repaint once when the loop is not the thing driving updates. */
    const repaint = () => {
        if (!frameId && onScreen && !reducedMotion.matches) draw(seconds)
    }

    // Stop outright in a background tab. requestAnimationFrame would throttle on
    // its own, but the loop would keep its stale timestamp and jump on return.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop()
        else start()
    })

    // Covers the other case - the canvas scrolled out of view on a tab still in front.
    new IntersectionObserver((entries) => {
        for (const entry of entries) {
            onScreen = entry.isIntersecting
        }

        if (onScreen) start()
        else stop()
    }).observe(canvas)

    new ResizeObserver(() => {
        resize()
        repaint()
    }).observe(canvas)

    reducedMotion.addEventListener('change', () => {
        stop()
        start()
    })

    // No start() here: the IntersectionObserver fires on observe and drives it.
    resize()
}

// TODO:  After some time (my tab was open but I did not visit her) the proportions of canvas content was shrinked. Fix it

interface Planet {
    /** Orbit radius as a fraction of the largest orbit that fits the canvas. */
    orbit: number
    /** Body radius as a fraction of the canvas' shortest side. */
    size: number
    color: string
    /** Radians per second. */
    speed: number
    /** Starting angle, so the planets do not all line up on load. */
    phase: number
}

const TAU = Math.PI * 2

const ORBIT_COLOR = 'rgb(255 255 255 / 18%)'

interface Logo {
    /** Glow tint behind it, as rgb channels, so it can be interpolated. */
    glow: [number, number, number]
    /** Width of the source viewBox. The drawing is scaled up from these units. */
    unit: number
}

const REACT_LOGO: Logo = { glow: [97, 218, 251], unit: 23 }
const VUE_LOGO: Logo = { glow: [65, 184, 131], unit: 128 }

// Pasted verbatim from public/vue-logo.svg. Path2D speaks SVG path syntax, so
// these need no conversion.
const VUE_DARK = 'M25.997 9.393l23.002.009L64.035 34.36 79.018 9.404 102 9.398 64.15 75.053z'
const VUE_GREEN = 'M.91 9.569l25.067-.172 38.15 65.659L101.98 9.401l25.11.026-62.966 108.06z'

/** Logo width as a fraction of the canvas' shortest side. */
const LOGO_SCALE = 0.16
/** Seconds each logo holds the centre before the other takes over. */
const LOGO_INTERVAL = 5
/** Length of the crossfade, taken out of the end of each interval. */
const LOGO_FADE = 0.6

/** `paint` draws in the logo's own viewBox units, centred on the origin. */
type LogoState = Logo & { paint: () => void }

const mix = (from: number, to: number, t: number) => from + (to - from) * t
/** Smoothstep, so the fade eases in and out instead of running linearly. */
const ease = (t: number) => t * t * (3 - 2 * t)

const PLANETS: Planet[] = [
    { orbit: 0.22, size: 0.011, color: '#b8b0a8', speed: 0.9, phase: 0.4 },
    { orbit: 0.35, size: 0.017, color: '#e0a86a', speed: 0.66, phase: 2.1 },
    { orbit: 0.48, size: 0.019, color: '#4f8fd8', speed: 0.5, phase: 3.8 },
    { orbit: 0.61, size: 0.015, color: '#c05a3a', speed: 0.4, phase: 5.2 },
    { orbit: 0.8, size: 0.032, color: '#d8a878', speed: 0.26, phase: 1.2 },
    { orbit: 0.95, size: 0.026, color: '#e3d2a2', speed: 0.19, phase: 4.6 },
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
        // Leave room for the outermost planet to sit on its orbit.
        const maxOrbit = shortestSide / 2 - shortestSide * 0.04
        const logoWidth = shortestSide * LOGO_SCALE

        // Alternate the centre logo. `seconds` only advances while the loop is
        // running, so the cycle pauses along with everything else off screen.
        const interval = Math.floor(seconds / LOGO_INTERVAL)
        const current = interval % 2 === 0 ? reactLogo : vueLogo
        const next = interval % 2 === 0 ? vueLogo : reactLogo

        // The crossfade sits at the tail of each interval, so it finishes exactly
        // on the boundary where `current` flips to `next`.
        const elapsed = seconds - interval * LOGO_INTERVAL
        const holdFor = LOGO_INTERVAL - LOGO_FADE
        const fade = elapsed <= holdFor ? 0 : ease((elapsed - holdFor) / LOGO_FADE)

        ctx.clearRect(0, 0, width, height)

        ctx.lineWidth = 1
        ctx.strokeStyle = ORBIT_COLOR
        for (const planet of PLANETS) {
            ctx.beginPath()
            ctx.arc(centerX, centerY, planet.orbit * maxOrbit, 0, TAU)
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

        for (const planet of PLANETS) {
            const angle = planet.phase + seconds * planet.speed
            const orbitRadius = planet.orbit * maxOrbit

            ctx.fillStyle = planet.color
            ctx.beginPath()
            ctx.arc(
                centerX + Math.cos(angle) * orbitRadius,
                centerY + Math.sin(angle) * orbitRadius,
                planet.size * shortestSide,
                0,
                TAU,
            )
            ctx.fill()
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
        // Nothing to run while scrolled away, and never two loops at once.
        if (!onScreen || frameId) return

        if (reducedMotion.matches) {
            // Still render the system, just frozen at its starting positions.
            draw(seconds)
            return
        }

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
        if (!frameId && onScreen) draw(seconds)
    }

    // requestAnimationFrame already stops for a hidden tab; this covers the
    // other case - the canvas scrolled out of view on a tab still in front.
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

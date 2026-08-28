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
const GLOW_COLOR = '97 218 251'
/** Drawn until the logo loads, so the centre is never empty. */
const CORE_COLOR = '#61dafb'

// BASE_URL keeps this correct if the site is ever served from a subpath.
const LOGO_SRC = import.meta.env.BASE_URL + 'react-logo.svg'
/** Logo width as a fraction of the canvas' shortest side. */
const LOGO_SCALE = 0.16
/** From the logo's own viewBox, rather than trusting naturalWidth on an SVG. */
const LOGO_ASPECT = 23 / 20.46348

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

    const logo = new Image()
    let logoReady = false

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
        const logoHeight = logoWidth / LOGO_ASPECT

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
        glow.addColorStop(0, 'rgb(' + GLOW_COLOR + ' / 42%)')
        glow.addColorStop(0.55, 'rgb(' + GLOW_COLOR + ' / 14%)')
        glow.addColorStop(1, 'rgb(' + GLOW_COLOR + ' / 0%)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(centerX, centerY, glowRadius, 0, TAU)
        ctx.fill()

        if (logoReady) {
            ctx.drawImage(
                logo,
                centerX - logoWidth / 2,
                centerY - logoHeight / 2,
                logoWidth,
                logoHeight,
            )
        } else {
            ctx.fillStyle = CORE_COLOR
            ctx.beginPath()
            ctx.arc(centerX, centerY, logoWidth * 0.09, 0, TAU)
            ctx.fill()
        }

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

    logo.addEventListener('load', () => {
        logoReady = true
        // The running loop picks this up on its own; a frozen one needs a nudge.
        repaint()
    })
    logo.src = LOGO_SRC

    // No start() here: the IntersectionObserver fires on observe and drives it.
    resize()
}

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

const SUN_COLOR = '#ffcf5c'
const SUN_GLOW = '255 196 84'
const ORBIT_COLOR = 'rgb(255 255 255 / 18%)'

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
        const sunRadius = shortestSide * 0.05

        ctx.clearRect(0, 0, width, height)

        ctx.lineWidth = 1
        ctx.strokeStyle = ORBIT_COLOR
        for (const planet of PLANETS) {
            ctx.beginPath()
            ctx.arc(centerX, centerY, planet.orbit * maxOrbit, 0, TAU)
            ctx.stroke()
        }

        const glowRadius = sunRadius * 3.4
        const glow = ctx.createRadialGradient(
            centerX,
            centerY,
            sunRadius * 0.6,
            centerX,
            centerY,
            glowRadius,
        )
        glow.addColorStop(0, 'rgb(' + SUN_GLOW + ' / 45%)')
        glow.addColorStop(1, 'rgb(' + SUN_GLOW + ' / 0%)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(centerX, centerY, glowRadius, 0, TAU)
        ctx.fill()

        ctx.fillStyle = SUN_COLOR
        ctx.beginPath()
        ctx.arc(centerX, centerY, sunRadius, 0, TAU)
        ctx.fill()

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

    const frame = (now: number) => {
        // Accumulate real time so the orbits keep their speed on any refresh rate.
        if (lastFrame) seconds += (now - lastFrame) / 1000
        lastFrame = now

        draw(seconds)
        frameId = requestAnimationFrame(frame)
    }

    const start = () => {
        if (reducedMotion.matches) {
            // Still render the system, just frozen at its starting positions.
            draw(seconds)
            return
        }

        lastFrame = 0
        frameId = requestAnimationFrame(frame)
    }

    const stop = () => {
        cancelAnimationFrame(frameId)
        frameId = 0
    }

    new ResizeObserver(() => {
        resize()
        // Repaint immediately when the loop is not running.
        if (!frameId) draw(seconds)
    }).observe(canvas)

    reducedMotion.addEventListener('change', () => {
        stop()
        start()
    })

    resize()
    start()
}

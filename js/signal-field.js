/* ==========================================================================
   Signal field — a faint noisy waveform behind every page.

   Drop <script src="js/signal-field.js" defer></script> on any page that
   links css/base.css. The canvas injects itself, sits behind all content,
   and never takes pointer events.

   Colour comes from --accent; visibility from --field-opacity, so a theme
   can dial it down (or to zero) without touching this file.

   The waveform is built the way a real one looks:
     - two incommensurate carriers, so the shape never repeats
     - band-limited noise (a slow random walk, smoothly interpolated) rather
       than per-pixel grain, which reads as fizz instead of signal
     - a burst that travels across the trace and swells its amplitude
     - phosphor persistence, so older sweeps fade out behind the live one
   ========================================================================== */

(function () {
    'use strict';

    var root = document.documentElement;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    var canvas = document.createElement('canvas');
    canvas.className = 'signal-field';
    canvas.setAttribute('aria-hidden', 'true');

    var ctx = canvas.getContext('2d');
    var width = 0;
    var height = 0;

    var STEP = 3;               // px between sample points
    var FRAME_MS = 1000 / 30;
    var PERSISTENCE = 0.16;     // how quickly an old sweep fades away

    var TRACES = [
        {
            at: 0.22, amp: 26, speed: 0.00055, weight: 1.00, lineWidth: 1.2,
            parallax: 0.070, noiseAmp: 8, spacing: 60,
            carriers: [0.01250, 0.00710], burst: { every: 9000, span: 3200, gain: 1.15, sigma: 150 }
        },
        {
            at: 0.52, amp: 40, speed: 0.00038, weight: 0.62, lineWidth: 1.0,
            parallax: 0.045, noiseAmp: 13, spacing: 84,
            carriers: [0.00820, 0.00487], burst: { every: 13000, span: 4200, gain: 0.85, sigma: 210 }
        },
        {
            at: 0.80, amp: 17, speed: 0.00082, weight: 0.38, lineWidth: 0.8,
            parallax: 0.026, noiseAmp: 6, spacing: 46,
            carriers: [0.01900, 0.01130], burst: { every: 7000, span: 2400, gain: 1.35, sigma: 110 }
        }
    ];

    // ----------------------------------------------------------------------
    // Band-limited noise: a handful of control points doing a slow random
    // walk, read back with cosine interpolation. Cheap, and it moves like
    // noise on an instrument rather than like television static.
    // ----------------------------------------------------------------------

    function seedNoise(trace) {
        var count = Math.ceil(width / trace.spacing) + 3;
        var points = new Float32Array(count);
        for (var i = 0; i < count; i++) points[i] = Math.random() * 2 - 1;
        trace.points = points;
    }

    function walkNoise(trace) {
        var points = trace.points;
        for (var i = 0; i < points.length; i++) {
            var v = points[i] + (Math.random() - 0.5) * 0.22;
            if (v > 1) v = 1;
            if (v < -1) v = -1;
            points[i] = v;
        }
    }

    function noiseAt(trace, x) {
        var scaled = x / trace.spacing;
        var i = Math.floor(scaled);
        var t = scaled - i;
        var points = trace.points;
        if (i + 1 >= points.length) return points[points.length - 1];
        // Cosine interpolation keeps the curve smooth through control points.
        var eased = (1 - Math.cos(t * Math.PI)) * 0.5;
        return points[i] * (1 - eased) + points[i + 1] * eased;
    }

    // ----------------------------------------------------------------------

    function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        TRACES.forEach(seedNoise);
    }

    function accent() {
        return getComputedStyle(root).getPropertyValue('--accent').trim() || '#888';
    }

    function fadePrevious() {
        // Erase a little of what is already there instead of clearing it, so
        // the canvas keeps a short tail. destination-out works on a canvas
        // that has to stay transparent.
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, ' + PERSISTENCE + ')';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
    }

    function drawTrace(trace, time, colour, scrollY) {
        var phase = time * trace.speed;
        var baseline = height * trace.at - scrollY * trace.parallax;

        // A burst sweeps across every so often and lifts the amplitude as it
        // passes, the way a transmission does against an idle noise floor.
        var cycle = time % trace.burst.every;
        var burstX = cycle < trace.burst.span
            ? (cycle / trace.burst.span) * (width * 1.4) - width * 0.2
            : null;
        var twoSigmaSq = 2 * trace.burst.sigma * trace.burst.sigma;

        ctx.globalAlpha = trace.weight;
        ctx.lineWidth = trace.lineWidth;
        ctx.strokeStyle = colour;
        ctx.beginPath();

        for (var x = 0; x <= width; x += STEP) {
            var carrier =
                Math.sin(x * trace.carriers[0] + phase) * 0.62 +
                Math.sin(x * trace.carriers[1] - phase * 1.37) * 0.38;

            var swell = 1;
            if (burstX !== null) {
                var dx = x - burstX;
                swell += trace.burst.gain * Math.exp(-(dx * dx) / twoSigmaSq);
            }

            var y = baseline
                + carrier * trace.amp * swell
                + noiseAt(trace, x) * trace.noiseAmp * swell;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.stroke();
    }

    function draw(time) {
        var colour = accent();
        var scrollY = window.scrollY || 0;

        fadePrevious();

        TRACES.forEach(function (trace) {
            if (!trace.points) seedNoise(trace);
            walkNoise(trace);
            drawTrace(trace, time, colour, scrollY);
        });

        ctx.globalAlpha = 1;
    }

    function drawStill() {
        ctx.clearRect(0, 0, width, height);
        var colour = accent();
        TRACES.forEach(function (trace) {
            if (!trace.points) seedNoise(trace);
            drawTrace(trace, 0, colour, window.scrollY || 0);
        });
        ctx.globalAlpha = 1;
    }

    var last = 0;
    var running = false;

    function loop(now) {
        if (!running) return;
        if (now - last >= FRAME_MS) {
            last = now;
            draw(now);
        }
        requestAnimationFrame(loop);
    }

    function start() {
        resize();

        if (reduced.matches) {
            drawStill();
            return;
        }

        running = true;
        requestAnimationFrame(loop);
    }

    function stop() { running = false; }

    window.addEventListener('resize', function () {
        resize();
        if (!running) drawStill();
    });

    // Don't burn cycles on a tab nobody is looking at.
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            stop();
        } else if (!reduced.matches && !running) {
            running = true;
            requestAnimationFrame(loop);
        }
    });

    document.addEventListener('appearancechange', function () {
        if (!running) drawStill();
    });

    if (typeof reduced.addEventListener === 'function') {
        reduced.addEventListener('change', function () {
            stop();
            ctx.clearRect(0, 0, width, height);
            start();
        });
    }

    function mount() {
        document.body.insertBefore(canvas, document.body.firstChild);
        start();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();

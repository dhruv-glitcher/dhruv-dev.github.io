/* ============================================
   PORTFOLIO SCRIPT — Three.js + GSAP
   ============================================ */

'use strict';

// ── GSAP SETUP ─────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── CUSTOM CURSOR (OPTIMIZED) ───────────────────────────

// ✅ detect touch devices
const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (!isTouchDevice) {

  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  const interactables = 'a, button, .project-card, .skill-tag, input, textarea';

  let cursorX = -100, cursorY = -100;
  let dotX = -100, dotY = -100;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  (function animateCursor() {
    dotX += (cursorX - dotX) * 0.9;
    dotY += (cursorY - dotY) * 0.9;

    if (cursor && cursorDot) {
      gsap.set(cursor, { x: cursorX, y: cursorY, xPercent: -50, yPercent: -50 });
      gsap.set(cursorDot, { x: dotX, y: dotY, xPercent: -50, yPercent: -50 });
    }

    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

} else {
  // ✅ fallback to normal cursor on touch devices
  document.body.style.cursor = 'auto';
}

// ── NAV SCROLL BEHAVIOR ─────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── THREE.JS SCENE ──────────────────────────
(function initThree() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas) return;

 const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // smoother

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // ── Lighting
  const ambientLight = new THREE.AmbientLight(0x111122, 2);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00f5d4, 6, 12);
  pointLight1.position.set(3, 3, 3);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x0088cc, 3, 10);
  pointLight2.position.set(-3, -2, 2);
  scene.add(pointLight2);

  const rimLight = new THREE.DirectionalLight(0x00f5d4, 1);
  rimLight.position.set(0, -4, -4);
  scene.add(rimLight);

  // ── Main 3D Object: Icosahedron with wireframe overlay
  const geometry = new THREE.IcosahedronGeometry(1.4, 1);

  const material = new THREE.MeshStandardMaterial({
    color: 0x0d1117,
    metalness: 0.9,
    roughness: 0.15,
    envMapIntensity: 1,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const wireMesh = new THREE.Mesh(geometry, wireMat);
  scene.add(wireMesh);

  // Inner glow sphere
  const innerGeo = new THREE.SphereGeometry(0.8, 16, 16);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    transparent: true,
    opacity: 0.04,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerMesh);

  // ── Floating dots (lightweight particles)
  const dotCount = 60;
  const dotGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(dotCount * 3);

  for (let i = 0; i < dotCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = 2.2 + Math.random() * 1.8;
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const dotMat = new THREE.PointsMaterial({
    color: 0x00f5d4,
    size: 0.015,
    transparent: true,
    opacity: 0.5,
  });
  const dots = new THREE.Points(dotGeo, dotMat);
  scene.add(dots);

  // ── Mouse tracking
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Check reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Animate
  let clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      targetRotX += (mouseY * 0.3 - targetRotX) * 0.04;
      targetRotY += (mouseX * 0.3 - targetRotY) * 0.04;

      mesh.rotation.x = targetRotX + elapsed * 0.12;
      mesh.rotation.y = targetRotY + elapsed * 0.18;
      wireMesh.rotation.x = mesh.rotation.x;
      wireMesh.rotation.y = mesh.rotation.y;

      dots.rotation.y = elapsed * 0.05;
      dots.rotation.x = elapsed * 0.03;

      // Subtle scale pulse
      const scale = 1 + Math.sin(elapsed * 0.8) * 0.015;
      mesh.scale.setScalar(scale);
      wireMesh.scale.setScalar(scale);

      // Light animation
      pointLight1.position.x = Math.sin(elapsed * 0.5) * 3;
      pointLight1.position.y = Math.cos(elapsed * 0.4) * 3;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
})();

// ── HERO TEXT ANIMATION ─────────────────────
(function heroAnimation() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show everything instantly
    gsap.set(['.hero-label', '.hero-headline .line', '.hero-sub', '.hero-cta', '#scrollHint'], {
      opacity: 1, y: 0
    });
    return;
  }

  const tl = gsap.timeline({ delay: 0.3 });

  tl.to('.hero-label', {
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
  })
  .to('.hero-headline .line:first-child', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'expo.out',
  }, '-=0.3')
  .to('.hero-headline .line:last-child', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'expo.out',
  }, '-=0.7')
  .to('.hero-sub', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
  }, '-=0.5')
  .to('.hero-cta', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
  }, '-=0.6')
  .to('#scrollHint', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
  }, '-=0.3');
})();

// ── SCROLL REVEAL ───────────────────────────
(function scrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-up').forEach(el => {
      gsap.set(el, { opacity: 1, y: 0 });
    });
    return;
  }

  // Stagger children inside stat container
  gsap.utils.toArray('.reveal-up').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
      delay: (el.closest('.about-stats') ? i * 0.1 : 0),
    });
  });
})();

// ── SKILL BARS ANIMATION ────────────────────
(function skillBarsAnimation() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const level = bar.getAttribute('data-level');
    const fill = bar.querySelector('.bar-fill');

    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(fill, {
          width: `${level}%`,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.1,
        });
      }
    });
  });
})();

// ── SECTION NUMBERS PARALLAX ─────────────────
(function sectionParallax() {
  gsap.utils.toArray('.section-num').forEach(num => {
    gsap.to(num, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: num.closest('.section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });
})();

// ── CONTACT FORM (EmailJS) ─────────────────
(function contactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // 🔑 Initialize EmailJS
  emailjs.init("i0d-xwZF4zvhPmKYa");

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    emailjs.sendForm(
      "service_uik9m18",
      "template_p1rc9zi",
      "#contactForm"
    )
    .then(() => {
      btn.innerHTML = '✦ Message Sent!';
      btn.style.background = '#39d98a';
      btn.style.color = '#000';
      form.reset();
    })
    .catch(() => {
      btn.innerHTML = 'Error — Try Again';
    })
    .finally(() => {
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 2500);
    });
  });
})();

// ── SMOOTH NAV LINKS ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// ── PROJECT CARD TILT ─────────────────────────
(function cardTilt() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: x * 6,
        rotateX: -y * 6,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
})();

// ── HERO ACCENT LINE REVEAL ───────────────────
setTimeout(() => {
  const accentEl = document.querySelector('.hero-headline .accent-text');
  if (accentEl) {
    accentEl.style.setProperty('--line-scale', '1');
    accentEl.querySelector && null;
    const pseudo = accentEl;
    if (pseudo) {
      pseudo.style.cssText += '';
      gsap.to(pseudo, {
        duration: 0.001, // trigger repaint
        onComplete: () => {
          pseudo.classList.add('line-revealed');
        }
      });
    }
  }
}, 1800);
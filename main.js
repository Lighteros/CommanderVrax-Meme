const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const count = Math.min(140, Math.floor((innerWidth * innerHeight) / 14000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.2,
    a: Math.random(),
    s: Math.random() * 0.35 + 0.05,
    ice: Math.random() > 0.82
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    star.y -= star.s;
    star.a += 0.01;
    if (star.y < -2) star.y = canvas.height + 2;
    const alpha = 0.25 + Math.abs(Math.sin(star.a)) * 0.75;
    ctx.beginPath();
    ctx.fillStyle = star.ice
      ? `rgba(170, 205, 255, ${alpha})`
      : `rgba(244, 231, 214, ${alpha * 0.8})`;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!document.hidden) requestAnimationFrame(draw);
}

resize();
draw();
addEventListener("resize", resize);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) draw();
});

const follow = document.documentElement;
addEventListener("pointermove", (event) => {
  follow.style.setProperty("--mx", event.clientX + "px");
  follow.style.setProperty("--my", event.clientY + "px");
}, { passive: true });

const bar = document.querySelector(".progress");
addEventListener("scroll", () => {
  const height = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${height > 0 ? scrollY / height : 0})`;
}, { passive: true });

const clock = document.getElementById("bridge-time");
function tick() {
  const now = new Date();
  const text = now.toISOString().slice(11, 19) + " UTC";
  clock.textContent = text;
  clock.dateTime = now.toISOString();
}
tick();
setInterval(tick, 1000);

const menu = document.querySelector(".menu");
const links = document.getElementById("links");
menu.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menu.setAttribute("aria-expanded", open ? "true" : "false");
});
links.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    links.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }
});

const seen = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      seen.unobserve(entry.target);
    }
  }
}, { threshold: 0.16 });
document.querySelectorAll(".reveal").forEach((node) => seen.observe(node));

document.querySelectorAll("[data-copy]").forEach((button) => {
  const original = button.textContent;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = "Copied";
      setTimeout(() => { button.textContent = original; }, 1200);
    } catch {
      button.textContent = button.dataset.copy;
    }
  });
});

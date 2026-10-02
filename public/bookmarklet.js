(function() {
  if (window.__destroyWebsiteActive) {
    alert('Destroy Website is already active on this page! Click on elements to smash them.');
    return;
  }
  window.__destroyWebsiteActive = true;

  // Create HUD Banner
  const hud = document.createElement('div');
  hud.id = 'destroy-website-hud';
  hud.style.cssText = `
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 2147483647;
    background: rgba(10, 10, 31, 0.95);
    border: 2px solid #FF2A6D;
    box-shadow: 0 0 20px rgba(255, 42, 109, 0.5);
    color: #FFF;
    font-family: monospace, sans-serif;
    padding: 12px 18px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;
  `;
  hud.innerHTML = `
    <span style="color:#FFEA00; font-weight:bold; font-size:14px;">💥 DESTROY WEBSITE</span>
    <span id="destroy-counter" style="color:#05D9E8; font-weight:bold;">0 Smashed</span>
    <button id="destroy-close" style="background:#FF4365; border:none; color:#FFF; padding:4px 8px; border-radius:6px; cursor:pointer; font-weight:bold;">✕ Exit</button>
  `;
  document.body.appendChild(hud);

  let smashedCount = 0;
  const counterEl = document.getElementById('destroy-counter');

  function smashElement(e) {
    if (e.target.closest('#destroy-website-hud')) return;
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;
    smashedCount++;
    if (counterEl) counterEl.textContent = `${smashedCount} Smashed`;

    // Explosive physics animation
    target.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    target.style.transform = `scale(0) rotate(${(Math.random() - 0.5) * 120}deg)`;
    target.style.opacity = '0';
    target.style.pointerEvents = 'none';

    // Particle flash
    const rect = target.getBoundingClientRect();
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2 - 25}px;
      top: ${rect.top + rect.height / 2 - 25}px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: radial-gradient(circle, #FFEA00 0%, #FF2A6D 70%, transparent 100%);
      pointer-events: none;
      z-index: 2147483646;
      animation: destroyFlash 0.3s forwards ease-out;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 350);
  }

  document.addEventListener('click', smashElement, true);

  document.getElementById('destroy-close').addEventListener('click', () => {
    document.removeEventListener('click', smashElement, true);
    hud.remove();
    window.__destroyWebsiteActive = false;
  });
})();

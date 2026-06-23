document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  initScrollReveal();
  initCountdown();
  initSparkleTrail();
});

// Share Invite Function
function shareInvite() {
  const inviteText = "We joyfully invite you to our Ring Ceremony! Tap the link to view our invitation.";
  // We use a placeholder domain if running locally, otherwise the actual URL
  const inviteUrl = window.location.href.includes('file://') ? 'https://your-invitation-link.com' : window.location.href;
  const fullMessage = `${inviteText}\n\n${inviteUrl}`;

  if (navigator.share) {
    navigator.share({
      title: "Engagement Invitation",
      text: inviteText,
      url: inviteUrl
    }).catch(err => {
      console.log('Share API dismissed or failed');
      fallbackShare(fullMessage);
    });
  } else {
    fallbackShare(fullMessage);
  }
}

function fallbackShare(fullMessage) {
  // Fallback for browsers that don't support native sharing (like Desktop Chrome or local files)
  try {
    navigator.clipboard.writeText(fullMessage).then(() => {
      const wantToWa = confirm("Link copied to your clipboard! 📋\n\nWould you like to open WhatsApp to share it directly?");
      if(wantToWa) {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`, '_blank');
      }
    }).catch(() => {
      // If clipboard fails, just try to open WhatsApp
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`, '_blank');
    });
  } catch(e) {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`, '_blank');
  }
}

// Golden Sparkle Cursor Trail
function initSparkleTrail() {
  const canvas = document.createElement('canvas');
  canvas.id = 'sparkle-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let particles = [];

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function spawnParticle(x, y) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 1, // Slight upward drift
      life: 1,
      size: Math.random() * 3 + 1
    });
  }

  let lastSpawn = 0;
  window.addEventListener('mousemove', (e) => {
    if(Date.now() - lastSpawn > 20) {
      spawnParticle(e.clientX, e.clientY);
      lastSpawn = Date.now();
    }
  });
  window.addEventListener('touchmove', (e) => {
    if(Date.now() - lastSpawn > 20) {
      spawnParticle(e.touches[0].clientX, e.touches[0].clientY);
      lastSpawn = Date.now();
    }
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.life})`;
      ctx.fill();

      if (p.life <= 0) {
        particles.splice(i, 1);
        i--;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Shutter Doors Open Function
function openDoors() {
  const overlay = document.getElementById('door-overlay');
  if (overlay) {
    overlay.classList.add('open');
    setTimeout(() => { triggerPetalBurst(); }, 500);
  }
}

// Global petals array to allow bursts
let petals = [];
let ctx, width, height;

function initPetals() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();

  // Create initial petals
  const petalCount = window.innerWidth < 768 ? 30 : 60;
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal(true)); // passing true to spread them initially
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

class Petal {
  constructor(initialSpread = false) {
    this.x = Math.random() * (width || window.innerWidth);
    this.y = initialSpread ? Math.random() * (height || window.innerHeight) : -20;
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 1.5 + 0.5;
    this.speedX = Math.random() * 1 - 0.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 2 - 1;
    
    // Traditional auspicious colors
    const colors = [
      'rgba(242, 122, 24, 0.8)', // Marigold
      'rgba(255, 209, 59, 0.8)', // Yellow
      'rgba(255, 255, 255, 0.9)', // Jasmine
      'rgba(217, 28, 41, 0.7)'   // Kumkum
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.shape = Math.random() > 0.3 ? 0 : 1; 
  }
  
  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.01) * this.speedX + this.speedX;
    this.rotation += this.rotationSpeed;
    
    if (this.y > (height || window.innerHeight) + 20) {
      this.y = -20;
      this.x = Math.random() * (width || window.innerWidth);
    }
  }
  
  draw() {
    if (!ctx) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.beginPath();
    if (this.shape === 0) {
      ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(0, 0, this.size / 1.5, 0, Math.PI * 2);
    }
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// Function to add a burst of falling petals when doors open
function triggerPetalBurst() {
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      let p = new Petal(false);
      p.speedY = Math.random() * 3 + 2; // fall faster
      petals.push(p);
      
      setTimeout(() => { petals.shift(); }, 5000);
    }, Math.random() * 1000);
  }
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 80;
    
    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
        
        // Auto open the sliding envelope when it scrolls into view
        if (reveal.classList.contains('date-arch-container') && !reveal.hasAttribute('data-auto-opened')) {
          reveal.setAttribute('data-auto-opened', 'true');
          setTimeout(() => {
            reveal.classList.add('opened');
            
            // Auto close after 3.5 seconds
            reveal.autoCloseTimeout = setTimeout(() => {
              reveal.classList.remove('opened');
            }, 3500);
            
          }, 800); // 800ms delay gives it time to fade in before sliding out
        }
      } else {
        // Remove classes when scrolled out of view so it can animate again
        reveal.classList.remove('active');
        if (reveal.classList.contains('date-arch-container')) {
          reveal.classList.remove('opened');
          reveal.removeAttribute('data-auto-opened');
          clearTimeout(reveal.autoCloseTimeout);
        }
      }
    });
  };
  
  // Add Click listener to manually open/close the Save The Date
  const dateArch = document.querySelector('.date-arch-container');
  if (dateArch && !dateArch.hasAttribute('data-click-bound')) {
    dateArch.setAttribute('data-click-bound', 'true');
    dateArch.style.cursor = 'pointer';
    dateArch.addEventListener('click', function() {
      clearTimeout(this.autoCloseTimeout);
      this.classList.toggle('opened');
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  setTimeout(revealOnScroll, 100);
}

function initCountdown() {
  const targetDate = new Date("July 02, 2026 10:30:00").getTime();
  
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('mins');
  const secsEl = document.getElementById('secs');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minsEl.innerText = "00";
      secsEl.innerText = "00";
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = d < 10 ? '0' + d : d;
    hoursEl.innerText = h < 10 ? '0' + h : h;
    minsEl.innerText = m < 10 ? '0' + m : m;
    secsEl.innerText = s < 10 ? '0' + s : s;
  }

  update();
  setInterval(update, 1000);
}

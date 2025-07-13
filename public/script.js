// script.js — обработка формы записи

function placeIconsPerSection() {
  const sections = document.querySelectorAll('.section');
  const iconSources = ['/icon1.png', '/icon2.png', '/icon3.png', '/icon4.png'];
  const iconSize = 100;
  const margin = 20;
  const totalIcons = 21;
  let iconIndex = 0;

  const placedGlobal = [];
  const scrollIcons = [];

  for (let i = 0; i < totalIcons; i++) {
    const section = sections[i % sections.length];
    const container = section.querySelector('.side-icons') || document.createElement('div');
    if (!container.classList.contains('side-icons')) {
      container.classList.add('side-icons');
      section.appendChild(container);
    }

    const src = iconSources[i % iconSources.length];
    const icon = document.createElement('img');
    icon.src = src;
    icon.className = 'floating-icon';
    icon.width = iconSize;
    icon.height = iconSize;

    let positionValid = false;
    let attempts = 0;

    while (!positionValid && attempts < 100) {
      const top = Math.random() * (section.offsetHeight - iconSize - 2 * margin) + margin;
      const left = Math.random() < 0.5
        ? Math.random() * (window.innerWidth * 0.15 - iconSize - margin) + margin
        : window.innerWidth - Math.random() * (window.innerWidth * 0.15 - iconSize - margin) - iconSize - margin;

      const box = { left, top, right: left + iconSize, bottom: top + iconSize };

      positionValid = placedGlobal.every(p =>
        box.right < p.left ||
        box.left > p.right ||
        box.bottom < p.top ||
        box.top > p.bottom
      );

      if (positionValid) {
        icon.style.left = left + 'px';
        icon.style.top = top + 'px';
        placedGlobal.push(box);
      }
      attempts++;
    }

    const delay = Math.random() * 4;
    const duration = 6 + Math.random() * 4;
    const scale = 0.8 + Math.random() * 0.4;
    const flipX = Math.random() < 0.5 ? -1 : 1;
    const flipY = Math.random() < 0.5 ? -1 : 1;
    const rotate = Math.floor(Math.random() * 360);

    icon.style.animationDelay = `${delay}s`;
    icon.style.animationDuration = `${duration}s`;
    icon.style.transform = `scale(${scale}) rotate(${rotate}deg) scaleX(${flipX}) scaleY(${flipY})`;
    icon.style.opacity = '0';
    icon.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.2)) blur(0.4px)';
    icon.style.transition = 'opacity 1.2s ease-out, transform 0.3s ease';

    icon.addEventListener('mouseenter', () => {
      icon.style.filter = 'drop-shadow(0 6px 16px rgba(0,0,0,0.4)) saturate(1.2)';
      icon.style.transform += ' scale(1.05)';
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.2)) blur(0.4px)';
      icon.style.transform = `scale(${scale}) rotate(${rotate}deg) scaleX(${flipX}) scaleY(${flipY})`;
    });

    container.appendChild(icon);
    scrollIcons.push(icon);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          icon.style.opacity = '0.6';
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(icon);
  }

  let lastScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    const direction = window.scrollY > lastScroll ? 1 : -1;
    scrollIcons.forEach(icon => {
      const currentY = parseFloat(icon.dataset.scrollY || 0);
      const newY = currentY + direction * 0.5;
      icon.style.transform += ` translateY(${newY}px)`;
      icon.dataset.scrollY = newY;
    });
    lastScroll = window.scrollY;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = {
      name: form.name.value.trim(),
      child: form.child.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim()
    };

    if (!formData.name || !formData.child || !formData.phone) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Заявка отправлена! Мы свяжемся с вами.');
        form.reset();
      } else {
        alert('Ошибка при отправке. Попробуйте позже.');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при отправке.');
    }
  });

  placeIconsPerSection();
});
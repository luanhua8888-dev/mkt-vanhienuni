const root = document.documentElement;
const motion = root.classList.contains('motion');

// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const setMenu = open => {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  navigation.classList.toggle('open', open);
};
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

// Header state, scroll progress, section transitions and section dots
const header = document.querySelector('.header');
const progress = document.querySelector('.progress');
const screens = [...document.querySelectorAll('.screen')];
const dots = [...document.querySelectorAll('.dots a')];
let ticking = false;
const onScroll = () => {
  const max = root.scrollHeight - innerHeight;
  progress.style.setProperty('--progress', max > 0 ? (scrollY / max).toFixed(4) : 0);
  header.classList.toggle('scrolled', scrollY > 12);
  const center = (innerHeight + header.offsetHeight) / 2;
  let active = screens.findIndex(screen => { const rect = screen.getBoundingClientRect(); return rect.top <= center && rect.bottom > center; });
  if (scrollY >= max - 2 || active === -1) active = screens.length - 1;
  screens.forEach((screen, index) => {
    screen.classList.toggle('is-past', index < active);
    screen.classList.toggle('is-next', index > active);
  });
  dots.forEach(dot => dot.classList.toggle('active', dot.getAttribute('href') === '#' + screens[active].id));
  ticking = false;
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// Active nav link
const navLinks = [...navigation.querySelectorAll('a[href^="#"]:not(.nav-cta)')];
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach(link => { const section = document.querySelector(link.getAttribute('href')); if (section) sectionObserver.observe(section); });

// Major filter
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    let visible = 0;
    document.querySelectorAll('.major-card').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) visible++;
    });
    document.querySelector('#filter-status').textContent = `Đang hiển thị ${visible} nhóm ngành.`;
    if (motion) {
      [...document.querySelectorAll('.major-card:not([hidden]):not(.reveal)')].forEach((card, index) => {
        card.classList.remove('card-in');
        void card.offsetWidth;
        card.style.setProperty('--d', `${index * 70}ms`);
        card.classList.add('card-in');
      });
    }
  });
});

// Contact topic
const resources = {
  admissions: { description: 'Tìm hiểu ngành đào tạo, phương thức và các thông báo tuyển sinh trên cổng thông tin của trường.', url: 'https://tuyensinh.vhu.edu.vn/', label: 'Đến cổng tuyển sinh VHU' },
  scholarship: { description: 'Xem các thông báo học bổng và điều kiện áp dụng tại Trung tâm Chăm sóc Người học. Liên hệ hotline để xác nhận học phí theo ngành.', url: 'https://csnh.vhu.edu.vn/vi/hoc-bong-1727', label: 'Tìm hiểu học bổng VHU' },
  campus: { description: 'Tham quan HungHau Campus qua tour 360°. Để hẹn lịch tham quan trực tiếp, hãy liên hệ hotline của trường.', url: 'https://360.vhu.edu.vn/', label: 'Mở tour campus 360°' },
  support: { description: 'Khám phá thông tin nhập học và các đơn vị hỗ trợ đời sống, học tập dành cho sinh viên Văn Hiến.', url: 'https://tansinhvien.vhu.edu.vn/', label: 'Xem hành trang tân sinh viên' }
};
document.querySelector('#interest').addEventListener('change', event => {
  const resource = resources[event.target.value];
  document.querySelector('#interest-description').textContent = resource.description;
  const link = document.querySelector('#interest-link');
  link.href = resource.url;
  link.textContent = resource.label;
});

// Campus 360° tour: loads by itself near the viewport on desktop, on tap for touch screens
const tour = document.querySelector('.tour');
const tourFrame = tour.querySelector('iframe');
const loadTour = () => {
  if (tourFrame.src) return;
  tourFrame.src = tourFrame.dataset.src;
  tourFrame.hidden = false;
  tourFrame.addEventListener('load', () => tour.classList.add('loaded'), { once: true });
};
tour.querySelector('[data-tour-start]').addEventListener('click', loadTour);
if (matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)').matches) {
  const tourObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { loadTour(); tourObserver.disconnect(); }
  }, { rootMargin: '300px 0px' });
  tourObserver.observe(tour);
}

// Sources dialog
const sources = document.querySelector('#sources-dialog');
document.querySelectorAll('[data-open-sources]').forEach(button => button.addEventListener('click', () => sources.showModal()));
document.querySelector('#close-sources').addEventListener('click', () => sources.close());
sources.addEventListener('click', event => {
  const rect = sources.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) sources.close();
});

// Scroll reveal and number count-up
if (motion) {
  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const item = entry.target;
    item.classList.add('is-visible');
    revealObserver.unobserve(item);
    item.addEventListener('transitionend', function done(event) {
      if (event.target !== item || event.propertyName !== 'translate') return;
      item.removeEventListener('transitionend', done);
      item.classList.remove('reveal', 'is-visible');
      item.style.removeProperty('--d');
    });
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach(item => {
    const siblings = [...item.parentElement.children].filter(sibling => sibling.hasAttribute('data-reveal'));
    item.style.setProperty('--d', `${Math.min(siblings.indexOf(item), 5) * 90}ms`);
    item.classList.add('reveal');
    revealObserver.observe(item);
  });

  document.querySelectorAll('[data-count]').forEach(number => {
    const target = Number(number.dataset.count);
    const from = target > 1000 ? target - 60 : 0;
    const start = performance.now() + 700;
    const tick = now => {
      const t = Math.min(Math.max((now - start) / 1400, 0), 1);
      number.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    };
    number.textContent = from;
    requestAnimationFrame(tick);
  });
}

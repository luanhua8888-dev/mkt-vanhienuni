const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Đóng menu' : 'Mở menu');
  navigation.classList.toggle('open', expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Mở menu');
}));
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
  });
});
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
  link.replaceChildren(document.createTextNode(resource.label + ' '));
  const arrow = document.createElement('span');
  arrow.textContent = '↗';
  link.append(arrow);
});
const sources = document.querySelector('#sources-dialog');
document.querySelectorAll('[data-open-sources]').forEach(button => button.addEventListener('click', () => sources.showModal()));
document.querySelector('#close-sources').addEventListener('click', () => sources.close());
sources.addEventListener('click', event => {
  const rect = sources.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) sources.close();
});

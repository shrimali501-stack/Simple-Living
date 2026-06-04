async function loadInclude(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res  = await fetch(url);
    const html = await res.text();

    const parser = new DOMParser();
    const doc    = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('style').forEach(style => {
      document.head.appendChild(document.adoptNode(style));
    });

    el.outerHTML = doc.body.innerHTML;

    document.querySelectorAll('.nav-links a').forEach(a => {
      try {
        const linkPath    = new URL(a.href).pathname;
        const currentPath = location.pathname;
        const isHome      = linkPath === '/';
        if (!isHome && currentPath.startsWith(linkPath)) {
          a.classList.add('active');
        } else if (linkPath === currentPath) {
          a.classList.add('active');
        }
      } catch (e) {}
    });

  } catch (e) {
    console.warn('Could not load include:', url, e);
  }
}

loadInclude('[data-include="nav"]',    '/nav.html');
loadInclude('[data-include="footer"]', '/footer.html');
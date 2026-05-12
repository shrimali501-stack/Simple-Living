async function loadInclude(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res  = await fetch(url);
    const html = await res.text();

    // Parse the fetched HTML
    const parser = new DOMParser();
    const doc    = parser.parseFromString(html, 'text/html');

    // Move any <style> blocks into <head> so they apply globally
    doc.querySelectorAll('style').forEach(style => {
      document.head.appendChild(document.adoptNode(style));
    });

    // Replace placeholder with the remaining HTML
    el.outerHTML = doc.body.innerHTML;

    // Highlight the active nav link based on current URL
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
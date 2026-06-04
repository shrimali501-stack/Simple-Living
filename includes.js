async function loadInclude(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res  = await fetch(url);
    const html = await res.text();

    const parser = new DOMParser();
    const doc    = parser.parseFromString(html, 'text/html');

    // Move any <style> blocks into <head>
    doc.querySelectorAll('style').forEach(style => {
      document.head.appendChild(document.adoptNode(style));
    });

    // Collect scripts before replacing HTML
    const scripts = Array.from(doc.querySelectorAll('script'));

    // Remove scripts from doc so they don't inject twice
    scripts.forEach(s => s.remove());

    // Replace placeholder with HTML (now script-free)
    el.outerHTML = doc.body.innerHTML;

    // Highlight active nav link
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

    // Execute scripts after a tick so DOM is ready
    setTimeout(() => {
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
      });
    }, 0);

  } catch (e) {
    console.warn('Could not load include:', url, e);
  }
}

loadInclude('[data-include="nav"]',    '/nav.html');
loadInclude('[data-include="footer"]', '/footer.html');
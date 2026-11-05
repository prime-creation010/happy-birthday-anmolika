// Project Anmol — initialise small enhancements after the document is ready.
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-ready');
  const year = new Date().getFullYear();
  const footer = document.querySelector('.credits-footer span');
  if (footer) footer.textContent = `© ${year} PRIME CREATIONS`;
});

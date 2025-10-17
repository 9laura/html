document.addEventListener('DOMContentLoaded', () => {
  const radios = Array.from(document.querySelectorAll('.slides input[type="radio"]'));
  if (!radios.length) return;
  let i = radios.findIndex(r => r.checked);
  if (i === -1) i = 0;
  const intervalo = 4000; // tempo em ms entre slides

  let timer = setInterval(() => {
    i = (i + 1) % radios.length;
    radios[i].checked = true;
  }, intervalo);

  // opcional: pausar ao passar o mouse sobre o carrossel
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => {
      timer = setInterval(() => {
        i = (i + 1) % radios.length;
        radios[i].checked = true;
      }, intervalo);
    });
  }
});
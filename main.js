const toggleAnimation = () => {
  const toggler = document.querySelector('.toggler');
  const nav = document.querySelector('nav ul');
  const navItems = document.querySelectorAll('nav ul li');

  toggler.addEventListener('click', () => {
    nav.classList.toggle('toggler-clicked');

    navItems.forEach((item, index) => {
      if(item.style.animation) {
        item.style.animation = '';
      } else {
        item.style.animation = `navTogglerFade 0.6s ease forwards ${index /5 + 0.2}s`;

      }

    }); 

    toggler.classList.toggle('toggle');

  });
}

toggleAnimation();
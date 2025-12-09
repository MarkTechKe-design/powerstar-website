// Contact form (Formspree)
const FORM_ACTION = 'https://formspree.io/f/mjkneeow';
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if(contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending...';
    const data = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      message: contactForm.message.value
    };
    try {
      const res = await fetch(FORM_ACTION, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify(data)
      });
      if(res.ok){ formStatus.textContent = 'Message sent successfully!'; contactForm.reset(); }
      else { formStatus.textContent = 'Failed to send. Try again later.'; }
    } catch { formStatus.textContent = 'Network error. Try again later.'; }
  });
}

// assets/site.js - hero slider, product auto-scroll, branch map switch
document.addEventListener('DOMContentLoaded', () => {
  // Simple hero slider (right-side slides)
  const slides = Array.from(document.querySelectorAll('.slide'));
  let idx = 0;
  if (slides.length) {
    setInterval(()=> {
      slides.forEach(s => s.style.display = 'none');
      slides[idx].style.display = 'block';
      idx = (idx+1) % slides.length;
    }, 3500);
    // show first
    slides.forEach(s=>s.style.display='none');
    slides[0].style.display='block';
  }

  // product row drag-scroll (mouse)
  const scrollRows = document.querySelectorAll('.scroll-row');
  scrollRows.forEach(row=>{
    let isDown=false, startX, scrollLeft;
    row.addEventListener('mousedown', e=>{
      isDown=true; row.classList.add('active'); startX=e.pageX-row.offsetLeft; scrollLeft=row.scrollLeft;
    });
    row.addEventListener('mouseleave', ()=>{ isDown=false; row.classList.remove('active');});
    row.addEventListener('mouseup', ()=>{ isDown=false; row.classList.remove('active'); });
    row.addEventListener('mousemove', e=>{
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - row.offsetLeft;
      const walk = (x - startX) * 1.5;
      row.scrollLeft = scrollLeft - walk;
    });
  });

  // Branch map switching
  const branchCards = document.querySelectorAll('[data-map-src]');
  const mapFrame = document.getElementById('branchMap');
  if(branchCards.length && mapFrame){
    branchCards.forEach(card=>{
      card.addEventListener('click', (e)=>{
        e.preventDefault();
        const src = card.getAttribute('data-map-src');
        if(src) mapFrame.src = src;
        // highlight selection
        branchCards.forEach(c=>c.classList.remove('selected'));
        card.classList.add('selected');
        // scroll to map
        mapFrame.scrollIntoView({behavior:'smooth', block:'center'});
      });
    });
  }
});

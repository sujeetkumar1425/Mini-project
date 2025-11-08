// main.js: typed.js init + builder interactions
// typed.js init (uses CDN script loaded in the HTML)
if (window.Typed) {
  try {
    var typed = new Typed('#element', {
      strings: ['Web Developer', 'Web designer', ' & Graphic Designer .'],
      typeSpeed: 90,
    });
  } catch (e) {
    // ignore init errors
    console.warn('Typed init failed', e);
  }
}

// Minimal JS: file input preview, paste and drop into .photo-box, and print button + template & reset
(function(){
    const uploadBtn = document.getElementById('uploadBtn');
    const photoInput = document.getElementById('photoInput');
    const printBtn = document.getElementById('printBtn');
    const resetPhotoBtn = document.getElementById('resetPhotoBtn');
    const templateSelect = document.getElementById('templateSelect');
    const builderWrap = document.querySelector('.builder-wrap');
    const photoBox = document.querySelector('.builder .photo-box');

    function setPhotoFromURL(url){
        // remove existing img if any
        const existing = photoBox.querySelector('img');
        if(existing) existing.remove();
        const img = document.createElement('img');
        img.src = url;
        photoBox.appendChild(img);
        // remove helper text
        photoBox.style.border = 'none';
    }

    uploadBtn && uploadBtn.addEventListener('click', ()=> photoInput.click());

    photoInput && photoInput.addEventListener('change', (e)=>{
        const f = e.target.files && e.target.files[0];
        if(!f) return;
        const reader = new FileReader();
        reader.onload = function(ev){ setPhotoFromURL(ev.target.result); };
        reader.readAsDataURL(f);
    });

    // Reset photo
    function resetPhoto(){
        const existing = photoBox.querySelector('img');
        if(existing) existing.remove();
        photoBox.style.border = '2px dashed #cbdcf8';
        photoBox.style.background = 'linear-gradient(#eef5ff,#d7e7fb)';
    }
    resetPhotoBtn && resetPhotoBtn.addEventListener('click', resetPhoto);

    // Paste support when photoBox is focused
    photoBox && photoBox.addEventListener('paste', (e)=>{
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for(let i=0;i<items.length;i++){
            const item = items[i];
            if(item.type.indexOf('image')!==-1){
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (ev)=> setPhotoFromURL(ev.target.result);
                reader.readAsDataURL(blob);
                e.preventDefault();
                return;
            }
        }
    });

    // Drag & drop support
    photoBox && ['dragenter','dragover'].forEach(ev => photoBox.addEventListener(ev, (e)=>{ e.preventDefault(); e.stopPropagation(); photoBox.style.opacity = '0.9'; }));
    photoBox && ['dragleave','drop'].forEach(ev => photoBox.addEventListener(ev, (e)=>{ e.preventDefault(); e.stopPropagation(); photoBox.style.opacity = ''; }));
    photoBox && photoBox.addEventListener('drop', (e)=>{
        const dt = e.dataTransfer;
        if(!dt || !dt.files || !dt.files.length) return;
        const f = dt.files[0];
        if(!f.type.startsWith('image')) return;
        const reader = new FileReader();
        reader.onload = (ev)=> setPhotoFromURL(ev.target.result);
        reader.readAsDataURL(f);
    });

    // Print button triggers print dialog
    printBtn && printBtn.addEventListener('click', ()=> window.print());

    // Template switching
    function applyTemplate(name){
        builderWrap.classList.remove('template-compact','template-modern');
        if(name === 'compact') builderWrap.classList.add('template-compact');
        if(name === 'modern') builderWrap.classList.add('template-modern');
        try{ localStorage.setItem('resume_template', name); }catch(e){}
    }
    templateSelect && templateSelect.addEventListener('change', (e)=> applyTemplate(e.target.value));
    // load saved template
    try{
        const saved = localStorage.getItem('resume_template') || 'default';
        if(templateSelect) templateSelect.value = saved;
        applyTemplate(saved);
    }catch(e){}
})();

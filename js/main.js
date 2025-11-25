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

// Portfolio functionality
function showPortfolioForm() {
    document.getElementById('portfolioModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function generatePortfolio() {
    // Scroll to the builder section
    document.getElementById('builder').scrollIntoView({behavior:'smooth'});
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const portfolioModal = document.getElementById('portfolioModal');
    
    if (event.target === portfolioModal) {
        portfolioModal.style.display = 'none';
    }
}

// Handle portfolio form submission
document.addEventListener('DOMContentLoaded', function() {
    const portfolioForm = document.getElementById('portfolioForm');
    
    if (portfolioForm) {
        portfolioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                jobTitle: document.getElementById('jobTitle').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                location: document.getElementById('location').value,
                summary: document.getElementById('summary').value,
                experience: document.getElementById('experience').value,
                projects: document.getElementById('projects').value,
                education: document.getElementById('education').value,
                skills: document.getElementById('skills').value
            };
            
            // Validate form
            for (let key in formData) {
                if (!formData[key].trim()) {
                    alert('Please fill in all fields');
                    return;
                }
            }
            
            // Update the portfolio page with user data
            updatePortfolioContent(formData);
            
            // Close modal
            closeModal('portfolioModal');
            
            // Scroll to builder section
            document.getElementById('builder').scrollIntoView({behavior:'smooth'});
            
            // Show success message
            alert('Portfolio generated successfully! You can now edit it directly or print as PDF.');
            
            // Clear form
            portfolioForm.reset();
        });
    }
});

function updatePortfolioContent(data) {
    // Update main section
    const nameSpan = document.querySelector('.leftsection .purple');
    if (nameSpan) {
        nameSpan.textContent = data.fullName;
    }
    
    // Update typed.js strings
    if (window.Typed && window.typed) {
        window.typed.destroy();
        window.typed = new Typed('#element', {
            strings: [data.jobTitle, 'Professional', 'Expert'],
            typeSpeed: 90,
        });
    }
    
    // Update builder section
    const nameField = document.querySelector('.builder .name');
    const titleField = document.querySelector('.builder .title');
    const contactField = document.querySelector('.builder .section:nth-child(3) .placeholder');
    const summaryField = document.querySelector('.builder .section:nth-child(4) .placeholder');
    const experienceField = document.querySelector('.builder .section:nth-child(5) .placeholder');
    const projectsField = document.querySelector('.builder .section:nth-child(6) .placeholder');
    const educationField = document.querySelector('.builder .section:nth-child(7) .placeholder');
    const skillsField = document.querySelector('.builder .section:nth-child(8) .placeholder');
    
    if (nameField) nameField.textContent = data.fullName;
    if (titleField) titleField.textContent = data.jobTitle;
    if (contactField) contactField.textContent = `${data.email} · ${data.phone} · ${data.location}`;
    if (summaryField) summaryField.textContent = data.summary;
    if (experienceField) experienceField.textContent = data.experience;
    if (projectsField) projectsField.textContent = data.projects;
    if (educationField) educationField.textContent = data.education;
    if (skillsField) skillsField.textContent = data.skills;
    // also update the portfolio page experience container
    const portfolioExp = document.getElementById('portfolio-experience');
    if(portfolioExp){
        portfolioExp.innerHTML = renderExperienceHtml(data.experience || '');
    }
}

// Convert experience textarea / contenteditable text into HTML timeline items
function renderExperienceHtml(text){
    const trimmed = (text||'').trim();
    if(!trimmed) return '<p class="empty-note">No work experience provided.</p>';
    // split by blank line or newlines; allow the user to separate multiple experiences by a blank line
    const parts = trimmed.split(/\n{1,}/g).map(s=>s.trim()).filter(Boolean);
    // create list items
    const items = parts.map(p=>{
        // first line up to a dash or bullet might be company/role
        const lines = p.split(/\n+/g).map(l=>l.trim()).filter(Boolean);
        const title = lines[0] || '';
        const rest = lines.slice(1).join('\n');
        return `<div class="exp-item"><h5>${escapeHtml(title)}</h5><p>${escapeHtml(rest||'')}</p></div>`;
    }).join('\n');
    return `<div class="exp-list">${items}</div>`;
}

function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Wire up live syncing from builder's contenteditable experience field
document.addEventListener('DOMContentLoaded', function(){
    const builderExp = document.getElementById('builder-experience');
    const portfolioExp = document.getElementById('portfolio-experience');
    if(builderExp && portfolioExp){
        const sync = ()=>{ portfolioExp.innerHTML = renderExperienceHtml(builderExp.textContent || builderExp.innerText || builderExp.innerHTML); };
        // initial sync
        sync();
        // listen for input/paste/keyup to update in near real-time
        builderExp.addEventListener('input', sync);
        builderExp.addEventListener('keyup', sync);
        builderExp.addEventListener('paste', ()=> setTimeout(sync,50));
    }
});

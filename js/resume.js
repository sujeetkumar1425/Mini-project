// Initial state data structure
const resumeData = {
    name: 'Sujeet',
    title: 'Full Stack Developer',
    email: 'sujeet@example.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    summary: '',
    skills: [],
    workExperience: [],
    education: []
};

// --- Helper Functions to Render/Update UI ---

function updateResumePreview() {
    // Update basic info for live preview from the form inputs
    resumeData.name = document.getElementById('fullName').value;
    resumeData.title = document.getElementById('title').value;
    resumeData.email = document.getElementById('email').value;
    resumeData.phone = document.getElementById('phone').value;
    resumeData.location = document.getElementById('location').value;
    resumeData.summary = document.getElementById('summary').value;

    const previewContainer = document.getElementById('resumePreview');
    previewContainer.innerHTML = `
        <!-- Resume Header -->
        <div class="border-b-2 border-gray-300 pb-4 mb-4">
            <h1 class="text-3xl font-bold">${resumeData.name}</h1>
            <p class="text-purple-600">${resumeData.title}</p>
            <div class="flex flex-wrap gap-4 text-sm mt-2">
                <span>${resumeData.email}</span>
                <span>${resumeData.phone}</span>
                <span>${resumeData.location}</span>
            </div>
        </div>

        <!-- Summary -->
        ${resumeData.summary ? `<div class="mb-4">
            <h2 class="text-xl font-semibold border-b pb-1 mb-2">Summary</h2>
            <p class="text-sm">${resumeData.summary}</p>
        </div>` : ''}

        <!-- Skills -->
        ${resumeData.skills.length > 0 ? `<div class="mb-4">
            <h2 class="text-xl font-semibold border-b pb-1 mb-2">Skills</h2>
            <div class="flex flex-wrap gap-2 text-sm">
                ${resumeData.skills.map(skill => `<span class="bg-gray-200 px-2 py-0.5 rounded">${skill}</span>`).join('')}
            </div>
        </div>` : ''}

        <!-- Work Experience -->
        ${resumeData.workExperience.length > 0 ? `<div class="mb-4">
            <h2 class="text-xl font-semibold border-b pb-1 mb-2">Work Experience</h2>
            ${resumeData.workExperience.map(job => `
                <div class="mb-3">
                    <div class="flex justify-between font-semibold">
                        <span>${job.title} at ${job.company}</span>
                        <span class="text-gray-500 text-sm">${job.duration}</span>
                    </div>
                    <p class="text-sm">${job.description}</p>
                </div>
            `).join('')}
        </div>` : ''}

        <!-- Education -->
        ${resumeData.education.length > 0 ? `<div>
            <h2 class="text-xl font-semibold border-b pb-1 mb-2">Education</h2>
            ${resumeData.education.map(edu => `
                <div class="mb-3">
                    <div class="flex justify-between font-semibold">
                        <span>${edu.degree}, ${edu.institution}</span>
                        <span class="text-gray-500 text-sm">${edu.year}</span>
                    </div>
                </div>
            `).join('')}
        </div>` : ''}
    `;
}

// --- Skills Management ---

function renderSkills() {
    const formContainer = document.getElementById('skillsContainerForm');
    formContainer.innerHTML = '';
    resumeData.skills.forEach((skill, index) => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'flex items-center gap-2 px-3 py-1 bg-purple-600/20 text-purple-400 rounded text-sm';
        skillDiv.innerHTML = `
            <span>${skill}</span>
            <button onclick="removeSkill(${index})" class="hover:text-white">
                <i data-lucide="trash2" class="w-3 h-3"></i>
            </button>
        `;
        formContainer.appendChild(skillDiv);
    });
    lucide.createIcons(); // Re-render lucide icons after DOM update
    updateResumePreview();
}

function addSkill() {
    const input = document.getElementById('newSkillInput');
    const skillValue = input.value.trim();
    if (skillValue) {
        resumeData.skills.push(skillValue);
        input.value = '';
        renderSkills();
    }
}

function removeSkill(index) {
    resumeData.skills.splice(index, 1);
    renderSkills();
}

// --- Work Experience Management ---

function renderWorkExperience() {
    const formContainer = document.getElementById('workExperienceContainerForm');
    formContainer.innerHTML = '';
    resumeData.workExperience.forEach((job, index) => {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'bg-[#0f1729] p-4 rounded-lg border border-gray-800';
        jobDiv.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-white">${job.title} at ${job.company}</h3>
                <button onclick="removeWorkExperience(${index})" class="text-gray-400 hover:text-red-400">
                    <i data-lucide="trash2" class="w-4 h-4"></i>
                </button>
            </div>
            <p class="text-gray-400 text-sm">${job.duration}</p>
        `;
        formContainer.appendChild(jobDiv);
    });
    lucide.createIcons();
    updateResumePreview();
}

function addWorkExperience() {
    const title = document.getElementById('newWorkTitle');
    const company = document.getElementById('newWorkCompany');
    const duration = document.getElementById('newWorkDuration');
    const description = document.getElementById('newWorkDescription');

    if (title.value.trim() && company.value.trim()) {
        resumeData.workExperience.push({
            title: title.value.trim(),
            company: company.value.trim(),
            duration: duration.value.trim(),
            description: description.value.trim()
        });
        title.value = '';
        company.value = '';
        duration.value = '';
        description.value = '';
        renderWorkExperience();
    }
}

function removeWorkExperience(index) {
    resumeData.workExperience.splice(index, 1);
    renderWorkExperience();
}

// --- Education Management ---

function renderEducation() {
    const formContainer = document.getElementById('educationContainerForm');
    formContainer.innerHTML = '';
    resumeData.education.forEach((edu, index) => {
        const eduDiv = document.createElement('div');
        eduDiv.className = 'bg-[#0f1729] p-4 rounded-lg border border-gray-800';
        eduDiv.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-white">${edu.degree} at ${edu.institution}</h3>
                <button onclick="removeEducation(${index})" class="text-gray-400 hover:text-red-400">
                    <i data-lucide="trash2" class="w-4 h-4"></i>
                </button>
            </div>
            <p class="text-gray-400 text-sm">${edu.year}</p>
        `;
        formContainer.appendChild(eduDiv);
    });
    lucide.createIcons();
    updateResumePreview();
}

function addEducation() {
    const degree = document.getElementById('newEducationDegree');
    const institution = document.getElementById('newEducationInstitution');
    const year = document.getElementById('newEducationYear');

    if (degree.value.trim() && institution.value.trim()) {
        resumeData.education.push({
            degree: degree.value.trim(),
            institution: institution.value.trim(),
            year: year.value.trim()
        });
        degree.value = '';
        institution.value = '';
        year.value = '';
        renderEducation();
    }
}

function removeEducation(index) {
    resumeData.education.splice(index, 1);
    renderEducation();
}


// --- Initialization ---
document.addEventListener('DOMContentLoaded', (event) => {
    // Add event listener for "Enter" key on skill input
    document.getElementById('newSkillInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addSkill();
        }
    });

    renderSkills();
    renderWorkExperience();
    renderEducation();
    updateResumePreview(); // Initial render of the preview
    lucide.createIcons(); // Initialize Lucide icons on page load
});

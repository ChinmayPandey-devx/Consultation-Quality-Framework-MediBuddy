document.addEventListener('DOMContentLoaded', () => {

    // Application State
    const state = {
        files: [],
        chiefComplaint: '',
        specialty: 'General Physician',
        currentStep: 1,
        doctorReviewed: false,
        rating: 0
    };

    // Patient Panel Elements
    const tabs = document.querySelectorAll('.tab');
    const stepViews = document.querySelectorAll('.step-view');
    
    // Step 1: Upload
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const btnContinueSymptoms = document.getElementById('btn-continue-symptoms');

    // Step 2: Symptoms
    const symptomsInput = document.getElementById('symptoms-input');
    const specialtyInput = document.getElementById('specialty-input');
    const btnSubmitConsult = document.getElementById('btn-submit-consult');

    // Step 3: Call
    const patientCallStatus = document.getElementById('patient-call-status');
    const callSpecialtyDisplay = document.getElementById('call-specialty-display');

    // Step 4: Rating
    const starsInteractive = document.getElementById('stars-interactive');
    const stars = starsInteractive.querySelectorAll('span');
    const escalationCard = document.getElementById('escalation-card');
    const successCard = document.getElementById('success-card');

    // Doctor Panel Elements
    const docIdle = document.getElementById('doc-idle');
    const docLoading = document.getElementById('doc-loading');
    const docSummary = document.getElementById('doc-summary');
    const docConfirmed = document.getElementById('doc-confirmed');
    
    const aiChiefComplaint = document.getElementById('ai-chief-complaint');
    const aiDocGrid = document.getElementById('ai-doc-grid');
    const btnDocConfirm = document.getElementById('btn-doc-confirm');
    const confirmTime = document.getElementById('confirm-time');
    const docSpecialtyDisplay = document.getElementById('doc-specialty-display');

    // --- NAVIGATION LOGIC ---
    function switchTab(stepNum) {
        state.currentStep = stepNum;
        
        // Update Tabs
        tabs.forEach(tab => {
            if(parseInt(tab.dataset.step) === stepNum) tab.classList.add('active');
            else tab.classList.remove('active');
        });

        // Update Views
        stepViews.forEach(view => {
            if(view.id === `step-${stepNum}`) view.classList.add('active');
            else view.classList.remove('active');
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const stepNum = parseInt(tab.dataset.step);
            // Allow manual navigation for demo purposes
            switchTab(stepNum);
        });
    });

    // --- STEP 1: UPLOAD LOGIC ---
    fileInput.addEventListener('change', handleFiles);
    
    function handleFiles(e) {
        const newFiles = Array.from(e.target.files);
        
        // Max 4 files total
        if(state.files.length + newFiles.length > 4) {
            alert('Maximum 4 files allowed.');
            return;
        }
        
        state.files = [...state.files, ...newFiles];
        renderPatientFiles();
        checkContinueBtn();
    }

    function renderPatientFiles() {
        fileList.innerHTML = '';
        state.files.forEach((file, index) => {
            const card = document.createElement('div');
            card.className = 'file-card';
            
            // Format size
            const sizeKB = Math.round(file.size / 1024);
            const sizeStr = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB';

            card.innerHTML = `
                <div class="file-icon">PDF</div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${sizeStr}</div>
                <div class="file-remove" data-index="${index}">&times;</div>
            `;
            fileList.appendChild(card);
        });

        // Add remove listeners
        document.querySelectorAll('.file-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                state.files.splice(index, 1);
                renderPatientFiles();
                checkContinueBtn();
            });
        });
    }

    function checkContinueBtn() {
        btnContinueSymptoms.disabled = state.files.length === 0;
    }

    btnContinueSymptoms.addEventListener('click', () => {
        switchTab(2);
    });

    // --- STEP 2: SYMPTOMS TO CALL LOGIC ---
    btnSubmitConsult.addEventListener('click', () => {
        state.chiefComplaint = symptomsInput.value.trim() || 'Patient provided no written description.';
        state.specialty = specialtyInput.value;

        // Transition patient to Call view
        callSpecialtyDisplay.textContent = state.specialty;
        switchTab(3);

        // Trigger Doctor Side Animation
        triggerDoctorSummary();
    });

    // --- DOCTOR SIDE LOGIC ---
    function triggerDoctorSummary() {
        // Hide idle, show loading
        docIdle.style.display = 'none';
        docLoading.style.display = 'block';

        // Simulate AI generation time (2.2 seconds)
        setTimeout(() => {
            docLoading.style.display = 'none';
            docSummary.style.display = 'block';

            // Populate AI Data
            aiChiefComplaint.textContent = `"${state.chiefComplaint}"`;
            
            // Populate Doc Grid
            aiDocGrid.innerHTML = '';
            if(state.files.length > 0) {
                state.files.forEach(file => {
                    const chip = document.createElement('div');
                    chip.className = 'doc-chip';
                    chip.innerHTML = `<span class="red-icon">PDF</span> ${file.name}`;
                    aiDocGrid.appendChild(chip);
                });
            } else {
                aiDocGrid.innerHTML = '<span style="font-size: 12px; color: #64748B;">No files uploaded.</span>';
            }
        }, 2200);
    }

    // Doctor confirms case
    btnDocConfirm.addEventListener('click', () => {
        state.doctorReviewed = true;
        
        // Hide summary, show confirmed
        docSummary.style.display = 'none';
        docConfirmed.style.display = 'block';

        // Set current time
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        confirmTime.textContent = `${hours}:${minutes}`;
        docSpecialtyDisplay.textContent = state.specialty;

        // Update Patient Call View Real-time
        patientCallStatus.innerHTML = `Doctor has reviewed your case. <strong>You are connected.</strong>`;
        patientCallStatus.style.color = '#10B981'; // Green
    });

    // End Call button transitions to Rate step
    document.getElementById('btn-end-call').addEventListener('click', () => {
        switchTab(4);
    });

    // --- STEP 4: RATING LOGIC ---
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            const val = parseInt(e.target.dataset.value);
            state.rating = val;

            // Fill stars
            stars.forEach(s => {
                if(parseInt(s.dataset.value) <= val) s.classList.add('active');
                else s.classList.remove('active');
            });

            // Show appropriate card
            if(val <= 3) {
                escalationCard.style.display = 'flex';
                successCard.style.display = 'none';
            } else {
                escalationCard.style.display = 'none';
                successCard.style.display = 'flex';
            }
        });
    });
});

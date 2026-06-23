document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation classes or trigger events
                if (entry.target.classList.contains('bottom-sheet')) {
                    entry.target.style.animation = 'none';
                    entry.target.offsetHeight; /* trigger reflow */
                    entry.target.style.animation = null; 
                    entry.target.classList.add('slide-up');
                }
                if (entry.target.classList.contains('recovery-card')) {
                    entry.target.style.animation = 'none';
                    entry.target.offsetHeight; /* trigger reflow */
                    entry.target.style.animation = null; 
                    entry.target.classList.add('slide-down');
                }
            }
        });
    }, observerOptions);

    // Select elements to observe
    const bottomSheet = document.querySelector('.bottom-sheet');
    const recoveryCard = document.querySelector('.recovery-card');

    if (bottomSheet) observer.observe(bottomSheet);
    if (recoveryCard) observer.observe(recoveryCard);

    // Interactive Star Rating
    const stars = document.querySelectorAll('.star');
    if(stars.length > 0) {
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                // Remove active from all
                stars.forEach(s => s.classList.remove('active'));
                
                // Add active to clicked and previous
                for(let i = 0; i <= index; i++) {
                    stars[i].classList.add('active');
                }

                // If 1 or 2 stars, show recovery card
                if(index < 2) {
                    if(recoveryCard) {
                        recoveryCard.style.display = 'block';
                        recoveryCard.classList.remove('slide-down');
                        void recoveryCard.offsetWidth; // trigger reflow
                        recoveryCard.classList.add('slide-down');
                    }
                } else {
                    if(recoveryCard) {
                        recoveryCard.style.display = 'none';
                    }
                }
            });
        });

        // Initialize state (hide recovery card initially if > 2 stars, but default html has 2 stars active)
        if(recoveryCard) {
            recoveryCard.style.display = 'block'; // as per the mock
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const intro = document.querySelector('.intro');
    setTimeout(function() {
        intro.classList.add('active');
    }, 100); // Delay the class addition slightly to ensure the animation triggers
});

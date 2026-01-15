// Selective typing animation on page load
document.addEventListener('DOMContentLoaded', () => {
    // Function to wrap a word in a span for typing
    function wrapWordForTyping(element, wordToType) {
        const html = element.innerHTML;
        const regex = new RegExp(`\\b${wordToType}\\b`, 'i');
        const wrapped = html.replace(regex, `<span class="type-word" data-word="${wordToType}"></span>`);
        element.innerHTML = wrapped;
    }

    // Type a single word
    function typeWord(span, word, speed = 50) {
        return new Promise((resolve) => {
            span.classList.add('typing');
            let index = 0;

            const interval = setInterval(() => {
                if (index < word.length) {
                    span.textContent += word[index];
                    index++;
                } else {
                    clearInterval(interval);
                    span.classList.remove('typing');
                    resolve();
                }
            }, speed);
        });
    }

    // Wrap all words in text elements for hover effect
    function wrapAllWords() {
        const textElements = document.querySelectorAll('h1, h2, h3, p, li');

        textElements.forEach(element => {
            // Skip if element has links (we'll handle those separately)
            if (element.querySelector('a')) {
                // Wrap only text nodes, not links
                const nodes = Array.from(element.childNodes);
                nodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                        const words = node.textContent.split(/(\s+)/);
                        const span = document.createElement('span');
                        words.forEach(word => {
                            if (word.trim()) {
                                const wordSpan = document.createElement('span');
                                wordSpan.className = 'hoverable-word';
                                wordSpan.textContent = word;
                                wordSpan.dataset.word = word; // Original word with punctuation for typing
                                wordSpan.dataset.cleanWord = word.replace(/[.,!?;:]+$/, ''); // Clean word for matching
                                span.appendChild(wordSpan);
                            } else {
                                span.appendChild(document.createTextNode(word));
                            }
                        });
                        node.replaceWith(span);
                    }
                });
            } else {
                // Wrap all words
                const text = element.textContent;
                const words = text.split(/(\s+)/);
                element.innerHTML = '';

                words.forEach(word => {
                    if (word.trim()) {
                        const span = document.createElement('span');
                        span.className = 'hoverable-word';
                        span.textContent = word;
                        span.dataset.word = word; // Original word with punctuation for typing
                        span.dataset.cleanWord = word.replace(/[.,!?;:]+$/, ''); // Clean word for matching
                        element.appendChild(span);
                    } else {
                        element.appendChild(document.createTextNode(word));
                    }
                });
            }
        });
    }

    // Add hover listeners to all word spans
    function addHoverListeners() {
        document.addEventListener('mouseover', async (e) => {
            const span = e.target.closest('.hoverable-word');
            if (span && !span.classList.contains('typing')) {
                const word = span.dataset.word;
                span.textContent = '';
                await typeWord(span, word, 40);
            }
        });
    }

    // Define words to type on load (selector and word)
    const wordsToType = [
        { selector: '.hero h1', word: 'Anuj' },
        { selector: '.hero h1', word: 'Goyal' },
        { selector: '.hero .lead', word: 'Building' },
        { selector: '.about-content p:first-child', word: 'leverage' },
        { selector: '.about-content p:nth-child(2)', word: 'discovering' },
        { selector: '.project > p', word: 'tracking' },
        { selector: '.contact > p', word: 'opportunities' }
    ];

    // First wrap all words for hover effect
    wrapAllWords();

    // Then mark specific words for initial typing
    wordsToType.forEach(({ selector, word }) => {
        const element = document.querySelector(selector);
        if (element) {
            const spans = element.querySelectorAll('.hoverable-word');
            spans.forEach(span => {
                if (span.dataset.cleanWord.toLowerCase() === word.toLowerCase()) {
                    span.classList.add('type-word');
                    span.textContent = '';
                }
            });
        }
    });

    // Type words sequentially on load
    async function typeSequentially() {
        const spans = document.querySelectorAll('.type-word');

        for (const span of spans) {
            const word = span.getAttribute('data-word');
            await typeWord(span, word, 60);
            await new Promise(resolve => setTimeout(resolve, 150));
        }
    }

    // Start typing animation
    typeSequentially();

    // Add hover interactivity
    addHoverListeners();

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Visitor counter
    async function updateVisitorCount() {
        const counterElement = document.getElementById('visitor-counter');

        try {
            // Using CounterAPI.dev - no auth header needed, namespace is in URL
            const endpoint = 'https://api.counterapi.dev/v2/rylgyls-team-2387/first-counter-2387/up';

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error('CounterAPI unavailable');
            }

            const data = await response.json();

            // Update the counter display
            if (counterElement && data.count !== undefined) {
                counterElement.textContent = data.count;
            }
        } catch (error) {
            // Fallback to localStorage if API fails
            console.log('Using localStorage fallback for visitor counter');
            let count = localStorage.getItem('visitor-count') || 0;
            count = parseInt(count) + 1;
            localStorage.setItem('visitor-count', count);

            if (counterElement) {
                counterElement.textContent = count;
            }
        }
    }

    // Initialize visitor counter
    updateVisitorCount();
});

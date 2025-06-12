// Inicialização do Fancybox
Fancybox.bind("[data-fancybox]", {
    // Opções personalizadas aqui
});

// Registrar o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Função para criar corações flutuantes
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.querySelector('.floating-hearts').appendChild(heart);

    // Animar o coração
    gsap.to(heart, {
        y: -window.innerHeight,
        rotation: Math.random() * 360,
        duration: Math.random() * 3 + 2,
        opacity: 0,
        ease: "none",
        onComplete: () => {
            heart.remove();
        }
    });
}

// Garantir que as imagens sejam carregadas antes de iniciar as animações
function preloadImages() {
    const images = document.querySelectorAll('img');
    const promises = Array.from(images).map(img => {
        if (img.complete) {
            return Promise.resolve();
        } else {
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve; // Tratar erros também
            });
        }
    });
    return Promise.all(promises);
}

// Tela de carregamento
window.addEventListener('load', () => {
    preloadImages().then(() => {
        // Simular tempo de carregamento para efeito visual
        setTimeout(() => {
            const loadingScreen = document.querySelector('.loading-screen');
            const content = document.querySelector('.content');
            
            loadingScreen.classList.add('fade-out');
            content.classList.remove('hidden');
            
            // Iniciar animações após o carregamento
            startAnimations();
            
            // Remover a tela de carregamento após a transição
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
});

// Função para iniciar as animações
function startAnimations() {
    // Garantir que os elementos estejam visíveis
    document.querySelectorAll('.memory-card').forEach(card => {
        card.style.opacity = '1';
    });

    // Animação do hero
    const heroElements = [
        '.hero-image',
        '.hero h1',
        '.hero .subtitle',
        '.hero .love-quote'
    ];

    heroElements.forEach((element, index) => {
        gsap.from(element, {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: index * 0.3,
            ease: "power2.out"
        });
    });

    // Criar corações flutuantes periodicamente
    setInterval(createFloatingHeart, 2000);

    // Animação dos cards de memória
    gsap.utils.toArray('.memory-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2
        });
    });

    // Animação das imagens da galeria
    gsap.utils.toArray('.gallery-grid img').forEach((img, index) => {
        gsap.from(img, {
            scrollTrigger: {
                trigger: img,
                start: "top bottom-=100",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            delay: index * 0.2
        });
    });

    // Animação do footer
    gsap.from('footer', {
        scrollTrigger: {
            trigger: 'footer',
            start: "top bottom",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 30,
        duration: 1
    });
}

// Adicionar efeito de parallax no mobile
if (window.innerWidth <= 768) {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('deviceorientation', (event) => {
        const tiltX = event.gamma / 30;
        const tiltY = event.beta / 30;
        
        gsap.to(hero, {
            x: tiltX * 10,
            y: tiltY * 10,
            duration: 0.5,
            ease: "power1.out"
        });
    });
}

// Adicionar efeito de toque nas imagens (mobile)
const images = document.querySelectorAll('.memory-card img, .gallery-grid img');
images.forEach(img => {
    img.addEventListener('touchstart', () => {
        gsap.to(img.parentElement, {
            scale: 0.95,
            duration: 0.2
        });
    });
    
    img.addEventListener('touchend', () => {
        gsap.to(img.parentElement, {
            scale: 1,
            duration: 0.2
        });
    });
});

// Detectar gestos de swipe
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            createHeartBurst('right');
        } else {
            createHeartBurst('left');
        }
    }
}

function createHeartBurst(direction) {
    const hearts = 10;
    const container = document.querySelector('.floating-hearts');
    
    for (let i = 0; i < hearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.style.left = (direction === 'right' ? '0' : '100%');
        heart.style.top = Math.random() * window.innerHeight + 'px';
        container.appendChild(heart);
        
        gsap.to(heart, {
            x: direction === 'right' ? window.innerWidth : -window.innerWidth,
            y: Math.random() * 200 - 100,
            rotation: Math.random() * 360,
            duration: Math.random() * 2 + 1,
            opacity: 0,
            ease: "power1.out",
            onComplete: () => heart.remove()
        });
    }
} 
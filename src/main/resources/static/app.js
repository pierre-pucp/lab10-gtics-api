document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // PREGUNTA 1: DOM API (crearPecera(x))
    // ==========================================
    const gridContainer = document.getElementById('pecera-grid');
    const gridSizeInput = document.getElementById('grid-size');
    const btnCrear = document.getElementById('btn-crear');

    function crearPecera(x) {
        gridContainer.innerHTML = ''; // Nettoyage du contenu précédent
        // Définition dynamique des colonnes CSS Grid
        gridContainer.style.gridTemplateColumns = `repeat(${x}, 1fr)`;

        // Création des x * x cellules via createElement
        for (let i = 0; i < x * x; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            gridContainer.appendChild(cell);
        }
    }

    // Initialisation par défaut (x = 6)[cite: 1]
    crearPecera(parseInt(gridSizeInput.value) || 6);

    btnCrear.addEventListener('click', () => {
        const x = parseInt(gridSizeInput.value);
        if (x > 0 && x <= 12) {
            crearPecera(x);
        } else {
            alert('Por favor ingrese un valor válido entre 1 y 12.');
        }
    });

    // ==========================================
    // PREGUNTA 2: WEB STORAGE API & TIMER
    // ==========================================
    const nemoScoreElem = document.getElementById('nemo-score');
    const doryScoreElem = document.getElementById('dory-score');
    const btnNemo = document.getElementById('btn-nemo');
    const btnDory = document.getElementById('btn-dory');
    const aquarium = document.getElementById('aquarium');

    // Nemo: localStorage (persiste entre onglets et rechargements)
    let nemoCount = parseInt(localStorage.getItem('nemo_count')) || 0;
    // Dory: sessionStorage (propre à l'onglet, remis à zéro dans un nouvel onglet)
    let doryCount = parseInt(sessionStorage.getItem('dory_count')) || 0;

    function updateScores() {
        nemoScoreElem.textContent = nemoCount;
        doryScoreElem.textContent = doryCount;
        localStorage.setItem('nemo_count', nemoCount);
        sessionStorage.setItem('dory_count', doryCount);
    }
    updateScores();

    btnNemo.addEventListener('click', () => {
        nemoCount++;
        updateScores();
    });

    btnDory.addEventListener('click', () => {
        doryCount++;
        updateScores();
    });

    // Timer (setInterval) : Transition progressive du bleu clair (#ADD8E6) au vert (#2E8B57) chaque seconde
    // La "limpieza de la pecera" (rechargement) remet la couleur d'origine.
    let elapsedSeconds = 0;
    const maxSeconds = 30; // Durée totale de la transition vers le vert

    setInterval(() => {
        elapsedSeconds++;
        const progress = Math.min(elapsedSeconds / maxSeconds, 1);
        // Interpolation RGB douce
        const r = Math.round(173 - (173 - 46) * progress);
        const g = Math.round(216 - (216 - 139) * progress);
        const b = Math.round(230 - (230 - 87) * progress);
        aquarium.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }, 1000);

    // ==========================================
    // PREGUNTA 3: HTML DRAG AND DROP API
    // ==========================================
    const bubblesContainer = document.getElementById('bubbles-container');
    const fishTargets = document.querySelectorAll('.fish-target');

    // Apparition d'une bulle toutes les 2 secondes
    setInterval(() => {
        createBubble();
    }, 2000);

    function createBubble() {
        const bubble = document.createElement('div');
        const isNemo = Math.random() < 0.5;
        bubble.classList.add('bubble', isNemo ? 'nemo' : 'dory');
        bubble.setAttribute('draggable', 'true');
        bubble.dataset.type = isNemo ? 'nemo' : 'dory';
        bubble.textContent = isNemo ? 'N' : 'D';

        // Position horizontale aléatoire en haut
        const randomX = Math.random() * (bubblesContainer.clientWidth - 45);
        bubble.style.left = `${randomX}px`;
        bubble.style.top = '0px';

        // Événements de glisser-déposer natifs
        bubble.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', bubble.dataset.type);
            setTimeout(() => bubble.style.opacity = '0.4', 0);
        });

        bubble.addEventListener('dragend', () => {
            bubble.style.opacity = '1';
        });

        bubblesContainer.appendChild(bubble);

        // Nettoyage automatique de la bulle si non attrapée après 5 secondes
        setTimeout(() => {
            if (bubble.parentElement) {
                bubble.remove();
            }
        }, 5000);
    }

    // Gestion des zones cibles (Drop targets)
    fishTargets.forEach(target => {
        target.addEventListener('dragover', (e) => {
            e.preventDefault(); // OBLIGATOIRE : Permet d'autoriser le drop
            target.classList.add('drag-over');
        });

        target.addEventListener('dragleave', () => {
            target.classList.remove('drag-over');
        });

        target.addEventListener('drop', (e) => {
            e.preventDefault();
            target.classList.remove('drag-over');

            const bubbleType = e.dataTransfer.getData('text/plain');
            const targetFish = target.getAttribute('data-fish');

            // Vérification de correspondance (Nemo ou Dory)
            if (bubbleType === targetFish) {
                if (targetFish === 'nemo') {
                    nemoCount++;
                } else if (targetFish === 'dory') {
                    doryCount++;
                }
                updateScores();

                // Suppression de la bulle déposée avec succès
                const activeBubble = bubblesContainer.querySelector(`.bubble[data-type="${bubbleType}"]`);
                if (activeBubble) {
                    activeBubble.remove();
                }
            } else {
                // Mauvaise zone : la bulle retourne à sa position initiale (ici non supprimée)
            }
        });
    });
});
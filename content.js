const processedRows = new Set();
let initialized = false; // Drapeau pour vérifier si initialize a déjà été exécutée

function addButton(row) {
    // Vérifiez si le bouton existe déjà
    if (row.querySelector('.custom-button')) return;

    // Créez le bouton
    const button = document.createElement('button');
    button.className = 'custom-button';
    button.style.marginLeft = '10px';

    // Obtenez le texte du bouton depuis les messages de traduction
    const message = browser.i18n.getMessage('open_button');
    button.textContent = message;

    // Ajoutez un écouteur d'événements
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche les éléments parents d'exécuter leur code
        event.preventDefault();  // Empêche le comportement par défaut

        // Simulez un Shift + Click sur l'élément parent
        const parentElement = row.closest('tr');
        if (parentElement) {
            const shiftClickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                shiftKey: true
            });
            parentElement.dispatchEvent(shiftClickEvent);
        }
    });

    // Ajoutez le bouton à la ligne
    const toolbar = row.querySelector('ul[role="toolbar"][id^=":"]');
    if (toolbar) {
        const li = document.createElement('li');
        li.appendChild(button);
        toolbar.appendChild(li);
    }
}

function processNewRows(rows) {
    rows.forEach(row => {
        if (!processedRows.has(row)) {
            addButton(row);
            processedRows.add(row);
        }
    });
}

// Fonction pour observer les mutations
function observeMutations() {
    const observer = new MutationObserver(mutations => {
        const newRows = new Set();
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches('tr[id^=":"]')) {
                        newRows.add(node);
                    } else {
                        node.querySelectorAll('tr[id^=":"]').forEach(newRow => newRows.add(newRow));
                    }
                }
            });
            if (mutation.type === 'attributes' && mutation.target.matches('tr[id^=":"]')) {
                newRows.add(mutation.target);
            }
        });
        if (newRows.size > 0) {
            processNewRows(Array.from(newRows));
        }
    });

    // Configurer l'observateur pour surveiller les ajouts et les modifications de nœuds
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
}

function initialize() {
    if (initialized) return; // Vérifiez si initialize a déjà été exécutée
    initialized = true; // Marquez initialize comme exécutée

    console.log('[Gmail Quick Open] Loaded content');
    // Ajoutez les boutons aux lignes existantes
    const existingRows = document.querySelectorAll('tr[id^=":"]');
    processNewRows(existingRows);

    // Commencez à observer les mutations
    observeMutations();
}

// Exécutez la fonction après le chargement de la page
window.addEventListener('load', initialize);

// Exécutez la fonction après 5 secondes si l'événement 'load' n'a pas été déclenché
setTimeout(() => {
    if (!initialized) {
        console.log("[Gmail Quick Open] Loaded by timeout");
        initialize();
    }
}, 5000);
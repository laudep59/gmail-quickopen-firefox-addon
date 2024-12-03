// Pour stocker les lignes déjà traitées
const processedRows = new Set();

function addButton(row) {

    // Vérifiez si le bouton existe déjà
    if (row.querySelector('.custom-button')) return;

    // Créez le bouton
    const button = document.createElement('button');
    button.className = 'custom-button';
    button.style.marginLeft = '10px';
    button.style.cursor = 'pointer'; // Ajoutez le curseur de type "main"

    // Obteneir le texte du bouton depuis les messages de traduction
    const message = browser.i18n.getMessage('openButton');
    button.textContent = message;

    // Ajouter un écouteur d'événements
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

// Recherchez les lignes existantes et ajoutez des boutons
function processNewRows(rows) {
    rows.forEach(row => {
        if (!processedRows.has(row)) {
            processedRows.add(row);
            row.addEventListener('mouseover', () => {
                if (!row.querySelector('.custom-button')) {
                    addButton(row);
                }
            });
        }
    });
}

// Fonction pour observer les mutations du dom
function observeMutations() {

    const observer = new MutationObserver(mutations => {
    
        const newRows = new Set();
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {

                    // Vérifier si le nœud ajouté est un div avec role="alert"
                    if (node.matches('div[role="alert"]')) {
                        browser.storage.local.get('hideAlerts').then(result => {
                            if (result.hideAlerts) {
                                node.style.visibility = 'hidden';
                                node.style.setProperty('visibility', 'hidden', 'important');
                            }
                        });
                    }

                    // Un node représentant une ligne / mail
                    if (node.matches('tr[id^=":"]')) {
                        newRows.add(node);
                    } else {
                        node.querySelectorAll('tr[id^=":"]').forEach(newRow => newRows.add(newRow));
                    }

                }
            });

            // En cas de modification d'un attribut
            if (mutation.type === 'attributes' && mutation.target.matches('tr[id^=":"]')) {
                newRows.add(mutation.target);
            }

        });

        // Traitez les nouvelles lignes
        if (newRows.size > 0) {
            processNewRows(Array.from(newRows));
        }

    });

    // Commencez à observer les mutations
    const config = { childList: true, subtree: true, attributes: true };
    observer.observe(document.body, config);
    
}

// Initialisez l'observation des mutations
observeMutations();

// For storing already processed rows
const processedRows = new Set();

function addButton(row) {

    // Check if the row already has a button
    if (row.querySelector('.custom-button')) return;

    // Create a button element
    const button = document.createElement('button');
    button.className = 'custom-button';
    button.style.marginLeft = '10px';
    button.style.cursor = 'pointer'; 

    // Translate the button text
    const message = browser.i18n.getMessage('openButton');
    button.textContent = message;

    // Add a click event listener
    button.addEventListener('click', (event) => {

        event.stopPropagation(); // Prevent the event from bubbling up
        event.preventDefault();  // Prevent the default action

        // Simulate a shift + click event on the row
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

    // Add the button to the toolbar
    const toolbar = row.querySelector('ul[role="toolbar"][id^=":"]');
    if (toolbar) {
        const li = document.createElement('li');
        li.appendChild(button);
        toolbar.appendChild(li);
    }

}

// Find all rows and process them
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

// Function to observe mutations
function observeMutations() {

    const observer = new MutationObserver(mutations => {
    
        const newRows = new Set();
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {

                    // Check if the node is an alert
                    if (node.matches('div[role="alert"]')) {
                        browser.storage.local.get('hideAlerts').then(result => {
                            if (result.hideAlerts) {
                                node.style.visibility = 'hidden';
                                node.style.setProperty('visibility', 'hidden', 'important');
                            }
                        });
                    }

                    // A row containing a mail
                    if (node.matches('tr[id^=":"]')) {
                        newRows.add(node);
                    } else {
                        node.querySelectorAll('tr[id^=":"]').forEach(newRow => newRows.add(newRow));
                    }

                }
            });

            // In case of attribute changes
            if (mutation.type === 'attributes' && mutation.target.matches('tr[id^=":"]')) {
                newRows.add(mutation.target);
            }

        });

        // Handle the new rows
        if (newRows.size > 0) {
            processNewRows(Array.from(newRows));
        }

    });

    // Start observing the body and its subtree for mutations
    const config = { childList: true, subtree: true, attributes: true };
    observer.observe(document.body, config);
    
}

// Initialize mutation observer
observeMutations();

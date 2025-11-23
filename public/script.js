// Step navigation variables
let currentStep = 1;
const totalSteps = 3;

// Application button management - now handled dynamically

// Helper: show add button always (no longer dependent on checked count)
function updateAddAppVisibility() {
    const addButtonContainer = document.getElementById('addAppButtonContainer');
    if (addButtonContainer) {
        addButtonContainer.style.display = 'block';
    }
}

// Helper: show add URL button always (no longer dependent on checked count)
function updateAddUrlVisibility() {
    const addUrlButtonContainer = document.getElementById('addUrlButtonContainer');
    if (addUrlButtonContainer) {
        addUrlButtonContainer.style.display = 'block';
    }
}

// Helper: enforce maximum of 3 checked buttons across ALL buttons
function enforceMaxCheckedButtons() {
    const checkedButtons = getAllCheckedButtons();
    return checkedButtons.length <= 3;
}

// Helper: check if a button can be checked without exceeding the limit
function canCheckButton(excludeId = null) {
    const checkedButtons = getAllCheckedButtons(excludeId);
    return checkedButtons.length < 3;
}

// Helper: get all checked buttons (including dynamic ones)
function getAllCheckedButtons(excludeId = null) {
    const checkedButtons = [];
    
    // Check predefined buttons
    const predefinedButtons = ['usb', 'volume', 'voice', 'signOut'];
    predefinedButtons.forEach(id => {
        if (id !== excludeId) {
            const cb = document.getElementById(`${id}.enabled`);
            if (cb && cb.checked) {
                checkedButtons.push(id);
            }
        }
    });
    
    // Check all custom application buttons (including dynamic ones)
    for (let i = 1; i <= dynamicAppButtonCount; i++) {
        const buttonId = `customApp${i}`;
        if (buttonId !== excludeId) {
            const cb = document.getElementById(`${buttonId}.enabled`);
            if (cb && cb.checked) {
                checkedButtons.push(buttonId);
            }
        }
    }
    
    // Check all custom URL buttons (including dynamic ones)
    for (let i = 1; i <= dynamicUrlButtonCount; i++) {
        const buttonId = `customUrl${i}`;
        if (buttonId !== excludeId) {
            const cb = document.getElementById(`${buttonId}.enabled`);
            if (cb && cb.checked) {
                checkedButtons.push(buttonId);
            }
        }
    }
    
    return checkedButtons;
}

// Helper: check if an application button is empty (no fields filled and not checked)
function isAppButtonEmpty(buttonId) {
    const checkbox = document.getElementById(`${buttonId}.enabled`);
    const position = document.getElementById(`${buttonId}.position`);
    const appId = document.getElementById(`${buttonId}.appId`);
    const tooltipHeader = document.getElementById(`${buttonId}.tooltipHeader`);
    const tooltipText = document.getElementById(`${buttonId}.tooltipText`);
    
    // If checked, not empty
    if (checkbox && checkbox.checked) return false;
    
    // If any field has content, not empty
    if (position && position.value && position.value.trim()) return false;
    if (appId && appId.value && appId.value.trim()) return false;
    if (tooltipHeader && tooltipHeader.value && tooltipHeader.value.trim()) return false;
    if (tooltipText && tooltipText.value && tooltipText.value.trim()) return false;
    
    return true;
}

// Helper: check if a URL button is empty (no fields filled and not checked)
function isUrlButtonEmpty(buttonId) {
    const checkbox = document.getElementById(`${buttonId}.enabled`);
    const position = document.getElementById(`${buttonId}.position`);
    const label = document.getElementById(`${buttonId}.label`);
    const url = document.getElementById(`${buttonId}.url`);
    const tooltipHeader = document.getElementById(`${buttonId}.tooltipHeader`);
    const tooltipText = document.getElementById(`${buttonId}.tooltipText`);
    
    // If checked, not empty
    if (checkbox && checkbox.checked) return false;
    
    // If any field has content, not empty
    if (position && position.value && position.value.trim()) return false;
    if (label && label.value && label.value.trim()) return false;
    if (url && url.value && url.value.trim()) return false;
    if (tooltipHeader && tooltipHeader.value && tooltipHeader.value.trim()) return false;
    if (tooltipText && tooltipText.value && tooltipText.value.trim()) return false;
    
    return true;
}

// Counter for dynamic buttons
let dynamicAppButtonCount = 1; // Start after the built-in 1
let dynamicUrlButtonCount = 1; // Start after the built-in 1

// Function to create a new dynamic application button
function createDynamicApplicationButton() {
    dynamicAppButtonCount++;
    const buttonId = `customApp${dynamicAppButtonCount}`;
    
    // Clone the first application button to use as a template
    const template = document.getElementById('customApp1');
    if (!template) {
        console.error('Could not find application button template');
        return;
    }
    
    const newButton = template.cloneNode(true);
    
    // Update all IDs in the cloned element
    updateElementIds(newButton, 'customApp1', buttonId);
    
    // Insert the new button after the last application button
    const lastAppButton = document.getElementById(`customApp${dynamicAppButtonCount - 1}`);
    if (lastAppButton) {
        lastAppButton.insertAdjacentElement('afterend', newButton);
    } else {
        // Fallback: insert after the template
        template.insertAdjacentElement('afterend', newButton);
    }
    
    // Set up event listeners for the new button
    setupApplicationButtonListeners(buttonId);
    
    updateAddButtonState();
    updateAddAppVisibility();
}

// Function to create a new dynamic URL button
function createDynamicUrlButton() {
    dynamicUrlButtonCount++;
    const buttonId = `customUrl${dynamicUrlButtonCount}`;
    
    // Clone the first URL button to use as a template
    const template = document.getElementById('customUrl1');
    if (!template) {
        console.error('Could not find URL button template');
        return;
    }
    
    const newButton = template.cloneNode(true);
    
    // Update all IDs in the cloned element
    updateElementIds(newButton, 'customUrl1', buttonId);
    
    // Insert the new button after the last URL button
    const lastUrlButton = document.getElementById(`customUrl${dynamicUrlButtonCount - 1}`);
    if (lastUrlButton) {
        lastUrlButton.insertAdjacentElement('afterend', newButton);
    } else {
        // Fallback: insert after the template
        template.insertAdjacentElement('afterend', newButton);
    }
    
    // Set up event listeners for the new button (with a small delay to ensure DOM is updated)
    setTimeout(() => {
        setupUrlButtonListeners(buttonId);
    }, 0);
    
    updateAddButtonState();
    updateAddUrlVisibility();
    updatePositionPreview();
}

// Helper function to update all element IDs within a container and reset state
function updateElementIds(container, oldId, newId) {
    // Update the main container ID
    container.id = newId;

    // Extract the number from the old and new IDs (e.g., "1" from "customUrl1", "2" from "customUrl2")
    const oldNumber = oldId.replace(/\D/g, '');
    const newNumber = newId.replace(/\D/g, '');

    // Find all elements with IDs that start with the old ID
    const elementsToUpdate = container.querySelectorAll(`[id^="${oldId}"]`);
    elementsToUpdate.forEach(element => {
        element.id = element.id.replace(oldId, newId);
    });

    // Also update elements that contain the old number (like testUrl1Btn, viewUrl1Btn)
    const elementsWithNumber = container.querySelectorAll(`[id*="${oldNumber}"]`);
    elementsWithNumber.forEach(element => {
        if (element.id.includes(oldNumber) && !element.id.startsWith(oldId)) {
            element.id = element.id.replace(oldNumber, newNumber);
        }
    });
    
    // Update any labels that reference the old ID
    const labels = container.querySelectorAll(`[for^="${oldId}"]`);
    labels.forEach(label => {
        label.setAttribute('for', label.getAttribute('for').replace(oldId, newId));
    });
    
    // Reset the state of the new button to unchecked/empty
    const checkbox = container.querySelector(`[id$=".enabled"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    // Hide position container and inputs initially
    const positionContainer = container.querySelector(`[id$=".positionContainer"]`);
    if (positionContainer) {
        positionContainer.style.display = 'none';
    }
    
    const inputs = container.querySelector(`[id$=".inputs"]`);
    if (inputs) {
        inputs.style.display = 'none';
    }
    
    // Clear all input values
    const textInputs = container.querySelectorAll('input[type="text"], input[type="url"], textarea');
    textInputs.forEach(input => {
        input.value = '';
    });
    
    const selects = container.querySelectorAll('select');
    selects.forEach(select => {
        select.value = '';
    });
    
    // Reset status indicator for URL buttons
    const statusIndicator = container.querySelector('.url-status-indicator');
    if (statusIndicator) {
        statusIndicator.classList.remove('loading', 'success', 'error');
        statusIndicator.textContent = '';
    }
}

// Function to set up event listeners for a dynamically created application button
function setupApplicationButtonListeners(buttonId) {
    const checkbox = document.getElementById(`${buttonId}.enabled`);
    const positionContainer = document.getElementById(`${buttonId}.positionContainer`);
    const inputs = document.getElementById(`${buttonId}.inputs`);
    const positionSelect = document.getElementById(`${buttonId}.position`);
    const appSelect = document.getElementById(`${buttonId}.appId`);
    
    if (checkbox) {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Check if we can add another checked button
                if (!canCheckButton(buttonId)) {
                    // Prevent checking if we already have 3 checked buttons
                    this.checked = false;
                    alert('You can only have a maximum of 3 buttons checked at once. Please uncheck another button first.');
                    return;
                }
                if (positionContainer) positionContainer.style.display = 'flex';
                if (inputs) inputs.style.display = 'flex';
                updateAddAppVisibility();
                updateAddUrlVisibility();
            } else {
                if (positionContainer) positionContainer.style.display = 'none';
                if (inputs) inputs.style.display = 'none';
                // Reset position selection when unchecked
                if (positionSelect) {
                    positionSelect.value = '';
                    updatePositionPreview();
                    validateUniquePositions();
                }
                updateAddAppVisibility();
                updateAddUrlVisibility();
            }
        });
    }
    
    if (positionSelect) {
        positionSelect.addEventListener('change', updatePositionPreview);
        positionSelect.addEventListener('change', validateUniquePositions);
    }
    
    if (appSelect) {
        appSelect.addEventListener('change', function() {
            updateAppButtonPreview(buttonId);
        });
    }
}

// Function to set up event listeners for a dynamically created URL button
function setupUrlButtonListeners(buttonId) {
    const checkbox = document.getElementById(`${buttonId}.enabled`);
    const inputsContainer = document.querySelector(`#${buttonId} .button-config`);
    const previewContainer = document.querySelector(`#${buttonId} .tooltip-preview`);
    const positionSelector = document.getElementById(`${buttonId}.position`);

    if (checkbox && inputsContainer) {
        const applyState = () => {
            const isChecked = checkbox.checked;
            inputsContainer.style.display = isChecked ? 'block' : 'none';
            updateUrlButtonVisibility(buttonId);
            updateAddUrlVisibility();
            updateAddAppVisibility();
        };

        // Set initial state
        applyState();

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Check if we can add another checked button
                if (!canCheckButton(buttonId)) {
                    // Prevent checking if we already have 3 checked buttons
                    this.checked = false;
                    alert('You can only have a maximum of 3 buttons checked at once. Please uncheck another button first.');
                    return;
                }
            }
            applyState();
            if (!this.checked && positionSelector) {
                positionSelector.value = '';
                updatePositionPreview();
                validateUniquePositions();
            } else {
                updatePositionPreview();
            }
            updateAddAppVisibility();
            updateAddUrlVisibility();
        });
    }
    
    // Add event listeners for URL inputs
    const labelInput = document.getElementById(`${buttonId}.label`);
    const tooltipHeaderInput = document.getElementById(`${buttonId}.tooltipHeader`);
    const tooltipTextInput = document.getElementById(`${buttonId}.tooltipText`);

    if (labelInput) {
        labelInput.addEventListener('input', () => {
            updateUrlButtonPreview(buttonId);
        });
    }
    if (tooltipHeaderInput) {
        tooltipHeaderInput.addEventListener('input', () => {
            updateUrlButtonPreview(buttonId);
        });
    }
    if (tooltipTextInput) {
        tooltipTextInput.addEventListener('input', () => {
            updateUrlButtonPreview(buttonId);
        });
    }
    
    if (positionSelector) {
        positionSelector.addEventListener('change', updatePositionPreview);
        positionSelector.addEventListener('change', validateUniquePositions);
    }
    
    // Add event listeners for test and view URL buttons
    const testUrlBtnId = `testUrl${buttonId.replace('customUrl','')}Btn`;
    const viewUrlBtnId = `viewUrl${buttonId.replace('customUrl','')}Btn`;
    const testUrlBtn = document.getElementById(testUrlBtnId);
    const viewUrlBtn = document.getElementById(viewUrlBtnId);
    
    console.log(`Setting up buttons for ${buttonId}:`, {
        testUrlBtnId,
        viewUrlBtnId,
        testUrlBtn,
        viewUrlBtn
    });
    
    if (testUrlBtn) {
        testUrlBtn.addEventListener('click', function() {
            console.log(`Test URL clicked for ${buttonId}`);
            testURLStatus(`${buttonId}.url`);
        });
    } else {
        console.warn(`Test URL button not found: ${testUrlBtnId}`);
    }
    
    if (viewUrlBtn) {
        viewUrlBtn.addEventListener('click', function() {
            console.log(`View URL clicked for ${buttonId}`);
            viewURL(`${buttonId}.url`);
        });
    } else {
        console.warn(`View URL button not found: ${viewUrlBtnId}`);
    }
}

function addApplicationButton() {
    // First, check if any visible application buttons are empty
    for (let i = 1; i <= dynamicAppButtonCount; i++) {
        const buttonId = `customApp${i}`;
        const button = document.getElementById(buttonId);
        if (button && isAppButtonEmpty(buttonId)) {
            alert(`Please fill in the empty Application Button ${i} before adding a new one.`);
            return;
        }
    }
    
    // All existing buttons have content, create a new dynamic button
    createDynamicApplicationButton();
}

function addUrlButton() {
    // First, check if any visible URL buttons are empty
    for (let i = 1; i <= dynamicUrlButtonCount; i++) {
        const buttonId = `customUrl${i}`;
        const button = document.getElementById(buttonId);
        if (button && isUrlButtonEmpty(buttonId)) {
            alert(`Please fill in the empty URL Button ${i} before adding a new one.`);
            return;
        }
    }
    
    // All existing buttons have content, create a new dynamic button
    createDynamicUrlButton();
}


function updateAddButtonState() {
    // Add buttons are always enabled with the new logic
    const addButton = document.getElementById('addAppButton');
    if (addButton) {
        addButton.disabled = false;
        addButton.textContent = '+ Add Another Application Button';
    }

    // URL add button is always enabled
    const addUrlBtn = document.getElementById('addUrlButton');
    if (addUrlBtn) {
        addUrlBtn.disabled = false;
        addUrlBtn.textContent = '+ Add Another URL Button';
    }
}

// Function to update settings summary
function updateSettingsSummary() {
    const summaryContent = document.getElementById('settingsSummary');
    if (!summaryContent) return;

    // Clear existing content
    summaryContent.replaceChildren();

    // Helper function to create a setting row with edit button
    function createSettingRow(label, value, stepNumber = null, elementId = null, position = null) {
        // Add edit button first (or empty div if no button)
        if (stepNumber && elementId) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-setting-btn';
            editButton.style.cssText = `
                background-color: var(--primary-color);
                color: white;
                border: none;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                cursor: pointer;
                transition: background-color 0.2s ease;
                white-space: nowrap;
            `;
            editButton.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#2c5282';
            });
            editButton.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'var(--primary-color)';
            });
            editButton.addEventListener('click', function() {
                navigateToSetting(stepNumber, elementId);
            });
            summaryContent.appendChild(editButton);
        } else {
            // Add empty div to maintain grid alignment when no edit button
            const emptyDiv = document.createElement('div');
            summaryContent.appendChild(emptyDiv);
        }
        
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.style.marginTop = '0.5rem';
        
        if (position) {
            // Format label with position in round brackets for PDF
            labelDiv.textContent = `${label} (Position ${position})`;
        } else {
            labelDiv.textContent = label;
        }

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        valueDiv.textContent = value;
        
        summaryContent.appendChild(labelDiv);
        summaryContent.appendChild(valueDiv);
    }

    // Basic settings
    createSettingRow('Organization Name', document.getElementById('organizationName').value || 'Not set', 1, 'organizationName');
    createSettingRow('Site ID', document.getElementById('telemetry.siteId').value || 'Not set', 1, 'telemetry.siteId');

    // Features
    createSettingRow('Open Morphic Automatically at Login', 
        document.getElementById('features.autorunAfterLogin.enabled').checked ? 'True' : 'False', 1, 'features.autorunAfterLogin.enabled');
    createSettingRow('See Which Accessibility Features are Helpful', 
        document.getElementById('features.atUseCounter.enabled').checked ? 'True' : 'False', 1, 'features.atUseCounter.enabled');
    createSettingRow('Delay Showing Morphic to Compare Before & After', 
        document.getElementById('enableDelayMorphic').checked ? 'True' : 'False', 1, 'enableDelayMorphic');
    if (document.getElementById('enableDelayMorphic').checked) {
        createSettingRow('Show Morphic Bar On', 
            document.getElementById('hideMorphicAfterLoginUntil').value || 'Not set', 1, 'hideMorphicAfterLoginUntil');
    }
    // AT-on-Demand feature temporarily commented out
    // createSettingRow('Enable AT-on-Demand (Available for Windows Only)', 
    //     document.getElementById('features.atOnDemand.enabled').checked ? 'True' : 'False', 1, 'features.atOnDemand.enabled');
    
    // Separator before Default Settings section
    const defaultSettingsSeparator = document.createElement('hr');
    defaultSettingsSeparator.style.cssText = 'margin: 20px 0; border: none; border-top: 2px solid #e2e8f0; grid-column: 1 / -1;';
    summaryContent.appendChild(defaultSettingsSeparator);
    
    // Default Settings section
    createSettingRow('Enable Custom MorphicBars', 
        document.getElementById('features.customMorphicBars.enabled').checked ? 'True' : 'False', 1, 'features.customMorphicBars.enabled');
    createSettingRow('Enable Check for Updates with each Launch', 
        document.getElementById('features.checkForUpdates.enabled').checked ? 'True' : 'False', 1, 'features.checkForUpdates.enabled');
    createSettingRow('MorphicBar Visibility after Login', 
        document.getElementById('morphicBar.visibilityAfterLogin').value, 1, 'morphicBar.visibilityAfterLogin');
    createSettingRow('MorphicBar Default Location', 
        document.getElementById('morphicBar.defaultLocation').value, 1, 'morphicBar.defaultLocation');
    createSettingRow('Reset 5 Windows Settings to Default', 
        document.getElementById('features.resetSettings.enabled').checked ? 'True' : 'False', 1, 'features.resetSettings.enabled');

    // Custom buttons (for summary display - keep position info)
    const customButtons = collectPredefinedButtonsForSummary();

    // Separate different button types
    const predefinedButtons = customButtons.filter(button => button.type === 'control' || button.type === 'action');
    const applicationButtons = customButtons.filter(button => button.type === 'application');
    const urlButtons = customButtons.filter(button => button.type === 'link');

    // Add section separator before custom buttons
    if (customButtons.length > 0) {
        const customButtonsSeparator = document.createElement('hr');
        customButtonsSeparator.style.cssText = 'margin: 20px 0; border: none; border-top: 2px solid #e2e8f0; grid-column: 1 / -1;';
        summaryContent.appendChild(customButtonsSeparator);
    }

    // Display predefined buttons first (USB, Volume, Voice, Sign Out)
    predefinedButtons.forEach((button, index) => {
        // Add separator before each button except the first one (section separator already added)
        if (index > 0) {
            const hr = document.createElement('hr');
            hr.style.cssText = 'margin: 15px 0; border: none; border-top: 1px solid #ddd; grid-column: 1 / -1;';
            summaryContent.appendChild(hr);
        }
        
        // Map button features to display names and element IDs
        const buttonMapping = {
            'usbopeneject': { name: 'USB Open/Eject', elementId: 'usb.enabled' },
            'volume': { name: 'Volume Control', elementId: 'volume.enabled' },
            'voice': { name: 'Voice Control', elementId: 'voice.enabled' },
            'signout': { name: 'Sign Out', elementId: 'signOut.enabled' }
        };
        
        const mapping = buttonMapping[button.feature] || { name: button.feature, elementId: `${button.feature}.enabled` };
        createSettingRow(`${mapping.name}`, 'Enabled', 2, mapping.elementId, button.position);
    });

    // Display application buttons
    applicationButtons.forEach((button, index) => {
        // Add separator before each button (skip first if no predefined buttons)
        if (predefinedButtons.length > 0 || index > 0) {
            const hr = document.createElement('hr');
            hr.style.cssText = 'margin: 15px 0; border: none; border-top: 1px solid #ddd; grid-column: 1 / -1;';
            summaryContent.appendChild(hr);
        }
        
        createSettingRow(`Custom Application ${index + 1}`, button.label || 'Not set', 2, `customApp${index + 1}.enabled`, button.position);
    });

    // Display URL buttons
    urlButtons.forEach((button, index) => {
        // Add separator before each URL button (skip first if it's the very first custom button)
        if (predefinedButtons.length > 0 || applicationButtons.length > 0 || index > 0) {
            const hr = document.createElement('hr');
            hr.style.cssText = 'margin: 15px 0; border: none; border-top: 1px solid #ddd; grid-column: 1 / -1;';
            summaryContent.appendChild(hr);
        }
        
        // Edit button first
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-setting-btn';
        editButton.addEventListener('click', function() {
            navigateToSetting(2, `customUrl${index + 1}.enabled`);
        });
        summaryContent.appendChild(editButton);
        
        // Create header with position
        const headerDiv = document.createElement('div');
        headerDiv.className = 'label';
        headerDiv.style.fontWeight = '700';
        headerDiv.textContent = `Custom URL button #${index + 1} (Position ${button.position})`;
        
        summaryContent.appendChild(headerDiv);
        
        // Empty value column
        const emptyValueDiv = document.createElement('div');
        emptyValueDiv.className = 'value';
        summaryContent.appendChild(emptyValueDiv);
        
        // Create indented sub-items
        function createSubItem(label, value) {
            const emptyDiv = document.createElement('div');
            summaryContent.appendChild(emptyDiv);
            
            const subLabelDiv = document.createElement('div');
            subLabelDiv.className = 'label';
            subLabelDiv.style.paddingLeft = '2rem';
            subLabelDiv.style.fontWeight = 'normal';
            subLabelDiv.textContent = label;
            summaryContent.appendChild(subLabelDiv);
            
            const subValueDiv = document.createElement('div');
            subValueDiv.className = 'value';
            subValueDiv.textContent = value;
            summaryContent.appendChild(subValueDiv);
        }
        
        createSubItem('Button text', button.label || 'Not set');
        createSubItem('Tooltip header', button.tooltipHeader || 'Not set');
        createSubItem('Tooltip Help', button.tooltipText || 'Not set');
        createSubItem('URL', button.url || 'Not set');
    });
}

// Function to navigate to a specific setting
function navigateToSetting(stepNumber, elementId) {
    // Navigate to the appropriate step
    showStep(stepNumber);
    
    // Scroll to the element after a short delay to ensure the step is visible
    setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Add a temporary highlight to draw attention
            element.style.transition = 'background-color 0.3s ease';
            element.style.backgroundColor = '#fff3cd';
            
            // Remove highlight after 2 seconds
            setTimeout(() => {
                element.style.backgroundColor = '';
            }, 2000);
        }
    }, 100);
}

// Step navigation functions
function showStep(stepNumber) {
    // Hide all step contents
    document.querySelectorAll('.step-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });

    // Show current step
    const currentStepContent = document.getElementById(`step${stepNumber}`);
    if (currentStepContent) {
        currentStepContent.style.display = 'block';
        currentStepContent.classList.add('active');
    }

    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum === stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });

    // Clear any existing step errors when switching steps
    clearStepErrors(stepNumber);

    // Update settings summary when showing step 3
    if (stepNumber === 3) {
        updateSettingsSummary();
        
        // Ensure download button event listener is attached when step 3 is shown
        const downloadBtn = document.getElementById('download');
        if (downloadBtn && !downloadBtn.hasAttribute('data-listener-attached')) {
            downloadBtn.addEventListener('click', handleDownloadClick);
            downloadBtn.setAttribute('data-listener-attached', 'true');
            console.log('Download button event listener attached when step 3 shown');
        }
    }

    currentStep = stepNumber;

    // Scroll to top of page when navigating to a step
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync URL hash for deep linking
    try {
        const stepToHash = { 1: '#configure', 2: '#customize-buttons', 3: '#review-and-download' };
        const desiredHash = stepToHash[stepNumber] || '';
        if (window.location.hash !== desiredHash) {
            // Use replaceState to avoid cluttering history for internal step changes
            const newUrl = desiredHash ? `${window.location.pathname}${desiredHash}` : window.location.pathname;
            window.history.replaceState(null, '', newUrl);
        }
    } catch (e) {
        console.warn('Failed to update URL hash for step navigation', e);
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        // Check for errors in the current step before proceeding
        if (checkStepErrors(currentStep)) {
            // showStep will sync hash
            showStep(currentStep + 1);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        // showStep will sync hash
        showStep(currentStep - 1);
    }
}

// Default values for form fields
const defaultValues = {
    step1: {
        'organizationName': '',
        'telemetry.siteId': '',
        'features.autorunAfterLogin.enabled': true,
        'features.autorunAfterLogin.scope': 'allLocalUsers',
        'features.atUseCounter.enabled': true,
        'enableDelayMorphic': false,
        'hideMorphicAfterLoginUntil': '',
        // 'features.atOnDemand.enabled': false, // AT-on-Demand feature temporarily commented out
        'features.customMorphicBars.enabled': true,
        'features.checkForUpdates.enabled': false,
        'morphicBar.visibilityAfterLogin': 'show',
        'morphicBar.defaultLocation': 'bottomTrailing',
        'features.resetSettings.enabled': false
    }
};

// Show clear confirmation modal
function showClearModal() {
    const modal = document.getElementById('clearModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// Hide clear confirmation modal
function hideClearModal() {
    const modal = document.getElementById('clearModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Clear step 1 - Configure
function clearStep1() {
    const defaults = defaultValues.step1;

    // Clear text inputs
    document.getElementById('organizationName').value = defaults['organizationName'];
    document.getElementById('telemetry.siteId').value = defaults['telemetry.siteId'];
    document.getElementById('hideMorphicAfterLoginUntil').value = defaults['hideMorphicAfterLoginUntil'];

    // Reset checkboxes
    document.getElementById('features.autorunAfterLogin.enabled').checked = defaults['features.autorunAfterLogin.enabled'];
    document.getElementById('features.atUseCounter.enabled').checked = defaults['features.atUseCounter.enabled'];
    document.getElementById('enableDelayMorphic').checked = defaults['enableDelayMorphic'];
    // document.getElementById('features.atOnDemand.enabled').checked = defaults['features.atOnDemand.enabled']; // AT-on-Demand feature temporarily commented out
    document.getElementById('features.customMorphicBars.enabled').checked = defaults['features.customMorphicBars.enabled'];
    document.getElementById('features.checkForUpdates.enabled').checked = defaults['features.checkForUpdates.enabled'];
    document.getElementById('features.resetSettings.enabled').checked = defaults['features.resetSettings.enabled'];

    // Reset selects
    document.getElementById('features.autorunAfterLogin.scope').value = defaults['features.autorunAfterLogin.scope'];
    document.getElementById('morphicBar.visibilityAfterLogin').value = defaults['morphicBar.visibilityAfterLogin'];
    document.getElementById('morphicBar.defaultLocation').value = defaults['morphicBar.defaultLocation'];

    // Clear error messages
    document.getElementById('organizationNameError').style.display = 'none';
    document.getElementById('siteIdError').style.display = 'none';
    document.getElementById('organizationName').classList.remove('error');
    document.getElementById('telemetry.siteId').classList.remove('error');

    // Trigger dependent field updates
    toggleScopeAccess();
    toggleDelayMorphicAccess();
}

// Clear step 2 - Customize
function clearStep2() {
    // Uncheck all predefined buttons
    const predefinedButtons = ['usb', 'volume', 'voice', 'signOut'];
    predefinedButtons.forEach(id => {
        const checkbox = document.getElementById(`${id}.enabled`);
        if (checkbox) {
            checkbox.checked = false;
            // Hide position selector
            const posContainer = document.getElementById(`${id}.positionContainer`);
            if (posContainer) {
                posContainer.style.display = 'none';
            }
            // Reset position
            const posSelect = document.getElementById(`${id}.position`);
            if (posSelect) {
                posSelect.value = '';
            }
        }
    });

    // Clear custom application buttons
    for (let i = 1; i <= dynamicAppButtonCount; i++) {
        const buttonId = `customApp${i}`;
        const checkbox = document.getElementById(`${buttonId}.enabled`);
        const position = document.getElementById(`${buttonId}.position`);
        const appId = document.getElementById(`${buttonId}.appId`);
        const inputs = document.getElementById(`${buttonId}.inputs`);

        if (checkbox) checkbox.checked = false;
        if (position) position.value = '';
        if (appId) appId.value = '';
        if (inputs) inputs.style.display = 'none';

        // Update preview
        const preview = document.getElementById(`${buttonId}Preview`);
        if (preview) {
            const span = preview.querySelector('span');
            if (span) span.textContent = 'Custom\nApp';
        }
    }

    // Clear custom URL buttons
    for (let i = 1; i <= dynamicUrlButtonCount; i++) {
        const buttonId = `customUrl${i}`;
        const checkbox = document.getElementById(`${buttonId}.enabled`);
        const position = document.getElementById(`${buttonId}.position`);
        const label = document.getElementById(`${buttonId}.label`);
        const url = document.getElementById(`${buttonId}.url`);
        const tooltipHeader = document.getElementById(`${buttonId}.tooltipHeader`);
        const tooltipText = document.getElementById(`${buttonId}.tooltipText`);

        if (checkbox) {
            checkbox.checked = false;
            // Update dependent visibility
            const tooltipPreview = checkbox.closest('.predefined-button')?.querySelector('.tooltip-preview');
            if (tooltipPreview) tooltipPreview.style.display = 'none';
        }
        if (position) position.value = '';
        if (label) label.value = '';
        if (url) url.value = '';
        if (tooltipHeader) tooltipHeader.value = '';
        if (tooltipText) tooltipText.value = '';

        // Clear URL status indicator
        const statusIndicator = document.getElementById(`${buttonId}Status`);
        if (statusIndicator) {
            statusIndicator.className = 'url-status-indicator';
            statusIndicator.textContent = '';
        }

        // Update preview elements
        const previewLabel = document.getElementById(`${buttonId}Label`);
        if (previewLabel) previewLabel.textContent = 'Button\nText';

        const configPreviewLabel = document.getElementById(`${buttonId}ConfigLabel`);
        if (configPreviewLabel) configPreviewLabel.textContent = 'Button\nText';

        const tooltipHeaderPreview = document.getElementById(`${buttonId}TooltipHeaderPreview`);
        if (tooltipHeaderPreview) tooltipHeaderPreview.textContent = 'Header text';

        const tooltipTextPreview = document.getElementById(`${buttonId}TooltipTextPreview`);
        if (tooltipTextPreview) tooltipTextPreview.textContent = 'Description text';
    }

    // Update MorphicBar preview
    updatePositionPreview();
}

// Main clear function
function clearStep() {
    showClearModal();
}

// Execute clear based on current step
function executeClear() {
    console.log('Clearing step:', currentStep);

    switch(currentStep) {
        case 1:
            clearStep1();
            break;
        case 2:
            clearStep2();
            break;
        case 3:
            // Step 3 is download/summary, no clear needed
            console.log('Step 3 has no clearable fields');
            break;
        default:
            console.log('Unknown step');
    }

    hideClearModal();
}

// Allow clicking on step indicators to navigate
function initStepNavigation() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.addEventListener('click', () => {
            // showStep will sync hash
            showStep(index + 1);
        });
    });
}

// Initialize event listeners based on current page
document.addEventListener('DOMContentLoaded', function() {
    // Common file handling setup
    const isConfigBuilder = window.location.pathname.includes('config-builder.html');
    
    if (isConfigBuilder) {
        // Initialize step navigation
        initStepNavigation();
        // Determine initial step from hash if present
        const hashToStep = { '#configure': 1, '#customize-buttons': 2, '#review-and-download': 3 };
        const initialStep = hashToStep[window.location.hash] || 1;
        showStep(initialStep);

        // Respond to hash changes (e.g., user edits URL or navigates via back/forward)
        window.addEventListener('hashchange', () => {
            const stepFromHash = hashToStep[window.location.hash];
            if (stepFromHash) {
                showStep(stepFromHash);
            }
        });
        // Config Builder page setup
        document.getElementById('upload')?.addEventListener('change', handleFileUpload);
        
        // Debug: Check if download button exists when page loads
        const downloadBtn = document.getElementById('download');
        console.log('Download button found on page load:', downloadBtn);
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', handleDownloadClick);
            console.log('Download button event listener attached');
        } else {
            console.error('Download button not found on page load!');
        }
        
        document.getElementById('fileInputBtn')?.addEventListener('click', function() {
            document.getElementById('upload').click();
        });

        // Check for stored config data
        const storedConfig = localStorage.getItem('pendingConfig');
        if (storedConfig) {
            try {
                const config = JSON.parse(storedConfig);
                populateUI(config);
                // Clear stored config after loading
                localStorage.removeItem('pendingConfig');
            } catch (error) {
                console.error('Error loading stored config:', error);
            }
        }

        // Toggle help text functionality
        const toggleHelpTextBtn = document.getElementById('toggleHelpText');
        if (toggleHelpTextBtn) {
            let helpTextVisible = true;
            toggleHelpTextBtn.addEventListener('click', function() {
                const smallTextElements = document.querySelectorAll('.small-text');
                helpTextVisible = !helpTextVisible;

                smallTextElements.forEach(element => {
                    element.style.display = helpTextVisible ? '' : 'none';
                });

                this.textContent = helpTextVisible ? 'Hide help text' : 'Show help text';
            });
        }

        // Setup navigation button event listeners
        document.querySelectorAll('.prev-btn').forEach(btn => {
            btn.addEventListener('click', prevStep);
        });

        document.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', nextStep);
        });

        document.querySelectorAll('.clear-btn').forEach(btn => {
            btn.addEventListener('click', clearStep);
        });

        // Setup modal event listeners
        const modal = document.getElementById('clearModal');
        const cancelBtn = modal?.querySelector('.modal-btn-cancel');
        const confirmBtn = modal?.querySelector('.modal-btn-confirm');

        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideClearModal);
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', executeClear);
        }

        // Close modal when clicking outside of it
        if (modal) {
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    hideClearModal();
                }
            });
        }
    } else {
        // Index page setup
        document.getElementById('createNewBtn')?.addEventListener('click', function() {
            window.location.href = 'config-builder.html';
        });
        
        document.getElementById('importSettingsBtn')?.addEventListener('click', function() {
            document.getElementById('configFileInput').click();
        });
        
        document.getElementById('configFileInput')?.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    // Parse the config file
                    const config = JSON.parse(e.target.result);
                    // Store the config in localStorage
                    localStorage.setItem('pendingConfig', JSON.stringify(config));
                    // Navigate to config builder page
                    window.location.href = 'config-builder.html';
                } catch (error) {
                    console.error('JSON Parse Error:', error);
                    alert(`Invalid JSON file: ${error.message}\n\nPlease check that your file contains valid JSON format.`);
                }
            };
            reader.readAsText(file);
        });
    }

    // Only add these event listeners if the elements exist
    ['visibility-toggle', 'location-toggle'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                toggleDescription(id.split('-')[0]);
            });
        }
    });
});

// See more/less toggle handlers
document.getElementById('visibility-toggle')?.addEventListener('click', function(e) {
    e.preventDefault();
    toggleDescription('visibility');
});

document.getElementById('location-toggle')?.addEventListener('click', function(e) {
    e.preventDefault();
    toggleDescription('location');
});

// Test URL button handlers (only for customUrl1, others are dynamic)
document.getElementById('testUrl1Btn')?.addEventListener('click', function() {
    testURLStatus('customUrl1.url');
});

// View URL button handlers (only for customUrl1, others are dynamic)
document.getElementById('viewUrl1Btn')?.addEventListener('click', function() {
    viewURL('customUrl1.url');
});

// AT-on-Demand feature temporarily commented out
// const checkbox = document.getElementById('features.atOnDemand.enabled');
// checkbox.indeterminate = true;


// This controls the access to dependent options (scope and reset settings)
document.getElementById('features.autorunAfterLogin.enabled').addEventListener('change', toggleScopeAccess);

// This controls the access to the delay morphic date field
document.getElementById('enableDelayMorphic').addEventListener('change', toggleDelayMorphicAccess);


// Function to enable/disable the scope dropdown and reset settings
function toggleScopeAccess() {
    const autorunEnabled = document.getElementById('features.autorunAfterLogin.enabled').checked;
    const scopeSelect = document.getElementById('features.autorunAfterLogin.scope');
    const scopeLabel = document.getElementById('features.autorunAfterLogin.scope.label');

    if (autorunEnabled) {
        // Enable dependent options when autorun is enabled
        scopeSelect.disabled = false;
        scopeLabel.disabled = false;
        // Remove visual styling for disabled state
        scopeSelect.style.opacity = '1';
        scopeLabel.style.opacity = '1';
        scopeSelect.style.cursor = 'pointer';
    }
    else {
        // Disable dependent options when autorun is disabled
        scopeSelect.disabled = true;
        scopeLabel.disabled = true;
        // Set default values when disabled
        scopeSelect.value = 'allLocalUsers';

        // Add visual styling to indicate disabled state
        scopeSelect.style.opacity = '0.6';
        scopeLabel.style.opacity = '0.6';
        scopeSelect.style.cursor = 'not-allowed';
    }
}

// Function to enable/disable the delay morphic date field
function toggleDelayMorphicAccess() {
    const delayEnabled = document.getElementById('enableDelayMorphic').checked;
    const dateInput = document.getElementById('hideMorphicAfterLoginUntil');
    const dateLabel = document.getElementById('delayMorphicDateLabel');
    const telemetryCheckbox = document.getElementById('features.atUseCounter.enabled');

    if (delayEnabled) {
        // Enable date input when delay is enabled
        dateInput.disabled = false;
        dateLabel.style.opacity = '1';
        dateInput.style.opacity = '1';
        dateInput.style.cursor = 'pointer';

        // Force enable telemetry and prevent unchecking
        telemetryCheckbox.checked = true;

        // Remove previous event listener if exists (to avoid duplicates)
        telemetryCheckbox.removeEventListener('click', preventUnchecking);

        // Add event listener to prevent unchecking
        telemetryCheckbox.addEventListener('click', preventUnchecking);

        // Visual indication that it can't be unchecked without disabling it
        telemetryCheckbox.style.cursor = 'not-allowed';
    } else {
        // Disable date input when delay is disabled
        dateInput.disabled = true;
        dateInput.value = '';

        // Add visual styling to indicate disabled state
        dateLabel.style.opacity = '0.6';
        dateInput.style.opacity = '0.6';
        dateInput.style.cursor = 'not-allowed';

        // Remove the event listener so checkbox can be changed again
        telemetryCheckbox.removeEventListener('click', preventUnchecking);
        telemetryCheckbox.style.cursor = 'pointer';
    }
}

// Function to prevent unchecking the telemetry checkbox
function preventUnchecking(event) {
    // Prevent the default action
    event.preventDefault();
    // Keep the checkbox checked
    this.checked = true;

    // Optional: Show a message explaining why it can't be unchecked
    const message = "Telemetry is required when 'Delay Morphic Appearance' is enabled.";
    alert(message);
}

// Function to toggle description visibility (for "see more" functionality)
function toggleDescription(descriptionId) {
    const shortSpan = document.getElementById(`${descriptionId}-short`);
    const fullSpan = document.getElementById(`${descriptionId}-full`);
    const toggleLink = document.getElementById(`${descriptionId}-toggle`);

    if (fullSpan.style.display === 'none') {
        // Show full description
        shortSpan.style.display = 'none';
        fullSpan.style.display = 'inline';
        toggleLink.textContent = 'See less';
    } else {
        // Show short description
        shortSpan.style.display = 'inline';
        fullSpan.style.display = 'none';
        toggleLink.textContent = 'See more';
    }
}

// Function to reset validation state when form inputs change
function resetValidationState() {
    // No longer need to manage download button state since it's always enabled
}

// Set initial state when page loads
window.addEventListener('load', function () {
    toggleScopeAccess();
    toggleDelayMorphicAccess();
    updatePositionPreview();

    // Add change listeners to reset validation and update summary when inputs change
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', () => {
            resetValidationState();
            if (currentStep === 3) {
                updateSettingsSummary();
            }
        });
        input.addEventListener('input', () => {
            resetValidationState();
            if (currentStep === 3) {
                updateSettingsSummary();
            }
        });
    });
});

// Dynamically validate Site ID as user types
document.getElementById('telemetry.siteId').addEventListener('input', validateSiteId);

// Dynamically validate Organization Name as user types
document.getElementById('organizationName').addEventListener('input', validateOrganizationName);

    // Add event listeners for position dropdowns to update preview
    document.addEventListener('DOMContentLoaded', function () {
        const positionSelects = ['usb.position', 'volume.position', 'voice.position', 'customUrl1.position', 'customApp1.position', 'signOut.position'];

        positionSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.addEventListener('change', updatePositionPreview);
                select.addEventListener('change', validateUniquePositions);
            }
        });

        // Add event listeners for predefined button checkboxes
        const predefinedButtons = ['usb', 'volume', 'voice', 'signOut'];
        predefinedButtons.forEach(buttonId => {
            const checkbox = document.getElementById(`${buttonId}.enabled`);
            const positionContainer = document.getElementById(`${buttonId}.positionContainer`);
            
            if (checkbox && positionContainer) {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        // Check if we can add another checked button
                        if (!canCheckButton(buttonId)) {
                            // Prevent checking if we already have 3 checked buttons
                            this.checked = false;
                            alert('You can only have a maximum of 3 buttons checked at once. Please uncheck another button first.');
                            return;
                        }
                        positionContainer.style.display = 'flex';
                        updateAddAppVisibility();
                        updateAddUrlVisibility();
                    } else {
                        positionContainer.style.display = 'none';
                        // Reset position selection when unchecked
                        const positionSelect = document.getElementById(`${buttonId}.position`);
                        if (positionSelect) {
                            positionSelect.value = '';
                            updatePositionPreview();
                            validateUniquePositions();
                        }
                        updateAddAppVisibility();
                        updateAddUrlVisibility();
                    }
                });
            }
        });

        // Add event listeners for application button checkboxes
        const appButtonIds = ['customApp1'];
        const addButtonContainer = document.getElementById('addAppButtonContainer');
        const addButton = document.getElementById('addAppButton');

        
        appButtonIds.forEach(buttonId => {
            const checkbox = document.getElementById(`${buttonId}.enabled`);
            const positionContainer = document.getElementById(`${buttonId}.positionContainer`);
            const inputs = document.getElementById(`${buttonId}.inputs`);
            const positionSelect = document.getElementById(`${buttonId}.position`);
            const appSelect = document.getElementById(`${buttonId}.appId`);
            
            if (checkbox) {
                // Set initial visibility based on current state
                (function initAppButtonVisibility() {
                    if (checkbox.checked) {
                        if (positionContainer) positionContainer.style.display = 'flex';
                        if (inputs) inputs.style.display = 'flex';
                        updateAddAppVisibility();
                    } else {
                        if (positionContainer) positionContainer.style.display = 'none';
                        if (inputs) inputs.style.display = 'none';
                        updateAddAppVisibility();
                    }
                })();

                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        // Check if we can add another checked button
                        if (!canCheckButton(buttonId)) {
                            // Prevent checking if we already have 3 checked buttons
                            this.checked = false;
                            alert('You can only have a maximum of 3 buttons checked at once. Please uncheck another button first.');
                            return;
                        }
                        if (positionContainer) positionContainer.style.display = 'flex';
                        if (inputs) inputs.style.display = 'flex';
                        updateAddAppVisibility();
                        updateAddUrlVisibility();
                    } else {
                        if (positionContainer) positionContainer.style.display = 'none';
                        if (inputs) inputs.style.display = 'none';
                        // Reset position selection when unchecked
                        if (positionSelect) {
                            positionSelect.value = '';
                            updatePositionPreview();
                            validateUniquePositions();
                        }
                        // Update visibility when app is unchecked
                        updateAddAppVisibility();
                        updateAddUrlVisibility();
                    }
                });
            }
            
            if (positionSelect) {
                positionSelect.addEventListener('change', updatePositionPreview);
                positionSelect.addEventListener('change', validateUniquePositions);
            }
            
            if (appSelect) {
                appSelect.addEventListener('change', function() {
                    updateAppButtonPreview(buttonId);
                });
            }
        });

        // Ensure initial visibility reflects current state
        // No need to hide buttons 2 and 3 anymore since we removed them
        
        // Show the add button containers initially (they're always visible now)
        const addAppContainer = document.getElementById('addAppButtonContainer');
        const addUrlContainer = document.getElementById('addUrlButtonContainer');
        if (addAppContainer) {
            addAppContainer.style.display = 'block';
        }
        if (addUrlContainer) {
            addUrlContainer.style.display = 'block';
        }
        
        // Then update add button visibility based on current checkbox states
        updateAddAppVisibility();
        updateAddUrlVisibility();

        // Add button functionality
        if (addButton) {
            addButton.addEventListener('click', addApplicationButton);
        }

        // URL buttons add functionality
        const addUrlButtonElement = document.getElementById('addUrlButton');
        if (addUrlButtonElement) {
            addUrlButtonElement.addEventListener('click', addUrlButton);
        }

        // Add event listeners for URL button enable checkboxes (toggle inputs/preview only)
        const urlButtonIds = ['customUrl1'];
        const addUrlButtonContainer = document.getElementById('addUrlButtonContainer');
        urlButtonIds.forEach(buttonId => {
            const checkbox = document.getElementById(`${buttonId}.enabled`);
            const inputsContainer = document.querySelector(`#${buttonId} .button-config`);
            const previewContainer = document.querySelector(`#${buttonId} .tooltip-preview`);
            const positionSelector = document.getElementById(`${buttonId}.position`);

            if (checkbox && inputsContainer) {
                // Initial state: unchecked => hide inputs, keep heading/description visible
                const applyState = () => {
                    const isChecked = checkbox.checked;
                    inputsContainer.style.display = isChecked ? 'block' : 'none';
                    updateUrlButtonVisibility(buttonId);
                    updateAddUrlVisibility();
                    updateAddAppVisibility();
                };

                // Set initial
                applyState();

                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        // Check if we can add another checked button
                        if (!canCheckButton(buttonId)) {
                            // Prevent checking if we already have 3 checked buttons
                            this.checked = false;
                            alert('You can only have a maximum of 3 buttons checked at once. Please uncheck another button first.');
                            return;
                        }
                    }
                    applyState();
                    if (!this.checked && positionSelector) {
                        positionSelector.value = '';
                        updatePositionPreview();
                        validateUniquePositions();
                    } else {
                        updatePositionPreview();
                    }
                    updateAddAppVisibility();
                    updateAddUrlVisibility();
                });
                
                // Add event listeners for test and view URL buttons
                const testUrlBtn = document.getElementById(`testUrl${buttonId.replace('customUrl','')}Btn`);
                const viewUrlBtn = document.getElementById(`viewUrl${buttonId.replace('customUrl','')}Btn`);
                
                if (testUrlBtn) {
                    testUrlBtn.addEventListener('click', function() {
                        testURLStatus(`${buttonId}.url`);
                    });
                }
                
                if (viewUrlBtn) {
                    viewUrlBtn.addEventListener('click', function() {
                        viewURL(`${buttonId}.url`);
                    });
                }
            }
        });

    // Add event listeners for custom URL inputs to update preview
    const customUrlIds = ['customUrl1'];
    customUrlIds.forEach(buttonId => {
        const labelInput = document.getElementById(`${buttonId}.label`);
        const tooltipHeaderInput = document.getElementById(`${buttonId}.tooltipHeader`);
        const tooltipTextInput = document.getElementById(`${buttonId}.tooltipText`);

        if (labelInput) {
            labelInput.addEventListener('input', () => {
                updateUrlButtonPreview(buttonId);
            });
        }
        if (tooltipHeaderInput) {
            tooltipHeaderInput.addEventListener('input', () => {
                updateUrlButtonPreview(buttonId);
            });
        }
        if (tooltipTextInput) {
            tooltipTextInput.addEventListener('input', () => {
                updateUrlButtonPreview(buttonId);
            });
        }
    });

    // Add event listeners for custom application inputs to update preview
    const customAppIds = ['customApp1'];
    customAppIds.forEach(buttonId => {
        const tooltipHeaderInput = document.getElementById(`${buttonId}.tooltipHeader`);
        const tooltipTextInput = document.getElementById(`${buttonId}.tooltipText`);
        const appIdInput = document.getElementById(`${buttonId}.appId`);

        if (tooltipHeaderInput) {
            tooltipHeaderInput.addEventListener('input', () => {
                updateAppButtonPreview(buttonId);
            });
        }
        if (tooltipTextInput) {
            tooltipTextInput.addEventListener('input', () => {
                updateAppButtonPreview(buttonId);
            });
        }
        if (appIdInput) {
            appIdInput.addEventListener('change', () => {
                updateAppButtonPreview(buttonId);
            });
        }
    });
});

//Validates that the Site ID contains only ASCII letters and numbers
function validateSiteId() {
    const siteIdInput = document.getElementById('telemetry.siteId');
    const siteIdError = document.getElementById('siteIdError');
    const siteId = siteIdInput.value.trim();

    // Clear previous error styling
    siteIdInput.style.borderColor = '';
    siteIdInput.title = '';
    siteIdError.style.display = 'none';

    // Its valid if empty (but later when checking for errors, we'll make sure it's filled in)
    if (!siteId) {
        return true;
    }

    // Check if Site ID contains only ASCII letters and numbers
    const validPattern = /^[A-Za-z0-9]+$/;

    if (!validPattern.test(siteId)) {
        // Invalid Site ID - apply error styling and show error message
        siteIdInput.style.borderColor = 'red';
        siteIdInput.title = 'Site ID must contain only ASCII letters and numbers (no spaces or symbols)';
        siteIdError.style.display = 'block';
        return false;
    }

    return true; // Valid Site ID
}

//Validates that the Organization Name doesn't contain forbidden characters
function validateOrganizationName() {
    const orgNameInput = document.getElementById('organizationName');
    const orgNameError = document.getElementById('organizationNameError');
    const orgName = orgNameInput.value;

    // Clear previous error styling
    orgNameInput.style.borderColor = '';
    orgNameInput.title = '';
    orgNameError.style.display = 'none';

    // Its valid if empty (but later when checking for errors, we'll make sure it's filled in)
    if (!orgName) {
        return true;
    }

    // Check for forbidden characters: double quotes, backslash, and line breaks
    const forbiddenChars = /["\\\n\r]/;

    if (forbiddenChars.test(orgName)) {
        // Invalid Organization Name - apply error styling and show error message
        orgNameInput.style.borderColor = 'red';
        orgNameInput.title = 'Organization Name cannot contain double quotes (") or backslash (\\)';
        orgNameError.style.display = 'block';
        return false;
    }

    return true; // Valid Organization Name
}

//Tests a URL status by checking if it's reachable (without opening in new tab)
async function testURLStatus(inputId) {
    const urlInput = document.getElementById(inputId);
    if (!urlInput) {
        console.error('URL input field not found:', inputId);
        return;
    }

    const url = urlInput.value.trim();
    if (!url) {
        alert('Please enter a URL first');
        urlInput.focus();
        return;
    }

    // Resolve status indicator element next to this input
    const baseId = inputId.split('.')[0];
    const statusEl = document.getElementById(`${baseId}Status`);
    const testBtn = document.getElementById(`testUrl${baseId.replace('customUrl','')}Btn`);

    // Helper to set classes and text
    const setStatus = (state) => {
        if (!statusEl) return;
        statusEl.classList.remove('loading', 'success', 'error');
        if (state) {
            statusEl.classList.add(state);
            // Set text content for accessibility
            switch (state) {
                case 'loading':
                    statusEl.textContent = 'TESTING...';
                    break;
                case 'success':
                    statusEl.textContent = 'PASS';
                    break;
                case 'error':
                    statusEl.textContent = 'FAIL';
                    break;
                default:
                    statusEl.textContent = '';
                    break;
            }
        } else {
            statusEl.textContent = '';
        }
    };

    // Basic URL normalization
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
        urlInput.value = finalUrl;
    }

    // Basic syntax validation using URL constructor
    try {
        // Will throw if invalid
        // eslint-disable-next-line no-new
        new URL(finalUrl);
    } catch (_) {
        setStatus('error');
        alert('Invalid URL format. Please check and try again.');
        urlInput.focus();
        return;
    }

    // Begin loading state
    setStatus('loading');
    if (testBtn) testBtn.disabled = true;

    // Best-effort reachability check using CORS proxy
    let reachable = false;
    let errorMessage = null;
    
    // Helper function to test URL via CORS proxy
    const testViaProxy = async (url) => {
        // Use a CORS proxy service to bypass CORS restrictions
        // Note: The proxy will return 200 even for 404s, so we can only verify reachability, not exact status
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            const response = await fetch(proxyUrl, { 
                method: 'GET', 
                mode: 'cors',
                signal: controller.signal 
            });
            clearTimeout(timeout);
            
            // If proxy responds successfully, the URL is reachable
            // (Note: We can't determine exact HTTP status via this proxy)
            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: `Proxy returned error: HTTP ${response.status}` };
            }
        } catch (error) {
            clearTimeout(timeout);
            if (error.name === 'AbortError') {
                return { success: false, error: 'Request timed out. The URL may be unreachable or taking too long to respond.' };
            }
            // If proxy fails, it could be network error or unreachable URL
            return { success: false, error: 'Unable to reach URL. Please verify the URL is correct and accessible.' };
        }
    };
    
    try {
        // First, try direct fetch (works if page is served from web server, not file://)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        try {
            const response = await fetch(finalUrl, { 
                method: 'HEAD', 
                mode: 'cors', 
                redirect: 'follow', 
                signal: controller.signal 
            });
            clearTimeout(timeout);
            
            if (response.ok || (response.status >= 300 && response.status < 400)) {
                reachable = true;
            } else if (response.status === 404) {
                errorMessage = 'Page not found (404)';
            } else if (response.status >= 400) {
                errorMessage = `Error: HTTP ${response.status}`;
            }
        } catch (directError) {
            clearTimeout(timeout);
            // Direct fetch failed (likely CORS), use proxy
            const result = await testViaProxy(finalUrl);
            if (result.success) {
                reachable = true;
            } else {
                errorMessage = result.error || 'Unable to reach URL';
            }
        }
    } catch (error) {
        // Unexpected error occurred
        errorMessage = 'An unexpected error occurred while testing the URL. Please try again.';
        console.error('URL validation error:', error);
    }

    // Update indicator
    if (reachable) {
        setStatus('success');
    } else {
        setStatus('error');
        if (errorMessage) {
            alert(errorMessage);
        }
    }

    // Re-enable button
    if (testBtn) testBtn.disabled = false;
}

//Opens a URL in a new tab (without status checking)
function viewURL(inputId) {
    const urlInput = document.getElementById(inputId);
    if (!urlInput) {
        console.error('URL input field not found:', inputId);
        return;
    }

    const url = urlInput.value.trim();
    if (!url) {
        alert('Please enter a URL first');
        urlInput.focus();
        return;
    }

    // Basic URL normalization
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
        urlInput.value = finalUrl;
    }

    // Basic syntax validation using URL constructor
    try {
        // Will throw if invalid
        // eslint-disable-next-line no-new
        new URL(finalUrl);
    } catch (_) {
        alert('Invalid URL format. Please check and try again.');
        urlInput.focus();
        return;
    }

    // Open in new tab
    try {
        const newWindow = window.open(finalUrl, '_blank');
        if (!newWindow) {
            alert('Popup blocked. Please allow popups for this site to view URLs, or manually copy and test the URL: ' + finalUrl);
        }
    } catch (error) {
        console.error('Error opening URL:', error);
        alert('Unable to open URL. It may be unreachable or blocked.');
    }
}


// Populates the predefined buttons from loaded config
function populatePredefinedButtons(extraItems) {
    // Reset all buttons to "Not Used" first
    const buttonIds = ['usb', 'volume', 'voice', 'signOut', 'customUrl1', 'customApp1'];
    buttonIds.forEach(buttonId => {
        const positionSelect = document.getElementById(`${buttonId}.position`);
        if (positionSelect) {
            positionSelect.value = '';
        }

        // Clear URL button fields
        if (buttonId.includes('customUrl')) {
            const labelInput = document.getElementById(`${buttonId}.label`);
            const tooltipHeaderInput = document.getElementById(`${buttonId}.tooltipHeader`);
            const tooltipTextInput = document.getElementById(`${buttonId}.tooltipText`);
            const urlInput = document.getElementById(`${buttonId}.url`);

            if (labelInput) labelInput.value = '';
            if (tooltipHeaderInput) tooltipHeaderInput.value = '';
            if (tooltipTextInput) tooltipTextInput.value = '';
            if (urlInput) urlInput.value = '';
        }

        // Clear Application button fields
        if (buttonId.includes('customApp')) {
            const tooltipHeaderInput = document.getElementById(`${buttonId}.tooltipHeader`);
            const tooltipTextInput = document.getElementById(`${buttonId}.tooltipText`);
            const appIdInput = document.getElementById(`${buttonId}.appId`);

            if (tooltipHeaderInput) tooltipHeaderInput.value = '';
            if (tooltipTextInput) tooltipTextInput.value = '';
            if (appIdInput) appIdInput.value = '';
        }
    });

    // Populate from config data
    extraItems.forEach((item, index) => {
        if (item.type === 'control') {
            // Map control features to button IDs
            const featureMap = {
                'usbopeneject': 'usb',
                'volume': 'volume',
                'voice': 'voice'
            };

            const buttonId = featureMap[item.feature];
            if (buttonId) {
                const positionSelect = document.getElementById(`${buttonId}.position`);
                if (positionSelect) {
                    positionSelect.value = (index + 1).toString();
                }
            }
        } else if (item.type === 'action') {
            // Map action features to button IDs
            const featureMap = {
                'signout': 'signOut'
            };

            const buttonId = featureMap[item.feature];
            if (buttonId) {
                const positionSelect = document.getElementById(`${buttonId}.position`);
                if (positionSelect) {
                    positionSelect.value = (index + 1).toString();
                }
            }
        } else if (item.type === 'link') {
            // Find the first available custom URL button
            const customButtons = ['customUrl1'];
            for (const buttonId of customButtons) {
                const positionSelect = document.getElementById(`${buttonId}.position`);
                if (positionSelect && positionSelect.value === '') {
                    // This custom button is available
                    positionSelect.value = (index + 1).toString();

                    // Populate the URL button fields
                    const labelInput = document.getElementById(`${buttonId}.label`);
                    const tooltipHeaderInput = document.getElementById(`${buttonId}.tooltipHeader`);
                    const tooltipTextInput = document.getElementById(`${buttonId}.tooltipText`);
                    const urlInput = document.getElementById(`${buttonId}.url`);

                    if (labelInput) labelInput.value = item.label || '';
                    if (tooltipHeaderInput) tooltipHeaderInput.value = item.tooltipHeader || '';
                    if (tooltipTextInput) tooltipTextInput.value = item.tooltipText || '';
                    if (urlInput) urlInput.value = item.url || '';

                    // Update the preview
                    updateUrlButtonPreview(buttonId);
                    break;
                }
            }
        } else if (item.type === 'application') {
            // Find the first available custom application button
            const customAppButtons = ['customApp1'];
            for (const buttonId of customAppButtons) {
                const positionSelect = document.getElementById(`${buttonId}.position`);
                if (positionSelect && positionSelect.value === '') {
                    // This custom button is available
                    positionSelect.value = (index + 1).toString();

                    // Populate the Application button fields
                    const appIdInput = document.getElementById(`${buttonId}.appId`);
                    if (appIdInput) appIdInput.value = item.appId || '';

                    // Update the preview
                    updateAppButtonPreview(buttonId);

                    // Ensure the preview button gets the application class for proper styling
                    const previewButton = document.getElementById(`${buttonId}Preview`);
                    if (previewButton) {
                        previewButton.classList.add('application-button');
                    }
                    break;
                }
            }
        }
    });

    // Update position preview after loading
    updatePositionPreview();
}

// Collects predefined button configurations for summary display (keeps position info)
function collectPredefinedButtonsForSummary() {
    // Define predefined button configurations
    const predefinedConfigs = [
        { id: 'usb', type: 'control', feature: 'usbopeneject' },
        { id: 'volume', type: 'control', feature: 'volume' },
        { id: 'voice', type: 'control', feature: 'voice' },
        { id: 'signOut', type: 'action', feature: 'signout' }
    ];
    
    const buttonConfigs = [...predefinedConfigs];
    
    // Add custom URL buttons (including dynamic ones)
    for (let i = 1; i <= dynamicUrlButtonCount; i++) {
        buttonConfigs.push({ id: `customUrl${i}`, type: 'link' });
    }
    
    // Add custom Application buttons (including dynamic ones)
    for (let i = 1; i <= dynamicAppButtonCount; i++) {
        buttonConfigs.push({ id: `customApp${i}`, type: 'application' });
    }

    // Collect buttons that have positions assigned
    const positionedButtons = [];

    buttonConfigs.forEach(config => {
        // For all buttons, check if they're enabled first
        const enabledCheckbox = document.getElementById(`${config.id}.enabled`);
        const isEnabled = enabledCheckbox && enabledCheckbox.checked;
        
        const positionSelect = document.getElementById(`${config.id}.position`);
        if (isEnabled && positionSelect && positionSelect.value && positionSelect.value !== '') {
            const position = parseInt(positionSelect.value);
            const buttonData = {
                type: config.type,
                position: position
            };

            if (config.type === 'control') {
                buttonData.feature = config.feature;
            } else if (config.type === 'action') {
                buttonData.feature = config.feature; // Always set the feature property
                if (config.feature === 'signout') {
                    buttonData.label = "Sign\nOut";
                    buttonData.tooltipHeader = "Sign Out";
                    buttonData.tooltipText = "Sign out of this computer";
                    buttonData.function = "signOut";
                }
            } else if (config.type === 'link') {
                buttonData.label = document.getElementById(`${config.id}.label`).value || '';
                buttonData.tooltipHeader = document.getElementById(`${config.id}.tooltipHeader`).value || '';
                buttonData.tooltipText = document.getElementById(`${config.id}.tooltipText`).value || '';
                buttonData.url = document.getElementById(`${config.id}.url`).value || '';
            } else if (config.type === 'application') {
                const appId = document.getElementById(`${config.id}.appId`).value || '';
                buttonData.appId = appId;
                const appName = appId ? applicationNames[appId] || 'Custom App' : 'Custom App';
                buttonData.label = appName;
                buttonData.tooltipHeader = appName;
                buttonData.tooltipText = `This launches the ${appName} application.`;
            }

            positionedButtons.push(buttonData);
        }
    });

    // Sort by position and keep position property for summary display
    positionedButtons.sort((a, b) => a.position - b.position);

    return positionedButtons;
}

// Collects predefined button configurations for download (removes position info)
function collectPredefinedButtons() {
    // Define predefined button configurations
    const predefinedConfigs = [
        { id: 'usb', type: 'control', feature: 'usbopeneject' },
        { id: 'volume', type: 'control', feature: 'volume' },
        { id: 'voice', type: 'control', feature: 'voice' },
        { id: 'signOut', type: 'action', feature: 'signout' }
    ];
    
    const buttonConfigs = [...predefinedConfigs];
    
    // Add custom URL buttons (including dynamic ones)
    for (let i = 1; i <= dynamicUrlButtonCount; i++) {
        buttonConfigs.push({ id: `customUrl${i}`, type: 'link' });
    }
    
    // Add custom Application buttons (including dynamic ones)
    for (let i = 1; i <= dynamicAppButtonCount; i++) {
        buttonConfigs.push({ id: `customApp${i}`, type: 'application' });
    }

    // Collect buttons that have positions assigned
    const positionedButtons = [];

    buttonConfigs.forEach(config => {
        // For all buttons, check if they're enabled first
            const enabledCheckbox = document.getElementById(`${config.id}.enabled`);
        const isEnabled = enabledCheckbox && enabledCheckbox.checked;
        
        const positionSelect = document.getElementById(`${config.id}.position`);
        if (isEnabled && positionSelect && positionSelect.value && positionSelect.value !== '') {
            const position = parseInt(positionSelect.value);
            const buttonData = {
                type: config.type,
                position: position
            };

            if (config.type === 'control') {
                buttonData.feature = config.feature;
            } else if (config.type === 'action') {
                buttonData.feature = config.feature; // Always set the feature property
                if (config.feature === 'signout') {
                    buttonData.label = "Sign\nOut";
                    buttonData.tooltipHeader = "Sign Out";
                    buttonData.tooltipText = "Sign out of this computer";
                    buttonData.function = "signOut";
                }
            } else if (config.type === 'link') {
                buttonData.label = document.getElementById(`${config.id}.label`).value || '';
                buttonData.tooltipHeader = document.getElementById(`${config.id}.tooltipHeader`).value || '';
                buttonData.tooltipText = document.getElementById(`${config.id}.tooltipText`).value || '';
                buttonData.url = document.getElementById(`${config.id}.url`).value || '';
            } else if (config.type === 'application') {
                const appId = document.getElementById(`${config.id}.appId`).value || '';
                buttonData.appId = appId;
                const appName = appId ? applicationNames[appId] || 'Custom App' : 'Custom App';
                buttonData.label = appName;
                buttonData.tooltipHeader = appName;
                buttonData.tooltipText = `This launches the ${appName} application.`;
            }

            positionedButtons.push(buttonData);
        }
    });

    // Sort by position and remove position property (as its not needed in final config)
    positionedButtons.sort((a, b) => a.position - b.position);
    positionedButtons.forEach(button => delete button.position);

    return positionedButtons;
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            // Attempt to parse the uploaded file as JSON
            const config = JSON.parse(e.target.result);
            //console.log('Parsed config:', config);

            // Populate the entire UI with the loaded configuration
            populateUI(config);
            alert("Config file loaded successfully!");
        } catch (error) {
            // Handle invalid JSON files gracefully
            console.error('JSON Parse Error:', error);
            alert(`Invalid JSON file: ${error.message}\n\nPlease check that your file contains valid JSON format.`);
        }
    };
    reader.readAsText(file);
}

//Populates the entire UI from a loaded config object
function populateUI(config) {
    // Basic settings
    document.getElementById('organizationName').value = config.organizationName ?? "";

    // Features section - handle nested structure
    // document.getElementById('features.atOnDemand.enabled').checked =
    //     config.features?.atOnDemand?.enabled ?? false; // AT-on-Demand feature temporarily commented out
    document.getElementById('features.atUseCounter.enabled').checked =
        config.features?.atUseCounter?.enabled ?? true;
    document.getElementById('features.autorunAfterLogin.enabled').checked =
        config.features?.autorunAfterLogin?.enabled ?? true;
    document.getElementById('features.autorunAfterLogin.scope').value =
        config.features?.autorunAfterLogin?.scope ?? "allLocalUsers";
    document.getElementById('features.checkForUpdates.enabled').checked = config.features?.checkForUpdates?.enabled ?? false;
    document.getElementById('features.customMorphicBars.enabled').checked = config.features?.customMorphicBars?.enabled ?? true;
    document.getElementById('features.resetSettings.enabled').checked = config.features?.resetSettings?.enabled ?? false;
    // signIn is now automatically controlled by customMorphicBars setting, so no UI element to populate

    // MorphicBar section - handle nested structure
    document.getElementById('morphicBar.defaultLocation').value = config.morphicBar?.defaultLocation ?? "bottomTrailing";
    document.getElementById('morphicBar.visibilityAfterLogin').value = config.morphicBar?.visibilityAfterLogin ?? "show";

    // Advanced settings - some nested, some top-level
    document.getElementById('telemetry.siteId').value = config.telemetry?.siteId ?? "";
    document.getElementById('hideMorphicAfterLoginUntil').value = config.hideMorphicAfterLoginUntil ?? "";


    // Handle extra buttons/items - nested under morphicBar
    populatePredefinedButtons(config.morphicBar?.extraItems ?? []);

    // Update scope visibility after loading config
    toggleScopeAccess();

    // Update delay morphic access and ensure telemetry dependency is enforced
    toggleDelayMorphicAccess();
}

//Generates and downloads the final config.json file

// Function to generate and download PDF using jsPDF and html2canvas
async function generatePDF() {
    try {
        const { jsPDF } = window.jspdf;
        const step3Element = document.getElementById('step3');
        const morphicBarPreview = step3Element.querySelector('.morphic-bar-preview');
        const summaryContent = document.getElementById('settingsSummary');

        if (!morphicBarPreview || !summaryContent) {
            console.error('Required elements for PDF generation not found');
            return false;
        }

        // Create PDF document (A4 size)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (2 * margin);
        let yPosition = margin;

        // Add title and date
        pdf.setFontSize(20);
        pdf.setTextColor(72, 98, 132); // #486284
        pdf.text('Morphic Configuration Summary', pageWidth / 2, yPosition, { align: 'center' });

        yPosition += 10;
        pdf.setFontSize(10);
        pdf.setTextColor(51, 51, 51);
        const dateStr = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
        pdf.text(dateStr, pageWidth / 2, yPosition, { align: 'center' });

        yPosition += 15;

        // Add settings summary with selectable text
        pdf.setFontSize(16);
        pdf.setTextColor(72, 98, 132);
        pdf.text('Settings Summary', margin, yPosition);
        yPosition += 8;

        // Get all label-value pairs from the summary
        const labels = summaryContent.querySelectorAll('.label');
        const values = summaryContent.querySelectorAll('.value');

        pdf.setFontSize(10);
        const lineHeight = 6;
        const labelWidth = 80;

        for (let i = 0; i < labels.length; i++) {
            // Add label (bold) - wrap label text too
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(60, 60, 60);
            const labelText = labels[i].textContent + ':';
            const splitLabel = pdf.splitTextToSize(labelText, labelWidth);

            // Add value (normal) - extract text without "Edit" button text
            const valueSpan = values[i].querySelector('span');
            const valueText = valueSpan ? valueSpan.textContent : values[i].textContent.replace('Edit', '').trim();
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(80, 80, 80);
            const splitValue = pdf.splitTextToSize(valueText, contentWidth - labelWidth - 5);

            // Calculate the height needed for this row (max of label and value lines)
            const maxLines = Math.max(splitLabel.length, splitValue.length);
            const rowHeight = lineHeight * maxLines;

            // Check if we need a new page
            if (yPosition + rowHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }

            // Add label
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(60, 60, 60);
            pdf.text(splitLabel, margin, yPosition);

            // Add value
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(80, 80, 80);
            pdf.text(splitValue, margin + labelWidth + 5, yPosition);

            yPosition += rowHeight + 3;
        }

        // Add some space before Morphic Bar preview
        yPosition += 10;

        // Check if we need a new page for the Morphic Bar
        if (yPosition + 60 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        // Add Morphic Bar preview section title
        pdf.setFontSize(16);
        pdf.setTextColor(72, 98, 132);
        pdf.text('Morphic Bar Preview', margin, yPosition);
        yPosition += 8;

        // Get the morphic bar container for better capture
        const morphicBarContainer = morphicBarPreview.querySelector('.morphic-bar-container');
        const elementToCapture = morphicBarContainer || morphicBarPreview;

        // Ensure the element is visible and has dimensions
        const rect = elementToCapture.getBoundingClientRect();
        console.log('Element dimensions:', rect);

        if (rect.width === 0 || rect.height === 0) {
            console.error('Element has no dimensions:', rect);
            throw new Error('Morphic Bar preview is not visible');
        }

        // Capture Morphic Bar as high-quality image
        const canvas = await html2canvas(elementToCapture, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true,
            backgroundColor: '#ffffff',
            width: rect.width,
            height: rect.height
        });

        console.log('Canvas created:', { width: canvas.width, height: canvas.height });

        // Validate canvas dimensions
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
            console.error('Invalid canvas dimensions');
            throw new Error('Failed to capture Morphic Bar preview');
        }

        // Convert to JPEG for better compatibility
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        // Calculate dimensions with validation
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        console.log('Image dimensions:', { imgWidth, imgHeight });

        // Validate calculated dimensions
        if (!imgWidth || !imgHeight || imgWidth <= 0 || imgHeight <= 0 || !isFinite(imgWidth) || !isFinite(imgHeight)) {
            console.error('Invalid image dimensions:', { imgWidth, imgHeight, canvasWidth: canvas.width, canvasHeight: canvas.height });
            throw new Error('Invalid image dimensions calculated');
        }

        // Check if image fits on current page
        if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        pdf.addImage(imgData, 'JPEG', margin, yPosition, imgWidth, imgHeight);
        
        yPosition += imgHeight + 20;

        // Add installation instructions immediately after MorphicBar preview
        // Check if we need a new page for title
        if (yPosition + 15 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }
        
        // Title
        pdf.setFontSize(16);
        pdf.setTextColor(72, 98, 132);
        pdf.text('Morphic config.json File Installation Instructions', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);

        // Check if we need a new page for Windows section
        if (yPosition + 20 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        // Windows instructions
        pdf.setFont('helvetica', 'bold');
        pdf.text('For WINDOWS installs', margin, yPosition);
        yPosition += 6;

        // Check page space before Windows path line
        if (yPosition + 5 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }
        
        pdf.setFont('helvetica', 'normal');
        const preText = 'The config.json file should be copied to ';
        const boldText = '%PROGRAMDATA%\\Morphic\\config.json.';
        
        // Print the normal part
        pdf.text(preText, margin, yPosition);
        // Calculate position for bold text
        const preTextWidth = pdf.getTextWidth(preText);
        pdf.setFont('helvetica', 'bold');
        pdf.text(boldText, margin + preTextWidth, yPosition);
        pdf.setFont('helvetica', 'normal');
        yPosition += 5;

        // Check page space before Windows bullet
        if (yPosition + 5 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        // Bullet point for Windows path info
        const bulletIndent = 10; // Double indentation
        const bulletText = '\u2022 For most Windows computers, this translates to ';
        pdf.text(bulletText, margin + bulletIndent, yPosition);
        const bulletTextWidth = pdf.getTextWidth(bulletText);
        pdf.setFont('helvetica', 'bold');
        pdf.text('C:\\ProgramData\\Morphic\\config.json', margin + bulletIndent + bulletTextWidth, yPosition);
        pdf.setFont('helvetica', 'normal');
        yPosition += 10;

        // Check page space before Mac section
        if (yPosition + 15 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        // Mac instructions
        pdf.setFont('helvetica', 'bold');
        pdf.text('For MAC installs', margin, yPosition);
        yPosition += 6;

        // Check page space before Mac path line
        if (yPosition + 5 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        pdf.setFont('helvetica', 'normal');
        const macPreText = 'The config.json file should be copied to ';
        pdf.text(macPreText, margin, yPosition);
        const macPreTextWidth = pdf.getTextWidth(macPreText);
        pdf.setFont('helvetica', 'bold');
        pdf.text('"/Library/Application Support/Morphic"', margin + macPreTextWidth, yPosition);
        pdf.setFont('helvetica', 'normal');
        yPosition += 10;

        // Check page space before Notes section
        if (yPosition + 15 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        // Notes
        pdf.setFont('helvetica', 'bold');
        pdf.text('NOTES (for both Windows and Mac)', margin, yPosition);
        yPosition += 6;

        pdf.setFont('helvetica', 'normal');
        const notes = [
            '\u2022 If your deployment software does not automatically create the "Morphic" subfolder as part of copying the config.json file, you may need to first create that subfolder and then copy the config.json file into it.',
            '\u2022 We recommend setting file permissions for the deployed config.json file to read-only (as is typical for admin-owned configuration files).'
        ];

        notes.forEach(line => {
            if (line === '') {
                yPosition += 5;
                return;
            }
            
            // Wrap text to fit within page width
            const wrappedLines = pdf.splitTextToSize(line, contentWidth - bulletIndent);
            
            wrappedLines.forEach((wrappedLine, index) => {
                // Check if we need a new page
                if (yPosition + 5 > pageHeight - margin) {
                    pdf.addPage();
                    yPosition = margin;
                }
                
                // For bullet points, add double indentation, and indent continuation lines further
                let xPos = margin;
                if (line.startsWith('\u2022')) {
                    xPos = index === 0 ? margin + bulletIndent : margin + bulletIndent + 5;
                }
                pdf.text(wrappedLine, xPos, yPosition);
                yPosition += 5;
            });
        });

        // Add spacing after notes
        yPosition += 5;

        // Check page space before "For full instructions" text
        if (yPosition + 10 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        // Add "For full instructions" text
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        pdf.text('For full Morphic installation instructions see:', margin, yPosition);
        yPosition += 6;

        // Check page space before link
        if (yPosition + 10 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
        }

        // Add link
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink('https://docs.google.com/document/d/1YQ85l8IHtfFefGM2xxswMt26yUGmnkxE/edit', 
            margin, yPosition, { url: 'https://docs.google.com/document/d/1YQ85l8IHtfFefGM2xxswMt26yUGmnkxE/edit' });

        // Save the PDF
        const filename = `Morphic_Config_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again.');
        return false;
    }
}

// Handle download button click
async function handleDownloadClick() {
    console.log('Download button clicked!');
    const downloadBtn = document.getElementById('download');
    console.log('Download button found:', downloadBtn);

    if (!downloadBtn) {
        console.error('Download button not found!');
        return;
    }

    // Disable the download button while processing
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Generating Files...';

    try {
        console.log('Starting download process...');
        // Download config.json
        downloadConfig();
        console.log('Config downloaded, generating PDF...');
        
        // Generate and download PDF
        await generatePDF();
        console.log('PDF generated successfully');
        
        alert('Configuration files have been downloaded successfully!');
    } catch (error) {
        console.error('Error during file generation:', error);
        alert('There was an error generating the files. Please try again.');
    } finally {
        // Re-enable the download button
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download config.json';
    }
}

// Check for errors in a specific step
function checkStepErrors(stepNumber) {
    const errors = [];

    // Clear any existing error displays for this step
    clearStepErrors(stepNumber);

    if (stepNumber === 1) {
        // Step 1 validation: Basic settings

        // Validate organization name is not empty and doesn't contain forbidden characters
        const orgName = document.getElementById('organizationName').value.trim();
        if (!orgName) {
            errors.push('Organization Name is required.');
        } else {
            // Check for forbidden characters: double quotes, backslash, and linefeed
            const forbiddenChars = /["\\\n\r]/;
            if (forbiddenChars.test(orgName)) {
                errors.push('Organization Name cannot contain double quotes ("), backslash (\\), or line breaks.');
            }
        }

        // Validate Site ID is filled in
        const siteId = document.getElementById('telemetry.siteId').value.trim();
        if (!siteId) {
            errors.push('Site ID is required.');
        }

        // Validate Site ID format (if Site ID has content)
        if (siteId && !validateSiteId()) {
            errors.push('Site ID must contain only ASCII letters and numbers (no spaces or symbols).');
        }

        // Validate Date to show MorphicBar is filled in (only if delay morphic is enabled)
        const delayMorphicEnabled = document.getElementById('enableDelayMorphic').checked;
        const morphicShowDate = document.getElementById('hideMorphicAfterLoginUntil').value;
        if (delayMorphicEnabled && !morphicShowDate) {
            errors.push('Date to show MorphicBar is required when Delay Morphic Appearance is enabled.');
        }

        // Validate hide until date if delay morphic is enabled and date is provided
        if (delayMorphicEnabled && morphicShowDate) {
            const selectedDate = new Date(morphicShowDate);
            const today = new Date();
            if (selectedDate <= today) {
                errors.push('Date to show MorphicBar must be in the future.');
            }
        }

    } else if (stepNumber === 2) {
        // Step 2 validation: Button configuration

        // Validate unique positions
        if (!validateUniquePositions()) {
            errors.push('Duplicate button positions detected. Each button must have a unique position (1, 2, or 3).');
        }

        // Validate predefined buttons have position assigned if they are enabled (checked)
        const predefinedButtons = ['usb', 'volume', 'voice', 'signOut'];
        predefinedButtons.forEach(buttonId => {
            const checkbox = document.getElementById(`${buttonId}.enabled`);
            const position = document.getElementById(`${buttonId}.position`);
            if (checkbox && checkbox.checked && position && !position.value) {
                const buttonNames = {
                    'usb': 'USB Open/Eject',
                    'volume': 'Volume Control', 
                    'voice': 'Voice Control',
                    'signOut': 'Sign Out'
                };
                errors.push(`${buttonNames[buttonId]}: Position is required.`);
            }
        });

        // Validate custom URL buttons have all required fields if they are enabled (checked)
        for (let i = 1; i <= dynamicUrlButtonCount; i++) {
            const buttonId = `customUrl${i}`;
            const checkbox = document.getElementById(`${buttonId}.enabled`);
            const position = document.getElementById(`${buttonId}.position`);
            if (checkbox && checkbox.checked && position) {
                const label = document.getElementById(`${buttonId}.label`);
                const url = document.getElementById(`${buttonId}.url`);
                const tooltipHeader = document.getElementById(`${buttonId}.tooltipHeader`);
                const tooltipText = document.getElementById(`${buttonId}.tooltipText`);

                const labelValue = label ? label.value.trim() : '';
                const urlValue = url ? url.value.trim() : '';
                const tooltipHeaderValue = tooltipHeader ? tooltipHeader.value.trim() : '';
                const tooltipTextValue = tooltipText ? tooltipText.value.trim() : '';
                const positionValue = position.value;

                if (!labelValue) {
                    errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')}: Button Text is required.`);
                }
                if (!urlValue) {
                    errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')}: URL is required.`);
                } else {
                    // Basic URL validation
                    if (!urlValue.startsWith('http://') && !urlValue.startsWith('https://') && !urlValue.includes('.')) {
                        errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')}: URL appears to be invalid.`);
                    }
                }
                if (!tooltipHeaderValue) {
                    errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')}: Tooltip Header is required.`);
                }
                if (!tooltipTextValue) {
                    errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')}: Tooltip Text is required.`);
                }
                if (!positionValue) {
                    errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')}: Position is required.`);
                }
            }
        }

        // Validate custom application buttons have all required fields if they are enabled (checked)
        for (let i = 1; i <= dynamicAppButtonCount; i++) {
            const buttonId = `customApp${i}`;
            const checkbox = document.getElementById(`${buttonId}.enabled`);
            const position = document.getElementById(`${buttonId}.position`);
            if (checkbox && checkbox.checked && position) {
                const appId = document.getElementById(`${buttonId}.appId`);

                const appIdValue = appId ? appId.value.trim() : '';
                const positionValue = position.value;

                if (!appIdValue) {
                    errors.push(`${buttonId.replace('customApp', 'Custom Application Button ')}: Application selection is required.`);
                }
                if (!positionValue) {
                    errors.push(`${buttonId.replace('customApp', 'Custom Application Button ')}: Position is required.`);
                }
            }
        }
    }

    // Display errors if any
    if (errors.length > 0) {
        displayStepErrors(stepNumber, errors);
        return false; // Prevent advancing to next step
    }

    return true; // Allow advancing to next step
}

// Clear error display for a specific step
function clearStepErrors(stepNumber) {
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (!stepElement) return;

    const existingErrorContainer = stepElement.querySelector('.step-errors');
    if (existingErrorContainer) {
        existingErrorContainer.remove();
    }
}

// Display errors at the top of a specific step
function displayStepErrors(stepNumber, errors) {
    const stepElement = document.getElementById(`step${stepNumber}`);
    if (!stepElement) return;

    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'step-errors';
    errorContainer.style.cssText = `
        background-color: #fee;
        border: 1px solid #f88;
        border-radius: 4px;
        padding: 15px;
        margin-bottom: 20px;
        color: #a00;
    `;

    const h4 = document.createElement('h4');
    h4.textContent = 'Please fix the following errors before proceeding:';
    h4.style.cssText = 'margin: 0 0 10px 0; color: #a00;';

    const ul = document.createElement('ul');
    ul.style.cssText = 'margin: 0; padding-left: 20px;';

    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        li.style.cssText = 'margin-bottom: 5px;';
        ul.appendChild(li);
    });

    errorContainer.appendChild(h4);
    errorContainer.appendChild(ul);

    // Insert at the top of the step content
    stepElement.insertBefore(errorContainer, stepElement.firstChild);

    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function downloadConfig() {
    // Generate config.json file for download

    const isAutoRunEnabled = document.getElementById('features.autorunAfterLogin.enabled').checked;

    // Build the config
    const config = {
        "version": 0,  // Default version value
        "organizationName": document.getElementById('organizationName').value.trim(),

        "features": {
            // "atOnDemand": { // AT-on-Demand feature temporarily commented out
            //     "enabled": document.getElementById('features.atOnDemand.enabled').checked
            // },
            "atUseCounter": {
                "enabled": document.getElementById('features.atUseCounter.enabled').checked
            },
            "autorunAfterLogin": {
                "enabled": isAutoRunEnabled,
                // Default to allLocalUsers if auto run is disabled
                "scope": isAutoRunEnabled ? document.getElementById('features.autorunAfterLogin.scope').value : "allLocalUsers"
            },
            "checkForUpdates": {
                "enabled": document.getElementById('features.checkForUpdates.enabled').checked
            },
            "customMorphicBars": {
                "enabled": document.getElementById('features.customMorphicBars.enabled').checked
            },
            "resetSettings": {
                // Default to false for Reset Settings when auto run is disabled
                "enabled": isAutoRunEnabled ? document.getElementById('features.resetSettings.enabled').checked : false
            },
            "signIn": {
                // Automatically enabled when customMorphicBars is enabled
                "enabled": document.getElementById('features.customMorphicBars.enabled').checked
            }
        },

        "morphicBar": {
            "defaultLocation": document.getElementById('morphicBar.defaultLocation').value,
            "visibilityAfterLogin": document.getElementById('morphicBar.visibilityAfterLogin').value,
            "extraItems": collectPredefinedButtons()
        }
    };

    // Add optional fields only if they have values
    const siteId = document.getElementById('telemetry.siteId').value.trim();
    if (siteId) {
        config.telemetry = {
            "siteId": siteId
        };
    }

    const delayMorphicEnabled = document.getElementById('enableDelayMorphic').checked;
    const hideUntilDate = document.getElementById('hideMorphicAfterLoginUntil').value;
    if (delayMorphicEnabled && hideUntilDate) {
        config.hideMorphicAfterLoginUntil = hideUntilDate;
    }

    const json = JSON.stringify(config, null, 2);

    // Create downloadable file
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'config.json';
    a.click(); // Trigger download
}

// Function to update URL button preview dynamically
function updateUrlButtonPreview(buttonId) {
    const label = document.getElementById(`${buttonId}.label`).value || 'Button\nText';
    const tooltipHeader = document.getElementById(`${buttonId}.tooltipHeader`).value || 'Header text';
    const tooltipText = document.getElementById(`${buttonId}.tooltipText`).value || 'Description text';

    // Update preview button label - convert \n to line breaks
    const labelElement = document.getElementById(`${buttonId}Label`);
    if (labelElement) {
        // Convert \n to <br> tags for HTML display
        labelElement.replaceChildren();
        // Split by \n and create text nodes with <br> elements
        const parts = label.split('\\n');
        parts.forEach((part, index) => {
            if (index > 0) {
                // Add <br> before each part except the first
                labelElement.appendChild(document.createElement('br'));
            }
            // Add the text part
            if (part) { // Only add non-empty parts
                labelElement.appendChild(document.createTextNode(part));
            }
        });
    }

    // Update config preview button label (the one in the tooltip preview area)
    const configLabelElement = document.getElementById(`${buttonId}ConfigLabel`);
    if (configLabelElement) {
        configLabelElement.replaceChildren();
        const parts = label.split('\\n');
        parts.forEach((part, index) => {
            if (index > 0) {
                configLabelElement.appendChild(document.createElement('br'));
            }
            if (part) {
                configLabelElement.appendChild(document.createTextNode(part));
            }
        });
    }

    // Update button title attribute for browser tooltip
    const previewButton = document.getElementById(`${buttonId}Preview`);
    if (previewButton) {
        previewButton.title = `${tooltipHeader}\n\n${tooltipText}`;
    }

    // Update config preview button title
    const configPreviewButton = document.getElementById(`${buttonId}ConfigPreview`);
    if (configPreviewButton) {
        configPreviewButton.title = `${tooltipHeader}\n\n${tooltipText}`;
    }

    // Update tooltip preview area - keep this for URL buttons
    const tooltipHeaderPreview = document.getElementById(`${buttonId}TooltipHeaderPreview`);
    const tooltipTextPreview = document.getElementById(`${buttonId}TooltipTextPreview`);

    if (tooltipHeaderPreview) {
        tooltipHeaderPreview.textContent = tooltipHeader;
    }

    if (tooltipTextPreview) {
        tooltipTextPreview.textContent = tooltipText;
    }

    // Update position preview when button details change
    updatePositionPreview();
}

// Function to update URL button visibility based on checkbox state
function updateUrlButtonVisibility(buttonId) {
    const checkbox = document.getElementById(`${buttonId}.enabled`);
    const originalButton = document.getElementById(`${buttonId}Preview`);
    const tooltipPreview = document.querySelector(`#${buttonId} .tooltip-preview`);
    
    if (checkbox && originalButton && tooltipPreview) {
        if (checkbox.checked) {
            // When checked: hide original button, show preview section
            originalButton.style.display = 'none';
            tooltipPreview.style.display = 'flex';
        } else {
            // When unchecked: show original button, hide preview section
            originalButton.style.display = 'flex';
            tooltipPreview.style.display = 'none';
        }
    }
}

// Application ID to display name mapping
const applicationNames = {
    'calculator': 'Calculator',
    'firefox': 'Firefox',
    'googleChrome': 'Google Chrome',
    'microsoftAccess': 'Microsoft Access',
    'microsoftEdge': 'Microsoft Edge',
    'microsoftExcel': 'Microsoft Excel',
    'microsoftOneNote': 'Microsoft OneNote',
    'microsoftOutlook': 'Microsoft Outlook',
    'microsoftPowerPoint': 'Microsoft PowerPoint',
    'microsoftQuickAssist': 'Quick Assist',
    'microsoftTeams': 'Microsoft Teams',
    'microsoftWord': 'Microsoft Word',
    'opera': 'Opera'
};

// Function to update Application button preview dynamically
function updateAppButtonPreview(buttonId) {
    const appId = document.getElementById(`${buttonId}.appId`).value;
    const label = appId ? applicationNames[appId] || 'Custom App' : 'Custom App';

    // Auto-generate tooltip header and text based on application name
    const tooltipHeader = label;
    const tooltipText = `This launches the ${label} application.`;

    // Update preview button label
    const labelElement = document.getElementById(`${buttonId}Label`);
    if (labelElement) {
        // For application buttons, break at spaces to ensure all text fits without truncation
        labelElement.replaceChildren();
        const parts = label.split(' ');
        parts.forEach((part, index) => {
            if (index > 0) {
                labelElement.appendChild(document.createElement('br'));
            }
            if (part) {
                labelElement.appendChild(document.createTextNode(part));
            }
        });
    }

    // Update button title attribute for browser tooltip and add application class
    const previewButton = document.getElementById(`${buttonId}Preview`);
    if (previewButton) {
        previewButton.title = `${tooltipHeader}\n\n${tooltipText}`;
        // Add class to identify this as an application button for CSS styling
        previewButton.classList.add('application-button');
    }

    // Tooltip preview has been removed from HTML, so no need to update it

    // Update position preview when button details change
    updatePositionPreview();
}

// Updated function to validate unique positions for all buttons (including dynamic ones)
function validateUniquePositions() {
    const positionSelects = [
        'usb.position',
        'volume.position',
        'voice.position',
        'signOut.position'
    ];
    
    // Add all custom URL button positions
    for (let i = 1; i <= dynamicUrlButtonCount; i++) {
        positionSelects.push(`customUrl${i}.position`);
    }
    
    // Add all custom Application button positions
    for (let i = 1; i <= dynamicAppButtonCount; i++) {
        positionSelects.push(`customApp${i}.position`);
    }

    const usedPositions = new Map(); // Map position to button ID that uses it
    const conflicts = new Set(); // Set of positions that have conflicts

    // Collect all selected positions
    positionSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select && select.value && select.value !== '') {
            // For predefined buttons, check if they're enabled
            const isPredefinedButton = ['usb.position', 'volume.position', 'voice.position', 'signOut.position'].includes(selectId);
            let isEnabled = true;
            
            if (isPredefinedButton) {
                const buttonId = selectId.replace('.position', '');
                const enabledCheckbox = document.getElementById(`${buttonId}.enabled`);
                isEnabled = enabledCheckbox && enabledCheckbox.checked;
            }
            
            if (isEnabled) {
                const position = select.value;
                if (usedPositions.has(position)) {
                    // Conflict detected
                    conflicts.add(position);
                } else {
                    usedPositions.set(position, selectId);
                }
            }
        }
    });

    // Update visual indicators for conflicts
    positionSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            // For predefined buttons, check if they're enabled
            const isPredefinedButton = ['usb.position', 'volume.position', 'voice.position', 'signOut.position'].includes(selectId);
            let isEnabled = true;
            
            if (isPredefinedButton) {
                const buttonId = selectId.replace('.position', '');
                const enabledCheckbox = document.getElementById(`${buttonId}.enabled`);
                isEnabled = enabledCheckbox && enabledCheckbox.checked;
            }
            
            const position = select.value;
            // Try to find a sensible container to place the conflict indicator for both predefined and custom buttons
            let positionSelector = select.closest('.position-selector') || select.closest('.position-selector-container');
            if (!positionSelector) {
                // Fallbacks for custom URL/Application button layouts
                positionSelector = select.closest('.url-inputs') || select.closest('.button-fields') || select.parentElement;
            }
            // Prefer to place the indicator right next to the select element
            const indicatorContainer = select.parentElement || positionSelector;

            if (isEnabled && position && conflicts.has(position)) {
                // Check if conflict indicator already exists in the select's parent container
                const selectParentContainer = select.parentElement.parentElement;
                let conflictIndicator = selectParentContainer.querySelector('.conflict-indicator');
                if (!conflictIndicator) {
                    conflictIndicator = document.createElement('div');
                    conflictIndicator.className = 'conflict-indicator';
                    conflictIndicator.textContent = 'Error: Two or more buttons assigned to the same position.';
                    // Style to appear below the select
                    conflictIndicator.style.display = 'block';
                    conflictIndicator.style.marginTop = '4px';
                    conflictIndicator.style.color = '#e53e3e';
                    conflictIndicator.style.fontSize = '0.875rem';
                    conflictIndicator.style.fontWeight = '500';
                    // Insert after the select element's parent container
                    if (select.parentElement.nextSibling) {
                        selectParentContainer.insertBefore(conflictIndicator, select.parentElement.nextSibling);
                    } else {
                        selectParentContainer.appendChild(conflictIndicator);
                    }
                }
            } else {
                // Remove conflict indicator if it exists in the select's parent container
                const selectParentContainer = select.parentElement.parentElement;
                const conflictIndicator = selectParentContainer.querySelector('.conflict-indicator');
                if (conflictIndicator) {
                    conflictIndicator.remove();
                }
            }
        }
    });

    // Update position preview
    updatePositionPreview();

    // Return true if no conflicts, false if conflicts exist
    return conflicts.size === 0;
}

// Updated function to update the Morphic bar preview
function updatePositionPreview() {
    const topButtonsContainer = document.getElementById('topCustomButtonsContainer');
    const bottomButtonsContainer = document.getElementById('customButtonsContainer');
    const topButtonSources = document.getElementById('topButtonSources');
    const bottomButtonSources = document.getElementById('buttonSources');

    if ((!topButtonsContainer && !bottomButtonsContainer) || (!topButtonSources && !bottomButtonSources)) {
        return;
    }

    // Clear existing content
    if (topButtonsContainer) topButtonsContainer.replaceChildren();
    if (bottomButtonsContainer) bottomButtonsContainer.replaceChildren();
    if (topButtonSources) topButtonSources.replaceChildren();
    if (bottomButtonSources) bottomButtonSources.replaceChildren();

    // Define button configurations
    const buttonConfigs = [
        {
            id: 'usb',
            name: 'USB Open/Eject',
            type: 'control',
            displayText: 'USB Drives (All)'
        },
        {
            id: 'volume',
            name: 'Volume Control',
            type: 'control',
            displayText: 'Volume'
        },
        {
            id: 'voice',
            name: 'Voice Control',
            type: 'control',
            displayText: 'Voice Control'
        },
        {
            id: 'signOut',
            name: 'Sign Out',
            type: 'action',
            displayText: 'Sign Out'
        }
    ];
    
    // Add all custom URL buttons dynamically
    for (let i = 1; i <= dynamicUrlButtonCount; i++) {
        const buttonId = `customUrl${i}`;
        buttonConfigs.push({
            id: buttonId,
            name: `Custom URL Button ${i}`,
            type: 'url',
            displayText: () => {
                const labelElement = document.getElementById(`${buttonId}.label`);
                return labelElement ? labelElement.value || 'Custom Button' : 'Custom Button';
            }
        });
    }
    
    // Add all custom Application buttons dynamically
    for (let i = 1; i <= dynamicAppButtonCount; i++) {
        const buttonId = `customApp${i}`;
        buttonConfigs.push({
            id: buttonId,
            name: `Custom Application Button ${i}`,
            type: 'application',
            displayText: () => {
                const appIdElement = document.getElementById(`${buttonId}.appId`);
                const appId = appIdElement ? appIdElement.value : '';
                return appId ? applicationNames[appId] || 'Custom App' : 'Custom App';
            }
        });
    }

    const positionAssignments = new Map(); // Track which buttons are assigned to which positions
    const sourceInfo = [];
    const conflicts = [];

    // Collect position assignments
    buttonConfigs.forEach(config => {
        const select = document.getElementById(`${config.id}.position`);
        if (select && select.value && select.value !== '') {
            const position = parseInt(select.value);
            if (!positionAssignments.has(position)) {
                positionAssignments.set(position, []);
            }
            positionAssignments.get(position).push(config);
        }
    });

    // Check for conflicts and create ordered button list
    const orderedButtons = [];
    for (let pos = 1; pos <= 3; pos++) {
        const assignedButtons = positionAssignments.get(pos) || [];

        if (assignedButtons.length === 1) {
            orderedButtons.push(assignedButtons[0]);
            sourceInfo.push(`Position ${pos}: ${assignedButtons[0].name}`);
        } else if (assignedButtons.length > 1) {
            conflicts.push(`Position ${pos}: ${assignedButtons.map(b => b.name).join(', ')}`);
        }
    }

    // Create button elements for both Morphic bars by cloning existing previews
    const updateContainer = (container) => {
        if (!container) return;

        const createPlaceholder = (positionNumber) => {
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder-button';
            placeholder.textContent = positionNumber.toString();
            return placeholder;
        };

        const renderButton = (button) => {
            if (button.type === 'control' || button.type === 'action') {
                const buttonSection = document.getElementById(`${button.id}Button`);
                if (buttonSection) {
                    const sourceElement = buttonSection.querySelector('.preview-button-group');
                    if (sourceElement) {
                        return sourceElement.cloneNode(true);
                    }
                }
                // Fallback: create a simple button if the source element doesn't exist
                const newButton = document.createElement('div');
                newButton.className = 'preview-button';
                const span = document.createElement('span');
                span.textContent = button.displayText;
                newButton.appendChild(span);
                return newButton;
            }
            if (button.type === 'url') {
                const labelInput = document.getElementById(`${button.id}.label`);
                const labelValue = labelInput ? labelInput.value : 'Custom Button';
                const newButton = document.createElement('div');
                newButton.className = 'preview-button url-button';
                const span = document.createElement('span');
                span.replaceChildren();
                if (labelValue) {
                    const parts = labelValue.split('\\n');
                    parts.forEach((part, index) => {
                        if (index > 0) span.appendChild(document.createElement('br'));
                        if (part) span.appendChild(document.createTextNode(part));
                    });
                } else {
                    span.appendChild(document.createTextNode('Button\nText'));
                }
                newButton.appendChild(span);
                return newButton;
            }
            if (button.type === 'application') {
                const appIdElement = document.getElementById(`${button.id}.appId`);
                const appId = appIdElement ? appIdElement.value : '';
                const appName = appId ? applicationNames[appId] || 'Custom App' : 'Custom App';
                const newButton = document.createElement('div');
                newButton.className = 'preview-button url-button application-button';
                const span = document.createElement('span');
                span.replaceChildren();
                const parts = appName.split(' ');
                parts.forEach((part, index) => {
                    if (index > 0) span.appendChild(document.createElement('br'));
                    span.appendChild(document.createTextNode(part));
                });
                newButton.appendChild(span);
                return newButton;
            }
            return null;
        };

        const row = document.createElement('div');
        row.className = 'placeholder-buttons-container';
        for (let pos = 1; pos <= 3; pos++) {
            const assigned = positionAssignments.get(pos) || [];
            if (assigned.length === 1) {
                const node = renderButton(assigned[0]);
                row.appendChild(node || createPlaceholder(pos));
            } else {
                row.appendChild(createPlaceholder(pos));
            }
        }
        container.appendChild(row);
    };

    // Update both containers
    updateContainer(topButtonsContainer);
    updateContainer(bottomButtonsContainer);

    // Generate source information HTML
    const generateSourcesHTML = () => {
        const container = document.createDocumentFragment();

        const div = document.createElement('div');
        div.style.marginBottom = '8px';
        div.textContent = 'Errors:';
        div.style.fontWeight = 'bold';
        div.appendChild(document.createElement('br'));
        container.appendChild(div);
        //sourcesHTML += '<div style="margin-bottom: 8px;"><strong>Conflicts:</strong></div>';

        if (conflicts.length > 0) {
            conflicts.forEach(conflict => {
                //sourcesHTML += `<div class="button-source-item conflict">⚠️ ${conflict}</div>`;
                const div2 = document.createElement('div');
                div2.className = 'button-source-item conflict';
                div2.textContent = '⚠️ ' + conflict;
                div2.appendChild(document.createElement('br'));
                container.appendChild(div2);
            });
        } else {
            //sourcesHTML += '<div class="button-source-item">No conflicts</div>';
            const div3 = document.createElement('div');
            div3.className = 'button-source-item';
            div3.textContent = 'No errors';
            div3.appendChild(document.createElement('br'));
            container.appendChild(div3);
        }

        return container;
    };

    // Update both button sources containers
    //if (topButtonSources) topButtonSources.innerHTML = generateSourcesHTML();
    //if (bottomButtonSources) bottomButtonSources.innerHTML = generateSourcesHTML();

    if (topButtonSources) topButtonSources.replaceChildren(generateSourcesHTML());
    if (bottomButtonSources) bottomButtonSources.replaceChildren(generateSourcesHTML());
}
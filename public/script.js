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
    function createSettingRow(label, value, stepNumber = null, elementId = null) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = label;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        
        // Create a container for value and edit button
        const valueContainer = document.createElement('div');
        valueContainer.style.display = 'flex';
        valueContainer.style.alignItems = 'center';
        valueContainer.style.gap = '0.5rem';
        valueContainer.style.justifyContent = 'space-between';
        
        const valueText = document.createElement('span');
        valueText.textContent = value;
        valueContainer.appendChild(valueText);
        
        // Add edit button if stepNumber and elementId are provided
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
            valueContainer.appendChild(editButton);
        }
        
        valueDiv.appendChild(valueContainer);
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
    createSettingRow('Enable AT-on-Demand (Available for Windows Only)', 
        document.getElementById('features.atOnDemand.enabled').checked ? 'True' : 'False', 1, 'features.atOnDemand.enabled');
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

    // Custom buttons
    const customButtons = collectPredefinedButtons();

    // Separate application buttons and URL buttons
    const applicationButtons = customButtons.filter(button => button.type === 'application');
    const urlButtons = customButtons.filter(button => button.type === 'link');

    // Display application buttons first
    applicationButtons.forEach((button, index) => {
        createSettingRow(`Custom Application ${index + 1}`, button.label || 'Not set', 2, `customApp${index + 1}.enabled`);
    });

    // Add horizontal line if both application and URL buttons exist
    if (applicationButtons.length > 0 && urlButtons.length > 0) {
        const hr = document.createElement('hr');
        hr.style.cssText = 'margin: 15px 0; border: none; border-top: 1px solid #ddd; grid-column: 1 / -1;';
        summaryContent.appendChild(hr);
    }

    // Display URL buttons
    urlButtons.forEach((button, index) => {
        createSettingRow(`Custom URL Button ${index + 1} Text`, button.label || 'Not set', 2, `customUrl${index + 1}.enabled`);
        createSettingRow(`Custom URL Button ${index + 1} Tooltip Header`, button.tooltipHeader || 'Not set', 2, `customUrl${index + 1}.enabled`);
        createSettingRow(`Custom URL Button ${index + 1} Tooltip Text`, button.tooltipText || 'Not set', 2, `customUrl${index + 1}.enabled`);
        createSettingRow(`Custom URL Button ${index + 1} URL`, button.url || 'Not set', 2, `customUrl${index + 1}.enabled`);
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
        'features.atUseCounter.enabled': false,
        'enableDelayMorphic': false,
        'hideMorphicAfterLoginUntil': '',
        'features.atOnDemand.enabled': false,
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
    document.getElementById('features.atOnDemand.enabled').checked = defaults['features.atOnDemand.enabled'];
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

const checkbox = document.getElementById('features.atOnDemand.enabled');
checkbox.indeterminate = true;


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

    // Helper to set classes
    const setStatus = (state) => {
        if (!statusEl) return;
        statusEl.classList.remove('loading', 'success', 'error');
        if (state) statusEl.classList.add(state);
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

    // Best-effort reachability check
    let reachable = false;
    try {
        // Try CORS-aware fetch first
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(finalUrl, { method: 'HEAD', mode: 'cors', redirect: 'follow', signal: controller.signal });
        clearTimeout(timeout);
        // If we can read a response and it's ok or redirected, consider reachable
        reachable = response && (response.ok || (response.status >= 200 && response.status < 400));
    } catch (e1) {
        // Fallback to no-cors (opaque) GET; success of the promise means at least network didn't immediately fail
        try {
            const controller2 = new AbortController();
            const timeout2 = setTimeout(() => controller2.abort(), 5000);
            await fetch(finalUrl, { method: 'GET', mode: 'no-cors', redirect: 'follow', cache: 'no-store', signal: controller2.signal });
            clearTimeout(timeout2);
            reachable = true; // opaque but resolved
        } catch (e2) {
            reachable = false;
        }
    }

    // Update indicator
    if (reachable) {
        setStatus('success');
    } else {
        setStatus('error');
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

//Tests a URL by opening it in a new tab (legacy function - kept for compatibility)
async function testURL(inputId) {
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

    // Helper to set classes
    const setStatus = (state) => {
        if (!statusEl) return;
        statusEl.classList.remove('loading', 'success', 'error');
        if (state) statusEl.classList.add(state);
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

    // Best-effort reachability check
    let reachable = false;
    try {
        // Try CORS-aware fetch first
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(finalUrl, { method: 'HEAD', mode: 'cors', redirect: 'follow', signal: controller.signal });
        clearTimeout(timeout);
        // If we can read a response and it's ok or redirected, consider reachable
        reachable = response && (response.ok || (response.status >= 200 && response.status < 400));
    } catch (e1) {
        // Fallback to no-cors (opaque) GET; success of the promise means at least network didn't immediately fail
        try {
            const controller2 = new AbortController();
            const timeout2 = setTimeout(() => controller2.abort(), 5000);
            await fetch(finalUrl, { method: 'GET', mode: 'no-cors', redirect: 'follow', cache: 'no-store', signal: controller2.signal });
            clearTimeout(timeout2);
            reachable = true; // opaque but resolved
        } catch (e2) {
            reachable = false;
        }
    }

    // Update indicator
    if (reachable) {
        setStatus('success');
    } else {
        setStatus('error');
    }

    // Re-enable button
    if (testBtn) testBtn.disabled = false;

    // Open in new tab regardless, but warn if popup blocked
    try {
        const newWindow = window.open(finalUrl, '_blank');
        if (!newWindow) {
            alert('Popup blocked. Please allow popups for this site to test URLs, or manually copy and test the URL: ' + finalUrl);
        }
    } catch (error) {
        console.error('Error opening URL:', error);
        if (reachable) {
            alert('The URL appears reachable, but the browser blocked opening a new tab.');
        } else {
            alert('Unable to open URL. It may be unreachable.');
        }
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

// Collects predefined button configurations for download
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
                if (config.feature === 'signout') {
                    buttonData.label = "Sign\nOut";
                    buttonData.tooltipHeader = "Sign Out";
                    buttonData.tooltipText = "Sign out of this computer";
                    buttonData.function = "signOut";
                } else {
                    buttonData.feature = config.feature;
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
    document.getElementById('features.atOnDemand.enabled').checked =
        config.features?.atOnDemand?.enabled ?? false;
    document.getElementById('features.atUseCounter.enabled').checked =
        config.features?.atUseCounter?.enabled ?? false;
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

// Function to generate and download PDF using Print.js and html2canvas
async function generatePDF() {
    const step3Element = document.getElementById('step3');
    const morphicBarPreview = step3Element.querySelector('.morphic-bar-preview');
    const downloadSection = step3Element.querySelector('.download-section');
    const navSection = step3Element.querySelector('.step-navigation');
    let tempImage = null;

    // A single cleanup function to restore the original state
    const cleanup = () => {
        if (morphicBarPreview) morphicBarPreview.style.display = '';
        if (downloadSection) downloadSection.style.display = '';
        if (navSection) navSection.style.display = '';
        if (tempImage) tempImage.remove();
    };

    try {
        if (!step3Element || !morphicBarPreview || !downloadSection || !navSection) {
            console.error('Required elements for PDF generation not found');
            return false;
        }

        // 1. Generate a high-quality canvas from the MorphicBar preview
        const canvas = await html2canvas(morphicBarPreview, {
            scale: 2, // Use a higher scale for a sharper image
            useCORS: true,
            logging: false
        });
        const imageDataUrl = canvas.toDataURL('image/png');

        // 2. Prepare the document for printing
        tempImage = document.createElement('img');
        tempImage.src = imageDataUrl;
        tempImage.style.width = '100%';
        tempImage.id = 'temp-morphic-bar-image';
        
        morphicBarPreview.style.display = 'none'; // Hide the original HTML preview
        downloadSection.style.display = 'none';
        navSection.style.display = 'none';
        
        // Insert the new image in place of the original preview
        morphicBarPreview.parentNode.insertBefore(tempImage, morphicBarPreview);

        // 3. Use Print.js to generate the PDF from the modified HTML
        printJS({
            printable: 'step3',
            type: 'html',
            header: `
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #486284; font-size: 24px;">Morphic Configuration Summary</h1>
                    <p style="color: #333;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                </div>
            `,
            targetStyles: ['*'],
            documentTitle: 'Morphic Configuration Summary',
            onPrintDialogClose: cleanup, // Cleanup when the print dialog is closed
            onError: (error) => {
                console.error('Error with Print.js:', error);
                alert('An error occurred during printing.');
                cleanup(); // Ensure cleanup happens on error too
            }
        });

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error preparing the PDF. Please try again.');
        cleanup(); // Call cleanup if any part of the process fails
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
            "atOnDemand": {
                "enabled": document.getElementById('features.atOnDemand.enabled').checked
            },
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
                if (indicatorContainer) {
                    // Add conflict indicator if it doesn't exist next to the select
                    let conflictIndicator = indicatorContainer.querySelector('.conflict-indicator');
                    if (!conflictIndicator) {
                        conflictIndicator = document.createElement('span');
                        conflictIndicator.className = 'conflict-indicator';
                        conflictIndicator.textContent = 'Conflict';
                        // Ensure it appears inline next to the select
                        conflictIndicator.style.display = 'inline-block';
                        conflictIndicator.style.marginLeft = '6px';
                        // Insert right after the select element when possible
                        if (select.nextSibling) {
                            select.parentElement.insertBefore(conflictIndicator, select.nextSibling);
                        } else {
                            indicatorContainer.appendChild(conflictIndicator);
                        }
                    }
                }
            } else {
                // Remove conflict indicator if it exists
                const containersToCheck = [indicatorContainer, positionSelector].filter(Boolean);
                containersToCheck.forEach(container => {
                    const conflictIndicator = container.querySelector('.conflict-indicator');
                    if (conflictIndicator) {
                        conflictIndicator.remove();
                    }
                });
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
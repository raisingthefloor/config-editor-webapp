// Step navigation variables
let currentStep = 1;
const totalSteps = 3;

// Application button management
let appButtonCount = 1; // Start with 1 (the first button is always there)

// Helper: show add button only if any application is enabled
function updateAddAppVisibility() {
    const anyChecked = ['customApp1', 'customApp2', 'customApp3'].some(id => {
        const cb = document.getElementById(`${id}.enabled`);
        return cb && cb.checked;
    });
    const addButtonContainer = document.getElementById('addAppButtonContainer');
    if (addButtonContainer) {
        addButtonContainer.style.display = anyChecked ? 'block' : 'none';
    }
}

// Helper: show add URL button only if any URL button is enabled
function updateAddUrlVisibility() {
    const anyChecked = ['customUrl1', 'customUrl2', 'customUrl3'].some(id => {
        const cb = document.getElementById(`${id}.enabled`);
        return cb && cb.checked;
    });
    const addUrlButtonContainer = document.getElementById('addUrlButtonContainer');
    if (addUrlButtonContainer) {
        addUrlButtonContainer.style.display = anyChecked ? 'block' : 'none';
    }
}

function addApplicationButton() {
    if (appButtonCount >= 3) {
        alert('You cannot add more than 3 application buttons');
        return;
    }
    
    appButtonCount++;
    const buttonNumber = appButtonCount;
    const button = document.getElementById(`customApp${buttonNumber}`);
    
    if (button) {
        button.style.display = 'block';
        updateAddButtonState();
        updateAddAppVisibility();
    }
}

function removeApplicationButton(buttonNumber) {
    const button = document.getElementById(`customApp${buttonNumber}`);
    if (button) {
        // Reset the button state
        const checkbox = document.getElementById(`customApp${buttonNumber}.enabled`);
        const positionContainer = document.getElementById(`customApp${buttonNumber}.positionContainer`);
        const inputs = document.getElementById(`customApp${buttonNumber}.inputs`);
        const positionSelect = document.getElementById(`customApp${buttonNumber}.position`);
        const appSelect = document.getElementById(`customApp${buttonNumber}.appId`);
        
        if (checkbox) checkbox.checked = false;
        if (positionContainer) positionContainer.style.display = 'none';
        if (inputs) inputs.style.display = 'none';
        if (positionSelect) positionSelect.value = '';
        if (appSelect) appSelect.value = '';
        
        // Hide the button
        button.style.display = 'none';
        appButtonCount--;
        updateAddButtonState();
        updateAddAppVisibility();
        updatePositionPreview();
        validateUniquePositions();
    }
}

function clearDynamicAppButtons() {
    // Hide buttons 2 and 3
    for (let i = 2; i <= 3; i++) {
        const button = document.getElementById(`customApp${i}`);
        if (button) {
            // Reset the button state
            const checkbox = document.getElementById(`customApp${i}.enabled`);
            const positionContainer = document.getElementById(`customApp${i}.positionContainer`);
            const inputs = document.getElementById(`customApp${i}.inputs`);
            const positionSelect = document.getElementById(`customApp${i}.position`);
            const appSelect = document.getElementById(`customApp${i}.appId`);
            
            if (checkbox) checkbox.checked = false;
            if (positionContainer) positionContainer.style.display = 'none';
            if (inputs) inputs.style.display = 'none';
            if (positionSelect) positionSelect.value = '';
            if (appSelect) appSelect.value = '';
            
            // Hide the button
            button.style.display = 'none';
        }
    }
    appButtonCount = 1;
    updateAddButtonState();
    updateAddAppVisibility();
}

function updateAddButtonState() {
    const addButton = document.getElementById('addAppButton');
    if (addButton) {
        if (appButtonCount >= 3) {
            addButton.disabled = true;
            addButton.textContent = 'Maximum 3 buttons reached';
        } else {
            addButton.disabled = false;
            addButton.textContent = '+ Add Application Button';
        }
    }

    // URL buttons add state
    const addUrlBtn = document.getElementById('addUrlButton');
    if (addUrlBtn) {
        const url2 = document.getElementById('customUrl2');
        const url3 = document.getElementById('customUrl3');
        const visibleCount = 1 + (url2 && url2.style.display !== 'none' ? 1 : 0) + (url3 && url3.style.display !== 'none' ? 1 : 0);
        addUrlBtn.disabled = visibleCount >= 3;
        addUrlBtn.textContent = visibleCount >= 3 ? 'Maximum 3 buttons reached' : '+ Add URL Button';
    }
}

// Function to update settings summary
function updateSettingsSummary() {
    const summaryContent = document.getElementById('settingsSummary');
    if (!summaryContent) return;

    // Clear existing content
    summaryContent.replaceChildren();

    // Helper function to create a setting row
    function createSettingRow(label, value) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = label;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        valueDiv.textContent = value;

        summaryContent.appendChild(labelDiv);
        summaryContent.appendChild(valueDiv);
    }

    // Basic settings
    createSettingRow('Organization Name', document.getElementById('organizationName').value || 'Not set');
    createSettingRow('Site ID', document.getElementById('telemetry.siteId').value || 'Not set');

    // Features
    createSettingRow('Open Morphic Automatically at Login', 
        document.getElementById('features.autorunAfterLogin.enabled').checked ? 'True' : 'False');
    createSettingRow('See Which Accessibility Features are Helpful', 
        document.getElementById('features.atUseCounter.enabled').checked ? 'True' : 'False');
    createSettingRow('Delay Showing Morphic to Compare Before & After', 
        document.getElementById('enableDelayMorphic').checked ? 'True' : 'False');
    if (document.getElementById('enableDelayMorphic').checked) {
        createSettingRow('Show Morphic Bar On', 
            document.getElementById('hideMorphicAfterLoginUntil').value || 'Not set');
    }
    createSettingRow('Enable AT-on-Demand (Available for Windows Only)', 
        document.getElementById('features.atOnDemand.enabled').checked ? 'True' : 'False');
    createSettingRow('Enable Custom MorphicBars', 
        document.getElementById('features.customMorphicBars.enabled').checked ? 'True' : 'False');
    createSettingRow('Enable Check for Updates with each Launch', 
        document.getElementById('features.checkForUpdates.enabled').checked ? 'True' : 'False');
    createSettingRow('MorphicBar Visibility after Login', 
        document.getElementById('morphicBar.visibilityAfterLogin').value);
    createSettingRow('MorphicBar Default Location', 
        document.getElementById('morphicBar.defaultLocation').value);
    createSettingRow('Reset 5 Windows Settings to Default', 
        document.getElementById('features.resetSettings.enabled').checked ? 'True' : 'False');

    // Custom buttons
    const customButtons = collectPredefinedButtons();
    customButtons.forEach((button, index) => {
        if (button.type === 'link') {
            createSettingRow(`Custom URL Button ${index + 1} Text`, button.label || 'Not set');
            createSettingRow(`Custom URL Button ${index + 1} Tooltip Header`, button.tooltipHeader || 'Not set');
            createSettingRow(`Custom URL Button ${index + 1} Tooltip Text`, button.tooltipText || 'Not set');
            createSettingRow(`Custom URL Button ${index + 1} URL`, button.url || 'Not set');
        } else if (button.type === 'application') {
            createSettingRow(`Custom Application ${index + 1}`, button.label || 'Not set');
        }
    });
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
    
    // Update settings summary when showing step 3
    if (stepNumber === 3) {
        updateSettingsSummary();
    }
    
    currentStep = stepNumber;
}

function nextStep() {
    if (currentStep < totalSteps) {
        showStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function clearStep() {
    // TODO: Implement clear functionality for each step
    // This will be implemented later as requested
    console.log('Clear button clicked for step:', currentStep);
}

// Allow clicking on step indicators to navigate
function initStepNavigation() {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.addEventListener('click', () => {
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
        showStep(1); // Start with step 1
        // Config Builder page setup
        document.getElementById('upload')?.addEventListener('change', handleFileUpload);
        document.getElementById('download')?.addEventListener('click', handleDownloadClick);
        document.getElementById('checkErrors')?.addEventListener('click', checkForErrors);
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
document.getElementById('visibility-toggle').addEventListener('click', function(e) {
    e.preventDefault();
    toggleDescription('visibility');
});

document.getElementById('location-toggle').addEventListener('click', function(e) {
    e.preventDefault();
    toggleDescription('location');
});

// Test URL button handlers
document.getElementById('testUrl1Btn').addEventListener('click', function() {
    testURL('customUrl1.url');
});

document.getElementById('testUrl2Btn').addEventListener('click', function() {
    testURL('customUrl2.url');
});

document.getElementById('testUrl3Btn').addEventListener('click', function() {
    testURL('customUrl3.url');
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
    const resetCheckbox = document.getElementById('features.resetSettings.enabled');
    const resetLabel = document.getElementById('features.resetSettings.label');


    if (autorunEnabled) {
        // Enable dependent options when autorun is enabled
        scopeSelect.disabled = false;
        resetCheckbox.disabled = false;
        scopeLabel.disabled = false;
        resetLabel.disabled = false;
        // Remove visual styling for disabled state
        scopeSelect.style.opacity = '1';
        resetCheckbox.style.opacity = '1';
        scopeLabel.style.opacity = '1';
        resetLabel.style.opacity = '1';
        scopeSelect.style.cursor = 'pointer';
        resetCheckbox.style.cursor = 'pointer';
    }
    else {
        // Disable dependent options when autorun is disabled
        scopeSelect.disabled = true;
        resetCheckbox.disabled = true;
        scopeLabel.disabled = true;
        resetLabel.disabled = true;
        // Set default values when disabled
        scopeSelect.value = 'allLocalUsers';
        resetCheckbox.checked = false;

        // Add visual styling to indicate disabled state
        scopeSelect.style.opacity = '0.6';
        resetCheckbox.style.opacity = '0.6';
        scopeLabel.style.opacity = '0.6';
        resetLabel.style.opacity = '0.6';
        scopeSelect.style.cursor = 'not-allowed';
        resetCheckbox.style.cursor = 'not-allowed';
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
    const errorMessages = document.getElementById('errorMessages');
    const successMessage = document.getElementById('successMessage');
    const downloadBtn = document.getElementById('download');

    if (errorMessages) errorMessages.style.display = 'none';
    if (successMessage) successMessage.style.display = 'none';
    if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.classList.add('disabled');
    }
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
        const positionSelects = ['usb.position', 'volume.position', 'voice.position', 'customUrl1.position', 'customUrl2.position', 'customUrl3.position', 'customApp1.position', 'customApp2.position', 'customApp3.position', 'signOut.position'];

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
                        positionContainer.style.display = 'flex';
                    } else {
                        positionContainer.style.display = 'none';
                        // Reset position selection when unchecked
                        const positionSelect = document.getElementById(`${buttonId}.position`);
                        if (positionSelect) {
                            positionSelect.value = '';
                            updatePositionPreview();
                            validateUniquePositions();
                        }
                    }
                });
            }
        });

        // Add event listeners for application button checkboxes
        const appButtonIds = ['customApp1', 'customApp2', 'customApp3'];
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
                        if (positionContainer) positionContainer.style.display = 'flex';
                        if (inputs) inputs.style.display = 'flex';
                        updateAddAppVisibility();
                    } else {
                        if (positionContainer) positionContainer.style.display = 'none';
                        if (inputs) inputs.style.display = 'none';
                        // Reset position selection when unchecked
                        if (positionSelect) {
                            positionSelect.value = '';
                            updatePositionPreview();
                            validateUniquePositions();
                        }
                        // If the first app is unchecked, clear dynamic apps; then update visibility
                        if (buttonId === 'customApp1') {
                            clearDynamicAppButtons();
                        }
                        updateAddAppVisibility();
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
        // First, hide all app buttons 2 and 3 initially
        const app2 = document.getElementById('customApp2');
        const app3 = document.getElementById('customApp3');
        if (app2) app2.style.display = 'none';
        if (app3) app3.style.display = 'none';
        
        // Force hide the add button containers initially
        const addAppContainer = document.getElementById('addAppButtonContainer');
        const addUrlContainer = document.getElementById('addUrlButtonContainer');
        if (addAppContainer) {
            addAppContainer.style.display = 'none';
        }
        if (addUrlContainer) {
            addUrlContainer.style.display = 'none';
        }
        
        // Then update add button visibility based on current checkbox states
        updateAddAppVisibility();
        updateAddUrlVisibility();

        // Add button functionality
        if (addButton) {
            addButton.addEventListener('click', addApplicationButton);
        }

        // URL buttons add functionality
        const addUrlButton = document.getElementById('addUrlButton');
        if (addUrlButton) {
            addUrlButton.addEventListener('click', function() {
                const url2 = document.getElementById('customUrl2');
                const url3 = document.getElementById('customUrl3');
                if (url2 && url2.style.display === 'none') {
                    url2.style.display = 'block';
                } else if (url3 && url3.style.display === 'none') {
                    url3.style.display = 'block';
                }
                updateAddButtonState();
                updateAddUrlVisibility();
                updatePositionPreview();
            });
        }

        // Add event listeners for URL button enable checkboxes (toggle inputs/preview only)
        const urlButtonIds = ['customUrl1', 'customUrl2', 'customUrl3'];
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
                };

                // Set initial
                applyState();

                checkbox.addEventListener('change', function() {
                    applyState();
                    if (!this.checked && positionSelector) {
                        positionSelector.value = '';
                        updatePositionPreview();
                        validateUniquePositions();
                    } else {
                        updatePositionPreview();
                    }
                });
            }
        });

    // Add event listeners for custom URL inputs to update preview
    const customUrlIds = ['customUrl1', 'customUrl2', 'customUrl3'];
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
    const customAppIds = ['customApp1', 'customApp2', 'customApp3'];
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

//Tests a URL by opening it in a new tab
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
    const buttonIds = ['usb', 'volume', 'voice', 'signOut', 'customUrl1', 'customUrl2', 'customUrl3', 'customApp1', 'customApp2', 'customApp3'];
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
            const customButtons = ['customUrl1', 'customUrl2', 'customUrl3'];
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
            const customAppButtons = ['customApp1', 'customApp2', 'customApp3'];
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
    // Define all button configurations
    const buttonConfigs = [
        { id: 'usb', type: 'control', feature: 'usbopeneject' },
        { id: 'volume', type: 'control', feature: 'volume' },
        { id: 'voice', type: 'control', feature: 'voice' },
        { id: 'signOut', type: 'action', feature: 'signout' },
        { id: 'customUrl1', type: 'link' },
        { id: 'customUrl2', type: 'link' },
        { id: 'customUrl3', type: 'link' },
        { id: 'customApp1', type: 'application' },
        { id: 'customApp2', type: 'application' },
        { id: 'customApp3', type: 'application' }
    ];

    // Collect buttons that have positions assigned
    const positionedButtons = [];

    buttonConfigs.forEach(config => {
        // For predefined buttons, check if they're enabled first
        const isPredefinedButton = ['usb', 'volume', 'voice', 'signOut'].includes(config.id);
        let isEnabled = true;
        
        if (isPredefinedButton) {
            const enabledCheckbox = document.getElementById(`${config.id}.enabled`);
            isEnabled = enabledCheckbox && enabledCheckbox.checked;
        }
        
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

// Handle download button click - check if validation has been done
async function handleDownloadClick() {
    const downloadBtn = document.getElementById('download');
    if (downloadBtn.disabled) {
        alert('Please check for errors first by clicking the "Check for Errors" button.');
        return;
    }

    // Disable the download button while processing
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Generating Files...';

    try {
        // Download config.json
        downloadConfig();
        
        // Generate and download PDF
        await generatePDF();
        
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

// Check for errors and validate the form
function checkForErrors() {
    const errorMessages = document.getElementById('errorMessages');
    const successMessage = document.getElementById('successMessage');
    const downloadBtn = document.getElementById('download');

    // Clear previous messages
    errorMessages.style.display = 'none';
    successMessage.style.display = 'none';
    errorMessages.replaceChildren();

    const errors = [];

    // Validate unique positions
    if (!validateUniquePositions()) {
        errors.push('Duplicate button positions detected. Each button must have a unique position (1, 2, or 3).');
    }

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

    // Validate custom URL buttons have all required fields if position is selected
    const customUrlButtons = ['customUrl1', 'customUrl2', 'customUrl3'];
    customUrlButtons.forEach(buttonId => {
        const position = document.getElementById(`${buttonId}.position`).value;
        if (position) {
            const label = document.getElementById(`${buttonId}.label`).value.trim();
            const url = document.getElementById(`${buttonId}.url`).value.trim();
            const tooltipHeader = document.getElementById(`${buttonId}.tooltipHeader`).value.trim();
            const tooltipText = document.getElementById(`${buttonId}.tooltipText`).value.trim();

            if (!label) {
                errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')} (Position ${position}): Button Text is required.`);
            }
            if (!url) {
                errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')} (Position ${position}): URL is required.`);
            } else {
                // Basic URL validation
                if (!url.startsWith('http://') && !url.startsWith('https://') && !url.includes('.')) {
                    errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')} (Position ${position}): URL appears to be invalid.`);
                }
            }
            if (!tooltipHeader) {
                errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')} (Position ${position}): Tooltip Header is required.`);
            }
            if (!tooltipText) {
                errors.push(`${buttonId.replace('customUrl', 'Custom URL Button ')} (Position ${position}): Tooltip Text is required.`);
            }
        }
    });

    // Validate custom application buttons have all required fields if position is selected
    const customAppButtons = ['customApp1', 'customApp2', 'customApp3'];
    customAppButtons.forEach(buttonId => {
        const position = document.getElementById(`${buttonId}.position`).value;
        if (position) {
            const appId = document.getElementById(`${buttonId}.appId`).value.trim();

            if (!appId) {
                errors.push(`${buttonId.replace('customApp', 'Custom Application Button ')} (Position ${position}): Application selection is required.`);
            }
        }
    });

    // Validate hide until date if delay morphic is enabled and date is provided
    if (delayMorphicEnabled && morphicShowDate) {
        const selectedDate = new Date(morphicShowDate);
        const today = new Date();
        if (selectedDate <= today) {
            errors.push('Date to show MorphicBar must be in the future.');
        }
    }



    // Display results

    if (errors.length > 0) {
        const h4 = document.createElement('h4');
        h4.textContent = 'Errors found:';
        const ul = document.createElement('ul');
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            ul.appendChild(li)
        })
        errorMessages.style.display = 'block';
        downloadBtn.disabled = true;
        downloadBtn.classList.add('disabled');
        errorMessages.replaceChildren(h4, ul);
    }
    else {
        successMessage.style.display = 'block';
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('disabled');
    }
}

function downloadConfig() {
    // All validation should already be done by checkForErrors()

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

// Updated function to validate unique positions for predefined buttons
function validateUniquePositions() {
    const positionSelects = [
        'usb.position',
        'volume.position',
        'voice.position',
        'signOut.position',
        'customUrl1.position',
        'customUrl2.position',
        'customUrl3.position',
        'customApp1.position',
        'customApp2.position',
        'customApp3.position'
    ];

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
            const positionSelector = select.closest('.position-selector') || select.closest('.position-selector-container');

            if (isEnabled && position && conflicts.has(position)) {
                // Add conflict indicator if it doesn't exist
                let conflictIndicator = positionSelector.querySelector('.conflict-indicator');
                if (!conflictIndicator) {
                    conflictIndicator = document.createElement('div');
                    conflictIndicator.className = 'conflict-indicator';
                    conflictIndicator.textContent = 'Conflict';
                    positionSelector.appendChild(conflictIndicator);
                }
            } else {
                // Remove conflict indicator if it exists
                if (positionSelector) {
                    const conflictIndicator = positionSelector.querySelector('.conflict-indicator');
                    if (conflictIndicator) {
                        conflictIndicator.remove();
                    }
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
        },
        {
            id: 'customUrl1',
            name: 'Custom URL Button 1',
            type: 'url',
            displayText: () => document.getElementById('customUrl1.label').value || 'Custom Button'
        },
        {
            id: 'customUrl2',
            name: 'Custom URL Button 2',
            type: 'url',
            displayText: () => document.getElementById('customUrl2.label').value || 'Custom Button'
        },
        {
            id: 'customUrl3',
            name: 'Custom URL Button 3',
            type: 'url',
            displayText: () => document.getElementById('customUrl3.label').value || 'Custom Button'
        },
        {
            id: 'customApp1',
            name: 'Custom Application Button 1',
            type: 'application',
            displayText: () => {
                const appId = document.getElementById('customApp1.appId').value;
                return appId ? applicationNames[appId] || 'Custom App' : 'Custom App';
            }
        },
        {
            id: 'customApp2',
            name: 'Custom Application Button 2',
            type: 'application',
            displayText: () => {
                const appId = document.getElementById('customApp2.appId').value;
                return appId ? applicationNames[appId] || 'Custom App' : 'Custom App';
            }
        },
        {
            id: 'customApp3',
            name: 'Custom Application Button 3',
            type: 'application',
            displayText: () => {
                const appId = document.getElementById('customApp3.appId').value;
                return appId ? applicationNames[appId] || 'Custom App' : 'Custom App';
            }
        }
    ];

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
                return null;
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
                const appId = document.getElementById(`${button.id}.appId`).value;
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
        div.textContent = 'Conflicts:';
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
            div3.textContent = 'No conflicts';
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
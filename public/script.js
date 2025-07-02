document.getElementById('upload').addEventListener('change', handleFileUpload);
document.getElementById('download').addEventListener('click', handleDownloadClick);
document.getElementById('checkErrors').addEventListener('click', checkForErrors);

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
    else 
    {
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
window.addEventListener('load', function() {
    toggleScopeAccess();
    toggleDelayMorphicAccess();
    updatePositionPreview();
    
    // Add change listeners to reset validation when inputs change
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', resetValidationState);
        input.addEventListener('input', resetValidationState);
    });
});

// Dynamically validate Site ID as user types
document.getElementById('telemetry.siteId').addEventListener('input', validateSiteId);

// Dynamically validate Organization Name as user types
document.getElementById('organizationName').addEventListener('input', validateOrganizationName);

// Add event listeners for position dropdowns to update preview
document.addEventListener('DOMContentLoaded', function() {
    const positionSelects = ['usb.position', 'volume.position', 'voice.position', 'customUrl1.position', 'customUrl2.position', 'customUrl3.position', 'customApp1.position', 'customApp2.position', 'customApp3.position', 'signOut.position'];
    
    positionSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.addEventListener('change', updatePositionPreview);
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
function testURL(inputId) {
    const urlInput = document.getElementById(inputId);
    if (!urlInput) {
        console.error('URL input field not found:', inputId);
        return;
    }
    
    const url = urlInput.value.trim();
    
    // Its valid if empty (but later when checking for errors, we'll make sure it's filled in)
    if (!url) {
        alert('Please enter a URL first');
        urlInput.focus();
        return;
    }
    
    // Basic URL validation - check if it starts with http:// or https://
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // If no protocol specified, assume https://
        finalUrl = 'https://' + url;
        
        // Update the input field to show the corrected URL
        urlInput.value = finalUrl;
    }
    
    // Try to open the URL in a new tab
    try {
        const newWindow = window.open(finalUrl, '_blank');
        if (!newWindow) {
            // If popup was blocked, show an alert
            alert('Popup blocked. Please allow popups for this site to test URLs, or manually copy and test the URL: ' + finalUrl);
        }
    } catch (error) {
        console.error('Error opening URL:', error);
        alert('Error opening URL. Please check if the URL is valid: ' + finalUrl);
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
        const positionSelect = document.getElementById(`${config.id}.position`);
        if (positionSelect && positionSelect.value && positionSelect.value !== '') {
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
            console.log('Parsed config:', config); 
            
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
    // Also provides backward compatibility with old flat dotted notation if needed
    document.getElementById('features.atOnDemand.enabled').checked = 
        config.features?.atOnDemand?.enabled ?? config["features.atOnDemand.enabled"] ?? false;
    document.getElementById('features.atUseCounter.enabled').checked = 
        config.features?.atUseCounter?.enabled ?? config["features.atUseCounter.enabled"] ?? false;
    document.getElementById('features.autorunAfterLogin.enabled').checked = 
        config.features?.autorunAfterLogin?.enabled ?? config["features.autorunAfterLogin.enabled"] ?? true;
    document.getElementById('features.autorunAfterLogin.scope').value = 
        config.features?.autorunAfterLogin?.scope ?? config["features.autorunAfterLogin.scope"] ?? "allLocalUsers";
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

// Handle download button click - check if validation has been done
function handleDownloadClick() {
    const downloadBtn = document.getElementById('download');
    if (downloadBtn.disabled) {
        alert('Please check for errors first by clicking the "Check for Errors" button.');
        return;
    }
    downloadConfig();
}

// Check for errors and validate the form
function checkForErrors() {
    const errorMessages = document.getElementById('errorMessages');
    const successMessage = document.getElementById('successMessage');
    const downloadBtn = document.getElementById('download');
    
    // Clear previous messages
    errorMessages.style.display = 'none';
    successMessage.style.display = 'none';
    errorMessages.innerHTML = '';
    
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
    
    // Note: No need to validate that telemetry is enabled when delay morphic is enabled
    // because the UI now automatically forces telemetry to be enabled and disabled
    // when delay morphic is checked
    
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
        errorMessages.innerHTML = '<h4>Errors found:</h4><ul>' + 
            errors.map(error => `<li>${error}</li>`).join('') + 
            '</ul>';
        errorMessages.style.display = 'block';
        downloadBtn.disabled = true;
        downloadBtn.classList.add('disabled');
    } else {
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
    const label = document.getElementById(`${buttonId}.label`).value || 'Button<br>Text';
    const tooltipHeader = document.getElementById(`${buttonId}.tooltipHeader`).value || 'Header text';
    const tooltipText = document.getElementById(`${buttonId}.tooltipText`).value || 'Description text';
    
    // Update preview button label - convert \n to line breaks
    const labelElement = document.getElementById(`${buttonId}Label`);
    if (labelElement) {
        // Convert \n to <br> tags for HTML display
        const labelWithBreaks = label.replace(/\\n/g, '<br>');
        labelElement.innerHTML = labelWithBreaks;
    }
    
    // Update button title attribute for browser tooltip
    const previewButton = document.getElementById(`${buttonId}Preview`);
    if (previewButton) {
        previewButton.title = `${tooltipHeader}\n\n${tooltipText}`;
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
        const labelWithBreaks = label.replace(/\s/g, '<br>');
        labelElement.innerHTML = labelWithBreaks;
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
            const position = select.value;
            if (usedPositions.has(position)) {
                // Conflict detected
                conflicts.add(position);
            } else {
                usedPositions.set(position, selectId);
            }
        }
    });
    
    // Update visual indicators for conflicts
    positionSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            const position = select.value;
            const positionSelector = select.closest('.position-selector');
            
            if (position && conflicts.has(position)) {
                
                // Add conflict indicator if it doesn't exist
                let conflictIndicator = positionSelector.querySelector('.conflict-indicator');
                if (!conflictIndicator) {
                    conflictIndicator = document.createElement('div');
                    conflictIndicator.className = 'conflict-indicator';
                    conflictIndicator.textContent = 'Conflict';
                    positionSelector.insertBefore(conflictIndicator, select.parentElement);
                }
            } else {
                // Remove conflict indicator if it exists
                const conflictIndicator = positionSelector.querySelector('.conflict-indicator');
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
    if (topButtonsContainer) topButtonsContainer.innerHTML = '';
    if (bottomButtonsContainer) bottomButtonsContainer.innerHTML = '';
    if (topButtonSources) topButtonSources.innerHTML = '';
    if (bottomButtonSources) bottomButtonSources.innerHTML = '';
    
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
        
        // If no buttons are assigned, show a message
        if (orderedButtons.length === 0) {
            const placeholderMsg = document.createElement('div');
            placeholderMsg.className = 'no-buttons-message';
            placeholderMsg.textContent = 'Your custom buttons will appear here';
            container.appendChild(placeholderMsg);
            return;
        }
        
        // Add selected buttons
        orderedButtons.forEach(button => {
            if (button.type === 'control' || button.type === 'action') {
                // Find the existing preview button group for control and action buttons
                const buttonSection = document.getElementById(`${button.id}Button`);
                if (buttonSection) {
                    const sourceElement = buttonSection.querySelector('.preview-button-group');
                    if (sourceElement) {
                        const clonedElement = sourceElement.cloneNode(true);
                        container.appendChild(clonedElement);
                    }
                }
            } else if (button.type === 'url') {
                // For URL buttons, create a new element with the current label value
                const labelInput = document.getElementById(`${button.id}.label`);
                const labelValue = labelInput ? labelInput.value : 'Custom Button';
                
                // Create new button element instead of cloning
                const newButton = document.createElement('div');
                newButton.className = 'preview-button url-button';
                
                // Create span with label text
                const span = document.createElement('span');
                const labelWithBreaks = labelValue ? labelValue.replace(/\\n/g, '<br>') : 'Button<br>Text';
                span.innerHTML = labelWithBreaks;
                
                newButton.appendChild(span);
                container.appendChild(newButton);
            } else if (button.type === 'application') {
                // For application buttons, create new element with current app name
                const appId = document.getElementById(`${button.id}.appId`).value;
                const appName = appId ? applicationNames[appId] || 'Custom App' : 'Custom App';
                
                // Create a new button element
                const newButton = document.createElement('div');
                newButton.className = 'preview-button url-button application-button';
                
                // Create span with app name
                const span = document.createElement('span');
                const appNameWithBreaks = appName.replace(/\s/g, '<br>');
                span.innerHTML = appNameWithBreaks;
                
                newButton.appendChild(span);
                container.appendChild(newButton);
            }
        });
    };
    
    // Update both containers
    updateContainer(topButtonsContainer);
    updateContainer(bottomButtonsContainer);
    
    // Generate source information HTML
    const generateSourcesHTML = () => {
        let sourcesHTML = '';
        sourcesHTML += '<div style="margin-bottom: 8px;"><strong>Conflicts:</strong></div>';
        
        if (conflicts.length > 0) {
            conflicts.forEach(conflict => {
                sourcesHTML += `<div class="button-source-item conflict">⚠️ ${conflict}</div>`;
            });
        } else {
            sourcesHTML += '<div class="button-source-item">No conflicts</div>';
        }
        
        return sourcesHTML;
    };
    
    // Update both button sources containers
    if (topButtonSources) topButtonSources.innerHTML = generateSourcesHTML();
    if (bottomButtonSources) bottomButtonSources.innerHTML = generateSourcesHTML();
}
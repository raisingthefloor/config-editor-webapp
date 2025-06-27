document.getElementById('upload').addEventListener('change', handleFileUpload);
document.getElementById('download').addEventListener('click', handleDownloadClick);
document.getElementById('checkErrors').addEventListener('click', checkForErrors);

// Update file name display when file is selected
document.getElementById('upload').addEventListener('change', function(event) {
    const fileNameDisplay = document.getElementById('fileName');
    const file = event.target.files[0];
    if (file) {
        fileNameDisplay.textContent = file.name;
    } else {
        fileNameDisplay.textContent = 'No file chosen';
    }
});


// This controls the access to dependent options (scope and reset settings)
document.getElementById('features.autorunAfterLogin.enabled').addEventListener('change', toggleScopeAccess);

// This controls the access to the delay morphic date field
document.getElementById('enableDelayMorphic').addEventListener('change', toggleDelayMorphicAccess);

// This controls the access to the Site ID field
document.getElementById('features.atUseCounter.enabled').addEventListener('change', toggleSiteIdAccess);



// Function to enable/disable the scope dropdown and reset settings
function toggleScopeAccess() {
    const autorunEnabled = document.getElementById('features.autorunAfterLogin.enabled').checked;
    const scopeSelect = document.getElementById('features.autorunAfterLogin.scope');
    const resetCheckbox = document.getElementById('features.resetSettings.enabled');
    
    if (autorunEnabled) {
        // Enable dependent options when autorun is enabled
        scopeSelect.disabled = false;
        resetCheckbox.disabled = false;
        
        // Remove visual styling for disabled state
        scopeSelect.style.opacity = '1';
        resetCheckbox.style.opacity = '1';
        scopeSelect.style.cursor = 'pointer';
        resetCheckbox.style.cursor = 'pointer';
    } 
    else 
    {
        // Disable dependent options when autorun is disabled
        scopeSelect.disabled = true;
        resetCheckbox.disabled = true;
        
        // Set default values when disabled
        scopeSelect.value = 'allLocalUsers';
        resetCheckbox.checked = false;
        
        // Add visual styling to indicate disabled state
        scopeSelect.style.opacity = '0.6';
        resetCheckbox.style.opacity = '0.6';
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
        
        // Enable telemetry (AT Use Counter) when delay morphic is enabled
        telemetryCheckbox.checked = true;
        // Trigger the site ID access toggle since telemetry is now enabled
        toggleSiteIdAccess();
    } else {
        // Disable date input when delay is disabled
        dateInput.disabled = true;
        dateInput.value = '';
        
        // Add visual styling to indicate disabled state
        dateLabel.style.opacity = '0.6';
        dateInput.style.opacity = '0.6';
        dateInput.style.cursor = 'not-allowed';
        
        // We keep telemetry setting as-is when delay is disabled
        // since users might want telemetry for other purposes
    }
}

// Function to enable/disable the Site ID field
function toggleSiteIdAccess() {
    const telemetryEnabled = document.getElementById('features.atUseCounter.enabled').checked;
    const siteIdInput = document.getElementById('telemetry.siteId');
    const siteIdLabel = document.getElementById('siteIdLabel');
    
    if (telemetryEnabled) {
        // Enable Site ID input when telemetry is enabled
        siteIdInput.disabled = false;
        siteIdLabel.style.opacity = '1';
        siteIdInput.style.opacity = '1';
        siteIdInput.style.cursor = 'pointer';
    } else {
        // Disable Site ID input when telemetry is disabled
        siteIdInput.disabled = true;
        siteIdInput.value = '';
        
        // Add visual styling to indicate disabled state
        siteIdLabel.style.opacity = '0.6';
        siteIdInput.style.opacity = '0.6';
        siteIdInput.style.cursor = 'not-allowed';
    }
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
    toggleSiteIdAccess();
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

// Add event listeners for position dropdowns to update preview
document.addEventListener('DOMContentLoaded', function() {
    const positionSelects = ['usb.position', 'volume.position', 'voice.position', 'customUrl1.position', 'customUrl2.position', 'customUrl3.position'];
    
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
});

//Validates that the Site ID contains only ASCII letters and numbers
function validateSiteId() {
    const siteIdInput = document.getElementById('telemetry.siteId');
    const siteId = siteIdInput.value.trim();
    
    // Clear previous error styling
    siteIdInput.style.borderColor = '';
    siteIdInput.title = '';
    
    // Its valid if empty (but later when checking for errors, we'll make sure it's filled in)
    if (!siteId) {
        return true;
    }
    
    // Check if Site ID contains only ASCII letters and numbers
    const validPattern = /^[A-Za-z0-9]+$/;
    
    if (!validPattern.test(siteId)) {
        // Invalid Site ID - apply error styling
        siteIdInput.style.borderColor = 'red';
        siteIdInput.title = 'Site ID must contain only ASCII letters and numbers (no spaces or symbols)';
        return false;
    }
    
    return true; // Valid Site ID
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
    const buttonIds = ['usb', 'volume', 'voice', 'customUrl1', 'customUrl2', 'customUrl3'];
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
        { id: 'customUrl1', type: 'link' },
        { id: 'customUrl2', type: 'link' },
        { id: 'customUrl3', type: 'link' }
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
            } else if (config.type === 'link') {
                buttonData.label = document.getElementById(`${config.id}.label`).value || '';
                buttonData.tooltipHeader = document.getElementById(`${config.id}.tooltipHeader`).value || '';
                buttonData.tooltipText = document.getElementById(`${config.id}.tooltipText`).value || '';
                buttonData.url = document.getElementById(`${config.id}.url`).value || '';
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
    document.getElementById('features.cloudSettingsTransfer.enabled').checked = config.features?.cloudSettingsTransfer?.enabled ?? true;
    document.getElementById('features.customMorphicBars.enabled').checked = config.features?.customMorphicBars?.enabled ?? true;
    document.getElementById('features.resetSettings.enabled').checked = config.features?.resetSettings?.enabled ?? false;
    document.getElementById('features.signIn.enabled').checked = config.features?.signIn?.enabled ?? true;

    // MorphicBar section - handle nested structure
    document.getElementById('morphicBar.defaultLocation').value = config.morphicBar?.defaultLocation ?? "bottomTrailing";
    document.getElementById('morphicBar.visibilityAfterLogin').value = config.morphicBar?.visibilityAfterLogin ?? "show";

    // Advanced settings - some nested, some top-level
    document.getElementById('telemetry.siteId').value = config.telemetry?.siteId ?? "";
    document.getElementById('hideMorphicAfterLoginUntil').value = config.hideMorphicAfterLoginUntil ?? "";
    document.getElementById('version').value = config.version ?? 0;

    // Handle extra buttons/items - nested under morphicBar
    populatePredefinedButtons(config.morphicBar?.extraItems ?? []);

    // Update scope visibility after loading config
    toggleScopeAccess();
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
    
    // Validate Site ID is filled in (only if telemetry is enabled)
    const atUseCounterEnabled = document.getElementById('features.atUseCounter.enabled').checked;
    const siteId = document.getElementById('telemetry.siteId').value.trim();
    if (atUseCounterEnabled && !siteId) {
        errors.push('Site ID is required when AT Use Counter is enabled.');
    }
    
    // Validate Site ID format (only if telemetry is enabled and Site ID has content)
    if (atUseCounterEnabled && siteId && !validateSiteId()) {
        errors.push('Site ID must contain only ASCII letters and numbers (no spaces or symbols).');
    }
    
    // Validate Date to show MorphicBar is filled in (only if delay morphic is enabled)
    const delayMorphicEnabled = document.getElementById('enableDelayMorphic').checked;
    const morphicShowDate = document.getElementById('hideMorphicAfterLoginUntil').value;
    if (delayMorphicEnabled && !morphicShowDate) {
        errors.push('Date to show MorphicBar is required when Delay Morphic Appearance is enabled.');
    }
    
    // Validate that telemetry is enabled when delay morphic is enabled
    const telemetryEnabled = document.getElementById('features.atUseCounter.enabled').checked;
    if (delayMorphicEnabled && !telemetryEnabled) {
        errors.push('AT Use Counter (telemetry) must be enabled when Delay Morphic Appearance is enabled.');
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
        "version": parseInt(document.getElementById('version').value),
        
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
            "cloudSettingsTransfer": {
                "enabled": document.getElementById('features.cloudSettingsTransfer.enabled').checked
            },
            "customMorphicBars": {
                "enabled": document.getElementById('features.customMorphicBars.enabled').checked
            },
            "resetSettings": {
                // Default to false for Reset Settings when auto run is disabled
                "enabled": isAutoRunEnabled ? document.getElementById('features.resetSettings.enabled').checked : false
            },
            "signIn": {
                "enabled": document.getElementById('features.signIn.enabled').checked
            }
        },

        "morphicBar": {
            "defaultLocation": document.getElementById('morphicBar.defaultLocation').value,
            "visibilityAfterLogin": document.getElementById('morphicBar.visibilityAfterLogin').value,
            "extraItems": collectPredefinedButtons()
        }
    };

    // Add optional fields only if they have values and their dependencies are enabled
    const telemetryEnabled = document.getElementById('features.atUseCounter.enabled').checked;
    const siteId = document.getElementById('telemetry.siteId').value.trim();
    if (telemetryEnabled && siteId) {
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
    const label = document.getElementById(`${buttonId}.label`).value || 'Custom';
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
    
    // Update position preview when button details change
    updatePositionPreview();
}

// Updated function to validate unique positions for predefined buttons
function validateUniquePositions() {
    const positionSelects = [
        'usb.position',
        'volume.position', 
        'voice.position',
        'customUrl1.position',
        'customUrl2.position',
        'customUrl3.position'
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
            if (position && conflicts.has(position)) {
                // Mark as conflicted
                select.style.borderColor = '#e53e3e';
                select.style.backgroundColor = '#fed7d7';
            } else {
                // Remove conflict styling
                select.style.borderColor = '#e2e8f0';
                select.style.backgroundColor = '#ffffff';
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
    const customButtonsContainer = document.getElementById('customButtonsContainer');
    const buttonSources = document.getElementById('buttonSources');
    
    if (!customButtonsContainer || !buttonSources) {
        return;
    }
    
    // Clear existing content
    customButtonsContainer.innerHTML = '';
    buttonSources.innerHTML = '';
    
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
    
    // Create button elements for the Morphic bar by cloning existing previews
    orderedButtons.forEach(button => {
        let sourceElement = null;
        
        if (button.type === 'control') {
            // Find the existing preview button group for control buttons
            const buttonSection = document.getElementById(`${button.id}Button`);
            if (buttonSection) {
                sourceElement = buttonSection.querySelector('.preview-button-group');
            }
        } else if (button.type === 'url') {
            // Find the existing preview button for URL buttons
            const previewButton = document.getElementById(`${button.id}Preview`);
            if (previewButton) {
                sourceElement = previewButton;
            }
        }
        
        // Clone the existing element if found
        if (sourceElement) {
            const clonedElement = sourceElement.cloneNode(true);
            customButtonsContainer.appendChild(clonedElement);
        }
    });
    
    // Show source information
    let sourcesHTML = '';

    sourcesHTML += '<div style="margin-bottom: 8px;"><strong>Conflicts:</strong></div>';
    
    if (conflicts.length > 0) {
        conflicts.forEach(conflict => {
            sourcesHTML += `<div class="button-source-item conflict">⚠️ ${conflict}</div>`;
        });
    } else {
        sourcesHTML += '<div class="button-source-item">No conflicts</div>';
    }
    
    buttonSources.innerHTML = sourcesHTML;
}
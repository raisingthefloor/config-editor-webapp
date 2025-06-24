document.getElementById('upload').addEventListener('change', handleFileUpload);
document.getElementById('download').addEventListener('click', downloadConfig);

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
    } else {
        // Disable dependent options when autorun is disabled, but keep them visible
        scopeSelect.disabled = true;
        resetCheckbox.disabled = true;
        
        // Set default values when disabled
        scopeSelect.value = 'allLocalUsers'; // Default scope
        resetCheckbox.checked = false; // Default reset settings
        
        // Add visual styling to indicate disabled state
        scopeSelect.style.opacity = '0.6';
        resetCheckbox.style.opacity = '0.6';
        scopeSelect.style.cursor = 'not-allowed';
        resetCheckbox.style.cursor = 'not-allowed';
    }
}

// Set initial state when page loads (in case autorun is unchecked by default)
window.addEventListener('load', function() {
    toggleScopeAccess();
    updatePositionPreview();
});

// Add real-time validation for Site ID as user types
document.getElementById('telemetry.siteId').addEventListener('input', validateSiteId);

//Shows/hides the appropriate input fields based on button type selection
function toggleExtraButtonFields(index) {
    const typeSelect = document.getElementById(`extraButton${index}.type`);
    const linkFields = document.getElementById(`linkFields${index}`);
    const controlFields = document.getElementById(`controlFields${index}`);

    if (typeSelect.value === 'link') {
        // Show URL/link configuration fields
        linkFields.style.display = 'block';
        controlFields.style.display = 'none';
        // Update preview when showing link fields
        updateButtonPreview(index);
    } else if (typeSelect.value === 'control') {
        // Show control feature configuration fields
        linkFields.style.display = 'none';
        controlFields.style.display = 'block';
    } else {
        // "none" type - hide both field sets
        linkFields.style.display = 'none';
        controlFields.style.display = 'none';
    }
    
    // Update available options to prevent duplicates
    updateControlFeatureOptions();
    
    // Validate positions when button type changes
    validateUniquePositions();
    
    // Update position preview
    updatePositionPreview();
}

//Updates the button preview in real-time
function updateButtonPreview(index) {
    // Get input values
    const label = document.getElementById(`extraButton${index}.label`).value || 'Button Text';
    const tooltipHeader = document.getElementById(`extraButton${index}.tooltipHeader`).value || 'Header text';
    const tooltipText = document.getElementById(`extraButton${index}.tooltipText`).value || 'Description text';
    
    // Update preview button label
    document.getElementById(`previewLabel${index}`).textContent = label;
    
    // Update tooltip content
    document.getElementById(`previewTooltipHeader${index}`).textContent = tooltipHeader;
    document.getElementById(`previewTooltipText${index}`).textContent = tooltipText;
    
    // Update button title attribute for browser tooltip
    document.getElementById(`previewButton${index}`).title = `${tooltipHeader}\n${tooltipText}`;
    
    // Update position preview when button details change
    updatePositionPreview();
}

//Updates the display numbers for extra buttons
function updateControlFeatureOptions() {
    const usedFeatures = new Set(); // Track which control features are already selected
    
    // PASS 1: Collect all currently selected control features from buttons 1, 2, 3
    for (let buttonIndex = 1; buttonIndex <= 3; buttonIndex++) {
        const typeSelect = document.getElementById(`extraButton${buttonIndex}.type`);
        const featureSelect = document.getElementById(`extraButton${buttonIndex}.feature`);
        
        // Only count control buttons that have a feature selected
        if (typeSelect && typeSelect.value === 'control' && featureSelect && featureSelect.value) {
            usedFeatures.add(featureSelect.value);
        }
    }
    
    // PASS 2: Update each control dropdown to reflect what's available
    for (let buttonIndex = 1; buttonIndex <= 3; buttonIndex++) {
        const typeSelect = document.getElementById(`extraButton${buttonIndex}.type`);
        const featureSelect = document.getElementById(`extraButton${buttonIndex}.feature`);
        
        // Only update dropdowns for control-type buttons
        if (typeSelect && typeSelect.value === 'control' && featureSelect) {
            const currentValue = featureSelect.value;
            const options = [
                { value: 'usbopeneject', text: 'USB Open/Eject' },
                { value: 'volume', text: 'Volume' },
                { value: 'voice', text: 'Voice Control' }
            ];
            
            // Rebuild the dropdown from scratch
            featureSelect.innerHTML = '';
            
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                
                // Disable options that are used by OTHER buttons
                // (Allow the current button to keep its own selection)
                if (usedFeatures.has(option.value) && currentValue !== option.value) {
                    optionElement.disabled = true;
                    optionElement.textContent += ' (Already used)';
                }
                
                featureSelect.appendChild(optionElement);
            });
            
            // Try to restore the button's previous selection
            if (currentValue && !featureSelect.querySelector(`option[value="${currentValue}"]:disabled`)) {
                // Previous selection is still valid, restore it
                featureSelect.value = currentValue;
            } else if (currentValue && featureSelect.querySelector(`option[value="${currentValue}"]:disabled`)) {
                // Previous selection is now disabled, auto-select first available option
                const firstAvailable = featureSelect.querySelector('option:not(:disabled)');
                if (firstAvailable) {
                    featureSelect.value = firstAvailable.value;
                }
            }
        }
    }
    
    // Update position preview after control feature changes
    updatePositionPreview();
}

//Validates that the Site ID contains only ASCII letters and numbers
function validateSiteId() {
    const siteIdInput = document.getElementById('telemetry.siteId');
    const siteId = siteIdInput.value.trim();
    
    // Clear previous error styling
    siteIdInput.style.borderColor = '';
    siteIdInput.title = '';
    
    // If empty, that's okay (field is optional)
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
    
    // Check if URL is empty
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



//Validates that no two buttons have the same position if they are enabled
function validateUniquePositions() {
    const positions = new Map(); // Maps position -> button index for duplicate detection
    let hasError = false;
    
    // STEP 1: Clear any previous error styling for all 3 buttons
    for (let buttonIndex = 1; buttonIndex <= 3; buttonIndex++) {
        const positionSelect = document.getElementById(`extraButton${buttonIndex}.position`);
        if (positionSelect) {
            positionSelect.style.borderColor = '';  // Remove red border
            positionSelect.title = '';              // Remove error tooltip
        }
    }
    
    // STEP 2: Check all enabled buttons for duplicate positions
    for (let buttonIndex = 1; buttonIndex <= 3; buttonIndex++) {
        const typeSelect = document.getElementById(`extraButton${buttonIndex}.type`);
        const positionSelect = document.getElementById(`extraButton${buttonIndex}.position`);
        
        // Only check enabled buttons (not "none" type)
        if (typeSelect && typeSelect.value !== 'none' && positionSelect) {
            const position = positionSelect.value;
            
            if (positions.has(position)) {
                // DUPLICATE FOUND! Mark both the original and current select as errors
                const duplicateButtonIndex = positions.get(position);
                const duplicateSelect = document.getElementById(`extraButton${duplicateButtonIndex}.position`);
                
                // Apply error styling to both selects
                positionSelect.style.borderColor = 'red';
                positionSelect.title = 'Duplicate position detected';
                duplicateSelect.style.borderColor = 'red';
                duplicateSelect.title = 'Duplicate position detected';
                hasError = true;
            } else {
                // First time seeing this position, add it to the map
                positions.set(position, buttonIndex);
            }
        }
    }
    
    // Update position preview after validation
    updatePositionPreview();
    
    return !hasError; // Return true if no errors
}

//Updates the position preview to show which buttons are in which positions
function updatePositionPreview() {
    // First, collect all enabled buttons and their positions
    const buttonsByPosition = {}; // Maps position -> array of button indexes
    
    for (let buttonIndex = 1; buttonIndex <= 3; buttonIndex++) {
        const typeSelect = document.getElementById(`extraButton${buttonIndex}.type`);
        const positionSelect = document.getElementById(`extraButton${buttonIndex}.position`);
        
        // Only consider enabled buttons (not "none" type)
        if (typeSelect && typeSelect.value !== 'none' && positionSelect) {
            const position = positionSelect.value;
            
            if (!buttonsByPosition[position]) {
                buttonsByPosition[position] = [];
            }
            buttonsByPosition[position].push(buttonIndex);
        }
    }
    
    // Update each position slot (1, 2, 3)
    for (let position = 1; position <= 3; position++) {
        const slot = document.getElementById(`positionSlot${position}`);
        const content = document.getElementById(`positionContent${position}`);
        const source = document.getElementById(`buttonSource${position}`);
        
        if (!slot || !content || !source) continue;
        
        const buttonsInThisPosition = buttonsByPosition[position.toString()] || [];
        
        // Clear previous styling
        slot.classList.remove('conflict');
        source.classList.remove('conflict');
        
        if (buttonsInThisPosition.length === 0) {
            // No button assigned to this position
            content.innerHTML = '<div class="placeholder">No Button</div>';
            source.innerHTML = '';
            
        } else if (buttonsInThisPosition.length === 1) {
            // Exactly one button - show it properly
            const buttonIndex = buttonsInThisPosition[0];
            const typeSelect = document.getElementById(`extraButton${buttonIndex}.type`);
            const buttonType = typeSelect.value;
            
            if (buttonType === 'link') {
                const label = document.getElementById(`extraButton${buttonIndex}.label`).value || 'URL Button';
                content.innerHTML = `<div class="button-info">${label}</div>`;
            } else if (buttonType === 'control') {
                const featureSelect = document.getElementById(`extraButton${buttonIndex}.feature`);
                const featureName = featureSelect.options[featureSelect.selectedIndex].text;
                content.innerHTML = `<div class="button-info control">${featureName}</div>`;
            }
            
            source.innerHTML = `Extra Button ${buttonIndex}`;
            
        } else {
            // Multiple buttons assigned to same position - CONFLICT!
            slot.classList.add('conflict');
            source.classList.add('conflict');
            
            content.innerHTML = '<div class="conflict-text">CONFLICT!</div>';
            
            const conflictingButtons = buttonsInThisPosition.map(idx => `Extra Button ${idx}`).join(', ');
            source.innerHTML = `Conflict: ${conflictingButtons}`;
        }
    }
}

//Populates the 3 static extra button forms
function populateExtraButtons(extraButtons) {
    // Reset all 3 buttons to default "none" state first
    for (let buttonIndex = 1; buttonIndex <= 3; buttonIndex++) {
        document.getElementById(`extraButton${buttonIndex}.type`).value = 'none';
        toggleExtraButtonFields(buttonIndex); // This will hide all fields for "none" type
        
        // Clear all input values
        document.getElementById(`extraButton${buttonIndex}.label`).value = '';
        document.getElementById(`extraButton${buttonIndex}.tooltipHeader`).value = '';
        document.getElementById(`extraButton${buttonIndex}.tooltipText`).value = '';
        document.getElementById(`extraButton${buttonIndex}.url`).value = '';
        document.getElementById(`extraButton${buttonIndex}.feature`).value = 'usbopeneject';
        document.getElementById(`extraButton${buttonIndex}.position`).value = buttonIndex.toString(); // Reset to default position
    }

    // Populate each button from the config data (up to 3 buttons)
    extraButtons.forEach((button, index) => {
        if (index < 3) { // Only handle up to 3 buttons
            const buttonIndex = index + 1; // Convert 0-based array index to 1-based button number

            // Set the button type
            document.getElementById(`extraButton${buttonIndex}.type`).value = button.type;
            toggleExtraButtonFields(buttonIndex); // Show appropriate fields for this type

            // Set position based on array order (position = array index + 1)
            document.getElementById(`extraButton${buttonIndex}.position`).value = (index + 1).toString();

        if (button.type === 'link') {
            // Populate link fields
                document.getElementById(`extraButton${buttonIndex}.label`).value = button.label || '';
                document.getElementById(`extraButton${buttonIndex}.tooltipHeader`).value = button.tooltipHeader || '';
                document.getElementById(`extraButton${buttonIndex}.tooltipText`).value = button.tooltipText || '';
                document.getElementById(`extraButton${buttonIndex}.url`).value = button.url || '';
                // Update preview after populating link fields
                updateButtonPreview(buttonIndex);
        } else if (button.type === 'control') {
            // Populate control fields
                document.getElementById(`extraButton${buttonIndex}.feature`).value = button.feature || 'usbopeneject';
            }
        }
    });
    
    // Update position preview after loading buttons
    updatePositionPreview();
}

//Collects all extra button configurations
function collectExtraButtons() {
    const extraButtons = []; // Will contain the final button data

    // Process each of the 3 static buttons
    for (let buttonIndex = 1; buttonIndex <= 3; buttonIndex++) {
        const typeSelect = document.getElementById(`extraButton${buttonIndex}.type`);

        // Skip if button is somehow malformed or set to "none"
        if (!typeSelect || typeSelect.value === 'none') continue;

        const type = typeSelect.value;
        const extraButton = { type }; // Start building the button object

        // Get position information for sorting (but don't include in final object)
        const positionSelect = document.getElementById(`extraButton${buttonIndex}.position`);
        let position = 1; // Default position
        if (positionSelect) {
            position = parseInt(positionSelect.value);
        }

        if (type === 'link') {
            // Collect all URL button properties
            extraButton.label = document.getElementById(`extraButton${buttonIndex}.label`).value;
            extraButton.tooltipHeader = document.getElementById(`extraButton${buttonIndex}.tooltipHeader`).value;
            extraButton.tooltipText = document.getElementById(`extraButton${buttonIndex}.tooltipText`).value;
            extraButton.url = document.getElementById(`extraButton${buttonIndex}.url`).value;
        } else if (type === 'control') {
            // Collect control button properties (just the feature type)
            extraButton.feature = document.getElementById(`extraButton${buttonIndex}.feature`).value;
        }

        // Add position temporarily for sorting
        extraButton._sortPosition = position;
        extraButtons.push(extraButton); // Add to our collection
    }

    // Sort buttons by their position (1, 2, 3)
    extraButtons.sort((a, b) => a._sortPosition - b._sortPosition);

    // Remove the temporary sort position property from each button
    extraButtons.forEach(button => {
        delete button._sortPosition;
    });

    return extraButtons; // Return sorted array ready for JSON serialization
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
    populateExtraButtons(config.morphicBar?.extraItems ?? []);

    // Update scope visibility after loading config
    toggleScopeAccess();
}

//Generates and downloads the final config.json file

function downloadConfig() {
    // Validate unique positions before downloading
    if (!validateUniquePositions()) {
        alert('Please fix duplicate button positions before downloading the configuration.');
        return;
    }
    
    // Validate Site ID format before downloading
    if (!validateSiteId()) {
        alert('Please fix the Site ID. It must contain only ASCII letters and numbers (no spaces or symbols).');
        return;
    }
    
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
            "extraItems": collectExtraButtons()
        }
    };

    // Add optional fields only if they have values
    const siteId = document.getElementById('telemetry.siteId').value.trim();
    if (siteId) {
        config.telemetry = {
            "siteId": siteId
        };
    }

    const hideUntilDate = document.getElementById('hideMorphicAfterLoginUntil').value;
    if (hideUntilDate) {
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
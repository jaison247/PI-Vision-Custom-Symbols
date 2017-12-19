/***************************************************************************
   Copyright 2016-2017 OSIsoft, LLC.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 ***************************************************************************/

//************************************
// Begin defining a new symbol
//************************************
(function (CS) {
	'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Vision to also
		// look for HTML template and configuration template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'HTML5video',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'HTML5 video',
		// Specify the number of data sources for this symbol
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/HTML5video.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				// Specify the data shape type (for symbols that update with new data)
				DataShape: 'Value',
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 600,
				// Specify the value of custom configuration options; see the "configure" section below
				videoSourcePath: "",
				showControls: true,
                enableAutoplay: false,
				enableLoop: true,
                enableRefresh: false,
				refreshIntervalSeconds: 60,
				useDataItemAsVideoSource: false
			};
		},
		// By including this, you're specifying that you want to allow configuration options for this symbol
        configOptions: function () {
            return [{
				// Add a title that will appear when the user right-clicks a symbol
				title: 'Format Symbol',
				// Supply a unique name for this configuration setting, so it can be reused, if needed
                mode: 'format'
            }];
        }
		// Specify the name of the function that will be called to initialize the symbol
		//init: myCustomSymbolInitFunction
	};
	
	//************************************
	// Function called to initialize the symbol
	//************************************
	//function myCustomSymbolInitFunction(scope, elem) {
	function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);
	symbolVis.prototype.init = function (scope, elem) {
		// Specify which function to call when a data update or configuration change occurs 
		this.onDataUpdate = myCustomDataUpdateFunction;
		this.onConfigChange = myCustomConfigurationChangeFunction;
		
		// Locate the div that will contain the symbol, using its id, which is "container" by default
		var symbolContainerElement = elem.find('#container')[0];
        // Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
        symbolContainerElement.id = newUniqueIDString;
		// Create a timer variable to be used for refreshes
		var myTimer;

        //************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
            //console.log("New data received: ", data);
			if (data !== null && data.Value) {
				// Check for an error
				if (data.ErrorDescription) {
					console.log(data.ErrorDescription);
				}
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// -----------------------------------------------------------------------------------------
				// Get the data item value
                if (data.Value) {
					scope.dataItemValue = data.Value;
				}
				// Use the data item as the source, or not
				if (scope.config.useDataItemAsVideoSource) {
					scope.config.videoSourcePath = scope.dataItemValue;
				}
			}
				
		}
		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
        // Initialize a variable to hold the timer interval
        var OLDrefreshIntervalSeconds = scope.config.refreshIntervalSeconds;
		function myCustomConfigurationChangeFunction() {
			// Use the data item as the source, or not
			if (scope.config.useDataItemAsVideoSource) {
				scope.config.videoSourcePath = scope.dataItemValue;
			}
            // If a change is detected, update the path, controls setting, and auto-play setting
            if (symbolContainerElement.src !== scope.config.videoSourcePath) {
                symbolContainerElement.src = scope.config.videoSourcePath;
            }
            if (symbolContainerElement.controls !== scope.config.showControls) {
                symbolContainerElement.controls = scope.config.showControls;
            }
            if (symbolContainerElement.autoplay !== scope.config.enableAutoplay) {
                symbolContainerElement.autoplay = scope.config.enableAutoplay;
            }
            if (symbolContainerElement.loop !== scope.config.enableLoop) {
                symbolContainerElement.loop = scope.config.enableLoop;
            }			
            // If the "enable refresh check-box 
            if (!scope.config.enableRefresh) {
                window.clearTimeout(myTimer);
            } else {
                // In this case, the timer is enabled!
                // If a change is detected, update the refresh interval
                if (OLDrefreshIntervalSeconds !== scope.config.refreshIntervalSeconds) {
                    OLDrefreshIntervalSeconds = scope.config.refreshIntervalSeconds;
                    // Since the interval has changed, stop the timer, then start it
                    window.clearTimeout(myTimer);
                    startMyTimerIfEnabled();
                }
            }
		}
		
        //************************************
        // Function called by the timer to refresh the video feed
        //************************************
        function refreshVideoSource() {
            // Refresh the video source when the timer elapses, then restart the timer
            symbolContainerElement.src = "";
            symbolContainerElement.src = scope.config.videoSourcePath;
			startMyTimerIfEnabled();

        }

        //************************************
        // Function that starts the timer anew, only if it is currently enabled
        //************************************		
		function startMyTimerIfEnabled() {
			// If enabled, start a new timer, using the specified  timer interval (only allow an interval over 0 seconds)
            if (scope.config.enableRefresh && scope.config.refreshIntervalSeconds > 0) {
                myTimer = setTimeout(refreshVideoSource, scope.config.refreshIntervalSeconds * 1000);
            }
		}
        
		// Specify which function to call when a data update or configuration change occurs 
		//return { configChange: myCustomConfigurationChangeFunction };
	};
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);
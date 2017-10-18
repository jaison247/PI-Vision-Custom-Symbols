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
	//'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Vision to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'amcharts-histogram',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'amCharts Histogram',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/amcharts-histogram.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				//
				DataShape: 'TimeSeries',
				DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 600,
				// Specify the value of custom configuration options
				minimumValue: 0,
				maximumValue: 100,
				binSize: 10,
				showTitle: true,
                textColor: "white",
                backgroundColor: "transparent",
                plotAreaFillColor: "transparent",
                useBarsInsteadOfColumns: false,
                sortBinsByValue: false,
                useGradientBinColors: true,
                seriesColor: "red",
				usePIPointBinSizes: false
            };
		},
		// By including this, you're specifying that you want to allow configuration options for this symbol
        configOptions: function () {
            return [{
				// Add a title that will appear when the user right-clicks a symbol
				title: 'Format Symbol',
				// Supply a unique name for this cofiguration setting, so it can be reused, if needed
                mode: 'format'
            }];
        },
        // Specify the name of the function that will be called to initialize the symbol
		//init: myCustomSymbolInitFunction
	};
	
	//************************************
	// Function called to initialize the symbol
	//************************************
	//function myCustomSymbolInitFunction(scope, elem) {
	function symbolVis() { }
    CS.deriveVisualizationFromBase(symbolVis);
	symbolVis.prototype.init = function(scope, elem) {	
		// Specify which function to call when a data update or configuration change occurs 
		this.onDataUpdate = myCustomDataUpdateFunction;
		this.onConfigChange = myCustomConfigurationChangeFunction;
		
		// Locate the html div that will contain the symbol, using its id, which is "container" by default
		var symbolContainerDiv = elem.find('#container')[0];
        // Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
        symbolContainerDiv.id = newUniqueIDString;
		// Create a variable to hold the custom visualization object
		var customVisualizationObject = false;
		// Create a variable to hold the combined data array
		var dataArray = [];
		// Create variables to hold the old bin specifications
		var minimumValue_old, maximumValue_old, binSize_old, sortBinsByValue_old, useGradientBinColors_old, seriesColor_old;
        // Remember the total number of events plotted in the histogram
		var totalNumberOfEvents = 0;
        
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			if (data !== null && data.Data) {
				
				// Check for an error
				if (data.Data[0].ErrorDescription) {
					console.log(data.Data[0].ErrorDescription);
				}
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// -----------------------------------------------------------------------------------------
				//console.log("Now creating custom visualization...");
				// Get the data item name and units
				if (data.Data[0].Label) {
					scope.config.Label = data.Data[0].Label;
                }
				if (data.Data[0].Units) {
					scope.config.Units = data.Data[0].Units;
                }
                
				// Create the histogram bins
				// -------------------------------------------------------------------------------
				
				// Clear the data array and get the total number of events
				dataArray = [];
				totalNumberOfEvents = data.Data[0].Values.length;
				
				// Decide whether or not to pull in bins from a PI Point string
				if (scope.config.usePIPointBinSizes == false) {
					dataArray = populateDataArrayUsingManualBinSizes(data.Data[0]);
				} else {
					// Get the bin sizes string
					var binSizesString = data.Data[1].Values[0].Value;
					dataArray = populateDataArrayUsingPIPointBinSizes(data.Data[0], binSizesString);
				}
				
				// Apply sorting, if desired
                if (scope.config.sortBinsByValue) {
                    dataArray = applySortingByBinValue(scope.config.sortBinsByValue);
                }
                
				// Add colors to the bins
                applyColorsToBins(scope.config.useGradientBinColors);

				//console.log("Data array: ", dataArray);
				// Create the custom visualization
				if (!customVisualizationObject) {
					customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, {
						"type": "serial",
						"backgroundAlpha": 1,
						"backgroundColor": scope.config.backgroundColor,
						"color": scope.config.textColor,
						"plotAreaFillAlphas": 1,
						"plotAreaFillColors": scope.config.plotAreaFillColor,
						"fontFamily": "arial",
						"marginRight": 30,
						"creditsPosition": "bottom-right",
						"titles": createArrayOfChartTitles(),
                        "fontSize": 11,
                        "rotate": scope.config.useBarsInsteadOfColumns,
						"pathToImages": "Scripts/app/editor/symbols/ext/images/",
						"valueAxes": [{
							"integersOnly": true,
							"title": "Count"
						}],
						"categoryAxis": {
							"title": "Histogram Bins (in units of " + scope.config.Units + ")"
						},
						"chartScrollbar": {
                            "oppositeAxis": false,
							"autoGridCount":false, 
							"backgroundAlpha": 0.1,
							"selectedBackgroundAlpha": 0.3,
							"scrollbarHeight": 7,
							"dragIcon": "dragIconRectSmall",
							"dragIconHeight": 15
						},
						"brightnessStep": 10,
						"graphs": [{
							"type": "column",
							"fillAlphas": 1,
                            "lineColor": "black",
							"balloonText": "<b>[[binLabel]]</b><br />Count: [[binCount]]", 
							"valueField": "binCount",
							"colorField": "color"
						}],
						"rotate": false, 
						"dataProvider": dataArray,
						"categoryField": "binLabel",
						"chartCursor": { 
							"cursorColor": "gray",
							"valueLineBalloonEnabled": true,
							"valueLineEnabled": true,
							"valueZoomable": true
						},
						"zoomOutButtonImage": ""
					});
				} else {
					// Update the title
					if (scope.config.showTitle) {
						customVisualizationObject.titles = createArrayOfChartTitles();
					} else {
						customVisualizationObject.titles = null;
					}					
					customVisualizationObject.dataProvider = dataArray;
					customVisualizationObject.validateData();
					customVisualizationObject.validateNow();
				}
			}
		}
        
		//************************************
		// Populates the data array using manually defined bins
		//************************************
		function populateDataArrayUsingManualBinSizes(newDataUpdate) {
			var histogramBinsArray = [];
			var binNumberTracker = 0;
			// In this case, use the manually entered min, max, and bin size)
			// Add one bin, for underflows
			histogramBinsArray.push(
				createNewHistogramBinObject(
					("<" + scope.config.minimumValue),
					binNumberTracker
				)
			);
			binNumberTracker++;				
			// Create the bins for the histogram! Loop through the bin range from the minimum to the maximum
			for (var i = scope.config.minimumValue; i < scope.config.maximumValue; i += scope.config.binSize) {
				// Create a new object for this bin and add this bin to the histogram array
				histogramBinsArray.push(
					createNewHistogramBinObject(
						(i + "-" +  (i + scope.config.binSize)), 
						binNumberTracker
					)
				);
				binNumberTracker++;
			}
			// Add one final bin, for overflows
			histogramBinsArray.push(
				createNewHistogramBinObject(
					(">" + scope.config.maximumValue), 
					binNumberTracker
				)
			);
		
			// -----------------------------------------------------------
			// The bins are ready; now add the data to the bins!
			// For each piece of data in the data item, assign it to the appropriate bin
			for (var i = 0; i < newDataUpdate.Values.length; i++) {
				var currentValue = parseFloat(("" + newDataUpdate.Values[i].Value).replace(",",""));
				// Check the value is not system digital value
				if (isNaN(currentValue)) {
					// Not a number
					continue;
				}
				else
				{
					// Determine the correct bin for this event; remember, the first bin is for underflow
					var binIndex = 1 + Math.floor( (currentValue - scope.config.minimumValue) / scope.config.binSize );					
				}
				// Check for underflow (if the value is under the min, add it to the "underflow" bin)
				if (currentValue < scope.config.minimumValue) {
					// If so, place in the underflow bin, which is the first bin in the array
					binIndex = 0;
				}
				// Check for overflow (if the value is over the max, add it to the "overflow" bin)
				if (currentValue > scope.config.maximumValue) {
					// If so, place in the overflow bin, which is the last bin in the array
					binIndex = histogramBinsArray.length - 1;
				}
				// Increment the bin count in the appropriate bin
				histogramBinsArray[binIndex].binCount = (histogramBinsArray[binIndex].binCount + 1);
			}
			return histogramBinsArray;
		}
		
		//************************************
		// Populates the data array using a PI Point string defined bins
		//************************************
		function populateDataArrayUsingPIPointBinSizes(newDataUpdate, binSizesString) {
			var histogramBinsArray = [];
			var binNumberTracker = 0;
			// In this case, the second arg should be a comma-separated-string of bin values
			// which is the first value in the second date item data update
			// Seperate the bin size string by commas
			if (binSizesString.indexOf(",") != -1) {
				var binSizeArray = binSizesString.split(",");
				console.log(binSizeArray);
				// Add one bin, for underflows
				histogramBinsArray.push(
					createNewHistogramBinObject(
						("<" + binSizeArray[0]), 
						binNumberTracker, 
						-9999999999, 
						parseFloat(binSizeArray[0])
					)
				);
				binNumberTracker++;	
				
				// Create the bins for the histogram! Loop through the bin range from the minimum to the maximum
				for (var i = 1; i < binSizeArray.length; i ++) {
					// Create a new object for this bin and add this bin to the histogram array
					var newHistogramBin = createNewHistogramBinObject(
						(binSizeArray[i-1] + "-" +  binSizeArray[i]), 
						binNumberTracker,
						parseFloat(binSizeArray[i-1]),
						parseFloat(binSizeArray[i])
					);
					console.log(newHistogramBin);
					histogramBinsArray.push(newHistogramBin);
					binNumberTracker++;
				}
				// Add one final bin, for overflows
				histogramBinsArray.push(
					createNewHistogramBinObject(
						(">" + binSizeArray[binSizeArray.length - 1]), 
						binNumberTracker, 
						parseFloat(binSizeArray[binSizeArray.length - 1]), 
						99999999
					)
				);
			}
			// Now that all the bins have been created, drop the data items into bins
			console.log(histogramBinsArray);
			
			// Loop through each received data item
			for (var i = 0; i < newDataUpdate.Values.length; i++) {
				var currentValue = parseFloat(("" + newDataUpdate.Values[i].Value).replace(",",""));
				// Check the value is not system digital value
				if (isNaN(currentValue) == false) {
					
					// Loop through all of the bins, and drop this item in the right bin
					for (var binIndex = 0; binIndex < histogramBinsArray.length; binIndex++) {
						// Check this bin;
						// Check if the current value is less than the bin max
						if (currentValue < histogramBinsArray[binIndex].binMaximum) {
							// If this value is less than the bin maximum, then it belongs in this bin!
							// Increment the count of this bin by 1!
							histogramBinsArray[binIndex].binCount++;
							// Having done this, exit the for loop
							binIndex = histogramBinsArray.length;
						}
					}
					
				}
			}
			return histogramBinsArray;
		}
		
        //************************************
		// Create a new histogram bin object
		//************************************
        function createNewHistogramBinObject(binLabel, binNumber, binMinimum, binMaximum) {
            var newBinObject = {
                // By default, all new bins contain zero elements
                "binCount": 0,
                // Give this bin the desired text label
                "binLabel": binLabel,
                // Apply the default color
                "color": scope.config.seriesColor,
                // Assign this bin a number to assist with sorting
                "binNumber": binNumber,
				// Store this bin's range
				"binMinimum": binMinimum,
				"binMaximum": binMaximum
            };
            return newBinObject;
        }
        
        //************************************
		// Add colors to bins
		//************************************
        function applyColorsToBins(useGradientFlag) {
            for (var i = 0; i < dataArray.length; i++) {
                // If the gradient flag is true, apply colors; otherwise, use a hard-coded value
                if (useGradientFlag == true) {
                    // Scale the count from 0 to 255, then convert it to a 2-digit hex string
                    var twoDigitHexString = (Math.round(255 * i / dataArray.length)).toString(16);
                    if (twoDigitHexString.length === 1) {
                        twoDigitHexString = "0" + twoDigitHexString;
                    }
                    // Insert that hex code into a color string
                    var newColorCode = "#" + twoDigitHexString + twoDigitHexString + twoDigitHexString;
                    dataArray[i].color = newColorCode.toUpperCase();
                } else {
                    dataArray[i].color = scope.config.seriesColor;
                }
            }
        }
        
        //************************************
		// If the input flag is true, it sorts the data array by the bin value, otherwise
        // it applies the original sequential bin order
        // This uses the helper functions below to sort by bin number and count, respectively
		//************************************
        function applySortingByBinValue(applySortingFlag) {
            var newDataArray = [dataArray.length];
            if (applySortingFlag == false) {
                // Loop through the entries in the data array, and order them by bin number
                newDataArray = dataArray.sort(compareBinNumbersSortingFunction);
            } else {
                // Loop through the entries in the data array and sort them by bin count
                newDataArray = dataArray.sort(compareBinCountsSortingFunction);
            }
            return newDataArray;
        }
        function compareBinCountsSortingFunction(binA, binB) {
            if (binA.binCount < binB.binCount)
                return 1;
            if (binA.binCount > binB.binCount)
                return -1;
            return 0;
        }
        function compareBinNumbersSortingFunction(binA, binB) {
            if (binA.binNumber < binB.binNumber)
                return -1;
            if (binA.binNumber > binB.binNumber)
                return 1;
            return 0;
        }
		
		//************************************
		// Function that returns an array of titles
		//************************************
		function createArrayOfChartTitles() {
			// Build the titles array
			var titlesArray = [
				{
					"text": "Histogram of " + totalNumberOfEvents + " data events"
				},
				{
					"text": "for data item '" + scope.config.Label + "'",
					"bold": false
				}
			];
			return titlesArray;
		}		

		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction(data) {
			// If the visualization exists...
			if(customVisualizationObject) {
				// Update the bin minimum, max, and size
				if ((minimumValue_old != scope.config.minimumValue) && (scope.config.minimumValue != 0)) {
					minimumValue_old = scope.config.minimumValue;
					myCustomDataUpdateFunction(data);
				}
				if ((maximumValue_old != scope.config.maximumValue) && (scope.config.maximumValue != 0)) {
					maximumValue_old = scope.config.maximumValue;
					myCustomDataUpdateFunction(data);
				}
				if ((binSize_old != scope.config.binSize) && (scope.config.binSize != 0)) {
					binSize_old = scope.config.binSize;
					myCustomDataUpdateFunction(data);
				}
                // Apply sorting, if desired
                if (sortBinsByValue_old != scope.config.sortBinsByValue) {
                    sortBinsByValue_old = scope.config.sortBinsByValue;
                    dataArray = applySortingByBinValue(scope.config.sortBinsByValue);
                    customVisualizationObject.dataProvider = dataArray;
                    customVisualizationObject.validateData();
                }
                // Update default color
                if (seriesColor_old != scope.config.seriesColor) {
                    seriesColor_old = scope.config.seriesColor;
                    applyColorsToBins(scope.config.useGradientBinColors);
                    customVisualizationObject.dataProvider = dataArray;
                    customVisualizationObject.validateData();
                }
                // Apply color gradients, if desired
                if (useGradientBinColors_old != scope.config.useGradientBinColors) {
                    useGradientBinColors_old = scope.config.useGradientBinColors;
                    applyColorsToBins(scope.config.useGradientBinColors);
                    customVisualizationObject.dataProvider = dataArray;
                    customVisualizationObject.validateData();
                }
				// Update the title
				if (scope.config.showTitle) {
					customVisualizationObject.titles = createArrayOfChartTitles();
				} else {
					customVisualizationObject.titles = null;
				}
                // Update colors and fonts
                if (customVisualizationObject.color !== scope.config.textColor) {
                    customVisualizationObject.color = scope.config.textColor;
                }
                if (customVisualizationObject.color !== scope.config.textColor) {
                    customVisualizationObject.color = scope.config.textColor;
                }
                if (customVisualizationObject.backgroundColor !== scope.config.backgroundColor) {
                    customVisualizationObject.backgroundColor = scope.config.backgroundColor;
                }
                if (customVisualizationObject.plotAreaFillColors !== scope.config.plotAreaFillColor) {
                    customVisualizationObject.plotAreaFillColors = scope.config.plotAreaFillColor;
                }
                // Update rotation
                if (customVisualizationObject.rotate !== scope.config.useBarsInsteadOfColumns) {
                    customVisualizationObject.rotate = scope.config.useBarsInsteadOfColumns;
                }
				// Commit updates to the chart
				customVisualizationObject.validateNow();
			}
		}
		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction };
	}
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);
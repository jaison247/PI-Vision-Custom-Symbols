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
		typeName: 'amcharts-SQCtrend',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'amCharts SQC Trend',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/amcharts-SQCtrend.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				DataShape: 'TimeSeries',
				DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 600,
				// Allow large queries
				Intervals: 1000,
				// Specify the value of custom configuration options
				minimumYValue: 0,
				maximumYValue: 100,
				yAxisRange: 'allSigma',
				showTitle: false,
                textColor: "white",
                backgroundColor: "transparent",
                plotAreaFillColor: "transparent",
                seriesColor: "rgb(62, 152, 211)",
                showChartScrollBar: true,
				useColumns: false,
                decimalPlaces: 2,
                bulletSize: 8,
				numberOfSigmas: '4',
				// Colors
				meanColor: "rgb(224, 138, 0)",
				sigma1Color: "rgb(178, 107, 255)",
				sigma2Color: "rgb(47, 188, 184)",
				sigma3Color: "rgb(219, 70, 70)",
				sigma4Color: "rgb(156, 128, 110)"
            };
		},
        // Allow use in collections! !!!!!!!!!!!!!!!!!!!!!!!!!
        supportsCollections: true,
		// By including this, you're specifying that you want to allow configuration options for this symbol
        configOptions: function () {
            return [{
				// Add a title that will appear when the user right-clicks a symbol
				title: 'Format Symbol',
				// Supply a unique name for this cofiguration setting, so it can be reused, if needed
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
		// Save the mean and std. deviation
        var mean = 0;
        var standardDeviation = 0;
        // Create vars to hold the min and max y-axis values
		var autoScaleMinimumValue, autoScaleMaximumValue;
        
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
            //console.log("New data received: ", data);
			if (data !== null && data.Data) {
				dataArray = [];
				// Check for an error
				if (data.Data[0].ErrorDescription) {
					console.log(data.Data[0].ErrorDescription);
				}
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// -----------------------------------------------------------------------------------------
				//console.log("Now creating custom visualization...");
				// Get the data item name(s) and unit(s)
                if (data.Data[0].Label) {
                    scope.config.Label = data.Data[0].Label;
                }
                if (data.Data[0].Units) {
					scope.config.Units = data.Data[0].Units;
                }
				// Add values to the data array; also calculate the mean and standard deviation! 
				// first, grab the minimum and maximum
				autoScaleMinimumValue = parseFloat(("" + data.Data[0].Values[0].Value).replace(",", ""));
				autoScaleMaximumValue = parseFloat(("" + data.Data[0].Values[0].Value).replace(",", ""));
				var arrayOfValidReadings = [];
				for (var i = 0; i < data.Data[0].Values.length; i++) {
                    // Create a new event object
					var newDataObject = {
						"timestamp": data.Data[0].Values[i].Time,
						"value": parseFloat( ("" + data.Data[0].Values[i].Value).replace(",", "") )
					};
					// Add this object to the data array
					dataArray.push(newDataObject);
					// Add the value to the sum and count, if applicable!
					if (!isNaN(newDataObject.value)) {
						// Save this value, and add the value to the sum!
						arrayOfValidReadings.push(newDataObject.value);
					}
					// Update the max and min, which later will be used for auto-scaling the chart
					if (newDataObject.value > autoScaleMaximumValue) {
						autoScaleMaximumValue = newDataObject.value;
					}
					if (newDataObject.value < autoScaleMinimumValue) {
						autoScaleMinimumValue = newDataObject.value;
					}
				}
				// Compute the mean!
				mean = average(arrayOfValidReadings);
                
				// Compute the standard deviation!
                //console.log(arrayOfValidReadings);
				standardDeviation = computeStandardDeviation(arrayOfValidReadings);

				//console.log("Data array: ", dataArray);
				// Create the custom visualization
				if (!customVisualizationObject) {
                    // Get the min, max, and guides
                    var tempMin = getCorrectChartMin();
                    var tempMax = getCorrectChartMax();
                    var tempGuides = makeGuidesArray();
                    // Create the chart
					customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, {
						"type": "serial",
						"backgroundAlpha": 1,
						"backgroundColor": scope.config.backgroundColor,
						"color": scope.config.textColor,
						"plotAreaFillAlphas": 1,
						"autoMargin": true,
						"autoMarginOffset": 30,
						"marginRight": 60,
						"plotAreaFillColors": scope.config.plotAreaFillColor,
						"creditsPosition": "bottom-right",
						"titles": createArrayOfChartTitles(),
                        "fontSize": 11,
						"pathToImages": "Scripts/app/editor/symbols/ext/images/",
						"categoryAxis": {
                            "parseDates": true,
                            "minPeriod": "ss",
                            "axisAlpha": 1,
                            "axisColor": "white",
                            "gridAlpha": 0,
							"autoWrap": true							
						},
                        "chartScrollbar": {
                            "graph": "g1",
                            "scrollbarHeight": 80,
                            "autoGridCount": true,
                            "enabled": scope.config.showChartScrollBar,
							"dragIcon": "dragIconRectSmall",
							"backgroundAlpha": 1,
							"backgroundColor": scope.config.plotAreaFillColor,
							"selectedBackgroundAlpha": 0.2
                        },
						"valueAxes": [
							{
								"title": scope.config.Units,
								"titleBold": false,
								"inside": false,
								"axisAlpha": 1,
								"axisColor": "white",
								//"fillAlpha": 0.05,
								"fillAlpha": 0,
								"gridAlpha": 0,
                                // New!!!!!!!!!!!!!!!!!!!!!
                                "minimum": tempMin,
                                "maximum": tempMax,
                                "guides": tempGuides
							}
						],
						"graphs": [{
                            "id": "g1",
							"type": "line",
                            "lineColor": scope.config.seriesColor,
							"balloonText": scope.config.Label + "<br /><b>[[timestamp]]</b><br />[[value]] " + scope.config.Units + "<br/>Mean: " + mean.toFixed(scope.config.decimalPlaces)  + "<br/>Std. Dev.: " + standardDeviation.toFixed(scope.config.decimalPlaces),  
							"valueField": "value",
                            "bullet": "square",
                            "bulletSize": scope.config.bulletSize
						}],
						"dataProvider": dataArray,
						"categoryField": "timestamp",
						"chartCursor": { 
							"cursorColor": "gray",
							"valueLineBalloonEnabled": true,
							"valueLineEnabled": true,
							"valueZoomable": true,
                            "categoryBalloonDateFormat": "D/MM/YYYY L:NN:SS A"
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
                    // Update the chart min and max
                    customVisualizationObject.valueAxes[0].minimum = getCorrectChartMin();
                    customVisualizationObject.valueAxes[0].maximum = getCorrectChartMax();
					// Update the guides
                    customVisualizationObject.valueAxes[0].guides = makeGuidesArray();
                    // Refresh the graph
					customVisualizationObject.dataProvider = dataArray;
					customVisualizationObject.validateData();
					customVisualizationObject.validateNow();
				}
			}
		}
        
		//************************************
		// Creates a chart guide!
		//************************************
		function createGuide(guideStart, guideEnd, color) {
			var label =  (guideEnd.toFixed(scope.config.decimalPlaces) + "-\n" + guideStart.toFixed(scope.config.decimalPlaces));
            if (guideEnd == guideStart) label = guideEnd.toFixed(scope.config.decimalPlaces);
            return {
				"fillAlpha": 0.20,
				"value": guideStart,
				"toValue": guideEnd,
				"fillColor": color,
				"color": color,
				"label": label,
				"position": "right",
                "boldLabel": true
			};
		}
		
		//************************************
		// Creates multiple chart guides, depending on the requested settings!
		//************************************
		function makeGuidesArray() {
			var guidesArray = [];
            var numberOfSigmasInt = parseInt(scope.config.numberOfSigmas, 10);
			// Add the mean and 1 sigma
			guidesArray.push(createGuide(mean, mean, scope.config.meanColor));
			guidesArray.push(createGuide(mean + 0 * standardDeviation, mean + 1 * standardDeviation, scope.config.sigma1Color));
			guidesArray.push(createGuide(mean - 0 * standardDeviation, mean - 1 * standardDeviation, scope.config.sigma1Color));
			// If requested, add 2 sigma
			if (numberOfSigmasInt >= 2) {
				guidesArray.push(createGuide(mean + 1 * standardDeviation, mean + 2 * standardDeviation, scope.config.sigma2Color));
				guidesArray.push(createGuide(mean - 1 * standardDeviation, mean - 2 * standardDeviation, scope.config.sigma2Color));
			}
			// If requested, add 3 sigma
			if (numberOfSigmasInt >= 3) {
				guidesArray.push(createGuide(mean + 2 * standardDeviation, mean + 3 * standardDeviation, scope.config.sigma3Color));
				guidesArray.push(createGuide(mean - 2 * standardDeviation, mean - 3 * standardDeviation, scope.config.sigma3Color));
			}
			// If requested, add 4 sigma
			if (numberOfSigmasInt >= 4) {
				guidesArray.push(createGuide(mean + 3 * standardDeviation, mean + 4 * standardDeviation, scope.config.sigma4Color));
				guidesArray.push(createGuide(mean - 3 * standardDeviation, mean - 4 * standardDeviation, scope.config.sigma4Color));			
			}
            //console.log("Guides array: ", guidesArray);
            return guidesArray;
		}
		
		//************************************
		// Function that computes the average and standard deviation of a dataset; see
		// https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
		//************************************
		function computeStandardDeviation(values) {
			// First, calculate the average
			var avg = average(values);
			// Next, create an array of the squared differences between each value and the mean
			var squareDiffs = values.map(function(value){
				// Calculate the difference from the mean
				var diff = value - avg;
				// Square that difference
				var sqrDiff = diff * diff;
				return sqrDiff;
			});
			// Calculate the average of the squred differences from the mean
			var avgSquareDiff = average(squareDiffs);
			// Take the square root of that average
			var stdDev = Math.sqrt(avgSquareDiff);
			return stdDev;
		}
        
		function average(data) {
			// Add all of the items!
            var sum = data.reduce(function(sum, value){
				return sum + value;
			}, 0);
			// Divide the sum by the number of items!
			var avg = sum / data.length;
			return avg;
		}
		
        //************************************
		// Function that gets the chart min and max
		//************************************
        function getCorrectChartMin() {
            var result =  undefined;
            // Apply fixed scaling, if turned on
            if (scope.config.yAxisRange == 'customRange') {
                result = scope.config.minimumYValue;
            } else if (scope.config.yAxisRange == 'fitAllSigma') {
                result = mean - standardDeviation * parseInt(scope.config.numberOfSigmas, 10);
            } else {
                // In this case, fit all values!
                result = undefined;
            }
            return result;
        }
        function getCorrectChartMax() {
            var result =  undefined;
            // Apply fixed scaling, if turned on
            if (scope.config.yAxisRange == 'customRange') {
                result = scope.config.maximumYValue;
            } else if (scope.config.yAxisRange == 'fitAllSigma') {
                result = mean + standardDeviation * parseInt(scope.config.numberOfSigmas, 10);
            } else {
                // In this case, fit all values!
                result = undefined;
            }
            return result;
        }
		
        
		//************************************
		// Function that returns an array of titles
		//************************************
		function createArrayOfChartTitles() {
            var titleText = "SQC Trend (-" + scope.config.numberOfSigmas + " to +" + scope.config.numberOfSigmas + " Sigma) of ";
            if (scope.config.Units) {
                titleText += scope.config.Label + " (" + scope.config.Units + ")";
            } else {
                titleText += scope.config.Label;
            }
			// Build the titles array
			var titlesArray = [
				{
					"text": titleText,
					"bold": true
				}
			];
			return titlesArray;
		}		
		
		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction() {
			// If the visualization exists...
			if(customVisualizationObject) {
				// Turn on column display (instead of line display, if specified)
				if (scope.config.useColumns) {
					customVisualizationObject.graphs[0].type = "column";
				} else {
					customVisualizationObject.graphs[0].type = "line";
				}
                // Update the chart min and max
                customVisualizationObject.valueAxes[0].minimum = getCorrectChartMin();
                customVisualizationObject.valueAxes[0].maximum = getCorrectChartMax();
				// Update the title
				if (scope.config.showTitle) {
					customVisualizationObject.titles = createArrayOfChartTitles();
				} else {
					customVisualizationObject.titles = null;
				}
                // Update colors and fonts
                if (customVisualizationObject.graphs[0].lineColor != scope.config.seriesColor) {
                    customVisualizationObject.graphs[0].lineColor = scope.config.seriesColor;
                }
                if (customVisualizationObject.color != scope.config.textColor) {
                    customVisualizationObject.color = scope.config.textColor;
                }
                if (customVisualizationObject.backgroundColor != scope.config.backgroundColor) {
                    customVisualizationObject.backgroundColor = scope.config.backgroundColor;
                }
                if (customVisualizationObject.plotAreaFillColors != scope.config.plotAreaFillColor) {
                    customVisualizationObject.plotAreaFillColors = scope.config.plotAreaFillColor;
					customVisualizationObject.chartScrollbar.backgroundColor = scope.config.plotAreaFillColor;
                }
                // Update the scroll bar
                if (customVisualizationObject.chartScrollbar.enabled != scope.config.showChartScrollBar) {
                    customVisualizationObject.chartScrollbar.enabled = scope.config.showChartScrollBar;
                }
                // Update the bullets 
                customVisualizationObject.graphs[0].bulletSize = scope.config.bulletSize;
				// Update the guides
                customVisualizationObject.valueAxes[0].guides = makeGuidesArray();
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
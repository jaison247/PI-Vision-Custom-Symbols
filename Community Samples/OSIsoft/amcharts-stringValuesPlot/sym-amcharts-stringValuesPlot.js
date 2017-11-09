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
		typeName: 'amcharts-stringValuesPlot',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'String Values Plot',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/sym-amcharts-stringValuesPlot.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				DataShape: "Timeseries",
				// Specify the default height and width of this symbol
				Height: 200,
				Width: 600,
				// Allow large queries
				Intervals: 1000,
				// Specify the value of custom configuration options
				showTitle: true,
                textColor: "white",
                backgroundColor: "transparent",
                plotAreaFillColor: "transparent",
                showChartScrollBar: true,
				lineThickness: 10,
				borderColor: "white",
				// Arrays to hold strings and colors
				uniqueStringsArray: [],
				uniqueColorsArray: [],
				useFixedColors: true
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
		// Save the start and end time
		var startTime = "";
		var endTime = "";
		
        //************************************
		// Specify a default color pallette
		//************************************
        var DEFAULT_CHART_COLORS = ["rgb(62, 152, 211)", "rgb(224, 138, 0)", "rgb(178, 107, 255)", "rgb(47, 188, 184)", "rgb(219, 70, 70)", "rgb(156, 128, 110)", "rgb(60, 191, 60)", "rgb(197, 86, 13)","rgb(46, 32, 238)","rgb(165, 32, 86)" ];
        		
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
				//console.log("New data received! ", data.Data[0]);
				// Get the data item name and units
                if (data.Data[0].Label) {
					// If the data item changed, clear the string and color arrays!
					if (scope.config.Label != data.Data[0].Label) {
						scope.config.uniqueColorsArray = [];
						scope.config.uniqueStringsArray = [];
					}
					// Save the label either way
                    scope.config.Label = data.Data[0].Label;
                }
                if (data.Data[0].Units) {
					scope.config.Units = data.Data[0].Units;
                }
				// Get the start and end time!
				if (data.Data[0].StartTime) {
					startTime = data.Data[0].StartTime;
                }
				if (data.Data[0].EndTime) {
					endTime = data.Data[0].EndTime;
                }
				// Add the start time to the plot, to make sure the axis is the correct width
				dataArray.push({
					"timestamp": startTime,
					// Set the actual y axis value to a constant value, null!
					"value": null,
					//"dataItemValue": data.Data[0].Values[i].Value,
					// Hide this event!
					"colorField": "transparent"
				});
				
				// First, get all unique strings, and create an array to hold colors for those strings!
				for (var i = 0; i < data.Data[0].Values.length; i++) {
					// Check if the array doesn't have this value!
					if (scope.config.uniqueStringsArray.indexOf(data.Data[0].Values[i].Value) == -1) {
						// Add this string to the array!  
						scope.config.uniqueStringsArray.push(data.Data[0].Values[i].Value);
						// Also add a color for this string!
						scope.config.uniqueColorsArray.push(DEFAULT_CHART_COLORS[ (scope.config.uniqueStringsArray.length - 1) % DEFAULT_CHART_COLORS.length ]);
					}
				}
				// At the end, you should have two identical-length arrays, one of unique strings and one of unique colors
				
				// Format the data as a new array that can be easily plotted; first, grab the minimum and maximum
				for (var i = 0; i < data.Data[0].Values.length; i++) {
                    // Look up the color!  By default, just use a unique color!
					var uniqueColorForThisString = DEFAULT_CHART_COLORS[ i % DEFAULT_CHART_COLORS.length ];
					if (scope.config.useFixedColors) {
						uniqueColorForThisString = scope.config.uniqueColorsArray[ scope.config.uniqueStringsArray.indexOf(data.Data[0].Values[i].Value) ];
					}
					
					// Create a new event object
					var newDataObject = {
						"timestamp": data.Data[0].Values[i].Time,
						// Set the actual y axis value to a constant value, but save the PI Point value for the overlay!
						"value": -10,
						"dataItemValue": data.Data[0].Values[i].Value,
						// Create a unique color for this line segment!
						"colorField": uniqueColorForThisString
					};
					// Add this object to the data array
					dataArray.push(newDataObject);
				}
				// Add the end time to the data series
				dataArray.push({
					"timestamp": endTime,
					// Set the actual y axis value to a constant value, null!
					"value": -10,
					// Hide this event!
					"colorField": "transparent"
				});
				//console.log("Data array: ", dataArray);
				// Create the custom visualization
				if (!customVisualizationObject) {
					customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, {
						"type": "serial",
						"backgroundAlpha": 1,
						"backgroundColor": scope.config.backgroundColor,
						"color": scope.config.textColor,
						"plotAreaFillAlphas": 1,
						"autoMargin": true,
						"autoMarginOffset": 30,
						"marginRight": 50,
						"plotAreaFillColors": scope.config.plotAreaFillColor,
						"creditsPosition": "bottom-right",
						"titles": createArrayOfChartTitles(),
                        "fontSize": 11,
						"pathToImages": "Scripts/app/editor/symbols/ext/images/",
						"categoryAxis": {
                            "parseDates": true,
                            "minPeriod": "ss",
                            "axisAlpha": 1,
                            "axisColor": scope.config.borderColor,
                            "gridAlpha": 0,
							"autoWrap": true							
						},
                        "chartScrollbar": {
                            "graph": "g1",
                            "scrollbarHeight": 30,
                            "autoGridCount": true,
                            "enabled": scope.config.showChartScrollBar,
							"dragIcon": "dragIconRectSmall",
							"backgroundAlpha": 1,
							"backgroundColor": scope.config.plotAreaFillColor,
							"selectedBackgroundAlpha": 0.2,
							"color": scope.config.textColor
                        },
						// Add a border to the plot!
						"plotAreaBorderAlpha": 1,
						"plotAreaBorderColor": scope.config.borderColor,
						"valueAxes": [
							{
								// Hide the y axis!
								"visible": false,
								"minimum": -10,
								"maximum": 0,
							}
						],
						"graphs": [{
                            // Use a field for a unique color for each segment!
							"lineColorField ": "colorField",
							"fillColorsField": "colorField",
							"fillAlphas": 1,
							"balloonText": scope.config.Label + "<br /><b>[[timestamp]]</b><br />[[dataItemValue]] " + scope.config.Units, 
							"valueField": "value",
							// Hide the balloons for the first and last balloons, since they dont' have valid values
							"balloonFunction": function(info) {
								if (info.dataContext.dataItemValue)
									return String(scope.config.Label + "<br /><b>" + info.dataContext.timestamp + "</b><br />" + info.dataContext.dataItemValue + " " + scope.config.Units);
								else
									return '';
							}
						}],
						"dataProvider": dataArray,
						"categoryField": "timestamp",
						"chartCursor": { 
							"cursorColor": "gray",
							"categoryBalloonDateFormat": "D/MM/YYYY L:NN:SS A",
							// Don't show the value cursor, since this is a one-dimensional plot!
							"valueLineBalloonEnabled": false,
							"valueLineEnabled": false,
							"valueZoomable": false
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
					// Refresh the graph
					customVisualizationObject.dataProvider = dataArray;
					customVisualizationObject.validateData();
					customVisualizationObject.validateNow();
				}
			}
		}
        
		//************************************
		// Function that gets a unique color for a particular string value
		//************************************
		function getUniqueColorForThisString() {
		}
		
		//************************************
		// Function that returns an array of titles
		//************************************
		function createArrayOfChartTitles() {
            var titleText = "";
            if (scope.config.Units) {
                titleText =  ("String Values Plot of " + scope.config.Label + " (" + scope.config.Units + ")");
            } else {
                titleText =  ("String Values Plot of " + scope.config.Label);
            }
			// Build the titles array
			var titlesArray = [
				{
					"text": titleText,
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
				// Update the title
				if (scope.config.showTitle) {
					customVisualizationObject.titles = createArrayOfChartTitles();
				} else {
					customVisualizationObject.titles = null;
				}
                // Update colors and fonts
				customVisualizationObject.color = scope.config.textColor;
				customVisualizationObject.backgroundColor = scope.config.backgroundColor;
				customVisualizationObject.plotAreaFillColors = scope.config.plotAreaFillColor;
				customVisualizationObject.plotAreaBorderColor = scope.config.borderColor;
				customVisualizationObject.chartScrollbar.backgroundColor = scope.config.plotAreaFillColor;
				customVisualizationObject.chartScrollbar.color = scope.config.textColor;
				customVisualizationObject.categoryAxis.axisColor = scope.config.borderColor;
                // Update the scroll bar
                customVisualizationObject.chartScrollbar.enabled = scope.config.showChartScrollBar;
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
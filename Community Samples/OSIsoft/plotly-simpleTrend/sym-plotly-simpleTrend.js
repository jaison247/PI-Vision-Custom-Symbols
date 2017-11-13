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
		typeName: 'plotly-simpleTrend',
		// Specify the user-friendly name of the symbol that will appear in PI Vision
		displayName: 'Plotly Trend',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/sym-plotly-simpleTrend.png',
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
				showTitle: false,
                textColor: "white",
                backgroundColor: "transparent",
                plotAreaFillColor: "transparent",
                seriesColor: "rgb(62, 152, 211)",
                showChartScrollBar: true
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
	symbolVis.prototype.init = function (scope, elem) {
		// Specify which function to call when a data update or configuration change occurs 
		this.onDataUpdate = myCustomDataUpdateFunction;
		this.onConfigChange = myCustomConfigurationChangeFunction;
		this.onResize = myCustomResizeFunction;
        
		// Locate the html div that will contain the symbol, using its id, which is "container" by default
		var symbolContainerDiv = elem.find('#container')[0];
        // Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
        symbolContainerDiv.id = newUniqueIDString;
		// Create a variable to hold the custom visualization object
		var customVisualizationObject = false;

        //************************************
		// Specify a default color pallette
		//************************************
        var chartColors = ["rgb(62, 152, 211)", "rgb(224, 138, 0)", "rgb(178, 107, 255)", "rgb(47, 188, 184)", "rgb(219, 70, 70)", "rgb(156, 128, 110)", "rgb(60, 191, 60)", "rgb(197, 86, 13)", "rgb(46, 32, 238)", "rgb(165, 32, 86)" ];
        		
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
            //console.log("New data received: ", data);
			if (data !== null && data.Data) {
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
                    scope.config.Label = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        scope.config.Label += (", " + data.Data[i].Label);
                    }
                    scope.config.Label = scope.config.Label.substring(1);
                }
                if (data.Data[0].Units) {
					scope.config.Units = data.Data[0].Units;
                }
                // Plotly example courtesy of https://plot.ly/javascript/range-slider/
                var preppedData = prepData(data.Data[0].Values);
                // Build an object containing styling for the chart
                var layout = getMostRecentChartLayout();
                // Specify permanent plot object configuration options
                var config = {
                    showLink: false,
                    displaylogo: false,
                    editable: false,
                    modeBarButtonsToRemove: ["sendDataToCloud"]
                };
                if (!customVisualizationObject) {
                    // Create the chart!
                    customVisualizationObject = true;
                    Plotly.newPlot(symbolContainerDiv, preppedData, layout, config);
                } else {
                    // Update the chart!
                    Plotly.newPlot(symbolContainerDiv, preppedData, layout, config);
                }
			}
		}
		
		//************************************
		// Function that converts the data from the PI System into a plotly-compatible format
		//************************************
		function prepData(rawData) {
            // Create two empty arrays for x and y values
			var x = [];
			var y = [];
            // Loop through the raw data and extract the x and y values
			rawData.forEach(function(datum) {
                //console.log(datum);
				x.push(new Date(datum['Time']));
				y.push(datum['Value']);
			});
            // Return the arrays, combined with formatting
			return [{
				mode: 'lines',
				x: x,
				y: y,
                line: {
                    color: scope.config.seriesColor
                }
			}];
		}
        
        //************************************
		// Function that gets the most recent chart layout
		//************************************
        function getMostRecentChartLayout() {
            // For guidance, see https://plot.ly/javascript/reference/
            return {
                title: createArrayOfChartTitles(),
                paper_bgcolor: scope.config.backgroundColor,
                plot_bgcolor: scope.config.plotAreaFillColor,
                font: {
                    size: 11,
                    color: scope.config.textColor
                },
                xaxis: {
                    rangeslider: {
                        visible: scope.config.showChartScrollBar,
                        bgcolor: scope.config.plotAreaFillColor
                    }
                },
                yaxis: {
                    fixedrange: true
                },
            };
        }
        
		//************************************
		// Function that returns an array of titles
		//************************************
		function createArrayOfChartTitles() {
            var titleText = "";
            if (scope.config.showTitle) {
                if (scope.config.Units) {
                    titleText =  ("Trend of" + scope.config.Label + " (" + scope.config.Units + ")");
                } else {
                    titleText =  ("Trend of" + scope.config.Label);
                }
            }
			return titleText;
		}		
		
		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction() {
			// If the visualization exists...
			if(customVisualizationObject) {
                // Build an object containing styling for the chart
                var newLayout = getMostRecentChartLayout();
                // Commit updates to the chart
                Plotly.relayout(symbolContainerDiv, newLayout);
			}
		}
        
        //************************************
		// Function that is called when the symbol is resized
		//************************************
        function myCustomResizeFunction() {
            if(customVisualizationObject) {
                Plotly.Plots.resize(symbolContainerDiv);
            }
        }

		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction };
	}
	// Register this custom symbol definition with PI Vision
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.PIVisualization);
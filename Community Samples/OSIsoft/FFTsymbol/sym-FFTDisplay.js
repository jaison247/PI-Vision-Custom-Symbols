
/**
# ***********************************************************************
# * DISCLAIMER:
# *
# * All sample code is provided by OSIsoft for illustrative purposes only.
# * These examples have not been thoroughly tested under all conditions.
# * OSIsoft provides no guarantee nor implies any reliability,
# * serviceability, or function of these programs.
# * ALL PROGRAMS CONTAINED HEREIN ARE PROVIDED TO YOU "AS IS"
# * WITHOUT ANY WARRANTIES OF ANY KIND. ALL WARRANTIES INCLUDING
# * THE IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY
# * AND FITNESS FOR A PARTICULAR PURPOSE ARE EXPRESSLY DISCLAIMED.
# ************************************************************************
#
# Updated by dlopez@osisoft.com
# Visualizations provided by amCharts: https://www.amcharts.com/
#
**/

//************************************
// Begin defining a new symbol
//************************************
(function (CS) {
	'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Coresight to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'FFTDisplay',
		// Specify the user-friendly name of the symbol that will appear in PI Coresight
		displayName: 'FFT Display',
		// Specify the number of data sources for this symbol; for a gauge, it'll be just a single data source
		datasourceBehavior: CS.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/FFTDisplay.png',
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				DataShape: 'Table',
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 300,
				// Specify the value of custom configuration options
				showTitle: true,
                textColor: "black",
                backgroundColor: "white",
                plotAreaFillColor: "white",
                fontSize: 14,
				seriesColor: "red"
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
		init: myCustomSymbolInitFunction
	};
	
	//************************************
	// Function called to initialize the symbol
	//************************************
	function myCustomSymbolInitFunction(scope, elem) {
		// Locate the html div that will contain the symbol, using its id, which is "container" by default
		var symbolContainerDiv = elem.find('#container')[0];
        // Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
		// Write that new unique ID back to overwrite the old id
        symbolContainerDiv.id = newUniqueIDString;
		// Create a variable to hold the custom visualization object and data
		var customVisualizationObject = false
		// Create a variable to hold the combined data array
		var dataArray = [];
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			if (data !== null && data.Rows) {
				dataArray = [];
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// ---------------------------------------------------------------------------------
				console.log("Now creating custom visualization...");
				//console.log(data);
				// Get the data item name and units
				if (data.Rows[0].Label) {
					scope.config.Label = data.Rows[0].Label.split("|")[0];
                }
				// Fill the data array
                for (var i = 1; i < data.Rows.length; i++) {
                    var newObject = {
                        "value": data.Rows[i].Value,
                        "label": (i + " Hz")
                    };
                    // Add this to the array
                    dataArray.push(newObject);
                }
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				//console.log("Data array: ", dataArray);
				// ------------------------------------------------------------------------------------------
				if (!customVisualizationObject) {
					// Use the amcharts Javascript library to create this visualization; download it from here:
					// https://www.amcharts.com/download/	
                    // Place that file into the same directory as this file 
                    //(C:\Program Files\PIPC\Coresight\Scripts\app\editor\symbols\ext)
                    customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, {
                        "type": "serial",
                        "backgroundAlpha": 1,
                        "backgroundColor": scope.config.backgroundColor,
                        "color": scope.config.textColor,
                        "plotAreaFillAlphas": 1,
                        "plotAreaFillColors": scope.config.plotAreaFillColor,
                        "fontFamily": "arial",
                        "marginRight": 30,
                        "creditsPosition": "top-right",
                        "titles": createArrayOfChartTitles(),
                        "fontSize": 12,
                        "valueAxes": [{
                            "visible": true, 
                            "showFirstLabel": true,
                            "showLastLabel": true, 
                            "labelRotation" : 0, 
                            "labelOffset": 7,
                            "gridAlpha": 0.15,
                            "title": "Amplitude (G)"
                        }],
                        "categoryAxis": {
                            "labelRotation" : 0,
                            "labelOffset": 10,
                            "visible": true,
                            "axisAlpha": 1,
                            "gridAlpha": 0.15,
                            "title": "Frequency (Hertz)"
                        },
                        "chartScrollbar": {
                            "autoGridCount":false, 
                            "oppositeAxis":false,
                            "backgroundAlpha": 0.1,
                            "selectedBackgroundAlpha": 0.2,
                            "scrollbarHeight": 7,
                            "dragIcon": "dragIconRectSmall",
                            "dragIconHeight": 15
                        },
                        "brightnessStep": 10,
                        "graphs": [{
                            //"type": "",
                            "fillAlphas": 0,
                            "lineAlpha": 1,
                            "lineColor": scope.config.seriesColor,
                            "balloonText": "<b>[[label]]: [[value]]", 
                            "valueField": "value",
                        }],
                        "balloon": {
                            "borderAlpha":0
                        },
                        "rotate": false, 
                        "dataProvider": dataArray,
                        "categoryField": "label",
                        "chartCursor": { 
                            "cursorColor": "gray",
                            "valueLineAlpha": 0.5,
                            "valueBalloonsEnabled": false,
                            "valueLineBalloonEnabled": false,
                            "valueLineEnabled": true,
                            // Category (names)
                            //"cursorAlpha": 0.5,
                            "categoryBalloonEnabled": true,
                            "categoryLineEnabled": false,
                            "zoomable": true,
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
		// Function that returns an array of titles
		//************************************
		function createArrayOfChartTitles() {
			// Build the titles array
			var titlesArray = [
				{
					"text": "Fast Fourier Transform",
					"size": (scope.config.fontSize + 3)
				},
				{
					"text": "for PI AF Element '" + scope.config.Label + "'",
					"size": function () {
                        if (scope.config.fontSize >= 3) {
                            return (scope.config.fontSize - 3);
                        } 
                        else {
                            return 0;
                        }
                    },
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
                if (customVisualizationObject.color !== scope.config.textColor) {
                    customVisualizationObject.color = scope.config.textColor;
                }
                if (customVisualizationObject.backgroundColor !== scope.config.backgroundColor) {
                    customVisualizationObject.backgroundColor = scope.config.backgroundColor;
                }
                if (customVisualizationObject.plotAreaFillColors !== scope.config.plotAreaFillColor) {
                    customVisualizationObject.plotAreaFillColors = scope.config.plotAreaFillColor;
                }
                if (customVisualizationObject.fontSize !== scope.config.fontSize) {
                    customVisualizationObject.fontSize = scope.config.fontSize;
                    customVisualizationObject.titles = createArrayOfChartTitles();
                }
				if (customVisualizationObject.graphs[0].lineColor !== scope.config.seriesColor) {
                    customVisualizationObject.graphs[0].lineColor = scope.config.seriesColor;
                }
				// Commit updates to the chart
				customVisualizationObject.validateNow();
				console.log("Styling updated.");
			}
		}
		
		// Specify which function to call when a data update or configuration change occurs 
		return { dataUpdate: myCustomDataUpdateFunction, configChange: myCustomConfigurationChangeFunction };
	}
	// Register this custom symbol definition with PI Coresight
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.Coresight);
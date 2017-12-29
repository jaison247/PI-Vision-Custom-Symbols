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
(function (PV) {
	'use strict';

    function symbolVis() { };
    PV.deriveVisualizationFromBase(symbolVis);
	var definition = {
		typeName: 'polarRadar',
		displayName: 'Polar Radar Chart',
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/polRad.png',
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		getDefaultConfig: function(){
			return {
				DataShape: 'Table',
				Height: 300,
				Width: 600,
				axisPosition: "Left",
                axesColor: "#FFAA33",
                backgroundColor: "#2E2E2E",
				chartColor: "#cccccc",
                fillColor: "#5555FF",
				fillOpacity: 0.3,
				gridColor: "#FFAA33",
				highLimit: 60,
				highLimitColor: "red",
				lowLimit: 30,
				lowLimitColor: "green",
				maxVal: 100,
				minVal: 0,
				nomLimitColor: "yellow",
				textColor: "#FFFFFF",
				useCustomAxisRange: false,
				chartType: "circles",
				includeElementName: false,
				colorThresholdExceptions: false,
				showThresholdBands: false,
				thresholdBandOpacity: 0.3,
				seriesBullets: "round"
			};
		},
        configOptions: function () {
            return [{
				title: 'Format Symbol',
                mode: 'format'
            }];
        }
	};
	
	symbolVis.prototype.init = function(scope, elem) {
		this.onDataUpdate = myCustomDataUpdateFunction;
		this.onConfigChange = myCustomConfigurationChangeFunction;
		var labels = getLabels(scope.symbol.DataSources);
		var chart = initChart();
		
		//console.log('scope: ', scope);
		//console.log('labels: ', labels);
		//console.log('chart: ', chart);

        //************************************
		// Create the new chart!
		//************************************
		function initChart() {
            // Locate the symbol element
			var symbolContainerDiv = elem.find('#container')[0];
			// Assign a unique ID to the element
            symbolContainerDiv.id = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
			// Get the chart default configuration
            var chartconfig = getChartConfig();
            // Create the chart object!
			var customVisualizationObject = AmCharts.makeChart(symbolContainerDiv.id, chartconfig);
			return customVisualizationObject;
		}
        
        //************************************
		// Extract the data item labels from a new update
		//************************************
        function getLabels(datasources) {
			return datasources.map(function(item){
                var isAttribute = /af:/.test(item);
                var label = isAttribute ? item.match(/\w*\|.*$/)[0] : item.match(/\w+$/)[0];
                if (!scope.config.includeElementName && (label.indexOf("|") !== -1)) {
					label = label.split("|")[label.split("|").length - 1];
				}
				return {
					Label: label
				};
			});
		}
		
		//************************************
		// Define what happens every time a new data update occurs
		//************************************
		var hasFirstDataUpdateOccurred = false;
		function myCustomDataUpdateFunction(newdata) {
            if (!newdata || !chart) return;
            // Get the data item labels
			if (!labels) {
                labels = getLabels(scope.symbol.DataSources);
            }
			// If Rows have Label => either configuration is updated 
			if (newdata.Rows[0].Label) {
                labels = newdata.Rows.map(
                    function(item) {
                        var label = item.Label;
						if (!scope.config.includeElementName && (label.indexOf("|") !== -1)) {
							label = label.split("|")[label.split("|").length - 1];
						}
						return {
                            Label: label
                        };
                    }
                );
            }
            // Convert the new data into the amCharts format, and feed it to the graph
			var dataprovider = convertToChartDataFormat(newdata, labels);
			//console.log('data: ', dataprovider);
			chart.dataProvider = dataprovider;
			chart.validateData();
			// Add plot bands if desired!  This will only run once, on init, after the first data update
			if (!hasFirstDataUpdateOccurred) {
				hasFirstDataUpdateOccurred = true;
				updatePlotBands();
			}
        }
        
        //************************************
		// Convert the data update from PI Vision into a format that amCharts accepts
		//************************************
		function convertToChartDataFormat(newdata, labels) {
			//console.log('newdata: ', newdata, '\r\n', 'labels: ', labels);
			return newdata.Rows.map(
                function(item, index) {
					//console.log('item: ', item);
					var threshCheck;
					if (scope.config.colorThresholdExceptions && (parseFloat(item.Value) > scope.config.highLimit)) {
						threshCheck = {
							StreamName: labels[index].Label,
							highValue: parseFloat(item.Value),
							Value: parseFloat(item.Value),
							Time: item.Time
						};
					} else if (scope.config.colorThresholdExceptions && (parseFloat(item.Value) < scope.config.lowLimit)) {
						threshCheck = {
							StreamName: labels[index].Label,
							lowValue: parseFloat(item.Value),
							Value: parseFloat(item.Value),
							Time: item.Time
						};
					} else {
						threshCheck = {
							StreamName: labels[index].Label,
							nomValue: parseFloat(item.Value),
							Value: parseFloat(item.Value),
							Time: item.Time
						};
					}	
					// console.log('check: ', threshCheck, '\r\n',
						// 'high: ', scope.config.highLimit, '\r\n',
						// 'low: ', scope.config.lowLimit, '\r\n',
						// 'high color: ', scope.config.highLimitColor, '\r\n',
						// 'low color: ', scope.config.lowLimitColor);
					return threshCheck;
                }
            );
		}
        
        //************************************
		// Define the initial chart formatting
		//************************************
		function getChartConfig() {
            return {
				"backgroundAlpha": 1,
				"backgroundColor": scope.config.backgroundColor,
				"categoryField": "StreamName",
				"color": scope.config.textColor,
				"dataProvider": "",
				"graphs": [{
					"bullet": "none",
					"fillAlphas": scope.config.fillOpacity,
					"lineAlpha": scope.config.fillOpacity,
					"lineColor": scope.config.fillColor,
					"valueField": "Value"
				}, {
					"balloonText": "<b> [[category]] </b><br/> [[highValue]] <br/> [[Time]]",
					"bullet": scope.config.seriesBullets,
					"bulletColor": scope.config.highLimitColor,
					"fillAlphas": 0,
					"lineAlpha": 0,
					"valueField": "highValue"
				}, {
					"balloonText": "<b> [[category]] </b><br/> [[lowValue]] <br/> [[Time]]",
					"bullet": scope.config.seriesBullets,
					"bulletColor": scope.config.lowLimitColor,
					"fillAlphas": 0,
					"lineAlpha": 0,
					"valueField": "lowValue"
				}, {
					"balloonText": "<b> [[category]] </b><br/> [[nomValue]] <br/> [[Time]]",
					"bullet": scope.config.seriesBullets,
					"bulletColor": scope.config.nomLimitColor,
					"fillAlphas": 0,
					"lineAlpha": 0,
					"valueField": "nomValue"
				}],
				//"startDuration": 1,
				"type": "radar",
				"valueAxes": [{
					"autoGridCount": true,
					"axisAlpha": 0.8,
					"axisColor": scope.config.axesColor,
					"fillAlpha": 0.2,
					"fillColor": scope.config.plotColor,
					"gridAlpha": 0.4,
					"gridColor": scope.config.gridColor,
					"gridType": scope.config.chartType,
					//"minimum": scope.config.minVal,
					"position": scope.config.axisPosition
				}]
			};
        }
        
		//************************************
		// Function that updates the plot bands
		//************************************
		function updatePlotBands() {
			var guidesArray = [];
			if (scope.config.colorThresholdExceptions && scope.config.showThresholdBands && (chart.valueAxes[0].min !== undefined) && (chart.valueAxes[0].max !== undefined)) {
				guidesArray = [
					{
						"value": chart.valueAxes[0].min,
						"toValue": scope.config.lowLimit,
						"fillColor": scope.config.lowLimitColor,
						"fillAlpha": scope.config.thresholdBandOpacity
					},
					{
						"value": scope.config.lowLimit,
						"toValue": scope.config.highLimit,
						"fillColor": scope.config.nomLimitColor,
						"fillAlpha": scope.config.thresholdBandOpacity
					},
					{
						"value": scope.config.highLimit,
						"toValue": chart.valueAxes[0].max,
						"fillColor": scope.config.highLimitColor,
						"fillAlpha": scope.config.thresholdBandOpacity
					}
				];				
			}
			chart.valueAxes[0].guides = guidesArray;
			// Update the chart again, now that the axis limits exist.
			chart.validateNow();
		}
		
        //************************************
		// Function that is called when custom configuration changes are made
		//************************************
		var oldLabelSettings;
		function myCustomConfigurationChangeFunction(data) {
			if (oldLabelSettings != scope.config.includeElementName) {
				oldLabelSettings == scope.config.includeElementName;
				labels = getLabels(scope.symbol.DataSources);
			}
            if (chart) {
                // Apply new settings
                chart.color = scope.config.textColor;
                chart.backgroundColor = scope.config.backgroundColor;
				chart.valueAxes[0].axisColor = scope.config.axesColor;
				chart.valueAxes[0].fillColor = scope.config.chartColor;
				chart.valueAxes[0].gridColor = scope.config.gridColor;
				
				// Apply custom axis range, if desired
				if (scope.config.useCustomAxisRange) {
					if (scope.config.maxVal != null) {
						chart.valueAxes[0].maximum = scope.config.maxVal;
					}
					if (scope.config.minVal != null) {
						chart.valueAxes[0].minimum = scope.config.minVal;
					}
				} else {
					chart.valueAxes[0].minimum = undefined;
					chart.valueAxes[0].maximum = undefined;
				}
                chart.graphs[0].lineColor = scope.config.fillColor;
                chart.graphs[0].fillAlphas = scope.config.fillOpacity;
                chart.graphs[0].lineAlpha = scope.config.fillOpacity;
				chart.graphs[1].bulletColor = scope.config.highLimitColor;
				chart.graphs[2].bulletColor = scope.config.lowLimitColor;
				chart.graphs[3].bulletColor = scope.config.nomLimitColor;
				chart.graphs[1].bullet = scope.config.seriesBullets;
				chart.graphs[2].bullet = scope.config.seriesBullets;
				chart.graphs[3].bullet = scope.config.seriesBullets;				
				// Set the chart shape
				chart.valueAxes[0].gridType = scope.config.chartType;
                // Draw the chart again
                chart.validateNow();
				// NEW: update plot bands
				updatePlotBands();
            }
		}
	};

	PV.symbolCatalog.register(definition); 
	
})(window.PIVisualization);

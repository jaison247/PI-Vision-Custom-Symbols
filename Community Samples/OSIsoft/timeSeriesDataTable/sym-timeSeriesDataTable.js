
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
#
#
**/

//************************************
// Begin defining a new symbol
//************************************
(function (CS) {
	//'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs PI Coresight to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'timeSeriesDataTable',
		// Specify the user-friendly name of the symbol that will appear in PI Coresight
		displayName: 'Time Series Data Table',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/timeSeriesDataTable.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
			return {
				//
				DataShape: 'TimeSeries',
				//DataQueryMode:  CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 400,
				// Specify the value of custom configuration options; see the "configure" section below
				showDataItemNameCheckboxValue: true,
				showTimestampCheckboxValue: true,
				numberOfDecimalPlaces: 2,
				dataItemColumnColor: "#cc4748",
				timestampColumnColor: "#fdd400",
				valueColumnColor: "#C0C0C0"
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
		var customVisualizationObject;
		var dataItemLabel = "";
		//************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			if(data) {
				// If the custom visualization hasn't been made yet... create the custom visualization!
				// Custom code begins here:
				// --------------------------------------------------------------------------------------------------
				console.log("Now creating custom visualization...");
				// Clear the table
				if(customVisualizationObject) {
					$('#' + symbolContainerDiv.id + ' tbody').remove();
				}
				customVisualizationObject = true;
				// Get the data item name
				if (data.Data[0].Path){
					dataItemLabel = (data.Data[0].Path.split("|"))[1]; 
				}
				// For each piece of data...
				data.Data[0].Values.forEach(function(pieceOfData) {
					// Create a new row for the table
					var newRow = symbolContainerDiv.insertRow(0);
					newRow.style = "width:100%";
					// If the "show data item" checkbox is checked, then add a cell to the row to contain this
					if (scope.config.showDataItemNameCheckboxValue) {
						var dataItemCell = newRow.insertCell(-1);
						dataItemCell.innerHTML = dataItemLabel;
						// Apply padding and the specified color for this column
						dataItemCell.style="padding-left:10px;padding-right:10px;color:" + scope.config.dataItemColumnColor;
					}
					// If the "show timestamp" checkbox is checked, then add a cell to the row to contain this
					if (scope.config.showTimestampCheckboxValue) {
						var timeStampCell = newRow.insertCell(-1);
						// Check to see if the timestamp is returned as a string or data object
						if (typeof(pieceOfData.Time) == "string")
						{
							timeStampCell.innerHTML = (pieceOfData.Time);
						} else {
							timeStampCell.innerHTML = myFormatTimestampFunction(pieceOfData.Time);
						}
						// Apply padding and the specified color for this column
						timeStampCell.style="padding-right:10px;padding-right:10px;color:" + scope.config.timestampColumnColor;
					}
					// Add a cell to the row to contain the value
					var valueCell = newRow.insertCell(-1);
					var newInnerHTMLString = "";
					// Check if the value is a string or error; if it isn't numeric, just display the raw string
					try {
    					newInnerHTMLString = "" + (Math.round(pieceOfData.Value * Math.pow(10, scope.config.numberOfDecimalPlaces))/Math.pow(10, scope.config.numberOfDecimalPlaces));
					}
					catch (err) {
						newInnerHTMLString = pieceOfData.Value;
					}
					// If the math above failed, display the raw data value (it's likely a string)
					if (newInnerHTMLString == "NaN") {
						newInnerHTMLString = pieceOfData.Value;
					}
					valueCell.innerHTML = newInnerHTMLString;
					// Apply padding and the specified color for this column
					valueCell.style="padding-right:10px;padding-right:10px;color:" + scope.config.valueColumnColor;
				});
				// Add a row of headers
				var headersRow = symbolContainerDiv.insertRow(0);
				// If the "show data item" checkbox is checked, then add a cell to the row to contain this
				if (scope.config.showDataItemNameCheckboxValue) {
					var dataItemHeaderCell = headersRow.insertCell(-1);
					dataItemHeaderCell.innerHTML = "Data Item";
					dataItemHeaderCell.style = "padding-left:10px;padding-right:10px;padding-right:10px;font-weight:bold";
				}
				// If the "show timestamp" checkbox is checked, then add a cell to the row to contain this
				if (scope.config.showTimestampCheckboxValue) {
					var timeStampHeaderCell = headersRow.insertCell(-1);
					timeStampHeaderCell.innerHTML = "Timestamp";
					timeStampHeaderCell.style = "padding-right:10px;padding-right:10px;font-weight:bold";
				}
				// Add a cell to the row to contain the value
				var valueHeaderCell = headersRow.insertCell(-1);
				valueHeaderCell.innerHTML = "Value";
				valueHeaderCell.style = "padding-right:10px;padding-right:10px;font-weight:bold";
			}
		}
		//************************************
		// Converts a date object to a small date string
		//************************************
		var myMonthAbbreviationsArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		function myFormatTimestampFunction(rawTime) {
			// Set a new date object to be the time from this particular piece of data
			var MyDateObject = new Date(0);
            MyDateObject.setUTCSeconds(rawTime);
			// Build a formatted string using the new date object
			var MyDateString = "";
			MyDateString = myPrependZeroIfNeededFunction(MyDateObject.getDate()) 
				+ "-" 
				+ myMonthAbbreviationsArray[MyDateObject.getMonth()] 
				+ "-" 
				+ MyDateObject.getFullYear()
				+ " " 
				+ myPrependZeroIfNeededFunction(MyDateObject.getHours()) 
				+ ":" 
				+ myPrependZeroIfNeededFunction(MyDateObject.getMinutes()) 
				+ ":" 
				+ myPrependZeroIfNeededFunction(MyDateObject.getSeconds());	
			return MyDateString;
		}
		//************************************
		// Prepends a zero to a number if necessary when building a date string, to ensure 2 digits are always present
		//************************************
		function myPrependZeroIfNeededFunction(MyNumber) {
			// If the number is less than 10...
			if (MyNumber < 10) {
				// Add a zero ahead of it, to ensure it'll appear as two characters
				return ("0" + MyNumber);
			} else {
				return (MyNumber);
			}
		}
		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction(data) {
			// All configuration changes for this symbol are set up to take effect
			// automatically every data update, so there's no need for specific config change code here
		}
		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction };		
	}
	// Register this custom symbol definition with PI Coresight
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
})(window.Coresight);
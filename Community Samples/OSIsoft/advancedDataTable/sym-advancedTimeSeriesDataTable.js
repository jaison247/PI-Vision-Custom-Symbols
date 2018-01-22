/*
Copyright 2017 OSIsoft, LLC.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
	http://www.apache.org/licenses/LICENSE-2.0
		
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*
DataTables License:

MIT license
Copyright (C) 2008-2017, SpryMedia Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


//************************************
// Begin defining a new symbol
//************************************
(function (CS) {
	//'use strict';
	// Specify the symbol definition	
	var myCustomSymbolDefinition = {
		// Specify the unique name for this symbol; this instructs the application to also
		// look for HTML template and config template files called sym-<typeName>-template.html and sym-<typeName>-config.html
		typeName: 'advancedTimeSeriesDataTable',
		// Specify the user-friendly name of the symbol that will appear
		displayName: 'Advanced Time Series Data Table',
		// Specify the number of data sources for this symbol; just a single data source or multiple
		datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
		// Specify the location of an image file to use as the icon for this symbol
		iconUrl: '/Scripts/app/editor/symbols/ext/advancedTimeSeriesDataTable.png',
		visObjectType: symbolVis,
		// Specify default configuration for this symbol
		getDefaultConfig: function () {
            return {
				//
				DataShape: 'TimeSeries',
				//DataQueryMode:  CS.Extensibility.Enums.DataQueryMode.ModeEvents,
				// Specify the default height and width of this symbol
				Height: 300,
				Width: 550,
                Intervals: 1000,
                // Save the new unique symbol name
                UniqueSymbolElementName: "",
                // Specify the value of custom configuration options; see the "configure" section below
                numberOfDecimalPlaces: 2,
				// Row colors
                hoverColor: "lightblue",
				evenRowColor: "white",
				oddRowColor: "lightgray",
				// Overall styling colors
				backgroundColor: "white",
                textColor: "black",
                // Transpose
                transposeTable: false,
                // Conditional formatting rules
                applyConditionalFormatting: false,
                applyConditionalFormattingTo: "background-color",
                // Operator used in conditional tests
                // Freeze the top row
                freezeHeadersRow: false,
                // Change overall font size
                textSize: 14,
                // Use custom column names
                useCustomDataItemNames: false,
                numberOfDataItems: 0,
                // Specify the query type
                dataQueryType: "compressed",
                interpolationInterval: 10,
                interpolationUnits: "minutes",
                // Specify the text alignment
                textAlignment: "left",
                // Background color
                tableMenuBarColor: "rgb(31,112,68)",
                // Descend results or not
                defaultOrder: "ascending",
                useCustomColumnWidths: false, // Not implemented
                // Allow specifying custom timestamp formats
                timestampDisplayFormat: "localeString",
                // Array for remembering column filter settings
                /*
                dataItemThresholdsArray:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                dataItemThresholdsArray2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                testTrueColors:  ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green"],
                testFalseColors: ["red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red"],
                conditionalOperatorsArray:  ["lessthan", "lessthan", "lessthan", "lessthan", "lessthan", "lessthan", "lessthan", "lessthan", "lessthan", "lessthan", "lessthan", "lessthan"],
                conditionalOperatorsArray2: ["notused", "notused", "notused", "notused", "notused", "notused", "notused", "notused", "notused", "notused", "notused"],
                customDataItemNamesArray:   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                originalDataItemNamesArray: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                dataTableFooterFilterStringsArray: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                */
                useCustomColumnWidthArray: [], // Not implemented
                customColumnWidthArray: [], // Not implemented
                dataItemThresholdsArray:  [],
                dataItemThresholdsArray2: [],
                testTrueColors:  [],
                testFalseColors: [],
                conditionalOperatorsArray:  [],
                conditionalOperatorsArray2: [],
                customDataItemNamesArray:   [],
                originalDataItemNamesArray: [],
                dataTableFooterFilterStringsArray: []
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
        // Global variable for tracking the table object
        var myDataTableObject;
        // Locate the html div that will contain the symbol, using its id, which is "container" by default
        var symbolContainerElement = elem.find('#container')[0];
        // Check if the new unique string is empty!  If it is, assign a unique name
        if (scope.config.UniqueSymbolElementName === "") {
            scope.config.UniqueSymbolElementName = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
            //console.log("Generated new unique ID for table symbol: " + scope.config.UniqueSymbolElementName);
        }
        // Use random functions to generate a new unique id for this symbol, to make it unique among all other custom symbols
		//var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
        // Write that new unique ID back to overwrite the old id
        //symbolContainerElement.id = newUniqueIDString;
        symbolContainerElement.id = scope.config.UniqueSymbolElementName;
        // Create global arrays for the labels, units, data, and rows in the dataset
		var dataItemUnitsArray  = [];
        var dataTableArray = [];
        var maximumNumberOfRowsInDataSet;
        // Create a variable to temporarily allow pausing refresh
        var allowTableRefresh = true;
        // Timestamp-type tags will be dealt with differently; use a regular expression to detect them
        var REG_EXP_FOR_DETECTING_TIMESTAMPS = new RegExp(".*[:].*[:].*");
        // The first time this symbol is created, initialize the arrays that will hold the units, thresholds, colors,
        // operators, names, and filter strings
        var MAX_NUMBER_OF_DATA_ITEMS = 30;
        for (var dataItemIndex = 0; dataItemIndex < MAX_NUMBER_OF_DATA_ITEMS; dataItemIndex++) {
            scope.config.customColumnWidthArray.push(null);
            scope.config.dataItemThresholdsArray.push(0);
            scope.config.dataItemThresholdsArray2.push(0);
            scope.config.testTrueColors.push("green");
            scope.config.testFalseColors.push("red");
            scope.config.conditionalOperatorsArray.push("lessthan");
            scope.config.conditionalOperatorsArray2.push("notused");
            scope.config.customDataItemNamesArray.push("");
            scope.config.originalDataItemNamesArray.push("");
            scope.config.dataTableFooterFilterStringsArray.push("");
            dataItemUnitsArray.push("");
        }

        //************************************
		// When a data update occurs...
		//************************************
		function myCustomDataUpdateFunction(data) {
			// If there is indeed new data in the update
			if (data && allowTableRefresh) {
                // Get the number of data items
                scope.config.numberOfDataItems = data.Data.length;
                // Update the data table and row count!
                createDataTableArrayAndGetRowCount(data.Data);
                // Create the final array of header strings;
                // This has to occur first before transposing or adding search cells
                var dataTableHeaderStringsArray = createArrayOfTableHeaderStrings();
                // Check if the table should be transposed
                if (scope.config.transposeTable) {
                    // If so, create the transposed data array
                    // Note that this requires feeding in the correct header strings array
                    dataTableArray = createTransposedDataTableArray(dataTableHeaderStringsArray);
                    // OVERWRITE the header strings arraya, since we're transposing!!!!!!!!!!!!!!!!!!!!!
                    // For each row in the data array, add an empty placeholder, PLUS ONE EXTRA ONE
                    dataTableHeaderStringsArray = [];
                    for (var rowIndex = 0; rowIndex < maximumNumberOfRowsInDataSet + 1; rowIndex++) {
                        dataTableHeaderStringsArray.push ("");
                    }
                }
                // Clear the table element            
                if (myDataTableObject) {
                    myDataTableObject.destroy();
                    $('#' + symbolContainerElement.id).empty(); 
                }
                // Add a row of footers to the table to allow searching by column
                // Note that this requires feeding in the correct header strings array
                addFootersRowToAllowSearchingByColumn(dataTableHeaderStringsArray);
                // Re-draw the table!
                renderAdvancedTable(dataTableHeaderStringsArray);
                // Every time the a button is clicked, add a handler to save the current state!
                myDataTableObject.on('buttons-action', function (e, buttonApi, dataTable, node, config) {
                    if (myDataTableObject) {
                        // Save the current state
                        console.log("Saving state settings...");
                        myDataTableObject.state.save();
                    }
                } );
                // Add search functions
                addSearchFunctionsToCellsInFooterRow();
                // Re-apply previosuly saved search criteria!
                executeSearchFunctionsOnEachColumn();
                // Resize the table
                myCustomResizeFunction();
			}
		}

        // ----------------------------------------------------------------------------------------------------------
        // MAIN TABLE RENDERING FUNCTION
        // ----------------------------------------------------------------------------------------------------------
        
        //************************************
        // Renders the table!
        //************************************
        function renderAdvancedTable(dataTableHeaderStringsArray) {
            myDataTableObject = $('#' + symbolContainerElement.id).DataTable( {
                //dom: '<Brf>t',
                dom: 'Brft',
                data: dataTableArray,
                columns: createFormattedHeaderObjectArray(dataTableHeaderStringsArray),
                // Allow reordering columns and navigating table using the keypad
                colReorder: true,
                keys: true,
                //bInfo: true,
                select: true,
                //destroy: true,
                // Remember the state of the table (which columns are visible, for example)
                stateSave: true,
                // Show processing label if needed
                "processing": true,
                // Frozen header settings
                fixedHeader: {
                    header: true
                },			
                // Button settings
                buttons: [
                    {
                        // Allow only printing visible columns
                        extend: 'print',
                        exportOptions: {
                            columns: ':visible' 
                        }
                    },
                    // Allow HTML5-based copying
                    'copyHtml5',
                    {
                        // Allow exporting to a CSV
                        extend: 'csvHtml5',
                        fieldSeparator: ',',
                        extension: '.csv'
                    },
                    'colvis', 
                    {
                        // Add a show all column visibility button
                        extend: 'colvisGroup',
                        text: 'Show all',
                        show: ':hidden'
                    },
                    // Add a button to allow disabling table refresh
                    {
                        text: '<b>Refreshing</b> <b style="color:green">Enabled</b>',
                        action: function ( e, dt, node, config ) {
                            // Toggle the refresh!
                            allowTableRefresh = !allowTableRefresh;
                            // Update the text
                            if (allowTableRefresh) {
                                this.text('<b>Refreshing</b> <b style="color:green">Enabled</b>');
                            } else {
                                this.text('<b>Refreshing</b> <b style="color:red">Disabled</b>');
                            }
                        }
                    }
                ],
                // Table filter settings
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search all rows"
                },
                // Scrolling settings
                paging: true,
                deferRender:    true,
                scrollX:        true,
                scrollY:        calculateDesiredTableHeight(),
                scrollCollapse: true,
                scroller:       true,
                // Apply conditional formatting by row
                rowCallback: function(rowElement, rowDataArray, rowIndex) {
                    customConditionalFormattingFunction(rowElement, rowDataArray, rowIndex);
                } 
            });
        }

        // ----------------------------------------------------------------------------------------------------------
        // MAIN DATA UPDATE / DATA PREP FUNCTIONS
        // ----------------------------------------------------------------------------------------------------------
        
        //************************************
		// Function that acts on a new data update and updates the global data table and row count
		//************************************
        function createDataTableArrayAndGetRowCount(dataItems) {
            // Clear the data table array and reset the row count   
            dataTableArray = [];
            maximumNumberOfRowsInDataSet = 1;
            
            // Loop through all of the data items, get labels and units, and get the max number of rows
            for (var dataItemIndex = 0; dataItemIndex < scope.config.numberOfDataItems; dataItemIndex++) {
                // Get the data item name and units
                if (dataItems[dataItemIndex].Label){
                    scope.config.originalDataItemNamesArray[dataItemIndex] = dataItems[dataItemIndex].Label;
                    // Update the custom names array, if it's blank at this cell
                    if (scope.config.customDataItemNamesArray[dataItemIndex] == "") {
                        scope.config.customDataItemNamesArray[dataItemIndex] = scope.config.originalDataItemNamesArray[dataItemIndex];
                    }
                }
                // Get the units for this data item
                if (dataItems[dataItemIndex].Units) {
                    dataItemUnitsArray[dataItemIndex]  = dataItems[dataItemIndex].Units;
                }
                // Get the maximum number of data items returned
                if (maximumNumberOfRowsInDataSet < dataItems[dataItemIndex].Values.length) {
                    maximumNumberOfRowsInDataSet = dataItems[dataItemIndex].Values.length;
                }
                // Get the error code, if there is one
                if (dataItems[dataItemIndex].ErrorDescription) {
                    console.log("Error from custom symbol '" + symbolContainerElement.id + "' data item '" + dataItemIndex + "': " + dataItems[dataItemIndex].ErrorDescription);
                    // If the error is about the data range, then show an alert!
                    if (dataItems[dataItemIndex].ErrorDescription.indexOf("Please modify the query to return fewer points or increase the limit") != -1) {
                        alert("Table symbol error!\n" + dataItems[dataItemIndex].ErrorDescription + ".");
                    }
                }
            }
            // Note: if you're using sampled data, then reset the number of rows based on the sample interval
            if (scope.config.dataQueryType == "sampled") {
                // Calculate the total duration
                var startTime = new Date(dataItems[0].StartTime);
                var endTime = new Date(dataItems[0].EndTime);
                // Calculate the interpolation interval
                var interpolationIntervalSeconds = 1;
                switch (scope.config.interpolationUnits) {
                    case "seconds":
                        interpolationIntervalSeconds = 1 * scope.config.interpolationInterval;
                        break;
                    case "minutes":
                        interpolationIntervalSeconds = 60 * scope.config.interpolationInterval;
                        break;
                    case "hours":
                        interpolationIntervalSeconds = 3600 * scope.config.interpolationInterval;
                        break;
                    case "days":
                        interpolationIntervalSeconds = 86400 * scope.config.interpolationInterval;
                        break;                                           
                }
                // Create an array of timestamps, and reinitialize the row count
                var interpolatedTimestampsArray = [];
                
                // Start at the end time, and march back in time by the interpolation interval
                for (var currentTimestamp = endTime; currentTimestamp >= startTime; currentTimestamp = new Date(currentTimestamp - interpolationIntervalSeconds * 1000)) {
                    // Store this timestamp in the timestamp array
                    interpolatedTimestampsArray.push(currentTimestamp)
                }
                // The array will be out of order! Reverse it!
                interpolatedTimestampsArray = interpolatedTimestampsArray.reverse();
                
                // The number of timestamps in the array is the row count!
                maximumNumberOfRowsInDataSet = interpolatedTimestampsArray.length;
                
                // Populate the data table array
                for (var timestampNumber = 0; timestampNumber < interpolatedTimestampsArray.length; timestampNumber++) {

                    // For each row, loop through the data items...
                    var newRowObject = [];
                    for (var dataItemIndex = 0; dataItemIndex < scope.config.numberOfDataItems; dataItemIndex++) {

                        // Initialize the time and value cells for this data item to empty space
                        var timestampString = "";
                        var valueString = "";
                        
                        // Format the timestamp as a string that can be properly sorted!
                        timestampString = applyTimeStampFormatting(interpolatedTimestampsArray[timestampNumber]);
                        
                        // Add the timestamp as a cell to this row
                        newRowObject.push(timestampString);
                        
                        // Add the correct interpolated value at this timestamp for this data item
                        valueString = getInterpolatedValueAtThisTimestamp(interpolatedTimestampsArray[timestampNumber], dataItems[dataItemIndex].Values);
                        
                        // Add the value string to this row
                        newRowObject.push(valueString);
                    }
                    // You're done adding timestamps and values; now add this row to the table
                    dataTableArray.push(newRowObject);
                    
                }
                // You're done adding rows; now the data table is fully populated!
            } else {
                // In this case, you're doing normal compressed data querying!
                // Populate the data table array normally, WITHOUT interpolation
                for (var rowNumber = 0; rowNumber < maximumNumberOfRowsInDataSet; rowNumber++) {

                    // For each row, loop through the data items...
                    var newRowObject = [];
                    for (var dataItemIndex = 0; dataItemIndex < scope.config.numberOfDataItems; dataItemIndex++) {

                        // Initialize the time and value cells for this data item to empty space
                        var timestampString = "";
                        var valueString = "";

                        // Check to see if the current data item has a value for this cell
                        if (dataItems[dataItemIndex].Values[rowNumber]) {

                            // If so, write the timestamp
                            timestampString = applyTimeStampFormatting(new Date(dataItems[dataItemIndex].Values[rowNumber].Time));
							
							// Next, if the data value is a timestamp, leave it as is; otherwise try to parse it
							if (REG_EXP_FOR_DETECTING_TIMESTAMPS.test(dataItems[dataItemIndex].Values[rowNumber].Value)) {
                                // Yes!  The value is actually a timestamp, so don't parse it to a float; just leave it as is
								valueString = dataItems[dataItemIndex].Values[rowNumber].Value;
							} else {
								// Next, write the value, if it exists
								valueString = "NaN";
								// Check if the value is a string or error; if it isn't numeric, just display the raw string
								valueString = parseFloat("" + dataItems[dataItemIndex].Values[rowNumber].Value).toFixed(scope.config.numberOfDecimalPlaces);
								if (valueString == "NaN") {
									valueString = dataItems[dataItemIndex].Values[rowNumber].Value;
								}
							}
                        }
                        // Add the timestamp and value strings to this row
                        newRowObject.push(timestampString);
                        newRowObject.push(valueString);
                    }
                    // You're done adding timestamps and values; now add this row to the table
                    dataTableArray.push(newRowObject);
                }
            }
            // You're done adding rows; now the data table is fully populated!
        }
        
        // ----------------------------------------------------------------------------------------------------------
        // INTERPOLATION FUNCTIONS
        // ----------------------------------------------------------------------------------------------------------
        
        //************************************
        // Function that interpolates a value at a particular time, given the timestamp and original array of timestamps and values
        //************************************
        function getInterpolatedValueAtThisTimestamp(currentTimestamp, originalDataArray) {
            var interpolatedValue = "";
            // Check if this value is outside the range
            if (currentTimestamp < new Date(originalDataArray[0].Time)) {
                interpolatedValue = originalDataArray[0].Value;    
            } else if (currentTimestamp > new Date(originalDataArray[originalDataArray.length-1].Time)) {
                interpolatedValue = originalDataArray[originalDataArray.length-1].Value;    
            } else {
                //console.log(currentTimestamp, originalDataArray);
                // Loop through the data array
                for (var dataItemIndex = 0; dataItemIndex < originalDataArray.length-1; dataItemIndex++) {

                    // Convert timestamp strings into dates
                    var previousArrayTimestamp = new Date(originalDataArray[dataItemIndex].Time);
                    var nextArrayTimestamp    = new Date(originalDataArray[dataItemIndex+1].Time);

                    // Check if this interpolated value is between two items
                    if ((nextArrayTimestamp > currentTimestamp) && (currentTimestamp >= previousArrayTimestamp)) {
                        // Check for strings!  If so, use the first string
                        if (("" + parseFloat(originalDataArray[dataItemIndex].Value)) == "NaN") {
                            interpolatedValue = originalDataArray[dataItemIndex].Value;
                        } else {                        
                            // If it is, figure out the percentage difference in timestamps
                            var percentage = (currentTimestamp - previousArrayTimestamp) / (nextArrayTimestamp - previousArrayTimestamp);
                            
                            // Do a last-minute check--see if the value type originally is a timestamp!  If so, don't try to parse it
                            if (REG_EXP_FOR_DETECTING_TIMESTAMPS.test(originalDataArray[dataItemIndex].Value)) {
                                // Yes!  The value is actually a timestamp, so don't parse it to a float; just leave it as is
                                interpolatedValue = (new Date( Date.parse(originalDataArray[dataItemIndex].Value) + (Date.parse(originalDataArray[dataItemIndex+1].Value) - Date.parse(originalDataArray[dataItemIndex].Value)) * percentage )).toLocaleString();
                            } else {
                                // Multiply that percentage difference by the value span between the two values, and add it to the first value
                                interpolatedValue = parseFloat(originalDataArray[dataItemIndex].Value) + (parseFloat(originalDataArray[dataItemIndex+1].Value) - parseFloat(originalDataArray[dataItemIndex].Value)) * percentage;
                                
                                // Check if the value is a string or error; if it isn't numeric, just display the raw string
                                var parsedInterpolatedValue = parseFloat("" + interpolatedValue).toFixed(scope.config.numberOfDecimalPlaces);
                                if (("" + parsedInterpolatedValue) != "NaN") {
                                    // If this condition is met, then parsing the result succeeded!  Return the parsed version
                                    interpolatedValue = parsedInterpolatedValue;
                                }
                            }
                        }
                        // You're done!
                        break;                        
                    }
                }
            }
            return interpolatedValue;
        }
        
        // ----------------------------------------------------------------------------------------------------------
        // STRING AND DATE FORMATTING FUNCTIONS
        // ----------------------------------------------------------------------------------------------------------
        
        //************************************
        // Function that formats a timestamp depending on the user preference
        //************************************
        function applyTimeStampFormatting(dateObject) {
            var timestampString = "";
            switch (scope.config.timestampDisplayFormat) {
                case "timeOnly":
                    timestampString = dateObject.toTimeString().split(" ")[0];
                    break;
                case "timeOnlyFormatted":
                    timestampString = dateObject.toLocaleString().split(", ")[1];
                    break;                    
                case "localeString":
                    timestampString = dateObject.toLocaleString();
                    break;
                case "dateAndTimeSortable":
                    timestampString = dateObject.getFullYear() + "/" + formatAs2Digits(dateObject.getMonth() + 1) + "/" + formatAs2Digits(dateObject.getDate()) + " " + dateObject.toTimeString().split(" ")[0];
                    break;
                case "dateSortable":
                    timestampString = dateObject.getFullYear() + "/" + formatAs2Digits(dateObject.getMonth() + 1) + "/" + formatAs2Digits(dateObject.getDate());
                    break;     
                case "dateFormatted":
                    timestampString = dateObject.toLocaleDateString();
                    break;                     
            }
            return timestampString;
        }
        
        //************************************
        // Pads a number witha  zero if it is less than 10
        //************************************
        function formatAs2Digits(number) {
            if (number < 10) {
                return ("0" + number);
            } else {
                return ("" + number);
            }
        }
        
        // ----------------------------------------------------------------------------------------------------------
        // RESIZING FUNCTIONS
        // ----------------------------------------------------------------------------------------------------------
        
        //************************************
		// Function that is called when a resize occurs; it is assisted by a function that calculates the table height
		//************************************
        function myCustomResizeFunction() {
            if (myDataTableObject) {
                $('div.dataTables_scrollBody').height(calculateDesiredTableHeight());
                myDataTableObject.draw();
            }
        }
        
        //************************************
        // Use hard-coded heights of table headers and footers
        //************************************
        function calculateDesiredTableHeight() {
            return ($('#' + symbolContainerElement.id + "_wrapper").parent().height() - 110);
        }
        
        // ----------------------------------------------------------------------------------------------------------
        // HEADER FUNCTIONS
        // ----------------------------------------------------------------------------------------------------------

        //************************************
		// Function that creates an array of table headers;
        // Takes into consideration if custom names are selected
		//************************************
        function createArrayOfTableHeaderStrings() {
            var dataTableHeaderStringsArray = [];
            // Assume we aren't transposed, create the array normally;
            // First check if you're using custom table names
            if (!scope.config.useCustomDataItemNames) {
                // If you aren't, then this is quite simple!
                // Loop through all the data items
                for (var dataItemIndex = 0; dataItemIndex < scope.config.numberOfDataItems; dataItemIndex++) {
                    // Add header for the timestamp
                    if (scope.config.dataQueryType == "sampled") {
                        dataTableHeaderStringsArray.push("Interpolated Timestamp");
                    } else {
                        dataTableHeaderStringsArray.push(scope.config.originalDataItemNamesArray[dataItemIndex] + " Timestamp");
                    }
                    // And one header for the original data item label
                    dataTableHeaderStringsArray.push(scope.config.originalDataItemNamesArray[dataItemIndex] + " (" + dataItemUnitsArray[dataItemIndex] + ")");
                }
            } else {
                // Otherwise, in this case, you're using custom names!
                // Loop through all the data items
                for (var dataItemIndex = 0; dataItemIndex < scope.config.numberOfDataItems; dataItemIndex++) {
                    // Check: if there isn't a custom header for this data item, use the original label
                    if (scope.config.customDataItemNamesArray[dataItemIndex] == "") {
                        scope.config.customDataItemNamesArray[dataItemIndex] = scope.config.originalDataItemNamesArray[dataItemIndex];
                    }
                    // Add header for the timestamp
                    if (scope.config.dataQueryType == "sampled") {
                        dataTableHeaderStringsArray.push("Interpolated Timestamp");
                    } else {
                        dataTableHeaderStringsArray.push(scope.config.customDataItemNamesArray[dataItemIndex] + " Timestamp");
                    }
                    // And one header for the CUSTOM data item label
                    //dataTableHeaderStringsArray.push(scope.config.customDataItemNamesArray[dataItemIndex] + " (" + dataItemUnitsArray[dataItemIndex] + ")");
                    dataTableHeaderStringsArray.push(scope.config.customDataItemNamesArray[dataItemIndex]);
                }                    
            }
            // Finally, return whatever headers array was created
            return dataTableHeaderStringsArray;
        }
        
        //************************************
		// Function that converts an array of header strings into an array of objects needed by the table
		//************************************
		function createFormattedHeaderObjectArray(dataTableHeaderStringsArray) {
            // Create a new empty array
            var dataTableHeaderObjectsArray = [];
            // Loop through the array of header strings
            for (var headerArrayIndex = 0; headerArrayIndex < dataTableHeaderStringsArray.length; headerArrayIndex++) {
                // For each header string, push a new object containing that header string
                var newColumnObject = {
                    title: dataTableHeaderStringsArray[headerArrayIndex],
                };

                // Save this column definition
                dataTableHeaderObjectsArray.push(newColumnObject);
            }
            return dataTableHeaderObjectsArray;
		}
        
        // ----------------------------------------------------------------------------------------------------------
        // TRANSPOSE CODE
        // ----------------------------------------------------------------------------------------------------------

        //************************************
		// Function that transposes the rows of the data array and the headers array and writes the
        // newly transposed versions to overwrite the existing dataarray and headersarray variables
		//************************************
        function createTransposedDataTableArray(dataTableHeaderStringsArray) {
            // Add a new row at the front of the data table to contain the headers!
            var dataTableArrayWithHeadersRow = [dataTableHeaderStringsArray].concat(dataTableArray);
            // Transpose all rows!  First, act on the first row only, so you're acting on columns in that row...
            var transposedDataTableArray = dataTableArrayWithHeadersRow[0].map(function(col, columnIndex) { 
                // Then, iterate through each row in the table, and return each of the rows
                return dataTableArrayWithHeadersRow.map(function(row) { 
                    return row[columnIndex]; 
                })
            });
            return transposedDataTableArray;
        }        

        // ----------------------------------------------------------------------------------------------------------
        // SEARCH FUNCTTION CODE
        // ----------------------------------------------------------------------------------------------------------
        
        //************************************
		// Function that adds a footer to the table HTML and then in that footer row
        // adds in a footer cell for each column to allow filtering that column
		//************************************
        function addFootersRowToAllowSearchingByColumn(dataTableHeaderStringsArray) {
            // Add a footer row to the table to allow filtering by column
            var footer = document.getElementById(symbolContainerElement.id).createTFoot();
            // Create an empty <tr> element and add it to the first position of <tfoot>:
            var footerRow = footer.insertRow(0);    
            // Add a cell to the footer for each column (for each header)
            for (var headerArrayIndex = dataTableHeaderStringsArray.length - 1; headerArrayIndex >= 0; headerArrayIndex--) {
                // Insert a new cell into the footer
                var cell = footerRow.insertCell(0);
                // Add some text in the new footer cell:
                // If there is a search term already entered for this item, write it to the input
                if (scope.config.dataTableFooterFilterStringsArray[headerArrayIndex] == "") {
                    // There's no search term entered yet
                    cell.innerHTML = ( '<input type="text" placeholder="Search '+ dataTableHeaderStringsArray[headerArrayIndex] + '" ' + '/>' );
                } else {
                    // In this case, a search term was entered! So add one in!
                    cell.innerHTML = ( '<input type="text" placeholder="Search '+ dataTableHeaderStringsArray[headerArrayIndex] + '" ' + 'value="' + scope.config.dataTableFooterFilterStringsArray[headerArrayIndex] + '" ' + '/>' );
                }
            }
        }
        
        //************************************
		// Function loops through the footer cells and adds a handler
        // to allow them to filter the cells above them in the same column
		//************************************
        function addSearchFunctionsToCellsInFooterRow() {
            // Add search functions to allow the footer column cells to filter their whole column
            myDataTableObject.columns().every( function () {
                // For each column...
                var currentColumn = this;
                // Add a function that fires on change and keyup
                $( 'input', this.footer() ).on( 'keyup change', function () {
                    if (currentColumn.search() !== this.value) {
                        currentColumn.search(this.value);
                        currentColumn.draw();
                    }
                    // After searching, save the filter string
                    myDataTableObject.columns().every( function (columnIndex) {
                        //console.log(this.search());
                        scope.config.dataTableFooterFilterStringsArray[columnIndex] = this.search();
                        //console.log("Footer search array:", scope.config.dataTableFooterFilterStringsArray);
                    });
                });
            });
        }

        //************************************
        // Executes the above search if a search term already exists
        //************************************
        function executeSearchFunctionsOnEachColumn () {
            // Add search functions to allow the footer column cells to filter their whole column
            //console.log("Applying search...");
            myDataTableObject.columns().every( function () {
                // For each column...
                var currentColumn = this;
                // Get the search fiels
                var currentColumnSearchField = $( 'input', this.footer() )[0];
                //console.log(currentColumnSearchField);
                // If a search term exists, apply the search!
                if (currentColumnSearchField.value !== "") {
                    currentColumn.search(currentColumnSearchField.value);
                    currentColumn.draw();
                }
            });
            
        }

        // ----------------------------------------------------------------------------------------------------------
        // CONDITIONAL FORMATTING CODE
        // ----------------------------------------------------------------------------------------------------------
        
        //************************************
		// Function that applies conditional formatting by cell
		//************************************
        function customConditionalFormattingFunction(rowElement, rowDataArray, rowIndex) {
        //function customConditionalFormattingFunction(td, cellData, rowData, rowIndex, colIndex) {
            if (scope.config.applyConditionalFormatting) {
                // First check if the table is transposed
                if (!scope.config.transposeTable) {
                    // Loop through every cell item in the row data array
                    for (var columnIndex = 0; columnIndex < rowDataArray.length; columnIndex++) {
                        // Only act on the correct columns or rows
                        if (columnIndex % 2 == 1) {
                            // Get the current data item number, which is the col index + 1 / 2 - 1
                            var dataItemIndex = (columnIndex+1)/2 - 1; 
                            // Test the cell and apply the colors!
                            performConditionalTest(dataItemIndex, rowDataArray[columnIndex], columnIndex, rowElement, scope.config.applyConditionalFormattingTo, scope.config.conditionalOperatorsArray[dataItemIndex], scope.config.dataItemThresholdsArray[dataItemIndex]);
                        }
                    }
                } else {
                    // In this case, the table is actually transposed!
                    // Loop through every cell item in the row data array; skip column 1 when transposed!!!
                    for (var columnIndex = 1; columnIndex < rowDataArray.length; columnIndex++) {
                        // Only act on the correct columns or rows
                        if (rowIndex % 2 == 0) {
                            // Get the current data item number
                            var dataItemIndex = (rowIndex)/2; 
                            // Test the cell and apply the colors!
                            performConditionalTest(dataItemIndex, rowDataArray[columnIndex], columnIndex, rowElement, scope.config.applyConditionalFormattingTo, scope.config.conditionalOperatorsArray[dataItemIndex], scope.config.dataItemThresholdsArray[dataItemIndex]);
                        }
                    }
                }
            }
        }
        
		//************************************
		// Takes in a data item index, cell value, a cilumn index, a row, and a css property
        // and performs the test and applies the color
		//************************************
        function performConditionalTest(dataItemIndex, cellValue, columnIndex, rowElement, property, operator, threshold) {
            var result = true;
            // Switch depending on the conditional operator
            switch (operator) {
                case "lessthan":
                    // Test the value in this cell!
                    result = (parseFloat(threshold) < cellValue && performSecondTest(cellValue, scope.config.conditionalOperatorsArray2[dataItemIndex], scope.config.dataItemThresholdsArray2[dataItemIndex]));
                    break;
               case "lessthanorequalto":
                    // Test the value in this cell!
                    result = (parseFloat(threshold) <= cellValue && performSecondTest(cellValue, scope.config.conditionalOperatorsArray2[dataItemIndex], scope.config.dataItemThresholdsArray2[dataItemIndex]));
                    break;
               case "equalto":
                    // Test the value in this cell!
                    result = (parseFloat(threshold) == cellValue && performSecondTest(cellValue, scope.config.conditionalOperatorsArray2[dataItemIndex], scope.config.dataItemThresholdsArray2[dataItemIndex]));
                    break;
               case "greaterthanorequalto":
                    // Test the value in this cell!
                    result = (parseFloat(threshold) >= cellValue && performSecondTest(cellValue, scope.config.conditionalOperatorsArray2[dataItemIndex], scope.config.dataItemThresholdsArray2[dataItemIndex]));
                    break;  
               case "greaterthan":
                    // Test the value in this cell!
                    result = (parseFloat(threshold) > cellValue && performSecondTest(cellValue, scope.config.conditionalOperatorsArray2[dataItemIndex], scope.config.dataItemThresholdsArray2[dataItemIndex]));
                    break;   
               case "notused":
                    // Test the value in this cell!
                    result = (true && performSecondTest(cellValue, scope.config.conditionalOperatorsArray2[dataItemIndex], scope.config.dataItemThresholdsArray2[dataItemIndex]));
                    break;
               case "like":
                    // Test the value in this cell!
                    result = (cellValue.includes(threshold) && performSecondTest(cellValue, scope.config.conditionalOperatorsArray2[dataItemIndex], scope.config.dataItemThresholdsArray2[dataItemIndex]));
                    break;                      
            }
            // Finally, perform the resulting test!
            applyConditionalResultColor(result, rowElement, columnIndex, property, dataItemIndex);
        }
        
        //************************************
        // Performs the SECOND test, and after the test is done, it applies the comparison
        //************************************
        function performSecondTest(cellValue, operator, threshold) {
            var result = true;
            // Switch depending on the conditional operator
            switch (operator) {
                case "lessthan":
                    result = (cellValue < parseFloat(threshold));
                    break;
               case "lessthanorequalto":
                    result = (cellValue <= parseFloat(threshold));
                    break;
               case "equalto":
                    result = (cellValue == parseFloat(threshold));
                    break;
               case "greaterthanorequalto":
                    result = (cellValue >= parseFloat(threshold));
                    break;  
               case "greaterthan":
                    result = (cellValue > parseFloat(threshold));
                    break;
                case "like":
                    result = (cellValue.includes(threshold));
                    break;
                case "notused":
                    result = true;
                    break;
            }
            // Return the result
            return result;
        }
        
        //************************************
        // Function that applies color depending on whether the passed in argument is true or false
        //************************************
        function applyConditionalResultColor(result, rowElement, columnIndex, property, dataItemIndex) {
            if (result == true) {
                // Change the color to the high color
                $('td', rowElement).eq(columnIndex).css(property, scope.config.testTrueColors[dataItemIndex]);
            } else {
                // Change the cell color to the low color
                $('td', rowElement).eq(columnIndex).css(property, scope.config.testFalseColors[dataItemIndex]);
            }
            // If the CSS property wasn't the text color, reset the text color to the standard text color
            if (property != "color") {
                $('td', rowElement).eq(columnIndex).css("color", scope.config.textColor);
            } else {
                // Otherwise, reset the rows back to their row colors
                $('td', rowElement).eq(columnIndex).css("background-color", scope.config.backgroundColor);
            }
        }
        
        // ----------------------------------------------------------------------------------------------------------
        // FINAL BOILERPLATE CODE
        // ----------------------------------------------------------------------------------------------------------
        
		//************************************
		// Function that is called when custom configuration changes are made
		//************************************
		function myCustomConfigurationChangeFunction() {
            if (myDataTableObject) {
                // Save the current state
                myDataTableObject.state.save();
                // Draw the table
                myDataTableObject.draw();
            }
		}
		// Specify which function to call when a data update or configuration change occurs 
		//return { dataUpdate: myCustomDataUpdateFunction, configChange:myCustomConfigurationChangeFunction };		
	}
	// Register this custom symbol definition
	CS.symbolCatalog.register(myCustomSymbolDefinition);
	
//})(window.Coresight); // Comment out this line to use this file on legacy PI Coresight systems
})(window.PIVisualization); // Comment out this line to use this file on modern PI Vision systems
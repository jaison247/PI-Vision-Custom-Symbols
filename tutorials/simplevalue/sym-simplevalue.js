/***************************************************************************
   Copyright 2016 OSIsoft, LLC.

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

(function (CS) {
	var definition = {
	    typeName: 'simplevalue',
	    datasourceBehavior: CS.DatasourceBehaviors.Single,
	    getDefaultConfig: function() {
	    	return {
	    		DataShape: 'Value',
		        Height: 150,
		        Width: 150,
		        BackgroundColor: 'rgb(255,0,0)',
		        TextColor: 'rgb(0,255,0)',
		        ShowLabel: true,
		        ShowTime: false
		    };
		},
	    StateVariables: [ 'MultistateColor' ],
	    configOptions: function () {
	        return [{
	            title: 'Format Symbol',
	            mode: 'format'
	        }];
	    },
	    init: init
	};

	function init(scope) {
	    function onUpdate(data) {
	        if(data) {
	            scope.value = data.Value;
	            scope.time = data.Time;
	            if(data.Label) {
	                scope.label = data.Label;
	            }
	        }
	    }
	    return { dataUpdate: onUpdate };
	}	

    CS.symbolCatalog.register(definition);
})(window.Coresight);

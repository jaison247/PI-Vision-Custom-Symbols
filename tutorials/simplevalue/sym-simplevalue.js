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

(function (PV) {
	'use strict';

    function symbolVis() { };
    PV.deriveVisualizationFromBase(symbolVis);
	
	var definition = {
		typeName: 'audiblealert',
		displayName: 'Audible Alert',
		resizerMode: 'AutoHeight',
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/auidblealert.svg',
		getDefaultConfig: function(){
			return {
				DataShape: 'Value',
				Width: 200,				
				BorderRadius: 50,
				Thickness: 25,
				NormalColor: 'black',
				HighColor: 'black',
				LowColor: 'black',
				NormalBackgroundColor: "green",
				HighBackgroundColor: "red",
				LowBackgroundColor: "red",
				HighValue: "",
				LowValue: "",
				HideLabel: false,
				HideValue: false
			}		
		},
		configOptions: function(){
			return [{
				title: "Format Symbol",
				mode: "format"
			}];
		}
	}

	
	symbolVis.prototype.init = function(scope, elem) {
	
		this.onDataUpdate = dataUpdate;
		function dataUpdate(data) {
			if(!data)return;
			scope.Value = data.Value;
			if(data.Label){
				scope.Label = data.Label;
			}
			if(scope.config.LowValue !=="" && scope.config.LowValue !==null && scope.config.LowValue && data.Value < scope.config.LowValue) {
				scope.config.BackgroundColor = scope.config.LowBackgroundColor;
				scope.config.Color = scope.config.LowColor;
				audio.play();
			} else if(scope.config.HighValue !=="" && scope.config.HighValue !==null && data.Value > scope.config.HighValue) {
				scope.config.BackgroundColor = scope.config.HighBackgroundColor;
				scope.config.Color = scope.config.HighColor;
				audio.play();
			} else {
				scope.config.BackgroundColor = scope.config.NormalBackgroundColor;
				scope.config.Color = scope.config.NormalColor;
			}
		}
	};
	
	var audio = new Audio('Scripts/app/editor/symbols/ext/sounds/Windows Battery Critical.wav');

	PV.symbolCatalog.register(definition); 
	
})(window.PIVisualization);


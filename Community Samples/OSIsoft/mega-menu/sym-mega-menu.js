(function (PV) {
  "use strict";

  function symbolVis() { };
  PV.deriveVisualizationFromBase(symbolVis);

  var definition = { 
     typeName: "mega-menu",
     visObjectType: symbolVis,
     datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
     getDefaultConfig: function(){ 
         return { 
                Height: 150,
                Width: 150,
				
         } 
     },
	    configOptions: function () {
	        return [{
	            title: 'Format Symbol',
	            mode: 'format'
	        }];
	    }
  }
	
  symbolVis.prototype.init = function(scope, elem) {
		
		
			
		
		
  };
   
  PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 




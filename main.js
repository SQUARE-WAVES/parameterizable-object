var util = require("util");
var _ = require("lodash");

var pobjectFactory = function(injectedRenderers) {
	var renderers = injectedRenderers;
	
	if(!_.isObject(renderers)){
		renderers = {};
	}

	var makeRenderer = function(type,options){
		var constructor = renderers[type];

		if(constructor){
			return constructor(options);
		}
		else{
			return _.identity;
		}
	}

	var compiler = function(pdesc){
		var compiledParams = _.transform(pdesc,function(result,description,key){

			var type = null;
			var opts = null;

			if(description.renderer){
				for(var renderKey in description.renderer){
					type = renderKey;
					opts = description.renderer[type];
				}
			}

			var renderer = makeRenderer(type,opts);

			//we do this here instead of in the make renderer function because we don't want to have to 
			//pass the param name or other stupid things into that function
			if(renderer === null){
				throw new Error("param: " + key + " has invalid template type");
			}

			result[key] = {
				"path":description.path,
				"default":description.default,
				"renderer": renderer
			}
		});

		return compiledParams;
	};

	var insertValue = function(obj,path,value){
		var finalKey = _.last(path);
		var prelimPath = _.initial(path);

		//oooh ahhh stateful
		var presentLocation = obj;

		prelimPath.forEach(function(key){
			var next = presentLocation[key];

			if(next === undefined){
				//if there is nothing there, create it
				presentLocation[key] = {};
				next = presentLocation[key];
			}
			else if(!(next instanceof Object)){
				throw new Error('path "'+ path.join('.') +'" is invalid, key:"' + key + '" refers to non-object');
			}

			presentLocation = next;
		});

		presentLocation[finalKey] = value;
	};

	//can throw an error if the paramDescriptions can't compile
	var paramObject = function(paramDescriptions,objectBase){

		var params = compiler(paramDescriptions);

		return function(pvals){
			var newObj = _.clone(objectBase);

			_.each(params,function(param,name){
				var val = pvals[name] || param.default;

				if(val === undefined){
					//nothing to do for this one
					return;
				}

				var renderedVal = param.renderer(val);
				insertValue(newObj,param.path,renderedVal);
			});

			return newObj;
		}
	};

	return paramObject;
}

module.exports.factory = pobjectFactory;
module.exports.generic = pobjectFactory({});
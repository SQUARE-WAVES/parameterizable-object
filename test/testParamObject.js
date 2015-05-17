var assert = require("assert");
var genericParameterizableObject = require("../main.js").generic;
var parameterizableObjectFactory = require("../main.js").factory;

suite("generic parameterizable object",function(){

	var testObjectBase = {
		"dogs":true,
		"cats":{
			"bad":true
		},
		"fish":"ill"
	}

	var params = {
		"superdogs":{
			"path":["superdogs"]
		},
		"cat_truths":{
			"path":["cats","arejerks"]
		},
		"superlongpath":{
			"path":["this","is","a","long","path"]
		}
	}

	var testObject = genericParameterizableObject(params,testObjectBase);

	test("params are filled in",function(done){
		
		var parms = {
			"superdogs":true,
			"cat_truths":"they are",
			"superlongpath":"fff"
		};

		var rend = testObject(parms);

		assert.equal(rend.superdogs,true,'the superdogs parameter is not correct');
		assert.equal(rend.cats.arejerks,parms.cat_truths,'the cat_truths parameter is not correct');
		
		try{
			assert.equal(rend.this.is.a.long.path,parms.superlongpath,'the superlongpath parameter is not correct');
		}
		catch(exc){
			assert(false,'an exception was thrown')
		}

		done();
	});

	test("params are not filled in when they aren't asked for",function(done){
		var parms = {};
		var rend = testObject(parms);

		assert.deepEqual(rend,testObjectBase,'since no paramsare given we should get the base back');
		done();
	});
});

suite("parameterizableObject with custom renderers",function(){

	var customParamertizableObject = parameterizableObjectFactory({
		"dumb": function(opts){
			return function(param){
				return 5;
			}
		},

		"stupid": function(opts){
			return function(param){
				return opts + "is stupid"
			}
		}
	});
	
	var testObjectBase = {
		"dogs":true,
		"cats":{
			"bad":true
		},
		"fish":"ill"
	}

	var params = {
		"superdogs":{
			"path":["superdogs"],
			"renderer":{
				"dumb":"55"
			}
		},
		"cat_truths":{
			"path":["cats","arejerks"]
		},
		"superlongpath":{
			"path":["this","is","a","long","path"],
			"renderer":{
				"stupid":"catfish party "
			}
		}
	};

	var testObject = customParamertizableObject(params,testObjectBase);

	test("custom params",function(done){
		var parms = {
			"superdogs":true,
			"cat_truths":"they are",
			"superlongpath":"fff"
		};

		var rend = testObject(parms);

		assert.equal(rend.superdogs,5,'the superdogs parameter is not correct');
		assert.equal(rend.cats.arejerks,parms.cat_truths,'the cat_truths parameter is not correct');
		assert.equal(rend.this.is.a.long.path,"catfish party is stupid",'the superlongpath parameter is not correct');
		done();
	});
});
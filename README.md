parameterizable object
======================

a thing that makes data objects.

#what is this for?

A lot of the time you have some library that takes a plain old object of data to execute some function, a good example would be something like an http request. A lot of the time you want to providea simple interface that lets people fill in the few parameters they need and not have to bother with all the details

this usually ends up with people writing custom functions, something like this.

```javascript

function getData(options,callback){
	var url = {
		"host":"whatever.com",
		"path":options.path || "/catfish"
		//...some other stuff....
		"query":{}
	}

	if(options.something){
		url.query.something = options.something
	}

	request(url,callback)
}

```

which is not so bad, but it makes that getData function not really re-usable, in this case who cares, but what about something that does something more complicated? Or something you want to be configurable and injectable.

#how does the parameterizable object work?

so the idea is you make a function that takes an object with the parameters and values you want to give them and spits out the fleshed out object

```javascript

var pobj = require("parameterizable-object").generic;

var baseUrl = {
	"host":"whatever.com",
	"path":"/catfish",
	//... some other stuff ...
}

var paramDescriptions = {
	"resourcePath":{
		"path":["path"] //this name works better when it's not path!
	},
	"querySomething":{
		"path":["query","something"]
	}
}

var parameterizableUrl = pobj(paramDescriptions,baseUrl);

function getData(options,callback){
	var url = parameterizableUrl(options);
	request(url,callback);
}
```

#what if I need more details, like I wanna make part of a thing parameterizable or have people inject things from a menu?

write some more code you lazy bum! No just kidding, this module exports a factory which allows you to inject renderers that take your params and render them out into values via methods of your choosing. It sounds weird but it's pretty simple with an example, say I want to inject some boilerplate text into and object that uses a template of some sort

```javascript

var pobj = require("paramterizable-object").factory({
	"template":function(tempString){
		return funtion(paramVal){
			util.format.call(null,tempString,paramVal)
		}

	}
})

var baseUrl = {
	"host":"whatever.com",
	"path":"/catfish",
	//... some other stuff ...
}

var paramDescriptions = {
	"resourcePath":{
		"path":["path"] //this name works better when it's not path!
	},
	"querySomething":{
		"path":["query","something"]
	},
	"boilerText":{
		"path":["boilerplate","stuff"],
		"renderer":{
			"template":"this (%s) gets rendered with util.format"
		}
	}
}

var parameterizableUrl = pobj(paramDescriptions,baseUrl);

var actualUrl = parameterizableUrl({
	"resourcePath":"/dogs/cats/fish"
	"boilerText":"skateboarding is cool"
});

//a true statement here
actualUrl.boilerplate.stuff === "this (skateboarding is cool) gets rendered with util.format"
```

renderers let you do all sorts of cool stuff, like validate input and throw errors. are make enumerations and other kinds of values.
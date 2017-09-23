import header from 'head';
import MobileDetect from 'mobile-detect';

class Loader {
	constructor () {
		// Singleton Object
		if(window.CM == null){
				window.CM = {};
		}
		window.CM.Loader = this;
		window.CM.Loader.mobile = new MobileDetect(window.navigator.userAgent);
		let scope = this;
		head.ready(document, function() {
				head.load([	"/assets/app.css",
										"/assets/app.js",
										"/assets/shim.js",
								], CM.Loader.startApplication);
		});
	}
	removeGFX (){
		document.body.setAttribute("class", document.body.getAttribute("class").split("hideloader").join("run"));
		let preloader = document.getElementsByClassName("preloader")[0];
		if(preloader && preloader.parentNode){
				preloader.parentNode.removeChild(preloader);
		}
	}
	startApplication (){
		if(window.CM.App == undefined){
				setTimeout(CM.Loader.startApplication, 500);
		} else {
				CM.App.blastoff({mobile:window.CM.Loader.mobile});
				document.body.setAttribute("class", document.body.getAttribute("class").split("loading").join("loaded") );
				setTimeout(function(){
				 document.body.setAttribute("class", document.body.getAttribute("class").split("loaded").join("hideloader") );
				}, 500);
				setTimeout(function(){ CM.Loader.removeGFX(); }, 1750);
		}
	}
};
// THIS FILE IS GENERATED - DO NOT EDIT!
/*!mobile-detect v1.3.7 2017-09-06*/
/*global module:false, define:false*/
export default new Loader();

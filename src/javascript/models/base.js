/*global $*/
// base model for models
import Model from 'ampersand-model';
import _ from 'underscore';


let Base = Model.extend({
		urlRoot: '/',
		props: {
				id: ['string', true, ''],
				root: ['string', true, 'http://www.holzformart.de'],
				pageContent: ['object', true, function(){ return []; }],
				pageLinks: ['object', true, function(){ return {'de':'', 'en':''}; }],
				pageTitle: ['string', true, ''],
				pageNavigation: ['object', true, function(){ return []; }],
				pageStickyNavigation: ['object', true, function(){ return []; }],
				pageFooter: ['object', true, function(){ return []; }],
				pageClass: ['string', true, ''],
				lang: ['string', true, 'de']
		},
		parse: function (resp, options) {
			 var tempDom = document.createElement('document');
			 tempDom.insertAdjacentHTML('afterbegin', resp);
			 this.pageTitle = resp.split("<title>")[1].split("</title>")[0];
			 this.pageContent = tempDom.querySelectorAll('.View')[0];
			 this.pageNavigation = tempDom.querySelectorAll('.Header__body')[0];
			 this.pageStickyNavigation = tempDom.querySelectorAll('.Header-sticky__body')[0];
			 this.pageFooter = tempDom.querySelectorAll('.Footer')[0];
			 this.pageLinks.de = tempDom.querySelectorAll('link[hreflang="de"]')[0].href.split(this.root).join("");
			 this.pageLinks.en = tempDom.querySelectorAll('link[hreflang="en"]')[0].href.split(this.root).join("");
			 this.pageClass = tempDom.querySelectorAll('meta[name="pageColor"]')[0].getAttribute('content');
			 return resp;
	 },
		ajaxConfig: function () {
				return {
						xhrFields: {
								'withCredentials': true
						},
						headers: {
								'accept': 'application/html'
						}

				};
		},
		url: function () {
				var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError(),
						url;
				if (this.isNew()) url = base;
				else url = base + (base.charAt(base.length - 1) === '/' ? '' : '/') + this.getId() ;
				return url;
		}
});

export default Base;

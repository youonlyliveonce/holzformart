/* global me, app */
import AmpersandRouter from 'ampersand-router';

import ContentView from './views/content';
import ContentModel from './models/content';
import FormModel from './features/form/form-model';


let Router = AmpersandRouter.extend({

		routes: {
				':lang': 'content',
				':lang/*value': 'content'
		},
		// ------- ROUTE HANDLERS ---------
		// Handelt alle Links und übergibt alle Parameter über den Event an die App

		content: function (lang, value, params) {
			if(value == null) value = "";

			if(value.indexOf('=') != -1 && params == null){
				params = value;
				value == "";
			}

			value = `${lang}/${value}`;

			// prüfe ob sich nur der search String ?x=y geändert hat
			var onlyParamChange = this._checkForParamChange(value, params);

			if(onlyParamChange){
				// Update active View
				this.trigger('update', params);
			} else {
				// Trigger new View
				this.trigger('page', new ContentView({
						model: new ContentModel({id:value, lang:lang})
						,formModel: new FormModel()
						// ,mapModel: new MapModel()
				}), params);
			}

		},

		_checkForParamChange: function(value, params){
			if(this.currentPath == null){
				this.currentPath = value;
				return false;
			} else {
				if(this.currentPath == value){
					return true;
				} else {
					this.currentPath = value;
					return false;
				}
			}
		}

});

export default Router;

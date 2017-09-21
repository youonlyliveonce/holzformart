import PageView from './base';
import View from 'ampersand-view';
import SliderView from '../features/slider/slider';
import TabView from '../features/tabbar/tabbar';
import dom from 'ampersand-dom';

let Content = PageView.extend({

	props:{
		isInitial: ['boolean', true, false]
		,subViews: ['array', true, function(){ return []; }]

	},
	events: {
	},

	hookBeforeHide: function() {

	},

	hookInRender: function () {
		let self = this;
		let elements = this.queryAll('.Element');
		if(elements.length > 0){
			elements.forEach(function(element, index, array){

				let view = {};
				switch(element.dataset.view){
					case "SliderView" :
						view = new SliderView({el:element, id:element.getAttribute('id'), parentview:self, type:element.dataset.settings});
						view.render();
						break;
					case "TabView" :
						view = new TabView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					default:
				}
				self.registerSubview(view);
				self.subViews.push({id:view.id, view:view});
			});
		}

		// this.updateActiveView();


	},

	hookAfterShow: function(){

	}

});

export default Content;

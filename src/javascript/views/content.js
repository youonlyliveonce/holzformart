import PageView from './base';
import View from 'ampersand-view';
import YoutubeView from '../features/youtube/youtube';
import FilterGridView from '../features/filtergrid/filtergrid';
import LinkGridView from '../features/linkgrid/linkgrid';
import SliderView from '../features/slider/slider';
import CaseView from '../features/case/case';
import TextpageView from '../features/textbox/textbox';
import dom from 'ampersand-dom';

let Content = PageView.extend({

	props:{
		isInitial: ['boolean', true, false]
		,isScrollTop: ['boolean', true, false]
		,subViews: ['array', true, function(){ return []; }]
		,viewportInterval: ['number', true, 0]
	},

	events: {
		'click .Button--down' : 'handleDownClick'
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
					case "VideoView" :
						element.getElementsByTagName('iframe')[0].setAttribute('id', 'videobox'+index)
						view = new YoutubeView({el:element, id:element.getAttribute('id'), videoid:'videobox'+index, parentview:self});
						view.render();
						break;
					case "FilterGridView" :
						view = new FilterGridView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					case "LinkGridView" :
						view = new LinkGridView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					case "SliderView" :
						view = new SliderView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					case "CaseView" :
						view = new CaseView({el:element, id:element.getAttribute('id'), parentview:self});
						view.render();
						break;
					case "TextpageView" :
						view = new TextpageView({el:element, id:element.getAttribute('id'), parentview:self});
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

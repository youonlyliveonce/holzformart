/*global $*/
// base view for page
import View from 'ampersand-view';
import _ from 'underscore';
import Swiper from 'swiper';

let Base = View.extend({

		props: {
				isInitial: ['boolean', true, false],
				isKilled: ['boolean', true, false]
		},

		template: function(){
				var content = this.model.pageContent;
				return content;
		},

		render: function(){
				// console.log("RENDER");
				if(!this.isInitial){
						this.renderWithTemplate(this);
				}


				this.hookInRender();

				this.once('remove', this.cleanup, this);
		},

		hookBeforeHide: function(){
			// destroy or animate before hide
		},

		hookInRender: function(){
				// additional Stuff in Render
		},

		hookAfterShow: function(){
				// additional Stuff after Transition
		},

		cleanup: function(){
				//console.log("cleanup");
		},

		bindSlider: function(items, settings){
			var el = document.querySelectorAll(items);
			if (el.length <= 0) return false;
			var opt = {};
			if (settings == 'basic'){
				opt = {
						pagination: '.swiper-pagination',
						paginationClickable: true,
						nextButton: '.swiper-button-next',
						prevButton: '.swiper-button-prev',
						spaceBetween: 30,
						hashnav: false,
						hashnavWatchState: true
					}
			}
			var swiper = new Swiper(items, opt);
		}

});

export default Base;

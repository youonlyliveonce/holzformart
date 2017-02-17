import Base from '../base';

let Slider = Base.extend({
	props: {
		id: ['string', true, '']
		,active: ['boolean', true, false]
		,parentview: ['object', true, function(){ return {} }]
		,swiper: ['object', true, function(){ return undefined }]
		,activeindex: ['number', true, -1]
		,settings: ['object', true, function(){ return {
						speed: 600,
						loop: false,
						slidesPerView: 3,
						spaceBetween: 30,
						pagination: ' .swiper-pagination',
						paginationClickable: true,
						breakpoints: {
							 1024: {
									 slidesPerView: 2,
									 spaceBetween: 20
							 },
							 640: {
									 slidesPerView: 1,
									 spaceBetween: 20
							 },
							 320: {
									 slidesPerView: 1,
									 spaceBetween: 10
							 }
					 }
					}
		}]
	},

	events: {
		'click .Button--right': 'handleRightClick'
	},

	render: function(){
		this.cacheElements({
		});
		TweenMax.delayedCall(0.15, function(){
				this.settings.pagination = '#'+this.id+this.settings.pagination;
				this.swiper = new Swiper('#'+this.id+' .swiper-container', this.settings);
		}, [], this);
		return this;
	},

	handleRightClick: function(){
		this.swiper.slideNext();
	},

	handleLeftClick: function(){
		this.swiper.slidePrev();
	},

	handleKeyDown: function(direction){
		if(direction == "left"){
			this.swiper.slidePrev();
		}else {
			this.swiper.slideNext();
		}
	}

})

export default Slider;

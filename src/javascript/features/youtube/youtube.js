import Base from '../base';
import dom from 'ampersand-dom';

let YoutubePlayer = Base.extend({
	props: {
		id: ['string', true, '']
		,videoid: ['string', true, '']
		,player: ['object', true, function(){ return {}; }]
		,active: ['boolean', true, false]
		,ready: ['boolean', true, false]
		,isscrollable: ['boolean', true, false]
		,parentview: ['object', true, function(){ return {}; }]
		,mute: ['boolean', true, false]
	},
	events: {
		'click .Button--mute' : 'handleMuteClick'
	},

	render: function(){
		let self = this;
		this.cacheElements({
			videobox : '.Videobox__background',
			mutebutton: '.Button--mute'
		});
		if(window.YT === undefined){
			window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);
			// INSERT YOUTUBE API
			let tag = document.createElement('script');
					tag.src = "https://www.youtube.com/iframe_api";
					tag.id = "youtubeapi";
			let firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		} else {
			TweenMax.delayedCall(0.25, function(){
				self.onYouTubeIframeAPIReady();
			})
		}
		this.on('change:active', this.onActiveChange, this);
		this.on('change:mute', this.onMuteChange, this);

		return this;
	},

	onYouTubeIframeAPIReady: function(){
		this.player = new YT.Player(this.videoid, {
					events: {
						'onReady': this.onPlayerReady.bind(this),
						'onStateChange': this.onPlayerStateChange.bind(this)
					}
				});
		if(this.player.B){
			this.onPlayerReady();
		};
	},

	onPlayerReady: function(){
		this.ready = true;
		if(this.active && !CM.App._mobile){
			this.player.playVideo();
		}
	},

	playVideo: function(){
		if(typeof this.player.playVideo == 'function'){
			this.player.playVideo();
		}
	},
	pauseVideo: function(){
		if(typeof this.player.pauseVideo == 'function'){
			this.player.pauseVideo();
		}
	},
	muteVideo: function(){
		if(typeof this.player.mute == 'function'){
			this.player.mute();
		}
	},
	unmuteVideo: function(){
		if(typeof this.player.unMute == 'function'){
			this.player.unMute();
		}
	},

	onMuteChange: function(model, value){
		if(value) {
			this.muteVideo();
			dom.addClass(this.mutebutton, 'mute');
		} else {
			if(this.ready){
				this.unmuteVideo();
				dom.removeClass(this.mutebutton, 'mute');
			}
		}
	},
	onActiveChange: function(model, value){
		if(!value){
			this.pauseVideo();
		} else {
			if(this.ready && !CM.App._mobile){
				this.playVideo();
			}
		}
	},
	onPlayerStateChange: function(event){
		console.log("onPlayerStateChange", event);
	},
	cleanup : function(){
		this.player.destroy();
	},
	handleMuteClick: function(event){
		this.mute = !this.mute;
	},
	handleResize: function(){
		var newWidth = document.body.clientHeight/9*16,
				newHeight = document.body.clientHeight;
		if(newWidth < document.body.clientWidth) {
			newWidth = document.body.clientWidth,
			newHeight = document.body.clientWidth/16*9;
		}
		this.el.setAttribute("style", "height:"+document.body.clientHeight+"px");
		this.videobox.setAttribute("style", "width:"+newWidth+"px; height:"+newHeight+"px;");
	}

});

export default YoutubePlayer;

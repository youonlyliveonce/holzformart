/*global me, app*/
import _ from 'underscore';
import View from 'ampersand-view';
import dom from 'ampersand-dom';
import ViewSwitcher from 'ampersand-view-switcher';

import "ScrollToPlugin";
import "TweenMax";
import AOS from "aos";

var MainView = View.extend({

		/* Set Properties */
		props: {
			isSticky: ['boolean', true, false]
			,navOpenClass: ['string', true, 'Header--open']
			,lang: ['string', true, 'de']
			,denav: ['object', true, function(){ return []; }]
			,ennav: ['object', true, function(){ return []; }]
		},

		/* Bind basic Events, all link clicks, toggle Navigation, etc. */
		events: {
			'click a[href]': 'handleLinkClick'
			,'click .Header .Button--toggle': 'handleClickToggle'
		},

		/* Render Main View */
		render: function () {

				/* Set scope for callbacks */
				var self = this;

				/* Cache Elements */
				this.cacheElements({
						page: '.Page',
						main: '[role="main"]',
						header: '.Header',
						headerlogo: '.Header__logo',
						headerbody: '.Header__body',
						headerstickybody: '.Header-sticky__body',
						nav: '.Menu',
						footer: '.Footer',
						switcher: '[data-hook=switcher]'
				});

				this.denav = Array.from(this.queryAll('[data-hook=de]'));
				this.ennav = Array.from(this.queryAll('[data-hook=en]'));
				// Init and configure our page switcher
				this.pageSwitcher = new ViewSwitcher(this.switcher, {
						waitForRemove: true,
						hide: function (oldView, cb) {
								// Hide oldView if oldView exits
								if(oldView && oldView.el){
										oldView.hookBeforeHide();
										TweenMax.to(oldView.el, 0.4, {opacity:0, onComplete:function(){
												cb.apply();
										}});
								}
						},
						show: function (newView) {

								TweenMax.set(newView.el, {opacity:0});
								// Set newView opacity to 0

								TweenMax.to(window, 0.75, {scrollTo:{x:0, y:0}, overwrite:true, ease:Power2.easeOut});
								dom.addClass(document.body, newView.model.pageClass);

								TweenMax.to(newView.el, 0.8, {opacity:1, onComplete:function(){
									// Scroll to paramter 'section'
									self.handleUpdateView();
									newView.hookAfterShow();
								}, delay:0.3});
						}
				});
				AOS.init();
				return this;

		},

		/*

			Function for the inital Handling of the Page

		*/

		handleInitialView: function (view) {

				var self = this;

				dom.addClass(document.body, view.model.pageClass);

				this.lang = view.model.lang;

				// Set child view as initial
				view.isInitial = true;

				// Set the el of the child view
				view.el = this.query('.View');

				// Render child view
				view.render();

				// After transition Stuff
				view.hookAfterShow();

				// Set current view of page switcher (silent)
				this.pageSwitcher.current = view;

				// Scroll to paramter 'section'
				TweenMax.delayedCall(0.15, function(){ self.handleUpdateView() });

				// Handle active stuff in navigation
				this.updateActiveNav();
		},

		/*

			Function for the Handling of a new Page loaded via Ajax

		*/

		handleNewView: function (view) {

				document.title = _.result(view.model, 'pageTitle');

				// TRACKING
				if(typeof ga != 'undefined'){
						ga('send', 'pageview', {
								'page': CM.App.router.history.location.pathname,
								'title': view.model.pageTitle
						});
				}

				dom.addClass(document.body, view.model.pageClass);
				dom.removeClass(document.body, this.pageSwitcher.current.model.pageClass);

				// SWITCH THE VIEW
				this.pageSwitcher.set(view);

				if(view.model.lang != this.lang){
					this.lang = view.model.lang;
					this.changeLanguage(view);
				}

				this.updateActiveNav();

				this.updateLanguageNav(view);
				// UPDATE PAG NAV


		},

		/*
			Updates current View if something changes but no url
		*/
		handleUpdateView: function(){
			this.scrollTo();
		},

		changeLanguage: function(view){
			this.footer.innerHTML = view.model.pageFooter.innerHTML;
			this.headerbody.innerHTML = view.model.pageNavigation.innerHTML;
			this.headerstickybody.innerHTML = view.model.pageStickyNavigation.innerHTML;
			this.denav = Array.from(this.queryAll('[data-hook=de]'));
			this.ennav = Array.from(this.queryAll('[data-hook=en]'));
		},

		updateLanguageNav: function(view){
			this.denav.forEach(function(item){
				item.setAttribute('href', view.model.pageLinks.de);
			});
			this.ennav.forEach(function(item){
				item.setAttribute('href', view.model.pageLinks.en);
			});
		},

		/*
			Toggle functions for mobile or Desktop Navigation
		*/

		handleClickToggle: function (e){
			var body = document.body;
			if( dom.hasClass(body, this.navOpenClass) || e == undefined){
					dom.removeClass(body, this.navOpenClass);
			} else {
					dom.addClass(body, this.navOpenClass);
			}
		},
		handleClickClose: function (e){
			var body = document.body;
			dom.removeClass(body, this.navOpenClass);
		},
		handleClickOpen: function (e){
			var body = document.body;
			dom.addClass(body, this.navOpenClass);
		},
		/*

		Click Handler for each a[href]

		*/

		handleLinkClick: function (e) {

			var aTag = e.delegateTarget,
					self = this,
					path = aTag.getAttribute("href"),
					params = path.split("?")[1];

				var local = aTag.host === window.location.host;
				if (local && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && aTag.getAttribute("target") !== "_blank") {
						// no link handling via Browser
						e.preventDefault ? e.preventDefault() : (e.returnValue = false);

						// Update View without reloading view
						if (CM.App._params != {} && CM.App.router.history.location.pathname == e.delegateTarget.pathname && CM.App._paramsString == params){
							this.handleUpdateView();
						} else {
							// Route
							CM.App.navigate(path);
						}
						// Close Navigation
						this.handleClickClose();
				}

		},

		handleScroll: function(event){
			let scrollY = window.scrollY,
					self = CM.App.mainView;
			if(scrollY >= 0){
				if(scrollY > self.header.offsetHeight+50 && !self.isSticky){
					self.isSticky = true;
					dom.addClass(document.body, 'Header-sticky--open');
				} else if(scrollY < self.header.offsetHeight+50 && self.isSticky){
					self.isSticky = false;
					dom.removeClass(document.body, 'Header-sticky--open');
				}
			}
		},

		scrollTo: function(){
			if (CM.App._params != {} && CM.App._params.section != null){
					var id = this.query('#'+CM.App._params.section);
					TweenMax.to(window, 1.2, {scrollTo:{x:0, y:id.offsetTop}, overwrite:true, ease:Power2.easeOut});
			}
		},

		scrollToValue: function(value){
			TweenMax.to(window, 1.2, {scrollTo:{x:0, y:value}, overwrite:true, ease:Power2.easeOut});

		},

		updateActiveNav: function () {
				let path = window.location.pathname.slice(1),
						topnavi = this.queryAll('.Menu a[href]'),
						self = this;

				if (CM.App._params != {} && CM.App._params.section != null){
					path = `${path}?section=${CM.App._params.section}`;
				}

				if(path == this.pageSwitcher.current.model.lang + "/"){
					topnavi.forEach(function (aTag) {
						dom.removeClass(aTag, 'active')
					});
					topnavi.forEach(function (aTag) {
						if(aTag.getAttribute('data-hook') == 'de' || aTag.getAttribute('data-hook') == 'en'){
							if(aTag.getAttribute('data-hook') == self.lang){
								dom.addClass(aTag, 'active');
							} else {
								dom.removeClass(aTag, 'active');
							}
						}
					});
					// dom.addClass(topnavi[0], 'active')
				} else {
					topnavi.forEach(function (aTag) {
						if(aTag.href.indexOf(path) != -1){
							dom.addClass(aTag, 'active')
						}else {
							dom.removeClass(aTag, 'active')
						}
						if(aTag.getAttribute('data-hook') == 'de' || aTag.getAttribute('data-hook') == 'en'){
							if(aTag.getAttribute('data-hook') == self.lang){
								dom.addClass(aTag, 'active');
							} else {
								dom.removeClass(aTag, 'active');
							}
						}
					});
				}
		}

});


export default MainView;

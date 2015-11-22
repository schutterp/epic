document.addEventListener("DOMContentLoaded", function(event) {
	// Cogito Ergo Vex
	if ('querySelector' in document && 'addEventListener' in window ) {

	 	var isMobile = deviceDetector.isMobile;


		window.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		window.latest = {};

		window.continents = {
			"North America" : { "w" : -170.859, "e" : -53.034, 	lat : 40 	},
			"South America" : { "w" : -82.608, 	"e" : -34.133, 	lat : -20 	},
			"Europe" 		: { "w" : -13.108, 	"e" : 68.400,  	lat : 50	},
			"Africa" 		: { "w" : -19.335, 	"e" : 52.025, 	lat : -15	},
			"Asia" 			: { "w" : 32.135, 	"e" : 179.999, 	lat : 30 	},
			"Australia" 	: { "w" : 111.201, 	"e" : 154.786, 	lat : -25 	}
		};

		window.image_meta = [];

		//- µDOM selector engine. Adds JQuery's 'CSS' selector syntax to the environment
		window.$ = function(s) {
			var c = {
				'#': 'ById',
				'.': 'sByClassName',
				'@': 'sByName',
				'=': 'sByTagName'}[s[0]];
				var p = s.slice(1);
				if (!window.scp) {
					return document[c?'getElement'+c:'querySelectorAll'](p);
				}
				if (window.scp.hasOwnProperty(p) && window.scp[p] != undefined) {
					return window.scp[p];
				} else {
					window.scp[p] = document[c?'getElement'+c:'querySelectorAll'](p);
				}
				return window.scp[p];
		};

		//- Install some things - Adds some common/convenience functions
		window.scrollFn = function() {
			var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
			var supportPageOffset = window.pageXOffset !== undefined;
			var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
			var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
			return [x,y];
		}

		window.offset = function(el) { 																					//- offset(el);
		    var convertPoint = window.webkitConvertPointFromNodeToPage;													//- returns { top, left } of document relative coords
		    if ('getBoundingClientRect' in el) {
		        var	boundingRect 	= el.getBoundingClientRect();
		        var body 			= document.body || document.getElementsByTagName("body")[0];
		        var clientTop 		= document.documentElement.clientTop || body.clientTop || 0;
		        var clientLeft 		= document.documentElement.clientLeft || body.clientLeft || 0;
		        var scrollTop 		= (window.pageYOffset || document.documentElement.scrollTop || body.scrollTop);
		        var scrollLeft		= (window.pageXOffset || document.documentElement.scrollLeft || body.scrollLeft);
		        return {
		            top: 	boundingRect.top 	+ scrollTop 	- clientTop,
		            left: 	boundingRect.left 	+ scrollLeft 	- clientLeft
		        }
		    } else if (convertPoint) {
		        var
		            zeroPoint 	= new WebKitPoint(0, 0),
		            point 		= convertPoint(el, zeroPoint),
		            scale 		= convertPoint(document.getElementById('scalingEl'), zeroPoint);
		        return {
		            top: 	Math.round(point.y * -200/scale.y),
		            left: 	Math.round(point.x * -200/scale.x)
		        }
		    } else {
		    	var x = 0;
		    	var y =0;
		    	while(el && el.tagName.toLowerCase() != 'body' && !isNaN(el.offsetLeft ) && !isNaN(el.offsetTop)) {
					x += el.offsetLeft - el.scrollLeft;
					y += el.offsetTop - el.scrollTop;
		    	}
		    	return { top : y, left : x};
		    }
		};

		window.Element.prototype.find = function(selector) { return $(selector, this); };				//- .find()
		window.NodeList.prototype.each 	= Array.prototype.forEach;										//- .each()
		window.HTMLCollection.prototype.forEach = Array.prototype.forEach;
		window.HTMLCollection.prototype.each = function(f) {
			for (var i = 0; i < this.length; i++) {
				f.apply(this);
			}
		}
		window.Element.prototype.css 	= function(prop, value) {										//- .css()
		  if (value) {
		    this.style[prop] = value;
		    return this;
		  } else {
		    return this.style[prop];
		  }
		};
		window.NodeList.prototype.removeClass = function( className ) {									//- .removeClass()
		    this.forEach( function( item ) {
		    	if (item.classList) {
		        	var classList = item.classList;
		        	classList.remove.apply( classList, className.split( /\s/ ) );
		        } else if (item.className) {
					classList = item.className.split( /\s/ );
					var idx = classList.indexOf( className );
					classList.splice( idx, 1 );
					item.className = classList.join(" ");
		        }

		    });
		    return this;
		};
		window.Element.prototype.removeClass = function( className ) {									//- .removeClass()
			if (this.classList) {
				var classList = this.classList;
				classList.remove.apply( classList, className.split( /\s/ ) );
				return this;
			} else {
				classList = this.className.split( /\s/ );
				var idx = classList.indexOf( className );
				classList.splice(idx, 1);
				item.className = classList.join(" ");
			}

		};
		window.NodeList.prototype.addClass = function(name){ 											//- .addClass()
			this.each(function(el) { el.classList.add(name); }); return this;
		};
		window.Element.prototype.addClass = function(name) {											//- .addClass()
		  this.classList.add(name); return this;
		};
		window.Element.prototype.hasClass = function(name) { return this.classList.contains(name); };	//- .hasClass()
		window.NodeList.prototype.first = function() {													//- .first()
		  return (this.length < 2) ? this : this[0];
		};
		window.NodeList.prototype.last = function() {													//- .last()
		  return (this.length > 1) ? this[this.length - 1] : this;
		};
		var window_w = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;

		var window_h = window.innerHeight
			|| document.documentElement.clientHeight
			|| document.body.clientHeight;
		window.img_max_dim = Math.min(window_h - 200, window_w - (window_w * 0.25));
		window.img_margin = (window_w /2 ) - (img_max_dim /2);

		//- Global scope object
		window.scp = {
			'cont' 			: $( '#mag_cont'			),
			'mag_image'		: $( '#mag_image'			),
			'mag_image_hi'	: $( '#mag_image_hi'		),
			'mag' 			: $( '#mag'					),
			'main_image'	: $( '#main_image'			),
			'stateList'		: $( '.state'				),
			'caption'		: $( '#caption'				),
			'continents'	: $( '#continent_container' ),
			'callouts' 		: $( '#continent_callouts'  ),
			'anim_id'		: 0,
			'lastImageIdx'	: 0,
			'imageIdx'		: 0,
			'anim_len'		: 0,
			'data_thumb'	: $( '#data_thumb'),
			'vp_height'		: 200,
			'vp_width'		: 350,
			'globe_radius'	: 60,
			'globe_cvs_w' 	: 320,
			'globe_cvs_h'	: 250,
			'states'		: [],
			'containerList' : []
		};

		//- State control
		/* for (var i = 0; i < scp['stateList'].length; i++) {
			var state = scp['stateList'].item(i);
			scp['states'].push(state);
		}

		window.set_state = function(e) {																//- set_states
			var states 			= scp['states'];														//- Get the list of states
			var stateList 		= scp['stateList'];														//- Get the list of 'state' elements
			var containerList 	= scp['containerList'];													//- Get the container list
			var a 				= e.currentTarget;														//- get the target
			var s 				= 'state-' + a.getAttribute( 'state' );									//- Get the state to use

			for (var i = 0; i < states.length; i++) {													//- iterate state elements
				var el = states[i]; 																	//- Extract the element
				if (el.hasClass(s)) {																	//- Test for the target
					el.removeClass('state-hidden');														//- remove .state-hidden
				} else {																				//- otherwise
					el.addClass('state-hidden');														//- add .state-hidden
				}
			}
		} */

		//- Setup top level navigation for the states
		/* var tabs = $(".tab_link");																		//- tabs for states
		for (var i = 0; i < tabs.length; i++){
			var tab = tabs.item(i);
			tab.addEventListener('click', set_state);													//- Add set_state as the handler for clicked tabs
		}; */

		window.positionZoomWindow = function(ev) {														//- positionZoomWindow()
			var cont 			= scp['cont'];
			var img 			= scp['main_image'];
			var mag_img 		= scp['mag_image'];
			var mag_img_hi 		= scp['mag_image_hi'];
			var offBounds 		= offset(cont);
			var imgBounds 		= offset(img);
			var r 				= 2048 / img.width;
			var scrollY 		= window.scrollFn()[1];
			var r_inv 			= img.width / 2048;
			var bg_left 		= -(((ev.clientX - imgBounds.left) * r) - (scp['vp_width'] / 2));
			var bg_top 			= -(((ev.clientY - imgBounds.top) * r) - (scp['vp_height'] / 2));

			var bgPosStr 		= bg_left + 'px;' + bg_top + 'px';
			var topStr			= "-" + ((offBounds.top - scrollY) - (ev.clientY - 100)) + 'px';
			var leftStr			= (ev.clientX - (scp['vp_width'] / 2)) + 'px';

			mag.css('top', topStr);
			mag.css('left', leftStr);

			mag_img.css('left', 	bg_left + 'px');
			mag_img.css('top', 		(bg_top - scrollY) + 'px' );
			mag_img_hi.css('left', 	bg_left + 'px');
			mag_img_hi.css('top', 	(bg_top - scrollY) + 'px');

			if (ev.clientX < 200) {
				cont.addClass('hidden');
			} else {
				if (cont.hasClass('hidden')) {
					cont.removeClass('hidden');
				}
			}
		};

		window.unzoom = function(ev) {
			scp['cont'].addClass('hidden');
			window.onmousemove 	= null;
			document.onkeydown 	= keypressHandler;
			mag.onclick 		= null;
		}

		window.primaryClickHandler = function(e) {
			var cont 		= scp['cont'];
			var mag 		= scp['mag'];
			var img 		= scp['main_image'];
			var mag_img 	= scp['mag_image'];
			var mag_img_hi 	= scp['mag_image_hi'];
			var vp_width 	= scp['vp_width'];
			var vp_height 	= scp['vp_height'];

			var urlStr 		= img.getAttribute('src');
			var r 			= 2048 / img.width;
			var r_inv 		= img.width / 2048;
			var offBounds 	= offset(cont);
			var cont_st 	= cont.scrollTop;

			var imgBounds 	= offset(img);
			var scrollY		= window.scrollFn()[1];
			var bg_left 	= -(((e.clientX - imgBounds.left) * r) - (vp_width / 2));
			var bg_top 		= -(((e.clientY - imgBounds.top) * r) - (vp_height / 2));
			var bgPosStr 	= bg_left + 'px ' + bg_top + 'px';
			var topStr 		= -((offBounds.top + scrollY) - (e.clientY - 100)) + 'px';
			var leftStr 	= (e.clientX - vp_width / 2) + 'px';

			window.stopAnimation();
			window.unzoom();

			/*if (!$("#control_cont").hasClass('hidden')) {
				$("#control_cont").addClass('hidden');
				$("#date_caret").removeClass('fa-caret-up').addClass('fa-caret-down');
			} */

			cont.removeClass('hidden');

			mag.css('top', 	topStr);
			mag.css('left', leftStr);

			mag_img.setAttribute('src', urlStr);
			mag_img.css('left', 	bg_left + 'px');
			mag_img.css('top', 		bg_top 	+ 'px' );
			mag_img.removeClass('hidden');

			mag_img_hi.setAttribute('src', '/epic-archive/png/' + image_meta[window.scp['lastImageIdx']].image + '.png');
			mag_img_hi.css('left', 	bg_left + 'px');
			mag_img_hi.css('top', 	bg_top + 'px');
			mag_img_hi.addClass('hidden');
			console.log('hi');
			window.onmousemove 		= positionZoomWindow;
			document.onkeydown 		= unzoom;
			mag.onclick 			= unzoom;
			positionZoomWindow(e);
		};

		if (!isMobile)
			scp['main_image'].onclick = primaryClickHandler;

		window.thumbClickHandler = function(e) {
			window.stopAnimation();
			window.unzoom();

			var list 			= $('.img_container');
			var p 				= e.currentTarget.parentNode;
			var d_idx 			= 0;

			$("#image_list_container").addClass('hidden');
			$("#primary").removeClass('hidden');
			$("#data_display_cont").removeClass('hidden');
			$("#globe_container").removeClass('hidden');
			$("#nav_controls").removeClass('hidden');

			for (var i = 0; i < list.length; i++) {
				var f = list.item(i);
				if (list.item(i) == p)
					window.render(i);
				f.removeClass('active');
			}
			p.addClass('active');

		}

		window.keypressHandler = function(e) {

			if (e.key == "ArrowDown" || e.key == "ArrowRight" || e.keyCode == 39  || e.keyCode == 40) {
				window.next_img();
			} else if (e.key == "ArrowUp" || e.key == "ArrowLeft" || e.keyCode == 37 || e.keyCode == 38) {
				window.prev_img();
			} else if (1 == 4) {
				search_date.setTime( search_date.getTime() - 86400000 );
				getImages();
			} else if (1 == 4) {
				search_date.setTime( search_date.getTime() + 86400000 );
				getImages();
			}
		}

		document.onkeydown = window.keypressHandler;

		window.getImages = function(imgID) {

			   imgID = typeof imgID !== 'undefined' ? imgID : 0;


			//$("#selected_date_label").innerHTML = search_date; // search_date.getFullYear() + '-' + (search_date.getMonth() + 1) + '-' + search_date.getDate();
			$("#cal_sel_date").innerHTML = search_date;
			/*var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var utc = new Date( Date.parse( search_date ));
			console.log("UTC:" + utc);
			console.log("TZ:" + utc.getTimezoneOffset());
			var utc = !(isNaN(utc.getTimezoneOffset())) ? utc.getTime() + utc.getTimezoneOffset() * 60000 : utc.getTime();
			console.log("D:" + search_date);
			console.log("UTC:" + utc);
			var sd = new Date(utc); */

			var url = 'api/images.php?date=' + search_date;// .getFullYear() + '-' + (search_date.getMonth() + 1) + '-' + search_date.getDate();
			if (selected_continent != null)
				url += '&w=' + selected_continent['w'] + '&e=' + selected_continent['e'];

			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.send();
			xhr.onreadystatechange = function() {

				if (xhr.readyState != 4 || xhr.status != 200) return;
				var data 				= JSON.parse( xhr.responseText );
				if (data.length == undefined || data.length == 0) {
					$("#image_count").innerHTML = 0;

				} else {
					var image_list 			= $('#image_list');
					var setDate 			= false;
					image_list.innerHTML 	= "";

					window.scp['anim_len'] 		= data.length;
					$("#image_count").innerHTML = data.length;

					for (var i = 0; i < data.length; i++) {
						var a 			= document.createElement('a');
						var img 		= document.createElement('img');
						var img_cont 	= document.createElement('li');
						var d_span 		= document.createElement('span');
						var imgMeta 	= data[i];
						var filename 	= imgMeta.image;
						var dateStr 	= imgMeta.date;
						var caption 	= imgMeta.caption;
						var loc_data	= JSON.parse(imgMeta.coords);


						if (!setDate) {
							setDate = true;
						}

						var d_arr 			= dateStr.split(" ");
						var time 			= d_arr[1];
						dateStr 			= time;
						d_span.innerHTML 	= dateStr;
						d_span.classList.add("time");

						img.src 			= "epic-archive/thumbs/" + filename + '.jpg';
						img.classList.add("thumbnail");

						img_cont.classList.add('img_container');

						a.appendChild(img);
						a.appendChild(d_span);
						a.onclick 			= thumbClickHandler;

						img_cont.appendChild(a);
						image_list.appendChild(img_cont);
					}
					image_meta = data;
					window.setTimeout(function() {
						console.log('Rendering: ' + imgID);
						window.render(imgID);
						window.setTimeout(function() {
							computeSizing();
						}, 500);
					}, 500);
				}
			}
		};

		window.formatNum = function(num) {
			num += '';
			var x = num.split('.');
			var a = x[0];
			var b = x.length > 1 ? '.' + x[1] : '';
			var patt = /(\d+)(\d{3})/;
			while (patt.test(a)) {
				a = a.replace(patt, '$1' + ',' + '$2');
			}
			return a + b;
		}


		window.c2p = function(coords, offset) {
			if (offset == null || offset == undefined)
				offset = [0,0];

			var x = coords[0] + offset[0];
			var y = coords[1] + offset[1];
			var rad = Math.pow( (Math.pow(x, 2) + Math.pow(y, 2) ), 0.5);
			var θ = Math.atan(y/x) * 180 / Math.PI;

			θ = x >= 0 	&& y >= 0 		? θ 		:
				x < 0 	&& y >= 0		? 180 + θ 	:
				x < 0 	&& y < 0 		? 180 + θ 	:
				x > 0 	&& y < 0 		? 360 + θ	: θ;

			return [ θ, rad ];
		};

		window.p2c = function(polar, offset) {
			if (offset == null || offset == undefined)
				offset = [0,0];
			var θ = polar[0];
			var r = polar[1];
			var x = r * Math.cos(θ * 2 * Math.PI / 360);
			var y = r * Math.sin(θ * 2 * Math.PI / 360);
			return [x + offset[0], y + offset[1]];
		}

		var renderCount = 0;
		var contRenderCount = 0;

		window.render = function(image_id, animating) {
			if (window.hasOwnProperty('d3') == false)
				return;

			renderCount++;

			// ♫ do you wanna dance? ♫
			var list 		= $('.img_container');
			var img 		= list.item(image_id);
			var main 		= scp['main_image'];
			var mag_img 	= scp['mag_image'];
			var data_thumb 	= scp['data_thumb'];
			var meta 		= image_meta[image_id];
			var coords_dat 	= JSON.parse(meta['coords']);
			var coords 		= coords_dat.centroid_coordinates;
			var u 			= coords_dat['sun_j2000_position'];
			var v 			= coords_dat['dscovr_j2000_position'];
			var m 			= coords_dat['lunar_j2000_position'];
			var uv 			= (u['x']* v['x'])+(u['y']*v['y'])+(u['z']*v['z']);
			var du 			= Math.pow( (u['x']*u['x'])+(u['y']*u['y'])+(u['z']*u['z']), .5);
			var dv 			= Math.pow( (v['x']*v['x'])+(v['y']*v['y'])+(v['z']*v['z']), .5);
			var sevθ		= Math.round(((Math.acos(uv / (du * dv))) * (180 / Math.PI)) * 10) / 10;

			if (!animating) {
				$('.filename')[0].innerHTML 		= meta['image'];
				$('.creation_date')[0].innerHTML 	= meta['date'] + ' GMT';
				$('.distance_km')[0].innerHTML 		= window.formatNum(Math.round(dv)) + " Km";
				$('.distance_miles')[0].innerHTML 	= window.formatNum(Math.round(dv * 0.6213)) + " miles";
				$('.angle')[0].innerHTML 			= sevθ + '°';
				$('.index')[0].innerHTML 			= (image_id + 1) + " of " + list.length;
				$('#img_link').href 				= "/epic-archive/png/" + meta['image'] + '.png';
				$('.image_link')[0].href 			= "/epic-archive/png/" + meta['image'] + '.png';

				data_thumb.src 						= '/epic-archive/thumbs/' + meta['image'] + '.jpg';
				mag_img.src 						= main.src 	= '/epic-archive/jpg/' + meta['image'] + '.jpg';

				var data = {'u' : u, 'v' : v, 'uv' : uv, 'du' : du, 'dv' : dv, 'θ' : sevθ, 'coords' : coords };
			}

			var canvas 			= window.scp.canvas;
			var context 		= window.scp.context;
			var path 			= window.scp.path;
			var land 			= window.scp.land;
			var grid 			= window.scp.grid;
			var proj 			= window.scp.proj;
			var lon 			= coords.lon;
			var lat				= coords.lat;
			var list 			= [];
			var rad_limit 		= 60;

			proj.rotate([ -coords.lon, -coords.lat, 10]);

			context.clearRect(0,0, parseInt(window.scp.globe_cvs_w), parseInt(window.scp.globe_cvs_h));

			canvas[0][0].style.opacity = 0.5;
			setTimeout(function() {
				canvas[0][0].style.opacity = 1;
			});

			context.beginPath();
			context.fillStyle = "rgba(0,0,0,0)";
			context.fillRect(0,0,window.scp.globe_cvs_w, window.scp.globe_cvs_h);
			context.fill();

			context.beginPath();
			path({'type' : 'Sphere'});
			context.lineWidth = 1;
			context.strokeStyle = "#fff";
			context.stroke();

			context.beginPath();
			path({'type' : 'Sphere'});
			context.fillStyle = "rgba(0,0,25,56.125)";
			context.fill();

			context.beginPath();
			path(land);
			context.fillStyle = "rgba(100,100,200,0.25)";
			context.fill();

			context.beginPath();
			path(land);
			context.strokeStyle = "#BBB";
			context.stroke();

			context.beginPath();
			path(window.scp.graticule);
			context.strokeStyle = "#BBB";
			context.stroke();

			var limit = 75;
			var proj_origin = proj([ lon, lat ]);
			var points = [];
			var c_idx = 0;
			var θ = 0;
			var polar = [0,0];
			var last_θ = 360;

			for (var i in continents) {
				var c = continents[i];
				var w = c['w'];
				var e = c['e'];
				var lat = c['lat'];

				var proj_coords;

				if (Math.abs(w - lon) < limit || Math.abs(e - lon) < limit ) {
					var cent;
					if (Math.abs(w - lon ) < limit && Math.abs(e - lon) < limit) {
						var cent = w + ((e - w) / 2);
						proj_coords = proj( [cent, lat] );
					} else {
						if (Math.abs(w - lon) < limit) {
							var cent = w + (((lon + 90) - w) / 2);
						} else if (Math.abs(e - lon) < limit) {
							var cent = e + (((lon - 90) - e) / 2);
						}
						proj_coords = proj( [cent, lat] );
					}
					contRenderCount++;
					// $("#log_message").innerHTML = contRenderCount;
					context.beginPath();
					context.fillStyle = "#FFF";
					context.arc(proj_coords[0], proj_coords[1],2,40,0,2 * Math.PI);
					context.fill();

					context.beginPath();
					context.moveTo(proj_coords[0], proj_coords[1]);
					context.strokeStyle = '#CCC';

					var off_x 		= window.scp.globe_cvs_w / 2;
					var off_y 		= (window.scp.globe_cvs_h / 2) - 25;
					polar 			= window.c2p(proj_coords, [-off_x, -off_y]);
					polar[1] 		= 70;
					θ 				= polar[0];

					if (last_θ != 360 && ((θ - 10) <= last_θ) && (last_θ <= (θ + 10))) {
						// scoot a bit
						if (last_θ < θ) {
							polar[0] = θ += 10;
						} else {
							polar[0] = θ -= 10;
						}
					}
					var new_proj 	= window.p2c( polar, [off_x, off_y]);

					context.strokeStyle = "#CCC"
					context.lineTo(new_proj[0], new_proj[1]);
					context.stroke();

					context.beginPath();
					context.fillStyle = "#CCC";
					context.arc(new_proj[0],new_proj[1], 2, 40,0,2*Math.PI);
					context.fill();

					polar[1] = 80;
					new_proj = window.p2c( polar, [off_x, off_y] );

					context.font = "12px Arial";

					new_proj[0] += (θ <= 270 && θ >= 90) 	? -(12 * i.length) / 2 : 0;
					new_proj[1] += (θ <= 180 ) 				? 5 : 0;

					context.fillText(i, new_proj[0], new_proj[1]);
					context.fill();
					last_θ = θ;
			  	}

			}


			// solar angle
			off_x 		= (window.scp.globe_cvs_w / 2) - 100;
			off_y 		= 230;

						var miles 	= $(".distance_miles")[0];
			var dv_str 	= miles.hasClass('hidden') ? window.formatNum(Math.round(dv)) + " Km" : window.formatNum(Math.round(dv * 0.6213)) + " miles";
			var du_str 	= miles.hasClass('hidden') ? window.formatNum(Math.round(du)) + " Km" : window.formatNum(Math.round(du * 0.6213)) + " miles";

			new_proj 	= window.p2c( [sevθ, 75], [off_x, off_y]);

			context.fillStyle = "#999";
			context.beginPath();
			/* context.arc(off_x, off_y, 2, 40, 0, 2*Math.PI); */
			context.moveTo(off_x, off_y);
			context.lineTo(off_x, off_y - 4);
			context.lineTo(off_x - 5, off_y);
			context.lineTo(off_x, off_y + 4);
			context.lineTo(off_x, off_y);
			context.fill();

			// context.font = "10px Roboto Mono";
			context.font = "12px Arial";
			context.fillText("Sun", off_x - 29, off_y + 3);
			context.fillText("Earth", off_x + 155, off_y + 3);
			context.fillText('DSCOVR(L1)', new_proj[0] - 30, off_y - (Math.abs(new_proj[1] - off_y) + 20));
			context.fill();

			context.fillStyle = "#FFF";

			context.beginPath();
			context.moveTo(off_x, off_y);
			context.lineWidth = 0.5;
			context.lineTo(off_x + 150, off_y);
			context.stroke();

			context.fillStyle = "#999";
			context.beginPath();
			context.strokeStyle = "#FFF";
			context.arc(off_x + 150, off_y, 2, 40, 0, 2*Math.PI);
			context.fill();

			context.beginPath();
			context.strokeStyle = "#FFF";
			context.fillStyle = "#FFF";
			context.arc(new_proj[0], off_y - (new_proj[1] - off_y), 1, 40, 0, 2*Math.PI);
			context.fillText(du_str, off_x - 29, off_y + 15);
			context.fillText(dv_str, new_proj[0] - 30, off_y - (Math.abs(new_proj[1] - off_y) + 8));
			context.fillText('SEV Angle: ' + sevθ + '°', off_x + 155, off_y + 15);
			context.fill();

			context.beginPath();
			context.strokeStyle = "#FFF";
			context.moveTo(new_proj[0], off_y - (new_proj[1] - off_y));
			context.lineTo(off_x + 150, off_y);
			context.stroke();

			window.scp['lastImageIdx'] = image_id;
		}


		window.initializeMap = function() {
			if (window.hasOwnProperty('d3') == false)
				return;

			var canvas 		= window.scp.canvas =  d3.select('#globe_canvas');
			var proj 		= window.scp.proj 	= d3.geo.orthographic()
										.scale( 120 / 2.1)
										.translate([window.scp.globe_cvs_w / 2, (window.scp.globe_cvs_h / 2) - 25])
										.clipAngle(90)
										.precision(.5);
			var context 	= window.scp.context		= canvas.node().getContext('2d');
			var path 		= window.scp.path 			= d3.geo.path().projection(proj).context(context);
			var graticule 	= window.scp.graticule 		= d3.geo.graticule();

			d3.json('/assets/world-110m.json', function(error, topo) {
				if (error) throw error;
				window.scp.land	= topojson.feature(topo, topo.objects.land);
				window.scp.borders 	= topojson.mesh(topo, topo.objects.countries, function(a,b) { return a !== b})
			});
		}

		window.startAnimation = function(speed) {
			window.stopAnimation();
			window.scp['anim_id'] 	= window.setInterval(function() {
				var img_id 			= window.scp['lastImageIdx'];
				img_id = img_id 	>= window.scp['anim_len']  - 1 ? 0 : img_id + 1;
				window.render(img_id);
				console.log(window.scp['lastImageIdx']);
			}, speed);
		}



		window.stopAnimation = function() {
			window.clearInterval(window.scp['anim_id']);
		}

		$("#play_btn").onclick = function(e) {
			startAnimation(1000);
			$("#stop_btn").removeClass('hidden');
			$("#play_btn").addClass('hidden');
		};

		$("#stop_btn").onclick = function(e) {
			$("#stop_btn").addClass('hidden');
			$("#play_btn").removeClass('hidden');
			window.stopAnimation();
		};

		window.computeSizing = function(e) {
			var window_w = window.innerWidth
				|| document.documentElement.clientWidth
				|| document.body.clientWidth;

			var window_h = window.innerHeight
				|| document.documentElement.clientHeight
				|| document.body.clientHeight;


			var f_el = $(".footer")[0];
			var b_el = $(".header")[0];
			var f_h;

			if (!isMobile) {
				f_h = parseInt(window.getComputedStyle(f_el).height) + parseInt(window.getComputedStyle(b_el).height);
			} else {
				f_h = parseInt(window.getComputedStyle(b_el).height);
			}
			img_max_dim = Math.min(window_h - f_h, window_w - (window_w * 0.25));
			img_margin = (window_w / 2) - (img_max_dim / 2);

			var mi = $("#main_image");
			mi.css('max-width', img_max_dim + 'px');
			mi.css('margin-left', img_margin + 'px');
			mi.css('margin-right', img_margin + 'px');
			$('#nav_controls').css('top', (img_max_dim / 2) + 'px');

			var p_top = ((window_h - (f_h + 35)) - img_max_dim) / 3;

			var fe = $("#data_display_cont");
			var d_top;
			if (!isMobile) {
				var f_off = parseInt(window.offset($("#footer")[0]).top);
				d_top = f_off - parseInt(window.getComputedStyle($("#header")[0]).height) - 90;
				console.log(d_top);
			} else {
				d_top = parseInt(window.offset($("#globe_canvas").top)) + 250 + 90;
			}

			fe.css('top', d_top + 'px');
			/* fe = $("#playback_controls");
			if (!isMobile) {
				d_top = parseInt(window.getComputedStyle($("#home_state")).height) - 110;
				// d_top = window_h - (parseInt(window.getComputedStyle(f_el).height) + parseInt(window.getComputedStyle(b_el).height) + parseInt(window.getComputedStyle(fe).height) + 65);
			} else {
				d_top = parseInt(window.getComputedStyle($("#home_state")).height) - 110;
				//d_top = window_h - (parseInt(window.getComputedStyle(b_el).height) + parseInt(window.getComputedStyle(fe).height) + 25);
			}

			$("#playback_controls").css('top', d_top + 'px'); */
		};

		window.onresize = function(e) {
			computeSizing(e);
		}

		window.scp['mag_image_hi'].onload = function(e) {
			console.log('hi-res image loaded');
			window.scp['mag_image_hi'].removeClass('hidden');
			window.scp['mag_image'].addClass('hidden');
		}

		/* $("#search_btn").onclick = function(e) {
			console.log('Do something!');
			window.stopAnimation();
			$("#date_control_cont").addClass('hidden');
			//$("#date_caret").removeClass('fa-caret-up').addClass('fa-caret-down');
			getImages();
		} */

		$("#switch_units").onclick = function(e) {
			var miles 	= $(".distance_miles")[0];
			var km 		= $(".distance_km")[0];
			if (miles.hasClass('hidden')) {
				km.addClass('hidden');
				miles.removeClass('hidden');
			} else {
				km.removeClass('hidden');
				miles.addClass('hidden');
			}
			window.render(window.scp['lastImageIdx']);
		}

		$("#cancel_btn").onclick = function(e) {
			$("#date_control_cont").addClass('hidden');
		}

		window.select_cont_filter = function(el) {
			var cont_label = el.innerHTML;
			console.log(cont_label);
			var cont_obj = window.continents[ cont_label ];
			console.log(cont_obj);
			if (cont_obj != undefined) {
				selected_continent = cont_obj;
				$("#geo_ind").removeClass('hidden');
				$("#selected_continent_label").innerHTML = cont_label;
			} else {
				$("#selected_continent_label").innerHTML = "(no continent selected)";
				selected_continent = null;
				$("#geo_ind").addClass('hidden');
			}
			$(".cont_sel").forEach(function(e) {
				e.removeClass('selected');
			});
			el.addClass('selected');
			cont = $("#cont_selector");
			cont.addClass('hidden');
			var date_pick = $("#date_picker_cont");
			date_pick.removeClass('hidden');
			search_btn_cont.removeClass('hidden');
			$('#continent_caret').removeClass('fa-caret-up').addClass('fa-caret-down');
		}


		window.display_search = function() {
			if ($("#date_control_cont").hasClass('hidden')) {
				$("#date_control_cont").removeClass('hidden');
				$("#date_caret").removeClass('fa-caret-down').addClass('fa-caret-up');
			} else {
				$("#date_control_cont").addClass('hidden');
				$("#date_caret").removeClass('fa-caret-up').addClass('fa-caret-down');
			}
			if (!$("#image_list_container").hasClass('hidden')) {
				$("#image_list_container").addClass('hidden');
				$("#nav_controls").removeClass('hidden');
				$("#primary").removeClass('hidden');
				$("#data_display_cont").removeClass('hidden');
				$("#globe_container").removeClass('hidden');
			} else {
				$("#image_list_container").addClass('hidden');
				$("#nav_controls").removeClass('hidden');
				$("#primary").removeClass('hidden');
				$("#data_display_cont").removeClass('hidden');
				$("#globe_container").removeClass('hidden');
			}
		}



		var picker = new Pikaday({ onSelect: function(date) {
				search_date = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
				$("#date_control_cont").addClass('hidden');
				getImages();
			},
			minDate : new Date(Date.parse( enabledDates[0] )),
			maxDate : new Date(),
			disableDayFn : function(date) {
				var dStr = date.getUTCFullYear() + '-';
				var m = date.getUTCMonth() + 1;
				m = m < 10 ? "0" + m : m;
				dStr += m + "-";
				var d = date.getUTCDate();
				d = d < 10 ? "0" + d : d;
				dStr += d;
				return enabledDates.indexOf(dStr) > -1 ? false : true;
			}
		});



		$("#date_picker").appendChild(picker.el);

		$("#continent_select_toggle").onclick = function(e) {
			var cont = $("#cont_selector");
			var date_pick = $("#date_picker_cont");
			var search_btn_cont = $("#search_btn_cont");

			if (cont.hasClass('hidden')) {
				date_pick.addClass('hidden');
				search_btn_cont.addClass('hidden');
				cont.removeClass('hidden');
				$('#continent_caret').removeClass('fa-caret-down').addClass('fa-caret-up');
			} else {
				cont.addClass('hidden');
				date_pick.removeClass('hidden');
				search_btn_cont.removeClass('hidden');
				$('#continent_caret').removeClass('fa-caret-up').addClass('fa-caret-down');
			}
		}

		window.prev_img = function(e) {
			var img_id = window.scp['lastImageIdx'];
			img_id = img_id == 0 ? window.scp['anim_len'] - 1 : img_id - 1;
			window.render(img_id);
		}

		window.next_img = function(e) {
			var img_id = window.scp['lastImageIdx'];
			img_id = img_id >= window.scp['anim_len']  - 1 ? 0 : img_id + 1;
			window.render(img_id);
		}

		window.prev_day = function(e) {
			if ( dateIdx > 0) {
				dateIdx--;
			} else {
				dateIdx = enabledDates.length - 1;
			}
			search_date = enabledDates[ dateIdx ];
			var utc = new Date( Date.parse( search_date ));
			var utc = utc.getTime() + utc.getTimezoneOffset() * 60000;
			picker.setDate(new Date(utc));
			getImages();
		}

		window.next_day = function(e) {
			if (dateIdx == enabledDates.length - 1) {
				dateIdx = 0;
			} else {
				dateIdx++;
			}
			search_date = enabledDates[ dateIdx ];
			var utc = new Date( Date.parse( search_date ));
			var utc = utc.getTime() + utc.getTimezoneOffset() * 60000;
			picker.setDate(new Date(utc));
			getImages();
		}

		window.toggle_nav = function(e) {

			var m = $("#main_menu");
			if (m.hasClass('hidden')) {
				m.removeClass('hidden');
			} else {
				m.addClass('hidden');
			}
		}


		$("#grid_mode_toggle").onclick = function() {
			if ($("#image_list_container").hasClass('hidden')) {
				$("#image_list_container").removeClass('hidden');
				$("#date_caret").removeClass('fa-caret-up').addClass('fa-caret-down');
				$("#nav_controls").addClass('hidden');
				$("#primary").addClass('hidden');
				$("#data_display_cont").addClass('hidden');
				$("#globe_container").addClass('hidden');
				$("#date_control_cont").addClass('hidden');
			} else {
				$("#image_list_container").addClass('hidden');
				$("#nav_controls").removeClass('hidden');
				$("#primary").removeClass('hidden');
				$("#data_display_cont").removeClass('hidden');
				$("#globe_container").removeClass('hidden');
				$("#date_caret").removeClass('fa-caret-up').addClass('fa-caret-down');
			}

		}



		if (isMobile) {
			$("#nav_left").ontouchstart = window.prev_img;
			$("#nav_right").ontouchstart = window.next_img;
			$("#nav_toggle").ontouchstart = window.toggle_nav;
			$("#cal_base").ontouchstart = window.display_search;
		} else {
			$("#nav_left").onclick = window.prev_img;
			$("#nav_right").onclick = window.next_img;
			$("#nav_toggle").onclick = window.toggle_nav;
			$("#cal_base").onclick = window.display_search;
		}

		var selected_continent = null;
		initializeMap();
		var dateIdx = enabledDates.length - 1;
		var search_date = enabledDates[dateIdx];

		var url = document.location.href;
		var urlID = 0;
		if (url.indexOf('#') > -1) {
			var frag = url.substring( url.indexOf('#') + 1);
			if (frag.length < 30) {
				var f_idx = frag.indexOf('%23');
				var fragments;
				if (f_idx > -1 ) {
					fragments = [frag.substring(0, f_idx), frag.substring(f_idx + 3)];
				} else {
					fragments = frag.split("#");
				}


				var sd = fragments[0];
				if (enabledDates.indexOf(search_date) > -1) {
					search_date = sd;
					var utc = new Date( Date.parse( search_date ));
					var utc = utc.getTime() + utc.getTimezoneOffset() * 60000;
					picker.setDate(new Date(utc));
				}
				if (fragments.length > 1) {
					var urlID = parseInt(fragments[1]);
					getImages(urlID - 1);
				} else {
					getImages();
				}



			} else {
				getImages();
			}
		} else {
			getImages();
		}

		var d = document.documentElement;
		d.setAttribute('data-useragent', navigator.userAgent);

	}
});
/*

(function(d, w, fastActiveClassName, isFastActiveTarget) {
    if ((('ontouchstart' in w) || w.DocumentTouch && d instanceof DocumentTouch)) {
        var activeElement = null,
            clearActive = function() {
                if (activeElement) {
                    activeElement.classList.remove(fastActiveClassName);
                    activeElement = null;
                }
            },
            setActive = function(e) {
                clearActive();
                if (isFastActiveTarget(e)) {
                    activeElement = e.target;
                    activeElement.classList.add(fastActiveClassName);
                }
            };
        d.body.addEventListener('touchstart', setActive, false);
        d.body.addEventListener('touchmove', clearActive, false);
    }
})(document, window, 'active', function(e) {
    return ['A', 'INPUT'].indexOf(e.target.tagName) > -1; // Put your conditional logic here
});
*/




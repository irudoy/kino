
$(function(){

  $.modal.defaults = {
    overlay: "#000",        // Overlay color
    opacity: 0.75,          // Overlay opacity
    zIndex: 1,              // Overlay z-index.
    escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
    clickClose: true,       // Allows the user to close the modal by clicking the overlay
    closeText: '',     // Text content for the close <a> tag.
    closeClass: '',         // Add additional class(es) to the close <a> tag.
    showClose: true,        // Shows a (X) icon/link in the top-right corner
    modalClass: "modal",    // CSS class added to the element being displayed in the modal.
    spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
    showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
    fadeDuration: null,     // Number of milliseconds the fade transition takes (null means no transition)
    fadeDelay: 1.0          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
  };

  ///////////////////
  //    CALENDAR   //
  ///////////////////

  var days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  if ($('#calendar').length > 0) {

    var gCalURL = $('#calendar').attr('data-gcal-src');

    $('#daycontent').on('click', function(){
      $(this).hide();
      $(this).find('li.event').remove();
    });

    $('#calendar').fullCalendar({
      events: gCalURL,
      height: 170,
      lang: 'ru',
      eventClick: function(event) {
        return false;
      },
      loading: function(bool) {
        $('#loading').toggle(bool);
      },
      dayClick: function(date, jsEvent, view) {

        $('#daycontent').show();
        $('#daycontent .noevents').show();

        var dayName = days[ parseInt( (new Date(date._d)).getDay() ) ];
        var t = $('#calendar').fullCalendar('clientEvents'); // array w/ all events
        var clickedDayDate = date._i.substring(0,10); // clicked day date DD-MM-YYYY

        $('#daycontent .daycontent__head h2').html( dayName );
        $('#daycontent .daycontent__head span').html( clickedDayDate );

        for (var i = 0; i < t.length; ++i) {
          var currDate = t[i].start._i.substring(0,10); // current event date in format DD-MM-YYYY
          if (clickedDayDate == currDate) {
            var startTime = t[i].start._i.substring(11).substring(0,5); // event start time in format HH:MM
            var endTime = t[i].end._i.substring(11).substring(0,5); // event end time in format HH:MM
            var itemHTML = '<li class="event">' + startTime + ' – ' + endTime + '<span>Занято</span></li>';
            $('#daycontent ul').append( itemHTML );
            $('#daycontent .noevents').hide();
          }
        }

      }
    });

  }

  /////////////////
  //    SLIDER   //
  /////////////////

  (function(){
    if ($('.carousel--alt .carousel__container__item').length > 0) {
      if ($('.carousel--alt').attr('data-count') == undefined)
        $('.carousel--alt').attr('data-count', 0);
      var count = parseInt($('.carousel--alt').attr('data-count'));
      var slidesCount = $('.carousel--alt .carousel__container__item').size() - 1;
    }

    $('.carousel--alt .carousel__nav').on('click', function(e) {
      e.preventDefault();
      if ($('.carousel--alt .carousel__container__item:animated').size()>0) return;

      var direction;
      $(this).hasClass('carousel__nav--next') ? direction = 1 : direction = 0;

      if (direction == 0)
        (count == 0) ? count = slidesCount + 1 : count = count;
      else
        (count == slidesCount) ? count = - 1 : count = count;

      $('.carousel--alt .carousel__container__item.active').fadeOut(300, function() {
        $(this).removeClass('active');
        (direction == 1) ? count++ : count--;
        $('.carousel--alt .carousel__container__item').eq(count).fadeIn(300);
        $('.carousel--alt .carousel__container__item').eq(count).addClass('active');
        ///
        $('.carousel--alt').attr('data-count', count);
      });
    });

  })();

  /////////////////

  var $subnavLeft = $("#subnav--left");
  var $subnavRight = $("#subnav--right");

  $(".header__left").on({
    mouseenter: function () {
      if ($subnavRight.hasClass('active'))
        $subnavRight.removeClass('active');
      if (!$subnavLeft.hasClass('active')) {
        setTimeout(function(){
          $subnavLeft.addClass('active');
        }, 150);
        $subnavLeft.addClass('highlighted');
        setTimeout(function(){
          $subnavLeft.removeClass('highlighted');
        }, 400);
      }
    },
    mouseleave: function () {
      setTimeout(function(){
        if( !$subnavLeft.hasClass('hover') )
          $subnavLeft.removeClass('active');
      }, 300);
    }
  });

  $(".header__right").on({
    mouseenter: function () {
      if ($subnavLeft.hasClass('active'))
        $subnavLeft.removeClass('active');
      if (!$subnavRight.hasClass('active')) {
        setTimeout(function(){
          $subnavRight.addClass('active');
        }, 150);
        $subnavRight.addClass('highlighted');
        setTimeout(function(){
          $subnavRight.removeClass('highlighted');
        }, 400);
      }
    },
    mouseleave: function () {
      setTimeout(function(){
        if( !$subnavRight.hasClass('hover') )
          $subnavRight.removeClass('active');
      }, 300);
    }
  });

  $subnavLeft.on({
    mouseenter: function () {
      $(this).addClass('hover');
    },
    mouseleave: function () {
      $(this).removeClass('hover');
      setTimeout(function(){
        $subnavLeft.removeClass('active');
      }, 500);
    }
  });

  $subnavRight.on({
    mouseenter: function () {
      $(this).addClass('hover');
    },
    mouseleave: function () {
      $(this).removeClass('hover');
      setTimeout(function(){
        $subnavRight.removeClass('active');
      }, 500);
    }
  });

  /////////////////

  $('.carousel .carousel__item').on('click', function(e) {
    e.preventDefault();
    $('.carousel .carousel__item.active').removeClass('active');
    $(this).addClass('active');
    var href = $(this).find('a').attr('href');
    $("#featured-content").html('<i class="preloader fa fa-refresh fa-spin"></i>');
    setTimeout(function(){
      $("#featured-content").load(href);
    }, 1000);
  });

  /////////////////
  //   CAROUSEL  //
  /////////////////

  var carouselSlideSpeed = 500;
  var carouselEasing = 'easeInOutQuad';

  if ( $('.carousel .carousel__item').length > 6 ) {
    $('.carousel').each(function(){
      var $carousel = $(this);
      $carousel.find('ul li:last-child').prev('li').andSelf().prependTo( $carousel.find('ul') );
      var itemCount = $carousel.find('.carousel__item').length;
      var itemHeight = $carousel.find('.carousel__item').eq(0).outerHeight() + 10;
      //var totalWidth = itemCount * itemWidth;
      // $carousel.find('ul').css({ width: totalWidth, marginLeft: - itemWidth });
      $carousel.find('ul').css({ marginTop: - itemHeight });
    });
  } else {
    $('.carousel .carousel__nav').hide();
  }

  $('.carousel .carousel__nav').on('click', function(e) {

    e.preventDefault();

    var $carousel = $(this).parent();
    var itemHeight = $carousel.find('.carousel__item').eq(0).outerHeight();

    if ($carousel.find('ul:animated').size() > 0) return;

    var direction;

    $(this).hasClass('carousel__nav--next') ? direction = 1 : direction = 0;

    if (direction == 1) {
      $carousel.find('ul').animate({
          top: - itemHeight - 10
      }, carouselSlideSpeed, carouselEasing, function () {
          $carousel.find('ul li:first-child').next('li').andSelf().appendTo( $carousel.find('ul') );
          $carousel.find('ul').css('top', '');
      });
    } else {
      $carousel.find('ul').animate({
          top: + itemHeight + 10
      }, carouselSlideSpeed, carouselEasing, function () {
          $carousel.find('ul li:last-child').prev('li').andSelf().prependTo( $carousel.find('ul') );
          $carousel.find('ul').css('top', '');
      });
    }

  });

});

// 	////////////////////////
// 	//  PLACEHOLDERS FIX  //
// 	////////////////////////

// 	if ($.fn.placeholder.input && $.fn.placeholder.textarea) {
// 	} else if ($.fn.placeholder.input) {
// 		$('textarea').placeholder();
// 	} else {
// 		$('input, textarea').placeholder();
// 	}

// 	///////////////////
// 	//  SPEC-SLIDER  //
// 	///////////////////


// 	(function(){

// 		var easing = "easeInOutSine";
// 		$('.specslider__nav a').on( 'click', function( event ) {
// 			//debugger;
// 			var $this = $(this);
// 			var $inner = $this.parent().parent().find('.specslider__wrapper');
// 			var maxCount = $inner.find('.specslider__item').length-4;
// 			if ($inner.attr('data-count') == undefined)
// 				$inner.attr('data-count', 0);
// 			var count = parseInt($inner.attr('data-count'));
// 			var marg = parseInt($inner.css('margin-left'));
// 			var width = parseInt($inner.find('.specslider__item').css('width'));

// 			event.preventDefault();
// 			if ($inner.is(':animated')) {return;}

// 		    if ( $this.hasClass("specslider__nav--prev") ) {
// 		    	if (count <= 0) {
// 		    		return;
// 		    	} else {
// 		    		marg = marg+width;
// 		    		count -= 1;
// 		    	}
// 		    } else if (count < maxCount) {
// 				marg = marg-width;
// 				count += 1;
// 			}

// 			$inner.animate({
// 				marginLeft: marg+'px'
// 			}, {
// 			  duration: 500,
// 			  easing: easing
// 			});

// 			$inner.attr('data-count', count);

// 		});
// 	})();

// })(jQuery);

// 	////////////////////////
// 	//  FORMS VALIDATION  //
// 	////////////////////////

// 	$('a.submit').click(function(e) {
// 		e.preventDefault();
// 		$(this).parent().submit();
// 	});

// 	$('form').each(function() {
//         $(this).validate({
//             errorPlacement: $.noop,
// 	        submitHandler: function(form) {
// 			    $(form).submitForm();
// 			}
//         });
//     });

// 	/////////////////
// 	//    SCROLL   //
// 	/////////////////

// 	if (BrowserDetect.browser == 'Opera' && BrowserDetect.version <= 12) {
// 		$('a[data-scroll]').click(function(e){
// 		    scrollFrom = $(window).scrollTop();
// 		    var target = $(this).attr('href');
// 		    $(window.opera?'html':'html, body').animate({
// 		        scrollTop: $(target).offset().top-0
// 		    },1000);
// 		});
// 	} else {
// 		smoothScroll.init({
// 		    speed: 500, // scroll speed (ms)
// 		    easing: 'easeInOutCubic', // easing
// 		    updateURL: true // url hash update
// 		});
// 	}

// 	/////////////
// 	//   MAP   //
// 	/////////////

// 	ymaps.ready(function () {
// 	    var myMap = new ymaps.Map('map', {
// 	        center: [43.166807, 131.908544],
// 	        zoom: 17,
// 	        offset: [100, 100],
// 	        controls: []
// 	    });

// 	    var myPlacemark = new ymaps.Placemark([43.166807, 131.908544], {
// 	        balloonContentBody: [
// 	            '<address>',
// 	            '<strong>Автомобили с аукционов Японии, Кореи и США</strong>',
// 	            '<br/>',
// 	            'Адрес: г. Владивосток, ул.Русская 9Б, офис 608',
// 	            '<br/>',
// 	            'Тел.: 8(423)200-48-47',
// 	            '</address>'
// 	        ].join('')
// 	    }, {
// 	        preset: 'islands#dotIcon',
// 	        iconColor: '#126FA6'

// 	    });

// 	    myMap.geoObjects.add(myPlacemark);
// 	    myMap.behaviors.disable('scrollZoom');
// 	});

// 	/////////////////////////
// 	//  RANGE SLIDER       //
// 	/////////////////////////

// 	$('#calculate .header-button').on( 'click', function() {
// 	//spagetti
// 	  var text = '';
// 	  if (!$(this).hasClass('active')) {
// 		($(this).hasClass('moto')) ? text = 'мотоцикла' : text = 'спецтехники';
// 		$(this).parent().find('h1').html('Расчитать стоимость ' + text);
// 		$(this).parent().find('.active').removeClass('active');
// 		$(this).addClass('active');
// 	  } else {
// 		$(this).parent().find('h1').html('Расчитать стоимость авто');
// 	  	$(this).removeClass('active');
// 	  }
// 	  var val = $(this).parent().find('h1').html();
// 	  $('#calculate form').attr('data-title', val);
// 	});

// 	$("#slider-range").slider({
// 	    range: true,
// 	    min: 2005,
// 	    max: 2014,
// 	    step: 1,
// 	    values: [2009, 2011],
// 	    slide: function( event, ui ) {
// 	        $("#year-1").val(ui.values[0]);
// 	        $("#year-2").val(ui.values[1]);
// 	      }
// 	});

// 	/////////////////////////
// 	//  ISOTOPE (GALLERY)  //
// 	/////////////////////////

// 	var $container = $('#container');
// 	$container.isotope({
// 	  itemSelector: '.item',
// 	  layoutMode: 'fitRows'
// 	});

//     $container.isotope({ filter: '.auto' });

// 	$('#filters').on( 'click', 'a', function( event ) {
// 	  event.preventDefault();
// 	  var filterValue = $(this).attr('data-filter-value');
// 	  $container.isotope({ filter: filterValue });
// 	  $('#filters li.active').removeClass("active");
// 	  $(this).parent().addClass("active");
// 	});

// 	/////////////////
// 	//  COUNTDOWN  //
// 	/////////////////

// 	var ts = new Date().getTime();
// 	var interval = 3 * 24 * 60 * 60 * 1000;
// 	var tm = 0;
// 	var result = tm + interval * ( Math.floor((ts - tm) / interval) + 1 ) - ts;

// 	FlipClock.Lang.Russian = {
// 		'years'   : 'Лет',
// 		'months'  : 'Месяцев',
// 		'days'    : 'Дней',
// 		'hours'   : 'Часов',
// 		'minutes' : 'Минут',
// 		'seconds' : 'Секунд'
// 	};

// 	FlipClock.Lang['ru'] = FlipClock.Lang.Russian;

// 	var clock = $('#countdown').FlipClock(result/1000, {
// 		countdown: true,
// 		language: 'ru'
// 	});

// 	$('.flip-clock-wrapper ul li a').on( 'click', function( event ) {
// 		event.preventDefault();
// 	});

// 	/////////////////
// 	//    ELSE     //
// 	/////////////////

// 	$('.logo').on('click', function(e) {
// 		e.preventDefault();
// 	});

// })(jQuery);

// ////////////////////////////
// //  FORM SUBMIT FUNCTION  //
// ////////////////////////////

// $.fn.submitForm = function() {

// 	var form = $(this);
// 	var preloaderHTML = '<div class="form-preloader" style="display: none;"><div><i class="fa fa-refresh fa-spin"></i></div></div>';
// 	var okHTML = '<i class="fa fa-check"></i><br />Сообщение отправлено!';
// 	var errorHTML = '<i class="fa fa-frown-o"></i><br />Произошла ошибка!';

// 	form.parent().append(preloaderHTML);
// 	var preloader = $(this).parent().find('.form-preloader');

// 	var preloaderHeight = preloader.height();
// 	var innerHeight = preloader.find('div').height();
// 	var preloaderPadding = ((preloaderHeight/2) - innerHeight/2) + 10;
// 	preloader.css("padding-top", preloaderPadding + "px");

// 	preloader.fadeIn(300);

// 	var fields = form.find("input[type=text], input[type=email]");
// 	//var fields = form.find("input[type=text], input[type=email], input[type=checkbox], textarea");
// 	var data = {};
// 	data["formName"] = form.attr("data-title");



// 	$(fields).each(function(){
// 		var name = $(this).attr("name");

// 		// if ($(this).attr("type")=="checkbox") {
// 		// 	if ($(this).is(':checked')) {
// 		// 		val = "on";
// 		// 	} else {
// 		// 		val = "off";
// 		// 	}
// 		// } else {
// 			var val = $(this).val();
// 		//}

// 		data[name] = val;
// 	});

// 	data["secret"] = "2f7d9f0d0acf89a8f6a57d79f0f7d475";

// 	var isError = false;

// 	$.ajax({
// 	  type: "POST",
// 	  url: "/",
// 	  data: JSON.stringify(data),
// 	  contentType: "application/json; charset=utf-8",
//       success: function (data) {
//       	preloader.find('div').html(okHTML);
//       },
//       error: function (data) {
//       	isError = true;
//       	preloader.find('div').html(errorHTML);
//       }
// 	});

// 	$('.form-preloader').click(function() {
// 		$(this).fadeOut(300, function() {
// 			$(this).remove();
// 		});
// 		if (!isError) {
// 			fields.val('');
// 		}
// 	});

/////////////////////////
//  BROWSER DETECTION  //
/////////////////////////

var BrowserDetect =
{
    init: function ()
    {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) ||       this.searchVersion(navigator.appVersion) || "Unknown";
    },

    searchString: function (data)
    {
        for (var i=0 ; i < data.length ; i++)
        {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1)
            {
                return data[i].identity;
            }
        }
    },

    searchVersion: function (dataString)
    {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },

    dataBrowser:
    [
        { string: navigator.userAgent, subString: "Chrome",  identity: "Chrome" },
        { string: navigator.userAgent, subString: "MSIE",    identity: "Explorer" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.userAgent, subString: "Safari",  identity: "Safari" },
        { string: navigator.userAgent, subString: "Opera",   identity: "Opera" }
    ]

};

BrowserDetect.init();

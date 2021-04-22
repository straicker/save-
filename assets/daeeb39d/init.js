(function($) {
	$(document).ready(function() {

		/* MENU */
		var el = $("ul > li").children().find('.active');
		el.parent().parent().addClass('active');

		/*Инициализируем select2*/
		$(".select2").select2({
			allowClear: true
		});

		//
		// Инициализируем глобальный прелоадер
		//
		$("body").ajaxSend(function(e, xhr, settings) {
			$('#ajax-preloader').show();
		});
		$("body").ajaxSuccess(function(e, xhr, settings) {
			$('#ajax-preloader').fadeOut(300);
		});
		$("body").ajaxError(function(e, xhr, settings) {
			$('#ajax-preloader').fadeOut(300);
		});

		/* MODAL */
        $(document).on('click', 'a.modal-link', function(){
            var url = $(this).attr('href');
            if(url){
                $('#modal-content').load(url);
                $('#modal').modal('show');
            }
            return false;
        });

		
        $(".common-tooltip").tooltip( {
            position: {
                my: "center top",
                at: "center top",
                of: window
            }
        });
        
      $('.select').each(function() {
        var div_element = $('<div class="select"></div>');
        var ul_element = $('<ul class="options" style="display: none"></ul>');
        div_element.append(ul_element);

        var options = $(this).children('option');
        for(var i=0; i<options.length; i++)
        {
            var opt_elem = options[i];
            ul_element.append($('<li class="opt">' + $(opt_elem).text() + '</li>'));
        }


        div_element.append(ul_element);
        div_element.append('<span class="val">' + $(this).find('option:selected').text() + '</span>');
        div_element.append('<span class="arr">&nbsp;</span>');
        $(this).parent().append(div_element);
        $(this).appendTo(div_element);
        $(this).hide();
    });

	    // Инициализируем utils для jquery
		$.utils = {};
		(function() {$.utils.init = function() {}})()

		$.utils._dialogInit = function(type, text, _duration) {
			$('#alert').html(text);
			var dialogConfig = {
				'duration': null,
				'name': '',
				'title': ''
			};
			var durationDefault = 1500;
            var dialogClasses = 'alert';
			switch (type) {
				case 'success':
					durationDefault = 1500;
					dialogConfig.title = 'Success';
					dialogConfig.class = 'alert-success';
					dialogConfig.removeClasses = 'alert-info alert-danger';
					break;
				case 'error':
					durationDefault = 1500;
					dialogConfig.title = 'Error';
					dialogConfig.class = 'alert-error';
					dialogConfig.removeClasses = 'alert-success alert-info';
					break;
				case 'notice':
					durationDefault = 1500;
					dialogConfig.title = 'Notice';
					dialogConfig.class = 'alert-info';
					dialogConfig.removeClasses = 'alert-success alert-danger';
					break;
			}

			dialogConfig.duration = _duration === undefined ? durationDefault : _duration;
				$('#alert').removeClass(dialogClasses + dialogConfig.removeClasses).addClass(dialogClasses + ' ' + dialogConfig.class);
				$('#alert').modal({
					backdrop: false,
					keyboard: false,
					show: true,
				});
			    window.setTimeout(function(){
			    	$('#alert').modal('hide');
				}, durationDefault);
		}

		$.utils.successMessage = function(text, _duration) {
			$.utils._dialogInit('success', text, _duration);
		}
		$.utils.errorMessage = function(text, _duration) {
			$.utils._dialogInit('error', text, _duration);
		}
		$.utils.noticeMessage = function(text, _duration) {
			$.utils._dialogInit('info', text, _duration);
		}
		$.utils.ajaxButtonSuccessHandler = function(data) {
			if(data.type == "success"){
            	$.utils.successMessage(data.message);
            }
            else{
                $.utils.errorMessage(data.message);
            }
		}

		// Список уже загруженных ajax вкладок
        var tabsLoadStatus = {"#int-action": true};
        // Загрузится первым
        $('#myTabs a:first').tab('show');
		$('#myTabs a').click(function (e) {
			e.preventDefault();
			var url = $(this).attr("data-url"); // получим data-url
		  	var tabId = this.hash; // получим id
		  	var pane = $(this); // получим объект с текущим id

            if(tabsLoadStatus[tabId] === undefined){
                // Аякс загрузка
                $(tabId).load(url, function(result){
                    pane.tab('show');
                });
                tabsLoadStatus[tabId] = true;
            }
            else{
                pane.tab('show');
            }

		});

		// Преобразование чекбоксов в ios стиль
        checkSwitch();
	});
})(jQuery);

/**
 * Ajax-переключатель типа enable/disable для чекбокса
 * @param element Object чекбокса
 * @param ajaxUrl URL для ajax-запроса
 * @param entityName Название сущности (campaign, banner и т.д.)
 * @mesTrue Сообщение для положения true
 * @mestFalse Сообщение для положения false
 * @updateElement Класс обновляемого элемента
 * @needConfirm Необходимо ли подтверждение действия
 * @callback Пользовательская функция, выполняющаяся после успешного выполнения ajax-запроса
 */
function ajaxSwitcher(element, ajaxUrl, entityName, mesTrue, mesFalse, updateElement, needConfirm, callback) {
    var $this = element;
    var message = '';
    var value = null;
    if($this.attr('checked') !== undefined) {
        message =  mesTrue;
        value = 1;
    } else {
        message =  mesFalse;
        value = 0;
    }
    var id = $this.data('entityId');
    if (updateElement !== undefined) {
    	var el = $('#' + updateElement).find("a span");
    }
    var confirmVal = true;
    if(needConfirm !== undefined && needConfirm){
        confirmVal = confirm(message + '?');
    }
    function switcherOff(){
        var eventClick = jQuery.Event("click");
        eventClick.noAction = true;
        $(element).trigger(eventClick);
    }
    if(confirmVal){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: ajaxUrl,
            data: {id: id, value: value},
            success: function(data){
                if(data !== undefined && data){
                    if(data.errorMessage !== undefined && data.errorMessage){
                        $.utils.errorMessage(data.errorMessage);
                        return;
                    }
                    if (updateElement && data.amount !== undefined){
                        el.html(data.amount);
                    };
                }
                if(callback !== undefined && typeof(callback) == 'function'){
                    callback();
                }
                $.utils.successMessage(entityName + ' is ' + message);
            }
        });
    }
    else{
        switcherOff();
    }
}
/**
 * Инициализация датапикеров
 */

/**
 * Редирект пользователя на click-url баннера
 * @param url Редирект url
 */
function clickBanner(url)
{
    var to = url;
    window.open(to, '_blank');
}

function afterAjaxUpdateGrid(){
   // $("[data-toggle=tooltip]").tooltip();
    checkSwitch();
    datePickerInit();
}

function activateMenuItem(el) {
	var el = $("ul > li").children().find(el).addClass('active');
	el.parent().parent().addClass('active');
}
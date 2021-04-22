function checkSwitch()
{
	$('input.checkSwitch').each(function() {
        if(!$(this).parent('div.checkSwitch').length){
            if($(this).attr('checked') == 'checked'){
                $(this).wrap('<div class="checkSwitch on" />');
            } else {
                $(this).wrap('<div class="checkSwitch off" />');
            }
            $(this).parent('div.checkSwitch').each(function() {
                $(this).append('<div class="checkSwitchInner"><div class="checkSwitchOn">On</div><div class="checkSwitchHandle"></div><div class="checkSwitchOff">Off</div></div>');
            });
        }
	});
}

$(document).on('click', 'div.checkSwitch', function() {

	var $this = $(this);

	if($this.hasClass('off')){
		$this.addClass('on');
		$this.removeClass('off');
		$this.children('input.checkSwitch').attr('checked', 'checked');
	} else if($this.hasClass('on')){
		$this.addClass('off');
		$this.removeClass('on');
		$this.children('input.checkSwitch').removeAttr('checked');
	}
});
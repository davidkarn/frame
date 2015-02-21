function frame_background() {
    var menu_clicked;
    var menu_id = chrome.contextMenus.create({
        title:      'Leave a comment',
        context:   ['selection'],
        onclick:     menu_clicked}); 

    menu_clicked = function() {
        send_message_to_active_tab({
            command: 'leave_comment'}); }; }
            
        

frame_background();

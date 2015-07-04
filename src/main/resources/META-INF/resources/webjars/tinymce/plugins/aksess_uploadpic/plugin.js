/**
 * Created by rubfag on 09.06.2015.
 */

tinymce.PluginManager.add('aksess_uploadpic', function(editor, url){

    function makeUploadPopupWindow() {
        // Open window
        editor.windowManager.open({
            title: 'Last opp bilde',
            url: properties.contextPath + "/admin/multimedia/ViewUploadMultimediaForm.action?fileUploadedFromEditor=true",
            width: 450,
            height: 450
        });
    }

    // Add a button that opens a window
    editor.addButton('aksess_uploadpic', {
        image: url + '/img/uploadimage.png',
        onclick: makeUploadPopupWindow
    });

    // Adds a new item to the insert menu
    editor.addMenuItem('aksess_uploadpic', {
        text: 'Upload image',
        image: url + '/img/uploadimage.png',
        context: 'insert',
        onclick: makeUploadPopupWindow
    });
});
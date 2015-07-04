/*
 * Copyright 2009 Kantega AS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

tinymce.PluginManager.add('aksess_insertmedia', function(editor, url){

    function makeInsertEditPopupWindow() {
        var id = -1;
        var elm = editor.selection.getNode();
        if (elm != null && elm.nodeName == "IMG") {
            var src = editor.dom.getAttrib(elm, 'src');
            var newMultimediaStartToken = "/multimedia/";
            if (src.indexOf(newMultimediaStartToken) != -1) {
                src = src.substring(src.indexOf(newMultimediaStartToken) + newMultimediaStartToken.length, src.length);
                id = src.substring(0, src.indexOf("/"));
            }
        }

        openaksess.editcontext.doInsertTag = true;
        // IE 7 & 8 looses selection. Must be kept and restored manually.
        editor.focus();
        editor.windowManager.bookmark = editor.selection.getBookmark(1);

        var href;
        if (id == -1) {
            href = "/admin/multimedia/Navigate.action";
        } else {
            href = "/admin/multimedia/EditMultimedia.action?id=" + id;
        }
        // Open window
        editor.windowManager.open({
            title: 'Sett inn multimedia',
            url: properties.contextPath + href,
            width: 860,
            height: 560
        });
    }

    // Add a button that opens a window
    editor.addButton('aksess_insertmedia', {
        //image: url + '/img/uploadimage.png',
        onclick: makeInsertEditPopupWindow
    });

    // Adds a new item to the insert menu
    editor.addMenuItem('aksess_insertmedia', {
        text: 'Insert image',
        //image: url + '/img/uploadimage.png',
        context: 'insert',
        onclick: makeInsertEditPopupWindow
    });
});
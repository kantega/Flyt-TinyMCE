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

tinymce.PluginManager.add('aksess_contextmenu', function(editor) {
    var menu, contextmenuNeverUseNative = editor.settings.contextmenu_never_use_native;

    editor.on('contextmenu', function(e) {
        var contextmenu, doc = editor.getDoc();

        // Block TinyMCE menu on ctrlKey
        if (e.ctrlKey && !contextmenuNeverUseNative) {
            return;
        }
        console.log("settings.contextmenu "+editor.settings.contextmenu);
        if (editor.settings.contextmenu == false){
            return;
        }

        e.preventDefault();

        /**
         * WebKit/Blink on Mac has the odd behavior of selecting the target word or line this causes
         * issues when for example inserting images see: #7022
         */
        if (tinymce.Env.mac && tinymce.Env.webkit) {
            if (e.button == 2 && doc.caretRangeFromPoint) {
                editor.selection.setRng(doc.caretRangeFromPoint(e.x, e.y));
            }
        }

        contextmenu = editor.settings.contextmenu || 'link image inserttable | cell row column deletetable';

        // Render menu
        if (!menu) {
            var items = [];

            tinymce.each(contextmenu.split(/[ ,]/), function(name) {
                var item = editor.menuItems[name];

                if (name == '|') {
                    item = {text: name};
                }

                if (item) {
                    item.shortcut = ''; // Hide shortcuts
                    items.push(item);
                }
            });

            for (var i = 0; i < items.length; i++) {
                if (items[i].text == '|') {
                    if (i === 0 || i == items.length - 1) {
                        items.splice(i, 1);
                    }
                }
            }

            menu = new tinymce.ui.Menu({
                items: items,
                context: 'contextmenu'
            }).addClass('contextmenu').renderTo();

            editor.on('remove', function() {
                menu.remove();
                menu = null;
            });
        } else {
            menu.show();
        }

        // Position menu
        var pos = {x: e.pageX, y: e.pageY};

        if (!editor.inline) {
            pos = tinymce.DOM.getPos(editor.getContentAreaContainer());
            pos.x += e.clientX;
            pos.y += e.clientY;
        }

        menu.moveTo(pos.x, pos.y);
    });
});
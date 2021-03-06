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

//tinyMCEPopup.requireLangPack();

var TemplateDialog = {
    preInit : function() {
        //var url = tinyMCEPopup.getParam("template_external_list_url");
        var url = tinymce.settings.template_external_list_url;

        //if (url != null)
        //    document.write('<sc'+'ript language="javascript" type="text/javascript" src="' + tinyMCEPopup.editor.documentBaseURI.toAbsolute(url) + '"></sc'+'ript>');
    },

    init : function() {
        var ed = tinyMCEPopup.editor, tsrc, sel, x, u;

        tsrc = ed.getParam("template_templates", false);
        sel = document.getElementById('tpath');

        // Setup external template list
        if (!tsrc && typeof(tinyMCETemplateList) != 'undefined') {
            for (x=0, tsrc = []; x<tinyMCETemplateList.length; x++)
                tsrc.push({title : tinyMCETemplateList[x][0], src : tinyMCETemplateList[x][1], description : tinyMCETemplateList[x][2]});
        }

        for (x=0; x<tsrc.length; x++)
            sel.options[sel.options.length] = new Option(tsrc[x].title, tinyMCEPopup.editor.documentBaseURI.toAbsolute(tsrc[x].src));

        this.resize();
        this.tsrc = tsrc;
    },

    resize : function() {
        var w, h, e;

        if (!self.innerWidth) {
            w = document.body.clientWidth - 50;
            h = document.body.clientHeight - 160;
        } else {
            w = self.innerWidth - 50;
            h = self.innerHeight - 170;
        }

        e = document.getElementById('templatesrc');

        if (e) {
            e.style.height = Math.abs(h) + 'px';
            e.style.width = Math.abs(w - 5) + 'px';
        }
    },

    loadCSSFiles : function(d) {
        var ed = tinyMCEPopup.editor;

        tinymce.each(ed.getParam("content_css", '').split(','), function(u) {
            d.write('<link href="' + ed.documentBaseURI.toAbsolute(u) + '" rel="stylesheet" type="text/css" />');
        });
    },

    selectTemplate : function(u, ti) {
        var d = window.frames['templatesrc'].document, x, tsrc = this.tsrc;

        if (!u)
            return;

        d.body.innerHTML = this.templateHTML = this.getFileContents(u);

        for (x=0; x<tsrc.length; x++) {
            if (tsrc[x].title == ti)
                document.getElementById('tmpldesc').innerHTML = tsrc[x].description || '';
        }
    },

    insert : function() {
        tinyMCEPopup.execCommand('mceInsertTemplate', false, {
            content : this.templateHTML,
            selection : tinyMCEPopup.editor.selection.getContent()
        });

        tinyMCEPopup.close();
    },

    getFileContents : function(u) {
        var x, d, t = 'text/plain';

        function g(s) {
            x = 0;

            try {
                x = new ActiveXObject(s);
            } catch (s) {
            }

            return x;
        };

        x = window.ActiveXObject ? g('Msxml2.XMLHTTP') || g('Microsoft.XMLHTTP') : new XMLHttpRequest();

        // Synchronous AJAX load file
        x.overrideMimeType && x.overrideMimeType(t);
        x.open("GET", u, false);
        x.send(null);

        return x.responseText;
    }
};

TemplateDialog.preInit();
tinyMCEPopup.onInit.add(TemplateDialog.init, TemplateDialog);

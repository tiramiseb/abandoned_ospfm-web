/*
 *    Copyright 2012-2013 Sebastien Maccagnoni-Munch
 *
 *    This file is part of OSPFM-web.
 *
 *    OSPFM-web is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as published
 *    by the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    OSPFM-web is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with OSPFM-web.  If not, see <http://www.gnu.org/licenses/>.
 */

/***************************** Interface elements ****************************/

////////// Icons

/**
 * an icon element
 */
Icon = new Class(Element, {
    initialize:function(name) {
        this.$super('span', {
            'class':'icon-'+name,
            'aria-hidden':'true'
        });
    }
});

////////// Buttons

/**
 * a button element
 */
Button = new Class(Element, {
    /**
     * constructor
     *
     * @param String color of the button
     * @param String icon of the button
     * @param String optional text of the button
     * @param String optional type of the button (default: 'button')
     *
     */
    initialize:function(color, iconname, text, type) {
        this.color = color;
        var options = { 'class': color };
        this.$super('button', options);
        if (iconname) {
            this.insert(new Icon(iconname))
        } else {
            this.addClass('noicon')
        }
        this._.setAttribute('type', type || 'button');
        if (text) {
            this._addtext(text);
        } else {
            this.addClass('notext')
        };
    },
    text:function(text) {
        var existing = this.first('span.buttontext');
        if (existing) {
            existing.clean().insert(text);
        } else {
            this._addtext(text).removeClass('notext');
        };
        return this;
    },
    _addtext:function(text) {
        return this.insert(
            new Element('span', {'class': 'buttontext', 'html': text})
        )
    },
    enable:function() {
        if (!this.hasClass(this.color)) {
            this.addClass(this.color).set('disabled', null);
        }
        return this;
    },
    disable:function() {
        return this.removeClass(this.color).set('disabled', 'disabled');
    }
});

////////// Centered dialog window

// Stop observing mousewheel in the lightbox so that we can scroll its content
$(document).stopObserving('mousewheel');

function dialog_enable_overflow() {
    var content = $$('div.rui-lightbox-content').first(),
        container = $$('div.rui-lightbox-scroller').first();
    if (content && container) {
        if (content._.offsetHeight > container._.offsetHeight) {
            container.setStyle('overflow-y', 'scroll');
            container.setWidth(content._.offsetWidth+20);
        } else {
            container.setStyle('overflow-y', 'hidden');
            container.setWidth(content._.offsetWidth);
        };
        if (content._.offsetWidth > container._.offsetWidth) {
            container.setStyle('overflow-x', 'scroll');
        } else {
            container.setStyle('overflow-x', 'hidden');
        };
    };
}
$(window).onResize(dialog_enable_overflow);
/**
 * displays the dialog window
 *
 * @param mixed content of the dialog window
 * @param Boolean display the button bar
 */
// Defined this way in order to make it a global function
dialog = function (content, closable, focuson) {
    closable = closable === undefined ? true: closable;
    if (closable) {
        Lightbox.Options.hideOnEsc = true;
        Lightbox.Options.hideOnOutClick = true;
        Lightbox.Options.showCloseButton = true;
    } else {
        Lightbox.Options.hideOnEsc = false;
        Lightbox.Options.hideOnOutClick = false;
        Lightbox.Options.showCloseButton = false;
    }
    Lightbox.show(content);
    dialog_enable_overflow.delay(1000);
    // Put the focus on the first input or the first select, if there is one
    function putfocus() {
        var firstinput = $$('div.rui-lightbox-content')[0].first('input');
        if (!firstinput) {
            firstinput = $$('div.rui-lightbox-content')[0].first('select');
        }
        if (firstinput) {
            firstinput.focus();
        }
    };
    putfocus.delay(500);
};
/**
 * closes the dialog window
 */
close_dialog = function () {
    Lightbox.hide();
}

////////// Tooltips

Element.include({
    /**
     * attaches a tooltip to the element
     *
     * @param mixed content of the tooltip
     */
    tooltip:function(content) {
        var tooltip = $('tooltip');
        this.onMousemove(function(event) {
            var width;
            tooltip.update(content);
            width = tooltip._.offsetWidth;
            // Tooltip should be totally inside the page, with a 2px margin
            tooltip.moveTo(
                Math.min(
                    Math.max(
                        event.pageX - Math.floor(width / 2),
                        2
                    ),
                    window.innerWidth - width - 2
                ),
                event.pageY + 20
            );
        }).onMouseout(function() {
            tooltip.moveTo(-10000, 0);
        });
        return this;
    }
});
$('tooltip').onMouseover(function() {
    this.moveTo(-10000, 0);
});

////////// Small popup message

/**
 * displays a small popup
 *
 * @param String or Element popup content
 * @param Boolean true if it is an error message
 */
popup = function(content, error) {
    var delay,
        pp = $('popup');
    if (content) {
        if (popuptimeout) {
            clearTimeout(popuptimeout);
        };
        if (error) {
            delay = 5000;
            pp.addClass('errorpopup');
        } else {
            delay = 2000;
            pp.removeClass('errorpopup');
        }
        pp.update(content);

        pp.show('fade');
        popuptimeout = setTimeout(function() {
            popuptimeout = null;
            pp.hide('fade');
        }, delay);
    };
}
$('popup').onClick(function(){
    this.hide('fade');
});
$('spinner').onClick(function(){
    this.hide('fade');
});

////////// Tabs
/**
 * simple tabs
 */
Tabs = new Class(Element, {
    initialize:function() {
        this.$super('div', {'class':'tabs'});
        this.tabs = new Element('ul');
        this.content = new Element('div').setStyle('position', 'relative');
        this.insert([this.tabs, this.content]);
    },
    /**
     * gets the hash part for this tab
     *
     * @param Element optional selected tab
     * @return String the hash for this tab
     */
    getactiveid: function() {
        return this.tabs.first('li.activetab').tabid;
    },
    /**
     * sets the location hash
     *
     * @param Element selected tab
     */
    sethash: function(selected_tab) {
        var fullhash = [ selected_tab.tabid ];
        this.parents('div.tabs').forEach(function(parent) {
            fullhash.push(parent.getactiveid());
        });
        fullhash.reverse();
        selected_tab.elem.find('div.tabs').forEach(function(child) {
            fullhash.push(child.getactiveid());
        });
        location.hash = fullhash.join('/');
    },
    /**
     * simulate a click on a tab depending on the hash
     *
     * @param String hash
     */
    loadfromhash: function(hash) {
        var id;
        hash = isArray(hash) ? hash : hash.split('/');
        id = hash.shift();
        // Identify the tab and simulate a click
        this.tabs.children().some(function(tab) {
            var selected_tab,
                subtabs;
            if (id == tab.tabid) {
                selected_tab = tab;
                this.display(selected_tab);
                subtabs = selected_tab.elem.first('div.tabs');
                if (subtabs) {
                    subtabs.loadfromhash(hash)
                };
                return true;
            };
        }, this);
    },
    /**
     * display a tab content
     *
     * @param Element the tab
     */
    display: function(tab) {
        tab.addClass('activetab')
            .siblings().each('removeClass', 'activetab');
        tab.elem.setStyle({
            'left': '0',
            'top': '0'
        })
        .siblings().each('setStyle', {
            'left': '-10000px',
            'top': '-10000px'
        });
    },
    /**
     * add a tab and a related content
     *
     * @param String text on the link in the tabs
     * @param String tab unique identifier
     * @param Element content
     * @param Boolean optional is this tab the default
     */
    addTab: function(linktext, tabid, element, is_default) {
        element.setStyle({
            'position': 'absolute',
            'left': '-10000px',
            'top': '-10000px',
            'width': '100%'
        });
        this.content.insert(element);
        var link = new Element('li', {'html': linktext})
                    .onClick(function(event) {
                        this.display(link);
                        this.sethash(link);
                    }.bind(this));
        link.elem = element;
        link.tabid = tabid;
        this.tabs.insert(link);
        if (is_default) {
            this.display(link);
        };
        return this;
    }
});


////////// Various global stuff
$('applogo').onClick(function() {
    screens.load('/');
});

Calendar.Options.hideOnPick = true;

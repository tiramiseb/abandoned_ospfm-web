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

function icon(name) {
    return new Icon(name)._.outerHTML
}

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
        this.removeClass(this.color).set('disabled', 'disabled');
        return this;
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
            container.setWidth(content._.offsetWidth+15);
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
function dialog(content, closable) {
    var translate,
        putfocus;
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
    translate = function() {
        $$('div.rui-lightbox-content')[0].find('.translatable').each(
            function(element) {
                console.log(element);
                element.html(_(element.html()));
            }
        )
    }.delay(500);
    // Put the focus on the first input or the first select, if there is one
    putfocus = function() {
        var firstinput = $$('div.rui-lightbox-content')[0].first('input');
        if (!firstinput) {
            firstinput = $$('div.rui-lightbox-content')[0].first('select');
        }
        if (firstinput) {
            firstinput.focus();
        }
    }.delay(1000);
    dialog_enable_overflow.delay(1000);
};
/**
 * closes the dialog window
 */
function close_dialog() {
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


////////// Small popup message

/**
 * displays a small popup
 *
 * @param String or Element popup content
 * @param Boolean true if it is an error message
 */
function popup(content, error) {
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

////////// Initializations
$(document).onReady(function() {
    $('tooltip').onMouseover(function() {
        this.moveTo(-10000, 0);
    });
    $('popup').onClick(function(){
        this.hide('fade');
    });
    $('spinner').onClick(function(){
        this.hide('fade');
    });
    $('applogo').onClick(function() {
        screens.load('/');
    });
});

Calendar.Options.hideOnPick = true;

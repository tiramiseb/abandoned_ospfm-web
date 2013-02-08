/*
 *    Copyright 2012 Sebastien Maccagnoni-Munch
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

/**************************** Displayable screens ****************************/

/**
 * contains all screens
 */
screens = {
    /**
     * list of screens
     *
     * either a Screen object
     * or a string, corresponding to another entry in this list
     * (like symbolic links)
     */
    'screens': {},
    /**
     * loads and displays a screen
     *
     * @param String screen name
     * @param String optional URL hash
     * @param mixed do not touch the history (useful for the first page or
     *                                        when the URL is manually changed)
     */
    'load': function(url, hash, nohistory) {
        var element,
            nextdest,
            maincontent,
            url_content;
        if (hash) {
            hash = hash.replace(/^#/,'');
        } else {
            hash = '';
        };
        // If nohistory, change screen no matter what but do not touch history
        // If url != location.pathname, change screen and update history
        if (nohistory || url != location.pathname || hash != location.hash) {
            url_content = screens.screens[url];
            if (typeof url_content == 'string') {
                url_content = screens.screens[url_content];
            };
            if (url_content) {
                if (!nohistory) {
                    screens.previouspath = location.pathname;
                    screens.previoushash = location.hash;
                    if (hash) {
                        history.pushState({}, '', url+'#'+hash);
                    } else {
                        history.pushState({}, '', url);
                    };
                } else if (nohistory == 'cascade') {
                    history.replaceState({}, '', url);
                };
                maincontent = $('maincontent');
                element = url_content.get_element(hash);
                if (element) {
                    screens.currentpath = url;
                    maincontent.update(element);
                    url_content.load(url, hash);
                };
            } else {
                nextdest = url.split('/').slice(0, -1).join('/') || '/';
                if (nohistory) {
                    screens.load(nextdest, hash, 'cascade');
                } else {
                    screens.load(nextdest, hash);
                };
            };
        };
    },
    /**
     * loads the previous screen or '/' if there is no previous screen
     */
    'back': function() {
        if (screens.previouspath) {
            screens.load(screens.previouspath, screens.previoushash);
        } else {
            screens.load('/');
        };
    },
    /**
     * adds a displayable screen
     *
     * @param Screen or RemoteScreen new screen
     */
    'add': function(screen) {
        this.screens[screen.url] = screen;
    },
};

/**
 * resizes the main content div to fill the screen
 */
function resize_maincontent_and_sidebar() {
    $('maincontent').setHeight(
        $(window).size().y - $('maincontainer')._.offsetTop - 10
    );
    $('sidebar').setHeight(
        $(window).size().y - $('sidebar')._.offsetTop
    );
};

init.on('end', function() {
    // Load the screen
    screens.load(location.pathname, location.hash, true);
    $(window).on('popstate', function() {
        if (screens.currentpath != location.pathname) {
            screens.load(location.pathname, location.hash, true);
        };
    });
    $(window).on('hashchange', function() {
        screens.load(location.pathname, location.hash, true);
    });
    // Resize the content
    resize_maincontent_and_sidebar();
    $(window).onResize(resize_maincontent_and_sidebar);
});

/**
 * a screen
 */
Screen = new Class({
    /**
     * url of this screen
     */
    url: '',
    /**
     * returns the element representing the screen (create it if necessary)
     *
     * @param String optional URL hash (used by remote screens, see below)
     * @return mixed element (or list of elements) representing the screen
     */
    get_element:function(hash) {
        if (!this.the_element) {
            this.the_element = this.element()
        };
        return this.the_element;
    },
    /**
     * creates the element representing the screen
     *
     * @return mixed element (or list of elements) representing the screen
     */
    element:function() {
        return new Element('span');
    },
    /**
     * loads or updates initial data for this screen
     *
     * @param String URL of the page
     * @param String hash of the page
     */
    load:function(url, hash) {
    }
});

RemoteScreen = new Class({
    /**
     * initializes a remote screen
     *
     * @param String URL of the screen
     * @param String name of the screen file (without path, without extension)
     */
    initialize: function (url, remotescreen) {
        this.url = url;
        this.remotescreen = remotescreen;
    },
    /**
     * loads and displays the remote screen
     */
    get_element:function(hash) {
        Xhr.load(scripts_url+this.remotescreen+'.js', {
            onSuccess: function() {
                screens.load(this.url, hash, true);
            }.bind(this),
            onFailure: function() {
                popup(_('Failed to load screen'), true);
            }
        });
    }
});

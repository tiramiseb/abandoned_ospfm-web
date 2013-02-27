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

/**************************** Initialization stuff ***************************/

/**
 * information on initialization and actions afterwards
 */
init = new Observer();
init.count = 0;
// Small hack in order to tell when directly loading the settings screen
init.loaded_on_settings = false;
// Use init.start and init.success when something needs to be initialized and
// may be needed by other parts of the interface, ie. the username
init.start = function(func) {
    this.count++;
    // The 5ms delay allows starting all initializers before the first one
    // end (without the delay, functions may be started in order and init.count
    // may be set to 1 when first initializer starts and then to 0 when it ends
    // even before other initializers are launched
    func.delay(5);
};
init.success = function() {
    init.count--;
    if (init.count == 0) {
        // When initialization is finished, close the "Loading..." dialog
        close_dialog();
        this.fire('end');
        if (this.first_run) {
            welcome_dialog();
        };
    };
}
init.failed = function() {
    var errormessage = new Element('span', {
        'class':'error',
        'html':_('Sorry, a problem occured. Please try again later...')
    });
    init.count = -100;
    dialog(errormessage, false);
}

init.on('browserlocaleloaded', function() {
    $('loadingdialogtext').update(_('Loading...'));
});

init.on('go', function() {
    $('spinner').update(_('Loading...'));
    // Small hack in order to tell when directly loading the settings screen
    // (because of the way exiting from settings is done : back in the history)
    if (location.pathname.substr(0, 9) == '/settings') {
        init.loaded_on_settings = true;
    }
});

init.on('end', function() {
    // Display the spinner when loading, only after initialization
    Xhr.Options.spinner = $('spinner');
});

/**
 * displays a dialog for new users
 */
function welcome_dialog() {
    var settingsbutton = new Button('green', 'settings', _('Settings'))
                                .onClick(function() {
                                    screens.load('/settings');
                                    close_dialog();
                                });

    dialog([
        new Element('h1', {'html':_('Welcome!')}),
        new Element('p', {'html':_('Hello, it seems you are connecting to everCount for the first time.')}),
        new Element('p', {'html':_('We recommend setting your account, especially your personal information:')}),
        new Element('ul').insert([
            new Element('li', {'html':_('Your language')}),
            new Element('li', {'html':_('Your first name and your last name')}),
            new Element('li', {'html':_('Your preferred currency')}),
        ]),
        new Element('p', {'html':_('To configure your account, click on the "Settings" button below. You will also find it at the top right of the screen, with the "Help" and "Quit" buttons.')}),
        settingsbutton
    ]);

};

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

/************* Information and buttons at the right of the topbar ************/

init.on('go', function() {
    // init.start and init.success are not needed here
    $('userinfo').insert([
        new Button('green', 'settings')
            .onClick(function() {
                screens.load('/settings');
            })
            .tooltip(_('Settings')),
        new Button('blue', 'help')
            .onClick(function() {
                window.open(help_url, '_blank');
            })
            .tooltip(_('Help')),
        new Button('red', 'logout')
            .onClick(function() {
                authentication.logout();
            })
            .tooltip(_('Quit'))
    ]);
});

init.on('end', function() {
    var displayusername = new Element('span',{
                                'html': ''+user_me,
                                'id': 'displayusername'
                            });
    user_me.on('changed name', function() {
        displayusername.update(''+user_me);
    });
    $('userinfo').insert(displayusername, 'top');
});

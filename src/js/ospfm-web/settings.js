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

/*
init.on('go', function() {
    init.start(function() {
        screens.add(
            new RemoteScreen('/settings', 'ospfm-web-settings')
        );
        init.success();
    });
});
*/

var tempsettingscreen = new Class(Screen, {
    url:'/settings',
    element:function() {
        return new Element('div').insert([
            new Element('p', {'html':_('Sorry, the settings screen is not available in the demo for the moment.')}),
            new Button('blue', 'undo', _('Back')).onClick(function() {
                screens.load('/')
            })
        ])
    }
})

init.on('go', function() {
    init.start(function() {
        screens.add(
            new tempsettingscreen()
        );
        init.success();
    });
});

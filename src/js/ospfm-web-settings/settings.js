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
"use strict";

var SettingsScreen = new Class(Screen, {
    url:'/settings',
    element:function() {
        var tabs = new Tabs(new Element('dl'));

        tabs.add(icon('account')+' '+_('Accounts'), '');
        tabs.add(icon('category')+' '+_('Categories'), '');
        tabs.add(icon('currency')+' '+_('Currencies'), '');
        tabs.add(icon('contact')+' '+_('Contacts'), '');
        tabs.add(icon('widget')+' '+_('Widgets'), '');
        tabs.add(icon('prefs')+' '+_('Preferences and identity'), 'pref, email, reinit');
        tabs.add(icon('password')+' '+_('Change password'), '');


        return [
            new Element('h1', {'html': _('Settings')}),
            tabs
        ]
    },
    load:function() {
    },
});

screens.add(
    new SettingsScreen()
);

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

Preference = new Class(OspfmObject, {
    category: 'preferences',
    key: 'name',
    initialize:function(data) {
        this.$super(data);
        if (this.data.name == 'ospfm-web-locale') {
            this.updatesuccess = function() {
                if (!init.first_run) {
                    location.reload();
                }
            };
        }
    }
});

preferences = new Collection(Preference, false);
preferences.get = function(key) {
    var preference = this.pointers[key];
    if (preference) {
        try {
            return JSON.parse(preference.data.value);
        } catch (error) {
            return preference.data.value;
        }
    } else {
        return undefined;
    };
};
preferences.set = function(key, value) {
    var preference = this.pointers[key];
    if (!preference) {
        preference = new Preference({'name': key});
        preferences.add(preference);
    }
    preference.update({'value': JSON.stringify(value)});
}

init.on('browserlocaleloaded', function() {
    api_read('preferences', function(data) {
        data.forEach(function(pref) {
            preferences.add(new Preference(pref));
        });
        preferences.fire('initialized');
    }, function() {
        init.failed();
    });
});

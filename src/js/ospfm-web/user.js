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

/****************************** User information *****************************/

User = Class(OspfmObject, {
    category: 'users',
    key: 'username',
    toString: function() {
        return loc_nameandnick(
            this.data.first_name,
            this.data.last_name,
            this.data.username
        )
    },
    updatesuccess:function(data) {
        var namechanged = false;
        // Name
        if (data.first_name && data.first_name != this.data.first_name) {
            this.data.first_name = data.first_name;
            namechanged = true;
        }
        if (data.last_name && data.last_name != this.data.last_name) {
            this.data.last_name = data.last_name;
            namechanged = true;
        }
        if (data.username && data.username != this.data.username) {
            this.data.username = data.username;
            namechanged = true;
        }
        if (namechanged) {
            this.fire('changed name');
        }
        // Preferred currency
        if (
            data.preferred_currency &&
            data.preferred_currency != this.data.preferred_currency
        ) {
            this.data.preferred_currency = data.preferred_currency;
            this.fire('changed currency');
        }
        // Email addresses
        if (data.emails && data.emails != this.data.emails) {
            this.data.emails = data.emails;
            this.fire('changed emails');
        }
        return _('Updated personal information');
    },
    updatefailed:function() {
        return _('Error updating personal information');
    },
    /**
     * user's first name
     *
     * @return String first name
     */
    first_name:function() {
        return this.data.first_name;
    },
    /**
     * user's last name
     *
     * @return String last name
     */
    last_name:function() {
        return this.data.last_name;
    },
    preferred_currency:function() {
        return this.data.preferred_currency;
    }
});

user_me = new User({'username': 'me'});

/**
 * reads user information at initialization
 */
init.on('go', function() {
    init.start(function() {
        api_read('users', 'me', function(data) {
            user_me.initialize(data);
            init.success();
        }, function() {
            init.failed();
        });
    });
});

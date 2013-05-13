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

ContactNameField = new Class(Field, {
    display: function() {
        return this.$super(
            loc_nameandnick(
                this.object.data.first_name,
                this.object.data.last_name,
                this.object.data.username
            )
        )
    },
    input: function() {
        var content;
        if (this.object.data.username) {
            content = this.display();
            content.insert(
                //~new Element('input', {
                new Input({
                    'type': 'hidden',
                    'name': 'username',
                    'value': this.object.data.username
                })
            );
        } else {
            content = this.$super(this.makeinput());
            this.contentspan = content.children()[1];
        }
        return content;
    },
    updateinput: function() {
        this.contentspan.update(this.makeinput());
    },
    makeinput: function() {
        var btn,
            content;
        if (this.selectedvalue) {
            btn = new Button('blue', 'search').tooltip(_('Search'));
            content = [
                btn,
                new Element('span', {'html':this.selectedvalue[1]}),
                new Input({
                    'type': 'hidden',
                    'name': 'username',
                    'value': this.selectedvalue[0]
                })
            ];
        } else {
            content = btn = new Button('blue', 'search', _('Search'))
                                    .setStyle('width', '90%');
        };
        btn.onClick(function() {
            var resultslist = new Element('div');
            dialog([
                new Element('h1', {'html':_('Search a contact')}),
                new Element('p', {'html':_(
                    'You can search an email address or a name.'
                )}),
                new Element('form').insert([
                    new Input({'name':'criterion'}),
                    new Button('green', 'search', _('Search'), 'submit')
                ]).onSubmit(function(event) {
                    var criterion = event.currentTarget.values().criterion,
                        parameters;
                    event.preventDefault();
                    if (criterion) {
                        parameters = { key: authentication.key };
                        Xhr.load(api_url+'users/search/'+criterion, {
    params: parameters,
    // Indentation is not respected because of the deepness of this stuff...
    onSuccess: function(request) {
        var results = [];
        // Display users who are not already in the contacts list
        request.responseJSON.response.forEach(function(result) {
            if (!contacts.get(result.username)) {
                results.push(result)
            };
        });
        resultslist.clean();
        if (results.length) {
            results.forEach(function(result) {
                var fullname = loc_nameandnick(
                                    result.first_name,
                                    result.last_name,
                                    result.username
                                );
                resultslist.insert(new Element('div').insert([
                    new Button('green', 'accept')
                        .tooltip(_('Add this contact'))
                        .set('nameinfo', [result.username, fullname])
                        .onClick(function(event) {
                            this.selectedvalue= event.currentTarget._.nameinfo;
                            this.updateinput();
                            close_dialog();
                        }.bind(this)),
                    new Element('span', {'html':fullname})
                ]));

            }, this);
        } else {
            resultslist.insert(_('No result found'));
        };
    }.bind(this),
    onFailure: function() {
        popup(_('Error while loading search results'), true);
    }
                        });
                    } else {
                        popup(_('Search criterion cannot be emtpy'), true);
                    };
                }.bind(this)),
                resultslist,
                new Element('div', {'class':'bottombuttons'}).insert([
                        new Button('blue', 'close', _('Close'))
                            .onClick(function() { close_dialog() })
                    ])
            ])
        }.bind(this));
        return content;
    }
});

Contact = new Class(OspfmObject, {
    category: 'contacts',
    key: 'username',
    initialize: function(data) {
        this.$super(data);
        this.fields = {
            'fullname': new ContactNameField(this, 'fullname', _('Full name')),
            'comment': new StringField(this, 'comment', _('Comment'), null,
                                       null, null, 100)
        };
    },
    toString: function() {
        return loc_nameandnick(
            this.data.first_name,
            this.data.last_name,
            this.data.username
        )
    },
    createsuccess:function() {
        delete this.fields.fullname.selectedvalue;
        this.fields.fullname.updateinput();
        return _('Created contact');
    },
    createfailed:function() { return _('Error creating contact'); },
    updatesuccess:function() { return _('Updated contact'); },
    updatefailed:function() { return _('Error updating contact'); },
    deletesuccess:function() { return _('Deleted contact'); },
    deletefailed:function() { return _('Error deleting contact'); },
});

contacts = new Collection(Contact, true, 'username', true, true);

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
            // A contact name cannot be modified
            content = this.display();
            content.insert(
                new Input({
                    'type': 'hidden',
                    'name': 'username',
                    'value': this.object.data.username
                })
            );
        } else {
            content = this.$super(new Input({
                'name': this.id,
                'placeholder': _('Name, nickname or email'),
                'maxlength': 255,
                'value': this.value() || ''
            }));
        };
        return content;
    }
});

Contact = new Class(OspfmObject, {
    category: 'contacts',
    key: 'username',
    initialize: function(data) {
        this.$super(data);
        this.fields = {
            'fullname': new ContactNameField(this, 'fullname', _('Name')),
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
    create:function(data) {
        Xhr.load(api_url+'users/search/'+data.fullname, {
            params: { key: authentication.key },
            onSuccess: function(request) {
                var inviteform,
                    resultsdisplaylist,
                    emailinput     = new Input({
                                            'id': 'invite_address',
                                            'name': 'address',
                                            'placeholder':_('Email address'),
                                        }),
                    langinput      = new Element('select', {
                                            'id': 'invite_language',
                                            'name': 'language'
                                        }),
                    nameinput      = new Input({
                                            'id': 'invite_name',
                                            'name': 'name',
                                            'placeholder':_('Name'),
                                        }),
                    resultsdisplay = new Element('div', {
                                                'class': 'contactsearchlist'}),
                    results = [];
                // Extract users who are not already in the contacts list
                request.responseJSON.response.forEach(function(result) {
                    if (!contacts.get(result.username)) {
                        results.push(result)
                    };
                });
                if (results.length) {
                    resultsdisplaylist = new Element('table');
                    results.forEach(function(result) {
                        resultsdisplaylist.insert(
                            new Element('tr').insert([
                                new Element('td', {
                                        'class':'nowrap'
                                    }).insert(
                                    loc_nameandnick(
                                        result.first_name,
                                        result.last_name,
                                        result.username
                                    )
                                ),
                                new Element('td').insert(
                                    new Button('green', 'add',
                                               _('Add this person'))
                                        .onClick(function() {
                                            data.username = result.username;
                                            console.log(data);
                                            close_dialog();
                                            this.$super(data);
                                        }.bind(this))
                                )
                            ])
                        );
                    }.bind(this));
                    resultsdisplay.insert([
                        new Element('p').insert(
                           _('"%NAME%" matches the following people:').replace(
                                                       '%NAME%', data.fullname)
                        ),
                        resultsdisplaylist,
                        new Element('p', {
                            'html': _('If the person you are looking for is not in this list, you may invite her/him.')
                        })
                    ])
                } else {
                    resultsdisplay.insert([
                        new Element('p', {
                            'html': _('"%NAME%": No matching user').replace(
                                                       '%NAME%', data.fullname)
                        }),
                        new Element('p', {
                            'html': _('Do you want to send an invitation?')
                        })
                    ]);
                };
                Xhr.load('/shortlocales', {
                    onSuccess: function(response) {
                        response.responseJSON.locales.forEach(function(loc) {
                            var option = new Element('option', {
                                            'value': loc
                                        }).insert(
                                            l10n_locales[loc]
                                        );
                            if (loc == locale.shortform) {
                                option._.defaultSelected = true;
                            };
                            langinput.insert(option);
                        });
                    }
                });
                inviteform = new Form({
                    'method': 'POST',
                    'action': '/invite',
                    'id': 'inviteuser'
                }).insert([
                    new Element('p', {
                        'class': 'nowrap',
                        'html':
                            _('To invite someone, please provide the following information:')
                    }),
                    new Element('label', {
                        'for': 'invite_name',
                        'html':
                            _('Name')
                    }),
                    nameinput,
                    new Element('label', {
                        'for': 'invite_address',
                        'html':
                            _('Email address')
                    }),
                    emailinput,
                    new Element('label', {
                        'for': 'invite_language',
                        'html':
                            _('Language')
                    }),
                    langinput,
                    new Input({
                        'type': 'hidden',
                        'name': 'sentby',
                        'value': user_me.toString()
                    }),
                    new Button('blue', 'contact',
                               _('Send an invitation'), 'submit')
                ]).remotize({
                    onComplete: function(event) {
                        dialog(event.responseText);
                    }
                });
                if (data.fullname.includes('@')) {
                    emailinput.setValue(data.fullname);
                    nameinput.setValue(data.fullname.split('@')[0]);
                } else {
                    nameinput.setValue(data.fullname);
                };
                resultsdisplay.insert([
                    new Element('hr'),
                    inviteform
                ])
                dialog(resultsdisplay)
            }.bind(this),
            onFailure: function(request) {
                var errormessage = request.responseJSON.details ||
                                       _('Error while loading search results');
                popup(_(errormessage), true);
            }
        });
    },
    createsuccess:function() { return _('Created contact'); },
    createfailed:function() { return _('Error creating contact'); },
    updatesuccess:function() { return _('Updated contact'); },
    updatefailed:function() { return _('Error updating contact'); },
    deletesuccess:function() { return _('Deleted contact'); },
    deletefailed:function() { return _('Error deleting contact'); },
});

contacts = new Collection(Contact, true, 'username', true, true);

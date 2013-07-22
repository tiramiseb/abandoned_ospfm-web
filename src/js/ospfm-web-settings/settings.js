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
        var widgets_loading_delay,
            in_widgets_settings_section,
            tabs                 = new Tabs(new Element('dl')),
            accounts_settings    = accounts.htmledit(
                                        ['name', 'currency', 'start_balance']),
            categories_settings  = categories.htmledit(['name', 'currency']),
            currencies_settings  = new Element('div').insert([
                                        new Element('p', {
                                            'html':_('Custom currencies allow you to manage other payment means: vouchers, etc.')
                                        }),
                                        own_currencies.htmledit(
                                                    ['name', 'symbol', 'rate'])
                                    ]),
            contacts_settings    = contacts.htmledit(['fullname', 'comment']),
            preferences_settings = new Element('div'),
            password_settings    = new Form(),
            widgets_settings     = new Element('div'),            currentpasswordinput = new Input({
                                            'type': 'password',
                                            'name': 'currentpassword',
                                            'id': 'pref_currentpassword',
                                            'placeholder':_('Current password')
                                        }),
            passwordinput        = new Input({
                                            'type': 'password',
                                            'name': 'password',
                                            'id': 'pref_password',
                                            'placeholder':
                                                      _('Minimum 8 characters')
                                        }),
            passwordconfirminput = new Input({
                                            'type': 'password',
                                            'name': 'passwordconfirm',
                                            'id': 'pref_confirmpassword',
                                            'placeholder':_('Confirm password')
                                        }),
            firstnameinput       = new Input({'id':'pref_firstname',
                                           'placeholder': _('Your first name'),
                                           'value': user_me.first_name()}),
            lastnameinput        = new Input({'id':'pref_lastname',
                                            'placeholder': _('Your last name'),
                                            'value': user_me.last_name()}),
            currency_select      = global_currencies.htmlselect(
                                            user_me.preferred_currency(),
                                            'currency'
                                        ).set('id','pref_currency'),
            language_select      = new Element('select'),
            cur_lang_button      = new Button('blue', 'ok',
                                   _('Nothing to change'), 'submit').disable(),
            cur_lang_form        = new Form(),
            change_currency      = false,
            change_language      = false,
            emails_container     = new Element('div'),
            unused_widgets       = new Element('ul', {'id':'unusedwidgets'});

        ////////////////////////////////////////////////////////////// Password

        password_settings.insert(
            new Element('table', {'id':'password_settings'}).insert([
                new Element('tr').insert([
                        new Element('td').insert(
                            new Element('label',{'html':_('Current password')})
                                .set('for', 'pref_currentpassword')
                        ),
                        new Element('td').insert(currentpasswordinput)
                ]),
                new Element('tr').insert([
                        new Element('td').insert(
                            new Element('label',{'html':_('New password')})
                                .set('for', 'pref_password')
                        ),
                        new Element('td').insert(passwordinput)
                ]),
                new Element('tr').insert([
                        new Element('td').insert(
                            new Element('label',{'html':_('Confirm password')})
                                .set('for', 'pref_confirmpassword')
                        ),
                        new Element('td').insert(passwordconfirminput)
                ]),
                new Element('tr').insert(
                    new Element('td', {'colspan': '2'}).insert(
                      new Button('green', 'ok', _('Change password'), 'submit')
                    )
                )
            ])
        ).onSubmit(function(event) {
            var values = event.currentTarget.values(),
                password = values.password,
                currentpassword = values.currentpassword;
            event.preventDefault();
            if (password != values.passwordconfirm) {
                popup(_('Please enter the same password in "New password" and "Confirm password"'), true);
            } else if (currentpassword == '') {
                popup(_('The current password cannot be empty'), true);
            } else if (password == '') {
                popup(_('The new password cannot be empty'), true);
            } else {
                user_me.update({
                    'password': password,
                    'currentpassword': currentpassword
                }, function() {
                    authentication.password = password;
                });
            };
        });



        /////////////////////////////////////////////////////////// Preferences

        ////////// First name and last name
        function save_firstname() {
            var newvalue = firstnameinput.getValue();
            if (newvalue != user_me.first_name()) {
                user_me.update({'first_name': newvalue});
            };
        };
        function save_lastname() {
            var newvalue = lastnameinput.getValue();
            if (newvalue != user_me.last_name()) {
                user_me.update({'last_name': newvalue});
            };
        };
        firstnameinput.onBlur(save_firstname).onKeypress(function(event) {
            // The "enter" key
            if (event.keyCode == 13) { save_firstname() }
        })
        lastnameinput.onBlur(save_lastname).onKeypress(function(event) {
            // The "enter" key
            if (event.keyCode == 13) { save_lastname() }
        })

        ////////// Preferred currency and language
        // Stuff to manage currencies and language
        Xhr.load('/locales', {
            onSuccess: function(response) {
                response.responseJSON.locales.forEach(function(loc) {
                    var option = new Element('option', {
                                    'value': loc
                                }).insert(
                                    l10n_locales[loc]
                                );
                    if (loc == locale.full) {
                        option._.defaultSelected = true;
                    };
                    language_select.insert(option);
                });
            }
        });
        function change_cur_lang_button() {
            var content = '';
            if (change_currency && change_language) {
                content = _('Change currency and language, then reload')
            } else if (change_currency) {
                content = _('Change currency')
            } else if (change_language) {
                content = _('Change language, then reload')
            };
            if (content == '') {
                cur_lang_button.disable()
                    .first('.buttontext').html(_('Nothing to change'));
            } else {
                cur_lang_button.enable()
                    .first('.buttontext').html(content);
            };
        };
        currency_select.onChange(function() {
            var newvalue = currency_select.first('select').getValue();
            if (newvalue == user_me.preferred_currency()) {
                change_currency = false;
            } else {
                change_currency = true;
            };
            change_cur_lang_button();
        });
        language_select.onChange(function() {
            var newvalue = language_select.getValue();
            if (newvalue == locale.full) {
                change_language = false;
            } else {
                change_language = true;
            };
            change_cur_lang_button();
        });
        cur_lang_form.onSubmit(function(event) {
            var newcurrency = currency_select.first('select').getValue(),
                newlanguage = language_select.getValue();
            event.preventDefault();
            if (newcurrency != user_me.preferred_currency()) {
                user_me.update({
                    'preferred_currency': newcurrency
                });
            };
            if (newlanguage != locale.full) {
                // TODO Maybe a dialog window to tell "Demo accounts
                // languages cannot be changed (or maybe this window will be
                // generated automatically from the response from the server)
                preferences.set('ospfm-web-locale', newlanguage);
            };
            cur_lang_button.disable()
                .first('.buttontext').html(_('Nothing to change'));
        });
        // Function generation the emails table
        function emails_table() {
            var emailinput = new Input({'placeholder':_('New email address')}),
                table = new Element('div', {'class': 'editobjects'}).insert(
                            new Element('div', {'class': 'titlerow'}).insert(
                                new Element('span', {
                                    'class': 'editcell emailaddress',
                                    'html': _('Email address')
                                })
                            )
                        );
            user_me.data.emails.forEach(function(email) {
                var buttonscell = new Element('span', {'class':'buttonscell'});
                // Address cell
                table.insert(new Element('div', {'class': 'editrow'}).insert([
                    new Element('span', {
                        'class': 'editcell emailaddress',
                        'html': email['address']
                    }),
                    buttonscell
                ]));
                // Confirmation or notification button
                if (email.confirmed) {
                    if (email.notification) {
                        buttonscell.insert(
                            new Button('green', 'mail').tooltip(_('Notifications are sent to this address.<br>Click here to stop sending notification to this address.')).onClick(function() {
                                user_me.update({
                                    'emails': JSON.stringify(
                                      {'disablenotifications':[email.address]})
                                }, function() {
                                    emails_container.update(emails_table());
                                });
                            })
                        )
                    } else {
                        buttonscell.insert(
                            new Button('red', 'mail').tooltip(_('Notifications are not sent to this address.<br>Click here to send notification to this address.')).onClick(function() {
                                user_me.update({
                                    'emails': JSON.stringify(
                                       {'enablenotifications':[email.address]})
                                }, function() {
                                    emails_container.update(emails_table());
                                });
                    })
                        )
                    };
                } else {
                    buttonscell.insert(
                        new Button('red', 'ok').tooltip(_('You should confirm this email address by<br>answering to the email that has been sent to you.<br>Click here to re-send this email.'))
                        // XXX Re-send email
                    )
                };
                // Delete button
                buttonscell.insert(
                    new Button('red', 'delete').tooltip(_('Remove this email address')).onClick(function() {
                        user_me.update({
                            'emails': JSON.stringify({'remove':
                                                              [email.address]})
                        }, function() {
                            emails_container.update(emails_table());
                        });
                    })
                )
            });
            table.insert(
                new Form().insert(
                    new Element('div', {'class':'editrow'}).insert([
                        new Element('span', {'class':
                                              'editcell emailaddress'}).insert(
                            emailinput
                        ),
                        new Element('span', {'class':'buttonscell'}).insert(
                            new Button('blue', 'add', _('Add'), 'submit')
                        )
                    ])
                ).onSubmit(function(event) {
                    event.preventDefault();
                    user_me.update({
                        'emails': JSON.stringify({'add':
                                                      [emailinput.getValue()]})
                    }, function() {
                        emails_container.update(emails_table());
                    });
                })
            )
            return table;
        }
        emails_container.insert(emails_table());

        // Insert settings into screen
        preferences_settings.insert([
            // Name
            new Element('table', {'id':'name_settings'}).insert([
                new Element('tr').insert([
                    new Element('th').insert(
                        new Element('label', {'html': _('First name'),
                                                       'for':'pref_firstname'})
                    ),
                    new Element('th').insert(
                        new Element('label', {'html': _('Last name'),
                                                        'for':'pref_lastname'})
                    )
                ]),
                new Element('tr').insert([
                    new Element('td').insert(firstnameinput),
                    new Element('td').insert(lastnameinput)
                ])
            ]),
            new Element('hr'),
            // Currency and language
            cur_lang_form.insert(
                new Element('table', {'id':'cur_lang_settings'}).insert([
                    new Element('tr').insert([
                        new Element('th').insert(
                            new Element('label', {'html': _('Preferred currency'),
                                                        'for':'pref_currency'})
                        ),
                        new Element('th').insert(
                            new Element('label', {'html': _('Language'),
                                                          'for':'pref_locale'})
                        )
                    ]),
                    new Element('tr').insert([
                        new Element('td').insert(currency_select),
                        new Element('td').insert(language_select)
                    ]),
                    new Element('tr').insert(
                        new Element('td', {'colspan':'2'}).insert(
                            cur_lang_button
                        )
                    )
                ])
            ),
            new Element('hr'),
            // Emails
            emails_container,
            new Element('hr'),
            // Reinitialization
            new Element('p', {
                'class':'centered',
                'html':_('You can flush and reinitialize your data and re-run the initial wizard by clicking on this button:')
            }),
            new Element('div', {'class':'centered'}).insert(
                new Button('red', 'cancel', _('Reinitialize everything'))
                .onClick(function() {
                    dialog([
                        new Element('h1', {'html':_('Really reinitialize?')}),
                        new Element('p', {
                            'class': 'nowrap',
                            'html':_('Do you really want to reinitialize your everCount data?')
                        }),
                        new Element('p', {'html':_('Everything will be erased: accounts, categories, transactions... You will not be able to recover anything of these.')}),
                        new Button('red','ok', _('Yes, erase and reinitialize my data')).addClass('confirm')
                            .onClick(wizard)
                    ])
                })
            )
        ])

        /////////////////////////////////////////////////////////////// Widgets

        //widgets_settings

        widgets_loading_delay = function () {
            // Slight delay when displaying unused widgets so the "init" part
            // in widgets.js has enough time to remove used widgets from
            // widgets.unused, when loading this page first
            widgets.unused.forEach(function(widget) {
                unused_widgets.insert(widgets.get(widget));
            });
        }.delay(10);
        widgets_settings.insert([
            new Element('p', {
                'class':'centered',
                'html': _('Drag and drop widgets between this "unused widgets" list, the the left and on top of the screen.')
            }),
            unused_widgets
        ]);

        tabs.onSelect(function(event) {
            if (event.target.id == 'widgets_settings') {
                start_move_widgets();
                in_widgets_settings_section = true;
            } else if (in_widgets_settings_section) {
                end_move_widgets();
                in_widgets_settings_section = false;
            };
        });

        screens.on('loaded', function(url) {
            if (url == '/settings' && widgets_settings._.clientHeight > 0) {
                start_move_widgets();
                in_widgets_settings_section = true;
            } else if (in_widgets_settings_section) {
                end_move_widgets();
                in_widgets_settings_section = false;
            };
        });

        //////////////////////////////////////////////////// Display everything
        tabs.add(icon('account')+' '+_('Accounts'), accounts_settings)
            .add(icon('category')+' '+_('Categories'), categories_settings)
            .add(icon('currency')+' '+_('Currencies'), currencies_settings)
            .add(icon('contact')+' '+_('Contacts'), contacts_settings)
            .add(icon('password')+' '+_('Change password'), password_settings)
            .add(icon('prefs')+' '+_('Preferences and identity'),
                                                          preferences_settings)
            .add(icon('widget')+' '+_('Widgets'), widgets_settings,
                                                    {'id':'widgets_settings'});
        return [
            new Element('h1', {'html': _('Settings')}),
            tabs
        ]
    },
    load:function() {
    },
});

// XXX TODO Resolve display bugs (select all text, etc)
function start_move_widgets() {
    // XXX TODO Display stuff only if it does not already exist
    var side_widgets   = $('sidewidgets'),
        top_widgets    = $('topwidgets'),
        unused_widgets = $('unusedwidgets'),
        side_movable   = new Sortable({'handleCss':'span.widgethandle'})
                            .set('id', 'sidewidgets'),
        top_movable    = new Sortable({'handleCss':'span.widgethandle'})
                            .set('id', 'topwidgets'),
        unused_movable = new Sortable({'handleCss':'span.widgethandle'})
                            .set('id', 'unusedwidgets');
    //~// Add handle
    $$('span.widgeticon').each(function(element) {
        element.parent().insert(
            new Icon('move').addClass('widgethandle'),
            'before'
        )
    });
    // Make side widgets movable
    side_widgets.children().each(function(element) {
        side_movable.insert(element);
    });
    side_movable.insert(new Element('li', {'class': 'placeholderwidget'}));
    side_widgets.replace(side_movable);
    // Make top widgets movable
    top_widgets.children().each(function(element) {
        top_movable.insert(element);
    });
    top_movable.insert(new Element('li', {'class': 'placeholderwidget'}));
    top_widgets.replace(top_movable);
    // Make unused widgets movable
    unused_widgets.children().each(function(element) {
        unused_movable.insert(element);
    });
    unused_movable.insert(new Element('li', {'class': 'placeholderwidget'}));
    unused_widgets.replace(unused_movable);
    // Make widgets movable between lists
    side_movable.setOptions({'accept':[top_movable, unused_movable]});
    top_movable.setOptions({'accept':[side_movable, unused_movable]});
    unused_movable.setOptions({'accept':[side_movable, top_movable]});
};

function end_move_widgets() {
    // XXX TODO May be simplified ?
    var side_movable   = $('sidewidgets'),
        top_movable    = $('topwidgets'),
        unused_movable = $('unusedwidgets'),
        side_result    = [],
        top_result     = [],
        side_widgets   = new Element('ul').set('id', 'sidewidgets'),
        top_widgets    = new Element('ul').set('id', 'topwidgets'),
        unused_widgets = new Element('ul').set('id', 'unusedwidgets');
    // Save the new positions for side widgets
    side_movable.children().each(function(element) {
        var id = element.get('id');
        if (id && id.indexOf('widget-') == 0) {
            side_result.push(id.split('-')[1]);
        }
    });
    preferences.set('ospfm-web-sidewidgets', side_result);
    // Save the new positions for top widgets
    top_movable.children().each(function(element) {
        var id = element.get('id');
        if (id && id.indexOf('widget-') == 0) {
            top_result.push(id.split('-')[1]);
        }
    });
    preferences.set('ospfm-web-topwidgets', top_result);
    // Remove handle
    $$('span.widgethandle').each('remove');
    // Side widgets not movable anymore
    side_movable.children('.widget').each(function(element) {
        side_widgets.insert(element);
    });
    side_movable.replace(side_widgets);
    // Top widgets not movable anymore
    top_movable.children('.widget').each(function(element) {
        top_widgets.insert(element);
    });
    top_movable.replace(top_widgets);
    // Unused widgets not movable anymore
    unused_movable.children('.widget').each(function(element) {
        unused_widgets.insert(element);
    });
    unused_movable.replace(unused_widgets);
};



screens.add(
    new SettingsScreen()
);

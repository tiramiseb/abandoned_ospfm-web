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

wizard = function(firstrun) {
    var cancelbutton  = new Button('blue', 'cancel', _('Cancel')),
        localesinput  = new Element('select', {'id': 'wizardlocale',
                                               'name': 'locale'}),
        currentlocale = preferences.get('ospfm-web-locale') || locale.full,
        currencyinput = global_currencies.htmlselect(
                                            user_me.preferred_currency(),
                                            'currency'
                                        ).set('id','wizardcurrency'),
        wizardtitle   = new Element('h2', {'html': _('Data creation wizard')});
    Xhr.load('/locales', {
        onSuccess: function(response) {
            response.responseJSON.locales.forEach(function(loc) {
                var option = new Element('option', {
                                'value': loc
                            }).insert(
                                l10n_locales[loc]
                            );
                if (loc == currentlocale) {
                    option._.defaultSelected = true;
                };
                localesinput.insert(option);
            });
        }
    });
    cancelbutton.onClick(close_dialog);
    dialog(
        new Element('div', {'id':'wizard'}).insert(
            new Form().insert([
                new Element('h1', {'html':_('Initialization wizard')}),
                new Element('p', {'html':_('Please fill in the following fields in order to initialize your everCount data:')}),
                new Element('table').insert([
                    new Element('tr').insert([
                        new Element('td', {'colspan': '2'}).insert(
                            new Element('h2', {'html':
                                               _('Identity and preferences')})
                        ),
                    ]),
                    new Element('tr').insert([
                        new Element('td').insert(
                            new Element('label', {
                                'for':'wizardfirstname',
                                'html':_('Your first name:')
                            })
                        ),
                        new Element('td').insert(
                            new Input({'id':'wizardfirstname',
                                       'name':'firstname',
                                       'value': user_me.first_name()})
                        )
                    ]),
                    new Element('tr').insert([
                        new Element('td').insert(
                            new Element('label', {
                                'for':'wizardlastname',
                                'html':_('Your last name:')
                            })
                        ),
                        new Element('td').insert(
                            new Input({'id':'wizardlastname',
                                       'name':'lastname',
                                       'value': user_me.last_name()})
                        )
                    ]),
                    new Element('tr').insert([
                        new Element('td').insert(
                            new Element('label', {
                                'for':'wizardlocale',
                                'html':_('Interface language:')
                            })
                        ),
                        new Element('td').insert(
                            localesinput
                        )
                    ]),
                    new Element('tr').insert([
                        new Element('td').insert(
                            new Element('label', {
                                'for':'wizardcurrency',
                                'html':_('Your preferred currency:')
                            })
                        ),
                        new Element('td').insert(
                            currencyinput
                        )
                    ]),
                    new Element('tr').insert([
                        new Element('td', {'colspan': '2'}).insert(
                            wizardtitle
                        ),
                    ]),
                    new Element('tr').insert([
                        new Element('td').insert(
                            new Input({'type': 'radio', 'value':'basic',
                                       'id':'wizardbasic', 'name':'wizard'})
                        ),
                        new Element('td').insert(
                            new Element('label',{'for':'wizardbasic'}).insert([
                                new Element('p', {
                                    'class': 'wizardname',
                                    'html':_('Basic elements')
                                }),
                                new Element('p', {
                                    'class':'description',
                                    'html':_('When you choose this option, some basic elements will be created for you: a bank account, a wallet account, usual categories... This option is for people who want to use everCount rapidly, with some initial help.')
                                })
                            ])
                        )
                    ]),
                    new Element('tr').insert([
                        new Element('td').insert(
                            new Input({'type': 'radio', 'value':'empty',
                                       'id':'wizardempty', 'name':'wizard'})
                        ),
                        new Element('td').insert(
                            new Element('label',{'for':'wizardempty'}).insert([
                                new Element('p',{
                                    'class': 'wizardname',
                                    'html':_('Empty data')
                                }),
                                new Element('p', {
                                    'class':'description',
                                    'html':_('When you choose to create an empty everCount account, you will have to create everything by yourself: accounts, categories, etc. This option is for people who already know how to use a financial application and who know exactly what they want to do.')
                                })
                            ])
                        )
                    ]),
                    new Element('tr').insert([
                        new Element('td').insert(
                            new Input({'type': 'radio', 'value':'demo',
                                       'id':'wizarddemo', 'name':'wizard'})
                        ),
                        new Element('td').insert(
                            new Element('label', {'for':'wizarddemo'}).insert([
                                new Element('p', {
                                    'class': 'wizardname',
                                    'html':_('Demo elements')
                                }),
                                new Element('p', {
                                    'class':'description',
                                    'html':_('With this option, multiple elements will be created, simulating an already-used everCount account: accouts, categories, transactions, etc. This option is for people who want to discover everCount and all its features.')
                                })
                            ])
                        )
                    ]),
                ]),
                new Element('div', {'class':'bottombuttons'}).insert([
                    new Button('green','apply',_('Initialize everCount'),'submit'),
                    cancelbutton
                ])
            ]).onSubmit(function(event) {
                var values    = event.currentTarget.values(),
                    newlocale = values.locale,
                    wizard    = values.wizard,
                    currency  = values.currency;
                event.preventDefault();
                if (!wizard) {
                    if (wizardtitle.nextSiblings().length == 0) {
                        wizardtitle.insert(
                            new Element('span', {
                                'class':'error',
                                'html':_('Please choose a wizard type')
                            }),
                            'after'
                        )
                    };
                    return false;
                };
                user_me.update({
                'first_name': values.firstname,
                'last_name': values.lastname,
                'preferred_currency': currency
                })
                api_read('wizard', values.wizard+'/'+newlocale+'/'+currency, function() {
                    if (firstrun || (newlocale != locale.full)) {
                        dialog([
                            new Element('h1', {
                                'html':_('Initialization successful')
                            }),
                            new Element('p', {
                                'html':_('Your account has been (re)initialized successfully.')
                            }),
                            new Element('p', {
                                'html':_('everCount will be reloaded to reinitialize the interface.')
                            }),
                            new Element('div',{'class':'bottombuttons'}).insert(
                                new Button('green', 'apply', _('OK'))
                                    .onClick(function() {
                                        preferences.set('ospfm-web-locale',
                                                        newlocale);
                                    })
                            )
                        ])
                    } else {
                        dialog([
                            new Element('h1', {
                                'html':_('Initialization successful')
                            }),
                            new Element('p', {
                                'html':_('Your account has been (re)initialized successfully.')
                            }),
                            new Element('p', {
                                'html':_('everCount will be reloaded to reinitialize the interface.')
                            }),
                            new Element('div',{'class':'bottombuttons'}).insert(
                                new Button('green', 'apply', _('OK'))
                                    .onClick(function() {
                                        location.reload()
                                    })
                            )
                        ])
                    }
                });
            })
        )
    )
};

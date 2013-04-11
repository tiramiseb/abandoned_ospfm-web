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

Widget = new Class(Element, {
    prebind: ['redraw'],
    initialize: function() {
        var titletext = new Element('span', {
                            'class': 'name',
                            'html': this.title()
                        }).onClick(this.displayhide.bind(this)),
            title = new Element('h1').insert([
                        titletext
                    ]);
        this.$super('li', {'class':'widget', 'id':'widget-'+this.id});
        this.icon = new Icon(this.icon)
                            .addClass('widgeticon')
                            .onClick(this.displayhide.bind(this));
        title.insert(this.icon, 'top');
        if (this.config) {
            title.insert(
                new Icon('config').addClass('widgetsetup').onClick(function() {
                    dialog(this.config(), false)
                }.bind(this)),
                'top'
            );
        };
        this.contentelement = new Element('div', {'class': 'content'}).insert(
                                    this.content()
                                );
        this.insert([
            title,
            this.contentelement
        ]);
    },
    redraw: function() {
        this.contentelement.update(this.content());
    },
    displayhide: function() {
        this.toggleClass('forcedisplay');
    }
});

widgets = {
    w: {},
    unused: [],
    register: function(name, widget) {
        this.w[name] = widget;
        this.unused.push(name);
    },
    get: function(name) {
        return new this.w[name]();
    },
};

widgets.register('accounts', new Class(Widget, {
    id: 'accounts',
    icon: 'account',
    title: function(){return _('Accounts')},
    initialize: function() {
        this.$super();
        accounts.on('added', this.redraw);
        totalbalance.on('changed', this.redraw);
    },
    content: function(firstpass) {
        var preferred_currency = user_me.preferred_currency(),
            table = [],
            accts = accounts.list();
        if (accts.length) {
            accts.forEach(function(account) {
                var accountbalance = account.fields.balance.display();
                if (account.data.currency != preferred_currency) {
                    accountbalance.tooltip(loc_number(
                        account.data.balance_preferred,
                        preferred_currency
                    ))
                }
                table.push(
                    new Element('div', {
                            'class': 'line'
                        }).insert([
                        accountbalance,
                        new Element('span', {
                                'html': ''+account,
                                'class': 'link'
                            }).onClick(function() {
                                screens.load('/', 'account='+account.data.id);
                            })
                        ])
                );
                if (!account.observes(this.redraw)) {
                    account.on('changed', this.redraw);
                    account.on('deleted', this.redraw);
                };
            }, this);
            table.push(
                new Element('div', {
                    'class':'total line'
                }).insert([
                    new Element('span', {'class': 'balance editcell'}).insert(
                        totalbalance.display()
                    ),
                    new Element('span', {
                        'class': 'link',
                        'html': _('Total')
                    }).onClick(function() {
                        screens.load('/');
                    })
                ])
            )
            return table;
        } else {
            return _('You have no account');
        };
    }
}));

widgets.register('categories', new Class(Widget, {
    id: 'categories',
    icon: 'category',
    title: function(){return _('Categories')},
    initialize: function() {
        this.period = preferences.get(
                            'ospfm-web-categorywidget-period'
                        ) || 'month';
        this.$super();
        categories.on('added', this.redraw);
        categories.on('added in subcategory', this.redraw);
    },
    content: function() {
        var cats = categories.list(),
            table = [];
        var fill_categories_table = (function(cats) {
            cats.forEach(function(category) {
                table.push(
                    new Element('div', {'class': 'line'}).insert([
                        category.fields[this.period].display()
                            .tooltip(
                                new Element('table').insert([
                                    new Element('tr').insert([
                                        new Element('td', {
                                            'class': 'label'
                                        }).insert(
                                            _('this week')
                                        ),
                                        new Element('td', {
                                            'class': 'amount'
                                        }).insert(
                                            category.fields.week.display()
                                        )
                                    ]),
                                    new Element('tr').insert([
                                        new Element('td', {
                                            'class': 'label'
                                        }).insert(
                                            _('this month')
                                        ),
                                        new Element('td', {
                                            'class': 'amount'
                                        }).insert(
                                            category.fields.month.display()
                                        )
                                    ]),
                                    new Element('tr').insert([
                                        new Element('td', {
                                            'class': 'label'
                                        }).insert(
                                            _('this year')
                                        ),
                                        new Element('td', {
                                            'class': 'amount'
                                        }).insert(
                                            category.fields.year.display()
                                        )
                                    ]),
                                    new Element('tr').insert([
                                        new Element('td', {
                                            'class': 'label'
                                        }).insert(
                                            _('last 7 days')
                                        ),
                                        new Element('td', {
                                            'class': 'amount'
                                        }).insert(
                                            category.fields['7days'].display()
                                        )
                                    ]),
                                    new Element('tr').insert([
                                        new Element('td', {
                                            'class': 'label'
                                        }).insert(
                                            _('last 30 days')
                                        ),
                                        new Element('td', {
                                            'class': 'amount'
                                        }).insert(
                                            category.fields['30days'].display()
                                        )
                                    ])
                                ])
                            ),
                        category.shortRepr().addClass('link').onClick(
                            function() {
                               screens.load('/', 'category='+category.data.id);
                            }
                        )
                    ])
                );
                if (category.data.children) {
                    fill_categories_table(
                        category.data.children.list()
                    );
                };
                if (!category.observes(this.redraw)) {
                    category.on('changed', this.redraw);
                    category.on('deleted', this.redraw);
                    category.on(
                        'moved between collections',
                        function() {
                            // Without a delay, the widget is not correctly
                            // updated (bug ?)
                            this.redraw.delay(100);
                        }.bind(this)
                    );
                };
            }, this);
        }).bind(this);
        if (cats.length) {
            fill_categories_table(cats);
            return table;
        } else {
            return _('You have not defined any category');
        };
    },
    config: function() {
        var periodselect = new Input({
                                'type':'select',
                                'id': 'displayperiod',
                                'name': 'displayperiod'
                            }).insert([
                                new Element('option', {'value':'week'})
                                    .insert(_('this week')),
                                new Element('option', {'value':'month'})
                                    .insert(_('this month')),
                                new Element('option', {'value':'year'})
                                    .insert(_('this year')),
                                new Element('option', {'value':'7days'})
                                    .insert(_('last 7 days')),
                                new Element('option', {'value':'30days'})
                                    .insert(_('last 30 days')),
                            ]).setValue(this.period);
        return new Form().insert([
            new Element('table').insert([
                new Element('tr').insert([
                    new Element('td').insert(
                        new Element('label', {
                           'html':_('Period for which to display the balance'),
                           'for': 'displayperiod'
                        })
                    ),
                    new Element('td').insert(
                        periodselect
                    )
                ])
            ]),
            new Element('div', {'class': 'bottombuttons'}).insert(
                new Button('green', 'apply', _('Apply'), 'submit')
            )
        ]).onSubmit(function(event) {
            var period = event.currentTarget.values().displayperiod;
            event.preventDefault();
            this.period = period;
            preferences.set('ospfm-web-categorywidget-period', period)
            this.redraw();
            close_dialog();
        }.bind(this));
    }
}));

widgets.register('contacts', new Class(Widget, {
    id: 'contacts',
    icon: 'people',
    title: function(){return _('Contacts')},
    initialize: function() {
        this.$super();
        contacts.on('added', this.redraw);
    },
    content: function() {
        var conts = contacts.list(),
            table = [];
        if (conts.length) {
            // TODO: When debts will be implemented, display users debts
            conts.forEach(function(contact) {
                table.push(
                    new Element('div', {'html':''+contact}).tooltip(
                        contact.data.comment
                    )
                );
                if (!contact.observes(this.redraw)) {
                    contact.on('changed', this.redraw);
                    contact.on('deleted', this.redraw);
                };
            }, this);
            return table;
        } else {
            return _('You have no contact');
        };
    }
}));

widgets.register('currencies', new Class(Widget, {
    id: 'currencies',
    icon: 'coins',
    title: function(){return _('Currencies')},
    initialize: function() {
        this.$super();
        own_currencies.on('added', this.redraw);
    },
    content: function() {
        var table,
            curs = own_currencies.list();
        if (curs.length) {
            table = [];
            curs.forEach(function(currency) {
                table.push(
                    new Element('div', {
                        'class': 'line'
                    }).insert([
                        currency.fields.rate.display(),
                        new Element('span', {
                            'html':''+currency,
                            'class': 'link'
                        }).onClick(function() {
                            screens.load('/', 'currency='+currency.data.id);
                        })
                    ])
                );
                if (!currency.observes(this.redraw)) {
                    currency.on('changed', this.redraw);
                    currency.on('deleted', this.redraw);
                };
            }, this);
            return table;
        } else {
            return _('You have not defined any personalized currency');
        };
    }
}));

widgets.register('calculator', new Class(Widget, {
    prebind: ['checkinput'],
    id: 'calculator',
    icon: 'calculator',
    title: function() {return _('Calculator')},
    checkinput: function() {
        this.inp.setValue(
            this.inp.getValue()
                .replace(/[^0-9\(\)\+\-\*\/×÷,\.x]/g, '')
                .replace('/', '÷')
                .replace('*', '×')
                .replace('x', '×')
                .replace('.', l10n_numbers.decimal)
                .replace(',', l10n_numbers.decimal)
        );
    },
    content: function() {
        var calcform = new Form(),
            calcinput = new Input().setStyle('width', '100%')
                            .onKeyup(this.checkinput)
                            .onChange(this.checkinput);
        this.inp = calcinput;
        function adddigit(event) {
            calcinput.setValue(
                calcinput.getValue() + event.currentTarget.getValue()
            ).focus();
        };
        calcform.insert([
            calcinput,
            new Input({'type': 'button', 'value': '7'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '8'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '9'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '('})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': ')'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '4'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '5'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '6'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '×'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '÷'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '1'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '2'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '3'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '+'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': '-'})
                .onClick(adddigit),
            // content character equivalent to Icon('erase')
            new Input({'type': 'button', 'value': 'x'})
                .setStyle('font-family', 'icons')
                .onClick(function() {
                    calcinput.setValue('');
                }),
            new Input({'type': 'button', 'value': '0'})
                .onClick(adddigit),
            new Input({'type': 'button', 'value': l10n_numbers.decimal})
                .onClick(adddigit),
            new Input({'type': 'submit', 'value': '='})
                .setStyle('width', '40%')
        ]).onSubmit(function(event) {
            event.preventDefault();
            var result,
                string = calcinput.getValue(),
                operation = string
                                .replace('×', '*')
                                .replace('÷', '/')
                                .replace(',', '.');
            try {
                result = eval(operation);
                calcinput.setValue(
                    (''+result).replace('.', l10n_numbers.decimal)
                );
            } catch (error) {
                calcinput.setValue(_('ERROR: ') + string);
            }
        });

        // In the topbar, give focus to the input when hovering on the icon
        this.icon.onMouseover(function () {
            if (this.parent('div#topbar')) {
                calcinput.focus();
            }
        }.bind(this));
        return calcform;
    }
}));


init.on('end', function() {
    var widgetname,
        idx,
        sidewidgets = preferences.get('ospfm-web-sidewidgets') || [
                                                                   'accounts',
                                                                   'categories'
                                                                  ],
        topwidgets  = preferences.get('ospfm-web-topwidgets') || [
                                                                  'calculator'
                                                                 ],
        unused      = widgets.unused;
    sidewidgets.forEach(function(widgetname) {
        idx = unused.indexOf(widgetname);
        if (idx != -1) {
            unused.splice(idx, 1);
            $('sidewidgets').insert(widgets.get(widgetname));
        };
    });
    topwidgets.forEach(function(widgetname) {
        idx = unused.indexOf(widgetname);
        if (idx != -1) {
            unused.splice(idx, 1);
            $('topwidgets').insert(widgets.get(widgetname));
        };
    });
});


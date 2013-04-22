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

// This file is named "transactions_0" to be sure it is interpreted before
// the other "transactions_" files (that depends on how the system sorts the
// files in the directory ; Ubuntu and Debian deal with that in different ways)

TransactionRow = new Class(Element, {
    prebind: ['display_row', 'edit_row', 'save_transaction'],
    /**
     * Initializes the row
     *
     * @param Object optional transaction data
     */
    initialize: function(data) {
        this.$super('div', {'class':'transaction'});
        if (data) {
            this.data = data;
            this.set('id', 'transaction' + data.id);
            this.type = this.guess_type();
            this.display_row();
        } else {
            this.data = {};
            this.edit_row();
        };
    },
    guess_type: function() {
        var accounts          = this.data.accounts,
            negative_accounts = 0,
            positive_accounts = 0;
        accounts.forEach(function(account) {
            if (account.amount > 0) {
                positive_accounts++;
            } else if (account.amount < 0) {
                negative_accounts++;
            };
        });
        if (this.data.amount == 0 &&
            positive_accounts == 1 &&
            negative_accounts == 1 &&
            this.data.categories.length == 0) {
            return "transfer";
        };
        if (this.data.amount > 0 &&
            positive_accounts == 1 &&
            negative_accounts == 0) {
            return "income";
        };
        if (this.data.amount < 0 &&
            positive_accounts == 0 &&
            negative_accounts == 1) {
            return "expense";
        };
        return false;
    },
    // TODO: display category full name (including parent name)
    display_row: function() {
        var accountstooltip,
            categoriestooltip,
            i, j,
            transferamount,
            transfercurrency,
            accounts    = new Element('div', {'class': 'accounts opaque'}),
            amount      = new Element('div', {'class': 'amount opaque'}),
            categories  = new Element('div', {'class': 'categories opaque'}),
            data        = this.data,
            date        = new Element('div', {'class': 'date opaque'}).insert(
                                loc_date(data.date)
                            ),
            description = new Element('div', {'class': 'description'}).insert(
                                data.description
                            ),
            editbutton  = new Button('green', 'edit')
                                .addClass('edit')
                                .tooltip(_('Edit'))
                                .onClick(this.edit_row),
            type        = new Element('div', {'class': 'type'});
        this.clean();
        this.removeClass('edit');

        function account_div(account) {
            var tooltiprow = new Element('tr');
            accounts.insert(account.name);
            tooltiprow.insert([
                new Element('td', {'class': 'label'}).insert(
                    account.name
                ),
                new Element('td', {'class': 'amount'}).insert(
                    loc_number(account.amount, account.currency)
                )
            ]);
            if (account.verified) {
                tooltiprow.insert(
                    new Element('td').insert(
                        new Icon('valid')
                    )
                );
            }
            accountstooltip.insert(tooltiprow);
        }

        function category_div(category) {
            categories.insert(category.name);
            categoriestooltip.insert([
                new Element('tr').insert([
                    new Element('td', {'class': 'label'}).insert(
                        category.name
                    ),
                    new Element('td', {'class': 'amount'}).insert(
                        loc_number(category.category_amount, category.currency)
                    )
                ])
            ]);
        }

        // Original description
        if (data.original_description &&
            data.original_description != data.description) {
                description.tooltip(data.original_description)
        }

        // Transaction type
        if (this.type == 'expense') {
            type.insert(_('Expense'));
        } else if (this.type == 'income') {
            type.insert(_('Income'));
        } else if (this.type == 'transfer') {
            type.insert(_('Transfer between my accounts'));
        } else {
            type.insert(
                new Element('em', {'html':_('Unknown transaction type')})
            );
        }


        // Categories list
        if (data.categories && data.categories.length > 0) {
            categoriestooltip = new Element('table');
            j = data.categories.length - 1;
            for (i=0; i<j; i++) {
                category_div(data.categories[i]);
                categories.insert(', ');
            };
            category_div(data.categories[j]);
            categories.tooltip(categoriestooltip);
        }

        // Accounts list
        if (data.accounts && data.accounts.length > 0) {
            accountstooltip = new Element('table');
            j = data.accounts.length - 1;
            for (i=0; i<j; i++) {
                account_div(data.accounts[i]);
                accounts.insert(', ');
            };
            account_div(data.accounts[j]);
            accounts.tooltip(accountstooltip);
        }
        // Total amount
        if (data.amount) {
            amount.insert(loc_number(data.amount, data.currency));
        } else if (this.type == 'transfer') {
            data.accounts.forEach(function(account) {
                if (account.amount > 0) {
                    transferamount = account.amount;
                    transfercurrency = account.currency;
                }
            });
            amount.insert(loc_number(transferamount, transfercurrency));
        };

        if (this.type) {
            this.insert(editbutton)
        };

        this.insert([
            description,
            type,
            amount,
            date,
            categories,
            accounts
        ])
    },
    edit_row: function() {
        var details,
            first_day,
            applybutton  = new Button('green', 'apply')
                                .addClass('apply')
                                .onClick(function() {
                                    this.save_transaction()
                                }.bind(this)),
            applybuttonright  = new Button('green', 'apply')
                                .addClass('apply_right')
                                .onClick(function() {
                                    this.save_transaction()
                                }.bind(this)),
            cancelbutton = new Button('blue', 'cancel')
                                .addClass('cancel')
                                .tooltip(_('Cancel')),
            deletebutton = new Button('red', 'del')
                                .addClass('delete')
                                .tooltip(_('Delete')).onClick(function() {
                                    this.delete_transaction()
                                }.bind(this)),
            date         = new Input({
                                'name': 'date',
                                'class': 'date',
                                'placeholder': _('Date')
                            }),
            description  = new Input({
                                'name': 'description',
                                'class': 'description'
                            }),
            form         = new Form(),
            type         = new Input({
                                'type':'select',
                                'class': 'type'
                            }).insert([
                                new Element('option', {
                                    'value': 'expense',
                                    'html': _('Expense')
                                }),
                                new Element('option', {
                                    'value': 'income',
                                    'html': _('Income')
                                }),
                                new Element('option', {
                                    'value': 'transfer',
                                    'html': _('Transfer between my accounts')
                                })
                            ]).onChange(function() {
                                this.first('div.details').replace(
                                    transaction_edit_details.pick(
                                        type.getValue(),
                                        this.data
                                    )
                                )
                            }.bind(this));

        this.clean();
        this.addClass('edit');

        if (this.data.id) {
            // Edit row for an existing transaction
            description
                .set('placeholder', this.data.original_description)
                .setValue(this.data.description)
                .tooltip(this.data.original_description);
            if (this.type) {
                details = transaction_edit_details.pick(this.type, this.data);
                type.setValue(this.type);
            } else {
                type.insert(
                    new Element('option', {
                        'value': '-',
                        'html': _('Unknown type')
                    })
                ).setValue('-');
                details = new Element('div');
            };
            date.setValue(loc_date(this.data.date));
            cancelbutton.onClick(this.display_row);
            applybuttonright.text(_('Modify'));
            applybutton.tooltip(_('Modify'));
        } else {
            // Edit row for a new transaction
            description.set('placeholder', _('Description'));
            // TODO: Default values depending on the search filter (account, category)
            details = transaction_edit_details.pick(type.getValue(), {})
            date.setValue(loc_date(new Date().toISOString().slice(0,10)))
            cancelbutton.onClick(function() {
                this.remove();
            }.bind(this));
            applybuttonright.text(_('Create'));
            applybutton.tooltip(_('Create'));
        };
        new Calendar().assignTo(date);

        form.insert([
            description,
            type,
            date,
            details
        ])

        if (this.data.id) {
            this.insert(deletebutton);
        }

        this.insert([
            applybutton,
            cancelbutton,
            form,
            applybuttonright
        ]);
    },
    save_transaction:function() {
        var type = this.first('select.type').getValue(),
            values = this.first('form').values(),
            data   = transaction_save_details.pick(
                        type,
                        values
                    );
        if (data) {
            data.description = values.description;
            data.date = parse_loc_date(values.date);
            if (this.data.id) {
                api_update('transactions', this.data.id, data, function(data) {
                    this.data = data;
                    this.type = this.guess_type();
                    this.display_row();
                    return(_('Updated transaction'));
                }.bind(this),
                function() {
                    return(_('Error updating transaction'));
                });
            } else {
                api_create('transactions', data, function(data) {
                    this.data = data;
                    this.set('id', 'transaction' + data.id);
                    this.type = this.guess_type();
                    this.display_row();
                    return(_('Created transaction'));
                }.bind(this),
                function() {
                    return(_('Error creating transaction'));
                });
            };
        } else {
            if (this.data.id) {
                popup(_('Error updating transaction'), true);
            } else {
                popup(_('Error creating transaction'), true);
            }
        }
    },
    delete_transaction:function() {
        api_delete('transactions', this.data.id, function() {
            this.remove();
            return(_('Deleted transaction'));
        }.bind(this),
        function() {
            return(_('Error deleting transaction'));
        });
    }
});

transaction_edit_details = {
    pick:function(type, data) {
        var container = new Element('div', {'class':'details'});
        this[type](container, data);
        return container;
    }
}

transaction_save_details = {
    pick: function(type, data) {
        return this[type](data);
    }
}


ComplexInput = new Class(Element, {
    initialize:function(elementid, randomidsuffix) {
        this.$super('div', {'class': 'complexinput'});
        if (randomidsuffix) {
            this.elementid = elementid+(Date.now()+Math.random().toString()
                                                             .replace('.',''));
        } else {
            this.elementid = elementid;
        }
    },
    amountfield: function(amount, currency, prefix) {
        var amountdata = {};
        amountdata[prefix+'amount'] = amount;
        return new AmountField(
            {
                on: function(){},
                data: amountdata
            },
            prefix+'amount',
            _('Amount'),
            null,
            null,
            'amount',
            currency,
            true
        );
    },
    dominput:function() {
        return this.inputelement.first('input');
    }
});

AccountInput = new Class(ComplexInput, {
    initialize:function(elementid, account, randomidsuffix) {
        var currency,
            amount;
        this.$super(elementid, randomidsuffix);
        if (account) {
            this.select = accounts.selectonly(account.id, this.elementid);
            amount = Math.abs(account.amount);
            currency = account.currency;
            this.manually_modified = true;
        } else {
            this.select = accounts.selectonly(null, this.elementid,
                                              null, null, true);
            amount = 0;
            currency = 'PREF';
            this.manually_modified = false;
        }
        this.amount = this.amountfield(amount, currency, this.elementid);
        this.inputelement = this.amount.input();

        this.select.onChange(function() {
            var emptyoption = this.select.first('option.empty'),
                newamount = this.amountfield(
                    this.inputelement.first('input').numericvalue,
                    accounts.get(this.select.getValue()).data.currency,
                    this.elementid
                ),
                newinput = newamount.input();
            this.inputelement.replace(newinput);
            this.inputelement = newinput;
            this.amount = newamount;
            if (emptyoption) {
                emptyoption.remove();
            };
        }.bind(this));

        this.onChange(function(event) {
            // Do not put the listener on the input element so it doesn't
            // have to be rebound each time the element is changed
            if (event.target.numericvalue) {
                this.manually_modified = true;
            }
        }.bind(this));

        this.insert([
            this.select,
            this.inputelement
        ])
    }
});

CategoryInput = new Class(ComplexInput, {
    prebind: ['changecurrency','do_add_exchangerate','maybe_add_exchangerate'],
    initialize:function(elementid, category, randomidsuffix, currency) {
        var category_amount,
            transaction_amount;
        this.$super(elementid, randomidsuffix);
        this.currency = currency;
        this.amountline = new Element('div', {'class': 'amountline'});
        if (category) {
            this.select = new CategorySelector(this.elementid, category.id);
            category_amount = Math.abs(category.category_amount);
            transaction_amount = Math.abs(category.transaction_amount);
            this.categorycurrency = category.currency;
            this.manually_modified = true;
        } else {
            this.select = new CategorySelector(this.elementid);
            category_amount = 0;
            transaction_amount = 0;
            this.categorycurrency = 'PREF';
            this.manually_modified = false;
        }
        this.amount = this.amountfield(
                                 transaction_amount, currency, this.elementid);
        this.inputelement = this.amount.input();
        this.amountline.insert(this.inputelement);
        if (category_amount != transaction_amount) {
            this.do_add_exchangerate(category_amount, category.currency);
        };

        this.select.on('changed', function() {
            var newamount,
                newinput,
                newcategory = this.select.getValue();
            if (newcategory) {
                this.categorycurrency = categories.get(newcategory)
                                                  .data.currency;
                newamount = this.amountfield(
                    this.dominput().numericvalue,
                    this.currency,
                    this.elementid
                );
                newinput = newamount.input();
                this.amountline.clean()
                this.amountline.insert(newinput);
                this.inputelement = newinput;
                this.amount = newamount;
                this.maybe_add_exchangerate();
            };
        }.bind(this));

        this.onChange(function(event) {
            // Listener not directly on the input element so it doesn't
            // have to be rebound each time the element is changed

            // Only triggered after a manual change
            if (event.target.numericvalue) {
                this.manually_modified = true;
                this.change_exchangerate();
            }
        }.bind(this));

        this.delbutton = new Button('red', 'del', _('Remove this category'))
            .onClick(function() {
                this.remove();
            }.bind(this));

        this.insert([
            this.select,
            this.amountline,
            this.delbutton
        ])
    },
    changecurrency:function(newcurrency) {
        var newamount,
            newinput;
        if (newcurrency != this.currency) {
            this.currency = newcurrency;
            newamount = this.amountfield(
                this.dominput().numericvalue,
                newcurrency,
                this.elementid
            );
            newinput = newamount.input();
            this.amountline.clean();
            this.amountline.insert(newinput);
            this.inputelement = newinput;
            this.amount = newamount;
            this.maybe_add_exchangerate();
        }
    },
    /**
     * Display amount in category currency
     *
     * @param Float amount in category currency, if already none
     */
    do_add_exchangerate:function(amount, currency) {
        this.amountline.insert(
            new Element('span', {
                'class': 'categoryvalue',
                'html':loc_number(amount, currency)
            }).insert(
                new Input({
                    'type': 'hidden',
                    'name': this.elementid + 'categoryamnt'
                }).setValue(amount)
            )
        );
    },
    /**
     * If account's currency is different than category currency,
     * display amount in category currency
     */
    maybe_add_exchangerate:function() {
        var categorycurrency = this.categorycurrency == 'PREF' ?
                          user_me.preferred_currency() : this.categorycurrency,
            currency         = this.currency == 'PREF' ?
                                  user_me.preferred_currency() : this.currency;

        if (categorycurrency != currency) {
            api_rate(currency, categorycurrency, function(value) {
                this.do_add_exchangerate(value, categorycurrency);
            }.bind(this), this.dominput().numericvalue);
        };
    },
    change_exchangerate:function() {
        var element = this.amountline.first('span.categoryvalue');
        if (element) {
            element.remove()
            api_rate(this.currency, this.categorycurrency, function(value) {
                this.do_add_exchangerate(value, this.categorycurrency);
            }.bind(this), this.dominput().numericvalue);
        };

    }
});

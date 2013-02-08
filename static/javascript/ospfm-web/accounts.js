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

AccountCurrencyField = new Class(ObjectField, {
    initialize: function(obj, id, name, prefix, suffix,
                         additional_class, collection) {
        this.$super(obj, id, name, prefix, suffix,
                    additional_class, collection);
        // If there is no ID (ie. if this is a template),
        // then value = preferred currency
        if (!this.object.data.id) {
            this.value = function() {
                return user_me.preferred_currency();
            };
        };
    },
    input: function() {
        var htmlcontent;
        if (this.object.data.transactions_count > 0) {
            return this.display().tooltip(_('The currency cannot be changed because<br/>there are transactions in this account.'));
        } else {
            htmlcontent = this.$super();
            htmlcontent.onChange(function(event) {
                var new_currency = event.target.getValue();
                this.object.fields.balance.currency = new_currency;
                this.object.fields.start_balance.currency = new_currency;
            }.bind(this));
            return htmlcontent;
        };
    }
});

Account = new Class(OspfmObject, {
    category: 'accounts',
    key: 'id',
    initialize: function(data) {
        this.$super(data);
        this.fields = {
            'name': new StringField(this, 'name', _('Name'),
                                    null, null, null, 50),
            'start_balance': new AmountField(this, 'start_balance',
                                             _('Start balance'),
                                             null, null, null,
                                             this.data.currency || 'PREF'),
            'currency': new AccountCurrencyField(this, 'currency',
                                                 _('Currency'), null, null,
                                                 null, all_currencies),
            'balance': new AmountField(this, 'balance', _('Balance'),
                                       null, null, null,
                                       this.data.currency || 'PREF'),
        };
    },
    toString:function() {
        return this.data.name;
    },
    createsuccess:function() { return _('Created account'); },
    createfailed:function() { return _('Error creating account'); },
    updatesuccess:function(data) {
        // Change balance currency when account currency changes
        this.fields.balance.currency = data.currency;
        this.fields.start_balance.currency = data.currency;
        return _('Updated account');
    },
    updatefailed:function() { return _('Error updating account'); },
    deletesuccess:function() { return _('Deleted account'); },
    deletefailed:function() { return _('Error deleting account'); },
});

accounts = new Collection(Account, false, 'name', true, true);
totalbalance = new Observer();
totalbalance.display = function() {
    var data = totalbalance.data;
    return loc_number(data.balance, data.currency);
};

additional.totalbalance = function(data) {
    totalbalance.data = data;
    totalbalance.fire('changed');
}
additional.accountbalance = function(data) {
    var account = accounts.get(data.id);
    account.data.balance = data.balance;
    account.data.balance_preferred = data.balance_preferred;
    account.data.transactions_count = data.transactions_count;
    account.fire('changed');
}

init.on('go', function() {
    init.start(function() {
        api_read('accounts', function(data) {
            totalbalance.data = data.total;
            data.accounts.forEach(function(accountdata) {
                accounts.add(new Account(accountdata));
            });
            init.success();
        }, function() {
            init.failed();
        });
    });
});

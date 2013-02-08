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

Currency = new Class(OspfmObject, {
    category: 'currencies',
    key: 'isocode',
    initialize:function(data) {
        this.$super(data,
        {
            'isocode': new Field(this, 'isocode', _('ISO code')),
            'symbol': new StringField(this, 'symbol', _('Symbol'),
                                      null, null, null, 5),
            'name': new StringField(this, 'name', _('Name'),
                                    null, null, null, 50),
            'rate': new AmountField(this, 'rate', _('Exchange rate'), '1 = ',
                                    null, null, 'PREF')
        });
    },
    toString: function() {
        return loc_fullcurrency(
            this.data.name,
            this.data.isocode,
            this.data.symbol
        )
    },
    symbol: function() {
        return this.data.symbol;
    },
    createsuccess:function() { return _('Created currency'); },
    createfailed:function() { return _('Error creating currency'); },
    updatesuccess:function() { return _('Updated currency'); },
    updatefailed:function() { return _('Error updating currency'); },
    deletesuccess:function() { return _('Deleted currency'); },
    deletefailed:function() { return _('Error deleting currency'); },
    new_rate:function(rate) {
        this.data.rate = rate;
        this.fire('changed');
    }
});

/**
 * simulate a collection containing all currencies
 */
all_currencies = {
    'get':function(isocode) {
        return global_currencies.get(isocode) || own_currencies.get(isocode);
    },
    'htmlselect': function(selected, name) {
        return own_currencies.htmlselect(
            selected, name, global_currencies, 'top'
        );
    },
};

// Currencies will not be filled automatically to be able to separate them into
// global_currencies and own_currencies
global_currencies = new Collection(Currency, false);
own_currencies = new Collection(Currency, false, 'name', true, true);


init.on('go', function() {
    init.start(function() {
        user_me.on('changed currency', function() {
            api_read('currencies', function(data) {
                data.forEach(function(cur) {
                    if (cur.owner) {
                        own_currencies.get(cur.symbol).new_rate(cur.rate);
                    };
                });
            });
        });
        api_read('currencies', function(data) {
            data.forEach(function(curdata) {
                var cur = new Currency(curdata);
                if (curdata.owner) {
                    own_currencies.add(cur);
                } else {
                    global_currencies.add(cur);
                };
            });
            init.success();
        }, function() {
            init.failed();
        });
    });
});

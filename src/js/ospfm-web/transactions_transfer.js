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

transaction_edit_details.transfer = function(container, data) {
    var from,
        fromelement,
        to,
        toelement;
    if (data.accounts) {
        data.accounts.forEach(function(account) {
            if (account.amount > 0) {
                to = account;
            } else if (account.amount < 0) {
                from = account;
            };
        });
    };

    function cross_modify_inputs(event) {
        // Delaying to be sure numeric values are modified beforehand
        function delayed () {
            var modify_to   =
                    toelement.dominput()._.value == '' ||
                    toelement.dominput().numericvalue == 0 ||
                    !toelement.manually_modified,
                modify_from =
                    fromelement.dominput()._.value == '' ||
                    fromelement.dominput().numericvalue == 0 ||
                    !fromelement.manually_modified;

            if (modify_to && !modify_from) {
                // Replace "to" input according to "from" input
                api_rate(
                    fromelement.amount.currency,
                    toelement.amount.currency,
                    function(newvalue) {
                        toelement.dominput().setRealValue(
                            newvalue.toString()
                        );
                    },
                    fromelement.dominput().numericvalue
                );
            } else if (modify_from && !modify_to) {
                // Replace "from" input according to "to" input
                api_rate(
                    toelement.amount.currency,
                    fromelement.amount.currency,
                    function(newvalue) {
                        fromelement.dominput().setRealValue(
                            newvalue.toString()
                        );
                    },
                    toelement.dominput().numericvalue
                );
            };
        };
        delayed.delay(10);
    };

    fromelement = new AccountInput('from', from).onChange(cross_modify_inputs);
    toelement = new AccountInput('to', to).onChange(cross_modify_inputs);

    container.insert([
        new Element('div', {'class':'container'}).insert([
            new Element('span', {'class': 'label', 'html':_('From:')}),
            fromelement
        ]),
        new Element('div', {'class':'container'}).insert([
            new Element('span', {'class': 'label', 'html':_('To:')}),
            toelement
        ])
    ])
}


transaction_save_details.transfer = function(data) {
    return {
        accounts: JSON.stringify([
            {
                'account': data.from.toInt(),
                'amount': 0-data.fromamount
            },
            {
                'account': data.to.toInt(),
                'amount': data.toamount
            }
        ]),
        currency: user_me.preferred_currency(),
        amount: 0
    }
}

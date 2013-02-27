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

transaction_edit_details.expense =
transaction_edit_details.income = function(container, data) {
    var account,
        accountelement,
        categoryinput,
        currency,
        datacategories = data.categories || [],
        categorieslabel     = new Element('span', {
                                    'class': 'incategory label'
                                }),
        categoriescontainer = new Element('div', {'class':'container'}).insert(
                                    categorieslabel
                                ),
        elements = {};

    // Account
    if (data.accounts) {
        account = data.accounts[0];
        currency = account.currency;
    } else {
        account = null;
        currency = 'PREF';
    };
    accountelement = new AccountInput('account', account)
                            .onChange(modifycategoriesamounts);

    function changelabel() {
        var nbcat = categoriescontainer.children('div.complexinput').length;
        if (nbcat == 0) {
            categorieslabel.html(_('In no category...'))
        } else if (nbcat > 1) {
            categorieslabel.html(_('In categories:'))
        } else {
            categorieslabel.html(_('In category:'))
        }
    }

    function modifycategoriesamounts() {
        var amount_for_each,
            category_inputs_to_change = [],
            amount_already_used = 0,
            catinputs = categoriescontainer.children('div.complexinput');
        catinputs.forEach(function(catinput) {
            var catvalue = catinput.dominput().getValue();
            catinput.changecurrency(accountelement.amount.currency);
            if (catinput.manually_modified && catvalue != 0) {
                amount_already_used += catvalue
            } else {
                category_inputs_to_change.push(catinput)
            }
        });
        amount_for_each =
            (accountelement.dominput().getValue() - amount_already_used)
            / category_inputs_to_change.length;
        category_inputs_to_change.forEach(function(category) {
            category.dominput().setRealValue(String(amount_for_each));
            category.change_exchangerate();
        });

    }

    // Categories
    if (datacategories.length) {
        datacategories.forEach(function(category) {
            var categoryinput = new CategoryInput(
                'category', category, true, currency
            ).onChange(modifycategoriesamounts);
            categoryinput.delbutton.onClick(changelabel);
            categoryinput.delbutton.onClick(modifycategoriesamounts);
            categoriescontainer.insert(categoryinput);
        });
    } else {
        categoryinput = new CategoryInput(
            'category', null, true, currency
        ).onChange(modifycategoriesamounts);
        categoryinput.delbutton.onClick(changelabel);
        categoryinput.delbutton.onClick(modifycategoriesamounts);
        categoriescontainer.insert(categoryinput);
    }
    categoriescontainer.insert(
        new Button('blue', 'add', _('Add a category')).onClick(function() {
            var categoryinput = new CategoryInput(
                'category', null, true, currency
            ).onChange(modifycategoriesamounts);
            categoryinput.delbutton.onClick(changelabel);
            categoryinput.delbutton.onClick(modifycategoriesamounts);
            this.insert(categoryinput, 'before');
            changelabel();
            modifycategoriesamounts();
        })
    );

    changelabel();

    container.insert([
        new Element('div', {'class':'container'}).insert([
            new Element('span', {
                'class': 'onaccount label',
                'html':_('On account:')
            }),
            accountelement
        ]),
        categoriescontainer
    ]);
}

function expenseincome_save_details(data, isexpense) {
    var amountindex,
        categoryamntindex,
        categoryamount,
        key,
        transactionamount,
        uid,
        transactioncurrency,
        accountid = data.account.toInt(),
        categorieslist       = {},
        targetcategorieslist = [],
        targetdata           = {};
    function negate_if_expense(value) {
        if (isexpense) {
            return 0 - value;
        } else {
            return value;
        };
    };
    if (accountid) {
        if (data.accountamount == 0) {
            return false;
        }
        transactioncurrency = accounts.get(accountid).data.currency;
        targetdata = {
            currency: transactioncurrency,
            amount: negate_if_expense(data.accountamount),
            accounts: JSON.stringify([
                {
                    account: accountid,
                    amount: negate_if_expense(data.accountamount)
                },
            ]),
        };
        for (key in data) {
            if (key.indexOf('category') == 0) {
                amountindex = key.indexOf('amount');
                categoryamntindex = key.indexOf('categoryamnt');
                if (amountindex != -1) {
                    // It is the amount
                    uid = key.slice(8, amountindex)
                    if (categorieslist[uid]) {
                        categorieslist[uid].amount = data[key];
                    } else {
                        categorieslist[uid] = {'amount':data[key]};
                    };
                } else if (categoryamntindex != -1) {
                    uid = key.slice(8, categoryamntindex)
                    if (categorieslist[uid]) {
                        categorieslist[uid].categoryamnt = data[key];
                    } else {
                        categorieslist[uid] = {'categoryamnt':data[key]};
                    };
                } else {
                    // It is the category ID
                    uid = key.slice(8)
                    if (categorieslist[uid]) {
                        categorieslist[uid].category = data[key];
                    } else {
                        categorieslist[uid] = {'category':data[key]};
                    };
                };
            };
        };
        for (key in categorieslist) {
            if (categorieslist[key].category) {
                transactionamount = categorieslist[key].amount;
                if (categorieslist[key].categoryamnt) {
                    categoryamount = categorieslist[key].categoryamnt;
                } else {
                    categoryamount = transactionamount;
                }
                targetcategorieslist.push({
                    'category': categorieslist[key].category,
                    'transaction_amount': negate_if_expense(transactionamount),
                    'category_amount': negate_if_expense(categoryamount)
                });
            };
        };
        targetdata.categories = JSON.stringify(targetcategorieslist);
        return targetdata;
    } else {
        return false;
    }
}

transaction_save_details.expense = function(data) {
    return expenseincome_save_details(data, true);
}

transaction_save_details.income = function(data) {
    return expenseincome_save_details(data, false);
}

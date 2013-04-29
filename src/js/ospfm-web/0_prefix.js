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

var
        // 1_main.js
    init,
        // 2_preferences.js
    preferences,
        // 2_screens.js
    screens,
    Screen,
        // accounts.js
    accounts,
    totalbalance,
        // authentication.js
    authentication,
        // categories.js
    categories,
        // contacts.js
    contacts,
        // currencies.js
    all_currencies,
    global_currencies,
    own_currencies,
        // interface.js
    Icon,
    Button,
    dialog,
    close_dialog,
    popup,
    Tabs,
        // localization.js
    _,
    locale,
        // user.js
    user_me,
        // widgets.js
    widgets,
        // wizard.js
    wizard;

// Put everything in a single function, to be able to minify more names
$(document).onReady(function(){
    var
            // 1_additional.js
        additional,
            // 2_ospfm_objects.js
        Collection,
        OspfmObject,
        Field,
        StringField,
        AmountField,
        ObjectField,
            // 2_preferences.js
        Preference,
            // 2_screens.js
        RemoteScreen,
            // accounts.js
        AccountCurrencyField,
        Account,
            // api.js
        api_rates,
            // authentication.js
        Authentication,
            // categories.js
        CategoryCurrencyField,
        Category,
        multi_category_creator,
        CategorySelector,
            // contacts.js
        ContactNameField,
        Contact,
            // currencies.js
        Currency,
            // interface.js
        icons,
        popuptimeout,
            // transactions.js
        TransactionRow,
        transaction_edit_details,
        transaction_save_details,
        ComplexInput,
        AccountInput,
        CategoryInput,
            // transactionscreen.js
        transactionscreen,
        SearchBox,
            // user.js
        User,
            // widgets.js
        Widget;

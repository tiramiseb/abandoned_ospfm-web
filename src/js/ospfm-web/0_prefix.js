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
        // 1_additional.js
    additional,
        // 1_main.js
    init,
        // 2_ospfm_objects.js
    Collection,
    OspfmObject,
    Field,
    StringField,
    AmountField,
    ObjectField,
        // 2_preferences.js
    Preference,
    preferences,
        // 2_screens.js
    RemoteScreen,
    screens,
    Screen,
        // accounts.js
    Account,
    AccountCurrencyField,
    accounts,
    totalbalance,
        // api.js
    api_rates,
        // authentication.js
    Authentication,
    authentication,
        // categories.js
    categories,
    Category,
    CategoryCurrencyField,
    multi_category_creator,
    CategorySelector,
    CategoriesCollection,
        // contacts.js
    contacts,
    ContactNameField,
    Contact,
        // currencies.js
    all_currencies,
    global_currencies,
    own_currencies,
    Currency,
        // interface.js
    Icon,
    icon,
    Button,
    dialog,
    close_dialog,
    popup,
    popuptimeout,
        // localization.js
    _,
    locale,
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
    user_me,
        // widgets.js
    Widget,
    widgets,
        // wizard.js
    wizard;

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

locale = {};

/**
 * Load locale according to the user's preferences
 */
preferences.on('initialized', function() {
    var preflocale = preferences.get('ospfm-web-locale');
    if (preflocale) {
        if (preflocale != locale.full && preflocale != locale.shortform) {
            // Preference locale different than browser locale
            Xhr.load(static_url+'locale/'+preflocale+'.js', {
                onSuccess: function() {
                    locale.full = preflocale;
                    locale.shortform = preflocale.split('-')[0];
                    init.fire('go');
                },
                onFailure: function() {
                    dialog(new Element('p', {
                        'html': _("Sorry, loading your preferred language failed. Please check your language setting.")
                    }));
                    init.fire('go');
                }
            });
        } else {
            // Locale already loaded because it is the browser's locale
            init.fire('go');
        }
    } else {
        init.first_run = true;
        init.fire('go');
    };
});

/**
 * First load a locale corresponding to the browser,
 * before trying to load the app itself.
 */
Xhr.load('/browserlocale', {
    onSuccess: function(response) {
        var newlocale = response.responseJSON.locale;
        locale.full = newlocale;
        locale.shortform = newlocale.split('-')[0];
        Xhr.load(static_url+'locale/'+newlocale+'.js', {
            onSuccess: function() {
                init.fire('browserlocaleloaded');
            },
            onFailure: function() {
                init.failed();
            }
        });
    },
    onFailure: function() {
        init.failed();
    }
});

/*****************************************************************************/

/**
 * translates a string
 *
 * @param String text to translate
 * @return String translated text
 */
_ = function (string) {
    if (window.l10n_strings) {
        return l10n_strings[string] || string;
    } else {
        return string;
    };
}

/**
 * localizes a number
 *
 * if currency is unspecified, returns a number
 * if currency is "%", returns a percentage
 * if currency is anything else, returns a currency representation
 *
 * @param Number number to localize
 * @param mixed optional currency (either currency isocode or currency object)
 * @param Boolean optional return a string without HTML tags (for inputs, etc)
 * @return String localized number
 */
function loc_number(num, currency, nohtml) {
    var i,
        negative,
        splittednum,
        decimalpart,
        pattern,
        currencydecimals,
        currencydisplay,
        split_at    = l10n_numbers.digits,
        separator   = l10n_numbers.separator,
        integerpart = "",
        digitcount  = 0;
    if (num < 0) {
        num = Math.abs(num);
        negative = true;
    } else {
        negative = false;
    };
    var splittednum = (''+num).split('.');
    // Separate groups of digits (thousands...)
    for (i=splittednum[0].length; i>0; i--) {
        if (digitcount == split_at) {
            integerpart = separator+integerpart;
            digitcount = 0;
        }
        digitcount++;
        integerpart = splittednum[0][i-1] + integerpart;
    };
    // Prepare the decimal part
    if (splittednum.length > 1) {
        decimalpart = splittednum[1];
    } else {
        decimalpart = '';
    };
    if (currency && currency != '%') {
        currencydecimals = l10n_numbers.curdecimals;
        if (decimalpart.length > currencydecimals) {
            decimalpart = decimalpart.substr(0, currencydecimals);
        } else if (decimalpart.length < currencydecimals) {
            for (i=decimalpart.length; i<currencydecimals; i++) {
                decimalpart += '0';
            };
        };
    };
    if (decimalpart) {
        decimalpart = l10n_numbers.decimal+decimalpart;
    };

    if (negative) {
        if (currency) {
            if (currency == '%') {
                if (nohtml) {
                    pattern = l10n_numbers.negpct;
                } else {
                    pattern = '<span class="negative">'+l10n_numbers.negpct+'</span>';
                }
            } else {
                if (nohtml) {
                    pattern = l10n_numbers.negcur;
                } else {
                    pattern = '<span class="negative">'+l10n_numbers.negcur+'</span>';
                }
            };
        } else {
            pattern = l10n_numbers.negnum;
        };
    } else {
        if (currency) {
            if (currency == '%') {
                pattern = l10n_numbers.pospct;
            } else {
                pattern = l10n_numbers.poscur;
            };
        } else {
            pattern = l10n_numbers.posnum;
        };
    };
    pattern = pattern.replace('N', integerpart+decimalpart);
    if (currency && currency != '%') {
        // Display currency symbol
        if (isString(currency)) {
            currencydisplay = all_currencies.get(currency).symbol();
        } else {
            currencydisplay = currency.symbol();
        };
        if (nohtml) {
            pattern = pattern.replace('C', currencydisplay);
        } else {
            pattern = pattern.replace(
                'C',
                '<span class="cursymbol">'+currencydisplay+'</span>'
            );
        };
    };
    return pattern;
}


/**
 * formats user's name and nickname
 *
 * @param String first name
 * @param String last name
 * @param String nickname
 * @return String formatted name
 */
function loc_nameandnick(first, last, nick) {
    var nameandnick,
        nickname = l10n_name.nickname.replace('N', nick);
    if (first == last && last == nick) {
        return '<span class="fullname">'+nickname+'</span><span class="nickonly">'+nick+'</span>';
    } else {
        nameandnick = l10n_name.nameandnick
                            .replace('F', first)
                            .replace('L', last)
                            .replace('N', nick);
        return '<span class="fullname">'+nameandnick+'</span><span class="nickonly">'+nick+'</span>';
    }
}

/**
 * formats currency's full representation (name, isocode, symbol)
 *
 * @param String default name of currency
 * @param String ISO code of currency
 * @param String symbol of currency
 * @return String formatted currency full representation
 */
function loc_fullcurrency(name, isocode, symbol) {
    return l10n_currency.completename
           .replace('N', l10n_currencies[isocode] || name)
           .replace('S', symbol)
           .replace('C', isocode);
}

/**
 * formats date according to locale setting
 *
 * @param String date in the "YYYY-MM-DD" or "YYYYMMDD" format
 * @return String formatted date
 */
function loc_date(date, withoutdash) {
    var month,
        day,
        shortday;
    if (withoutdash) {
        if (date.substring(6, 7) == '0') {
            shortday = date.substring(7, 8);
        } else {
            shortday = date.substring(6, 8);
        };
        month = date.substring(4, 6);
        day = date.substring(6, 8);
    } else {
        if (date.substring(8, 9) == '0') {
            shortday = date.substring(9, 10);
        } else {
            shortday = date.substring(8, 10);
        };
        month = date.substring(5, 7);
        day = date.substring(8, 10);
    };
    return l10n_date.shortformat
                .replace('%Y', date.substring(0, 4))
                .replace('%m', month)
                .replace('%d', day)
                .replace('%e', shortday);
}

/**
 * parses a localized date to the "YYYY-MM-DD" or "YYYYMMDD" format
 *
 * @param String localized date
 * @param Boolean return date without dash
 * @return String date in the "YYYY-MM-DD" or "YYYYMMDD" format
 */
function parse_loc_date(date, withoutdash) {
    var fields  = l10n_date.shortformat.match(/(%e|%d|%m|%Y)/g),
        matches = new RegExp(
                        l10n_date.shortformat
                            .replace('%e', '(\\d\\d+)')
                            .replace('%d', '(\\d\\d)')
                            .replace('%m', '(\\d\\d)')
                            .replace('%Y', '(\\d\\d\\d\\d)')
                    ).exec(date),
        isodate = new Date(),
        target;

    try {
        fields.forEach(function(field, index) {
            if (field == '%e' || field == '%d') {
                isodate.setDate(matches[index+1]);
            } else if (field == '%m') {
                isodate.setMonth(matches[index+1]-1);
            } else if (field == '%Y') {
                isodate.setYear(matches[index+1]);
            };
        });
        target = isodate.toISOString().substring(0, 10);
        if (withoutdash) {
            target = target.replace(/-/g, "");
        }
        return target;
    } catch (err) {
        return false;
    };
};

init.on('go', function() {
    init.start(function() {
        if (l10n_date.first_day_of_week != 'monday') {
            Calendar.Options.firstDay = 0;
        };
        Calendar.Options.format = l10n_date.shortformat,
        init.success();
    });
});

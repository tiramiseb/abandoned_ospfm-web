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

/******************** Communication with the OSPFM server ********************/

/**
 * deals with API success
 *
 * @param Object request
 * @param Function success handler
 */
function api_success(request, handler) {
    do_additional(request.responseJSON.additional);
    popup(handler(request.responseJSON.response));
}
/**
 * deals with API failure
 *
 * @param Object request
 * @param Function error handler
 * @param Function the calling function
 * @param Array args to the calling function
 */
function api_failure(request, errorhandler, func, args) {
    if (request.responseJSON) {
        if (request.responseJSON.status == 401) {
            authentication.authenticate(func, args);
        } else {
            popup(errorhandler(request.responseJSON), true);
        };
    } else {
        dialog(
            new Element('span', {
                'class':'error',
                'html':_('Sorry, a problem occured. Please try again later...')
            })
        );
    };
}

/**
 * creates an object in the OSPFM server
 *
 * @param String object category
 * @param Object create parameters
 * @param Function success handler
 * @param Function error handler
 */
function api_create(category, parameters, handler, errorhandler) {
    var createargs = arguments;
    if (authentication.key) {
        parameters.key = authentication.key;
    }
    Xhr.load(api_url+category, {
        method: 'post',
        params: parameters,
        onSuccess: function(request) {
            api_success(request, handler)
        },
        onFailure: function(request) {
            api_failure(request, errorhandler, api_create, createargs)
        }
    });
};

/**
 * reads data from the OSPFM server
 *
 * @param String object category
 * @param String optional object identifier
 * @param Function optional data handler
 * @param Function optional error handler
 */
function api_read() {
    var uri,
        handler,
        errorhandler,
        readargs = arguments,
        parameters = {};
    if (authentication.key) {
        parameters.key = authentication.key
    };
    if (isString(readargs[1])) {
        uri = api_url+readargs[0]+'/'+readargs[1];
        handler = readargs[2] || function(){};
        errorhandler = readargs[3] || function(){};
    } else {
        uri = api_url+readargs[0],
        handler = readargs[1] || function(){};
        errorhandler = readargs[2] || function(){};
    }
    Xhr.load(uri, {
        params: parameters,
        onSuccess: function(request) {
            api_success(request, handler)
        },
        onFailure: function(request) {
            api_failure(request, errorhandler, api_read, readargs)
        }
    });
};

/**
 * updates data in the OSPFM server
 *
 * @param String object category
 * @param String object identifier
 * @param Object update parameters
 * @param Function success handler
 * @param Function error handler
 */
function api_update(category, objectid, parameters, handler, errorhandler) {
    var updateargs = arguments;
    if (authentication.key) {
        parameters.key = authentication.key;
    };
    Xhr.load(api_url+category+'/'+objectid, {
        method: 'post',
        params: parameters,
        onSuccess: function(request) {
            api_success(request, handler)
        },
        onFailure: function(request) {
            api_failure(request, errorhandler, api_update, updateargs)
        }
    });
};


/**
 * deletes data in the OSPFM server
 *
 * @param String object category
 * @param String object identifier
 * @param Function success handler
 * @param Function error handler
 */
function api_delete(category, objectid, handler, errorhandler) {
    var deleteargs = arguments,
        parameters = {};
    if (authentication.key) {
        parameters.key = authentication.key
    };
    Xhr.load(api_url+category+'/'+objectid, {
        method: 'delete',
        params: parameters,
        onSuccess: function(request) {
            api_success(request, handler)
        },
        onFailure: function(request) {
            api_failure(request, errorhandler, api_delete, deleteargs)
        }
    });
}


/**
 * gets the rate from a currency to another from the OSPFM server
 *
 * @param String "from" currency
 * @param String "to" currency
 * @param String handler
 * @param Float optional value to convert
 */
function api_rate(from, to, handler, value) {
    value = value === undefined ? 1 : value;
    if (from == 'PREF') {
        from = user_me.preferred_currency();
    };
    if (to == 'PREF') {
        to = user_me.preferred_currency();
    };
    if (from == to) {
        handler(value);
    } else {
        // If rate known and not older than 10 min (600000 ms) do not ask again
        if (api_rates[from+'-'+to] &&
            api_rates[from+'-'+to].date > Date.now() - 600000) {
            handler(
                (api_rates[from+'-'+to].rate * value).toFixed(
                        l10n_numbers.curdecimals
                    )
            )
        } else {
            Xhr.load(api_url+'currencies/'+from+'/rate/'+to, {
                onSuccess: function(request) {
                    do_additional(request.responseJSON.additional);
                    api_rates[from+'-'+to] = {
                        rate: request.responseJSON.response,
                        date: Date.now()
                    };
                    handler(
                        (request.responseJSON.response * value).toFixed(
                                l10n_numbers.curdecimals
                            )
                    );
                },
                onFailure: function(request) {
                    popup(_('Failed to get exchange rate, sorry'));
                },
            });
        };
    };
}
api_rates = {}

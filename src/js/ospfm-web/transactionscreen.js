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

transactionscreen = new Class(Screen, {
    prebind: ['resize', 'scrolled'],
    url:'/',
    element:function() {
        var addbutton = new Button('green', 'add')
                                .tooltip(_('Add a transaction')),
            searchbutton = new Button('blue', 'search').tooltip(_('Search')),
            searchbox = new SearchBox().insertTo($$('body')[0]);
        this.translist = new Element('div', {'id': 'transactionslist'})
                                .on('scroll', this.scrolled);
        addbutton.onClick(function() {
            this.translist.insert(new TransactionRow(), 'top');
            this.translist._.scrollTop = 0;
        }.bind(this));
        searchbutton.onClick(function(event) {
            event.stop();
            searchbox.show_or_hide();
        });
        $(document).onClick(function(event) {
            searchbox.hide();
        });


        this.transfilter = new Element('div', {
            'id': 'transactionstools'
        }).insert([
            addbutton,
            searchbutton
        ]);
        $(window).onResize(this.resize);
        return new Element('div').insert([
            this.transfilter,
            this.translist
        ]);
    },
    load:function(url, hash) {
        $('transactionslist').clean();
        this.list_transactions(hash);
        // Slight delay to let the API load the transactions list
        this.resize.delay(100);
    },
    resize:function() {
        var maincontent = $('maincontent'),
            tf = this.transfilter,
            tl = this.translist;
        tl.setHeight(
            maincontent.size().y - tf.size().y -
            maincontent.getStyle('padding-top').toInt() -
            maincontent.getStyle('padding-bottom').toInt() -
            tf.getStyle('margin-top').toInt() -
            tf.getStyle('margin-bottom').toInt() -
            tf.getStyle('border-top-width').toInt() -
            tf.getStyle('border-bottom-width').toInt() -
            tl.getStyle('margin-top').toInt() -
            tl.getStyle('margin-bottom').toInt() -
            tl.getStyle('border-top-width').toInt() -
            tl.getStyle('border-bottom-width').toInt()
        );
    },
    scrolled:function (event) {
        if (!this.scrolling) {
            this.scrolling = true;
            var last,
                filter,
                elem = this.translist._;
            // If scrolled to less than 75px from the bottom, load next data
            if (elem.scrollTop + elem.clientHeight > elem.scrollHeight - 75) {
                last = this.translist.children('div.transaction').pop();
                filter = location.hash.replace(/^#/, '');
                if (filter) {
                    filter += '&after='+last.data.id
                } else {
                    filter = 'after='+last.data.id
                };
                this.list_transactions(filter)
            } else {
                this.scrolling = false;
            };
        };
    },
    list_transactions:function(filter) {
        var url = 'transactions/filter?limit=50';
        if (filter) {
            url += '&'+filter;
        }
        if (!this.translist.first('div.alldisplayed')) {
            api_read(url, function(data) {
                if (data.length) {
                    data.forEach(function(item) {
                        this.translist.insert(
                            new TransactionRow(item)
                        )
                    }.bind(this));
                } else {
                    this.translist.insert(
                        new Element('div', {'class': 'alldisplayed'}).insert(
                            _('All transactions have been displayed!')
                        )
                    )
                }
                this.scrolling = false;
            }.bind(this));
        } else {
            this.scrolling = false;
        };
    }
});

SearchBox = new Class(Element, {
    prebind:['show_or_hide', 'do_search'],
    initialize:function() {
        var datefrom     = new Input({'class':'date', 'name':'datefrom',
                                      'id': 'searchdate'}),
            dateto       = new Input({'class':'date', 'name':'dateto'}),
            searchbutton = new Button('green', 'search', _('Search'),'submit'),
            cancelbutton = new Button('blue', 'cancel', _('Cancel'), 'reset');
        this.$super('div', {'class': 'searchbox'})
        this.onClick(function(event) {
            // Do not propagate a click here to the document
            // (prevent hiding the searchbox when clicking on it)
            event.stopPropagation();
        });
        this.hide();
        this.form = new Form().insert([
            new Element('label', {'html': _('Account'),
                                  'for': 'searchaccount'}),
            accounts.selectonly(null, 'account', null, null, true)
                            .set('id', 'searchaccount'),
            new Element('label', {'html': _('Category'),
                                  'for': 'searchcategory'}),
            new CategorySelector('category').set('id', 'searchcategory'),
            new Element('label', {'class': 'label','html':_('Date'),
                                  'for': 'searchdate'}),
            datefrom,
            new Element('span', {'class': 'betweendates', 'html': '-'}),
            dateto,
            new Element('div', {'class': 'bottombuttons'}).insert([
                cancelbutton,
                searchbutton
            ])
        ]).onSubmit(function(event) {
            event.preventDefault();
            this.do_search();
            this.hide();
        }.bind(this)).onReset(function() {
            // Delay the search to permit real reset before
            (function() {
                this.do_search();
                this.hide();
            }.bind(this)).delay(100);
        }.bind(this));
        this.insert(this.form);
        new Calendar().assignTo(datefrom);
        new Calendar().assignTo(dateto);
    },
    show_or_hide:function() {
        if (this.visible()) {
            this.hide();
        } else {
            this.show();
        }
    },
    do_search:function() {
        var values     = this.form.values(),
            accountid  = values.account.toInt(),
            categoryid = values.category,
            datefrom   = parse_loc_date(values.datefrom, true),
            dateto     = parse_loc_date(values.dateto, true),
            filter     = [],
            datestring = "-";

        if (accountid) {
            filter.push('account=' + accountid);
        };
        if (categoryid) {
            filter.push('category=' + categoryid);
        };
        if (datefrom) {
            datestring = datefrom + datestring;
        };
        if (dateto) {
            datestring += dateto;
        };
        if (datestring != '-') {
            filter.push('dates=' + datestring);
        };
        screens.load('/', filter.join('&'));
    }
})

init.on('go', function() {
    init.start(function() {
        screens.add(
            new transactionscreen()
        );
        init.success();
    });
});

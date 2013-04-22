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

CategoryCurrencyField = new Class(ObjectField, {
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
    }
});

Category = new Class(OspfmObject, {
    'category': 'categories',
    'key': 'id',
    initialize: function(data) {
        this.maincollection = categories;
        this.$super(data);
        this.fields = {
            'name': new StringField(this, 'name', _('Name'),
                                    null, null, null, 50),
            'currency': new CategoryCurrencyField(this, 'currency',
                                                  _('Currency'), null, null,
                                                  null, all_currencies),
            'year': new AmountField(this, 'year', _('Balance'), null, null,
                                    null, this.data.currency),
            'month': new AmountField(this, 'month', _('Balance'), null, null,
                                     null, this.data.currency),
            'week': new AmountField(this, 'week', _('Balance'), null, null,
                                    null, this.data.currency),
            '7days': new AmountField(this, '7days', _('Balance'), null, null,
                                     null, this.data.currency),
            '30days': new AmountField(this, '30days', _('Balance'), null, null,
                                      null, this.data.currency)
        };
    },
    toString:function() {
        return this.data.name;
    },
    shortRepr:function() {
        var element = new Element('span', {'html': this.data.name});
        if (this.deepness) {
            element.setStyle('margin-left', (10*this.deepness)+'px')
                .insert(new Icon('subcoll'), 'top');
        };
        return element;
    },
    fullRepr:function() {
        var element = new Element('span', {'html': this.data.name});
        if (this.collection.parent) {
            element.insert(new Icon('subcoll'), 'top');
            element.insert(this.collection.parent.fullRepr(), 'top');
        }
        return element;
    },
    createsuccess:function() { return _('Created category'); },
    createfailed:function() { return _('Error creating category'); },
    updatesuccess:function() { return _('Updated category'); },
    updatefailed:function() { return _('Error updating category'); },
    deletesuccess:function() { return _('Deleted category'); },
    deletefailed:function() { return _('Error deleting category'); },
});


multi_category_creator = {
    start: function(newcategories, selector) {
        multi_category_creator.catlist = newcategories;
        multi_category_creator.selector = selector;
        multi_category_creator.pos = 0;
        // on added ? template on created ? recursive ?
        categories.on('added', multi_category_creator.next);
        categories.on('added in subcategory', multi_category_creator.next);
        multi_category_creator.create();
    },
    next: function(createdcategory) {
        multi_category_creator.pos += 1;
        if (multi_category_creator.pos ==
            multi_category_creator.catlist.length) {
            // Previous pass created the last category of the list, stop now
            categories.stopObserving(multi_category_creator.next);
            multi_category_creator.selector._list_categories(
                categories.list(),
                createdcategory.data.id
            );
            multi_category_creator.selector.autocompleter.setOptions({
                local: multi_category_creator.selector.categorieslist
            })
        } else {
            multi_category_creator.create(createdcategory)
        }
    },
    create: function(previous) {
        var category =
                    multi_category_creator.catlist[multi_category_creator.pos],
            catdata = {
                'name': category[0],
                'currency': user_me.preferred_currency()
            },
            parentid = category[2];
        if (parentid == 'previous') {
            catdata.parent = previous.data.id;
            previous.data.children.template.create(catdata);
        } else if (parentid) {
            catdata.parent = parentid;
            categories.get(parentid).data.children.template.create(catdata);
        } else {
            categories.template.create(catdata);
        };
    }
};

CategorySelector = new Class(Input, {
    prebind: ['_list_categories'],
    initialize:function(inputname, selectedid) {
        this.$super({'name':inputname});
        this._list_categories(categories.list(), selectedid);
        this.autocompleter = new Autocompleter(this, {
            minLength: 0,
            threshold: 0,
            local: this.categorieslist
        });
        this.onFocus(function() {
            this.autocompleter.trigger();
        });

        function changed() {
            var creationintro,
                newcategories,
                categorieslist,
                yesbuttontext,
                textvalue;
            this.removeClass('wrong');
            if (this._.value == '' || this.pointers[this._.value]) {
                // Everything is OK, fire "changed"
                this.fire('changed');
            } else {
                textvalue = this.getValue(true);
                newcategories = this._categories_to_create(textvalue);
                categorieslist = new Element('ul');
                if (newcategories.length > 1) {
                    creationintro = _('Do you want to create the following categories?');
                    yesbuttontext = _('Yes, create the categories')
                } else {
                    creationintro = _('Do you want to create the following category?');
                    yesbuttontext = _('Yes, create the category')
                }
                newcategories.forEach(function(category) {
                    if (category[2]) {
                        categorieslist.insert(
                            new Element('li', {
                                'html':
                               _('"%CATEGORYSHORTNAME%" in "%PARENTFULLNAME%"')
                                   .replace('%CATEGORYSHORTNAME%', category[0])
                                    .replace('%PARENTFULLNAME%', category[1])
                            })
                        );
                    } else {
                        categorieslist.insert(
                            new Element('li', {
                                'html': _('"%CATEGORYNAME%"')
                                    .replace('%CATEGORYNAME%', category[0])
                            })
                        );
                    };
                });
                dialog([
                    new Element('p', {
                        'html':_('This category does not exist:')
                    }),
                    new Element('p', {
                        'html': _('"%CATEGORYNAME%"')
                                    .replace('%CATEGORYNAME%', textvalue)
                    }),
                    new Element('p', {'html': creationintro}),
                    categorieslist,
                    new Element('div', {'class':'bottombuttons'}).insert([
                        new Button('green', 'accept', yesbuttontext).onClick(
                            function() {
                                var selectednewid;
                                multi_category_creator.start(
                                    newcategories,
                                    this
                                );
                                close_dialog();
                            }.bind(this)
                        ),
                        new Button('red', 'cancel', _('No thanks')).onClick(
                            function() {
                                this.addClass('wrong');
                                close_dialog();
                            }.bind(this)
                        )
                    ])
                ])
            }
        };
        this.autocompleter.onDone(changed.bind(this));
        this.onBlur(changed.bind(this));
    },
    _list_categories:function(categorieslist, selectedid, prefix, subcall) {
        if (!subcall) {
            this.categorieslist = [];
            this.pointers = {};
        };
        prefix = prefix || '';
        categorieslist.forEach(function(category) {
            if (category.data.id == selectedid) {
                this.setValue(prefix+category.data.name);
            }
            this.categorieslist.push(prefix+category.data.name);
            this.pointers[prefix+category.data.name] = category.data.id
            if (category.data.children) {
                this._list_categories(
                    category.data.children.list(),
                    selectedid,
                    prefix + category.data.name + ' > ',
                    true
                );
            };
        }, this);
    },
    /**
     * List categories to create to obtain an existing category fullname
     *
     * @param String category fullname
     * @param String optional categories list (for recursive calls)
     *
     * @return Array list of categories to create, in the following form:
     *
     * [
     *   [ <textual subname>, <textual parent fullname>, <parent ID> ],
     *   [ <textual subname>, <textual parent fullname>, <parent ID> ]
     *   ...
     * ]
     *
     */
    _categories_to_create:function(textvalue, categories) {
        var separatorindex,
            mysubname,
            parentid,
            parentname,
            categories = categories || [],
            separatorindex = textvalue.lastIndexOf('>');
        if (separatorindex == -1) {
            // Root category
            categories.push([textvalue, '', null]);
        } else {
            // Child category
            parentname = textvalue.slice(0, separatorindex).trim();
            mysubname = textvalue.slice(separatorindex+1).trim();
            parentid = this.pointers[parentname] || 'previous';
            if (parentid == 'previous') {
                this._categories_to_create(parentname, categories);
            };
            categories.push([ mysubname, parentname, parentid ]);
        };
        return categories;
    },
    /**
     * returns the category ID
     *
     * @param Boolean return the value displayed in the input instead of the ID
     * @return mixed requested value
     */
    getValue:function(visual) {
        if (visual) {
            // Remove multiple >>'s, even when separated by spaces
            return this.$super()
                        .replace(/\s*(>\s*)*>\s*/g, ' > ')
                        .replace(/^ > | > $/g, '');
        } else {
            return this.pointers[this._.value];
        };
    },
    value: function(value) {
        if (this.value.caller==Autocompleter.prototype.trigger ||
            this.value.caller==Autocompleter.prototype.keypressed) {
            return this.getValue(true);
        } else {
            return this.$super(value);
        }
    },
});

additional.categoriesbalance = function(data) {
    data.forEach(function(categorydata) {
        var category = categories.get(categorydata.id);
        category.data.year = categorydata.year;
        category.data.month = categorydata.month;
        category.data.week = categorydata.week;
        category.data['7days'] = categorydata['7days'];
        category.data['30days'] = categorydata['30days'];
        category.fire('changed');
    });
};

categories = new Collection(Category, true, 'name', true, true, true);

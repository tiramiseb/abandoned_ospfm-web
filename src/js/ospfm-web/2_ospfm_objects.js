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

////////// Collections

/**
 * collection of OSPFM objects
 */
Collection = new Class(Observer, {
    /**
     * constructor
     *
     * for recursive objects, parent is always identified by the 'parent' field
     * and children are always placed in the 'children' field
     *
     * @param OspfmObject template for this collection
     * @param Boolean optional autofill collection (default is true)
     * @param String optional sort key
     * @param Boolean optional ascending sorting
     * @param Boolean optional case-insensitive sorting
     * @param Boolean optional recursive objects
     */
    initialize: function(template, autofill, sortkey, ascending,
                         nocase, recursive) {
        autofill = autofill === undefined ? true : autofill;
        this.sortkey = sortkey;
        this.ascending = ascending;
        this.nocase = nocase;
        this.recursive = recursive;
        this.deepness = 0;
        // The "objects" array contains all objects, ordered
        this.objects = [];
        // The "pointers" object contains all objects, easily gettable
        this.pointers = {};
        init.on('go', function() {
            this.maketemplate(template);
            // Automatically fill the collection
            if(autofill) {
                init.start(function() {
                    api_read(this.template.category, function(data) {
                        this.autofill(data);
                        init.success();
                    }.bind(this), function() {
                        init.failed();
                    });
                }.bind(this));
            };
        }.bind(this));
    },
    /**
     * create the template object
     *
     * @param OspfmObject template object
     */
    maketemplate: function(template) {
        var recursive = this.recursive,
            template = new template(template).on('created', function(object) {
                            this.add(object);
                        }.bind(this));
        if (recursive) {
            template.recursive = recursive;
        }
        this.template = template;
    },
    /**
     * automatically fills the collections from information in data
     *
     * @param Object data for OspfmObjects
     */
    autofill: function(data) {
        data.forEach(function(info) {
            this.add(new this.template.constructor(info));
        }, this);
    },
    /**
     * gets a single object
     *
     * @return OspfmObject the object
     */
    get: function(key) {
        var object = this.pointers[key];
        if (!object && this.recursive) {
            this.objects.some(function(objectdata) {
                object = objectdata.data.children.get(key);
                return !!object;
            });
        };
        return object;
    },
    /**
     * lists all objects
     *
     * @return Array list of objects
     */
    list: function() {
        return this.objects;
    },
    /**
     * adds an object to the array and keep it sorted
     * (not to the pointers)
     *
     * @param OspfmObject object to add
     * @return Number index of the object
     */
    _sorted_add_to_array:function(object) {
        var i,
            thiskey,
            inserted = false,
            objects  = this.objects;
        if (this.nocase) {
            thiskey = object.data[this.sortkey].toLowerCase();
            if (this.ascending) {
                for (i=0; i<objects.length; i++) {
                    if (objects[i].data[this.sortkey]
                            .toLowerCase() > thiskey) {
                        objects.splice(i, 0, object);
                        inserted = true;
                        break;
                    };
                };
            } else {
                for (i=0; i<objects.length; i++) {
                    if (objects[i].data[this.sortkey]
                            .toLowerCase() < thiskey) {
                        objects.splice(i, 0, object);
                        inserted = true;
                        break;
                    };
                };
            };
        } else {
            thiskey = object.fields[this.sortkey].value;
            if (this.ascending) {
                for (i=0; i<objects.length; i++) {
                    if (objects[i].data[this.sortkey] > thiskey) {
                        objects.splice(i, 0, object);
                        inserted = true;
                        break;
                    };
                };
            } else {
                for (i=0; i<objects.length; i++) {
                    if (objects[i].data[this.sortkey] < thiskey) {
                        objects.splice(i, 0, object);
                        inserted = true;
                        break;
                    };
                };
            };
        };
        if (!inserted) {
            objects.push(object);
        };
        return i;
    },
    /**
     * removes an object from the array
     * (not from the pointers)
     *
     * @param OspfmObject object to remove
     * @return Number previous index of the object
     */
    _remove_from_array:function(object) {
        var i,
            objects = this.objects;
        for (i=0; i<objects.length; i++) {
            if (objects[i] == object) {
                objects.splice(i, 1);
                break;
            };
        };
        return i;
    },
    /**
     * adds an object to the collection
     *
     * @param OspfmObject object to add
     */
    add: function(object) {
        var position,
            newcollection,
            move_object,
            remove_object_from_collection,
            deepness  = this.deepness,
            objects   = this.objects,
            recursive = this.recursive;
        if (this.sortkey) {
            position = this._sorted_add_to_array(object);
        } else {
            position = objects.length;
            objects.push(object);
        };
        object.collection = this;
        this.pointers[object.getkey()] = object;
        // If the collection is recursive, make the objects know it
        if (recursive) {
            object.recursive = recursive;
            // If the object does not already contain a subcollection, add it
            if (!object.data.children || !object.data.children.objects) {
                newcollection = new Collection(
                   null, false, this.sortkey, this.ascending, this.nocase, true
                );
                newcollection.parent = object;
                newcollection.maketemplate(this.template.constructor);
                if (object.data.children) {
                    newcollection.autofill(object.data.children);
                };
                object.data.children = newcollection;
            };
            object.set_deepness(deepness);
        };
        move_object = (function () {
            /*
             * Place the object on the right position when changed
             *
             * The object is always removed and then reinserted, this
             * behavior may be improved
             *
             * However, the "moved" signal is fired only if the original
             * place and the destination are different
             */
            var original_position = this._remove_from_array(object),
                new_position      = this._sorted_add_to_array(object);
            if (original_position != new_position) {
                this.fire('moved', object, original_position,new_position);
            };
        }).bind(this);
        // Collection modification when object is modified or deleted
        if (this.sortkey) {
            object.on('changed', move_object);
        };
        remove_object_from_collection = (function () {
            object.stopObserving(remove_object_from_collection);
            object.stopObserving(move_object);
            this._remove_from_array(object);
            delete this.pointers[object.getkey()];
        }).bind(this);
        object.on('deleted', remove_object_from_collection);
        this.fire('added', object, position);
        if (this != categories) {
            categories.fire('added in subcategory', object);
        };
    },
    set_deepness: function(deepness) {
        this.deepness = deepness;
        this.objects.forEach(function(obj) {
            obj.set_deepness(deepness);
        });
    },
    /**
     * displays a HTML select field for this collection, updated when
     * objects are added
     *
     * @param mixed key of the selected object
     * @param String name of the input
     * @param Collection collection to merge in this select
     * @param String 'top' or 'bottom' (defaults to bottom)
     */
    htmlselect: function(selected, name, merge, position) {
        position = position || 'bottom';
        var container = new Element('span'),
            select    = this.selectonly(selected, name, merge, position);
        // What to do when data change...
        function redoselect() {
            container.update(
                this.selectonly(select.getValue(), name, merge, position)
            );
        };
        this.on('added', redoselect.bind(this));
        this.on('moved', redoselect.bind(this));
        return container.insert(select);
    },
    /**
     * returns a HTML select field for this collection
     *
     * @param mixed key of the selected object
     * @param String name of the select
     * @param Collection collection to merge in this select
     * @param String 'top' or 'bottom' (defaults to top)
     * @param Boolean display a empty option before all others
     */
    selectonly:function(selected, name, merge, position, emptyfirst) {
        var select = new Input({
                            'type': 'select',
                            'name': name
                        })
        if (emptyfirst) {
            select.insert(new Element('option', {
                'class':'empty',
                'html':'----'
            }));
        };
        select.insert(
            this.selectoptions(selected)
        );
        if (merge) {
            select.insert(
                merge.selectoptions(selected),
                position
            );
        };
        return select;
    },
    /**
     * returns options for a HTML select field for this collection
     *
     * @return Array "option" elements list
     */
    selectoptions:function(selected) {
        var options = [];
        this.objects.forEach(function(obj) {
            options.push(obj.selectoption(selected))
        });
        return options;
    },
    /**
     * display an edition table
     *
     * @param Array list of fields to display
     * @return Element displayable collection
     */
    htmledit: function(displayfields) {
        var addrow,
            table    = new Element('div', {
                            'class': 'editobjects ' + this.template.category
                        }),
            titlerow = new Element('div', {
                            'class': 'titlerow'
                        });
        displayfields.forEach(function(field) {
            titlerow.insert(new Element('span', {
                'class': 'editcell ' + field,
                html: this.template.fields[field].name
            }));
        }, this);
        table.insert(titlerow);
        table.insert(this.htmlrows(displayfields));
        addrow = this.template.editrow(displayfields);
        table.insert(addrow);
        function addobject(object, position) {
            // target position = "after the element at <position>"
            // because table.children = titlerow + all objectrows + addrow
            table.children()[position].insert(
                object.displayrow(displayfields),
                'after'
            );
        };
        function moveobject(object, original_position, new_position) {
            var children = table.children();
            // original position = <original position> + 1
            // and new position = "after the element at <position>"
            // because table.children = titlerow + all objectrows + addrow
            children[new_position].insert(
                children[original_position+1].remove(),
                'after'
            );
        };
        this.on('added', addobject);
        this.on('added in subcategory', function() {
            this.stopObserving('added', addobject);
            this.stopObserving('moved', moveobject);
            function replacetable() {
                table.replace(this.htmledit(displayfields));
            };
            replacetable.bind(this).delay(100);
        });
        this.on('moved', moveobject);
        return table;
    },
    /**
     * display the row for object editing (without title or add row)
     *
     * @param Array fields to display
     * @return Array rows elements
     */
    htmlrows: function(displayfields) {
        var rows = [];
        this.objects.forEach(function(obj) {
            rows.push(obj.displayrow(displayfields));
        });
        return rows;
    },
});


////////// Objects

OspfmObject = new Class(Observer, {
    /**
     * constructor
     *
     * @param Object initial data for the object
     * @param Object fields for the object
     */
    initialize: function(data, fields) {
        this.data = data || {};
        this.fields = fields || {};
    },
    /**
     * creates a new object
     *
     * @param Object data for the new object
     */
    create:function(data) {
        api_create(this.category, data,
        function(data) { // Success handler
            var message = this.createsuccess(data);
            this.fire('created', new this.constructor(data));
            return message;
        }.bind(this),
        function(data) { // Failure handler
            return this.createfailed(data);
        }.bind(this));
    },
    /**
     * deals with values
     * OVERRIDE THIS IN OBJECTS, DO NOT CALL $super
     *
     * @param Object new data
     */
    createsuccess:function() {
        return _('Creation successful');
    },
    /**
     * deals with update failure
     * OVERRIDE THIS IN OBJECTS, DO NOT CALL $super
     *
     * @param Object new data
     */
    createfailed:function() {
        return _('Creation failed');
    },
    /**
     * updates the object, in the server and here
     *
     * @param Object new data for the object
     * @param function optional additional handler
     */
    update:function(data, additional_handler) {
        var children,
            recursive = this.recursive;
        if (recursive) {
            children = this.data.children;
        }
        api_update(this.category, this.getkey(), data,
        function(data) { // Success handler
            var message = this.updatesuccess(data);
            this.data = data;
            // Update select options
            $$('option.' + this.category +'-' + this.getkey())
                .forEach(function(opt) {
                    opt.replace(this.selectoption());
                }, this);
            // Update ObjectFields
            $$('span.' + this.category + '-' + this.getkey())
                .each('update', ''+this);
            // Keep the subcollection
            if (recursive) {
                this.data.children = children;
            }
            this.fire('changed');
            if (additional_handler) {
                additional_handler();
            };
            return message;
        }.bind(this),
        function(data) { // Failure handler
            return this.updatefailed(data);
        }.bind(this));
    },
    /**
     * deals with new values
     * OVERRIDE THIS IN OBJECTS, DO NOT CALL $super
     *
     * @param Object new data
     */
    updatesuccess:function() {
        return _('Update successful');
    },
    /**
     * deals with update failure
     * OVERRIDE THIS IN OBJECTS, DO NOT CALL $super
     *
     * @param Object new data
     */
    updatefailed:function() {
        return _('Update failed');
    },
    /**
     * displays the object as a row for Collection.htmledit
     *
     * @param Arrow fields to display
     * @return Element the row
     */
    del:function() {
        api_delete(this.category, this.getkey(),
            function(data) { // Success handler
                var message = this.deletesuccess(data);
                // If recursive, change the childrens' parent
                if (this.recursive && this.data.children) {
                    this.data.children.list().forEach(function(child) {
                        delete child.data.parent;
                        child.maincollection.add(child);
                    });
                };
                $$('option.' + this.category + '-' + this.getkey())
                                                               .each('remove');
                this.fire('deleted');
                return message;
            }.bind(this),
            function(data) { // Failure handler
                return this.deletefailed(data);
            }.bind(this)
        );
    },
    /**
     * deals with object deletion
     * OVERRIDE THIS IN OBJECTS, DO NOT CALL $super
     *
     * @param Object new data
     */
    deletesuccess:function() {
        return _('Deletion successful');
    },
    /**
     * deals with update failure
     * OVERRIDE THIS IN OBJECTS, DO NOT CALL $super
     *
     * @param Object new data
     */
    deletefailed:function() {
        return _('Deletion failed');
    },
    set_deepness: function(deepness) {
        var children = this.data.children;
        this.deepness = deepness;
        if (children) {
            children.set_deepness(deepness+1);
        };
    },
    displayrow: function(displayfields) {
        // Create the row
        var buttonscell,
            handle,
            wholetable,
            roottarget,
            maincollection = this.maincollection,
            deepness       = this.deepness,
            recursive      = this.recursive,
            objectrow      = new Element('div', {'class': 'editrow'}),
            rowcontainer   = new Element('div', {'class': 'rowcontainer'})
                                .insert(objectrow);
        if (recursive) {
            handle = new Icon('movelines')
                        .addClass('recursivehandle blue');
            rowcontainer.makeDraggable({
                'handle': handle,
                'scroll': false,
                'revert': true,
                'axis': 'y',
                'onStart': function() {
                    if (!wholetable) {
                        wholetable = rowcontainer.parent('div.editobjects');
                        roottarget = wholetable.first('div.roottarget');
                        if (!roottarget) {
                            roottarget = new Element('div', {
                                'class': 'editrow roottarget',
                            }).insert(
                                new Element('span', {
                                    'class': 'editcell',
                                    'html': _('Place this category at root')
                                })
                            ).makeDroppable();
                            wholetable.children().slice(-1)[0].insert(
                                roottarget,
                                'before'
                            )
                        };
                    };
                    roottarget.show();
                }.bind(this),
                'onStop': function() {
                    roottarget.hide();
                }.bind(this),
                'onDrop': function(droppable) {
                    var to = droppable.element.object;
                    this.fire('deleted');
                    if (to) {
                        this.update({ 'parent': to.data.id }, function() {
                            to.data.children.add(this);
                            wholetable.replace(
                                maincollection.htmledit(displayfields)
                            );
                        }.bind(this));
                    } else {
                        // If the destination element has no object property
                        // it's because it is the "root" line
                        this.update({ 'parent': 'NONE' }, function() {
                            maincollection.add(this);
                            wholetable.replace(
                                maincollection.htmledit(displayfields)
                            );
                        }.bind(this));
                    };
                    this.fire('moved between collections');
                }.bind(this)
            });
            objectrow.makeDroppable({
                'accept': 'div.rowcontainer'
            }).onMouseover(function(event) {
                // Do not accept dropping on self
                objectrow._droppable.options.accept = 'div.donotaccept';
            }).onMouseout(function(event) {
                objectrow._droppable.options.accept = 'div.rowcontainer';
            }).insert(handle).object = this;
        };
        // Create all fields
        displayfields.forEach(function(fieldname, index) {
            var field = this.fields[fieldname].display();
            if (deepness && index == 0) {
                field.first()
                    .setStyle('padding-left', (5+20*(deepness-1))+'px')
                    .insert(new Icon('subcoll'), 'top');
            };
            objectrow.insert(field);
        }, this);
        // Create buttons
        buttonscell = new Element('span', {
            'class': 'buttonscell'
        }).insert([
            new Button('blue', 'edit')
                .onClick(function(event) {
                    objectrow.replace(this.editrow(displayfields));
                    this.stopObserving(updaterow);
                    this.stopObserving(deleterow);
                }.bind(this))
                .tooltip(_('Edit'))
            ,
            new Button('red', 'del')
                .onClick(function() {
                    this.del();
                }.bind(this))
                .tooltip(_('Delete'))
        ]);
        objectrow.insert(buttonscell);
        if (recursive && this.data.children) {
            rowcontainer.insert(
                this.data.children.htmlrows(displayfields)
            );
        };
        function updaterow () {
            rowcontainer.replace(this.displayrow(displayfields));
            this.stopObserving(updaterow);
            this.stopObserving(deleterow);
        };
        function deleterow() {
            rowcontainer.remove();
            this.stopObserving(updaterow);
            this.stopObserving(deleterow);
        };
        this.on('changed', updaterow);
        this.on('deleted', deleterow);
        return rowcontainer;
    },
    /**
     * displays the object as an editable row for Collection.htmledit
     *
     * @param Arrow fields to display
     * @return Element the row
     */
    editrow: function(displayfields) {
        var hasdata     = !!this.getkey(),
            objectrow   = new Element('div', {
                                'class': 'editrow'
                            }),
            form        = new Form(),
            buttonscell = new Element('span', {
                                'class': 'buttonscell'
                            });
        // If recursive, create handle
        if (this.recursive) {
            form.insert(
                new Icon('movelines').addClass('inactivehandle')
            )
        }
        // Create all fields
        displayfields.forEach(function(fieldname, index) {
            var field = this.fields[fieldname].input();
            // If this object is a child of another object
            if (this.deepness && index == 0) {
                field.first()
                    .setStyle('padding-left', (5+20*(this.deepness-1))+'px')
                    .insert(new Icon('subcoll'), 'top')
            };
            form.insert(field);
        }, this);
        // Create buttons
        if (hasdata) {
            buttonscell.insert([
                new Button('green', 'accept', _('Apply'), 'submit')
            ])
            form.onSubmit(function(event) {
                event.preventDefault();
                this.update(event.currentTarget.values());
            }.bind(this));
        } else {
            buttonscell.insert(
                new Button('green', 'add', _('Add'), 'submit')
            );
            form.onSubmit(function(event) {
                event.preventDefault();
                this.create(event.currentTarget.values());
            }.bind(this));
        };
        form.insert(buttonscell);
        objectrow.insert(form);
        function updaterow () {
            objectrow.parent().replace(this.displayrow(displayfields));
            this.stopObserving(updaterow);
            this.stopObserving(deleterow);
        };
        function deleterow() {
            objectrow.parent().remove();
            this.stopObserving(updaterow);
            this.stopObserving(deleterow);
        };
        this.on('changed', updaterow);
        this.on('deleted', deleterow);
        this.on('created', function() {
            form.reset();
        });

        return objectrow;
    },
    /**
     * creates an "option" element
     *
     * @param String key of the selected object
     * @return Element the option
     */
    selectoption: function(selected) {
        var key = this.getkey(),
            option = new Element('option', {
                            'value': key,
                            'class': this.category+'-'+key,
                            'html': ''+this
                        });
        option._.defaultSelected = key == selected;
        return option;

    },
    /**
     * gets the object's key
     *
     * @return mixed key
     */
    getkey: function() {
        return this.data[this.key];
    },
});


////////// Objects fields

Field = new Class(Observer, {
    initialize: function(obj, id, name, prefix, suffix, additional_class) {
        this.object = obj;
        this.id = id;
        this.name = name;
        this.add_class = additional_class;
        // Prefix
        if (isString(prefix)) {
            this.prefix = function () {
                return new Element('span').insert(prefix);
            };
        } else if (isFunction(prefix)) {
            this.prefix = prefix;
        } else {
            this.prefix = function() {
                return new Element('span');
            };
        };
        // Suffix
        if (isString(suffix)) {
            this.suffix = function () {
                return new Element('span').insert(suffix);
            };
        } else if (isFunction(suffix)) {
            this.suffix = suffix;
        } else {
            this.suffix = function() {
                return new Element('span');
            };
        };
    },
    /**
     * returns the field's value
     *
     * @return mixed the field's value
     */
    value:function() {
        return this.object.data[this.id]
    },
    /**
     * returns a HTML element displaying this field
     *
     * @param Element optional element to display (when used with this.$super)
     * @return Element element to display, with prefix and suffix
     */
    display:function(content) {
        var element = new Element('span', {
                        'class': 'editcell ' + this.id
                      })
                        .insert(this.prefix())
                        .insert(content || this.value())
                        .insert(this.suffix());
        if (this.add_class) {
            element.addClass(this.add_class);
        }
        return element;
    },
    /**
     * returns a HTML element getting input for this field from the user
     *
     * @param Element optional element to display (when used with this.$super)
     * @return Element element to display, with prefix and suffix
     */
    input: function(content) {
        var prefix,
            suffix,
            inside,
            inputsizeinterval_wrapper,
            container = new Element('span', {
                            'class': 'editcell ' + this.id
                        });
        if (this.add_class) {
            container.addClass(this.add_class);
        }
        if (content) {
            prefix = this.prefix();
            suffix = this.suffix();
            inside = new Element('span')
                        .setStyle('display', 'inline-block')
                        .insert(content);
            // Resize the field to the correct size (container-prefix-suffix)
            // as soon as its width is known (ie. when it is displayed)
            inputsizeinterval_wrapper = function() {
                if (inside._.offsetWidth != 0) {
                    inputsizeinterval_wrapper.stop();
                    inside.setWidth(
                        container._.offsetWidth-
                        prefix._.offsetWidth-suffix._.offsetWidth
                    );
                };
            }.periodical(10);
            container.insert(prefix).insert(inside).insert(suffix);
        };
        return container;
    }
});

StringField = new Class(Field, {
    initialize: function(obj, id, name, prefix, suffix,
                         additional_class, maxlength) {
        this.$super(obj, id, name, prefix, suffix, additional_class);
        this.maxlength = maxlength;
    },
    input: function() {
        return this.$super(new Input({
            'name': this.id,
            'placeholder': this.name,
            'maxlength': this.maxlength,
            'value': this.value() || ''
        }));
    }
});

function validateinputnumber(input, currency, absolute, nochange) {
    var realvalue,
        value;
    if (nochange) {
        realvalue = input.realvalue.replace(' ', '');
    } else {
        realvalue = input._.value.replace(' ', '');
        input.realvalue = realvalue;
    };
    realvalue = realvalue.replace(',', '.');
    if (absolute) {
        value = Math.abs(parseFloat(realvalue));
    } else {
        value = parseFloat(realvalue);
    }
    if (!isNaN(value)) {
        input.removeClass('wrong');
        input.numericvalue = value;
        input.setValue(loc_number(value, currency, true));
    } else {
        input.addClass('wrong');
    }
}
AmountField = new Class(Field, {
    prebind: ['update_elements'],
    initialize: function(obj, id, name, prefix, suffix,
                         additional_class, currency, absolute) {

        this.$super(obj, id, name, prefix, suffix, additional_class);
        this.currency = currency;
        this.absolute = absolute; // Refuse negative numbers
        this.all_elements = []
        obj.on('changed', this.update_elements);
    },
    update_elements: function() {
        var i,
            all_elements = this.all_elements,
            // This splice is used to copy the string
            // (new string, not reference)
            old_elements = all_elements.splice(0, all_elements.length);
        if (this.object.data.currency) {
            this.currency = this.object.data.currency;
        };
        for (i=0; i<old_elements.length; i++) {
            if (old_elements[i].parent()) {
                old_elements[i].replace(this.displaycontent());
            };
        };
    },
    displaycontent: function() {
        var content,
            rate_to_preferred;
        if (this.currency == 'PREF') {
            content = new Element('span').insert(
                loc_number(this.value(), user_me.preferred_currency())
            );
        } else {
            content = new Element('span').insert(
                loc_number(this.value(), this.currency)
            );
        };
        this.all_elements.push(content);
        return content;
    },
    display: function() {
        var content = this.displaycontent();
        this.all_elements.push(content);
        return this.$super(content);
    },
    input: function() {
        var currency,
            input = new Input({
                        'name': this.id,
                        'placeholder': this.name,
                    }).onChange(function(event) {
                        var currency;
                        if (this.currency == 'PREF') {
                            currency = user_me.preferred_currency();
                        } else {
                            currency = this.currency;
                        };
                        validateinputnumber(input, currency, this.absolute);
                    }.bind(this)).onBlur(function(event) {
                        var currency;
                        if (this.currency == 'PREF') {
                            currency = user_me.preferred_currency();
                        } else {
                            currency = this.currency;
                        };
                        if (input.realvalue == input._.value) {
                            validateinputnumber(input, currency,this.absolute);
                        }
                    }.bind(this)).onFocus(function(event) {
                        if (input.realvalue) {
                            input.setValue(input.realvalue);
                        };
                    }),
            value = this.value();

        if (value) {
            input.set('value', loc_number(value, null, true));
        } else {
            input.set('value', '0');
        };
        if (this.currency == 'PREF') {
            currency = user_me.preferred_currency();
        } else {
            currency = this.currency;
        };
        validateinputnumber(input, currency, this.absolute);
        input.getValue = function() {
            return this.numericvalue;
        };
        input.setRealValue = function(value) {
            input.realvalue = value;
            validateinputnumber(input, currency, this.absolute, true);
        };
        return this.$super(input);
    }
});

ObjectField = new Class(Field, {
    initialize: function(obj, id, name, prefix, suffix,
                         additional_class,collection) {
        this.$super(obj, id, name, prefix, suffix, additional_class);
        this.collection = collection;
    },
    display: function() {
        var object  = this.collection.get(this.value()),
            content = new Element('span', {
                            'class': object.category + '-' + object.getkey(),
                            'html':''+object
                        });
        return this.$super(content);
    },
    input: function() {
        return this.$super(
            this.collection.htmlselect(this.value(), this.id)
        );
    }
});

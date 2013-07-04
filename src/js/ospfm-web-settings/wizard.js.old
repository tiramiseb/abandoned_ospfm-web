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

function wizardconfirm() {
    var applybutton  = new Button('red', 'apply',
                                  _('Yes, erase and reinitialize my data')),
        cancelbutton = new Button('green', 'cancel', _('No, go back'));
    if (authentication.demo) {
        popup(_('Demo accounts cannot be reinitialized'), true)
    } else {
        cancelbutton.onClick(close_dialog);
        applybutton.onClick(function() {
            wizard();
        });
        dialog(
            [
                new Element('h1', {'html':_('Really reinitialize?')}),
                new Element('p', {
                    'html':_('Do you really want to reinitialize your everCount data?')
                }),
                new Element('p', {
                    'html':_('Everything will be erased : accounts, categories, transactions... You will not be able to recover anything of these.')
                }),
                new Element('div', {'class':'bottombuttons'}).insert([
                    applybutton,
                    cancelbutton
                ])
            ]
        )
    }
};

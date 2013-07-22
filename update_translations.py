#!/usr/bin/env python
#
#    Copyright 2012-2013 Sebastien Maccagnoni-Munch
#
#    This file is part of OSPFM-web.
#
#    OSPFM-web is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as published
#    by the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    OSPFM-web is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with OSPFM-web.  If not, see <http://www.gnu.org/licenses/>.

###############################################################################

SOURCEDIR='src/js'
TRANSLATIONDIR='src/locale'
OSPFMSOURCEDIR='../ospfm/ospfm'

NUMBERS = (
    ('decimal', '.'),
    ('digits', 3),
    ('separator', ''),
    ('curdecimals', 2),
    ('posnum', 'N'),
    ('poscur', 'NC'),
    ('pospct', 'N%'),
    ('negnum', '-N'),
    ('negcur', '-NC'),
    ('negpct', '-N%'),
)

NAME = (
    ('nameandnick', 'F L (N)'),
    ('fullname', 'F L'),
    ('shortname', 'F'),
    ('nickname', '(N)'),
)

DATE = (
    ('first_day_of_week', 'monday'),
    ('shortformat', '%d/%m/%Y'),
)

CURRENCY = (
    ('completename', 'C: N (S)'),
)

CURRENCIES = ('AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYI', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF')

###############################################################################

import codecs
import datetime
import json
import os
import re
import shutil
import tempfile



def get_all_strings():
    strings = {}
    for dirdata in os.walk(SOURCEDIR):
        for filename in dirdata[2]:
            if filename.endswith('.js'):
                for string in get_strings(
                                    os.path.join(dirdata[0], filename)
                                ).items():
                    if string[0] in strings:
                        strings[string[0]].extend(string[1])
                    else:
                        strings[string[0]] = string[1]
    for dirdata in os.walk(OSPFMSOURCEDIR):
        for filename in dirdata[2]:
            if filename.endswith('.py'):
                for string in get_ospfm_api_error_strings(
                                    os.path.join(dirdata[0], filename)
                                ):
                    if string in strings:
                        strings[string].append(
                            'OSPFM error message in {}'.format(filename)
                        )
                    else:
                        strings[string] = [
                            'OSPFM error message in {}'.format(filename)
                        ]
    for string in get_invitation_strings():
        if string in strings:
            strings[string].append('Invitation dialogs')
        else:
            strings[string] = ['Invitation dialogs']
    return strings



def get_strings(filename):
    strings = {}
    with open(filename, 'r') as f:
        for linenb, line in enumerate(f.readlines()):
            for string in re.findall("_\('([^\']*)'\)", line):
                if string in strings:
                    strings[string].append('%s:%d' % (filename, linenb))
                else:
                    strings[string] = ['%s:%d' % (filename, linenb)]
    return strings



def get_ospfm_api_error_strings(filename):
    content = open(filename, 'r').read()
    content = re.sub('\( *\n *', '(', content, flags=re.MULTILINE)
    return re.findall("self.badrequest\('([^\']*)'\)", content) + \
           re.findall('self.badrequest\("([^\"]*)"\)', content) + \
           re.findall("self.forbidden\('([^\']*)'\)", content) + \
           re.findall('self.forbidden\("([^\"]*)"\)', content) + \
           re.findall("self.notfound\('([^\']*)'\)", content) + \
           re.findall('self.notfound\("([^\"]*)"\)', content)

def get_invitation_strings():
    return [
        i.strip() for i in \
        file('templates/invitation_strings.txt', 'r').readlines() \
        if i.strip() and not i.strip().startswith('#')
    ]


def update_all_translation_files(strings):
    locales = []
    files = []
    for filename in os.listdir(TRANSLATIONDIR):
        if filename.endswith('.js'):
            files.append(filename)
            locales.append(filename[:-3])
    with file(os.path.join(TRANSLATIONDIR, 'shortcuts.txt'), 'r') as shorts:
        for shortcut in shorts.readlines():
            locales.append(shortcut.split(':')[0])
    targetdir = tempfile.mkdtemp()
    for filename in files:
        update_translation_file(
            filename,
            targetdir,
            strings,
            locales
        )
    shutil.rmtree(targetdir)



def entries(name, currentvalues, defaultvalues):
    if name in currentvalues:
        already_defined = currentvalues[name]
    else:
        already_defined = {}
    if name == 'l10n_strings':
        entries = stringentries(name, already_defined, defaultvalues)
    else:
        entries = standardentries(name, already_defined, defaultvalues)
    result = ['%s = {\n' % name]
    result.append(',\n'.join(entries))
    result.append('\n}\n')
    return ''.join(result)

def standardentries(name, already_defined, defaultvalues):
    entries = []
    for val in defaultvalues:
        if val[0] in already_defined:
            entries.append('    "%s": "%s"' % (val[0],already_defined[val[0]]))
        elif val[1] is not None:
            entries.append('    "%s": "%s"' % (val[0], val[1]))
    return entries


def stringentries(name, already_defined, defaultstrings):
    entries = []
    orderedstrings = defaultstrings.keys()
    orderedstrings.sort()
    for string in orderedstrings:
        thisentry = ['']
        thisentry.extend(
            [ '    // %s' % comm for comm in defaultstrings[string] ]
        )
        escapedstring = string.replace('"', '\\"')
        if string in already_defined:
            escaped_already_defined= already_defined[string].replace('"','\\"')
            thisentry.append('    "%s":' % escapedstring)
            thisentry.append('        "%s"' % escaped_already_defined)
        else:
            thisentry.append('//    "%s":' % escapedstring)
            thisentry.append('//        ""')
        entries.append('\n'.join(thisentry))
    return entries



def update_translation_file(filename, targetdir, strings, locales):
    print ' Updating %s...' % filename
    currentvalues = {}
    with codecs.open(os.path.join(TRANSLATIONDIR, filename), 'r', 'utf8') as f:
        try:
            copy = u'Copyright %s' % (
                            re.search('.*Copyright (.*)', f.read()).group(1)
                        )
        except:
            copy = u'Copyright %d <AUTHOR>' % datetime.date.today().year
        f.seek(0)
        for var in re.findall('(\w*)\s*=\s*({[^}]*})', f.read()):
            # JSON do not accept comments. However, this file is not JSON,
            # it is javascript. We are using the json module for convenience
            currentvalues[var[0]] = json.loads(re.sub('//.*\n', '', var[1]))

    with codecs.open(os.path.join(targetdir, filename), 'w', 'utf8') as target:
        target.write(u"""/*
 *    %s
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
""" % copy)


        target.write(entries('l10n_locales', currentvalues,
                             [ (loc, loc) for loc in locales ]))
        target.write(entries('l10n_numbers', currentvalues, NUMBERS))
        target.write(entries('l10n_name', currentvalues, NAME))
        target.write(entries('l10n_date', currentvalues, DATE))
        target.write(entries('l10n_currency', currentvalues, CURRENCY))
        target.write(entries('l10n_strings', currentvalues, strings))
        target.write(entries('l10n_currencies', currentvalues,
                             [ (cur, None) for cur in CURRENCIES ]))
    shutil.copyfile(
        os.path.join(targetdir, filename),
        os.path.join(TRANSLATIONDIR, filename)
    )

if __name__ == '__main__':
    update_all_translation_files(get_all_strings())

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
# Imports

import codecs, os, subprocess

from flask import abort, Flask, jsonify, render_template, request

import configuration as config

###############################################################################
# Init

app = Flask(__name__)

langs = [ i[:-3] for i in os.listdir('src/locale')  if i[-3:] == '.js' ]
shortlangs = {}
for entry in file('src/locale/shortcuts.txt').readlines():
    entry = entry.strip().split(':')
    shortlangs[entry[0]] = entry[1]

###############################################################################
# Pages

@app.route('/')
@app.route('/<path:something>')
def index(something=None):
    if config.DEVEL:
        subprocess.call(['./merge_js_and_css.sh', 'debug'])
    return render_template('index.html', app_name=config.APP_NAME,
                           api_url=config.API_URL,
                           help_url=config.HELP_URL,
                           static_url=config.STATIC_URL,
                           demo_accounts=config.DEMO_ACCOUNTS)

@app.route('/browserlocale')
def browserlocale():
    reqlocales = request.headers['Accept-Language'].split(';')[0].split(',')
    # Default locale is en-US
    locale = 'en-US'
    for reqlocale in reqlocales:
        if reqlocale in langs:
            locale = reqlocale
            break
        elif reqlocale in shortlangs.keys():
            locale = shortlangs[reqlocale]
            break
    return jsonify({'locale': locale})

@app.route('/locales')
def locales():
    return jsonify({'locales':langs})

@app.route('/shortlocales')
def shortlocales():
    return jsonify({'locales':shortlangs.keys()})

@app.route('/invite', methods=['POST'])
def invitation():
    if not (request.form.has_key('name') and \
            request.form.has_key('address') and \
            request.form.has_key('language') and \
            request.form.has_key('sentby')):
        return render_template('invitation_error.html',
                               errmessage=u"Please provide all needed data.")

    address = request.form['address']
    language = request.form['language']
    name = request.form['name']
    sentby = request.form['sentby']

    if name == '' or address == '':
        return render_template('invitation_error.html',
             errmessage=u"Please provide this person's name and email address")
    if not '@' in address:
        return render_template('invitation_error.html',
               errmessage=u'This is not an email address:',
               complement=address)
    if language not in shortlangs.keys():
        return render_template('invitation_error.html',
               errmessage=u'There is no message in this language:',
               complement=language)

    with codecs.open('templates/invitation_message_{}.txt'.format(language),
                                              encoding='utf-8') as messagefile:
        message = messagefile.read().format(name=name, sentby=sentby)
    if request.form.get('confirmed', False) == 'yes':
        # TODO Send the message
        pass
    else:
        return render_template('invitation_confirm.html',
                               address=address, name=name, sentby=sentby,
                               language=language, message=message)

if config.DEVEL:
    @app.after_request
    def nocache(response):
        response.headers.add('Cache-Control', 'no-cache')
        return response

if __name__ == '__main__':
    app.run(debug=config.DEVEL,
            host=config.LISTEN_HOST, port=config.LISTEN_PORT)

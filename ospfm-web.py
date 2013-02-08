#!/usr/bin/env python
#
#    Copyright 2012 Sebastien Maccagnoni-Munch
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

import os, subprocess

from flask import abort, Flask, jsonify, render_template, request

import configuration as config

###############################################################################
# Init

app = Flask(__name__)

langs = [ i[:-3] for i in os.listdir('static/locale')  if i[-3:] == '.js' ]
shortlangs = {}
for entry in file('static/locale/shortcuts.txt').readlines():
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
                           gui_url=config.GUI_URL,
                           api_url=config.API_URL,
                           icons_url=config.ICONS_URL,
                           locales_url=config.LOCALES_URL,
                           logout_url=config.LOGOUT_URL,
                           help_url=config.HELP_URL,
                           scripts_url=config.SCRIPTS_URL)

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
            locale = shortlang[reqlocale]
            break
    return jsonify({'locale': locale})

@app.route('/locales')
def locales():
    return jsonify({'locales':langs})

if config.DEVEL:
    @app.after_request
    def nocache(response):
        response.headers.add('Cache-Control', 'no-cache')
        return response

if __name__ == '__main__':
    app.run(debug=config.DEVEL,
            host=config.LISTEN_HOST, port=config.LISTEN_PORT)

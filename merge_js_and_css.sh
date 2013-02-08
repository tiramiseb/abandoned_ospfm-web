#!/bin/sh
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

if [ "$1" = 'debug' ]
then
cat static/javascript/ospfm-web/*.js > static/ospfm-web.js
cat static/javascript/ospfm-web-settings/*.js > static/ospfm-web-settings.js
sass --style expanded static/css/main.scss static/ospfm-web.css
else
echo "====> Minifying ospfm-web.js"
cat static/javascript/ospfm-web/*.js | java -jar tools/yuicompressor-2.4.7.jar --type js -o static/ospfm-web.js
echo "====> Minifying ospfm-web-settings.js"
cat static/javascript/ospfm-web-settings/*.js | java -jar tools/yuicompressor-2.4.7.jar --type js -o static/ospfm-web-settings.js
echo "====> Creating ospfm-web.css from main.scss"
sass --style compressed static/css/main.scss static/ospfm-web.css
fi

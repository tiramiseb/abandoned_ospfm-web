#!/bin/sh
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

if [ "$1" = 'debug' ]
then

cat src/js/purl.js > static/js/purl.js
cat src/js/ospfm-web/*.js > static/js/ospfm-web.js
cat src/js/ospfm-web-settings/*.js > static/js/ospfm-web-settings.js
for i in src/locale/*.js
do
cp $i static/locale/
done
sass --style expanded src/css/main.scss static/css/ospfm-web.css
sass --style expanded src/css/default-theme.scss static/css/default-theme.css

else

echo "====> Minifying purl.js"
cat src/js/purl.js | java -jar tools/yuicompressor-2.4.7.jar --type js -o static/js/purl.js
echo "====> Minifying ospfm-web.js"
cat src/js/ospfm-web/*.js | java -jar tools/yuicompressor-2.4.7.jar --type js -o static/js/ospfm-web.js
echo "====> Minifying ospfm-web-settings.js"
cat src/js/ospfm-web-settings/*.js | java -jar tools/yuicompressor-2.4.7.jar --type js -o static/js/ospfm-web-settings.js
echo "====> Minifying locales js"
for i in src/locale/*.js
do
cat $i | java -jar tools/yuicompressor-2.4.7.jar --type js -o static/locale/$(basename $i)
done
echo "====> Creating ospfm-web.css from main.scss"
sass --style compressed src/css/main.scss static/css/ospfm-web.css
sass --style compressed src/css/default-theme.scss static/css/default-theme.css

fi

#########
OSPFM-web
#########

*OSPFM-web*  is a web GUI  (graphical user interface)  for OSPFM  (*Open Source
Personal Finance Management server*).

OSPFM-web is a part of a future Software-as-a-Service finance application named
everCount.

Short technical description
===========================

OSPFM-web relies on Javascript and should be  supported on recent web browsers.
It is mainly developed and tested with Chromium.

The  "Python" (``.py``)  files help  running a  development instance,  with the
Flask micro-framework. Flask is not mandatory.

In the "static/css" directory, a "theme.css"  file should be manually included,
either by creating  it from scratch, by  linking to "src/css/default-theme.css"
or by linking to a file somewhere else.

License
=======

OSPFM-web is published under the terms of the GNU Affero General Public License
version 3.

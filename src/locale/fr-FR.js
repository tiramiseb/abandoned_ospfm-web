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
l10n_locales = {
    "en-GB": "Anglais (Royaume Uni)",
    "fr-FR": "Français (France)",
    "en-US": "Anglais (États-Unis)",
    "en": "Anglais",
    "fr": "Français"
}
l10n_numbers = {
    "decimal": ",",
    "digits": "3",
    "separator": " ",
    "curdecimals": "2",
    "posnum": "N",
    "poscur": "N C",
    "pospct": "N %",
    "negnum": "-N",
    "negcur": "-N C",
    "negpct": "-N %"
}
l10n_name = {
    "nameandnick": "%F %L (%N)",
    "fullname": "%F %L",
    "shortname": "%F",
    "nickname": "(%N)"
}
l10n_date = {
    "first_day_of_week": "monday",
    "shortformat": "%d/%m/%Y"
}
l10n_currency = {
    "completename": "%C : %N (%S)"
}
l10n_strings = {

    // src/js/ospfm-web/categories.js:181
    // src/js/ospfm-web/categories.js:192
    "\"%CATEGORYNAME%\"":
        "«&nbsp;%CATEGORYNAME%&nbsp;»",

    // src/js/ospfm-web/categories.js:173
    "\"%CATEGORYSHORTNAME%\" in \"%PARENTFULLNAME%\"":
        "«&nbsp;%CATEGORYSHORTNAME%&nbsp;» dans «&nbsp;%PARENTFULLNAME%&nbsp;»",

    // src/js/ospfm-web/contacts.js:129
    "\"%NAME%\" matches the following people:":
        "«&nbsp;%NAME%&nbsp;» correspond aux personnes suivantes&nbsp;:",

    // src/js/ospfm-web/contacts.js:140
    "\"%NAME%\": No matching user":
        "«&nbsp;%NAME%&nbsp;»&nbsp;: aucun utilisateur ne correspond",

    // OSPFM error message in authentication.py
    "3 previous attempts failed, please wait 2 minutes":
        "Les 3 tentatives précédentes ont échoué, veuillez patienter 2 minutes",

    // OSPFM error message in currency.py
    "A currency with this symbol already exists":
        "Une monnaie avec ce symbole existe déjà",

    // OSPFM error message in user.py
    "A user cannot be created with the API":
        "L'API ne permet pas de créer un utilisateur",

    // OSPFM error message in user.py
    "A user cannot be deleted with the API":
        "L'API ne permet pas d'effacer un utilisateur",

    // src/js/ospfm-web/transactionscreen.js:143
    "Account":
        "Compte",

    // src/js/ospfm-web-settings/settings.js:387
    // src/js/ospfm-web/widgets.js:72
    "Accounts":
        "Comptes",

    // src/js/ospfm-web-settings/settings.js:363
    // src/js/ospfm-web/2_ospfm_objects.js:732
    "Add":
        "Ajouter",

    // src/js/ospfm-web/transactions_expenseincome.js:99
    "Add a category":
        "Ajouter une catégorie",

    // src/js/ospfm-web/transactionscreen.js:24
    "Add a transaction":
        "Ajouter une transaction",

    // src/js/ospfm-web/contacts.js:116
    "Add this person":
        "Ajouter cette personne",

    // src/js/ospfm-web/transactionscreen.js:115
    "All transactions have been displayed!":
        "Toutes les transactions ont été affichées&nbsp;!",

    // src/js/ospfm-web/transactions_0.js:406
    "Amount":
        "Montant",

    // src/js/ospfm-web/widgets.js:302
    // src/js/ospfm-web/2_ospfm_objects.js:724
    "Apply":
        "Appliquer",

    // src/js/ospfm-web/categories.js:46
    // src/js/ospfm-web/categories.js:48
    // src/js/ospfm-web/categories.js:50
    // src/js/ospfm-web/categories.js:52
    // src/js/ospfm-web/categories.js:54
    // src/js/ospfm-web/accounts.js:63
    "Balance":
        "Solde",

    // src/js/ospfm-web/wizard.js:121
    "Basic elements":
        "Éléments de base",

    // src/js/ospfm-web/widgets.js:392
    "Calculator":
        "Calculatrice",

    // src/js/ospfm-web/wizard.js:20
    // src/js/ospfm-web/transactionscreen.js:134
    // src/js/ospfm-web/transactions_0.js:214
    "Cancel":
        "Annuler",

    // OSPFM error message in user.py
    "Cannot add contacts to demo accounts":
        "Il n'est pas possible d'ajouter des contacts aux comptes de démonstration",

    // src/js/ospfm-web-settings/settings.js:388
    // src/js/ospfm-web/widgets.js:131
    "Categories":
        "Catégories",

    // src/js/ospfm-web/transactionscreen.js:147
    "Category":
        "Categorie",

    // src/js/ospfm-web-settings/settings.js:173
    "Change currency":
        "Changer la monnaie",

    // src/js/ospfm-web-settings/settings.js:171
    "Change currency and language, then reload":
        "Changer la monnaie et la langue, puis recharger",

    // src/js/ospfm-web-settings/settings.js:175
    "Change language, then reload":
        "Changer la langue, puis recharger",

    // src/js/ospfm-web-settings/settings.js:101
    // src/js/ospfm-web-settings/settings.js:391
    "Change password":
        "Modifier le mot de passe",

    // src/js/ospfm-web/contacts.js:60
    "Comment":
        "Commentaire",

    // src/js/ospfm-web-settings/settings.js:54
    // src/js/ospfm-web-settings/settings.js:94
    "Confirm password":
        "Confirmer le mot de passe",

    // src/js/ospfm-web-settings/settings.js:390
    // src/js/ospfm-web/widgets.js:321
    "Contacts":
        "Contacts",

    // src/js/ospfm-web/transactions_0.js:306
    // src/js/ospfm-web/transactions_0.js:307
    "Create":
        "Créer",

    // src/js/ospfm-web/accounts.js:71
    "Created account":
        "Compte créé",

    // src/js/ospfm-web/categories.js:77
    "Created category":
        "Catégorie créée",

    // src/js/ospfm-web/contacts.js:222
    "Created contact":
        "Contact créé",

    // src/js/ospfm-web/currencies.js:44
    "Created currency":
        "Monnaie créée",

    // src/js/ospfm-web/transactions_0.js:354
    "Created transaction":
        "Transaction créée",

    // src/js/ospfm-web/2_ospfm_objects.js:447
    "Creation failed":
        "La création a échoué",

    // src/js/ospfm-web/2_ospfm_objects.js:436
    "Creation successful":
        "Création réussie",

    // src/js/ospfm-web-settings/settings.js:389
    // src/js/ospfm-web/widgets.js:352
    "Currencies":
        "Monnaies",

    // src/js/ospfm-web/categories.js:44
    // src/js/ospfm-web/accounts.js:61
    "Currency":
        "Monnaie",

    // src/js/ospfm-web-settings/settings.js:41
    // src/js/ospfm-web-settings/settings.js:80
    "Current password":
        "Mot de passe actuel",

    // src/js/ospfm-web-settings/settings.js:29
    "Custom currencies allow you to manage other payment means: vouchers, etc.":
        "Les monnaies personnalisées vous permettent de gérer d'autres moyens de paiement&nbsp;: bons d'échange, titres restaurant, etc.",

    // src/js/ospfm-web/wizard.js:28
    "Data creation wizard":
        "Assistant de création de données",

    // OSPFM error message in objects.py
    "Database error":
        "Erreur de base de données",

    // src/js/ospfm-web/transactionscreen.js:150
    // src/js/ospfm-web/transactions_0.js:223
    "Date":
        "Date",

    // src/js/ospfm-web/2_ospfm_objects.js:667
    // src/js/ospfm-web/transactions_0.js:217
    "Delete":
        "Supprimer",

    // src/js/ospfm-web/accounts.js:80
    "Deleted account":
        "Compte supprimé",

    // src/js/ospfm-web/categories.js:81
    "Deleted category":
        "Catégorie supprimée",

    // src/js/ospfm-web/contacts.js:226
    "Deleted contact":
        "Contact supprimé",

    // src/js/ospfm-web/currencies.js:48
    "Deleted currency":
        "Monnaie supprimée",

    // src/js/ospfm-web/transactions_0.js:364
    "Deleted transaction":
        "Transaction supprimée",

    // src/js/ospfm-web/2_ospfm_objects.js:556
    "Deletion failed":
        "La suppression a échoué",

    // src/js/ospfm-web/2_ospfm_objects.js:545
    "Deletion successful":
        "Suppression réussie",

    // src/js/ospfm-web/wizard.js:153
    "Demo elements":
        "Éléments de démonstration",

    // src/js/ospfm-web/transactions_0.js:282
    "Description":
        "Description",

    // src/js/ospfm-web/widgets.js:292
    "Display category this deep...":
        "Afficher les catégories de cette profondeur...",

    // src/js/ospfm-web-settings/settings.js:282
    "Do you really want to reinitialize your everCount data?":
        "Voulez-vous vraiment réinitialiser vos données d'everCount&nbsp;?",

    // src/js/ospfm-web/categories.js:162
    "Do you want to create the following categories?":
        "Voulez-vous créer les catégories suivantes&nbsp;?",

    // src/js/ospfm-web/categories.js:165
    "Do you want to create the following category?":
        "Voulez-vous créer la catégorie suivante&nbsp;?",

    // src/js/ospfm-web/contacts.js:144
    "Do you want to send an invitation?":
        "Voulez-vous envoyer une invitation&nbsp;?",

    // src/js/ospfm-web/widgets.js:470
    "ERROR: ":
        "ERREUR : ",

    // src/js/ospfm-web/2_ospfm_objects.js:661
    // src/js/ospfm-web/transactions_0.js:89
    "Edit":
        "Éditer",

    // src/js/ospfm-web-settings/settings.js:298
    // src/js/ospfm-web/contacts.js:80
    // src/js/ospfm-web/contacts.js:182
    "Email address":
        "Adresse e-mail",

    // src/js/ospfm-web/wizard.js:137
    "Empty data":
        "Données vides",

    // OSPFM error message in objects.py
    "Empty values are forbidden":
        "Les valeurs vides sont interdites",

    // Invitation dialogs
    "Error":
        "Erreur",

    // src/js/ospfm-web/accounts.js:72
    "Error creating account":
        "Erreur lors de la création du compte",

    // src/js/ospfm-web/categories.js:78
    "Error creating category":
        "Erreur lors de la création de la catégorie",

    // src/js/ospfm-web/contacts.js:223
    "Error creating contact":
        "Erreur lors de la création du contact",

    // src/js/ospfm-web/currencies.js:45
    "Error creating currency":
        "Erreur lors de la création de la monnaie",

    // src/js/ospfm-web/transactions_0.js:357
    "Error creating transaction":
        "Erreur lors de la création de la transaction",

    // src/js/ospfm-web/accounts.js:81
    "Error deleting account":
        "Erreur lors de la suppression du compte",

    // src/js/ospfm-web/categories.js:82
    "Error deleting category":
        "Erreur lors de la suppression de la catégorie",

    // src/js/ospfm-web/contacts.js:227
    "Error deleting contact":
        "Erreur lors de la suppression du contact",

    // src/js/ospfm-web/currencies.js:49
    "Error deleting currency":
        "Erreur lors de la suppression de la monnaie",

    // src/js/ospfm-web/transactions_0.js:367
    "Error deleting transaction":
        "Erreur lors de la suppression de la transaction",

    // src/js/ospfm-web/accounts.js:79
    "Error updating account":
        "Erreur lors de la mise à jour du compte",

    // src/js/ospfm-web/categories.js:80
    "Error updating category":
        "Erreur lors de la mise à jour de la catégorie",

    // src/js/ospfm-web/contacts.js:225
    "Error updating contact":
        "Erreur lors de la mise à jour du contact",

    // src/js/ospfm-web/currencies.js:47
    "Error updating currency":
        "Erreur lors de la mise à jour de la monnaie",

    // src/js/ospfm-web/user.js:65
    "Error updating personal information":
        "Erreur lors de la mise à jour des informations personnelles",

    // src/js/ospfm-web/transactions_0.js:346
    "Error updating transaction":
        "Erreur lors de la mise à jour de la transaction",

    // src/js/ospfm-web/contacts.js:217
    "Error while loading search results":
        "Erreur lors du chargement des résultats de recherche",

    // src/js/ospfm-web-settings/settings.js:284
    "Everything will be erased: accounts, categories, transactions... You will not be able to recover anything of these.":
        "Tout sera effacé&nbsp;: comptes, catégories, transactions... Vous ne pourrez plus récupérer aucune de ces données.",

    // src/js/ospfm-web/currencies.js:30
    "Exchange rate":
        "Taux de change",

    // src/js/ospfm-web/transactions_0.js:138
    // src/js/ospfm-web/transactions_0.js:236
    "Expense":
        "Dépense",

    // src/js/ospfm-web/api.js:230
    "Failed to get exchange rate, sorry":
        "Échec de la récupération du taux de change, désolé",

    // src/js/ospfm-web/2_screens.js:200
    "Failed to load screen":
        "Erreur au chargement de l'écran",

    // src/js/ospfm-web-settings/settings.js:228
    "First name":
        "Prénom",

    // src/js/ospfm-web/transactions_transfer.js:80
    "From:":
        "De&nbsp;:",

    // OSPFM error message in currency.py
    "Globally defined currencies cannot be deleted":
        "Les monnaies définies globalement ne peuvent pas être effacées",

    // OSPFM error message in currency.py
    "Globally defined currencies cannot be modified":
        "Les monnaies définies globalement ne peuvent pas être modifiées",

    // src/js/ospfm-web/topbar_right.js:33
    "Help":
        "Aide",

    // src/js/ospfm-web/currencies.js:25
    "ISO code":
        "Code ISO",

    // src/js/ospfm-web/wizard.js:54
    "Identity and preferences":
        "Identité et préférences",

    // src/js/ospfm-web/contacts.js:134
    "If the person you are looking for is not in this list, you may invite her/him.":
        "Si la personne que vous cherchez n'est pas dans cette liste, vous pouvez l'inviter.",

    // src/js/ospfm-web/transactions_expenseincome.js:50
    "In categories:":
        "Dans les catégories&nbsp;:",

    // src/js/ospfm-web/transactions_expenseincome.js:52
    "In category:":
        "Dans la catégorie&nbsp;:",

    // src/js/ospfm-web/transactions_expenseincome.js:48
    "In no category...":
        "Dans aucune catégorie...",

    // src/js/ospfm-web/transactions_0.js:140
    // src/js/ospfm-web/transactions_0.js:240
    "Income":
        "Revenu",

    // src/js/ospfm-web/wizard.js:206
    "Initialization successful":
        "Initialisation réussie",

    // src/js/ospfm-web/wizard.js:48
    "Initialization wizard":
        "Assistant d'initialisation",

    // src/js/ospfm-web/wizard.js:165
    "Initialize everCount":
        "Initialiser everCount",

    // src/js/ospfm-web/wizard.js:90
    "Interface language:":
        "Langue de l'interface&nbsp;:",

    // src/js/ospfm-web-settings/settings.js:251
    // src/js/ospfm-web/contacts.js:188
    "Language":
        "Langue",

    // src/js/ospfm-web-settings/settings.js:232
    "Last name":
        "Nom de famille",

    // OSPFM error message in transaction.py
    "Listing all transactions is forbidden":
        "Il n'est pas possible de lister toutes les transactions",

    // OSPFM error message in user.py
    "Listing all users is forbidden":
        "Il n'est pas possible de lister tous les utilisateurs",

    // src/js/ospfm-web/authentication.js:137
    // src/js/ospfm-web/1_main.js:55
    "Loading...":
        "Chargement en cours...",

    // src/js/ospfm-web/authentication.js:40
    // src/js/ospfm-web/authentication.js:77
    "Login":
        "Connexion",

    // src/js/ospfm-web-settings/settings.js:48
    "Minimum 8 characters":
        "8 caractères au minimum",

    // src/js/ospfm-web/transactions_0.js:278
    // src/js/ospfm-web/transactions_0.js:279
    "Modify":
        "Modifier",

    // src/js/ospfm-web/categories.js:41
    // src/js/ospfm-web/contacts.js:59
    // src/js/ospfm-web/contacts.js:89
    // src/js/ospfm-web/contacts.js:176
    // src/js/ospfm-web/currencies.js:28
    // src/js/ospfm-web/accounts.js:54
    "Name":
        "Nom",

    // src/js/ospfm-web/contacts.js:44
    "Name, nickname or email":
        "Nom, surnom ou e-mail",

    // src/js/ospfm-web-settings/settings.js:293
    "New email address":
        "Nouvelle adresse e-mail",

    // src/js/ospfm-web-settings/settings.js:87
    "New password":
        "Nouveau mot de passe",

    // src/js/ospfm-web/categories.js:208
    "No thanks":
        "Non merci",

    // OSPFM error message in account.py
    "Nonexistent account cannot be deleted (or you do not own it)":
        "Un compte inexistant ne peut pas être effacé (ou vous n'en êtes pas le propriétaire)",

    // OSPFM error message in account.py
    "Nonexistent account cannot be modified (or you do not own it)":
        "Un compte inexistant ne peut pas être modifié (ou vous n'en êtes pas le propriétaire)",

    // OSPFM error message in category.py
    "Nonexistent category cannot be deleted (or you do not own it)":
        "Une catégorie inexistante ne peut pas être effacée (ou vous n'en êtes pas le propriétaire)",

    // OSPFM error message in category.py
    "Nonexistent category cannot be modified (or you do not own it)":
        "Une catégorie inexistante ne peut pas être modifiée (ou vous n'en êtes pas le propriétaire)",

    // OSPFM error message in user.py
    "Nonexistent contact cannot be deleted":
        "Un contact inenxistant ne peut pas être supprimé",

    // OSPFM error message in user.py
    "Nonexistent contact cannot be modified":
        "Un contact inenxistant ne peut pas être modifié",

    // OSPFM error message in currency.py
    "Nonexistent currency cannot be deleted":
        "Une monnaie inenxistante ne peut pas être supprimée",

    // OSPFM error message in currency.py
    "Nonexistent currency cannot be modified":
        "Une monnaie inenxistante ne peut pas être modifiée",

    // OSPFM error message in preference.py
    "Nonexistent preference cannot be deleted":
        "Une préférence inexistante ne peut pas être supprimée",

    // OSPFM error message in transaction.py
    "Nonexistent transaction cannot be deleted (or you do not own it)":
        "Une transaction inexistante ne peut pas être effacée (ou vous n'en êtes pas le propriétaire)",

    // OSPFM error message in transaction.py
    "Nonexistent transaction cannot be modified (or you do not own it)":
        "Une transaction inexistante ne peut pas être modifiée (ou vous n'en êtes pas le propriétaire)",

    // src/js/ospfm-web-settings/settings.js:68
    // src/js/ospfm-web-settings/settings.js:179
    // src/js/ospfm-web-settings/settings.js:219
    "Nothing to change":
        "Rien à modifier",

    // src/js/ospfm-web-settings/settings.js:327
    "Notifications are not sent to this address.<br>Click here to send notification to this address.":
        "Les notifications ne sont pas envoyées à cette adresse.<br>Cliquez ici pour envoyer les notifications à cette adresse.",

    // src/js/ospfm-web-settings/settings.js:316
    "Notifications are sent to this address.<br>Click here to stop sending notification to this address.":
        "Les notifications sont envoyées à cette adresse.<br>Cliquez ici pour arrêter d'envoyer les notifications à cette adresse.",

    // src/js/ospfm-web/wizard.js:217
    "OK":
        "OK",

    // src/js/ospfm-web/transactions_expenseincome.js:117
    "On account:":
        "Sur le compte&nbsp;:",

    // src/js/ospfm-web/authentication.js:65
    "Password":
        "Mot de passe",

    // OSPFM error message in user.py
    "Password should be at least 8 characters long":
        "Le mot de passe doit contenir au moins 8 caractères",

    // src/js/ospfm-web/widgets.js:281
    "Period for which to display the balance":
        "Période pour laquelle afficher le solde",

    // src/js/ospfm-web/2_ospfm_objects.js:595
    "Place this category at root":
        "Mettre cette catégorie à la racine",

    // src/js/ospfm-web/wizard.js:179
    "Please choose a wizard type":
        "Veuillez choisir un type d'assistant",

    // src/js/ospfm-web-settings/settings.js:111
    "Please enter the same password in \"New password\" and \"Confirm password\"":
        "Veuillez entrer le même mot de passe dans «&nbsp;Nouveau mot de passe&nbsp;» et «&nbsp;Confirmer le mot de passe&nbsp;»",

    // src/js/ospfm-web/wizard.js:49
    "Please fill in the following fields in order to initialize your everCount data:":
        "Veuillez renseigner les champs suivants afin d'initialiser vos données d'everCount",

    // OSPFM error message in user.py
    "Please give at least 3 characters":
        "Veuillez fournir au moins 3 caractères",

    // Invitation dialogs
    "Please provide all needed data.":
        "Veuillez fournir toutes les informations nécessaires.",

    // OSPFM error message in category.py
    "Please provide category name and currency":
        "Veuillez indiquer le nom et la monnaie de la catégorie",

    // OSPFM error message in account.py
    "Please provide the account name, currency and start balance":
        "Veuillez indiquer le nom, la monnaie et la balance de départ du compte",

    // OSPFM error message in user.py
    "Please provide the contact username":
        "Veuillez indiquer le nom d'utilisateur du contact",

    // OSPFM error message in user.py
    "Please provide the correct current password":
        "Veuillez indiquer le mot de passe actuel",

    // Invitation dialogs
    "Please provide this person's name and email address":
        "Veuillez fournir le nom et l'adresse e-mail de cette personne",

    // OSPFM error message in transaction.py
    "Please provide transaction description, currency, amount and date":
        "Veuillez indiquer la description, la monnaie, le montant et la date de la transaction",

    // OSPFM error message in preference.py
    "Please update the preference: if it does not exist, it will be created":
        "Veuillez mettre la préférence à jour: si elle n'existe pas, elle sera créée",

    // src/js/ospfm-web-settings/settings.js:392
    "Preferences and identity":
        "Préférences et identité",

    // src/js/ospfm-web-settings/settings.js:247
    "Preferred currency":
        "Monnaie préférée",

    // src/js/ospfm-web/topbar_right.js:38
    "Quit":
        "Quitter",

    // OSPFM error message in currency.py
    "Rate cannot be calculated":
        "Le taux ne peut pas être calculé",

    // src/js/ospfm-web-settings/settings.js:279
    "Really reinitialize?":
        "Réellement réinitialiser&nbsp;?",

    // Invitation dialogs
    "Recipient:":
        "Destinataire&nbsp;:",

    // src/js/ospfm-web-settings/settings.js:276
    "Reinitialize everything":
        "Tout réinitialiser",

    // src/js/ospfm-web/transactions_0.js:531
    "Remove this category":
        "Enlever cette catégorie",

    // src/js/ospfm-web-settings/settings.js:345
    "Remove this email address":
        "Enlever cette adresse e-mail",

    // src/js/ospfm-web/transactionscreen.js:25
    // src/js/ospfm-web/transactionscreen.js:133
    "Search":
        "Rechercher",

    // src/js/ospfm-web/contacts.js:197
    "Send an invitation":
        "Envoyer une invitation",

    // src/js/ospfm-web-settings/settings.js:396
    // src/js/ospfm-web/topbar_right.js:28
    "Settings":
        "Paramètres",

    // src/js/ospfm-web/api.js:63
    // src/js/ospfm-web/1_main.js:50
    "Sorry, a problem occured. Please try again later...":
        "Désolé, une erreur s'est produite. Veuillez réessayer ultérieurement...",

    // src/js/ospfm-web/accounts.js:57
    "Start balance":
        "Solde de départ",

    // src/js/ospfm-web/currencies.js:26
    "Symbol":
        "Symbole",

    // src/js/ospfm-web/accounts.js:35
    "The currency cannot be changed because<br/>there are transactions in this account.":
        "La monnaie ne peut pas être changée<br/>car il y a des transactions dans ce compte.",

    // src/js/ospfm-web-settings/settings.js:113
    "The current password cannot be empty":
        "Le mot de passe actuel ne peut pas être vide",

    // Invitation dialogs
    "The following message will be sent.":
        "Le message suivant sera envoyé.",

    // src/js/ospfm-web-settings/settings.js:115
    "The new password cannot be empty":
        "Le nouveau mot de passe ne peut pas être vide",

    // OSPFM error message in user.py
    "The only user you can modify is yourself":
        "Le seul utilisateur que vous puissiez modifier est vous-même",

    // OSPFM error message in category.py
    "The parent is already a child of this category":
        "La catégorie mère est déjà une fille de cette catégorie",

    // Invitation dialogs
    "There is no message in this language:":
        "Il n'y a pas de message dans cette langue&nbsp;:",

    // OSPFM error message in account.py
    "This account does not exist or you do not own it":
        "Ce compte n'existe pas ou vous n'en êtes pas le propriétaire",

    // OSPFM error message in category.py
    "This category does not exist or you do not own it":
        "Cette catégorie n'existe pas ou vous n'en êtes pas le propriétaire",

    // src/js/ospfm-web/categories.js:189
    "This category does not exist:":
        "Cette catégorie n'existe pas&nbsp;:",

    // OSPFM error message in user.py
    "This contact already exists":
        "Ce contact existe déjà",

    // OSPFM error message in user.py
    "This contact does not exist":
        "Ce contact n'existe pas",

    // OSPFM error message in currency.py
    // OSPFM error message in category.py
    // OSPFM error message in account.py
    // OSPFM error message in transaction.py
    "This currency does not exist":
        "Cette monnaie n'existe pas",

    // OSPFM error message in currency.py
    "This currency is still in use":
        "Cette monnaie est encore utilisée",

    // OSPFM error message in transaction.py
    "This date cannot be understood":
        "Cette date n'est pas comprise",

    // Invitation dialogs
    "This is not an email address:":
        "Ceci n'est pas une adresse e-mail&nbsp;:",

    // OSPFM error message in category.py
    // OSPFM error message in category.py
    "This parent category does not exist":
        "Cette catégorie mère n'existe pas",

    // OSPFM error message in transaction.py
    "This transaction does not exist or you do not own it":
        "Cette transaction n'existe pas ou vous n'en êtes pas propriétaire",

    // OSPFM error message in user.py
    // OSPFM error message in user.py
    "This user does not exist":
        "Cet utilisateur n'existe pas",

    // src/js/ospfm-web/contacts.js:171
    "To invite someone, please provide the following information:":
        "Pour inviter quelqu'un, veuillez fournir les informations suivantes&nbsp;:",

    // src/js/ospfm-web/transactions_transfer.js:84
    "To:":
        "À&nbsp;:",

    // src/js/ospfm-web/widgets.js:116
    "Total":
        "Total",

    // src/js/ospfm-web/transactions_0.js:142
    // src/js/ospfm-web/transactions_0.js:244
    "Transfer between my accounts":
        "Transfert entre mes comptes",

    // src/js/ospfm-web/transactions_0.js:145
    "Unknown transaction type":
        "Type de transaction inconnu",

    // src/js/ospfm-web/transactions_0.js:271
    "Unknown type":
        "Type inconnu",

    // src/js/ospfm-web/2_ospfm_objects.js:507
    "Update failed":
        "Échec de la mise à jour",

    // src/js/ospfm-web/2_ospfm_objects.js:496
    "Update successful":
        "Mise à jour réussie",

    // src/js/ospfm-web/accounts.js:77
    "Updated account":
        "Compte mis à jour",

    // src/js/ospfm-web/categories.js:79
    "Updated category":
        "Catégorie mise à jour",

    // src/js/ospfm-web/contacts.js:224
    "Updated contact":
        "Contact mis à jour",

    // src/js/ospfm-web/currencies.js:46
    "Updated currency":
        "Monnaie mise à jour",

    // src/js/ospfm-web/user.js:62
    "Updated personal information":
        "Informations personnelles mises à jour",

    // src/js/ospfm-web/transactions_0.js:343
    "Updated transaction":
        "Transaction mise à jour",

    // src/js/ospfm-web/authentication.js:53
    "Username":
        "Nom d'utilisateur",

    // src/js/ospfm-web/wizard.js:125
    "When you choose this option, some basic elements will be created for you: a bank account, a wallet account, usual categories... This option is for people who want to use everCount rapidly, with some initial help.":
        "Quand vous choisissez cette option, des éléments de base seront créés pour vous&nbsp;: un compte bancaire, un compte de portefeuille, des catégories courantes... Cette option est adaptée aux personnes qui veulent utiliser everCount rapidement, avec un peu d'aide initiale.",

    // src/js/ospfm-web/wizard.js:141
    "When you choose to create an empty everCount account, you will have to create everything by yourself: accounts, categories, etc. This option is for people who already know how to use a financial application and who know exactly what they want to do.":
        "Quand vous choisissez de créer un compte everCount vide, vous devrez tout créer vous-mêmes&nbsp;: les comptes, les catégories, etc. Cette option est adaptée aux personnes qui savent déjà comment utiliser une application financière et qui savent exactement ce qu'elles veulent faire.",

    // src/js/ospfm-web-settings/settings.js:394
    "Widgets":
        "Gadgets",

    // src/js/ospfm-web/wizard.js:157
    "With this option, multiple elements will be created, simulating an already-used everCount account: accouts, categories, transactions, etc. This option is for people who want to discover everCount and all its features.":
        "Avec cette option, de nombreux éléments seront créés, simulant un compte everCount en cours d'utilisation&nbsp;: comptes, catégories, transactions, etc. Cette option est adaptée aux personnes qui veulent découvrir everCount et toutes ses fonctionnalités.",

    // src/js/ospfm-web/authentication.js:129
    // OSPFM error message in authentication.py
    "Wrong username or password":
        "Mauvais nom d'utilisateur ou mot de passe",

    // src/js/ospfm-web/categories.js:163
    "Yes, create the categories":
        "Oui, créer les catégories",

    // src/js/ospfm-web/categories.js:166
    "Yes, create the category":
        "Oui, créer la catégorie",

    // src/js/ospfm-web-settings/settings.js:285
    "Yes, erase and reinitialize my data":
        "Oui, effacer et réinitialiser mes données",

    // Invitation dialogs
    "Yes, send this message!":
        "Oui, envoyer ce message&nbsp;!",

    // src/js/ospfm-web-settings/settings.js:273
    "You can flush and reinitialize your data and re-run the initial wizard by clicking on this button:":
        "Vous pouvez vider et réinitialiser vos données puis relancer l'assistant de configuration initial en cliquant sur ce bouton&nbsp;:",

    // src/js/ospfm-web/widgets.js:124
    "You have no account":
        "Vous n'avez aucun compte",

    // src/js/ospfm-web/widgets.js:344
    "You have no contact":
        "Vous n'avez aucun contact",

    // src/js/ospfm-web/widgets.js:243
    "You have not defined any category":
        "Vous n'avez défini aucune catégorie",

    // src/js/ospfm-web/widgets.js:383
    "You have not defined any personalized currency":
        "Vous n'avez défini aucune monnaie personnalisée",

    // src/js/ospfm-web-settings/settings.js:339
    "You should confirm this email address by<br>answering to the email that has been sent to you.<br>Click here to re-send this email.":
        "Vous devez confirmer cette adresse e-mail en<br>répondant au courrier électronique qui vous a été envoyé.<br>Cliquez ici pour réenvoyer cet e-mail.",

    // src/js/ospfm-web/wizard.js:210
    "Your account has been successfully (re)initialized.":
        "Votre compte a été (ré)initialisé.",

    // src/js/ospfm-web-settings/settings.js:57
    "Your first name":
        "Votre prénom",

    // src/js/ospfm-web/wizard.js:62
    "Your first name:":
        "Votre prénom&nbsp;:",

    // src/js/ospfm-web-settings/settings.js:60
    "Your last name":
        "Votre nom de famille",

    // src/js/ospfm-web/wizard.js:76
    "Your last name:":
        "Votre nom de famille&nbsp;:",

    // src/js/ospfm-web/wizard.js:102
    "Your preferred currency:":
        "Votre monnaie préférée&nbsp;:",

    // src/js/ospfm-web/widgets.js:273
    "all categories":
        "toutes les catégories",

    // src/js/ospfm-web/wizard.js:213
    "everCount will be reloaded to reinitialize the interface.":
        "everCount sera rechargé afin de réinitialiser l'interface.",

    // src/js/ospfm-web/widgets.js:205
    // src/js/ospfm-web/widgets.js:261
    "last 30 days":
        "30 derniers jours",

    // src/js/ospfm-web/widgets.js:193
    // src/js/ospfm-web/widgets.js:259
    "last 7 days":
        "7 derniers jours",

    // src/js/ospfm-web/widgets.js:169
    // src/js/ospfm-web/widgets.js:255
    "this month":
        "ce mois",

    // src/js/ospfm-web/widgets.js:157
    // src/js/ospfm-web/widgets.js:253
    "this week":
        "cette semaine",

    // src/js/ospfm-web/widgets.js:181
    // src/js/ospfm-web/widgets.js:257
    "this year":
        "cette année",

    // src/js/ospfm-web/widgets.js:271
    "top-level and their children":
        "premier niveau et leurs enfants",

    // src/js/ospfm-web/widgets.js:269
    "top-level only":
        "premier niveau seulement"
}
l10n_currencies = {
    "AED": "dirham émirati",
    "AFN": "afghani",
    "ALL": "lek",
    "AMD": "dram",
    "ANG": "florin des Antilles néerlandaises",
    "AOA": "kwanza",
    "ARS": "peso argentin",
    "AUD": "dollar australien",
    "AWG": "florin arubais",
    "AZN": "manat azerbaïdjanais",
    "BAM": "mark convertible",
    "BBD": "dollar barbadien",
    "BDT": "taka",
    "BGN": "lev",
    "BHD": "dinar bahreïni",
    "BIF": "franc burundais",
    "BMD": "dollar bermudien",
    "BND": "dollar de Brunei",
    "BOB": "boliviano",
    "BRL": "réal brésilien",
    "BSD": "dollar bahaméen",
    "BTN": "ngultrum",
    "BWP": "pula",
    "BYR": "rouble biélorusse",
    "BZD": "dollar bélizien",
    "CAD": "dollar canadien",
    "CDF": "franc congolais",
    "CHF": "franc suisse",
    "CLF": "unité d'investissement du Chili",
    "CLP": "peso chilien",
    "CNY": "yuan",
    "COP": "peso colombien",
    "CRC": "colon costaricain",
    "CUP": "peso cubain",
    "CVE": "escudo",
    "CZK": "couronne tchèque",
    "DJF": "franc djiboutien",
    "DKK": "couronne danoise",
    "DOP": "peso dominicain",
    "DZD": "dinar algérien",
    "EGP": "livre égyptienne",
    "ETB": "birr",
    "EUR": "Euro",
    "FJD": "dollar fidjien",
    "FKP": "livre des Îles Malouines",
    "GBP": "livre sterling",
    "GEL": "lari",
    "GHS": "cédi",
    "GIP": "livre de Gibraltar",
    "GMD": "dalasi",
    "GNF": "franc guinéen",
    "GTQ": "quetzal",
    "GYD": "dollar du Guyana",
    "HKD": "dollar de Hong Kong",
    "HNL": "lempira",
    "HRK": "kuna",
    "HTG": "gourde",
    "HUF": "forint",
    "IDR": "roupie indonésienne",
    "ILS": "shekel",
    "INR": "roupie indienne",
    "IQD": "dinar irakien",
    "IRR": "rial iranien",
    "ISK": "couronne islandaise",
    "JMD": "dollar jamaïcain",
    "JOD": "dinar jordanien",
    "JPY": "yen",
    "KES": "shiling kényan",
    "KGS": "som",
    "KHR": "riel",
    "KMF": "franc comorien",
    "KPW": "won de Corée du Nord",
    "KRW": "won de Corée du Sud",
    "KWD": "dinar koweïtien",
    "KZT": "tenge",
    "LAK": "kip",
    "LBP": "livre libanaise",
    "LKR": "roupie srilankaise",
    "LRD": "dollar libérien",
    "LSL": "loti",
    "LTL": "litas",
    "LVL": "lats",
    "LYD": "dinar lybien",
    "MAD": "dirham marocain",
    "MDL": "leu moldave",
    "MGA": "ariary",
    "MKD": "denar",
    "MMK": "kyat",
    "MNT": "tugrik",
    "MOP": "pataka",
    "MRO": "ouguiya",
    "MUR": "roupie mauricienne",
    "MVR": "rufiyaa",
    "MWK": "kwacha malawien",
    "MXN": "peso mexicain",
    "MYR": "ringgit",
    "MZN": "metical",
    "NAD": "dollar namibien",
    "NGN": "naira",
    "NIO": "cordoba d'or",
    "NOK": "couronne norvégienne",
    "NPR": "roupie népalaise",
    "NZD": "dollar néo-zélandais",
    "OMR": "rial omanais",
    "PAB": "balboa",
    "PEN": "sol",
    "PGK": "kina",
    "PHP": "peso philippin",
    "PKR": "roupie pakistanaise",
    "PLN": "zloty",
    "PYG": "guarani",
    "QAR": "rial qatari",
    "RON": "leu roumain",
    "RSD": "dinar serbe",
    "RUB": "rouble russe",
    "RWF": "franc rwandais",
    "SAR": "riyal",
    "SBD": "dollar des Îles Salomon",
    "SCR": "roupie seychelloise",
    "SDG": "livre soudanaise",
    "SEK": "couronne suédoise",
    "SGD": "dollar singapourien",
    "SHP": "livre de Sainte-Hélène",
    "SLL": "leone",
    "SOS": "shilling somalien",
    "SRD": "dollar surinamien",
    "STD": "dobra",
    "SYP": "livre syrienne",
    "SZL": "lilangeni",
    "THB": "baht",
    "TJS": "somoni",
    "TMT": "manat turkmène",
    "TND": "dinar tunisien",
    "TOP": "pa'anga",
    "TRY": "livre turque",
    "TTD": "dollar de Trinité-et-Tobago",
    "TWD": "dollar taïwanais",
    "TZS": "shilling tanzanien",
    "UAH": "hryvnia",
    "UGX": "shilling ougandais",
    "USD": "dollar US",
    "UYI": "peso uruguayen en unités indexées",
    "UYU": "peso uruguayen",
    "UZS": "sum",
    "VEF": "bolívar fuerte",
    "VND": "dong",
    "VUV": "vatu",
    "WST": "tala",
    "XAF": "franc CFA"
}

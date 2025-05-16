sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("booksapplication.controller.Detail", {
        onInit() {
            // Wanneer deze controller geopend wordt weten we dat de gebruiker een boek geslecteerd heeft uit de lijst in de Main Page.
            // We nemen de router en hangen er een event aan vast.
            // Wanneer de router het Detail pattern (uit de manifest) matched, dan mag er een methode in werking treden. 
            // Dit gaat over de onBookPatternMatched methode
            let oRouter = this.getOwnerComponent().getRouter()
                oRouter.getRoute("Detail").attachPatternMatched(this._onBookPatternMatched, this);
        },
        _onBookPatternMatched(oEvent){
            // In de manifest.json zie je dat we in de Detail Route (lijn 101) een variabelen {title} en {author} hebben toegevoegd.
            // Deze wordt meegegeven door de Main controller wanneer de gebruiker op een boek heeft geklikt in de lijst.
            // Deze verwijst naar de titel en auteur van het boek in de lijst die gebonden is met het default OData model.
            // Bijvoobeeld: '/BookSet(Title='Zie Scherp Scherper', Author='Tim Dams')
            // Hieronder in de code halen we deze variabelen op, die ook in de url zitten.
            let sPreddedBookTitle = oEvent.getParameter("arguments").title || "",
                sPreddedBookAuthor = oEvent.getParameter("arguments").author || ""

            // Nu willen we dit boek eigenlijk binden aan onze Detail Page. Zodat we de informatie uit het model hier kunnen gebruiken.
            this.getView().bindElement({
                path: `/BookSet(Title='${encodeURIComponent(sPreddedBookTitle)}',Author='${encodeURIComponent(sPreddedBookAuthor)}')`
                // Hier kan je eventuele zaken aan toevoegen
                // ,parameters: {
                //     $expand: "...",
                //     $filter: "Genre eq 'Programmeren'"
                // }
            });
        }
    });
});
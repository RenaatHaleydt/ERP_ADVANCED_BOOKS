sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("booksapplication.controller.Detail", {
        // onInit is de methode die 1 keer wordt aangeroepen wanneer de view in de applicatie wordt ingeladen
        // (wanneer deze op het scherm verschijnt)
        onInit() {
            // Wanneer deze controller geopend wordt weten we dat de gebruiker een boek geslecteerd heeft uit de lijst in de Main Page.
            // We nemen de router en hangen er een event aan vast.
            // Wanneer de router het Detail pattern (uit de manifest) matched, dan mag er een methode in werking treden. 
            // Dit gaat over de onBookPatternMatched methode
            let oRouter = this.getOwnerComponent().getRouter()
                oRouter.getRoute("Detail").attachPatternMatched(this._onBookPatternMatched, this);
            
                // Hier maken we een lokaal JSON object dat we later gaan toewijzen aan de view. 
                // Dit kunnen we gebruiken om er kleine properties aan toe te voegen en deze te gebruiken in de view(s)
                let oBookModel = new sap.ui.model.json.JSONModel({
                    editable: false
                });

                // Lokaal JSON model binden aan de view, zodat we aan de data kunnen in de view en omgekeerd
                this.getView().setModel(oBookModel, "bookModel");
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
        },
        onEditPressed(oEvent){
            this.getView().getModel("bookModel").setProperty("/editable", true)
        },
        onSavePressed(oEvent){
			// Hier halen we het path op van het element dat we aan het veranderen zijn.
            // We doen er niets mee, maar dit is voor debugging purposes
            var sPath = this.getView().getElementBinding().getPath()
            // SAPUI5 werkt op basis van JavaScript, die op zijn beurt met contexts werkt.
            // Omdat we in de success functie bij het versturen van de changes nog altijd zaken willen aanpassen in de context 
            // van deze controller gebruiken we daar de that voor.
            // De that linken we aan this ( deze context - Detail controller) omdat this in de success methode slaat op de context van die methode.
            var that = this
			
			// OData model update
            // Omdat we in het model in de manifest ervoor zorgen dat we TwoWay binding gebruiken komen de veranderingen die we uitvoeren
            // in de views automatisch ook in het model terecht. Deze kunnen we dan ook makkelijk versturen op volgende manier:
			this.getOwnerComponent().getModel().submitChanges({
				error: function (oError) { sap.m.MessageToast.show(oError); },
				success: function (oData, response) {
					sap.m.MessageToast.show('De data is aangepast');
					
					that.getView().getModel("bookModel").setProperty("/editable", false);
                    // Hier gaan we terug naar de hoofdpagina via de router
                    that.getOwnerComponent().getRouter().navTo("RouteMain")
				}
			});
			
		
        }
    });
});
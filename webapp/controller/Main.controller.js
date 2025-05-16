sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/f/library"
], (Controller, Library) => {
    "use strict";

    return Controller.extend("booksapplication.controller.Main", {
        onInit() {

        },
        // Dit event wordt getriggert wanneer een gebruiker op een rij klikt in de tabel. Deze wordt aangestuurd vanuit de Main.view
        onListItemPress: function (oEvent) {
            // Hier gaan we het path opvragen van welke rij er geklikt is.
            let sPressedBookPath = oEvent.getSource().getBindingContext().getPath()
            // Een voorbeeld kan het volgende zijn: "/BookSet(Title='ATOMIC%20HABITS',Author='JOSKE')"

            // Reguliere expressie om Title en Author eruit te halen
            const regex = /Title='([^']*)',Author='([^']*)'/

            const match = sPressedBookPath.match(regex)
            let sTitel = "",
                sAuteur = ""

            if (match) {
                sTitel = decodeURIComponent(match[1]);
                sAuteur = decodeURIComponent(match[2]);
            } else {
                // No match found
            }

            // We veranderen de layout in het layoutModel om zo de App.view te laten weten welke layout er getoond moet worden.
            this.getOwnerComponent().getModel("layoutModel").setProperty("/layout", Library.LayoutType.TwoColumnsMidExpanded)
            // We zeggen de applicatie om de Detail Route in de manifest.json te tonen.
            this.getOwnerComponent().getRouter().navTo("Detail", { title: sTitel, author: sAuteur })
        },
        filterTablePressed(oEvent) {
            let oTable = this.byId("booksTable"),
                oFilterBar = this.getView().byId("filterbar"),
                oBinding = oTable.getBinding("items")


            let aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                let oControl = oFilterGroupItem.getControl(),
                    aFilters = [];

                let aSelectedKeys = oControl.getSelectedKeys();
                if (aSelectedKeys.length > 0) {
                    let aSubFilters = aSelectedKeys.map(function (sSelectedKey) {
                        return new sap.ui.model.Filter({
                            path: oFilterGroupItem.getName(),
                            operator: sap.ui.model.FilterOperator.EQ,
                            value1: sSelectedKey
                        });
                    });

                    // Voeg alle subfilters apart toe aan aFilters (flatten)
                    aFilters.push(...aSubFilters);
                }

                if (aFilters.length > 0) {
                    aResult.push(new sap.ui.model.Filter({
                        filters: aFilters,
                        and: false // Of true, afhankelijk van of je een OF of EN zoekt
                    }));
                }

                return aResult;

            }, []);


            oBinding.filter(aTableFilters);
        }
    });
});
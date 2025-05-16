sap.ui.define([
    "sap/ui/core/UIComponent",
    "booksapplication/model/models",
    "sap/f/library"
], (UIComponent, models, library) => {
    "use strict";

    return UIComponent.extend("booksapplication.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // set the layout model to control the Flexible Column Layout
            let oModel = new sap.ui.model.json.JSONModel({layout: library.LayoutType.OneColumn});
            this.setModel(oModel, "layoutModel");

            // enable routing
            this.getRouter().initialize();
        }
    });
});
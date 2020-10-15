sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/core/Core",
	"sap/ui/core/library",
	"sap/ui/unified/library"
], function (Controller, Core, CoreLibrary, UnifiedLibrary) {
	"use strict";
	var CalendarDayType = UnifiedLibrary.CalendarDayType,
		ValueState = CoreLibrary.ValueState;

	return Controller.extend("com.demo.TimeandAttendance.controller.Profile", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.demo.TimeandAttendance.view.Profile
		 */
		onInit: function () {

		},
		onHome: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("Home", {}, false);
			this.getView().byId("home").addStyleClass("styleHeader");
			this.getView().byId("approve").removeStyleClass("styleHeader");
			this.getView().byId("card").removeStyleClass("styleHeader");
			this.getView().byId("history").removeStyleClass("styleHeader");
		},
		onApproval: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("Requests", {}, false);
			this.getView().byId("approve").addStyleClass("styleHeader");
			this.getView().byId("home").removeStyleClass("styleHeader");
			this.getView().byId("card").removeStyleClass("styleHeader");
			this.getView().byId("history").removeStyleClass("styleHeader");
		},

		onCard: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("Profile", {}, false);
			this.getView().byId("card").addStyleClass("styleHeader");
			this.getView().byId("home").removeStyleClass("styleHeader");
			this.getView().byId("approve").removeStyleClass("styleHeader");
			this.getView().byId("history").removeStyleClass("styleHeader");
		},

		onHistory: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("History", {}, false);
			this.getView().byId("history").addStyleClass("styleHeader");
			this.getView().byId("home").removeStyleClass("styleHeader");
			this.getView().byId("approve").removeStyleClass("styleHeader");
			this.getView().byId("card").removeStyleClass("styleHeader");
		},
		onAdd: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("form", "com.demo.TimeandAttendance.fragment.address", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
		},
		handleChange: function (oEvent) {
			var oText = this.byId("textResult"),
				oDP = oEvent.getSource(),
				sValue = oEvent.getParameter("value"),
				bValid = oEvent.getParameter("valid");

			this._iEvent++;
			oText.setText("Change - Event " + this._iEvent + ": DatePicker " + oDP.getId() + ":" + sValue);

			if (bValid) {
				oDP.setValueState(ValueState.None);
			} else {
				oDP.setValueState(ValueState.Error);
			}
		}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.demo.TimeandAttendance.view.Profile
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.demo.TimeandAttendance.view.Profile
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.demo.TimeandAttendance.view.Profile
		 */
		//	onExit: function() {
		//
		//	}

	});

});
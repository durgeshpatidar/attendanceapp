sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../utility/formatter",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, JSONModel, formatter, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.demo.TimeandAttendance.controller.Requests", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.demo.TimeandAttendance.view.Requests
		 */
		onInit: function () {
			var oLabel = this.getView().byId("oLabel1");
			var result = this.GetClock();
			oLabel.setText(result);
			var that = this;
			setInterval(function () {
				var result = that.GetClock();
				oLabel.setText(result);
			}, 1000);
			var oReqData = {
				"sEnable": false,
				"bEnable": true,
				"sText": "",
				"sDate": "24-06-2020",
				"sName": "Employee1",
				"sQuery": "Overtime, Worked for 9hrs",
				"approveVisible": false
			};
			var oModel2 = new JSONModel(oReqData);
			this.getView().setModel(oModel2, "oReqModel");
			var oModel1 = new JSONModel("model/request.json");
			this.getView().setModel(oModel1, "oTableModel");
			// add Address model
			var oAddAddress = {
				"address": "",
				"city": "",
				"state": "",
				"pincode": "",
				"validTo": "",
				"validFrom": "",
				"locationLat": "",
				"locationLon": ""
			};
			var oAddAddressModel1 = new JSONModel(oAddAddress);
			this.getView().setModel(oAddAddressModel1, "oAddAddressModel");
			setInterval(function () {
				that.onRequest();
			}, 30000);
		},
		//To redirect back to home page
		onHome: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("Home", {}, false);
			this.getView().byId("home").addStyleClass("styleHeader");
			this.getView().byId("approve1").removeStyleClass("styleHeader");
			this.getView().byId("card1").removeStyleClass("styleHeader");
			this.getView().byId("history1").removeStyleClass("styleHeader");
		},
		//To remain in the same page 
		onApproval: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("Requests", {}, false);
			this.getView().byId("approve1").addStyleClass("styleHeader");
			this.getView().byId("home1").removeStyleClass("styleHeader");
			this.getView().byId("card1").removeStyleClass("styleHeader");
			this.getView().byId("history1").removeStyleClass("styleHeader");
		},

		// to get CSRF token
		getCSRFToken: function (url, token) {
			var token = null;
			var sUrl = url;
			$.ajax({
				url: sUrl,
				type: "GET",
				async: false,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				complete: function (xhr) {
					token = xhr.getResponseHeader("X-CSRF-Token");
				}
			});
			return token;
		},
		//To display the employee details
		onCard: function (oEvent) {
			var that = this;
			var sEmpId = {
				"id": this.getView().getModel("oLoginModel").getProperty("/id")
			};
			var url2 = "/Attendances/address?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url2,
				success: function (data) {
					var oAddressData = new JSONModel(data.data);
					that.getView().setModel(oAddressData, "oAddressModel");
					var len = data.data.length;
					if(len === 4){
						var sHomeAddress2 = that.getView().getModel("oAddressModel").getProperty("/3/address") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/3/city") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/3/state") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/3/pincode");
						that.getView().getModel("oAddressModel").setProperty("/HomeAddress2", sHomeAddress2);
						that.getView().getModel("oAddressModel").setProperty("/visible", true);
					}
					else{
						var sHomeAddress2 = "";
						that.getView().getModel("oAddressModel").setProperty("/HomeAddress2", sHomeAddress2);
						that.getView().getModel("oAddressModel").setProperty("/visible", false);
					}
					var sOfficeAddress1 = that.getView().getModel("oAddressModel").getProperty("/2/address") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/2/city") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/2/state") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/2/pincode");
					var sOfficeAddress2 = that.getView().getModel("oAddressModel").getProperty("/1/address") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/1/city") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/1/state") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/1/pincode");
					var sHomeAddress1 = that.getView().getModel("oAddressModel").getProperty("/0/address") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/0/city") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/0/state") + ", " + that.getView().getModel(
						"oAddressModel").getProperty("/0/pincode");
					that.getView().getModel("oAddressModel").setProperty("/OfficeAddress1", sOfficeAddress1);
					that.getView().getModel("oAddressModel").setProperty("/OfficeAddress2", sOfficeAddress2);
					that.getView().getModel("oAddressModel").setProperty("/HomeAddress1", sHomeAddress1);
				}
			});

			// to get profile details
			var sUrl = "/Attendances/employee/profile";
			$.ajax({
				url: sUrl,
				type: "POST",
				async: false,
				data: JSON.stringify(sEmpId),
				contentType: "application/json",
				beforeSend: function (xhr) {
					var param = "/service";
					var token = that.getCSRFToken(sUrl, param);
					xhr.setRequestHeader("X-CSRF-Token", token);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success: function (data) {
					var oProfileData = new JSONModel(data.data);
					that.getView().setModel(oProfileData, "oProfileModel");
					var fullName = that.getView().getModel("oProfileModel").getProperty("/firstName") + " " + that.getView().getModel(
						"oProfileModel").getProperty("/lastName");
					that.getView().getModel("oProfileModel").setProperty("/fullName", fullName);
					var smanager = that.getView().getModel("oProfileModel").getProperty("/managerList/0/firstName") + " " + that.getView().getModel(
						"oProfileModel").getProperty("/managerList/0/lastName");
					that.getView().getModel("oProfileModel").setProperty("/ManagerName", smanager);
				}
			});
			// },
			this.bFlag = false;
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("idprofile", "com.demo.TimeandAttendance.fragment.profileitem", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
		},
		//To close the fragment
		onClose: function (oEvent) {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		//To direct the user to history view
		onHistory: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("History", {}, false);
			this.getView().byId("history2").addStyleClass("styleHeader");
			this.getView().byId("home1").removeStyleClass("styleHeader");
			this.getView().byId("approve1").removeStyleClass("styleHeader");
			this.getView().byId("card1").removeStyleClass("styleHeader");
		},
		//onApproval to accept the request of an employee manager view
		onAccept: function (oEvent) {
			var that = this;
			var sApprove = {
				"id": oEvent.getSource().getBindingContext("oApprovalModel").getObject().id,
				"status": "Approved",
				"comment": "okay approved"
			};
			var sUrl = "/Attendances/workflow/task/update?workflowId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				url: sUrl,
				type: "POST",
				async: false,
				data: JSON.stringify(sApprove),
				contentType: "application/json",
				beforeSend: function (xhr) {
					var param = "/service";
					var token = that.getCSRFToken(sUrl, param);
					xhr.setRequestHeader("X-CSRF-Token", token);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success: function (data) {
					if (data.status === true) {
						MessageToast.show(data.message);
						//MessageBox.alert(data.message);
						that.getView().getModel("oApprovalModel").refresh(true);
						that.onApprove();
					}
				}
			});
		},
		//onApproval to reject the request of an employee manager view
		onReject: function (oEvent) {
			var that = this;
			var sReject = {
				"id": oEvent.getSource().getBindingContext("oApprovalModel").getObject().id,
				"status": "Rejected",
				"comment": "rejected"
			};
			var sUrl = "/Attendances/workflow/task/update?workflowId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				url: sUrl,
				type: "POST",
				async: false,
				data: JSON.stringify(sReject),
				contentType: "application/json",
				beforeSend: function (xhr) {
					var param = "/service";
					var token = that.getCSRFToken(sUrl, param);
					xhr.setRequestHeader("X-CSRF-Token", token);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success: function (data) {
					if (data.status === true) {
						MessageToast.show(data.message);
						//MessageBox.alert(data.message);
						that.getView().getModel("oApprovalModel").refresh(true);
						that.onApprove();
					}
				}
			});
		},
		//To open add address fragment
		onAdd: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("form", "com.demo.TimeandAttendance.fragment.address", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
		},
		//To send the data entered in the address fragment to approval
		onPostAddress: function () {
			var that = this;
			var oCheckIn = {
				"empId": this.getView().getModel("oLoginModel").getProperty("/id"),
				"address": this.getView().getModel("oAddAddressModel").getProperty("/address"),
				"city": this.getView().getModel("oAddAddressModel").getProperty("/city"),
				"state": this.getView().getModel("oAddAddressModel").getProperty("/state"),
				"pincode": this.getView().getModel("oAddAddressModel").getProperty("/pincode"),
				"validTo": this.getView().getModel("oAddAddressModel").getProperty("/validTo"),
				"validFrom": this.getView().getModel("oAddAddressModel").getProperty("/validFrom"),
				"locationLat": "",
				"locationLon": ""
			};
			var sDate = oCheckIn.validFrom.toString();
			var eDate = oCheckIn.validTo.toString();
			console.log(sDate);
			if (oCheckIn.empId === "" || oCheckIn.address === "" || oCheckIn.city === "" || oCheckIn.state === "" || oCheckIn.pincode === "" ||
				oCheckIn.validTo === "" || oCheckIn.validFrom === "") {
				MessageToast.show("Please Fill out the fields");
			} else {
				var a = new Date();
				var c = a.getDate();
				if (c < 10) {
					c = "0" + c;
				}
				var b = a.getMonth() + 1;
				if (b < 10) {
					var sValue;
					sValue = a.getFullYear() + "-" + "0" + b + "-" + c;
				} else {
					var sValue;
					sValue = a.getFullYear() + "-" + b + "-" + c;
				}
				var curDate = sValue.toString();
				console.log(curDate);
				if ((eDate < sDate) || (sDate < curDate)) {
					MessageToast.show(
						"Start date need to be equal to today's date or greater than that or End date should be greater than Start date");
					this.getView().getModel("oAddAddressModel").setProperty("/validTo", "");
					this.getView().getModel("oAddAddressModel").setProperty("/validFrom", "");
				} else {
					var sUrl = "/Attendances/address";
					$.ajax({
						url: sUrl,
						type: "POST",
						async: false,
						data: JSON.stringify(oCheckIn),
						contentType: "application/json",
						beforeSend: function (xhr) {
							var param = "/service";
							var token = that.getCSRFToken(sUrl, param);
							xhr.setRequestHeader("X-CSRF-Token", token);
							xhr.setRequestHeader("Accept", "application/json");
						},
						success: function (data) {
							if (data.status === true) {
								that._oDialog.close();
								that._oDialog.destroy();
								that._oDialog = null;
								MessageToast.show(data.message);
								that.getView().getModel("oRequestModel").refresh(true);
								that.onRequest();
								that.homeData();
							} else {
								// MessageToast.show(data.message);
								MessageBox.error(data.message);
							}
						}
					});
				}
			}
		},
		//To redirect to login page
		onLog: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("RouteLogin");
		},
		//To close the fragment
		onCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		//To display the running clock on screen
		GetClock: function () {

			var tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
			var tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November",
				"December");
			var d = new Date();
			var nday = d.getDay(),
				nmonth = d.getMonth(),
				ndate = d.getDate(),
				nyear = d.getYear(),
				nhour = d.getHours(),
				nmin = d.getMinutes(),
				nsec = d.getSeconds(),
				ap;
			if (nhour === 0) {
				ap = " AM";
				nhour = 12;
			} else if (nhour < 12) {
				ap = " AM";
			} else if (nhour == 12) {
				ap = " PM";
			} else if (nhour > 12) {
				ap = " PM";
				nhour -= 12;
			}
			if (nyear < 1000) nyear += 1900;
			if (nmin <= 9) nmin = "0" + nmin;
			if (nsec <= 9) nsec = "0" + nsec;
			var result = "" + tday[nday] + ", " + tmonth[nmonth] + " " + ndate + ", " + nyear + " " + nhour + ":" + nmin + ":" + nsec + ap + "";
			return result;
		},
		//Common fuction to refresh the service data
		onRequest: function () {
			var that = this;
			var url2 = "/Attendances/workflow/request?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url2,
				success: function (data) {
					var oRequestData = new JSONModel(data.data);
					that.getView().setModel(oRequestData, "oRequestModel");
				}
			});
			var url1 = "/Attendances/workflow/task?managerId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url1,
				success: function (data) {
					if (data.message === "All Workflow Task Displayed Successfully!") {
						var oApprovalData = new JSONModel(data.data);
						that.getView().setModel(oApprovalData, "oApprovalModel");
						that.getView().getModel("oReqModel").setProperty("/approveVisible", true);
					}
				}
			});
		},
		//To refresh the approval data
		onApprove: function () {
			var that = this;
			var url2 = "/Attendances/workflow/task?managerId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url2,
				success: function (data) {
					var oApprovalData = new JSONModel(data.data);
					that.getView().setModel(oApprovalData, "oApprovalModel");
				}
			});
		},
		//To refresh the data to display on table
		homeData: function () {
			var that = this;
			var url2 = "/Attendances/workflow/details-home?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url2,
				success: function (data) {
					var oModelData = new JSONModel(data);
					that.getView().setModel(oModelData, "oModel");
				}
			});
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.demo.TimeandAttendance.view.Requests
		 */
		onBeforeRendering: function () {
			var that = this;
			var url2 = "/Attendances/workflow/request?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url2,
				success: function (data) {
					var oRequestData = new JSONModel(data.data);
					that.getView().setModel(oRequestData, "oRequestModel");
				}
			});
			var empId = this.getView().getModel("oLoginModel").getProperty("/id");
			var url1 = "/Attendances/employee/employee-type?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url1,
				success: function (data) {
					if (data.message === "EmpId is manager") {
						var url3 = "/Attendances/workflow/task?managerId=" + empId;
						$.ajax({
							type: "GET",
							async: false,
							url: url3,
							success: function (data) {
								var oApprovalData = new JSONModel(data.data);
								that.getView().setModel(oApprovalData, "oApprovalModel");
								that.getView().getModel("oReqModel").setProperty("/approveVisible", true);
							}
						});
					}
				}
			});
		}

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.demo.TimeandAttendance.view.Requests
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.demo.TimeandAttendance.view.Requests
		 */
		//	onExit: function() {
		//
		//	}
	});

});
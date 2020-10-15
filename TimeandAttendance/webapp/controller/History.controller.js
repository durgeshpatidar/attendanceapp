sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Core",
	"sap/ui/core/library",
	"../utility/formatter",
	"sap/ui/unified/library",
	"sap/ui/core/util/Export",
	"sap/m/MessageToast",
	"sap/ui/core/util/ExportTypeCSV"
], function (Controller, JSONModel, Core, CoreLibrary, formatter, UnifiedLibrary, Export, MessageToast, ExportTypeCSV) {
	"use strict";
	var CalendarDayType = UnifiedLibrary.CalendarDayType,
		ValueState = CoreLibrary.ValueState;
	return Controller.extend("com.demo.TimeandAttendance.controller.History", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.demo.TimeandAttendance.view.History
		 */
		onInit: function () {
			var oLabel = this.getView().byId("oLabel2");
			var result = this.GetClock();
			oLabel.setText(result);
			var that = this;
			setInterval(function () {
				var result = that.GetClock();
				oLabel.setText(result);
			}, 1000);
			var oHistory = {
				"sDate": "",
				"eDate": "",
				"vCombo": false,
				"vBox": true,
				"vBox1": false
			};
			var oModel1 = new JSONModel(oHistory);
			this.getView().setModel(oModel1, "oModel");
		},
		//To redirect the user to home page
		onHome: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("Home", {}, false);
			this.getView().byId("home").addStyleClass("styleHeader");
			this.getView().byId("approve2").removeStyleClass("styleHeader");
			this.getView().byId("card2").removeStyleClass("styleHeader");
			this.getView().byId("history2").removeStyleClass("styleHeader");
		},
		//To direct the user to request page
		onApproval: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("Requests", {}, false);
			this.getView().byId("approve1").addStyleClass("styleHeader");
			this.getView().byId("home1").removeStyleClass("styleHeader");
			this.getView().byId("card1").removeStyleClass("styleHeader");
			this.getView().byId("history2").removeStyleClass("styleHeader");
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
		//To display the profile of employee
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
			this.bFlag = false;
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("idprofile", "com.demo.TimeandAttendance.fragment.profileitem", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
		},
		//To close the profile fragment
		onClose: function (oEvent) {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		//To stay in the same page
		onHistory: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("History", {}, false);
			this.getView().byId("history2").addStyleClass("styleHeader");
			this.getView().byId("home1").removeStyleClass("styleHeader");
			this.getView().byId("approve1").removeStyleClass("styleHeader");
			this.getView().byId("card1").removeStyleClass("styleHeader");
		},
		//To clear the content in the combo box and to display the current week details of the user
		onComboClear: function (oEvent) {
			var that = this;
			var url2 = "/Attendances/tracking/tracking-details?id=" + this.getView().getModel("oLoginModel").getProperty("/id") +
				"&start=null&end=null";
			$.ajax({
				type: "GET",
				async: false,
				url: url2,
				success: function (data) {
					var oHistoryData = new JSONModel(data.data);
					that.getView().setModel(oHistoryData, "oHistoryModel");
					that.getView().getModel("oComboModel").setProperty("/sSelectedKey", "");
				}
			});
		},
		//To display the selected employee content in table
		onComboGo: function (oEvent) {
			var sName = this.getView().getModel("oComboModel").getProperty("/sSelectedKey");
			var tempData = this.getView().getModel("oComboModel").oData.data;
			var i;
			var temp;
			for (i = 0; i < tempData.length; i++) {
				if (tempData[i].name === sName) {
					temp = tempData[i].id;
					break;
				}
			}
			var that = this;
			var url2 = "/Attendances/tracking/tracking-details?id=" + temp +
				"&start=null&end=null";
			$.ajax({
				type: "GET",
				async: false,
				url: url2,
				success: function (data) {
					var oHistoryData = new JSONModel(data.data);
					that.getView().setModel(oHistoryData, "oHistoryModel");
				}
			});
		},
        //To clear the start and and end date and to display the current week data of selected employee/user
		onClear: function (oEvent) {
			var state = this.getView().getModel("oModel").getProperty("/vCombo");
			if (state === true) {
				var sName = this.getView().getModel("oComboModel").getProperty("/sSelectedKey");
				if ((sName === "") || (sName === undefined)) {
					var that = this;
					var url3 = "/Attendances/tracking/tracking-details?id=" + this.getView().getModel("oLoginModel").getProperty("/id") +
						"&start=null&end=null";
					$.ajax({
						type: "GET",
						async: false,
						url: url3,
						success: function (data) {
							var oHistoryData = new JSONModel(data.data);
							that.getView().setModel(oHistoryData, "oHistoryModel");
							that.getView().getModel("oModel").setProperty("/sDate", "");
							that.getView().getModel("oModel").setProperty("/eDate", "");
						}
					});
				} else {
					var tempData = this.getView().getModel("oComboModel").oData.data;
					var i;
					var temp;
					for (i = 0; i < tempData.length; i++) {
						if (tempData[i].name === sName) {
							temp = tempData[i].id;
							break;
						}
					}
					var that = this;
					var url2 = "/Attendances/tracking/tracking-details?id=" + temp +
						"&start=null&end=null";
					$.ajax({
						type: "GET",
						async: false,
						url: url2,
						success: function (data) {
							var oHistoryData = new JSONModel(data.data);
							that.getView().setModel(oHistoryData, "oHistoryModel");
							that.getView().getModel("oModel").setProperty("/sDate", "");
							that.getView().getModel("oModel").setProperty("/eDate", "");
						}
					});
				}
			} else {
				var that = this;
				var url4 = "/Attendances/tracking/tracking-details?id=" + this.getView().getModel("oLoginModel").getProperty("/id") +
					"&start=null&end=null";
				$.ajax({
					type: "GET",
					async: false,
					url: url4,
					success: function (data) {
						var oHistoryData = new JSONModel(data.data);
						that.getView().setModel(oHistoryData, "oHistoryModel");
						that.getView().getModel("oModel").setProperty("/sDate", "");
						that.getView().getModel("oModel").setProperty("/eDate", "");
					}
				});
			}
		},
		//To display the data in the range of start and end date of the selected employee/user
		onGo: function (oEvent) {
			var sDate = this.getView().getModel("oModel").getProperty("/sDate");
			var eDate = this.getView().getModel("oModel").getProperty("/eDate");
			debugger;
			if((eDate==="") && (sDate===""))
			{
				MessageToast.show("Please select any period");
				return;
			}
			if ((eDate <= sDate) && (eDate !== "")) {
				MessageToast.show("End date should be greater then Start date");
				this.getView().getModel("oModel").setProperty("/sDate", "");
				this.getView().getModel("oModel").setProperty("/eDate", "");
			} else {
				var state = this.getView().getModel("oModel").getProperty("/vCombo");
				if (state === true) {
					var that = this;
					var sName = this.getView().getModel("oComboModel").getProperty("/sSelectedKey");
					if ((sName === "") || (sName === undefined)) {
						var url1 = "/Attendances/tracking/tracking-details?id=" + this.getView().getModel("oLoginModel").getProperty("/id") +
							"&start=" + this.getView().getModel("oModel").getProperty("/sDate") + "&end=" + this.getView().getModel("oModel").getProperty(
								"/eDate");
						$.ajax({
							type: "GET",
							async: false,
							url: url1,
							success: function (data) {
								var oHistoryData = new JSONModel(data.data);
								that.getView().setModel(oHistoryData, "oHistoryModel");
							}
						});
					} else {
						var tempData = this.getView().getModel("oComboModel").oData.data;
						var i;
						var temp;
						for (i = 0; i < tempData.length; i++) {
							if (tempData[i].name === sName) {
								temp = tempData[i].id;
								break;
							}
						}
						var that = this;
						var url2 = "/Attendances/tracking/tracking-details?id=" + temp +
							"&start=" + this.getView().getModel("oModel").getProperty("/sDate") + "&end=" + this.getView().getModel("oModel").getProperty(
								"/eDate");
						$.ajax({
							type: "GET",
							async: false,
							url: url2,
							success: function (data) {
								var oHistoryData = new JSONModel(data.data);
								that.getView().setModel(oHistoryData, "oHistoryModel");
							}
						});
					}
				} else {
					var that = this;
					var url3 = "/Attendances/tracking/tracking-details?id=" + this.getView().getModel("oLoginModel").getProperty("/id") +
						"&start=" + this.getView().getModel("oModel").getProperty("/sDate") + "&end=" + this.getView().getModel("oModel").getProperty(
							"/eDate");
					$.ajax({
						type: "GET",
						async: false,
						url: url3,
						success: function (data) {
							var oHistoryData = new JSONModel(data.data);
							that.getView().setModel(oHistoryData, "oHistoryModel");
						}
					});
				}
			}
		},
        //For admin view to update the details of the selected employee
		onUpdate: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("form", "com.demo.TimeandAttendance.fragment.update", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
			var oModel = this.getView().getModel("oHistoryModel");
			var data = oEvent.getSource().getBindingContext("oHistoryModel");
			var spath = data.sPath;
			var datadisplay = data + "";
			var view = oModel.getProperty(datadisplay);
			oModel.setProperty("/selectedRow", spath);
			oModel.setProperty("/selectedValue", view);
			this.spath = spath;
		},
		//To know the changed data of checkin time
		onInputChange: function (oEvent) {
			var changeData = oEvent.mParameters.value;
			var date = this.getView().getModel("oHistoryModel").getProperty("/selectedValue").date;
			var a = new Date(date);
			var b = a.getMonth() + 1;
			date = b + "-" + a.getDate() + "-" + a.getFullYear();
			var total = date + " " + changeData;
			var temp = new Date(total);
			var time = temp.getTime();
			this.getView().getModel("oHistoryModel").setProperty("/selectedValue/checkIn", time);
		},
		//To know the changed data of checkout time
		onOutputChange: function (oEvent) {
			var changeData = oEvent.mParameters.value;
			var date = this.getView().getModel("oHistoryModel").getProperty("/selectedValue").date;
			var a = new Date(date);
			var b = a.getMonth() + 1;
			date = b + "-" + a.getDate() + "-" + a.getFullYear();
			var total = date + " " + changeData;
			var temp = new Date(total);
			var time = temp.getTime();
			this.getView().getModel("oHistoryModel").setProperty("/selectedValue/checkOut", time);
		},
		//The changed data will be recorded on click of save
		onSave: function (oEvent) {
			var path = this.getView().getModel("oHistoryModel").getProperty("/selectedRow");
			path = path.substring(1);
			var tracId = this.getView().getModel("oHistoryModel").oData[path].id;
			var cOutdata = this.getView().getModel("oHistoryModel").getProperty("/selectedValue").checkOut;
			var timeCout = new Date(cOutdata);
			var cOuthr = timeCout.getHours();
			var cIndata = this.getView().getModel("oHistoryModel").getProperty("/selectedValue").checkIn;
			var timeCin = new Date(cIndata);
			var cInhr = timeCin.getHours();
			var totalHr = cOuthr - cInhr;
			var that = this;
			var sReject = {
				"id": that.getView().getModel("oHistoryModel").getProperty("/selectedValue").id,
				"checkOut": that.getView().getModel("oHistoryModel").getProperty("/selectedValue").checkOut,
				"checkIn": that.getView().getModel("oHistoryModel").getProperty("/selectedValue").checkIn,
				"totalHours": totalHr,
				"status": that.getView().getModel("oHistoryModel").getProperty("/selectedValue").status
			};
			var sUrl = "/Attendances/tracking/update";
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
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
					}
				}
			});
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
       //To export the data which is present in the table of selected employee/user
		onDataExport: function () {
			var oExport = new Export({

				exportType: new ExportTypeCSV({
					fileExtension: "xls",
					separatorChar: "\t"
				}),

				models: this.getView().getModel("oHistoryModel"),

				rows: {
					path: "/"
				},
				columns: [{
					name: "Date",
					template: {
						content: "{path: 'date', formatter:'com.demo.TimeandAttendance.utility.formatter.changeDate'}"
					}
				}, {
					name: "Check In",
					template: {
						content: "{path: 'checkIn', formatter:'com.demo.TimeandAttendance.utility.formatter.changeTime'}"
					}
				}, {
					name: "Check Out",
					template: {
						content: "{path: 'checkOut', formatter:'com.demo.TimeandAttendance.utility.formatter.changeTime'}"
					}
				}, {
					name: "Emp Id",
					template: {
						content: "{empId}"
					}
				}, {
					name: "Approval Status",
					template: {
						content: "{status}"
					}
				}]
			});
			oExport.saveFile().catch(function (oError) {

			}).then(function () {
				oExport.destroy();
			});
		},
		//To display the running clock on view
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
			} else if (nhour === 12) {
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
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.demo.TimeandAttendance.view.History
		 */
		onBeforeRendering: function () {
			var that = this;
			var url2 = "/Attendances/tracking/tracking-details?id=" + this.getView().getModel("oLoginModel").getProperty("/id") +
				"&start=null&end=null";
			$.ajax({
				type: "GET",
				async: false,
				url: url2,
				success: function (data) {
					var oHistoryData = new JSONModel(data.data);
					that.getView().setModel(oHistoryData, "oHistoryModel");
				}
			});

			var url3 = "/Attendances/employee/employee-type?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url3,
				success: function (data) {
					if (data.status === true) {
						that.getView().getModel("oModel").setProperty("/vCombo", true);
					}
				}
			});

			var url4 = "/Attendances/employee/employee-list?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url4,
				success: function (data) {
					var oComboData = new JSONModel(data);
					that.getView().setModel(oComboData, "oComboModel");
				}
			});

			var url5 = "/Attendances/employee/verify-admin?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url5,
				success: function (data) {
					if (data.status === true) {
						that.getView().getModel("oModel").setProperty("/vBox", false);
						that.getView().getModel("oModel").setProperty("/vBox1", true);
						that.getView().getModel("oModel").setProperty("/vCombo", true);
						var url6 = "/Attendances/employee/all-employee?empId=INC1";
						$.ajax({
							type: "GET",
							async: false,
							url: url6,
							success: function (data) {
								var oComboData = new JSONModel(data);
								that.getView().setModel(oComboData, "oComboModel");
							}
						});
					}
				}
			});
		}

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.demo.TimeandAttendance.view.History
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.demo.TimeandAttendance.view.History
		 */
		//	onExit: function() {
		//
		//	}

	});

});
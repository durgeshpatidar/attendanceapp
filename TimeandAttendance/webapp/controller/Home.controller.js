sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"../utility/formatter",
	"sap/m/MessageBox"
], function (Controller, JSONModel, History, Dialog, MessageToast, formatter, MessageBox) {
	"use strict";

	return Controller.extend("com.demo.TimeandAttendance.controller.Home", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.demo.TimeandAttendance.view.Home
		 */

		onInit: function () {
			var oLabel = this.getView().byId("oLabel");
			var result = this.GetClock();
			oLabel.setText(result);
			var that = this;
			setInterval(function () {
				var result = that.GetClock();
				oLabel.setText(result);
			}, 1000);
			var oHomeData = {
				"sTime": "",
				"sTime1": "",
				"sEnable": true,
				"sEnable1": false,
				"bVisible": true,
				"bVisible1": false,
				"bVisible2": true,
				"bVisible3": false,
				"bEnable": false,
				"bEnable1": false,
				"bEnable2": false,
				"bEnable3": false,
				"InputValue": ""
			};
			var oModel2 = new JSONModel(oHomeData);
			this.getView().setModel(oModel2, "oHomeModel");
			setInterval(function () {
				that.homeData();
			}, 25000);
		},

		onHome: function (oEvent) {
			this.getView().byId("home").addStyleClass("styleHeader");
			this.getView().byId("approve").removeStyleClass("styleHeader");
			this.getView().byId("card").removeStyleClass("styleHeader");
			this.getView().byId("history").removeStyleClass("styleHeader");
		},

		onApproval: function (oEvent) {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("Requests", {}, false);
			this.getView().byId("approve1").addStyleClass("styleHeader");
			this.getView().byId("home").removeStyleClass("styleHeader");
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
		//To display the profile details of the employee
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
			this.getView().byId("home").removeStyleClass("styleHeader");
			this.getView().byId("approve2").removeStyleClass("styleHeader");
			this.getView().byId("card2").removeStyleClass("styleHeader");
		},
		//To open the fragment to checkin
		onCheckIn: function () {
			var date = this.getView().getModel("oCheckModel").getProperty("/date");
			var checkIn = this.getView().getModel("oCheckModel").getProperty("/checkIn");
			var a = new Date(date);
			var b = a.getMonth() + 1;
			date = a.getDate() + "-" + b + "-" + a.getFullYear();
			var a1 = new Date();
			var b1 = a1.getMonth() + 1;
			var curDate = a1.getDate() + "-" + b1 + "-" + a1.getFullYear();
			if (date === curDate) {
				if (checkIn !== "") {
					debugger;
					MessageToast.show("You have already made the CheckIn for the day");
					this.getView().getModel("oHomeModel").setProperty("/sEnable", false);
					this.getView().getModel("oHomeModel").setProperty("/sEnable1", true);
				}
			} else {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("form", "com.demo.TimeandAttendance.fragment.checkin", this);
					this.getView().addDependent(this._oDialog);
				}
				this._oDialog.open();
				setTimeout(function () {
					var map = new google.maps.Map(sap.ui.core.Fragment.byId("form", "gMapContainer").getDomRef(), {
						center: {
							lat: -34.397,
							lng: 150.644
						},
						zoom: 20
					});
					var infoWindow = new google.maps.InfoWindow();
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function (
							position) {
							var pos = {
								lat: position.coords.latitude,
								lng: position.coords.longitude
							};
							console.log(pos.lat);
							console.log(pos.lng);
							infoWindow.setPosition(pos);
							infoWindow.setContent("Location found.");
							infoWindow.open(map);
							map.setCenter(pos);
						});
					} else {
						// Browser doesn't support Geolocation
						handleLocationError(false, infoWindow, map.getCenter());
					}

					function handleLocationError(browserHasGeolocation, infoWindow, pos) {
						infoWindow.setPosition(pos);
						infoWindow.setContent(
							browserHasGeolocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn't support geolocation."
						);
						infoWindow.open(map);
					}
				}, 1000);
			}
		},
		//To close the checkin fragment
		onCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		//To store the checkin time in database on click of checkin button in the fragment
		onCheckInFrag: function () {
			var that = this;
			var oCheckIn = {
				"empId": this.getView().getModel("oLoginModel").getProperty("/id"),
				"addressId": this.getView().getModel("oLoginModel").getProperty("/addressId"),
				"checkIn": new Date().getTime(),
				// "date": new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDate()
				"date": new Date().getTime()
			};
			var sUrl = "/Attendances/tracking/checkin";
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
						that.getView().byId("checkin").removeStyleClass("cibtn");
						that.getView().byId("checkin").addStyleClass("Button");
						var today = new Date();
						var hour = today.getHours();
						var Minutes = today.getMinutes();
						if (hour < 10) {
							hour = "0" + hour;
						}
						if (Minutes < 10) {
							Minutes = "0" + Minutes;
						}
						var time = ("Time:" + " " + hour + ":" + Minutes);
						that.getView().getModel("oHomeModel").setProperty("/sTime", time);
						that.getView().getModel("oHomeModel").setProperty("/sEnable", false);
						that.getView().getModel("oHomeModel").setProperty("/sEnable1", true);
						// debugger;
						// var oCheckInModel1 = new JSONModel(data.data);
						that.getView().getModel("oCheckInModel").setProperty("/trackingid", data.data);
						var sCheckInTime = hour;
						that.getView().getModel("oCheckInModel").setProperty("/CheckIntime", sCheckInTime);
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						that.hometime();
					} else {
						// MessageToast.show(data.message);
						MessageBox.warning(data.message);
						that.getView().getModel("oHomeModel").setProperty("/sEnable1", true);
					}
				}
			});
		},
		//To validate the face id in fragment
		onFace: function () {
			var that = this;
			var mediaStream = null;
			var handleSuccess = function (stream) {
				player.srcObject = stream;
				mediaStream = stream;
				mediaStream.stop = function () {
					this.getAudioTracks().forEach(function (track) {
						track.stop();
					});
					this.getVideoTracks().forEach(function (track) { //in case... :)
						track.stop();
					});
				};
			};
			if (this.fixedDialog === undefined) {
				this.fixedDialog = new Dialog({
					title: "Click on Capture to take photo",
					beginButton: new sap.m.Button({
						text: "Capture Photo",
						press: function () {
							that.imageVal = document.getElementById("player");
							mediaStream.stop();
							that.fixedDialog.close();
							mediaStream.stop();
							that.getView().getModel("oHomeModel").setProperty("/bVisible", false);
							that.getView().getModel("oHomeModel").setProperty("/bVisible1", true);
							that.getView().getModel("oHomeModel").setProperty("/bEnable", true);
						}
					}),
					content: [
						new sap.ui.core.HTML({
							content: "<video id='player' autoplay></video>"
						})
					],
					endButton: new sap.m.Button({
						text: 'Cancel',
						press: function () {
							that.fixedDialog.close();
							mediaStream.stop();
						}
					})
				});
			}
			this.getView().addDependent(this.fixedDialog);
			this.fixedDialog.open();
			navigator.mediaDevices.getUserMedia({
				video: true
			}).then(handleSuccess);
		},
		//service for location validation
		serviceLocation: function (lat, lng) {
			var that = this;
			var location = {
				"empId": this.getView().getModel("oLoginModel").getProperty("/id"),
				"locationLat": lat,
				"locationLon": lng
			};
			var sUrl = "/Attendances/address/validate";
			$.ajax({
				url: sUrl,
				type: "POST",
				async: false,
				data: JSON.stringify(location),
				contentType: "application/json",
				beforeSend: function (xhr) {
					var param = "/service";
					var token = that.getCSRFToken(sUrl, param);
					xhr.setRequestHeader("X-CSRF-Token", token);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success: function (data) {
					
					if (data.message === "Address Verified!") {
						var sAddress = data.data;
						that.getView().getModel("oLoginModel").setProperty("/addressId", sAddress);
						MessageToast.show(data.message);
						that.getView().getModel("oHomeModel").setProperty("/bVisible2", false);
						that.getView().getModel("oHomeModel").setProperty("/bVisible3", true);
						that.getView().getModel("oHomeModel").setProperty("/bEnable3", true);
					} else {
						MessageToast.show(data.message);
						that.getView().getModel("oHomeModel").setProperty("/bVisible2", true);
						that.getView().getModel("oHomeModel").setProperty("/bVisible3", false);
						that.getView().getModel("oHomeModel").setProperty("/bEnable3", false);
						
					}
				}
			});
		},
		//To validate the location in fragment
		onLocation: function () {
			var that = this;
			debugger;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (
					position) {
					debugger;
					var pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					that.serviceLocation(pos.lat, pos.lng);
				});
			}
			this.getView().getModel("oHomeModel").setProperty("/bVisible2", false);
			this.getView().getModel("oHomeModel").setProperty("/bVisible3", true);
			this.getView().getModel("oHomeModel").setProperty("/bEnable3", true);
		},
		//To open the fragment for checkout
		onCheckOut: function () {
			var date = this.getView().getModel("oCheckModel").getProperty("/date");
			var checkOut = this.getView().getModel("oCheckModel").getProperty("/checkOut");
			var a = new Date(date);
			var b = a.getMonth() + 1;
			date = a.getDate() + "-" + b + "-" + a.getFullYear();
			var a1 = new Date();
			var b1 = a1.getMonth() + 1;
			var curDate = a1.getDate() + "-" + b1 + "-" + a1.getFullYear();
			if (date === curDate) {
				if (checkOut !== null) {
					MessageToast.show("You have already made the CheckOut for the day");
					this.getView().getModel("oHomeModel").setProperty("/sEnable", false);
					this.getView().getModel("oHomeModel").setProperty("/sEnable1", false);
				} else {
					if (!this._oDialog) {
						this._oDialog = sap.ui.xmlfragment("form", "com.demo.TimeandAttendance.fragment.checkout", this);
						this.getView().addDependent(this._oDialog);
					}
					this._oDialog.open();
				}
			} else {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("form", "com.demo.TimeandAttendance.fragment.checkout", this);
					this.getView().addDependent(this._oDialog);
				}
				this._oDialog.open();
			}
		},
		//To record the checkout time in database
		onCheckOutFrag: function () {
			var that = this;
			var totalhours = new Date().getHours() - this.getView().getModel("oCheckModel").getProperty("/checkIn");
			//console.log(totalhours);
			//var totalhours = 6;
			if ((totalhours < 7) || (totalhours > 9)) {
				that._oDialog.close();
				that._oDialog.destroy();
				that._oDialog = null;
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("form", "com.demo.TimeandAttendance.fragment.time", this);
					this.getView().addDependent(this._oDialog);
				}
				this._oDialog.open();
			} else {
				var that = this;
				var oCheckOut = {
					"id": this.getView().getModel("oCheckModel").getProperty("/id"),
					"totalhours": totalhours,
					// "totalHours": "9.5",
					"checkOut": new Date().getTime()
				};
				var sUrl = "/Attendances/tracking/checkout";
				$.ajax({
					url: sUrl,
					type: "POST",
					async: false,
					data: JSON.stringify(oCheckOut),
					contentType: "application/json",
					beforeSend: function (xhr) {
						var param = "/service";
						var token = that.getCSRFToken(sUrl, param);
						xhr.setRequestHeader("X-CSRF-Token", token);
						xhr.setRequestHeader("Accept", "application/json");
					},
					success: function (data) {
						if (data.status === true) {
							that.getView().byId("checkout").removeStyleClass("cobtn");
							that.getView().byId("checkout").addStyleClass("color1");
							var today = new Date();
							var hour = today.getHours();
							var Minutes = today.getMinutes();
							if (hour < 10) {
								hour = "0" + hour;
							}
							if (Minutes < 10) {
								Minutes = "0" + Minutes;
							}
							var time = ("Time:" + " " + hour + ":" + Minutes);
							that.getView().getModel("oHomeModel").setProperty("/sTime1", time);
							that.getView().getModel("oHomeModel").setProperty("/sEnable1", false);
							that._oDialog.close();
							that._oDialog.destroy();
							that._oDialog = null;
							that.getView().getModel("oRequestModel").refresh(true);
							that.onRequest();
							that.hometime();
						} else {
							// MessageToast.show(data.message);
							MessageBox.warning(data.message);
						}
					}
				});
			}
		},
		//To send the workflow details to the manager
		onSend: function () {
			var that = this;
			var totalhours = new Date().getHours() - this.getView().getModel("oCheckModel").getProperty("/checkIn");
			if (totalhours > 9) {
				if (that.getView().getModel("oHomeModel").getProperty("/InputValue") === "") {
					MessageToast.show("Enter the reason");
				} else {
					var oCheckOutfrag = {
						"id": this.getView().getModel("oCheckModel").getProperty("/id"),
						"querytype": "overtime",
						"description": that.getView().getModel("oHomeModel").getProperty("/InputValue"),
						"empId": this.getView().getModel("oLoginModel").getProperty("/id"),
						"requestDate": new Date().getTime(),
						"status": "Pending"
					};
					var sUrl = "/Attendances/workflow/add";
					$.ajax({
						url: sUrl,
						type: "POST",
						async: false,
						data: JSON.stringify(oCheckOutfrag),
						contentType: "application/json",
						beforeSend: function (xhr) {
							var param = "/service";
							var token = that.getCSRFToken(sUrl, param);
							xhr.setRequestHeader("X-CSRF-Token", token);
							xhr.setRequestHeader("Accept", "application/json");
						},
						success: function (data) {
							if (data.status === true) {
								that.checkOut();
								that.hometime();
							} else {
								// MessageToast.show(data.message);
								MessageBox.warning(data.message);
							}
						}
					});
				}
			} else {
				if (that.getView().getModel("oHomeModel").getProperty("/InputValue") === "") {
					MessageToast.show("Enter the reason");
				} else {
					var oCheckOutfrag1 = {
						"id": this.getView().getModel("oCheckModel").getProperty("/id"),
						"querytype": "undertime",
						"description": that.getView().getModel("oHomeModel").getProperty("/InputValue"),
						"empId": this.getView().getModel("oLoginModel").getProperty("/id"),
						"requestDate": new Date().getTime(),
						"status": "Pending"
					};
					var sUrl1 = "/Attendances/workflow/add";
					$.ajax({
						url: sUrl1,
						type: "POST",
						async: false,
						data: JSON.stringify(oCheckOutfrag1),
						contentType: "application/json",
						beforeSend: function (xhr) {
							var param = "/service";
							var token = that.getCSRFToken(sUrl, param);
							xhr.setRequestHeader("X-CSRF-Token", token);
							xhr.setRequestHeader("Accept", "application/json");
						},
						success: function (data) {
							if (data.status === true) {
								that.checkOut();
								that.hometime();
							} else {
								// MessageToast.show(data.message);
								MessageBox.warning(data.message);
							}
						}
					});
				}
			}
		},
		//Common checkout service to record the checkout time
		checkOut: function () {
			var that = this;
			var totalhours = new Date().getHours() - this.getView().getModel("oCheckModel").getProperty("/checkIn");
			var oCheckOut = {
				"id": this.getView().getModel("oCheckModel").getProperty("/id"),
				"totalhours": totalhours,
				"checkOut": new Date().getTime()
			};
			var sUrl = "/Attendances/tracking/checkout";
			$.ajax({
				url: sUrl,
				type: "POST",
				async: false,
				data: JSON.stringify(oCheckOut),
				contentType: "application/json",
				beforeSend: function (xhr) {
					var param = "/service";
					var token = that.getCSRFToken(sUrl, param);
					xhr.setRequestHeader("X-CSRF-Token", token);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success: function (data) {
					if (data.status === true) {
						that.getView().byId("checkout").removeStyleClass("cobtn");
						that.getView().byId("checkout").addStyleClass("color1");
						var today = new Date();
						var hour = today.getHours();
						var Minutes = today.getMinutes();
						if (hour < 10) {
							hour = "0" + hour;
						}
						if (Minutes < 10) {
							Minutes = "0" + Minutes;
						}
						var time = ("Time:" + " " + hour + ":" + Minutes);
						that.getView().getModel("oHomeModel").setProperty("/sTime1", time);
						that.getView().getModel("oHomeModel").setProperty("/sEnable1", false);
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						that.onRequest();
						that.homeData();
					} else {
						// MessageToast.show(data.message);
						MessageBox.warning(data.message);
					}
				}
			});
		},
		//Cancelling the generation of workflow
		onNo: function () {
			var that = this;
			var totalhours = new Date().getHours() - this.getView().getModel("oCheckModel").getProperty("/checkIn");
			var a = new Date();
			var b = a.getMonth() + 1;
			var date = b + "-" + a.getDate() + "-" + a.getFullYear();
			var time = this.getView().getModel("oCheckInModel").getProperty("/CheckIntime") + 8;
			var total = date + " " + time + ":" + "00";
			var temp = new Date(total);
			var checkout = temp.getTime();
			if (totalhours > 9) {
				var oCheckOut = {
					"id": this.getView().getModel("oCheckModel").getProperty("/id"),
					"totalhours": 8,
					"checkOut": checkout
				};
				var sUrl = "/Attendances/tracking/checkout";
				$.ajax({
					url: sUrl,
					type: "POST",
					async: false,
					data: JSON.stringify(oCheckOut),
					contentType: "application/json",
					beforeSend: function (xhr) {
						var param = "/service";
						var token = that.getCSRFToken(sUrl, param);
						xhr.setRequestHeader("X-CSRF-Token", token);
						xhr.setRequestHeader("Accept", "application/json");
					},
					success: function (data) {
						if (data.status === true) {
							that.getView().byId("checkout").removeStyleClass("cobtn");
							that.getView().byId("checkout").addStyleClass("color1");
							var today = new Date();
							var hour = today.getHours();
							var Minutes = today.getMinutes();
							if (hour < 10) {
								hour = "0" + hour;
							}
							if (Minutes < 10) {
								Minutes = "0" + Minutes;
							}
							var time = ("Time:" + " " + hour + ":" + Minutes);
							that.getView().getModel("oHomeModel").setProperty("/sTime1", time);
							that.getView().getModel("oHomeModel").setProperty("/sEnable1", false);
							that._oDialog.close();
							that._oDialog.destroy();
							that._oDialog = null;
							that.getView().getModel("oRequestModel").refresh(true);
							that.onRequest();
							that.homeData();
							that.hometime();
						} else {
							// MessageToast.show(data.message);
							MessageBox.warning(data.message);
						}
					}
				});
			}
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		//To display the running clock on the screen
		GetClock: function () {
			var tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
			var tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
				"November",
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
			var result = "" + tday[nday] + ", " + tmonth[nmonth] + " " + ndate + ", " + nyear + " " + nhour + ":" + nmin + ":" + nsec +
				ap + "";
			return result;
		},
		//To redirect to login page
		onLog: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("RouteLogin");
		},
		//To refresh the data that are changed
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
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.demo.TimeandAttendance.view.Requests
		 */
		onAfterRendering: function () {
			var map = new google.maps.Map(this.getView().byId("id_GMapContainer").getDomRef(), {
				center: {
					lat: -34.397,
					lng: 150.644
				},
				zoom: 20
			});
			var infoWindow = new google.maps.InfoWindow();
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (
					position) {
					var pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					console.log(pos.lat);
					console.log(pos.lng);
					infoWindow.setPosition(pos);
					infoWindow.setContent("Location found.");
					infoWindow.open(map);
					map.setCenter(pos);
				});
			} else {
				// Browser doesn't support Geolocation
				handleLocationError(false, infoWindow, map.getCenter());
			}

			function handleLocationError(browserHasGeolocation, infoWindow, pos) {
				infoWindow.setPosition(pos);
				infoWindow.setContent(
					browserHasGeolocation ? "Error: The Geolocation service failed." : "Error: Your browser doesn't support geolocation."
				);
				infoWindow.open(map);
			}
		},
		hometime: function () {
			var that = this;
			var url1 = "/Attendances/tracking/last-tracking?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url1,
				success: function (data) {
					var oCheckData = new JSONModel(data.data);
					that.getView().setModel(oCheckData, "oCheckModel");
				}
			});
		},
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
		 * Similar to onBeforeRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.demo.TimeandAttendance.view.Home
		 */
		onBeforeRendering: function () {
			var that = this;
			that.getView().getModel("oLoginModel").setProperty("/email", "");
			that.getView().getModel("oLoginModel").setProperty("/password", "");
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

			var url1 = "/Attendances/tracking/last-tracking?empId=" + this.getView().getModel("oLoginModel").getProperty("/id");
			$.ajax({
				type: "GET",
				async: false,
				url: url1,
				success: function (data) {
					var oCheckData = new JSONModel(data.data);
					that.getView().setModel(oCheckData, "oCheckModel");
				}
			});
		}
	});

});
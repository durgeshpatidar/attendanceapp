sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.demo.TimeandAttendance.controller.Login", {
		onInit: function () {
			var oLogindata = {
				"email": "",
				"password": "",
				"sEnable": true,
				"sEnable1": false,
				"sEnable2": false,
				"sEnable3": false,
				"sEnable4": false,
				"sEnable5": false
			};
			var oModel1 = new JSONModel(oLogindata);
			this.getView().setModel(oModel1, "oLoginModel");
			var oProfileData = {};
			var oProfileModel1 = new JSONModel(oProfileData);
			this.getView().setModel(oProfileModel1, "oProfileModel");
			var oSignupData = {
				"email": "",
				"password": "",
				"cnfPassword": "",
				"phoneNo": ""
			};
			var oSignupModel1 = new JSONModel(oSignupData);
			this.getView().setModel(oSignupModel1, "oSignupModel");
			var oForgotData = {
				"email": "",
				"password": "",
				"cnfPassword": "",
				"otp": ""
			};
			var oForgotModel = new JSONModel(oForgotData);
			this.getView().setModel(oForgotModel, "oForgotModel");
			var oAddressData = {};
			var oAddressModel1 = new JSONModel(oAddressData);
			this.getView().setModel(oAddressModel1, "oAddressModel");
			var oCheckIn = {};
			var oCheckInModel1 = new JSONModel(oCheckIn);
			this.getView().setModel(oCheckInModel1, "oCheckInModel");

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

		//Onchange of tab to validate the entered e-mail id of login page
		onChange: function () {
			var that = this;
			var sEmail = {
				"email": this.getView().getModel("oLoginModel").getProperty("/email")
			};
			var sUrl = "/Attendances/employee/validate";
			$.ajax({
				url: sUrl,
				type: "POST",
				async: false,
				data: JSON.stringify(sEmail),
				contentType: "application/json",
				beforeSend: function (xhr) {
					var param = "/service";
					var token = that.getCSRFToken(sUrl, param);
					xhr.setRequestHeader("X-CSRF-Token", token);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success: function (data) {
					if (data.status !== true) {
						// MessageToast.show(data.message);
						MessageBox.alert(data.message);
					}
				}
			});

		},

		//Onchange of tab to validate the entered e-mail id of signup page
		onSignupChange: function () {
			var that = this;
			var sEmail = {
				"email": this.getView().getModel("oSignupModel").getProperty("/email")
			};
			var sUrl = "/Attendances/employee/validate";
			$.ajax({
				url: sUrl,
				type: "POST",
				async: false,
				data: JSON.stringify(sEmail),
				contentType: "application/json",
				beforeSend: function (xhr) {
					var param = "/service";
					var token = that.getCSRFToken(sUrl, param);
					xhr.setRequestHeader("X-CSRF-Token", token);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success: function (data) {
					if (data.status !== true) {
						// MessageToast.show(data.message);
						MessageBox.alert(data.message);
						that.getView().getModel("oSignupModel").setProperty("/email", "");
					}
				}
			});
		},
		//Onchange of tab to validate the entered phone number
		onSignupPhoneChange: function () {
			var phoneRegex = /^\d{10}$/;
			var sPhone = this.getView().getModel("oSignupModel").getProperty("/phoneNo");
			if (sPhone === "" || !(sPhone.match(phoneRegex))) {
				MessageToast.show("Enter 10digit Phone Number");
				this.getView().getModel("oSignupModel").setProperty("/phoneNo", "");
			}
		},
		//Onpress of login in login page
		onLoginTap: function (oEvent) {
			/*var sPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
			var sPassword = this.getView().getModel("oLoginModel").getProperty("/password");
			if (sPassword === "" || !(sPassword.match(sPassRegex))) {
				MessageToast.show("Invalid Password");
			} else {*/
			var sEmail = this.getView().getModel("oLoginModel").getProperty("/email");
			var sPassword = this.getView().getModel("oLoginModel").getProperty("/password");
			if (sEmail === "") {
				MessageToast.show("Email Required!");
				return;
			}
			if (sPassword === "") {
				MessageToast.show("Password Required!");
			} else {
				var that = this;
				var oData = {
					"email": this.getView().getModel("oLoginModel").getProperty("/email"),
					"password": this.getView().getModel("oLoginModel").getProperty("/password")
				};
				var sUrl = "/Attendances/employee/login";
				$.ajax({
					url: sUrl,
					type: "POST",
					async: false,
					data: JSON.stringify(oData),
					contentType: "application/json",
					beforeSend: function (xhr) {
						var param = "/service";
						var token = that.getCSRFToken(sUrl, param);
						xhr.setRequestHeader("X-CSRF-Token", token);
						xhr.setRequestHeader("Accept", "application/json");
					},
					success: function (data) {
						if (data.status === true) {
							var sId = data.data.id;
							that.getView().getModel("oLoginModel").setProperty("/id", sId);
							var router = sap.ui.core.UIComponent.getRouterFor(that);
							router.navTo("Home", {}, false);
						} else {
							// MessageToast.show(data.message);
							MessageBox.error(data.message);
						}
					}
				});
			}
		},

		//Onpress of forgot password in login page
		onForgot: function (oEvent) {
			this.getView().getModel("oLoginModel").setProperty("/sEnable", false);
			this.getView().getModel("oLoginModel").setProperty("/sEnable3", true);
		},

		//To validate the mail id to send otp to reset the password
		onSubmit: function (oEvent) {
			var that = this;
			var sEmail = {
				"email": this.getView().getModel("oForgotModel").getProperty("/email")
			};
			debugger;
			if (sEmail.email === "") {
				MessageToast.show("Please enter email for Otp request");
			} else {
				var sUrl = "/Attendances/employee/validate";
				$.ajax({
					url: sUrl,
					type: "POST",
					async: false,
					data: JSON.stringify(sEmail),
					contentType: "application/json",
					beforeSend: function (xhr) {
						var param = "/service";
						var token = that.getCSRFToken(sUrl, param);
						xhr.setRequestHeader("X-CSRF-Token", token);
						xhr.setRequestHeader("Accept", "application/json");
					},
					success: function (data) {
						if (data.status !== true) {
							// MessageToast.show(data.message);
							MessageBox.alert(data.message);
						} else {
							var oData = {
								"email": that.getView().getModel("oForgotModel").getProperty("/email")
							};
							var sUrl1 = "/Attendances/send-mail";
							$.ajax({
								url: sUrl1,
								type: "POST",
								async: false,
								data: JSON.stringify(oData),
								contentType: "application/json",
								beforeSend: function (xhr) {
									var param = "/service";
									var token = that.getCSRFToken(sUrl, param);
									xhr.setRequestHeader("X-CSRF-Token", token);
									xhr.setRequestHeader("Accept", "application/json");
								},
								success: function (data1) {
									if (data1.status === true) {
										that.getView().getModel("oLoginModel").setProperty("/sEnable3", false);
										that.getView().getModel("oLoginModel").setProperty("/sEnable4", true);
									} else {
										// MessageToast.show(data.message);
										MessageBox.error(data.message);
									}
								}
							});
						}
					}
				});
			}
		},
		//To validate otp
		onNextPress: function (oEvent) {
			var that = this;
			var url2 = "/Attendances/validate-otp?email=" + that.getView().getModel("oForgotModel").getProperty("/email") + "&otp=" + that.getView()
				.getModel("oForgotModel").getProperty("/otp");
			$.ajax({
				type: "GET",
				async: false,
				url: url2,
				success: function (data) {
					if (data.status !== true) {
						// MessageToast.show(data.message);
						MessageBox.alert(data.message);
					} else {
						that.getView().getModel("oLoginModel").setProperty("/sEnable4", false);
						that.getView().getModel("oLoginModel").setProperty("/sEnable5", true);
					}
				}
			});
		},
		//To save the newly created password
		onSave: function (oEvent) {
			var that = this;
			var sPassword = that.getView().getModel("oForgotModel").getProperty("/password");
			var sCnfPassword = that.getView().getModel("oForgotModel").getProperty("/cnfPassword");
			if ((sPassword === sCnfPassword) && (sPassword !== "")) {
				var oData = {
					"email": that.getView().getModel("oForgotModel").getProperty("/email"),
					"password": that.getView().getModel("oForgotModel").getProperty("/password")
				};
				var sUrl = "/Attendances/employee/update-password";
				$.ajax({
					url: sUrl,
					type: "POST",
					async: false,
					data: JSON.stringify(oData),
					contentType: "application/json",
					beforeSend: function (xhr) {
						var param = "/service";
						var token = that.getCSRFToken(sUrl, param);
						xhr.setRequestHeader("X-CSRF-Token", token);
						xhr.setRequestHeader("Accept", "application/json");
					},
					success: function (data) {
						if (data.status === true) {
							that.getView().getModel("oLoginModel").setProperty("/sEnable5", false);
							that.getView().getModel("oLoginModel").setProperty("/sEnable", true);
						} else {
							// MessageToast.show(data.message);
							MessageBox.error(data.message);
						}
					}
				});
			} else {
				MessageToast.show("Password doesn't match or Fields may be empty");
			}
		},
		//To direct to signup page
		onLinkPress: function (oEvent) {
			this.getView().getModel("oLoginModel").setProperty("/sEnable", false);
			this.getView().getModel("oLoginModel").setProperty("/sEnable1", true);
		},
		//Back link to redirect to login page
		onSigninPress: function (oEvent) {
			this.getView().getModel("oLoginModel").setProperty("/sEnable1", false);
			this.getView().getModel("oLoginModel").setProperty("/sEnable3", false);
			this.getView().getModel("oLoginModel").setProperty("/sEnable", true);
		},
		//To direct the user to face recording page and to store the newly registered employee data
		onNextTap: function (oEvent) {
			var that = this;
			var sPassword = this.getView().getModel("oSignupModel").getProperty("/password");
			var sCnfPassword = this.getView().getModel("oSignupModel").getProperty("/cnfPassword");
			if ((sPassword === sCnfPassword) && (sPassword !== "")) {
				var sPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
				if (sPassword === "" || !(sPassword.match(sPassRegex))) {
					MessageToast.show("Incorrect Password Format, Password must contain an Uppercase Lowercase Number and a Special character");
				} else {
					if ((this.getView().getModel("oSignupModel").getProperty("/email") === "") || (this.getView().getModel("oSignupModel").getProperty(
							"/phoneNo") === "")) {
						MessageToast.show("Please enter all the fields");
					} else {
						var sUrl = "/Attendances/employee/signup";
						var sSignuppl = {
							"email": this.getView().getModel("oSignupModel").getProperty("/email"),
							"password": this.getView().getModel("oSignupModel").getProperty("/password"),
							"phoneNo": this.getView().getModel("oSignupModel").getProperty("/phoneNo")
						};
						$.ajax({
							url: sUrl,
							type: "POST",
							async: false,
							data: JSON.stringify(sSignuppl),
							contentType: "application/json",
							beforeSend: function (xhr) {
								var param = "/service";
								var token = that.getCSRFToken(sUrl, param);
								xhr.setRequestHeader("X-CSRF-Token", token);
								xhr.setRequestHeader("Accept", "application/json");
							},
							success: function (data) {
								if (data.status === true) {
									that.getView().getModel("oLoginModel").setProperty("/sEnable1", false);
									that.getView().getModel("oLoginModel").setProperty("/sEnable2", true);
								} else {
									MessageBox.error(data.message);
									that.getView().getModel("oSignupModel").setProperty("/email", "");
									that.getView().getModel("oSignupModel").getProperty("/phoneNo", null);
									that.getView().getModel("oSignupModel").setProperty("/password", "");
									that.getView().getModel("oSignupModel").setProperty("/cnfPassword", "");
								}
							}
						});
					}
				}
			} else {
				MessageToast.show("Password doesn't match or Fields may be empty");
			}

		},
		//To redirect back to login page from face recording page
		onSignup: function (oEvent) {
			this.getView().getModel("oLoginModel").setProperty("/sEnable2", false);
			this.getView().getModel("oLoginModel").setProperty("/sEnable", true);
		}
	});
});
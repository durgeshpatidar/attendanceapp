jQuery.sap.declare("com.demo.TimeandAttendance.utility.formatter");
com.demo.TimeandAttendance.utility.formatter = {
	changeDate: function (sValue) {
		var a = new Date(sValue);
		var b = a.getMonth() + 1;
		sValue = a.getDate() + "-" + b + "-" + a.getFullYear();
		return sValue;
	},
	changeTime: function (sValue) {
		if(!sValue)
		{
		return "-";
		}
		var a = new Date(sValue);
		sValue = a.getHours() + ":" + a.getMinutes();
		return sValue;
	},
	changeColor: function (sValue) {
		if(sValue === "Rejected")
		{
			sValue = "Error";
		}
		if(sValue === "Approved")
		{
			sValue = "Good";
		}
		if(sValue === "Pending")
		{
			sValue = "Critical";
		}
		return sValue;
	},
	setDate: function (sValue) {
		sValue = new Date();
		return sValue;
	}
};
/*sap.ui.define(function() {
	"use strict";

	var Formatter = {

		changeDate :  function (fValue) {
			var a = new Date(fValue);
		fValue = a.getDate() + "-" + a.getMonth() + "-" + a.getFullYear();
		return fValue;
		}
	};
	return Formatter;

}, /* bExport= */ /*true);*/

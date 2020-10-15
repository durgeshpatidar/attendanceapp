jQuery.sap.declare("com.demo.TableAction.utility.formatter");
com.demo.TableAction.utility.formatter = {
	generateQuality: function (sValue) {
		this.removeStyleClass("textGreen textRed");
		if (sValue <= 3) {
			sValue = "Good";
			this.addStyleClass("textGreen");
		} else {
			sValue = "Bad";
			this.addStyleClass("textRed");
		}
		return sValue;
	},
	changeColor: function (sValue) {
		this.removeStyleClass("textGreen textRed");
		if (sValue <= 3) {
			this.addStyleClass("textGreen");
		} else {
			this.addStyleClass("textRed");
		}
		return sValue;
	}
};
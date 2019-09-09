angular.module('umbraco').controller('SvgIconPickerController', function($scope) {
	
	if ($scope.model.value === undefined || $scope.model.value === null) {
		$scope.model.value = "";
	}

	var svgLink = $scope.model.config.svgPath + "?r=" + (new Date()).getTime();

	$scope.getSvgLink = function(symbol) {
		return svgLink + "#" + symbol;
	};

	$scope.openSvgIconPicker = function () {
		$scope.svgIconPickerOverlay = {
			view: "/App_Plugins/SvgIconPicker/views/svg.icon.picker.dialog.html",
			show: true,
			svgLink: svgLink,
			selected: $scope.model.value,
			submit: function (model) {
				
				if (model.icon) {
					$scope.model.value = model.icon;
				}

				$scope.svgIconPickerOverlay.show = false;
				$scope.svgIconPickerOverlay = null;
			},
			close: function () {
				$scope.svgIconPickerOverlay.show = false;
				$scope.svgIconPickerOverlay = null;
			}
		};
	};
	
});
angular.module('umbraco').controller('SvgIconPickerDialogController', function ($scope, $http, localizationService) {
	
	$scope.model.hideSubmitButton = true;
	
	if (!$scope.model.title) {
		$scope.model.title = localizationService.localize("defaultdialogs_selectIcon");
	}

	var svgLink = $scope.model.svgLink;

	$scope.getSvgLink = function(symbol) {
		return svgLink + "#" + symbol;
	};

	$http.get(svgLink).then(function(response) {

		// get svg source code
		var svg = angular.element(response.data);

		// empty icon array
		$scope.icons = [];

		// loop through svg icons
		angular.forEach(svg.find("symbol"), function(symbol) {
			$scope.icons.push(angular.element(symbol).attr("id"));
		});

	});

	$scope.selectIcon = function (icon) {
		$scope.model.icon = icon;
		$scope.submitForm($scope.model);
	};
});
(function() {
  "use strict";

  angular
    .module("NarrowItDownApp", [])
    .controller("NarrowItDownController", NarrowItDownController)
    .directive("foundItems", foundItems)
    .service("MenuSearchService", MenuSearchService);
  // directive
  function foundItems() {
    let ddo = {
      restrict: "E",
      templateUrl: "found-items.html",
      scope: {
        foundItems: "<",
        onRemove: "&",
        server: "<",
        itemNotFound: "<",
        loader: "<"
      }
    };
    return ddo;
  }
  // controller
  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController(MenuSearchService) {
    let ctrl = this;
    ctrl.userInput = "";

    ctrl.search = function() {
      ctrl.loader = true;

      if (ctrl.userInput && ctrl.userInput !== "") {
        ctrl.userInput = ctrl.userInput.toLowerCase();
        MenuSearchService.getMatchedMenuItems(ctrl.userInput).then(
          r => {
            ctrl.loader = false;
            ctrl.serverStatus = false;

            if (r.length > 0) {
              ctrl.found = r;
              ctrl.itemNotFound = false;
            } else {
              ctrl.itemNotFound = true;
              ctrl.found = "";
            }
          },
          f => {
            ctrl.loader = false;
            ctrl.found = "";
            ctrl.itemNotFound = false;
            ctrl.serverStatus = true;
          }
        );
      } else {
        ctrl.loader = false;
        ctrl.itemNotFound = true;
        ctrl.serverStatus = false;
        ctrl.found = "";
      }
    };
    ctrl.remove = function(index) {
      ctrl.found.splice(index, 1);
    };
  }

  // service
  MenuSearchService.$inject = ["$http"];
  function MenuSearchService($http) {
    let fn = this;
    //  That method will be responsible for reaching out to the server (using the $http service)
    fn.getMatchedMenuItems = function(userInput) {
      return $http({
        url: "https://davids-restaurant.herokuapp.com/menu_items.json",
        method: "GET"
      }).then(
        // success function
        r => {
          let data = r.data.menu_items;
          let foundItems = [];
          foundItems = data.filter(n => {
            if (n.description.toLowerCase().includes(userInput)) {
              return n;
            }
          });
          return foundItems;
        }
      );
    };
  }
})();

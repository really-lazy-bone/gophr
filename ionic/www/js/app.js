'use strict';

// TODO: change this to productional address later
var SERVER_ADDRESS = 'http://2d240713.ngrok.io';

angular.module('gophr', ['ionic', 'ngRoute', 'relativeDate', 'barcodeGenerator'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.backgroundColorByHexString('#42f6cb');
    }
  });
})

.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl as home'
      })
      .when('/new-purchase', {
        templateUrl: 'partials/new-purchase.html',
        controller: 'NewPurchaseCtrl as purchase'
      })
      .when('/pickup/:id', {
        templateUrl: 'partials/pickup.html',
        controller: 'PickupCtrl as pickup'
      })
      .when('/location-picker', {
        templateUrl: 'partials/location-picker.html',
        controller: 'LocationPickerCtrl as location'
      })
      .otherwise({
        redirectTo: '/home'
      });;
  }])

.controller('HomeCtrl', function($http) {
  var vm = this;

  vm.orders = [];

  $http.get(SERVER_ADDRESS + '/api/orders')
    .then(function(response) {
      vm.orders = response.data;
    }, function(response) {
      console.error(response);
    });

  vm.getPendingList = getPendingList;
  vm.getCompletedList = getCompletedList;

  function getPendingList () {
    return vm.orders.filter(function(order) {
      return order.state === 'pending';
    });
  }

  function getCompletedList () {
    return vm.orders.filter(function(order) {
      return order.state === 'completed';
    });
  }
})

.controller('NewPurchaseCtrl', function(ContactsState, $location) {
  var vm = this;

  // hard code groups and contacts
  vm.groups = [
    {
      name: 'Dev team'
    },
    {
      name: 'Sales'
    },
    {
      name: 'Tech Supports'
    }
  ];

  vm.contacts = [
    {
      name: 'Eric'
    },
    {
      name: 'Michael'
    },
    {
      name: 'Timothy'
    },
    {
      name: 'Pierre'
    }
  ];

  ContactsState.contacts.forEach(function(contact) {
    vm.contacts.forEach(function(existingContact) {
      if (contact.name === existingContact.name) {
        existingContact.isSelected = true;
      }
    });
  });
  vm.selectItem = selectItem;
  vm.cancel = cancel;
  vm.next = next;

  function selectItem (item) {
    item.isSelected = (item.isSelected) ? !item.isSelected : true;
  }

  function cancel () {
    ContactsState.contacts = [];
    $location.path('/home');
  }

  function next () {
    ContactsState.contacts = getSelectedItems();
    $location.path('/location-picker');
  }

  function getSelectedItems () {
    return vm.contacts.filter(function(contact) {
      return contact.isSelected;
    });
  }
})

.controller('LocationPickerCtrl', function($scope, $ionicPopup, $timeout, $location, ContactsState, $ionicLoading, $http) {
  var vm = this;

  vm.order = {
    contacts: ContactsState.contacts
  };

  vm.completeVoucher = completeVoucher;

  function completeVoucher () {
    vm.loadingModal = $ionicPopup.show({
      template: '<ion-spinner icon="android"></ion-spinner>',
      cssClass: 'confirmation'
    });

    // TODO: implement actual date picker
    vm.order.pickupDateTime = new Date();

    $http.post(SERVER_ADDRESS + '/api/order', vm.order)
      .then(function() {
      });

    $timeout(function() {
      vm.loadingModal.close();

      $timeout(function() {
        vm.completeModal = $ionicPopup.show({
          template: '<div><i class="icon ion-android-done"></i></div>' +
            '<div>Sent</div>',
          cssClass: 'confirmation'
        });

        $timeout(function() {
          vm.completeModal.close();
          $timeout(function() {
            $location.path('/home');
          }, 500);
        }, 1000);
      }, 500);
    }, 1000);
  }
})

.controller('PickupCtrl', function($timeout, $scope, $http, $routeParams) {
  var vm = this;

  $http.get(SERVER_ADDRESS + '/api/order/' +$routeParams.id)
    .then(function(response) {
      vm.order = response.data;
    });

  vm.loading = true;
  vm.completed = false;

  $timeout(function() {
    vm.loading = false;

    // $timeout(function() {
    //   vm.completed = true;
    // }, 1000);
  }, 1000);

  // todo get token from server
})

.service('ContactsState', function() {
  return {
    contacts: []
  };
})

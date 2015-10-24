angular.module('gophr', ['ionic', 'ngRoute', 'relativeDate'])

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

.controller('LocationPickerCtrl', function($scope, $ionicPopup, $timeout, $location, ContactsState, $ionicLoading) {
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

    $timeout(function() {
      vm.loadingModal.close();
      vm.completeModal = $ionicPopup.show({
        template: '<div><i class="icon ion-android-done"></i></div>' +
          '<div>Sent</div>',
        cssClass: 'confirmation'
      });

      $timeout(function() {
        vm.completeModal.close();
        $location.path('/home');
      }, 1000);
    }, 1000);

  }
})

.controller('HomeCtrl', function($http) {
  var vm = this;

  var now = new Date();
  var nextHour = new Date(now).setHours(now.getHours() + 1);
  var twoHoursLater = new Date(now).setMinutes(now.getMinutes() + 2);

  vm.orders = [
    {
      id: 0,
      state: 'pending',
      name: 'Black Friday',
      lockedDateTime: nextHour,
      pickupDateTime: twoHoursLater
    },
    {
      id: 0,
      state: 'completed',
      name: 'Tender Green',
      lockedDateTime: new Date(),
      pickupDateTime: new Date()
    },
    {
      id: 0,
      state: 'completed',
      name: 'Starbucks',
      lockedDateTime: new Date(),
      pickupDateTime: new Date()
    },
  ];

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

.controller('PickupCtrl', function($ionicLoading, $timeout) {
  var vm = this;

  var brCodeDOM = document.querySelector('#br_code');

  vm.loading = true;

  $timeout(function() {
    vm.loading = false;

    // $timeout(function() {
    //   vm.completed = true;
    // }, 1000);
  }, 1000);

  // todo get token from server
  JsBarcode(brCodeDOM, 'asdfghj');
})

.service('ContactsState', function() {
  return {
    contacts: []
  };
})

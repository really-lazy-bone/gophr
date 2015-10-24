angular.module('gophr', ['ionic', 'ngRoute', 'relativeDate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
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
        templateUrl: 'partials/new-purchase.html'
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

.controller('LocationPickerCtrl', function($scope, $ionicPopup, $timeout, $location) {
  var vm = this;

  vm.completeVoucher = completeVoucher;

  function completeVoucher () {
    vm.completeModal = $ionicPopup.show({
      template: '<div><i class="icon ion-android-done"></i></div>' +
        '<div>Sent</div>',
      cssClass: 'confirmation'
    });

    $timeout(function() {
      vm.completeModal.close();
      $location.path('/home');
    }, 680);
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

.controller('PickupCtrl', function() {
  var vm = this;

  var brCodeDOM = document.querySelector('#br_code');

  JsBarcode(brCodeDOM, 'test');
})

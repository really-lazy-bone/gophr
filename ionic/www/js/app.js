'use strict';

// TODO: change this to productional address later
var SERVER_ADDRESS = 'http://2d240713.ngrok.io';

// hardcoded username to demonstrate user system
var USER_NAME = 'Eric';

angular.module('gophr', ['ionic', 'ngRoute', 'relativeDate', 'barcodeGenerator', 'angular.filter'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
      .when('/location-picker', {
        templateUrl: 'partials/location-picker.html',
        controller: 'LocationPickerCtrl as location'
      })
      .when('/pickup/:id', {
        templateUrl: 'partials/pickup.html',
        controller: 'PickupCtrl as pickup'
      })
      .when('/restaurant-menu/:orderId/:userContactId', {
        templateUrl: 'partials/restaurant-menu.html',
        controller: 'RestaurantMenuCtrl as menu'
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
      console.dir(response);
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

      vm.userContact = vm.order.contacts.filter(function(contact) {
        return contact.name === USER_NAME;
      })[0];
    });

  vm.loading = true;
  vm.completed = false;

  $timeout(function() {
    vm.loading = false;

    // $timeout(function() {
    //   vm.completed = true;
    // }, 1000);
  }, 1000);
})

.controller('RestaurantMenuCtrl', function($ionicPopup, $http, $routeParams, $location) {
  var vm = this;

  $http.get(SERVER_ADDRESS + '/api/order/' + $routeParams.orderId)
    .then(function(response) {
      vm.order = response.data;

      vm.currentContact = vm.order.contacts.filter(function(contact) {
        return contact.id == $routeParams.contactId;
      })[0];
    });

  $http.get(SERVER_ADDRESS + '/api/restaurant/menu')
    .then(function(response) {
      vm.menuItems = response.data;
    });

  vm.setTip = setTip;
  vm.promptCreditCard = promptCreditCard;
  vm.getTotal = getTotal;
  vm.addItem = addItem;
  vm.removeItem = removeItem;
  vm.getItemCount = getItemCount;
  vm.checkout = checkout;
  vm.goBack = goBack;

  function setTip (tip) {
    vm.tip = tip;

    if (vm.currentContact) {
      vm.currentContact.tip = vm.currentContact.orderItems.reduce(function(total, item) {
        return total + item.price * item.quantity;
      }, 0) * (tip) / 100;
    }
  }

  function promptCreditCard () {
    $ionicPopup.prompt({
      title: 'Credit Card',
      template: 'Enter your credit card',
      inputType: 'text',
      inputPlaceholder: '2222-2222-2222'
    }).then(function(res) {
      console.log('Your password is', res);
    });
  }

  function getTotal () {
    if (vm.currentContact) {
      var tip = (vm.tip) ? vm.tip : 0;
      return vm.currentContact.orderItems.reduce(function(total, item) {
        return total + item.price * item.quantity;
      }, 0) * (100 + tip) / 100;
    } else {
      return 0;
    }
  }

  function addItem (item) {
    var containItem = vm.currentContact.orderItems.filter(function(orderItem, index) {
      return orderItem.name === item.name;
    }).length > 0;

    if (containItem) {
      vm.currentContact.orderItems.forEach(function(orderItem) {
        if (orderItem.name === item.name) {
          orderItem.quantity ++;
        }
      });
    } else {
      var newItem = angular.copy(item);
      newItem.quantity = 1;
      vm.currentContact.orderItems.push(newItem);
    }
  }

  function removeItem (item) {
    var containItem = vm.currentContact.orderItems.filter(function(orderItem, index) {
      return orderItem.name === item.name;
    }).length > 0;

    if (containItem) {
      vm.currentContact.orderItems.forEach(function(orderItem) {
        if (orderItem.name === item.name) {
          orderItem.quantity --;
        }
      });
    }
  }

  function getItemCount (item) {
    if (vm.currentContact) {
      var theItem = vm.currentContact.orderItems.filter(function(orderItem, index) {
        return orderItem.name === item.name;
      })[0];

      return (theItem && theItem.quantity) ? theItem.quantity : 0;
    } else {
      return 0;
    }
  }

  function checkout () {
    $http.post(SERVER_ADDRESS + '/api/order/' + $routeParams.orderId + '/checkout', vm.currentContact)
      .then(function() {
        $location.path('/home');
      });
  }

  function goBack (event) {
    event.stopPropagation();
    $location.path('/home');
  }
})

.service('ContactsState', function() {
  return {
    contacts: []
  };
})

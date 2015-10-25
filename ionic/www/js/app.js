'use strict';

// TODO: change this to productional address later
var SERVER_ADDRESS = 'http://45.55.186.189:3000';

// hardcoded username to demonstrate user system
var USER_NAME = 'Michael';

var socket = io.connect(SERVER_ADDRESS);

angular.module('gophr', ['ionic', 'ngRoute', 'relativeDate', 'barcodeGenerator', 'angular.filter'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.backgroundColorByHexString('#42f6cb');
    }
  });
})

.run(function($ionicPopup, $timeout, $location) {

  socket.on('connected', function(socket) {
    console.log('connected to server via socket io');
  });

  socket.on('invite', function(data) {
    var contactId = data.contacts.filter(function(contact) {
      return contact.name === USER_NAME;
    })[0]._id;
    if (contactId) {
      $timeout(function() {
        var alertPopup = $ionicPopup.show({
          templateUrl: 'partials/message.html',
          title: 'Invite',
          cssClass: 'message',
          buttons: [
            { text: 'Ignore' },
            {
              text: '<b>Accept</b>',
              type: 'button-main',
              onTap: function(e) {
                $location.path('/restaurant-menu/' + data._id + '/' + contactId);
              }
            }
          ]
        });
      }, 3500);
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

.controller('HomeCtrl', function($http, $ionicPopup, $scope) {
  var vm = this;

  vm.orders = [];

  refresh();

  vm.getPendingList = getPendingList;
  vm.getCompletedList = getCompletedList;
  vm.isLessThan5 = isLessThan5;
  vm.isPast = isPast;
  vm.refresh = refresh;

  function refresh () {
    $http.get(SERVER_ADDRESS + '/api/orders')
      .then(function(response) {
        vm.orders = response.data;
      }, function(response) {
        alert(JSON.stringify(response));
      })
      .finally(function() {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });;
  }

  function isLessThan5 (time) {
    return (new Date(time).getTime() - new Date().getTime()) > 0 &&
      (new Date(time).getTime() - new Date().getTime()) < 300000;
  }

  function isPast (time) {
    return new Date(time).getTime() - new Date().getTime() < 0;
  }

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
      name: 'Bruce',
      profileUrl: 'http://www.money2020.com/assets/hackjudges/dragt_bruce.png'
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

  var pickupDateTime = new Date();
  pickupDateTime.setHours(pickupDateTime.getHours() + 1);

  console.log(pickupDateTime);

  vm.order = {
    contacts: ContactsState.contacts,
    pickupDateTime: pickupDateTime
  };

  var ampm = vm.order.pickupDateTime.getHours() > 12 ? 'pm' : 'am';
  var hours = vm.order.pickupDateTime.getHours() % 12 || 12;
  vm.pickupDateTimeStr = hours + ':' +
    vm.order.pickupDateTime.getMinutes() + ' ' + ampm;

  vm.completeVoucher = completeVoucher;
  vm.parsePickupDateTime = parsePickupDateTime;

  function parsePickupDateTime () {
    if (vm.pickupDateTimeStr) {
      vm.order.pickupDateTime = parseTime(vm.pickupDateTimeStr);
      var ampm = vm.order.pickupDateTime.getHours() > 12 ? 'pm' : 'am';
      var hours = vm.order.pickupDateTime.getHours() % 12 || 12;
      vm.pickupDateTimeStr = hours + ':' +
        vm.order.pickupDateTime.getMinutes() + ' ' + ampm;
    }
  }

  function parseTime(timeString) {
    if (timeString == '') return null;

    var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);
    if (time == null) return null;

    var hours = parseInt(time[1],10);
    if (hours == 12 && !time[4]) {
          hours = 0;
    }
    else {
        hours += (hours < 12 && time[4])? 12 : 0;
    }
    var d = new Date();
    d.setHours(hours);
    d.setMinutes(parseInt(time[3],10) || 0);
    d.setSeconds(0, 0);
    return d;
  }

  function completeVoucher (event) {
    event.stopPropagation();

    vm.loadingModal = $ionicPopup.show({
      template: '<ion-spinner icon="android"></ion-spinner>',
      cssClass: 'confirmation'
    });

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

  socket.on('transation', function(order) {
    $timeout(function() {
      vm.loading = true;
    });
  });

  socket.on('transation-completed', function(order){
    $timeout(function() {
      vm.completed = true;
      vm.loading = false;
    });
  });

  $http.get(SERVER_ADDRESS + '/api/order/' + $routeParams.id)
    .then(function(response) {
      vm.order = response.data;
      vm.completed = vm.order.state === 'completed';

      vm.userContact = vm.order.contacts.filter(function(contact) {
        return contact.name === USER_NAME;
      })[0];

      if (!vm.completed) {
        vm.loading = true;
        $timeout(function() {
          vm.loading = false;
        }, 1000);
      }

      $http.get(SERVER_ADDRESS + '/api/order/' + vm.order.fakeId + '/shoppinglist?process=false')
        .then(function(response) {
          vm.shoppinglist = response.data.list;
          vm.tip = response.data.tip;
        });
    });

  vm.getTotal = getTotal;

  function getTotal () {
    if (vm.shoppinglist) {
      return vm.shoppinglist.reduce(function(total, item) {
        return total + item.quantity * item.price;
      }, vm.tip);
    } else {
      return 0;
    }
  }
})

.controller('RestaurantMenuCtrl', function($ionicPopup, $http, $routeParams, $location) {
  var vm = this;
  vm.tip = 0;

  $http.get(SERVER_ADDRESS + '/api/order/' + $routeParams.orderId)
    .then(function(response) {
      vm.order = response.data;

      vm.currentContact = vm.order.contacts.filter(function(contact) {
        return contact._id == $routeParams.userContactId;
      })[0];
      var beforeTipTotal = vm.currentContact.orderItems.reduce(function(amount, orderItem) {
        return amount + orderItem.price * orderItem.quantity;
      }, 0);
      vm.tip = vm.currentContact.tip ? vm.currentContact.tip : 0;
      vm.tip = Math.floor((vm.tip / beforeTipTotal) * 100);
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

.controller('MessageCtrl', function() {
  var vm = this;
})

.service('ContactsState', function() {
  return {
    contacts: []
  };
})

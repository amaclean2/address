var addressBook = angular.module('AddressBook', []);

addressBook.controller('mainController', function($scope, $http) {

  // initial http request
  $http.get('http://localhost:18080/contacts')
    .then( response => {
      $scope.contacts = response.data })
        .then(() => {
          if($scope.contacts.length > 0) {
            $http.get('http://localhost:18080/contacts/' + $scope.contacts[0].contactID)
            .then( response => {
              $scope.contactInfo = response.data;
            })
          }
          else {
            $scope.contactInfo = [];
          }
        })
        .then(() => {
          if($scope.contacts.length > 0) {
            $http.get('http://localhost:18080/contacts/' + $scope.contacts[0].contactID + '/phones')
            .then( response => {
              $scope.contactPhone = response.data;
            })
          }
          else {
            $scope.contactPhone = [];
          }
        })
        .then(() => {
          if($scope.contacts.length > 0) {
            $http.get('http://localhost:18080/contacts/' + $scope.contacts[0].contactID + '/addresses')
            .then( response => {
              $scope.contactAddress = response.data;
            })
          }
          else {
            $scope.contactAddress = [];
          }
        });

  // initial http request for phone-types
  $http.get('http://localhost:18080/phone-types')
    .then( response => {
      $scope.phoneTypes = response.data;
    })

  // initial http request for address-types
  $http.get('http://localhost:18080/address-types')
    .then( response => {
      $scope.addressTypes = response.data;
    })

  // scope variables
  $scope.title = "Address Book";
  $scope.newCard = "Add new contact";
  $scope.headings = [ "Given Name", "Surname" ];
  $scope.edit = false;

  // open and close edit view
  $scope.open = () => {
    $scope.edit = true;
  }

  $scope.close = () => {
    $scope.edit = false;

    var request = {
      method: 'PUT',
      url: 'http://localhost:18080/contacts/' + $scope.contactInfo.contactID,
      data: {
        givenName: $scope.contactInfo.givenName,
        surname: $scope.contactInfo.surname
      }
    };

    $http(request)
      .then( response => {
        for ( i of $scope.contacts ) {
          if (i.contactID === $scope.contactInfo.contactID) {
            i.givenName = $scope.contactInfo.givenName;
            i.surname = $scope.contactInfo.surname;
          }
        }
      });

    for ( i of $scope.contactPhone ) {
      var phoneRequest = {
        method: 'PUT',
        url: 'http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/phones/' + i.phoneID,
        data: {
          phoneType: i.phoneType,
          phoneNumber: i.phoneNumber
        }
      };

      $http(phoneRequest);
    }

    for ( i of $scope.contactAddress ) {
      var addressRequest = {
        method: 'PUT',
        url: 'http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/addresses/' + i.addressID,
        data: {
          addressType: i.addressType,
          street: i.street,
          city: i.city,
          state: i.state,
          postalCode: i.postalCode
        }
      };

      $http(addressRequest);
    }
  }

  // http request for depeting a contact
  $scope.deleteContact = (x) => {
    $scope.edit = false;

    let index = -2,
        i = 0;
    while ( i < $scope.contacts.length && index !== i - 1) {
      if ( $scope.contacts[i].contactID === $scope.contactInfo.contactID ) {
        index = i;
      }
      i++;
    }
    if(index === $scope.contacts.length - 1 && index !== 0)
      index--;

    $http.delete('http://localhost:18080/contacts/' + x)
    .then( response => { })
        .then(() => {
          $http.get('http://localhost:18080/contacts')
            .then( response => {
              $scope.contacts = response.data;
            })
            .then(() => {
              if($scope.contacts.length > 0) {
                $http.get('http://localhost:18080/contacts/' + $scope.contacts[index].contactID)
                .then( response => {
                  $scope.contactInfo = response.data;
                })
              }
              else {
                $scope.contactInfo = [];
              }
            })
            .then(() => {
              if($scope.contacts.length > 0) {
                $http.get('http://localhost:18080/contacts/' + $scope.contacts[index].contactID + '/phones')
                .then( response => {
                  $scope.contactPhone = response.data;
                })
              }
              else {
                $scope.contactPhone = [];
              }
            })
            .then(() => {
              if($scope.contacts.length > 0) {
                $http.get('http://localhost:18080/contacts/' + $scope.contacts[index].contactID + '/addresses')
                .then( response => {
                  $scope.contactAddress = response.data;
                })
              }
              else {
                $scope.contactAddress = [];
              }
            });
        });
  }

  // ...adding a contact
  $scope.addContact = () => {
    var request = {
      method: 'POST',
      url: 'http://localhost:18080/contacts',
      data: {
        givenName: '',
        surname: ''
      }
    };

    $http(request)
      .then (() => {
        $http.get('http://localhost:18080/contacts')
          .then( response => {
            $scope.contacts.push(response.data[response.data.length - 1]);
          })
          .then(() => {
            if($scope.contacts.length > 0) {
              $http.get('http://localhost:18080/contacts/' + $scope.contacts[$scope.contacts.length - 1].contactID)
              .then( response => {
                $scope.contactInfo = response.data;
              })
            }
            else {
              $scope.contactInfo = [];
            }
          })
          .then(() => {
            if($scope.contacts.length > 0) {
              $http.get('http://localhost:18080/contacts/' + $scope.contacts[$scope.contacts.length - 1].contactID + '/phones')
              .then( response => {
                $scope.contactPhone = response.data;
              })
            }
            else {
              $scope.contactPhone = [];
            }
          })
          .then(() => {
            if($scope.contacts.length > 0) {
              $http.get('http://localhost:18080/contacts/' + $scope.contacts[$scope.contacts.length - 1].contactID + '/addresses')
              .then( response => {
                $scope.contactAddress = response.data;
              })
            }
            else {
              $scope.contactAddress = [];
            }
          });
      });
    $scope.edit = true;
  }

  // ...getting a person
  $scope.getPerson = (id) => {
    $scope.close();
    
    $http.get('http://localhost:18080/contacts/' + id)
      .then( response => {
        $scope.contactInfo = response.data;
      });
    $http.get('http://localhost:18080/contacts/' + id + '/phones')
    .then( response => {
      $scope.contactPhone = response.data;
    });
    $http.get('http://localhost:18080/contacts/' + id + '/addresses')
    .then( response => {
      $scope.contactAddress = response.data;
    });
  }

  // ...adding a phone number
  $scope.addPhone = () => {
    var request = {
      method: 'POST',
      url: 'http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/phones',
      data: {
        phoneType: 'Home Phone',
        phoneNumber: ''
      }
    };

    $http(request)
      .then(() => {
        $http.get('http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/phones')
          .then( response => {
            $scope.contactPhone.push(response.data[response.data.length - 1]);
          });
      });
  }

  // ...adding an address
  $scope.addAddress = () => {
    var request = {
      method: 'POST',
      url: 'http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/addresses',
      data: {
        addressType: 'Home Address',
        street: '',
        city: '',
        state: '',
        postalCode: ''
      }
    };

    $http(request)
      .then(() => {
        $http.get('http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/addresses')
          .then( response => {
            $scope.contactAddress.push(response.data[response.data.length - 1]);
          });
      });
  }

  // ...deleting a phone number
  $scope.deletePhone = (x) => {
    $http.delete('http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/phones/' + x)
      .then( () => {
        $http.get('http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/phones')
          .then( response => {
            $scope.contactPhone = response.data;
          })
      });
  }

  // ...deleting an address
  $scope.deleteAddress = (x) => {
    $http.delete('http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/addresses/' + x)
      .then( () => {
        $http.get('http://localhost:18080/contacts/' + $scope.contactInfo.contactID + '/addresses')
          .then( response => {
            $scope.contactAddress = response.data;
          })
      });
  }

  // changes the phone type in the user entry
  $scope.changePhoneType = (phoneID, newPhoneType) => {
    for ( i of $scope.contactPhone ) {
      if( i.phoneID === phoneID ) {
        i.phoneType = newPhoneType;
      }
    }
  }

  // changes the address type in the user entry
  $scope.changeAddressType = (addressID, newAddressType) => {
    for ( i of $scope.contactAddress ) {
      if( i.addressID === addressID ) {
        i.addressType = newAddressType;
      }
    }
  }
});

//directives rendering
addressBook.directive('sidebar', () => {
  return {restrict: 'E', templateUrl: '../Components/sidebar.html'}
});

addressBook.directive('editor', () => {
  return {restrict: 'E', templateUrl: '../Components/editor.html'}
});

addressBook.directive('viewer', () => {
  return {restrict: 'E', templateUrl: '../Components/viewer.html'}
})

addressBook.directive('contactListItem', () => {
  return {
    restrict: 'E',
    scope: {
      firstName: '=',
      lastName: '=',
    },
    templateUrl: '../Components/contactListItem.html' 
  };
});

addressBook.directive('contactListNew', () => {
  return {
    restrict: 'E',
    template: '<i class="fa fa-plus" aria-hidden="true"></i><i>{{ newCard }}</i>'
  }
});

addressBook.directive('propertyField', () => {
  return {
    restrict: 'E',
    scope: {
      heading: '=',
      info: '=',
      moreInfo: '=',
    },
    templateUrl: '../Components/propertyField.html'
  }
});

addressBook.directive('propertyEdit', () => {
  return {
    restrict: 'E',
    scope: {
      heading: '=',
      info: '=',
      id: '=',
      editable: '@',
      delete: '&',
      change: '&',
      phone: '='
    },
    templateUrl: '../Components/propertyEdit.html'
  }
});

addressBook.directive('propertyEditAddr', () => {
  return {
    restrict: 'E',
    scope: {
      heading: '=',
      street: '=',
      city: '=',
      state: '=',
      zip: '=',
      id: '=',
      editable: '@',
      delete: '&',
      change: '&',
      address: '='
    },
    templateUrl: '../Components/propertyEditAddr.html'
  }
});

addressBook.directive('propertyFieldHeading', () => {
  return {
    restrict: 'E',
    template: '{{ heading }}'
  };
});

addressBook.directive('propertyHeadingPhone', () => {
  return {
    restrict: 'E',
    template: `<phone-list ng-click='droplist=!droplist' ng-show='droplist' class="attr-type-list expand-down"></phone-list>
              <i ng-click="delete({x: contactPhone.phoneID})" class="fa fa-minus" aria-hidden="true"></i> 
              <div class="inline-block open-list" ng-click="droplist=!droplist">
                <span>{{ heading }}</span>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
              </div>`
  }
});

addressBook.directive('propertyHeadingAddress', () => {
  return {
    restrict: 'E',
    template: `<address-list ng-click='droplist=!droplist' ng-show='droplist' class="attr-type-list expand-down"></address-list>
              <i ng-click="delete({x: contactAddress.addressID})" class="fa fa-minus" aria-hidden="true"></i> 
              <div class="inline-block open-list" ng-click="droplist=!droplist" >
                <span>{{ heading }}</span>
                <i ng-click="droplist=!droplist" class="fa fa-chevron-down" aria-hidden="true"></i>
              </div>`
  }
});

addressBook.directive('propertyFieldInfo', () => {
  return {
    restrict: 'E',
    template: '{{ info }}<br />{{ moreInfo }}'
  };
});

addressBook.directive('propertyEditInfo', () => {
  return {
    restrict: 'E',
    scope: {
      info: '='
    },
    template: '<input ng-model="info" ng-change="fun()"/>'
  }
});

addressBook.directive('propertyEditAddrBox', () => {
  return {
    restrict: 'E',
    scope: {
      info: '=',
      label: '@'
    },
    template: `
      <div class="inline-block small-margin">
        <input ng-model="info"><br />
        <label>{{ label }}</label>
      </div>
    `
  }
});

addressBook.directive('addPhone', () => {
  return {
    restrict: 'E',
    template: '<i class="fa fa-plus" aria-hidden="true"></i><i>Add new phone</i>'
  }
});

addressBook.directive('addAddress', () => {
  return {
    restrict: 'E',
    template: '<i class="fa fa-plus" aria-hidden="true"></i><i>Add new address</i>'
  }
});

addressBook.directive('phoneList', () => {
  return {
    restrict: 'E',
    templateUrl: '../Components/phoneList.html'
  }
});

addressBook.directive('addressList', () => {
  return {
    restrict: 'E',
    templateUrl: '../Components/addressList.html'
  }
});

addressBook.directive('deleteModal', () => {
  return {
    restrict: 'E',
    templateUrl: '../Components/deleteModal.html'
  }
})


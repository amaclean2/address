var http = require("http");

function parseJSONContent(req, res) {
    var text = req.body;
    try {
        return JSON.parse(text);

    } catch (err) {
        console.log("Failed to parse content as JSON: " + text);
        res.writeHead(400, {"Content-Type": "text/html"});
        res.end("<html><body>Failed to parse content as JSON</body></html>");
        return undefined;
    }
}
var dispatcher = (function() {
    var handlers = [];
    function findHandler(url, method) {
        method = method.toLowerCase();
        var urlMatches = false;
        var index = 0;
        var handler = null;
        for (index = 0; index < handlers.length; index++) {
            handler = handlers[index];
            if (handler.pattern instanceof RegExp && handler.pattern.test(url)) {
                urlMatches = true;
                if (handler.method === method) return handler;
            } else if (handler.pattern === url) {
                urlMatches = true;
                if (handler.method === method) return handler;
            }
        }
        if (urlMatches) return null;
        return undefined;
    }
    function addHandler(method, urlPattern, callback, hasData) {
        method = method.toLowerCase();
        var handler = {
            pattern: urlPattern,
            callback: callback,
            method: method,
            hasData: hasData
        };
        handlers.push(handler);
    }
    function fetchStatic(req, res) {
        var url = require("url").parse(req.url, true);
        var path = require("path");
        var pathName = (url.pathname === "/" ? "/index.html" : url.pathname);
        var fileName = "." + path.sep + path.join("webroot", pathName);
        var fs = require("fs");
        var mime = require("mime");
        var found = false;
        if (req.method.toLowerCase() === "get") {
            console.log("RETRIEVING: " + fileName);
            fs.readFile(fileName, function(err, file) {
                if (err) {
                    res.writeHead(404, {"Content-Type":"text/html"});
                    res.end("<html><body>Resource not found: " + req.url + "</body></html>");
                    return;
                }
                found = true;
                res.writeHead(200, {"Content-Type": mime.lookup(fileName)});
                res.write(file, "binary");
                res.end();
            });

        } else {
            res.writeHead(404, {"Content-Type":"text/html"});
            res.end("<html><body>Resource not found: " + req.url + "</body></html>");
        }
    }
    return {
        onGet: function(urlPattern, callback) {
            addHandler("get", urlPattern, callback, false);
        },
        onPost: function(urlPattern, callback) {
            addHandler("post", urlPattern, callback, true);
        },
        onPut: function(urlPattern, callback) {
            addHandler("put", urlPattern, callback, true);
        },
        onDelete: function(urlPattern, callback) {
            addHandler("delete", urlPattern, callback, false);
        },
        dispatch: function(req, res) {
            var handler = findHandler(req.url, req.method);
            if (handler === undefined) {
                fetchStatic(req, res);
                return;
            }
            if (handler === null) {
                res.writeHead(405, {"Content-Type":"text/html"});
                res.end("<html><body>Method " + req.method + " not allowed for "
                        + req.url + "</body></html>");
                return;
            }
            if (handler.hasData) {
                req.on("data", function(data) {
                    if (!req.body) {
                        req.body = data;
                    } else {
                        req.body += data;
                    }
                });
                req.on("end", function() {
                    handler.callback(req, res);
                });
            } else {
                handler.callback(req, res);
            }
        }

    };
})();
var nextID = 1001;

var phoneTypes = [
    "Home Phone",
    "Mobile Phone",
    "Work Phone",
    "Main Phone",
    "Other Phone"
];

var addressTypes = [
    "Home Address",
    "Mailing Address",
    "Work Address",
    "Other Address"
];

var data = [
    {
        "contactID": nextID++,
        "givenName": "John",
        "surname": "Doe",
        "phoneNumbers": [
            {
                "phoneID": nextID++,
                "phoneType": "Home Phone",
                "phoneNumber": "415-555-1212"
            },
            {
                "phoneID": nextID++,
                "phoneType": "Mobile Phone",
                "phoneNumber": "415-555-1313"
            }
        ],
        "addresses": [
            {
                "addressID": nextID++,
                "addressType": "Home Address",
                "street": "101 Main Street",
                "city": "Somewhere",
                "state": "CA",
                "postalCode": "90001"
            },
            {
                "addressID": nextID++,
                "addressType": "Work Address",
                "street": "101 First Street",
                "city": "Somewhere",
                "state": "CA",
                "postalCode": "90002"
            }
        ]
    },
    {
        "contactID": nextID++,
        "givenName": "Jane",
        "surname": "Smith",
        "phoneNumbers": [
            {
                "phoneID": nextID++,
                "phoneType": "Home Phone",
                "phoneNumber": "415-555-2222"
            },
            {
                "phoneID": nextID++,
                "phoneType": "Mobile Phone",
                "phoneNumber": "415-555-3333"
            }
        ],
        "addresses": [
            {
                "addressID": nextID++,
                "addressType": "Home Address",
                "street": "200 Mayberry Street",
                "city": "Nowhere",
                "state": "CA",
                "postalCode": "90003"
            },
            {
                "addressID": nextID++,
                "addressType": "Work Address",
                "street": "300 Mulberry Street",
                "city": "Nowhere",
                "state": "CA",
                "postalCode": "90004"
            }
        ]
    },
    {
        "contactID": nextID++,
        "givenName": "Joe",
        "surname": "Schmoe",
        "phoneNumbers": [
            {
                "phoneID": nextID++,
                "phoneType": "Mobile Phone",
                "phoneNumber": "415-555-4444"
            }
        ],
        "addresses": [
            {
                "addressID": nextID++,
                "addressType": "Home Address",
                "street": "500 Fifth Ave",
                "city": "Someplace",
                "state": "CA",
                "postalCode": "90005"
            }
        ]
    },
    {
        "contactID": nextID++,
        "givenName": "Jill",
        "surname": "Jones",
        "phoneNumbers": [
            {
                "phoneID": nextID++,
                "phoneType": "Mobile Phone",
                "phoneNumber": "415-555-1717"
            }
        ],
        "addresses": [
            {
                "addressID": nextID++,
                "addressType": "Home Address",
                "street": "300 Village Ave",
                "city": "Anywhere",
                "state": "CA",
                "postalCode": "90006"
            }
        ]
    },
    {
        "contactID": nextID++,
        "givenName": "Bill",
        "surname": "Rogers",
        "phoneNumbers": [
            {
                "phoneID": nextID++,
                "phoneType": "Mobile Phone",
                "phoneNumber": "415-555-8888"
            }
        ],
        "addresses": [
            {
                "addressID": nextID++,
                "addressType": "Home Address",
                "street": "200 Second Street",
                "city": "Anytown",
                "state": "CA",
                "postalCode": "90006"
            }
        ]
    }
];

const PORT=18080;

function handleRequest(request, response) {
    try {
        console.log(request.url);
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log("CAUGHT IT");
        console.log(err);
    }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log("Server listening on http://localhost:" + PORT);
});

function createPhone(inbound) {
    var newPhone = {};
    newPhone.phoneType = inbound["phoneType"];
    if (!newPhone.phoneType || phoneTypes.indexOf(newPhone.phoneType)<0) {
        return null;
    }
    newPhone.phoneID     = nextID++;
    newPhone.phoneNumber = inbound["phoneNumber"];
    return newPhone;
};

function updatePhone(existing, inbound) {
    if ("phoneType" in inbound) {
        if (!inbound.phoneType || phoneTypes.indexOf(inbound.phoneType)<0) {
            return null;
        }
        existing.phoneType   = inbound.phoneType;
    }
    if ("phoneNumber" in inbound) existing.phoneNumber = inbound.phoneNumber;
    return existing;
};

function createAddress(inbound) {
    var newAddr = {};
    newAddr.addressType = inbound["addressType"];
    if (!newAddr.addressType || addressTypes.indexOf(newAddr.addressType)<0) {
        return null;
    }
    newAddr.addressID    = nextID++;
    newAddr.street       = inbound["street"];
    newAddr.city         = inbound["city"];
    newAddr.state        = inbound["state"];
    newAddr.postalCode   = inbound["postalCode"];
    return newAddr;
};

function updateAddress(existing, inbound) {
    if ("addressType" in inbound) {
        if (!inbound.addressType || addressTypes.indexOf(inbound.addressType)<0) {
            return null;
        }
        existing.addressType   = inbound.addressType;
    }
    if ("street" in inbound) existing.street = inbound.street;
    if ("city" in inbound) existing.city = inbound.city;
    if ("state" in inbound) existing.state = inbound.state;
    if ("postalCode" in inbound) existing.postalCode = inbound.postalCode;
    return existing;
};


function createContact(inbound) {
    var newContact = {};
    var error = false;
    newContact.contactID    = nextID++;
    newContact.givenName    = inbound.givenName;
    newContact.surname      = inbound.surname;
    newContact.phoneNumbers = [];
    newContact.addresses    = [];
    return newContact;
};


function findContact(contactID) {
    var found = null;
    data.forEach(function(contact) {
        if (contact.contactID === contactID && found === null) {
            found = contact;
        }
    });
    return found;
}

function findPhone(phoneNumbers, phoneID) {
    var index = 0;
    for (index = 0; index < phoneNumbers.length; index++) {
        if (phoneNumbers[index].phoneID === phoneID) {
            return index;
        }
    }
    return -1;
}

function findAddress(addresses, addressID) {
    var index = 0;
    for (index = 0; index < addresses.length; index++) {
        if (addresses[index].addressID === addressID) {
            return index;
        }
    }
    return -1;
}

function truncateContact(contact) {
    return {
        contactID: contact.contactID,
        givenName: contact.givenName,
        surname:   contact.surname
    };
}

//dispatcher.setStatic("resources");

dispatcher.onGet("/contacts", function(req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    var result = [];
    data.forEach(function(contact) {
        result.push(truncateContact(contact));
    });
    res.end(JSON.stringify(result));
});

dispatcher.onPost("/contacts", function(req, res) {
    var inbound = parseJSONContent(req, res);
    if (inbound === undefined) return;
    var newContact = createContact(inbound);
    if (!newContact) {
        res.writeHead(400, {"Content-Type": "text/html"});
        res.end("<html><body>Bad Input</body></html>")
    } else {
        data.push(newContact);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(truncateContact(newContact)));
    }
});

const contactRegExp = /^\/contacts\/(\d+)$/;
dispatcher.onGet(contactRegExp, function(req, res) {
    console.log("GOT HERE!!!!");
    var contactID = parseInt(req.url.replace(contactRegExp,"$1"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("<html><body>Did not find contact: " + contactID
                + "</body></html>");
    } else {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(truncateContact(found)));
    }
});

dispatcher.onPut(contactRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(contactRegExp,"$1"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<html><body>Not Found: Contact " + contactID + "</body></html>");
        return;
    }
    var inbound = parseJSONContent(req,res);
    if (inbound === undefined) return;
    if ("givenName" in inbound) found.givenName = inbound.givenName;
    if ("surname" in inbound) found.surname = inbound.surname;
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(truncateContact(found)));
});

dispatcher.onDelete(contactRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(contactRegExp,"$1"));
    var index = 0, found = false;
    for (index = 0; index < data.length; index++) {
        if (data[index].contactID === contactID) {
            found = true;
            break;
        }
    }
    if (found) {
        data.splice(index, 1);
    }
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end("<html><body>Deleted Contact " + contactID + "</body></html>");
});

dispatcher.onGet("/phone-types", function(req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(phoneTypes));
});

const phonesRegExp = /^\/contacts\/(\d+)\/phones$/;
dispatcher.onGet(phonesRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(phonesRegExp,"$1"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("<html><body>Did not find contact: " + contactID
                + "</body></html>");
        return;
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(found.phoneNumbers ? found.phoneNumbers : []));
});

dispatcher.onPost(phonesRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(phonesRegExp,"$1"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("<html><body>Did not find contact: " + contactID
                + "</body></html>");
        return;
    }
    var inbound = parseJSONContent(req, res);
    if (inbound === undefined) return;
    var newPhone = createPhone(inbound);
    if (!newPhone) {
        res.writeHead(400, {"Content-Type": "text/html"});
        res.end("<html><body>Bad Input</body></html>");
        return;
    }
    found.phoneNumbers.push(newPhone);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(newPhone));
});

const phoneRegExp = /^\/contacts\/(\d+)\/phones\/(\d+)$/;
dispatcher.onGet(phoneRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(phoneRegExp,"$1"));
    var phoneID = parseInt(req.url.replace(phoneRegExp,"$2"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("<html><body>Did not find contact: " + contactID
                + "</body></html>");
        return;
    }
    var phoneIndex = findPhone(found.phoneNumbers, phoneID);
    if (phoneIndex < 0) {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("<html><body>Did not find phone " + phoneID
                + " for contact " + contactID + "</body></html>");
        return;
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(found.phoneNumbers[phoneIndex]));
});

dispatcher.onPut(phoneRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(phoneRegExp,"$1"));
    var phoneID = parseInt(req.url.replace(phoneRegExp,"$2"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<html><body>Not Found: Contact " + contactID + "</body></html>");
        return;
    }
    var phoneIndex = findPhone(found.phoneNumbers, phoneID);
    if (phoneIndex < 0) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<html><body>Not Found: Phone " + phoneID + " for Contact "
                + contactID + "</body></html>");
        return;
    }
    var inbound = parseJSONContent(req, res);
    if (inbound === undefined) return;
    var foundPhone = updatePhone(found.phoneNumbers[phoneIndex], inbound);
    if (!foundPhone) {
        res.writeHead(400, {"Content-Type": "text/html"});
        res.end("<html><body>Bad Input</body></html>");
        return;
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(foundPhone));
});

dispatcher.onDelete(phoneRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(phoneRegExp,"$1"));
    var phoneID = parseInt(req.url.replace(phoneRegExp,"$2"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<html><body>Not Found: Contact " + contactID + "</body></html>");
        return;
    }
    var phoneIndex = findPhone(found.phoneNumbers, phoneID);
    if (phoneIndex >= 0) {
        found.phoneNumbers.splice(phoneIndex, 1);
    }
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end("<html><body>Deleted Phone " + phoneID + " from Contact " + contactID
            + "</body></html>");
});

dispatcher.onGet("/address-types", function(req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(addressTypes));
});

const addressesRegExp = /^\/contacts\/(\d+)\/addresses$/;
dispatcher.onGet(addressesRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(addressesRegExp,"$1"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("<html><body>Did not find contact: " + contactID
                + "</body></html>");
        return;
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(found.addresses ? found.addresses : []));
});

dispatcher.onPost(addressesRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(addressesRegExp,"$1"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("<html><body>Did not find contact: " + contactID
                + "</body></html>");
        return;
    }
    var inbound = parseJSONContent(req, res);
    if (inbound === undefined) return;
    var newAddress = createAddress(inbound);
    if (!newAddress) {
        res.writeHead(400, {"Content-Type": "text/html"});
        res.end("<html><body>Bad Input</body></html>");
        return;
    }
    found.addresses.push(newAddress);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(newAddress));
});

const addressRegExp = /^\/contacts\/(\d+)\/addresses\/(\d+)$/;
dispatcher.onGet(addressRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(addressRegExp,"$1"));
    var addressID = parseInt(req.url.replace(addressRegExp,"$2"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("Did not find contact: " + contactID);
        return;
    }
    var addrIndex = findAddress(found.addresses, addressID);
    if (addrIndex < 0) {
        res.writeHead(404, {"Content-Type":"text/html"});
        res.end("<html><body>Did not find address " + addressID
                + " for contact " + contactID + "</body></html>");
        return;
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(found.addresses[addrIndex]));
});

dispatcher.onPut(addressRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(addressRegExp,"$1"));
    var addressID = parseInt(req.url.replace(addressRegExp,"$2"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<html><body>Not Found: Contact " + contactID + "</body></html>");
        return;
    }
    var addrIndex = findAddress(found.addresses, addressID);
    if (addrIndex < 0) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<html><body>Not Found: Address " + addressID + " for Contact "
                + contactID + "</body></html>");
        return;
    }
    var inbound = parseJSONContent(req, res);
    if (inbound === undefined) return;
    var foundAddr = updateAddress(found.addresses[addrIndex], inbound);
    if (!foundAddr) {
        res.writeHead(400, {"Content-Type": "text/html"});
        res.end("<html><body>Bad Input</body></html>");
        return;
    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(foundAddr));
});

dispatcher.onDelete(addressRegExp, function(req, res) {
    var contactID = parseInt(req.url.replace(addressRegExp,"$1"));
    var addressID = parseInt(req.url.replace(addressRegExp,"$2"));
    var found = findContact(contactID);
    if (!found) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<html><body>Not Found: Contact " + contactID + "</body></html>");
        return;
    }
    var addrIndex = findAddress(found.addresses, addressID);
    if (addrIndex >= 0) {
        found.addresses.splice(addrIndex, 1);
    }
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end("<html><body>Deleted Address " + addressID + " from Contact " + contactID
            + "</body></html>");
});

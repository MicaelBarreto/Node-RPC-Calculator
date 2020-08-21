(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("./models");
var JSONRPCClient = /** @class */ (function () {
    function JSONRPCClient(_send, createID) {
        this._send = _send;
        this.createID = createID;
        this.idToResolveMap = new Map();
        this.id = 0;
    }
    JSONRPCClient.prototype._createID = function () {
        if (this.createID) {
            return this.createID();
        }
        else {
            return ++this.id;
        }
    };
    JSONRPCClient.prototype.request = function (method, params, clientParams) {
        var request = {
            jsonrpc: models_1.JSONRPC,
            method: method,
            params: params,
            id: this._createID()
        };
        return this.requestAdvanced(request, clientParams).then(function (response) {
            if (response.result !== undefined && !response.error) {
                return response.result;
            }
            else if (response.result === undefined && response.error) {
                return Promise.reject(new Error(response.error.message));
            }
            else {
                return Promise.reject(new Error("An unexpected error occurred"));
            }
        });
    };
    JSONRPCClient.prototype.requestAdvanced = function (request, clientParams) {
        var _this = this;
        var promise = new Promise(function (resolve) {
            return _this.idToResolveMap.set(request.id, resolve);
        });
        return this.send(request, clientParams).then(function () { return promise; }, function (error) {
            _this.receive(models_1.createJSONRPCErrorResponse(request.id, 0, (error && error.message) || "Failed to send a request"));
            return promise;
        });
    };
    JSONRPCClient.prototype.notify = function (method, params, clientParams) {
        this.send({
            jsonrpc: models_1.JSONRPC,
            method: method,
            params: params
        }, clientParams).then(undefined, function () { return undefined; });
    };
    JSONRPCClient.prototype.send = function (payload, clientParams) {
        var promiseOrFunction = this._send(payload);
        if (typeof promiseOrFunction === "function") {
            promiseOrFunction = promiseOrFunction(clientParams);
        }
        return promiseOrFunction;
    };
    JSONRPCClient.prototype.rejectAllPendingRequests = function (message) {
        this.idToResolveMap.forEach(function (resolve, id) {
            return resolve(models_1.createJSONRPCErrorResponse(id, 0, message));
        });
        this.idToResolveMap.clear();
    };
    JSONRPCClient.prototype.receive = function (response) {
        var resolve = this.idToResolveMap.get(response.id);
        if (resolve) {
            this.idToResolveMap.delete(response.id);
            resolve(response);
        }
    };
    return JSONRPCClient;
}());
exports.JSONRPCClient = JSONRPCClient;

},{"./models":3}],2:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./client"));
__export(require("./models"));
__export(require("./server"));
__export(require("./server-and-client"));

},{"./client":1,"./models":3,"./server":5,"./server-and-client":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONRPC = "2.0";
exports.isJSONRPCRequest = function (payload) {
    return (payload.jsonrpc === exports.JSONRPC &&
        payload.method !== undefined &&
        payload.result === undefined &&
        payload.error === undefined);
};
exports.isJSONRPCResponse = function (payload) {
    return (payload.jsonrpc === exports.JSONRPC &&
        payload.id !== undefined &&
        (payload.result !== undefined || payload.error !== undefined));
};
exports.createJSONRPCErrorResponse = function (id, code, message) {
    return {
        jsonrpc: exports.JSONRPC,
        id: id,
        error: {
            code: code,
            message: message
        }
    };
};

},{}],4:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("./models");
var JSONRPCServerAndClient = /** @class */ (function () {
    function JSONRPCServerAndClient(server, client) {
        this.server = server;
        this.client = client;
    }
    JSONRPCServerAndClient.prototype.addMethod = function (name, method) {
        this.server.addMethod(name, method);
    };
    JSONRPCServerAndClient.prototype.request = function (method, params, clientParams) {
        return this.client.request(method, params, clientParams);
    };
    JSONRPCServerAndClient.prototype.notify = function (method, params, clientParams) {
        this.client.notify(method, params, clientParams);
    };
    JSONRPCServerAndClient.prototype.rejectAllPendingRequests = function (message) {
        this.client.rejectAllPendingRequests(message);
    };
    JSONRPCServerAndClient.prototype.receiveAndSend = function (payload, serverParams, clientParams) {
        return __awaiter(this, void 0, void 0, function () {
            var response, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!models_1.isJSONRPCResponse(payload)) return [3 /*break*/, 1];
                        this.client.receive(payload);
                        return [3 /*break*/, 4];
                    case 1:
                        if (!models_1.isJSONRPCRequest(payload)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.server.receive(payload, serverParams)];
                    case 2:
                        response = _a.sent();
                        if (response) {
                            return [2 /*return*/, this.client.send(response, clientParams)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        message = "Received an invalid JSON-RPC message";
                        console.warn(message, payload);
                        return [2 /*return*/, Promise.reject(new Error(message))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return JSONRPCServerAndClient;
}());
exports.JSONRPCServerAndClient = JSONRPCServerAndClient;

},{"./models":3}],5:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("./models");
var DefaultErrorCode = 0;
var createMethodNotFoundResponse = function (id) {
    return models_1.createJSONRPCErrorResponse(id, -32601 /* MethodNotFound */, "Method not found");
};
var JSONRPCServer = /** @class */ (function () {
    function JSONRPCServer() {
        this.nameToMethodDictionary = {};
    }
    JSONRPCServer.prototype.addMethod = function (name, method) {
        this.addMethodAdvanced(name, this.toJSONRPCMethod(method));
    };
    JSONRPCServer.prototype.toJSONRPCMethod = function (method) {
        return function (request) { return function (serverParams) {
            var response = method(request.params);
            if (typeof response === "function") {
                response = response(serverParams);
            }
            return Promise.resolve(response).then(function (result) { return mapResultToJSONRPCResponse(request.id, result); }, function (error) {
                console.warn("JSON-RPC method " + request.method + " responded an error", error);
                return mapErrorToJSONRPCResponse(request.id, error);
            });
        }; };
    };
    JSONRPCServer.prototype.addMethodAdvanced = function (name, method) {
        var _a;
        this.nameToMethodDictionary = __assign({}, this.nameToMethodDictionary, (_a = {}, _a[name] = method, _a));
    };
    JSONRPCServer.prototype.receive = function (request, serverParams) {
        var method = this.nameToMethodDictionary[request.method];
        if (!models_1.isJSONRPCRequest(request)) {
            var message = "Received an invalid JSON-RPC request";
            console.warn(message, request);
            return Promise.reject(new Error(message));
        }
        else if (method) {
            var response = this.callMethod(method, request, serverParams);
            return response.then(function (response) { return mapResponse(request, response); });
        }
        else if (request.id !== undefined) {
            return Promise.resolve(createMethodNotFoundResponse(request.id));
        }
        else {
            return Promise.resolve(null);
        }
    };
    JSONRPCServer.prototype.callMethod = function (method, request, serverParams) {
        var onError = function (error) {
            console.warn("An unexpected error occurred while executing \"" + request.method + "\" JSON-RPC method:", error);
            return Promise.resolve(mapErrorToJSONRPCResponse(request.id, error));
        };
        try {
            var response = method(request);
            if (typeof response === "function") {
                response = response(serverParams);
            }
            return response.then(undefined, onError);
        }
        catch (error) {
            return onError(error);
        }
    };
    return JSONRPCServer;
}());
exports.JSONRPCServer = JSONRPCServer;
var mapResultToJSONRPCResponse = function (id, result) {
    if (id !== undefined) {
        return {
            jsonrpc: models_1.JSONRPC,
            id: id,
            result: result === undefined ? null : result
        };
    }
    else {
        return null;
    }
};
var mapErrorToJSONRPCResponse = function (id, error) {
    if (id !== undefined) {
        return models_1.createJSONRPCErrorResponse(id, DefaultErrorCode, (error && error.message) || "An unexpected error occurred");
    }
    else {
        return null;
    }
};
var mapResponse = function (request, response) {
    if (response) {
        return response;
    }
    else if (request.id !== undefined) {
        return models_1.createJSONRPCErrorResponse(request.id, -32603 /* InternalError */, "Internal error");
    }
    else {
        return null;
    }
};

},{"./models":3}],6:[function(require,module,exports){
(function (global){
const { JSONRPCClient } = require("json-rpc-2.0");
global.window.JSONRPCClient = JSONRPCClient;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"json-rpc-2.0":2}]},{},[6]);

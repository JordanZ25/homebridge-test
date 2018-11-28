var Service, Characteristic;
const axios = require('axios');


module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-mclimate-smartplug", "MClimate-SmartPlug", SmartPlugAccessory);
}

function SmartPlugAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.plugName = config["plug_name"] || this.name; // fallback to "name" if you didn't specify an exact "bulb_name"
  this.binaryState = 0; // bulb state, default is OFF
  this.log("Starting a smart plug device with name '" + this.plugName + "'...");
}

SmartPlugAccessory.prototype.getPowerOn = function(callback) {
  var powerOn = this.binaryState > 0;
  this.log("Power state for the '%s' is %s", this.plugName, this.binaryState);
  callback(null, powerOn);



  
}

SmartPlugAccessory.prototype.setPowerOn = function(powerOn, callback,config) {
  this.binaryState = powerOn ? 'on' : 'off'; 
  callback(null);



     axios({

        method: 'post',
        url: 'https://developer-api.seemelissa.com/v1/provider/send',
        data:{
            serial_number: config['serial_number'],
            command: "switch_on_off",
            state: this.binaryState
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config['access_token']
        }

    }).then(function(response) {
      
      this.log("Set power state on the '%s' to %s", this.plugName, this.binaryState);

    })
}

SmartPlugAccessory.prototype.getServices = function() {
    var smartPlugService = new Service.Outlet(this.name);
    
    smartPlugService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerOn.bind(this))
      .on('set', this.setPowerOn.bind(this));
    
    return [smartPlugService];
}

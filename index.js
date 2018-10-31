const Service, Characteristic;
 
module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("switch-plugin", "MyAwesomeSwitch", mySwitch);
};

mySwitch.prototype = {
  getServices: function () {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "My switch manufacturer")
      .setCharacteristic(Characteristic.Model, "My switch model")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789");
 
    let switchService = new Service.Switch("My switch");
    switchService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getSwitchOnCharacteristic.bind(this))
        .on('set', this.setSwitchOnCharacteristic.bind(this));
 
    this.informationService = informationService;
    this.switchService = switchService;
    return [informationService, switchService];
  }
};
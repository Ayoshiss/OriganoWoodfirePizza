import NetInfo from '@react-native-community/netinfo';
class NetworkManagerClass {
  constructor() {
    this.IsInternetAvailable = true; // internet avail bool
    this.ConnectionType = undefined; // Wifi or mobile data
    this._listeners = []; // register for callbacks
    this.Initialize();
  }
  Initialize() {
    NetInfo.addEventListener((connectionInfo) => {
      this.ConnectionChanged(connectionInfo);
    });
    this.CheckAndUpdateConnection();
  }
  async CheckAndUpdateConnection() {
    let connectionInfo = await NetInfo.fetch();
    this.IsInternetAvailable = connectionInfo.isInternetReachable;
    this.ConnectionType = connectionInfo.type;
    return this.IsInternetAvailable;
  }
  RegisterConnectionChangeCallback(event) {
    this._listeners.push(event);
  }
  ConnectionChanged(connectionInfo) {
    this.IsInternetAvailable = connectionInfo.isInternetReachable;
    this.ConnectionType = connectionInfo.type;
    for (var i = 0; i < this._listeners.length; i++) {
      this._listeners[i](this.IsInternetAvailable, this.ConnectionType);
    }
  }
}
const NetworkManager = new NetworkManagerClass();
export default NetworkManager;

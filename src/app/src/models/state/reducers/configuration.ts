import {AnyAction, Reducer} from "redux";
import {ConfigurationActions} from "../actions/configuration";

export interface IChargeSettings {
    wantedChargeRateInC: number,
    capacity: number,
    numPacks: number,
    chemistryFilter: string,
    chargeMethod: string

    // Synthetics
    channelLimitReached: boolean;
    ampsForWantedChargeRate: number;
    safeAmpsForWantedChargeRate: number;
}

export const INetworkKeyNames = {
    "ap_name": "AP Name",
    "ap_channel": "AP Channel",

    "wifi_ssid": "SSID",
    "wifi_password": "Password",

    "docker_last_deploy": "Server Version"
};

export interface INetwork {
    ap_associated: boolean, // synthetic, ip from wlan0, and channel + name
    ap_channel: number,
    ap_name: string,

    wifi_ssid: string,
    wifi_password: string,

    docker_last_deploy: number,
    web_running: boolean,
    worker_running: boolean,

    interfaces: Map<string, string>,
    services: Map<string, boolean>
    discoveredServers: string[],
}

export interface IConfig {
    ipAddress: string,
    port: number,
    isnew: boolean,
    cellLimit: number,
    preventChargerVerticalScrolling: boolean,
    mockCharger: boolean,
    vibrateWhenDone: boolean,
    notificationWhenDone: boolean,

    // Used to understand what our IP address is. either 192.168.10.1 or self.ipAddress.
    connectedToPrivateWLAN: boolean,

    // 0 = 192.168.10.1,   1 = ipAddress
    lastConnectionIndex: number,

    charge_settings: IChargeSettings;
    network: INetwork;
}

const chargerDefaults: IChargeSettings = {
    wantedChargeRateInC: 1,
    capacity: 2000,
    numPacks: 4,
    chemistryFilter: "All",
    chargeMethod: "presets",

    // Synthetics
    channelLimitReached: false,
    ampsForWantedChargeRate: 0,
    safeAmpsForWantedChargeRate: 0
};

let defaultNetworkState: INetwork = {
    ap_associated: false,
    ap_channel: 0,
    ap_name: "",

    wifi_ssid: "",
    wifi_password: "",

    docker_last_deploy: 0,
    web_running: false,
    worker_running: false,

    discoveredServers: [],
    interfaces: new Map<string, string>(),
    services: new Map<string, boolean>()
};

export const configurationDefaults: IConfig = {
    ipAddress: "192.168.10.1",
    port: 5000,
    isnew: true,
    cellLimit: -1,
    preventChargerVerticalScrolling: true,
    mockCharger: false,
    vibrateWhenDone: false,
    notificationWhenDone: false,

    connectedToPrivateWLAN: false,
    lastConnectionIndex: 0,

    charge_settings: chargerDefaults,
    network: defaultNetworkState
};


export const
    configReducer: Reducer<IConfig> = (state: IConfig = configurationDefaults, action: AnyAction): IConfig => {
        switch (action.type) {
            case ConfigurationActions.SET_FULL_CONFIG:
                if (action.payload) {
                    return action.payload;
                } else {
                    return state;
                }

            case ConfigurationActions.RESET_TO_DEFAULTS:
                return configurationDefaults;


            case ConfigurationActions.UPDATE_CHARGE_CONFIG_KEYVALUE:
                if (action.payload) {
                    let maxAmpsPerChannel = action.maxAmpsPerChannel;
                    let new_charge_settings: IChargeSettings = {
                        ...state.charge_settings,
                        ...action.payload
                    };

                    new_charge_settings.ampsForWantedChargeRate = new_charge_settings.numPacks * (new_charge_settings.capacity / 1000) * new_charge_settings.wantedChargeRateInC;
                    new_charge_settings.safeAmpsForWantedChargeRate = Math.min(new_charge_settings.ampsForWantedChargeRate, maxAmpsPerChannel);
                    new_charge_settings.channelLimitReached = new_charge_settings.ampsForWantedChargeRate > maxAmpsPerChannel;

                    return {
                        ...state,
                        ...{charge_settings: new_charge_settings}
                    }
                }
                return state;

            case ConfigurationActions.UPDATE_CONFIG_KEYVALUE:
                if (action.payload) {
                    return {
                        ...state,
                        ...action.payload
                    }
                }
                return state;
        }

        return state;
    };
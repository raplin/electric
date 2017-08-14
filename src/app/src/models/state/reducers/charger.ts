import {AnyAction, Reducer} from "redux";
import {ChargerActions} from "../actions/charger";
import {Channel} from "../../channel";

export interface IChargerState {
    charger_presence: string;
    cell_count: number;
    channel_count: number;
    device_id: number;
    device_sn: string;
    memory_len: number;
    software_ver: number;
    connected: boolean;
    channels: Array<Channel>;

    // Synthetic state, summed from the channels
    total_output_amps: number;
    total_capacity: number;
    input_volts: number;
    charger_temp: number;
}

let defaultStatus: IChargerState = {
    charger_presence: "unknown",
    cell_count: 8,
    channel_count: 2,
    device_id: 0,
    device_sn: "",
    memory_len: 0,
    software_ver: 0,
    connected: false,
    channels: [],

    total_output_amps: 0,
    total_capacity: 0,
    input_volts: 0,
    charger_temp: 0
};

export const
    chargerStateReducer: Reducer<IChargerState> = (state: IChargerState, action: AnyAction): IChargerState => {
        if (state == null) {
            return defaultStatus;
        }
        switch (action.type) {
            case ChargerActions.UPDATE_STATE_FROM_CHARGER:
                let unifiedStatus = action.payload;

                let newState: IChargerState = {
                    ...state,
                    ...unifiedStatus['status']
                };

                // Synthetic. Could do more here, like "sum" the channel state :)
                newState.connected = unifiedStatus.charger_presence === 'connected';
                if (!newState.connected) {
                    newState.channel_count = 0;
                }

                newState.total_output_amps = 0;
                newState.total_capacity = 0;
                newState.input_volts = 0;
                newState.charger_temp = 0;

                let channels = [];
                if ('channels' in unifiedStatus) {
                    unifiedStatus.channels.map((json, index) => {
                        let ch = new Channel(index, json, action.cellLimit);
                        channels.push(ch);

                        newState.total_output_amps += ch.output_amps;
                        newState.total_capacity += ch.output_capacity;

                        // Copy the volts + temp
                        if(index == 0) {
                            newState.input_volts = ch.input_volts;
                            newState.charger_temp = ch.charger_internal_temp;
                        }
                    });
                }
                newState.channels = channels;
                return newState;
        }
        return state;
    };
import {EventEmitter} from "expo-modules-core";

type NotificationEvents = {
    message: ({})=>void,
    friendRequest: ({})=>void
};
const eventEmitter = new EventEmitter<NotificationEvents>();

export default eventEmitter

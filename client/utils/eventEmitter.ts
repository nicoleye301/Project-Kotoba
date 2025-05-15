import { EventEmitter } from "expo-modules-core";

type NotificationEvents = {
    message: (data: string) => void,
    friendRequest: (data: any) => void,
    friendListUpdated: () => void;
    capsuleUnlockedExternally: (payload: any) => void;
};

const eventEmitter = new EventEmitter<NotificationEvents>();

export default eventEmitter;

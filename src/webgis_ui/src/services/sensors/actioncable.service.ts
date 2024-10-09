import { Injectable } from '@angular/core';
import * as ActionCable from '@rails/actioncable';
import { environment } from '../../environments/environment.dev';


@Injectable({
    providedIn: 'root'  // This makes the service available globally
})
export class ActionCableService {
    private cable: any;
    private subscriptions: any = {};
    constructor() {
        this.cable = ActionCable.createConsumer(`${environment.cable}`);
    }

    public subscribeToChannel(channelName: string, params: any, receivedCallback: (data: any) => void): void {
        if (!this.subscriptions[channelName]) {
            this.subscriptions[channelName] = this.cable.subscriptions.create({ channel: channelName, ...params }, {
                received: (data: any) => receivedCallback(data),
                connected: () => console.log(`Connected to ${channelName} channel`),
                disconnected: () => console.log(`Disconnected from ${channelName} channel`)
            });
        }
    }

    public unsubscribeFromChannel(channelName: string): void {
        if (this.subscriptions[channelName]) {
            this.cable.subscriptions.remove(this.subscriptions[channelName]);
            delete this.subscriptions[channelName];
            console.log(`Unsubscribed from ${channelName} channel`);
        }
    }
}
import { Injectable } from '@angular/core';
import * as ActionCable from '@rails/actioncable';
import { environment } from '../../environments/environment';
import { ToastService } from '../toast/toast.service';

@Injectable({
    providedIn: 'root'  // This makes the service available globally
})
export class SensorDataLiveService {
    private cable: any;
    private subscriptions: any = {};
    private retryTimeout: any;

    constructor(private toastService: ToastService) {
        this.cable = ActionCable.createConsumer(`${environment.cable}`);
    }

    public subscribeToChannel(channelName: string, params: any, receivedCallback: (data: any) => void): void {
        if (!this.subscriptions[channelName]) {            
            this.createSubscription(channelName, params, receivedCallback);
        }
    }

    private createSubscription(channelName: string, params: any, receivedCallback: (data: any) => void): void {
        this.subscriptions[channelName] = this.cable.subscriptions.create({ channel: channelName, ...params }, {
            received: (data: any) => receivedCallback(data),
            connected: () => {
                console.log(`Connected to ${channelName} channel`);
                if (this.retryTimeout) {
                    clearTimeout(this.retryTimeout);  // Clear any retry timer if connected successfully
                }
            },
            disconnected: () => {
                console.log(`Disconnected from ${channelName} channel`);
                this.toastService.show(`Disconnected from ${channelName} channel`, {
                    classname: 'bg-danger text-light',
                    delay: environment.reconnectTimeout*1000
                });
                this.retrySubscription(channelName, params, receivedCallback);  // Attempt to reconnect
            },
            rejected: () => {
                console.log(`Connection to ${channelName} channel rejected`);
                this.toastService.show('Error connecting to the channel', {
                    classname: 'bg-danger text-light',
                    delay: environment.reconnectTimeout*1000
                });
                this.retrySubscription(channelName, params, receivedCallback);  // Attempt to reconnect
            }
        });
    }

    private retrySubscription(channelName: string, params: any, receivedCallback: (data: any) => void): void {
        console.log(`Retrying connection to ${channelName} channel in 10 seconds...`);
        this.retryTimeout = setTimeout(() => {
            this.unsubscribeFromChannel(channelName);  // Clear any existing subscription before retrying
            this.createSubscription(channelName, params, receivedCallback);  // Try to reconnect
        }, 10*1000);  // Retry after 10 seconds
    }

    public unsubscribeFromChannel(channelName: string): void {
        if (this.subscriptions[channelName]) {
            this.cable.subscriptions.remove(this.subscriptions[channelName]);
            delete this.subscriptions[channelName];
            console.log(`Unsubscribed from ${channelName} channel`);
        }
    }
}

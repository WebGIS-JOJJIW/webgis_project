import { Injectable } from '@angular/core';
import * as ActionCable from '@rails/actioncable';
import { environment } from '../../environments/environment';
import { ToastService } from '../toast/toast.service';
import { SharedService } from '../../app/_shared/services/shared.service';

@Injectable({
    providedIn: 'root'  
})
export class SensorDataLiveService {
    private cable: any;
    private subscriptions: any = {};
    private subscriptionSettings: any = {};
    private retryTimeout: any;

    constructor(private toastService: ToastService, private sharedService: SharedService) {
        this.cable = ActionCable.createConsumer(`${environment.cable}`);
    }

    public subscribeToChannel(channelName: string, params: any, receivedCallback: (data: any) => void): void {
        if (!this.subscriptions[channelName]) {
            this.subscriptionSettings[channelName] = {
                receivedCallback: receivedCallback,
                params: params
            }
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
                    this.sharedService.setIsReconnect(true);
                    this.toastService.show('Connecting to the channel successfully', {
                        classname: 'bg-success text-light',
                        delay: environment.reconnectTimeout * 1000
                    });
                }
            },
            disconnected: () => {
                console.log(`Disconnected from ${channelName} channel`);
                this.toastService.show(`Disconnected from ${channelName} channel`, {
                    classname: 'bg-danger text-light',
                    delay: environment.reconnectTimeout * 1000
                });
                this.retrySubscription(channelName, params, receivedCallback);  // Attempt to reconnect
            },
            rejected: () => {
                console.log(`Connection to ${channelName} channel rejected`);
                this.toastService.show('Connection to the channel rejected', {
                    classname: 'bg-danger text-light',
                    delay: environment.reconnectTimeout * 1000
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
        }, 10 * 1000);  // Retry after 10 seconds
    }

    public unsubscribeFromChannel(channelName: string): void {
        if (this.subscriptions[channelName]) {
            this.cable.subscriptions.remove(this.subscriptions[channelName]);
            delete this.subscriptions[channelName];
            console.log(`Unsubscribed from ${channelName} channel`);
        }
    }


    //for testing purposes
    public testConnectionFail(channelName: string): void {
        if (this.subscriptions[channelName]) {
            console.log(`Simulating connection failure for ${channelName}...`);
            this.subscriptions[channelName].rejected();
        } else {
            console.log(`No subscription found for ${channelName} to simulate failure.`);
        }
    }

    public testDisconnect(channelName: string): void {
        if (this.subscriptions[channelName]) {
            console.log(`Simulating disconnection for ${channelName}...`);
            this.subscriptions[channelName].disconnected();
        } else {
            console.log(`No subscription found for ${channelName} to simulate disconnection.`);
        }
    }

    public testUnsubscribe(channelName: string): void {
        this.unsubscribeFromChannel(channelName);
    }

    public testSubscribe(channelName: string): void {
        const params = this.subscriptionSettings['params'];
        const receivedCallback = this.subscriptionSettings['receivedCallback'];
        this.createSubscription(channelName, params, receivedCallback);
    }
}

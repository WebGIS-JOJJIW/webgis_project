import { Injectable } from '@angular/core';
import * as ActionCable from '@rails/actioncable';
import { environment } from '../../environments/environment.dev';
import { ToastService } from '../toast/toast.service';


@Injectable({
    providedIn: 'root'  // This makes the service available globally
})
export class ActionCableService {
    private cable: any;
    private subscriptions: any = {};
    constructor(private toastService: ToastService) {
        this.cable = ActionCable.createConsumer(`${environment.cable}`);
    }

    public subscribeToChannel(channelName: string, params: any, receivedCallback: (data: any) => void): void {
        if (!this.subscriptions[channelName]) {
            this.subscriptions[channelName] = this.cable.subscriptions.create({ channel: channelName, ...params }, {
                received: (data: any) => receivedCallback(data),
                connected: () => console.log(`Connected to ${channelName} channel`),
                disconnected: () => {
                    console.log(`Disconnected from ${channelName} channel`) 
                    this.toastService.show(`Disconnected from ${channelName} channel`, {
                        classname: 'bg-danger text-light',
                        delay: 2000
                    });
                },
                rejected: () => {
                    // Handle the error and show the toast
                    console.log(`Connection to ${channelName} channel rejected`);
                    this.toastService.show('Error connecting to the channel', {
                        classname: 'bg-danger text-light',
                        delay: 2000
                    });
                }
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
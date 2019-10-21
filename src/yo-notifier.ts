/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import { Constants, Notifier, Outlet } from 'gateway-addon';

import fetch from 'node-fetch'

class YoOutlet extends Outlet {
    constructor(notifier: Notifier, private manifest: any) {
        super(notifier, YoOutlet.name);
        this.name = 'Yo';
    }

    async notify(_title: string, message: string, _level: Constants.NotificationLevel) {
        const {
            apiToken
        } = this.manifest.moziot.config;

        const user = await fetch(`http://api.justyo.co/me/\?api_token=${apiToken}`);

        const {
            username
        } = await user.json();

        console.log(`Sending yo to ${username}`);

        const response = await fetch('https://api.justyo.co/yo/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `api_token=${apiToken}&username=${username}&text=${encodeURIComponent(message)}`
        });

        if (response.status != 200) {
            console.log(`Could not notify user: ${response.statusText} (${response.status})`);
        }
    }
}

export class YoNotifier extends Notifier {
    constructor(addonManager: any, manifest: any) {
        super(addonManager, YoNotifier.name, manifest.name);

        addonManager.addNotifier(this);

        this.handleOutletAdded(
            new YoOutlet(this, manifest)
        );
    }
}

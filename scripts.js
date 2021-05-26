// Set up SW
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('/sw.js').then(
			function (registration) {
				// Registration was successful
				console.log(
					'ServiceWorker registration successful with scope: ',
					registration.scope,
				);
			},
			function (err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			},
		);
	});
}

// Set up WebOTP
const form = document.querySelector('form');
const input = form.querySelector('input[autocomplete="one-time-code"]');
if ('OTPCredential' in window) {
	window.addEventListener('DOMContentLoaded', e => {
		const ac = new AbortController();
        form.addEventListener('submit', e => {
            ac.abort();
            console.log('submitting form');
        });
		navigator.credentials
			.get({
				otp: { transport: ['sms'] },
				signal: ac.signal,
			})
			.then(otp => {
				input.value = otp.code;
				if (form) form.submit();
			})
			.catch(err => {
				console.log(err);
			});
	});
}
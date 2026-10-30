import {ComponentChildren, FunctionalComponent} from 'preact';

import {useInstallState} from '../lib/install.js';
import {useNotificationStatus} from '../lib/notifications.js';
import {AlertIcon, BellIcon, CheckIcon, ExternalLinkIcon} from './Icons.js';

const StatusRow: FunctionalComponent<{
	action?: ComponentChildren;
	description: string;
	ok: boolean;
	title: string;
}> = ({action, description, ok, title}) => (
	<li class="status-row">
		<span class={`status-icon ${ok ? 'ok' : 'warn'}`}>
			{ok ? <CheckIcon size={16} /> : <AlertIcon size={16} />}
		</span>
		<div class="status-text-group">
			<p class="status-title">{title}</p>
			<p class="meta">{description}</p>
		</div>
		{action}
	</li>
);

export const About: FunctionalComponent = () => {
	const notifications = useNotificationStatus();
	const {canInstall, install, isInstalled} = useInstallState();

	return (
		<div class="page-body about">
			<div class="hero">
				<span class="brand-mark large">
					<BellIcon size={28} />
				</span>
				<h1>Follow a playlist, not a whole channel.</h1>
				<p>
					YouTube doesn’t support playlist subscriptions. This app does: get a
					browser notification when a playlist you follow gets a new video. You
					can follow a channel’s uploads, too.
				</p>
			</div>

			<section aria-labelledby="about-device">
				<h2 class="section-label" id="about-device">
					This device
				</h2>
				<ul class="card status-list">
					{notifications.status === 'granted' ? (
						<StatusRow
							description="You’ll be alerted about new videos"
							ok={true}
							title="Notifications allowed"
						/>
					) : (
						<StatusRow
							action={
								notifications.status === 'default' && (
									<button
										class="pill-button primary"
										onClick={() => void notifications.request()}
										type="button"
									>
										Allow
									</button>
								)
							}
							description={
								notifications.status === 'denied'
									? 'Blocked in your browser settings'
									: notifications.status === 'unsupported'
										? 'Not supported in this browser'
										: 'New videos will only show up in the app'
							}
							ok={false}
							title="Notifications off"
						/>
					)}
					{isInstalled ? (
						<StatusRow
							description="Checks for new videos in the background, where supported"
							ok={true}
							title="Installed"
						/>
					) : (
						<StatusRow
							action={
								canInstall && (
									<button
										class="pill-button primary"
										onClick={() => void install()}
										type="button"
									>
										Install
									</button>
								)
							}
							description="Install to check daily in the background"
							ok={false}
							title="Not installed"
						/>
					)}
					<StatusRow
						description="No account or sign-in needed"
						ok={true}
						title="Stored only on this device"
					/>
				</ul>
			</section>

			<section aria-labelledby="about-when">
				<h2 class="section-label" id="about-when">
					When will I see updates?
				</h2>
				<p>
					Every time you open the app. If you’ve installed it in a browser that
					supports{' '}
					<a href="https://web.dev/periodic-background-sync/">
						periodic background sync
					</a>
					, it also checks about once a day on its own.
				</p>
			</section>

			<a
				class="card link-card"
				href="https://github.com/jeffposnick/yt-playlist-notifier"
			>
				Source code &amp; credits on GitHub
				<ExternalLinkIcon size={18} />
			</a>
		</div>
	);
};

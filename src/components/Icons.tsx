import {ComponentChildren, FunctionalComponent} from 'preact';

// Inline stroke icons that inherit `currentColor`, so they follow the text
// color in both light and dark mode without needing a filter.
const Icon: FunctionalComponent<{
	children: ComponentChildren;
	size?: number;
	strokeWidth?: number;
}> = ({children, size = 22, strokeWidth = 2}) => (
	<svg
		aria-hidden="true"
		fill="none"
		height={size}
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={strokeWidth}
		viewBox="0 0 24 24"
		width={size}
	>
		{children}
	</svg>
);

type IconProps = {size?: number};

export const BellIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
		<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
	</Icon>
);

export const BellOffIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
		<path d="M3 3l18 18" />
	</Icon>
);

export const VideoIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<rect height="14" rx="3" width="20" x="2" y="5" />
		<path d="M10 9l5 3-5 3z" />
	</Icon>
);

export const SearchIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<circle cx="11" cy="11" r="7" />
		<path d="M20 20l-3.5-3.5" />
	</Icon>
);

export const PlaylistIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<path d="M3 6h13M3 12h13M3 18h9" />
		<path d="M18 15l4 3-4 3z" />
	</Icon>
);

export const InfoIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<circle cx="12" cy="12" r="9" />
		<path d="M12 11v5M12 8h.01" />
	</Icon>
);

export const RefreshIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
		<path d="M21 3v5h-5" />
	</Icon>
);

export const CloseIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<path d="M6 6l12 12M18 6L6 18" />
	</Icon>
);

export const CheckIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<path d="M5 12l5 5 9-10" />
	</Icon>
);

export const AlertIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<path d="M12 7v6M12 17h.01" />
	</Icon>
);

export const PlusIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<path d="M12 5v14M5 12h14" />
	</Icon>
);

export const ExternalLinkIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<path d="M7 17L17 7M9 7h8v8" />
	</Icon>
);

export const ChannelIcon: FunctionalComponent<IconProps> = ({size}) => (
	<Icon size={size}>
		<circle cx="12" cy="8" r="4" />
		<path d="M4 21a8 8 0 0 1 16 0" />
	</Icon>
);

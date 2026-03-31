import {
	IconLink,
	IconBrandYoutube,
	IconBrandSpotify,
	IconBrandFacebook,
	IconBrandInstagram,
	IconBrandX,
	IconBrandLinkedin,
	IconBrandTiktok,
	IconBrandGithub,
	IconBrandTwitch,
	IconBrandDiscord,
	IconBrandWhatsapp,
	IconBrandTelegram,
	IconBrandZoom,
	IconBrandVimeo,
	IconBrandSoundcloud,
	IconBrandBandcamp,
	IconBrandPatreon,
	IconBrandThreads,
	IconBrandBluesky,
	IconBrandPinterest,
	IconBrandSnapchat,
	IconBrandMedium,
	IconBrandMeetup,
	IconBrandLinktree,
	IconBrandPaypal,
	IconBrandGoogleMaps,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

export type ServiceDef = {
	id: string;
	labelKey: string;
	Icon: ComponentType<{ className?: string }>;
};

export const LINK_SERVICES: ServiceDef[] = [
	{ id: "none", labelKey: "none", Icon: IconLink },
	// Platformy wydarzeń
	{ id: "meetup", labelKey: "meetup", Icon: IconBrandMeetup },
	{ id: "zoom", labelKey: "zoom", Icon: IconBrandZoom },
	// Wideo
	{ id: "youtube", labelKey: "youtube", Icon: IconBrandYoutube },
	{ id: "vimeo", labelKey: "vimeo", Icon: IconBrandVimeo },
	// Muzyka
	{ id: "spotify", labelKey: "spotify", Icon: IconBrandSpotify },
	{ id: "soundcloud", labelKey: "soundcloud", Icon: IconBrandSoundcloud },
	{ id: "bandcamp", labelKey: "bandcamp", Icon: IconBrandBandcamp },
	// Social media
	{ id: "facebook", labelKey: "facebook", Icon: IconBrandFacebook },
	{ id: "instagram", labelKey: "instagram", Icon: IconBrandInstagram },
	{ id: "threads", labelKey: "threads", Icon: IconBrandThreads },
	{ id: "x", labelKey: "x", Icon: IconBrandX },
	{ id: "bluesky", labelKey: "bluesky", Icon: IconBrandBluesky },
	{ id: "tiktok", labelKey: "tiktok", Icon: IconBrandTiktok },
	{ id: "snapchat", labelKey: "snapchat", Icon: IconBrandSnapchat },
	{ id: "pinterest", labelKey: "pinterest", Icon: IconBrandPinterest },
	{ id: "linkedin", labelKey: "linkedin", Icon: IconBrandLinkedin },
	// Komunikatory
	{ id: "whatsapp", labelKey: "whatsapp", Icon: IconBrandWhatsapp },
	{ id: "telegram", labelKey: "telegram", Icon: IconBrandTelegram },
	{ id: "discord", labelKey: "discord", Icon: IconBrandDiscord },
	// Wsparcie / monetyzacja
	{ id: "patreon", labelKey: "patreon", Icon: IconBrandPatreon },
	{ id: "paypal", labelKey: "paypal", Icon: IconBrandPaypal },
	// Inne
	{ id: "medium", labelKey: "medium", Icon: IconBrandMedium },
	{ id: "linktree", labelKey: "linktree", Icon: IconBrandLinktree },
	{ id: "googlemaps", labelKey: "googlemaps", Icon: IconBrandGoogleMaps },
	{ id: "github", labelKey: "github", Icon: IconBrandGithub },
	{ id: "twitch", labelKey: "twitch", Icon: IconBrandTwitch },
];

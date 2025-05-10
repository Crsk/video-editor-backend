PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_video` (
	`id` text PRIMARY KEY NOT NULL,
	`transcript` text,
	`audio_urls` text,
	`video_url` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_video`("id", "transcript", "audio_urls", "video_url", "created_at", "updated_at") SELECT "id", "transcript", "audio_urls", "video_url", "created_at", "updated_at" FROM `video`;--> statement-breakpoint
DROP TABLE `video`;--> statement-breakpoint
ALTER TABLE `__new_video` RENAME TO `video`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
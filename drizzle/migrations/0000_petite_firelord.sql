CREATE TABLE `video` (
	`id` text PRIMARY KEY NOT NULL,
	`transcript` text,
	`audio_urls` text,
	`video_url` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);

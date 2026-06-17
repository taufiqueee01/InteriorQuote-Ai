CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20),
	`email` varchar(320),
	`projectAddress` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`quotationId` int,
	`projectType` varchar(50) NOT NULL,
	`area` decimal(10,2),
	`budget` decimal(12,2),
	`estimatedTimeline` varchar(100),
	`selectedServices` json DEFAULT ('[]'),
	`pricingSummary` json,
	`termsAndConditions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotationItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quotationId` int NOT NULL,
	`itemName` varchar(255) NOT NULL,
	`quantity` decimal(10,2) NOT NULL,
	`rate` decimal(12,2) NOT NULL,
	`gstPercentage` decimal(5,2) DEFAULT '0',
	`discount` decimal(12,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotationItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`projectType` varchar(50) NOT NULL,
	`area` decimal(10,2),
	`budget` decimal(12,2),
	`estimatedTimeline` varchar(100),
	`selectedServices` json DEFAULT ('[]'),
	`subtotal` decimal(12,2) DEFAULT '0',
	`gstAmount` decimal(12,2) DEFAULT '0',
	`finalTotal` decimal(12,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotations_id` PRIMARY KEY(`id`)
);

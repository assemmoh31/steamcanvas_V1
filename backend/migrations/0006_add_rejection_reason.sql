-- Migration number: 0006 	 2026-02-04T10:00:00.000Z

ALTER TABLE Artworks ADD COLUMN rejection_reason TEXT;

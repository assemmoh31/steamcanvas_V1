-- Migration number: 0005 	 2024-02-03T12:00:00.000Z

ALTER TABLE Artworks ADD COLUMN status TEXT DEFAULT 'PENDING';
ALTER TABLE Users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Approve existing artworks so they remain visible
UPDATE Artworks SET status = 'APPROVED';

-- Set the developer (you) as admin
UPDATE Users SET is_admin = TRUE WHERE steam_id = '76561199401459158';

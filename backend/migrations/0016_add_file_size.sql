-- Add file_size_bytes to Artworks table
ALTER TABLE Artworks ADD COLUMN file_size_bytes INTEGER DEFAULT 0;

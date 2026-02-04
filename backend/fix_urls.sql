UPDATE Artworks 
SET preview_url = REPLACE(preview_url, 'http://localhost:8787', 'https://steamcanvas-backend.assemmoh31.workers.dev');

UPDATE Artworks 
SET preview_url = REPLACE(preview_url, 'http://127.0.0.1:8787', 'https://steamcanvas-backend.assemmoh31.workers.dev');

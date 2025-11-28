-- Add content_type column to secrets table
ALTER TABLE secrets 
ADD COLUMN content_type text DEFAULT 'url';

-- Update existing rows to have 'url' as content_type (already handled by default, but good for clarity)
UPDATE secrets SET content_type = 'url' WHERE content_type IS NULL;

-- Comment on column
COMMENT ON COLUMN secrets.content_type IS 'Type of content: "url", "text", "image", "file"';

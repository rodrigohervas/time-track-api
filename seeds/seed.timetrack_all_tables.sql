TRUNCATE companies RESTART IDENTITY CASCADE;
TRUNCATE roles RESTART IDENTITY CASCADE;
TRUNCATE users RESTART IDENTITY CASCADE;

INSERT INTO companies (name)
VALUES
  ('Acme Inc'), 
  ('Things Corp'), 
  ('Services Llc');

INSERT INTO roles (name)
VALUES
  ('Team Member'), 
  ('Manager');

INSERT INTO users (username, password, role_id, company_id)
VALUES
  ('michael@jones.com', '$2b$10$s/9a9ktziiL7CptxBXomMuG7z27nXC0UBrNYYlkE1aQzd9QNEmfyW', '1', '1'), --password: michael
  ('mary@jones.com', '$2b$10$.VAA.Ljyex1pu8fPnAu31OfYbhfCp.SpDHIkPb91HUc03LQALYIx.', '1', '2'), --password: mary
  ('paul@jones.com', '$2b$10$HCbyQB3bcONO7UqkyFQNh.3jSK.CCOeF8iGJ1FFBeMgyse6mW.YxC', '2', '1') --password: paul
  
    --execute: psql -U [dbAdmin] -d [dbName] -f ./seeds/seed.timetrack_all_tables.sqlq
    
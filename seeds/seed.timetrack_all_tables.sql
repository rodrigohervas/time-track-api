TRUNCATE companies RESTART IDENTITY CASCADE;
TRUNCATE roles RESTART IDENTITY CASCADE;
TRUNCATE users RESTART IDENTITY CASCADE;
TRUNCATE timeframes RESTART IDENTITY CASCADE;
TRUNCATE ptotypes RESTART IDENTITY CASCADE;
TRUNCATE ptos RESTART IDENTITY CASCADE;
TRUNCATE ptodays RESTART IDENTITY CASCADE;

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
  ('paul@jones.com', '$2b$10$HCbyQB3bcONO7UqkyFQNh.3jSK.CCOeF8iGJ1FFBeMgyse6mW.YxC', '2', '1'); --password: paul


INSERT INTO timeframes (date, starttime, finishtime, comments, user_id)
VALUES 
    ('2020-02-01', '08:00', '17:15', 'none', 1), 
    ('2020-02-02', '08:30', '17:30', 'work', 1), 
    ('2020-02-08', '07:45', '17:15', 'project 6', 1), 
    ('2020-02-09', '10:00', '12:45', 'team building', 1), 
    ('2020-02-23', '08:00', '17:00', 'don''t remember', 1), 
    ('2020-03-05', '08:00', '17:15', 'none', 1), 
    ('2020-03-07', '08:30', '17:30', 'work', 1), 
    ('2020-03-15', '07:45', '17:15', 'project 6', 1), 
    ('2020-03-19', '10:00', '12:45', 'team building', 1), 
    ('2020-03-25', '08:00', '17:00', 'don''t remember', 1), 
    ('2020-01-10', '08:00', '17:15', 'none', 1), 
    ('2020-01-11', '08:30', '17:30', 'work', 1), 
    ('2020-01-21', '07:45', '17:15', 'project 6', 1), 
    ('2020-01-22', '10:00', '12:45', 'team building', 1), 
    ('2020-01-27', '08:00', '17:00', 'don''t remember', 1), 
    ('2020-04-26', '08:00', '17:00', 'don''t remember', 1), 
    ('2020-04-08', '08:00', '17:15', 'project zero', 1), 
    ('2020-04-11', '08:30', '17:30', 'work', 1), 
    ('2020-04-17', '07:45', '17:15', 'project 6', 1), 
    ('2020-01-05', '08:00', '17:15', 'none', 2), 
    ('2020-01-23', '08:00', '17:00', 'don''t remember', 2), 
    ('2020-02-15', '07:45', '17:15', 'project 6', 2), 
    ('2020-02-19', '10:00', '12:45', 'team building', 2), 
    ('2020-02-25', '08:00', '17:00', 'don''t remember', 2), 
    ('2020-03-10', '08:00', '17:15', 'none', 2), 
    ('2020-03-11', '08:30', '17:30', 'work', 2), 
    ('2020-04-05', '08:00', '17:00', 'don''t remember', 2), 
    ('2020-04-10', '08:00', '17:15', 'project zero', 2), 
    ('2020-01-05', '08:00', '17:15', 'none', 3),
    ('2020-03-10', '08:00', '17:15', 'none', 3), 
    ('2020-03-11', '08:30', '17:30', 'work', 3), 
    ('2020-03-21', '07:45', '17:15', 'project 6', 3), 
    ('2020-03-22', '10:00', '12:45', 'team building', 3), 
    ('2020-03-27', '08:00', '17:00', 'don''t remember', 3), 
    ('2020-04-05', '08:00', '17:00', 'don''t remember', 3), 
    ('2020-04-10', '08:00', '17:15', 'project zero', 3), 
    ('2020-04-19', '08:30', '17:30', 'work', 3), 
    ('2020-04-27', '07:45', '17:15', 'project 6', 3);


INSERT INTO ptotypes (name)
VALUES 
    ('Vacation days'), 
    ('Personal days'), 
    ('Sick days'), 
    ('Other');


INSERT INTO ptos (user_id, type, startdate, finishdate, comments)
VALUES
    (1, 1, '2020-02-01', '2020-02-02', 'comment to request 1'), 
    (1, 2, '2020-03-02', '2020-03-03', 'comment to request 2'), 
    (1, 3, '2020-02-03', '2020-02-04', 'comment to request 3'), 
    (1, 1, '2020-03-04', '2020-03-05', 'comment to request 4'), 
    (1, 2, '2020-01-28', '2020-01-05', 'comment to request 5'), 
    (2, 1, '2020-03-01', '2020-03-02', 'comment to request 6'), 
    (2, 2, '2020-03-02', '2020-03-03', 'comment to request 7'), 
    (2, 3, '2020-04-03', '2020-04-04', 'comment to request 8'), 
    (2, 1, '2020-04-04', '2020-04-05', 'comment to request 9'), 
    (2, 2, '2020-02-01', '2020-02-05', 'comment to request 10');


INSERT INTO ptodays (user_id, totaldays, useddays, availabledays)
VALUES
    (1, 28, 11, 17), 
    (2, 26, 8, 18), 
    (3, 22, 0, 22);
    


      --execute: psql -U [dbAdmin] -d [dbName] -f ./seeds/seed.timetrack_all_tables.sqlq
    
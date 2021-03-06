

CREATE TABLE ptos (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL, 
    type INTEGER
        REFERENCES ptotypes(id) ON DELETE CASCADE NOT NULL, 
    startdate DATE NOT NULL,
    finishdate DATE NOT NULL,
    comments TEXT NULL    
);
const SQL = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR (255), first_name VARCHAR (255), last_name VARCHARR (255), member_status BOOLEAN NOT NULL DEFAULT FALSE;
    );

    INSERT INTO users (username, first_name, last_name, member_status)
    VALUES ('jtux123', 'Jake', 'Tucker', true);


    CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    message VARCHAR ( 255 ), time VARCHAR (255), user_id INT REFERENCES users(id);

    ALTER TABLE messages ADD COLUMN IF NOT EXISTS time VARCHAR;
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_id INT;
    


)`;

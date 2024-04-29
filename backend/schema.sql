CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    imageBase64  MEDIUMTEXT  NULL
);


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- Campo para almacenar la contraseña hasheada
    role ENUM('user', 'admin') DEFAULT 'user', -- Opcional, si quieres roles de usuario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

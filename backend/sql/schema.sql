CREATE DATABASE IF NOT EXISTS skillswap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skillswap;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    dept VARCHAR(120) DEFAULT NULL,
    year TINYINT UNSIGNED DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    verification_status ENUM('unverified', 'pending', 'verified', 'rejected') NOT NULL DEFAULT 'unverified',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS auth_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_auth_tokens_user (user_id),
    INDEX idx_auth_tokens_expiry (expires_at),
    CONSTRAINT fk_auth_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS skills (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    category VARCHAR(120) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_teach_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    skill_id INT UNSIGNED NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    mode ENUM('online', 'offline', 'both') NOT NULL,
    description TEXT DEFAULT NULL,
    hourly_commitment DECIMAL(4,1) DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_teach_skill (user_id, skill_id),
    INDEX idx_teach_skill (skill_id),
    INDEX idx_teach_user_active (user_id, is_active),
    CONSTRAINT fk_teach_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_teach_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_learn_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    skill_id INT UNSIGNED NOT NULL,
    level_needed ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    notes TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_learn_skill (user_id, skill_id),
    INDEX idx_learn_skill (skill_id),
    CONSTRAINT fk_learn_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_learn_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS availability_slots (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    day_of_week TINYINT UNSIGNED NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_availability_user_day (user_id, day_of_week),
    CONSTRAINT fk_availability_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user1_id INT UNSIGNED NOT NULL,
    user2_id INT UNSIGNED NOT NULL,
    last_message_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_conversation_pair (user1_id, user2_id),
    INDEX idx_conversation_user1 (user1_id),
    INDEX idx_conversation_user2 (user2_id),
    CONSTRAINT fk_conversation_user1 FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_conversation_user2 FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS swap_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    from_user_id INT UNSIGNED NOT NULL,
    to_user_id INT UNSIGNED NOT NULL,
    teach_skill_id INT UNSIGNED DEFAULT NULL,
    learn_skill_id INT UNSIGNED DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
    proposed_time DATETIME DEFAULT NULL,
    conversation_id BIGINT UNSIGNED DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_swap_to_status (to_user_id, status),
    INDEX idx_swap_from_status (from_user_id, status),
    INDEX idx_swap_conversation (conversation_id),
    CONSTRAINT fk_swap_from_user FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_swap_to_user FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_swap_teach_skill FOREIGN KEY (teach_skill_id) REFERENCES skills(id) ON DELETE SET NULL,
    CONSTRAINT fk_swap_learn_skill FOREIGN KEY (learn_skill_id) REFERENCES skills(id) ON DELETE SET NULL,
    CONSTRAINT fk_swap_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    sender_id INT UNSIGNED NOT NULL,
    message_type ENUM('text', 'image') NOT NULL DEFAULT 'text',
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    INDEX idx_messages_conversation_id (conversation_id, id),
    INDEX idx_messages_conversation_created (conversation_id, created_at),
    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    swap_request_id BIGINT UNSIGNED NOT NULL,
    from_user_id INT UNSIGNED NOT NULL,
    to_user_id INT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    comment TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_review_once (swap_request_id, from_user_id),
    INDEX idx_reviews_to_user (to_user_id),
    CONSTRAINT fk_reviews_swap FOREIGN KEY (swap_request_id) REFERENCES swap_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_from_user FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_to_user FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS verification_docs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    doc_type ENUM('college_id', 'email', 'other') NOT NULL,
    doc_url VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    reviewed_by INT UNSIGNED DEFAULT NULL,
    reviewed_at DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_verification_user_status (user_id, status),
    CONSTRAINT fk_verification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_verification_admin FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blocks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    blocker_id INT UNSIGNED NOT NULL,
    blocked_id INT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_block_pair (blocker_id, blocked_id),
    INDEX idx_blocked_user (blocked_id),
    CONSTRAINT fk_block_blocker FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_block_blocked FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT UNSIGNED NOT NULL,
    reported_id INT UNSIGNED NOT NULL,
    reason VARCHAR(120) NOT NULL,
    details TEXT DEFAULT NULL,
    status ENUM('open', 'resolved', 'dismissed') NOT NULL DEFAULT 'open',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reports_reported_status (reported_id, status),
    INDEX idx_reports_reporter (reporter_id),
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reports_reported FOREIGN KEY (reported_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO skills (name, category) VALUES
    ('Flutter', 'Development'),
    ('Dart', 'Development'),
    ('Python', 'Development'),
    ('Java', 'Development'),
    ('C Programming', 'Development'),
    ('UI Design', 'Design'),
    ('Photoshop', 'Design'),
    ('Public Speaking', 'Soft Skills'),
    ('Mathematics', 'Academic'),
    ('Data Structures', 'Academic');


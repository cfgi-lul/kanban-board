-- Migration script for enhanced User, Task, Board, Column, Comment, Label, Attachment, and Notification models
-- This script documents the changes needed for all enhanced models

-- ===== USER TABLE ENHANCEMENTS =====
-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(100) NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to have display_name if it's empty
UPDATE users SET display_name = name WHERE display_name = '' OR display_name IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- ===== TASK TABLE ENHANCEMENTS =====
-- Add new columns to task table
ALTER TABLE task ADD COLUMN IF NOT EXISTS priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM';
ALTER TABLE task ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'TODO';
ALTER TABLE task ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;
ALTER TABLE task ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE task ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_task_priority ON task(priority);
CREATE INDEX IF NOT EXISTS idx_task_status ON task(status);
CREATE INDEX IF NOT EXISTS idx_task_due_date ON task(due_date);
CREATE INDEX IF NOT EXISTS idx_task_created_at ON task(created_at);

-- ===== BOARD TABLE ENHANCEMENTS =====
-- Add new columns to board table
ALTER TABLE board ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE board ADD COLUMN IF NOT EXISTS settings TEXT;
ALTER TABLE board ADD COLUMN IF NOT EXISTS invitation_code VARCHAR(50) UNIQUE;
ALTER TABLE board ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE board ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE board ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE board ADD COLUMN IF NOT EXISTS created_by BIGINT REFERENCES users(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_board_archived ON board(archived);
CREATE INDEX IF NOT EXISTS idx_board_created_at ON board(created_at);
CREATE INDEX IF NOT EXISTS idx_board_invitation_code ON board(invitation_code);

-- ===== COLUMN TABLE ENHANCEMENTS =====
-- Add new columns to column table
ALTER TABLE column ADD COLUMN IF NOT EXISTS order_index INTEGER NOT NULL DEFAULT 0;
ALTER TABLE column ADD COLUMN IF NOT EXISTS color VARCHAR(20);
ALTER TABLE column ADD COLUMN IF NOT EXISTS task_limit INTEGER;
ALTER TABLE column ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE column ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_column_order_index ON column(order_index);
CREATE INDEX IF NOT EXISTS idx_column_created_at ON column(created_at);

-- ===== COMMENT TABLE ENHANCEMENTS =====
-- Add new columns to comment table
ALTER TABLE comment ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE comment ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP;
ALTER TABLE comment ADD COLUMN IF NOT EXISTS mentions TEXT;
ALTER TABLE comment ADD COLUMN IF NOT EXISTS edited BOOLEAN NOT NULL DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comment_created_at ON comment(created_at);
CREATE INDEX IF NOT EXISTS idx_comment_updated_at ON comment(updated_at);
CREATE INDEX IF NOT EXISTS idx_comment_edited ON comment(edited);

-- ===== LABEL TABLE =====
-- Create label table
CREATE TABLE IF NOT EXISTS label (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL,
    description TEXT,
    board_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES board(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_label_board_id ON label(board_id);
CREATE INDEX IF NOT EXISTS idx_label_created_at ON label(created_at);

-- ===== ATTACHMENT TABLE =====
-- Create attachment table
CREATE TABLE IF NOT EXISTS attachment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    uploaded_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attachment_task_id ON attachment(task_id);
CREATE INDEX IF NOT EXISTS idx_attachment_uploaded_by ON attachment(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_attachment_created_at ON attachment(created_at);

-- ===== NOTIFICATION TABLE =====
-- Create notification table
CREATE TABLE IF NOT EXISTS notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    data TEXT,
    recipient_id BIGINT NOT NULL,
    sender_id BIGINT,
    task_id BIGINT,
    board_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
    FOREIGN KEY (board_id) REFERENCES board(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notification_recipient_id ON notification(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notification_read ON notification(read);
CREATE INDEX IF NOT EXISTS idx_notification_created_at ON notification(created_at);

-- ===== TASK_LABELS JUNCTION TABLE =====
-- Create task_labels junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS task_labels (
    task_id BIGINT NOT NULL,
    label_id BIGINT NOT NULL,
    PRIMARY KEY (task_id, label_id),
    FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES label(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_task_labels_task_id ON task_labels(task_id);
CREATE INDEX IF NOT EXISTS idx_task_labels_label_id ON task_labels(label_id);

-- Note: The 'name' column in users table is kept for backward compatibility but marked as deprecated
-- New applications should use 'display_name' instead 
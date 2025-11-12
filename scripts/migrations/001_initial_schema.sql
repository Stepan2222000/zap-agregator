-- Начальная схема базы данных для AutoHub AI
-- Версия: 1.0
-- Дата: 2025-11-12

-- Удаление существующих таблиц (для переустановки)
DROP TABLE IF EXISTS moderation_log CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS article_numbers CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS parts CASCADE;

-- Таблица: parts (внутренние ID запчастей)
CREATE TABLE parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internal_code VARCHAR(100) UNIQUE NOT NULL,
    canonical_name VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для parts
CREATE INDEX idx_parts_internal_code ON parts(internal_code);
CREATE INDEX idx_parts_created_at ON parts(created_at DESC);

-- Таблица: listings (объявления)
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_number VARCHAR(255) NOT NULL,
    condition VARCHAR(10) NOT NULL CHECK (condition IN ('new', 'used')),
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    brand VARCHAR(255) NOT NULL,
    description TEXT,
    contact_phone VARCHAR(50) NOT NULL,
    contact_whatsapp VARCHAR(50),
    contact_telegram VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'processing'
        CHECK (status IN ('processing', 'pending', 'approved', 'rejected')),
    ai_processed_title VARCHAR(500),
    ai_processed_description TEXT,
    ai_error_message TEXT,
    part_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_listings_part_id
        FOREIGN KEY (part_id)
        REFERENCES parts(id)
        ON DELETE SET NULL
);

-- Индексы для listings
CREATE INDEX idx_listings_article_number ON listings(article_number);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_brand ON listings(brand);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_part_id ON listings(part_id);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_condition ON listings(condition);

-- Таблица: article_numbers (артикулы)
CREATE TABLE article_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id UUID NOT NULL,
    article_number VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_article_numbers_part_id
        FOREIGN KEY (part_id)
        REFERENCES parts(id)
        ON DELETE CASCADE
);

-- Индексы для article_numbers
CREATE INDEX idx_article_numbers_part_id ON article_numbers(part_id);
CREATE INDEX idx_article_numbers_article_number ON article_numbers(article_number);
CREATE UNIQUE INDEX idx_article_numbers_unique ON article_numbers(part_id, article_number);

-- Таблица: photos (фотографии)
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_photos_listing_id
        FOREIGN KEY (listing_id)
        REFERENCES listings(id)
        ON DELETE CASCADE
);

-- Индексы для photos
CREATE INDEX idx_photos_listing_id ON photos(listing_id);
CREATE INDEX idx_photos_order ON photos(listing_id, display_order);

-- Таблица: moderation_log (история модерации)
CREATE TABLE moderation_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL
        CHECK (action IN ('approved', 'rejected', 'reprocess_ai', 'created', 'updated')),
    moderator_note TEXT,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_moderation_log_listing_id
        FOREIGN KEY (listing_id)
        REFERENCES listings(id)
        ON DELETE CASCADE
);

-- Индексы для moderation_log
CREATE INDEX idx_moderation_log_listing_id ON moderation_log(listing_id);
CREATE INDEX idx_moderation_log_action ON moderation_log(action);
CREATE INDEX idx_moderation_log_created_at ON moderation_log(created_at DESC);

-- Триггер для автоматического обновления updated_at в parts
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON parts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Комментарии к таблицам
COMMENT ON TABLE parts IS 'Внутренние ID запчастей, создаются модератором';
COMMENT ON TABLE listings IS 'Объявления о продаже запчастей';
COMMENT ON TABLE article_numbers IS 'Артикулы запчастей (many-to-one с parts)';
COMMENT ON TABLE photos IS 'Фотографии объявлений';
COMMENT ON TABLE moderation_log IS 'История модерации объявлений';

-- Вставка тестовых данных (опционально, для разработки)
-- Раскомментируйте для добавления тестовых данных
/*
INSERT INTO parts (internal_code, canonical_name, description) VALUES
    ('PART-001', 'Масляный фильтр Mann W 712/75', 'Качественный масляный фильтр для различных моделей автомобилей');

INSERT INTO article_numbers (part_id, article_number, manufacturer) VALUES
    ((SELECT id FROM parts WHERE internal_code = 'PART-001'), 'W712/75', 'Mann-Filter'),
    ((SELECT id FROM parts WHERE internal_code = 'PART-001'), 'W71275', 'Mann-Filter');
*/

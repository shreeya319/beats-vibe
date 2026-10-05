-- ============================================================
-- MUSICAL INSTRUMENTS STORE - DEVELOPMENT SEED DATA
-- ============================================================


-- ============================================================
-- 1. CATEGORIES
-- ============================================================

insert into public.categories
    (name, slug, description, image_url, is_active)
values
    (
        'Guitars',
        'guitars',
        'Acoustic, electric and bass guitars for beginners and experienced musicians.',
        'https://images.unsplash.com/photo-1525201548942-d8732f6617a0',
        true
    ),
    (
        'Keyboards & Pianos',
        'keyboards-pianos',
        'Digital pianos, keyboards and instruments for creating melodies and arrangements.',
        'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0',
        true
    ),
    (
        'Drums & Percussion',
        'drums-percussion',
        'Drum kits and percussion instruments for rhythm and performance.',
        'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7',
        true
    ),
    (
        'Violins & Strings',
        'violins-strings',
        'String instruments including violins and other essential accessories.',
        'https://images.unsplash.com/photo-1460039230329-eb070fc6c77c',
        true
    ),
    (
        'Wind Instruments',
        'wind-instruments',
        'Flutes and other wind instruments for musicians of different skill levels.',
        'https://images.unsplash.com/photo-1573871669414-010dbf7ac18b',
        true
    ),
    (
        'Accessories',
        'accessories',
        'Essential accessories and replacement items for musical instruments.',
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
        true
    )
on conflict (slug) do nothing;


-- ============================================================
-- 2. PRODUCTS
-- ============================================================

insert into public.products
    (
        category_id,
        name,
        slug,
        sku,
        brand,
        description,
        price,
        discount_price,
        stock_quantity,
        is_featured,
        is_active
    )
values
    (
        (select id from public.categories where slug = 'guitars'),
        'Classic Acoustic Guitar',
        'classic-acoustic-guitar',
        'GTR-AC-001',
        'Yamaha',
        'A versatile acoustic guitar with a warm tone and comfortable playability.',
        24999.00,
        21999.00,
        15,
        true,
        true
    ),
    (
        (select id from public.categories where slug = 'guitars'),
        'Electric Guitar',
        'electric-guitar',
        'GTR-EL-001',
        'Fender',
        'A versatile electric guitar designed for expressive playing across multiple styles.',
        54999.00,
        49999.00,
        8,
        true,
        true
    ),
    (
        (select id from public.categories where slug = 'guitars'),
        'Bass Guitar',
        'bass-guitar',
        'GTR-BS-001',
        'Ibanez',
        'A comfortable bass guitar delivering balanced low-end tone and reliable performance.',
        42999.00,
        null,
        6,
        false,
        true
    ),
    (
        (select id from public.categories where slug = 'keyboards-pianos'),
        'Digital Piano',
        'digital-piano',
        'KEY-DP-001',
        'Casio',
        'A digital piano offering realistic piano tones and features for home practice.',
        64999.00,
        59999.00,
        5,
        true,
        true
    ),
    (
        (select id from public.categories where slug = 'keyboards-pianos'),
        'Portable Keyboard',
        'portable-keyboard',
        'KEY-PK-001',
        'Roland',
        'A compact keyboard suitable for practice, performances and music production.',
        32999.00,
        null,
        10,
        true,
        true
    ),
    (
        (select id from public.categories where slug = 'drums-percussion'),
        'Acoustic Drum Kit',
        'acoustic-drum-kit',
        'DRM-AC-001',
        'Pearl',
        'A complete acoustic drum kit designed for practice and live performance.',
        75999.00,
        69999.00,
        4,
        true,
        true
    ),
    (
        (select id from public.categories where slug = 'drums-percussion'),
        'Electronic Drum Kit',
        'electronic-drum-kit',
        'DRM-EL-001',
        'Roland',
        'An electronic drum kit with responsive pads and versatile sounds.',
        89999.00,
        null,
        3,
        false,
        true
    ),
    (
        (select id from public.categories where slug = 'violins-strings'),
        'Student Violin',
        'student-violin',
        'STR-VL-001',
        'Kadence',
        'A beginner-friendly violin designed for students learning classical strings.',
        15999.00,
        13999.00,
        12,
        true,
        true
    ),
    (
        (select id from public.categories where slug = 'wind-instruments'),
        'Concert Flute',
        'concert-flute',
        'WND-FL-001',
        'Yamaha',
        'A carefully designed flute suitable for learning, practice and performance.',
        28999.00,
        null,
        7,
        false,
        true
    ),
    (
        (select id from public.categories where slug = 'accessories'),
        'Guitar Strings',
        'guitar-strings',
        'ACC-GS-001',
        'DAddario',
        'Durable guitar strings designed for consistent tone and comfortable playing.',
        899.00,
        749.00,
        50,
        true,
        true
    )
on conflict (slug) do nothing;


-- ============================================================
-- 3. PRODUCT IMAGES
-- ============================================================

insert into public.product_images
    (
        product_id,
        image_url,
        alt_text,
        is_primary,
        display_order
    )
values
    (
        (select id from public.products where slug = 'classic-acoustic-guitar'),
        'https://images.unsplash.com/photo-1510915361894-db8b60106cb1',
        'Classic acoustic guitar',
        true,
        1
    ),
    (
        (select id from public.products where slug = 'electric-guitar'),
        'https://images.unsplash.com/photo-1525587634003-9a5f5f0b7a72',
        'Electric guitar',
        true,
        1
    ),
    (
        (select id from public.products where slug = 'bass-guitar'),
        'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee',
        'Bass guitar',
        true,
        1
    ),
    (
        (select id from public.products where slug = 'digital-piano'),
        'https://images.unsplash.com/photo-1552422535-c45813c61732',
        'Digital piano',
        true,
        1
    ),
    (
        (select id from public.products where slug = 'portable-keyboard'),
        'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0',
        'Portable keyboard',
        true,
        1
    ),
    (
        (select id from public.products where slug = 'acoustic-drum-kit'),
        'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7',
        'Acoustic drum kit',
        true,
        1
    ),
    (
        (select id from public.products where slug = 'electronic-drum-kit'),
        'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7',
        'Electronic drum kit',
        true,
        1
    ),
    (
        (select id from public.products where slug = 'student-violin'),
        'https://images.unsplash.com/photo-1460039230329-eb070fc6c77c',
        'Student violin',
        true,
        1
    ),
    (
        (select id from public.products where slug = 'concert-flute'),
        'https://images.unsplash.com/photo-1573871669414-010dbf7ac18b',
        'Concert flute',
        true,
        1
    ),
    (
        (select id from public.products where slug = 'guitar-strings'),
        'https://images.unsplash.com/photo-1525201548942-d8732f6617a0',
        'Guitar strings and accessories',
        true,
        1
    )
on conflict do nothing;


-- ============================================================
-- PRODUCT SPECIFICATIONS
-- ============================================================

-- Classic Acoustic Guitar
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'classic-acoustic-guitar'),
    'Body Type',
    'Dreadnought'
),
(
    (select id from public.products where slug = 'classic-acoustic-guitar'),
    'Number of Strings',
    '6'
),
(
    (select id from public.products where slug = 'classic-acoustic-guitar'),
    'Body Material',
    'Spruce'
),
(
    (select id from public.products where slug = 'classic-acoustic-guitar'),
    'Neck Material',
    'Nato'
),
(
    (select id from public.products where slug = 'classic-acoustic-guitar'),
    'Fingerboard Material',
    'Rosewood'
),
(
    (select id from public.products where slug = 'classic-acoustic-guitar'),
    'Scale Length',
    '25.5 inches'
),
(
    (select id from public.products where slug = 'classic-acoustic-guitar'),
    'Finish',
    'Natural'
),
(
    (select id from public.products where slug = 'classic-acoustic-guitar'),
    'Suitable For',
    'Beginners and Intermediate Players'
);


-- Electric Guitar
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'electric-guitar'),
    'Body Material',
    'Alder'
),
(
    (select id from public.products where slug = 'electric-guitar'),
    'Number of Strings',
    '6'
),
(
    (select id from public.products where slug = 'electric-guitar'),
    'Pickup Configuration',
    'SSS'
),
(
    (select id from public.products where slug = 'electric-guitar'),
    'Scale Length',
    '25.5 inches'
),
(
    (select id from public.products where slug = 'electric-guitar'),
    'Neck Material',
    'Maple'
),
(
    (select id from public.products where slug = 'electric-guitar'),
    'Fingerboard',
    'Maple'
),
(
    (select id from public.products where slug = 'electric-guitar'),
    'Bridge',
    'Tremolo Bridge'
),
(
    (select id from public.products where slug = 'electric-guitar'),
    'Suitable For',
    'Intermediate and Advanced Players'
);


-- Bass Guitar
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'bass-guitar'),
    'Body Material',
    'Mahogany'
),
(
    (select id from public.products where slug = 'bass-guitar'),
    'Number of Strings',
    '4'
),
(
    (select id from public.products where slug = 'bass-guitar'),
    'Pickup Configuration',
    'Dual Humbucker'
),
(
    (select id from public.products where slug = 'bass-guitar'),
    'Scale Length',
    '34 inches'
),
(
    (select id from public.products where slug = 'bass-guitar'),
    'Neck Material',
    'Maple'
),
(
    (select id from public.products where slug = 'bass-guitar'),
    'Fingerboard',
    'Rosewood'
),
(
    (select id from public.products where slug = 'bass-guitar'),
    'Finish',
    'Gloss'
),
(
    (select id from public.products where slug = 'bass-guitar'),
    'Suitable For',
    'Intermediate Players'
);


-- Digital Piano
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'digital-piano'),
    'Number of Keys',
    '88'
),
(
    (select id from public.products where slug = 'digital-piano'),
    'Keyboard Type',
    'Weighted Hammer Action'
),
(
    (select id from public.products where slug = 'digital-piano'),
    'Polyphony',
    '192'
),
(
    (select id from public.products where slug = 'digital-piano'),
    'Number of Voices',
    '700+'
),
(
    (select id from public.products where slug = 'digital-piano'),
    'Pedals',
    '3 Pedals'
),
(
    (select id from public.products where slug = 'digital-piano'),
    'Connectivity',
    'USB, Bluetooth'
),
(
    (select id from public.products where slug = 'digital-piano'),
    'Speaker System',
    'Built-in Stereo Speakers'
),
(
    (select id from public.products where slug = 'digital-piano'),
    'Suitable For',
    'Beginners, Students and Performers'
);


-- Portable Keyboard
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'portable-keyboard'),
    'Number of Keys',
    '61'
),
(
    (select id from public.products where slug = 'portable-keyboard'),
    'Touch Response',
    'Yes'
),
(
    (select id from public.products where slug = 'portable-keyboard'),
    'Number of Voices',
    '500+'
),
(
    (select id from public.products where slug = 'portable-keyboard'),
    'Number of Styles',
    '200+'
),
(
    (select id from public.products where slug = 'portable-keyboard'),
    'Polyphony',
    '128'
),
(
    (select id from public.products where slug = 'portable-keyboard'),
    'Connectivity',
    'USB, Bluetooth, MIDI'
),
(
    (select id from public.products where slug = 'portable-keyboard'),
    'Power',
    'AC Adapter / Battery'
),
(
    (select id from public.products where slug = 'portable-keyboard'),
    'Suitable For',
    'Beginners and Performers'
);


-- Acoustic Drum Kit
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'acoustic-drum-kit'),
    'Kit Configuration',
    '5-Piece'
),
(
    (select id from public.products where slug = 'acoustic-drum-kit'),
    'Bass Drum',
    '22 inches'
),
(
    (select id from public.products where slug = 'acoustic-drum-kit'),
    'Tom Sizes',
    '10 and 12 inches'
),
(
    (select id from public.products where slug = 'acoustic-drum-kit'),
    'Floor Tom',
    '16 inches'
),
(
    (select id from public.products where slug = 'acoustic-drum-kit'),
    'Snare Drum',
    '14 inches'
),
(
    (select id from public.products where slug = 'acoustic-drum-kit'),
    'Shell Material',
    'Poplar'
),
(
    (select id from public.products where slug = 'acoustic-drum-kit'),
    'Finish',
    'Gloss'
),
(
    (select id from public.products where slug = 'acoustic-drum-kit'),
    'Suitable For',
    'Practice and Live Performance'
);


-- Electronic Drum Kit
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'electronic-drum-kit'),
    'Kit Configuration',
    '8-Piece'
),
(
    (select id from public.products where slug = 'electronic-drum-kit'),
    'Pads',
    'Mesh and Rubber Pads'
),
(
    (select id from public.products where slug = 'electronic-drum-kit'),
    'Drum Sounds',
    '300+'
),
(
    (select id from public.products where slug = 'electronic-drum-kit'),
    'Kits',
    '50+'
),
(
    (select id from public.products where slug = 'electronic-drum-kit'),
    'Connectivity',
    'USB, MIDI, Audio Output'
),
(
    (select id from public.products where slug = 'electronic-drum-kit'),
    'Headphone Output',
    'Yes'
),
(
    (select id from public.products where slug = 'electronic-drum-kit'),
    'Recording',
    'USB Audio Recording'
),
(
    (select id from public.products where slug = 'electronic-drum-kit'),
    'Suitable For',
    'Practice, Recording and Performance'
);


-- Student Violin
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'student-violin'),
    'Size',
    '4/4'
),
(
    (select id from public.products where slug = 'student-violin'),
    'Number of Strings',
    '4'
),
(
    (select id from public.products where slug = 'student-violin'),
    'Body Material',
    'Spruce and Maple'
),
(
    (select id from public.products where slug = 'student-violin'),
    'Fingerboard',
    'Ebony'
),
(
    (select id from public.products where slug = 'student-violin'),
    'Tailpiece',
    'Composite'
),
(
    (select id from public.products where slug = 'student-violin'),
    'Bow',
    'Included'
),
(
    (select id from public.products where slug = 'student-violin'),
    'Case',
    'Included'
),
(
    (select id from public.products where slug = 'student-violin'),
    'Suitable For',
    'Students and Beginners'
);


-- Concert Flute
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'concert-flute'),
    'Key',
    'C'
),
(
    (select id from public.products where slug = 'concert-flute'),
    'Material',
    'Silver Plated'
),
(
    (select id from public.products where slug = 'concert-flute'),
    'Headjoint',
    'Silver Plated'
),
(
    (select id from public.products where slug = 'concert-flute'),
    'Key System',
    'Offset G'
),
(
    (select id from public.products where slug = 'concert-flute'),
    'Number of Keys',
    '16'
),
(
    (select id from public.products where slug = 'concert-flute'),
    'Foot Joint',
    'C Foot'
),
(
    (select id from public.products where slug = 'concert-flute'),
    'Case',
    'Included'
),
(
    (select id from public.products where slug = 'concert-flute'),
    'Suitable For',
    'Intermediate Players'
);


-- Guitar Strings
insert into public.product_specifications
    (product_id, specification_name, specification_value)
values
(
    (select id from public.products where slug = 'guitar-strings'),
    'String Type',
    'Acoustic Guitar Strings'
),
(
    (select id from public.products where slug = 'guitar-strings'),
    'String Material',
    'Phosphor Bronze'
),
(
    (select id from public.products where slug = 'guitar-strings'),
    'String Gauge',
    'Light'
),
(
    (select id from public.products where slug = 'guitar-strings'),
    'Number of Strings',
    '6'
),
(
    (select id from public.products where slug = 'guitar-strings'),
    'Scale Length',
    'Standard'
),
(
    (select id from public.products where slug = 'guitar-strings'),
    'Coating',
    'Uncoated'
),
(
    (select id from public.products where slug = 'guitar-strings'),
    'Tone',
    'Bright and Balanced'
),
(
    (select id from public.products where slug = 'guitar-strings'),
    'Suitable For',
    'Acoustic Guitar Players'
);


# Home Hero section 
create table public.home_hero_slides (
    id bigint generated by default as identity primary key,

    image_url text not null,

    eyebrow text,
    title text not null,
    description text,

    primary_button_text text,
    primary_button_link text,

    secondary_button_text text,
    secondary_button_link text,

    display_order integer not null default 0,

    is_active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

# Testimonial 
create table public.testimonials (
    id bigint generated by default as identity primary key,

    customer_name text not null,
    customer_role text,

    review text not null,

    rating integer not null default 5
        check (rating >= 1 and rating <= 5),

    display_order integer not null default 0,

    is_active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

# About USB

create table public.about_us (
    id bigint generated by default as identity primary key,

    -- ========================================================
    -- HERO
    -- ========================================================

    hero_eyebrow text,
    hero_title text not null,
    hero_description text,
    hero_image_url text,

    -- ========================================================
    -- OUR STORY
    -- ========================================================

    story_eyebrow text,
    story_title text not null,

    story_paragraph_1 text,
    story_paragraph_2 text,
    story_paragraph_3 text,

    story_image_url text,

    -- ========================================================
    -- WHY CHOOSE US
    -- ========================================================

    why_eyebrow text,
    why_title text not null,
    why_description text,

    -- Feature 1
    feature_1_icon text,
    feature_1_title text,
    feature_1_description text,

    -- Feature 2
    feature_2_icon text,
    feature_2_title text,
    feature_2_description text,

    -- Feature 3
    feature_3_icon text,
    feature_3_title text,
    feature_3_description text,

    -- Feature 4
    feature_4_icon text,
    feature_4_title text,
    feature_4_description text,

    -- ========================================================
    -- MISSION
    -- ========================================================

    mission_title text,
    mission_description text,

    -- ========================================================
    -- CTA
    -- ========================================================

    cta_title text,
    cta_description text,
    cta_button_text text,
    cta_button_link text,

    -- ========================================================
    -- STATUS / TIMESTAMPS
    -- ========================================================

    is_active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);




# Settings
CREATE TABLE IF NOT EXISTS store_settings (
    id BIGSERIAL PRIMARY KEY,

    store_name TEXT NOT NULL,
    store_description TEXT,

    contact_email TEXT,
    contact_phone TEXT,
    store_address TEXT,

    currency TEXT DEFAULT 'INR',

    free_shipping_threshold NUMERIC(10,2) DEFAULT 0,
    shipping_charge NUMERIC(10,2) DEFAULT 0,
    tax_percentage NUMERIC(5,2) DEFAULT 0,

    facebook_url TEXT,
    instagram_url TEXT,
    whatsapp_url TEXT,

    store_status BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

# Contact information
CREATE TABLE contact_information (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

    email TEXT NOT NULL,
    phone TEXT NOT NULL,

    address_line1 TEXT NOT NULL,
    address_line2 TEXT,

    support_title TEXT NOT NULL DEFAULT 'Support',
    support_description TEXT NOT NULL,

    map_location TEXT NOT NULL,

    facebook_url TEXT,
    instagram_url TEXT,
    whatsapp_number TEXT,
    whatsapp_message TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
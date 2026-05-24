-- Kona 2026 IRONMAN Qualifying Events
-- Run this in Azure Portal → SQL databases → free-sql-db-8836662 → Query editor
-- Source: trirating.com/kona-2026 + ironman.com

IF NOT EXISTS (
    SELECT * FROM sysobjects WHERE name='ironman_qualifying_events' AND xtype='U'
)
CREATE TABLE ironman_qualifying_events (
    id         INT           IDENTITY(1,1) PRIMARY KEY,
    event_name NVARCHAR(255) NOT NULL,
    city       NVARCHAR(255) NOT NULL,
    country    NVARCHAR(255) NOT NULL,
    race_date  DATE          NULL
);

-- Avoid duplicate inserts if run more than once
IF NOT EXISTS (SELECT 1 FROM ironman_qualifying_events)
BEGIN
    INSERT INTO ironman_qualifying_events (event_name, city, country, race_date) VALUES
    -- Completed qualifiers
    ('IRONMAN Wales',                   'Tenby',              'United Kingdom',  '2025-09-21'),
    ('IRONMAN Chattanooga',             'Chattanooga',        'USA',             '2025-09-28'),
    ('IRONMAN Arizona',                 'Tempe',              'USA',             '2025-11-16'),
    ('IRONMAN Cozumel',                 'Cozumel',            'Mexico',          '2025-11-23'),
    ('IRONMAN Western Australia',       'Busselton',          'Australia',       '2025-12-07'),
    ('IRONMAN New Zealand',             'Taupō',              'New Zealand',     '2026-03-07'),
    ('IRONMAN Texas',                   'The Woodlands',      'USA',             '2026-04-18'),
    ('IRONMAN South Africa',            'Nelson Mandela Bay', 'South Africa',    '2026-04-19'),
    ('IRONMAN Lanzarote',               'Lanzarote',          'Spain',           '2026-05-23'),
    -- Upcoming qualifiers
    ('IRONMAN Brazil',                  'Florianópolis',      'Brazil',          '2026-05-31'),
    ('IRONMAN Hamburg',                 'Hamburg',            'Germany',         '2026-06-07'),
    ('IRONMAN Cairns',                  'Cairns',             'Australia',       '2026-06-14'),
    ('IRONMAN Kärnten-Klagenfurt',      'Klagenfurt',         'Austria',         '2026-06-14'),
    ('IRONMAN Frankfurt',               'Frankfurt',          'Germany',         '2026-06-28'),
    ('IRONMAN Switzerland Thun',        'Thun',               'Switzerland',     '2026-07-05'),
    ('IRONMAN Lake Placid',             'Lake Placid',        'USA',             '2026-07-19'),
    ('IRONMAN Kalmar',                  'Kalmar',             'Sweden',          '2026-08-15');
END

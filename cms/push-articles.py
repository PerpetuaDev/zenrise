#!/usr/bin/env python3
"""Assemble the four news articles from extracted copy + uploaded media and PUT them to microCMS."""
import json, os, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
copy = json.load(open(os.path.join(here, 'copy.json')))
media = json.load(open(os.path.join(here, 'media-map.json')))
en, ja = copy['en'], copy['ja']

key = os.environ['MICROCMS_API_KEY']

VIATOR = {
    'kamakura-enoshima': 'https://www.viator.com/tours/Kamakura/Kamakura-and-Enoshima-One-Day-Bus-Tour/d26734-85581P18?pid=P00302676&uid=U00819549&mcid=58086&currency=JPY',
    'sumo-shinjuku': 'https://www.viator.com/tours/Tokyo/Tokyo-Shinjuku-Sumo-Show-Experience-with-Photo-and-Drinks/d334-5610033P1?pid=P00302676&uid=U00819549&mcid=58086&currency=JPY',
    'fuji-hakone': 'https://www.viator.com/tours/Tokyo/Mt-Fuji-and-Hakone-1-Day-Bus-Tour-return-by-Bullet-Train-Shinkansen/d334-28575P41?pid=P00302676&uid=U00819549&mcid=58086&currency=JPY',
    'tokyo-private': 'https://www.viator.com/tours/Tokyo/Tokyo-Private-Custom-Full-Day-Walking-Tour/d334-21490P2?pid=P00302676&uid=U00819549&mcid=58086&currency=JPY',
}

# n = art{n}/news_a{n} key index; sections list = (s-key, media name or None); closing = key prefix
ARTICLES = [
    dict(id='kamakura-enoshima', n=1, date='2026-07-17', hero='kamakura-enoshima-hero-enoden-dusk',
         sections=[('s1', 'kamakura-enoshima-daibutsu'), ('s2', 'kamakura-enoshima-hasedera'),
                   ('s3', 'kamakura-enoshima-enoden-crossing')], closing='s4'),
    dict(id='sumo-shinjuku', n=2, date='2026-07-10', hero='sumo-hero-ukiyoe',
         sections=[('s1', 'sumo-bout'), ('s2', None), ('s3', None)], closing='wh'),
    dict(id='fuji-hakone', n=3, date='2026-07-03', hero='fuji-hakone-hero-sunset',
         sections=[('s1', 'fuji-hakone-peak-detail'), ('s2', 'fuji-hakone-lake-ashi'),
                   ('s3', 'fuji-hakone-ropeway'), ('s4', 'fuji-hakone-shinkansen')], closing='wh'),
    dict(id='tokyo-private', n=4, date='2026-06-26', hero='tokyo-hero-meijijingu',
         sections=[('s1', 'tokyo-sensoji'), ('s2', 'tokyo-ochanomizu'), ('s3', 'tokyo-shibuya-bluehour')], closing='wh'),
]

def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')

def body_html(d, a):
    parts = []
    for skey, img in a['sections']:
        pre = f"art{a['n']}_{skey}"
        parts.append(f"<h2>{esc(d[pre + '_h'])}</h2>")
        if img:
            cap = d.get(pre + '_cap', '')
            parts.append(f'<img src="{media[img]}" alt="{esc(cap)}">')
        parts.append(f"<p>{esc(d[pre + '_p'])}</p>")
    return ''.join(parts)

def first_sentence(s, lang):
    if lang == 'ja':
        return s.split('。')[0] + '。'
    head = s.split('. ')[0]
    return head if head.endswith('.') else head + '.'

results = []
for a in ARTICLES:
    n = a['n']
    excerpt_en = en.get(f'news_a{n}_excerpt') or first_sentence(en[f'art{n}_lead'], 'en')
    excerpt_ja = ja.get(f'news_a{n}_excerpt') or first_sentence(ja[f'art{n}_lead'], 'ja')
    c = a['closing']
    payload = {
        'date': a['date'] + 'T00:00:00.000Z',
        'titleJa': ja[f'news_a{n}_title'], 'titleEn': en[f'news_a{n}_title'],
        'subtitleJa': ja[f'news_a{n}_subtitle'], 'subtitleEn': en[f'news_a{n}_subtitle'],
        'excerptJa': excerpt_ja, 'excerptEn': excerpt_en,
        'hero': media[a['hero']],
        'leadJa': ja[f'art{n}_lead'], 'leadEn': en[f'art{n}_lead'],
        'bodyJa': body_html(ja, a), 'bodyEn': body_html(en, a),
        'closingHeadingJa': ja[f'art{n}_{c}_h'], 'closingHeadingEn': en[f'art{n}_{c}_h'],
        'closingBodyJa': ja[f'art{n}_{c}_p'], 'closingBodyEn': en[f'art{n}_{c}_p'],
        'viatorUrl': VIATOR[a['id']],
        'noteJa': ja[f'art{n}_note'], 'noteEn': en[f'art{n}_note'],
        'outroJa': ja[f'art{n}_outro'], 'outroEn': en[f'art{n}_outro'],
    }
    r = subprocess.run(['/usr/bin/curl', '-s', '-m', '30', '-X', 'PUT',
                        '-H', f'X-MICROCMS-API-KEY: {key}',
                        '-H', 'Content-Type: application/json',
                        '-d', json.dumps(payload, ensure_ascii=False),
                        f"https://zenrise.microcms.io/api/v1/news/{a['id']}"],
                       capture_output=True, text=True)
    print(a['id'], '->', r.stdout.strip()[:200])
    results.append(r.stdout)

ok = sum(1 for r in results if '"id"' in r)
print(f'{ok}/4 succeeded')
sys.exit(0 if ok == 4 else 1)

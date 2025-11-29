#!/usr/bin/env python3
"""
Convert truck batteries JSON to TypeScript format and merge with existing products
"""

import json
import re
import os

# Read truck batteries data
with open('/Users/zakaria/BATTERYCHADLIF/scraper/output/poids-lourd/trucks.json', 'r', encoding='utf-8') as f:
    trucks = json.load(f)

# Starting ID for trucks (after car batteries)
# Based on existing 192 products
START_ID = 200  # Give some buffer

def extract_brand(name):
    """Extract brand from product name"""
    name_upper = name.upper()
    
    if 'BOSCH' in name_upper:
        return 'BOSCH'
    elif 'VARTA' in name_upper:
        return 'VARTA'
    elif 'EXIDE' in name_upper:
        return 'EXIDE'
    elif 'OPTIMA' in name_upper:
        return 'OPTIMA'
    elif 'VTPOWER' in name_upper:
        return 'VTPOWER'
    elif 'DURACELL' in name_upper:
        return 'DURACELL'
    else:
        return 'GÉNÉRIQUE'

def extract_specs(name):
    """Extract voltage, capacity, and CCA from product name"""
    # Look for patterns like "12V 225 Ah 1150 A" or "225AH 1150 A"
    voltage = '12V'
    
    # Capacity
    cap_match = re.search(r'(\d+)\s*[aA][hH]', name)
    capacity = cap_match.group(1) if cap_match else ''
    
    # CCA (amperage)
    cca_match = re.search(r'(\d+)\s*[aA](?!\s*[hH])', name)
    cca = cca_match.group(1) if cca_match else ''
    
    if capacity and cca:
        return f"{voltage} {capacity}Ah {cca}A"
    elif capacity:
        return f"{voltage} {capacity}Ah"
    else:
        return voltage

def extract_technology(name):
    """Extract battery technology"""
    name_upper = name.upper()
    
    if 'AGM' in name_upper:
        return 'AGM'
    elif 'EFB' in name_upper:
        return 'EFB'
    elif 'POWER PRO' in name_upper or 'POWER F TECH' in name_upper:
        return 'Power F Tech'
    elif 'START PRO' in name_upper:
        return 'Start Pro'
    elif 'PRO MOTIVE' in name_upper:
        return 'Pro Motive'
    else:
        return 'Plomb Calcium'

def extract_battery_type(name):
    """Extract battery type (M14, M15, M16, etc.)"""
    name_upper = name.upper()
    
    if 'M16' in name_upper or 'D06' in name_upper:
        return 'M16 (D06)'
    elif 'M15' in name_upper or 'D05' in name_upper:
        return 'M15 (D05)'
    elif 'M14' in name_upper or 'D04' in name_upper:
        return 'M14 (D04)'
    else:
        return None

def parse_price(price_text):
    """Parse price from price_text like '7500dhs\n10740dhs'"""
    if not price_text:
        return None, None
    
    prices = []
    matches = re.findall(r'(\d+)dhs', price_text.lower())
    for match in matches:
        try:
            prices.append(int(match))
        except:
            pass
    
    if len(prices) >= 2:
        # First price is current, second is original
        return prices[0], prices[1]
    elif len(prices) == 1:
        return prices[0], int(prices[0] * 1.3)  # Add 30% markup as original
    return None, None

def get_local_image_filename(local_image_path):
    """Get just the filename from the local image path"""
    if local_image_path:
        return os.path.basename(local_image_path)
    return None

# Process trucks
truck_products = []
for idx, truck in enumerate(trucks):
    current_price, original_price = parse_price(truck['price_text'])
    
    # Skip products without prices (or set a default)
    if current_price is None:
        # Set a reasonable default for products without price
        current_price = 1500
        original_price = 2000
    
    discount = round((1 - current_price / original_price) * 100) if original_price > 0 else 0
    
    image_filename = get_local_image_filename(truck.get('local_image', ''))
    
    product = {
        'id': START_ID + idx,
        'name': truck['name'],
        'brand': extract_brand(truck['name']),
        'specs': extract_specs(truck['name']),
        'originalPrice': original_price,
        'discountedPrice': current_price,
        'category': 'poids-lourd',
        'inStock': True,
        'badge': None,
        'rating': round(4.0 + (idx % 10) * 0.05, 1),  # Random rating between 4.0-4.5
        'discount': discount,
        'technology': extract_technology(truck['name']),
        'batteryType': extract_battery_type(truck['name']),
        'image': f'/products/scraped/{image_filename}' if image_filename else None,
    }
    truck_products.append(product)

# Generate TypeScript code
print("\n// ================== TRUCK BATTERIES (POIDS LOURD) ==================")
print(f"// Total: {len(truck_products)} truck batteries\n")

for product in truck_products:
    name_escaped = product['name'].replace("'", "\\'").replace('"', '\\"')
    badge = f"'{product['badge']}'" if product['badge'] else 'null'
    battery_type = f"'{product['batteryType']}'" if product['batteryType'] else 'undefined'
    image = f"'{product['image']}'" if product['image'] else 'undefined'
    
    print(f"""  {{
    id: {product['id']},
    name: "{name_escaped}",
    brand: "{product['brand']}",
    specs: "{product['specs']}",
    originalPrice: {product['originalPrice']},
    discountedPrice: {product['discountedPrice']},
    category: "poids-lourd",
    inStock: true,
    badge: {badge},
    rating: {product['rating']},
    discount: {product['discount']},
    technology: '{product['technology']}',
    batteryType: {battery_type},
    image: {image},
  }},""")

print(f"\n\n// Summary:")
print(f"// Total truck batteries: {len(truck_products)}")
print(f"// Brands: {set([p['brand'] for p in truck_products])}")
print(f"// Technologies: {set([p['technology'] for p in truck_products])}")
print(f"// Battery Types: {set([p['batteryType'] for p in truck_products if p['batteryType']])}")

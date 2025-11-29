#!/usr/bin/env python3
"""
Convert scraped battery data to products.ts format
"""

import json
import re
from pathlib import Path

# Read the clean JSON data
with open('output/batteries_clean.json', 'r', encoding='utf-8') as f:
    batteries = json.load(f)

def extract_brand(name):
    """Extract brand from product name"""
    name_upper = name.upper()
    brands = [
        'VARTA', 'EXIDE', 'BOSCH', 'TUDOR', 'FULMEN', 'DURACELL', 
        'OPTIMA', 'FIAMM', 'FREEBATT', 'AD', 'YUASA', 'ELECTRA',
        'ODYSSEY', 'BANNER', 'MOTRIO', 'MOLL'
    ]
    for brand in brands:
        if brand in name_upper:
            return brand
    return 'AUTRE'

def extract_technology(name):
    """Extract technology from product name"""
    name_upper = name.upper()
    if 'AGM' in name_upper:
        return 'AGM'
    elif 'EFB' in name_upper:
        return 'EFB'
    elif 'GEL' in name_upper:
        return 'GEL'
    elif 'LITHIUM' in name_upper:
        return 'Lithium'
    else:
        return 'Plomb-Calcium'

def extract_battery_type(name):
    """Extract battery type (L1-L6) from product name"""
    name_upper = name.upper()
    # Look for L1-L6 pattern
    match = re.search(r'\bL([1-6])\b', name_upper)
    if match:
        return f'L{match.group(1)}'
    # Look for M10-M16 pattern for Asian batteries
    match = re.search(r'\bM(\d{2})\b', name_upper)
    if match:
        return f'M{match.group(1)}'
    # Look for D31 pattern
    if 'D31' in name_upper:
        return 'M11'
    return None

def extract_specs(name):
    """Extract specs (capacity and CCA) from name"""
    # Look for Ah (capacity)
    ah_match = re.search(r'(\d+)\s*[Aa][Hh]', name)
    capacity = ah_match.group(1) if ah_match else '70'
    
    # Look for A (CCA) - usually after Ah
    a_match = re.search(r'(\d{3,4})\s*[Aa](?:\s|$|,)', name)
    cca = a_match.group(1) if a_match else '600'
    
    return f"12V {capacity}Ah {cca}A"

def get_category(name):
    """Determine category from name"""
    name_upper = name.upper()
    if 'POIDS LOURD' in name_upper or 'CAMION' in name_upper or 'TRUCK' in name_upper:
        return 'poids-lourd'
    elif 'MOTO' in name_upper or 'SCOOTER' in name_upper:
        return 'moto'
    elif 'SOLAIRE' in name_upper or 'SOLAR' in name_upper or 'CYCLIQUE' in name_upper:
        return 'solaire'
    elif 'MARINE' in name_upper or 'BATEAU' in name_upper:
        return 'marine'
    else:
        return 'voiture'

def calculate_original_price(price):
    """Calculate original price (add ~40% markup for display)"""
    return int(price * 1.4)

def get_badge(index, price, technology):
    """Assign badges to products"""
    if index < 5:
        return 'Best-seller'
    elif technology == 'AGM':
        return 'Premium'
    elif price < 800:
        return 'Économique'
    elif index % 7 == 0:
        return 'Nouveau'
    return None

def get_local_image_path(local_image):
    """Convert absolute path to relative path for web"""
    if local_image:
        # Extract filename from path
        filename = Path(local_image).name
        return f'/products/scraped/{filename}'
    return None

# Process batteries
products = []
for i, battery in enumerate(batteries):
    if battery.get('price') is None:
        continue
    
    brand = extract_brand(battery['name'])
    technology = extract_technology(battery['name'])
    battery_type = extract_battery_type(battery['name'])
    category = get_category(battery['name'])
    discounted_price = int(battery['price'])
    original_price = calculate_original_price(discounted_price)
    discount = int(((original_price - discounted_price) / original_price) * 100)
    
    # Get local image path
    local_image = battery.get('local_image')
    image_path = get_local_image_path(local_image) if local_image else battery.get('image_url')
    
    product = {
        'id': i + 1,
        'name': battery['name'],
        'brand': brand,
        'specs': extract_specs(battery['name']),
        'originalPrice': original_price,
        'discountedPrice': discounted_price,
        'category': category,
        'inStock': True,
        'badge': get_badge(i, discounted_price, technology),
        'rating': round(4.2 + (i % 8) * 0.1, 1),
        'discount': discount,
        'technology': technology,
        'batteryType': battery_type,
        'image': image_path,
    }
    products.append(product)

# Generate TypeScript output
ts_output = '''// Battery products data - Auto-generated from batteryshop.ma scrape
// Total: {} products

export interface Product {{
  id: number;
  name: string;
  brand: string;
  specs: string;
  originalPrice: number;
  discountedPrice: number;
  category: 'voiture' | 'poids-lourd' | 'moto' | 'solaire' | 'marine';
  inStock: boolean;
  badge?: string | null;
  rating: number;
  discount: number;
  technology?: string;
  batteryType?: string;
  image?: string;
}}

export const products: Product[] = [
'''.format(len(products))

for product in products:
    badge_str = f"'{product['badge']}'" if product['badge'] else 'null'
    tech_str = f"'{product['technology']}'" if product['technology'] else 'undefined'
    type_str = f"'{product['batteryType']}'" if product['batteryType'] else 'undefined'
    image_str = f"'{product['image']}'" if product['image'] else 'undefined'
    
    ts_output += f'''  {{
    id: {product['id']},
    name: "{product['name']}",
    brand: "{product['brand']}",
    specs: "{product['specs']}",
    originalPrice: {product['originalPrice']},
    discountedPrice: {product['discountedPrice']},
    category: "{product['category']}",
    inStock: {str(product['inStock']).lower()},
    badge: {badge_str},
    rating: {product['rating']},
    discount: {product['discount']},
    technology: {tech_str},
    batteryType: {type_str},
    image: {image_str},
  }},
'''

ts_output += '''];

// Helper functions
export const getBestSellers = (): Product[] => {
  return products.filter(p => p.badge === 'Best-seller' || p.rating >= 4.8).slice(0, 8);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(p => p.category === category);
};

export const getBatteryImage = (brand: string, category: string): string => {
  const brandImages: Record<string, string> = {
    'VARTA': '/products/varta-default.jpg',
    'EXIDE': '/products/exide-default.jpg',
    'BOSCH': '/products/bosch-default.jpg',
    'TUDOR': '/products/tudor-default.jpg',
    'FULMEN': '/products/fulmen-default.jpg',
    'DURACELL': '/products/duracell-default.jpg',
    'OPTIMA': '/products/optima-default.jpg',
    'FIAMM': '/products/fiamm-default.jpg',
    'FREEBATT': '/products/freebatt-default.jpg',
  };
  return brandImages[brand] || '/products/battery-default.jpg';
};

// Brand logos mapping (for display)
export const brandLogos: Record<string, string> = {
  'VARTA': '🔋',
  'EXIDE': '⚡',
  'BOSCH': '🔧',
  'TUDOR': '🏆',
  'FULMEN': '💪',
  'DURACELL': '🐰',
  'ODYSSEY': '🚀',
  'OPTIMA': '🔴',
  'FIAMM': '🇮🇹',
  'FREEBATT': '🆓',
  'AD': '🅰️',
  'YUASA': '🇯🇵',
};

// Filter helper functions
export const getFilterCounts = (products: Product[]) => {
  const brandCounts: Record<string, number> = {};
  const techCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  
  products.forEach(p => {
    // Brand counts
    brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    
    // Technology counts
    if (p.technology) {
      techCounts[p.technology] = (techCounts[p.technology] || 0) + 1;
    }
    
    // Battery type counts
    if (p.batteryType) {
      typeCounts[p.batteryType] = (typeCounts[p.batteryType] || 0) + 1;
    }
  });
  
  return {
    brands: Object.entries(brandCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    technologies: Object.entries(techCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    batteryTypes: Object.entries(typeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
  };
};

export const getPriceRange = (products: Product[]): [number, number] => {
  if (products.length === 0) return [0, 10000];
  const prices = products.map(p => p.discountedPrice);
  return [Math.min(...prices), Math.max(...prices)];
};

export const filterProducts = (
  products: Product[],
  filters: {
    brands: string[];
    technologies: string[];
    batteryTypes: string[];
    priceRange: [number, number];
  }
): Product[] => {
  return products.filter(product => {
    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    
    // Technology filter
    if (filters.technologies.length > 0 && 
        (!product.technology || !filters.technologies.includes(product.technology))) {
      return false;
    }
    
    // Battery type filter
    if (filters.batteryTypes.length > 0 && 
        (!product.batteryType || !filters.batteryTypes.includes(product.batteryType))) {
      return false;
    }
    
    // Price range filter
    if (product.discountedPrice < filters.priceRange[0] || 
        product.discountedPrice > filters.priceRange[1]) {
      return false;
    }
    
    return true;
  });
};
'''

# Write to file
output_path = Path('../src/data/products.ts')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(ts_output)

print(f"✅ Generated {len(products)} products")
print(f"📁 Output: {output_path.absolute()}")

# Print statistics
brands = {}
techs = {}
categories = {}
for p in products:
    brands[p['brand']] = brands.get(p['brand'], 0) + 1
    techs[p['technology']] = techs.get(p['technology'], 0) + 1
    categories[p['category']] = categories.get(p['category'], 0) + 1

print("\n📊 Brand breakdown:")
for brand, count in sorted(brands.items(), key=lambda x: -x[1]):
    print(f"  {brand}: {count}")

print("\n🔬 Technology breakdown:")
for tech, count in sorted(techs.items(), key=lambda x: -x[1]):
    print(f"  {tech}: {count}")

print("\n📂 Category breakdown:")
for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
    print(f"  {cat}: {count}")

print(f"\n💰 Price range: {min(p['discountedPrice'] for p in products)} - {max(p['discountedPrice'] for p in products)} DH")

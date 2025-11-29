#!/usr/bin/env python3
"""
Battery Shop MA Scraper
Scrapes all battery products from batteryshop.ma
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import time
import re
from urllib.parse import urljoin

# Configuration
BASE_URL = "https://batteryshop.ma/categorie-produit/batteries-voitures/"
OUTPUT_DIR = "/Users/zakaria/BATTERYCHADLIF/scraper/output"
IMAGES_DIR = "/Users/zakaria/BATTERYCHADLIF/scraper/output/images"
TOTAL_PAGES = 19

# Headers to mimic browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
}

def create_dirs():
    """Create output directories"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(IMAGES_DIR, exist_ok=True)

def get_page_url(page_num):
    """Get URL for a specific page"""
    if page_num == 1:
        return BASE_URL
    return f"{BASE_URL}page/{page_num}/"

def download_image(url, filename):
    """Download an image and save it"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        if response.status_code == 200:
            filepath = os.path.join(IMAGES_DIR, filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return filepath
    except Exception as e:
        print(f"  Error downloading image: {e}")
    return None

def clean_price(price_text):
    """Extract numeric price from text"""
    if not price_text:
        return None
    # Remove currency and whitespace, extract number
    price = re.sub(r'[^\d.,]', '', price_text)
    price = price.replace(',', '.')
    try:
        return float(price)
    except:
        return price_text.strip()

def scrape_page(page_num):
    """Scrape a single page and return product list"""
    url = get_page_url(page_num)
    print(f"\n📄 Scraping page {page_num}/{TOTAL_PAGES}: {url}")
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"  ❌ Error fetching page: {e}")
        return []
    
    soup = BeautifulSoup(response.text, 'html.parser')
    products = []
    
    # Find all product items - WooCommerce typically uses these classes
    product_elements = soup.select('li.product, .product-item, .products .product')
    
    if not product_elements:
        # Try alternative selectors
        product_elements = soup.select('.woocommerce-loop-product__link, .product-inner')
    
    print(f"  Found {len(product_elements)} products on page {page_num}")
    
    for idx, product in enumerate(product_elements):
        try:
            # Extract product name
            name_elem = product.select_one('.woocommerce-loop-product__title, .product-title, h2, h3, .title')
            name = name_elem.get_text(strip=True) if name_elem else "Unknown"
            
            # Extract price
            price_elem = product.select_one('.price, .woocommerce-Price-amount, .amount')
            price_text = price_elem.get_text(strip=True) if price_elem else None
            price = clean_price(price_text)
            
            # Extract image URL
            img_elem = product.select_one('img')
            image_url = None
            if img_elem:
                # Try different image attributes
                image_url = img_elem.get('data-src') or img_elem.get('src') or img_elem.get('data-lazy-src')
            
            # Extract product link
            link_elem = product.select_one('a')
            product_url = link_elem.get('href') if link_elem else None
            
            product_data = {
                'name': name,
                'price': price,
                'price_text': price_text,
                'image_url': image_url,
                'product_url': product_url,
                'page': page_num
            }
            
            products.append(product_data)
            print(f"    ✓ {name[:50]}... - {price_text}")
            
        except Exception as e:
            print(f"  ⚠️ Error parsing product {idx}: {e}")
    
    return products

def scrape_all_pages():
    """Scrape all pages and collect products"""
    all_products = []
    
    for page_num in range(1, TOTAL_PAGES + 1):
        products = scrape_page(page_num)
        all_products.extend(products)
        
        # Be polite - wait between requests
        if page_num < TOTAL_PAGES:
            time.sleep(1)
    
    return all_products

def download_all_images(products):
    """Download all product images"""
    print("\n📷 Downloading images...")
    
    for idx, product in enumerate(products):
        if product.get('image_url'):
            # Create safe filename
            safe_name = re.sub(r'[^\w\s-]', '', product['name'])[:50]
            safe_name = re.sub(r'\s+', '_', safe_name)
            ext = product['image_url'].split('.')[-1].split('?')[0][:4]
            filename = f"{idx+1:03d}_{safe_name}.{ext}"
            
            print(f"  Downloading {idx+1}/{len(products)}: {filename}")
            filepath = download_image(product['image_url'], filename)
            product['local_image'] = filepath
            
            time.sleep(0.5)  # Be polite
    
    return products

def save_results(products):
    """Save results to JSON and CSV"""
    # Save JSON
    json_path = os.path.join(OUTPUT_DIR, 'batteries.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print(f"\n💾 Saved JSON: {json_path}")
    
    # Save CSV
    csv_path = os.path.join(OUTPUT_DIR, 'batteries.csv')
    with open(csv_path, 'w', encoding='utf-8') as f:
        f.write("Name,Price,Price Text,Image URL,Product URL,Page\n")
        for p in products:
            name = p['name'].replace('"', '""')
            f.write(f'"{name}",{p.get("price", "")},"{p.get("price_text", "")}","{p.get("image_url", "")}","{p.get("product_url", "")}",{p.get("page", "")}\n')
    print(f"💾 Saved CSV: {csv_path}")
    
    # Save summary
    summary_path = os.path.join(OUTPUT_DIR, 'summary.txt')
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write(f"Battery Shop MA Scraper Results\n")
        f.write(f"{'='*50}\n\n")
        f.write(f"Total products scraped: {len(products)}\n")
        f.write(f"Pages scraped: {TOTAL_PAGES}\n\n")
        f.write(f"Products:\n")
        f.write(f"{'-'*50}\n")
        for idx, p in enumerate(products, 1):
            f.write(f"{idx}. {p['name']}\n")
            f.write(f"   Price: {p.get('price_text', 'N/A')}\n")
            f.write(f"   Image: {p.get('image_url', 'N/A')}\n\n")
    print(f"💾 Saved Summary: {summary_path}")

def main():
    print("🔋 Battery Shop MA Scraper")
    print("="*50)
    
    create_dirs()
    
    # Scrape all pages
    products = scrape_all_pages()
    
    print(f"\n✅ Total products found: {len(products)}")
    
    if products:
        # Download images
        download_images = input("\nDownload all images? (y/n): ").lower().strip() == 'y'
        if download_images:
            products = download_all_images(products)
        
        # Save results
        save_results(products)
    
    print("\n🎉 Done!")

if __name__ == "__main__":
    main()

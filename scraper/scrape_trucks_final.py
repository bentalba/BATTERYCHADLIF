#!/usr/bin/env python3
"""
Battery Shop MA - Truck Batteries Scraper
Uses the same approach that worked for car batteries
"""

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import os
import re
import time
import requests

# Configuration
BASE_URL = "https://batteryshop.ma/categorie-produit/batteries-poids-lourd/"
OUTPUT_DIR = "/Users/zakaria/BATTERYCHADLIF/scraper/output/poids-lourd"
IMAGES_DIR = "/Users/zakaria/BATTERYCHADLIF/scraper/output/poids-lourd/images"
TOTAL_PAGES = 2  # Only 2 pages for trucks

def create_dirs():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(IMAGES_DIR, exist_ok=True)

def get_page_url(page_num):
    if page_num == 1:
        return BASE_URL
    return f"{BASE_URL}page/{page_num}/"

def clean_price(price_text):
    if not price_text:
        return None
    price = re.sub(r'[^\d.,]', '', price_text)
    price = price.replace(',', '.')
    parts = price.split('.')
    if len(parts) > 2:
        price = ''.join(parts[:-1]) + '.' + parts[-1]
    try:
        return float(price)
    except:
        return None

def scrape_page(driver, page_num):
    url = get_page_url(page_num)
    print(f"\n📄 Page {page_num}/{TOTAL_PAGES}: {url}")
    
    driver.get(url)
    time.sleep(4)  # Wait for page to load
    
    products = []
    
    try:
        # Wait for products
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "li.product, .product-item"))
        )
        
        # Get all product elements
        product_elements = driver.find_elements(By.CSS_SELECTOR, "li.product, .product-item")
        print(f"  Found {len(product_elements)} product elements")
        
        for elem in product_elements:
            try:
                # Get name
                try:
                    name_elem = elem.find_element(By.CSS_SELECTOR, ".woocommerce-loop-product__title, h2, h3, .product-title")
                    name = name_elem.text.strip()
                except:
                    name = ""
                
                # Get price
                try:
                    price_elem = elem.find_element(By.CSS_SELECTOR, ".price")
                    price_text = price_elem.text.strip()
                except:
                    price_text = ""
                
                # Get image
                try:
                    img_elem = elem.find_element(By.CSS_SELECTOR, "img")
                    image_url = img_elem.get_attribute("data-src") or img_elem.get_attribute("src") or ""
                except:
                    image_url = ""
                
                # Get link
                try:
                    link_elem = elem.find_element(By.CSS_SELECTOR, "a")
                    product_url = link_elem.get_attribute("href") or ""
                except:
                    product_url = ""
                
                if name:
                    products.append({
                        'name': name,
                        'price_text': price_text,
                        'price': clean_price(price_text),
                        'image_url': image_url,
                        'product_url': product_url,
                        'page': page_num,
                        'category': 'poids-lourd'
                    })
                    print(f"  ✓ {name[:50]}... - {price_text}")
                    
            except Exception as e:
                print(f"  ⚠️ Error parsing product: {e}")
                
    except Exception as e:
        print(f"  ❌ Error loading page: {e}")
    
    return products

def download_images(products):
    print("\n📷 Downloading images...")
    
    for idx, product in enumerate(products):
        if product.get('image_url') and product['image_url'].startswith('http'):
            try:
                safe_name = re.sub(r'[^\w\s-]', '', product['name'])[:50]
                safe_name = re.sub(r'\s+', '_', safe_name)
                ext = product['image_url'].split('.')[-1].split('?')[0][:4]
                if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                    ext = 'jpg'
                filename = f"truck_{idx+1:03d}_{safe_name}.{ext}"
                filepath = os.path.join(IMAGES_DIR, filename)
                
                response = requests.get(product['image_url'], timeout=30)
                if response.status_code == 200:
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    product['local_image'] = filepath
                    print(f"  ✓ {idx+1}/{len(products)}: {filename}")
                
                time.sleep(0.2)
            except Exception as e:
                print(f"  ✗ {idx+1}: Error - {e}")
    
    return products

def save_results(products):
    # JSON
    json_path = os.path.join(OUTPUT_DIR, 'trucks.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print(f"\n💾 JSON: {json_path}")
    
    # CSV
    csv_path = os.path.join(OUTPUT_DIR, 'trucks.csv')
    with open(csv_path, 'w', encoding='utf-8') as f:
        f.write("Index,Name,Price (MAD),Price Text,Image URL,Product URL,Page\n")
        for idx, p in enumerate(products, 1):
            name = p['name'].replace('"', '""')
            f.write(f'{idx},"{name}",{p.get("price", "")},"{p.get("price_text", "")}","{p.get("image_url", "")}","{p.get("product_url", "")}",{p.get("page", "")}\n')
    print(f"💾 CSV: {csv_path}")
    
    print(f"\n📊 Total: {len(products)} truck batteries")

def main():
    print("🚛 Battery Shop MA - Truck Batteries Scraper")
    print("="*50)
    
    create_dirs()
    
    # Setup Chrome options - same as working car scraper
    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    print("\n🚀 Launching Chrome (visible mode)...")
    driver = uc.Chrome(options=options, headless=False)  # Visible browser
    
    all_products = []
    
    try:
        # First visit to handle Cloudflare
        print("\n⏳ Handling Cloudflare challenge...")
        driver.get(BASE_URL)
        print("⚠️  If you see Cloudflare challenge, please wait for it to complete...")
        time.sleep(10)  # Wait for Cloudflare
        
        # Check if we passed Cloudflare
        page_source = driver.page_source
        if "Just a moment" in page_source or "Checking your browser" in page_source:
            print("⚠️  Cloudflare challenge detected. Waiting longer...")
            time.sleep(15)
        
        # Scrape all pages
        for page_num in range(1, TOTAL_PAGES + 1):
            products = scrape_page(driver, page_num)
            all_products.extend(products)
            time.sleep(2)
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        driver.quit()
    
    print(f"\n✅ Total products: {len(all_products)}")
    
    if all_products:
        download_images(all_products)
        save_results(all_products)
    else:
        print("❌ No products found. Cloudflare may be blocking.")
    
    print("\n🎉 Done!")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Scrape images for truck and marine batteries
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
from urllib.parse import urlparse

# Configuration
TRUCK_URL = "https://batteryshop.ma/categorie-produit/batteries-poids-lourd/"
MARINE_URL = "https://batteryshop.ma/categorie-produit/batteries-marines/"
OUTPUT_DIR = "/Users/zakaria/BATTERYCHADLIF/public/products/scraped"

def create_dirs():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def download_image(url, filepath):
    """Download image from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"  ❌ Failed to download: {e}")
    return False

def get_extension(url):
    """Get file extension from URL"""
    parsed = urlparse(url)
    path = parsed.path
    ext = os.path.splitext(path)[1].lower()
    if ext in ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']:
        return ext
    return '.jpg'

def sanitize_filename(name):
    """Clean filename"""
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'\s+', '_', name)
    return name[:50]

def scrape_category(driver, base_url, category_prefix, num_pages):
    """Scrape images from a category"""
    print(f"\n{'='*60}")
    print(f"📦 Scraping {category_prefix} batteries...")
    print(f"{'='*60}")
    
    all_products = []
    
    for page_num in range(1, num_pages + 1):
        if page_num == 1:
            url = base_url
        else:
            url = f"{base_url}page/{page_num}/"
        
        print(f"\n📄 Page {page_num}/{num_pages}: {url}")
        driver.get(url)
        time.sleep(4)
        
        try:
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "li.product, .product-item"))
            )
            
            product_elements = driver.find_elements(By.CSS_SELECTOR, "li.product, .product-item")
            print(f"  Found {len(product_elements)} products")
            
            for idx, element in enumerate(product_elements):
                try:
                    # Get product name
                    name = ""
                    try:
                        name_el = element.find_element(By.CSS_SELECTOR, ".woocommerce-loop-product__title, h2, .product-title")
                        name = name_el.text.strip()
                    except:
                        pass
                    
                    # Get image URL
                    image_url = None
                    try:
                        img = element.find_element(By.CSS_SELECTOR, "img.attachment-woocommerce_thumbnail, img.wp-post-image, .product-image img, img")
                        image_url = img.get_attribute("src") or img.get_attribute("data-src")
                        
                        # Try to get higher resolution
                        srcset = img.get_attribute("srcset")
                        if srcset:
                            urls = srcset.split(",")
                            for u in reversed(urls):
                                parts = u.strip().split(" ")
                                if len(parts) >= 1:
                                    image_url = parts[0]
                                    break
                    except:
                        pass
                    
                    if image_url and name:
                        all_products.append({
                            "name": name,
                            "image_url": image_url,
                            "category": category_prefix
                        })
                        print(f"  ✓ {name[:40]}...")
                        
                except Exception as e:
                    print(f"  ⚠️ Error parsing product: {e}")
                    
        except Exception as e:
            print(f"  ❌ Error on page {page_num}: {e}")
    
    return all_products

def main():
    create_dirs()
    
    print("🚀 Starting image scraper...")
    
    # Setup Chrome
    options = uc.ChromeOptions()
    options.add_argument("--window-size=1920,1080")
    
    driver = uc.Chrome(options=options)
    
    try:
        # Scrape truck batteries (2 pages)
        truck_products = scrape_category(driver, TRUCK_URL, "truck", 2)
        
        # Scrape marine batteries (2 pages)
        marine_products = scrape_category(driver, MARINE_URL, "marine", 2)
        
        all_products = truck_products + marine_products
        
        print(f"\n{'='*60}")
        print(f"📥 Downloading {len(all_products)} images...")
        print(f"{'='*60}")
        
        downloaded = 0
        for idx, product in enumerate(all_products):
            category = product["category"]
            name = sanitize_filename(product["name"])
            ext = get_extension(product["image_url"])
            
            filename = f"{category}_{idx+1:03d}_{name}{ext}"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            if os.path.exists(filepath):
                print(f"  ⏭️ Already exists: {filename}")
                downloaded += 1
                continue
            
            print(f"  📥 Downloading: {filename}")
            if download_image(product["image_url"], filepath):
                downloaded += 1
                product["local_image"] = filename
        
        # Save mapping for reference
        mapping_file = os.path.join(OUTPUT_DIR, "image_mapping.json")
        with open(mapping_file, "w", encoding="utf-8") as f:
            json.dump(all_products, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Done! Downloaded {downloaded}/{len(all_products)} images")
        print(f"📁 Images saved to: {OUTPUT_DIR}")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    main()

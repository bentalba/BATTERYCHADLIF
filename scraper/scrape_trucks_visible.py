#!/usr/bin/env python3
"""
Scrape truck batteries (poids-lourd) from batteryshop.ma
Using visible browser to bypass Cloudflare Turnstile
"""

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
import re
import requests
from pathlib import Path

# Setup output directory
output_dir = Path('output/poids-lourd')
output_dir.mkdir(parents=True, exist_ok=True)
images_dir = output_dir / 'images'
images_dir.mkdir(exist_ok=True)

def setup_driver():
    """Setup undetected Chrome driver - VISIBLE mode to bypass Cloudflare"""
    options = uc.ChromeOptions()
    # NO headless - visible browser to pass Cloudflare
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-blink-features=AutomationControlled')
    
    driver = uc.Chrome(options=options)
    driver.set_page_load_timeout(60)
    return driver

def extract_price(price_text):
    """Extract numeric price from text like '3600dhs' or '3600dhs\\n5142dhs'"""
    if not price_text:
        return None
    # Get the first price (discounted price)
    match = re.search(r'(\d+(?:[.,]\d+)?)\s*(?:dhs|DHS|Dhs)', price_text)
    if match:
        return float(match.group(1).replace(',', '.'))
    return None

def wait_for_cloudflare(driver, timeout=30):
    """Wait for Cloudflare challenge to complete"""
    print("   ⏳ Waiting for Cloudflare challenge...")
    start = time.time()
    while time.time() - start < timeout:
        try:
            # Check if we're past the challenge
            if "Just a moment" not in driver.page_source and "challenge" not in driver.current_url:
                # Check if products are visible
                if driver.find_elements(By.CSS_SELECTOR, ".products .product, ul.products li.product"):
                    print("   ✓ Cloudflare challenge passed")
                    return True
        except:
            pass
        time.sleep(1)
    return False

def scrape_page(driver, url, page_num):
    """Scrape products from a single page"""
    print(f"\n📄 Scraping page {page_num}: {url}")
    
    try:
        driver.get(url)
        
        # Wait for Cloudflare to pass
        if not wait_for_cloudflare(driver, timeout=45):
            print("   ⚠️ Cloudflare challenge timeout, trying anyway...")
        
        time.sleep(3)  # Extra wait
        
        # Wait for products to load
        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".products .product, ul.products li.product"))
            )
        except:
            print("   ⚠️ Products not found with WebDriverWait")
        
        # Try different selectors
        product_elements = driver.find_elements(By.CSS_SELECTOR, "ul.products li.product")
        if not product_elements:
            product_elements = driver.find_elements(By.CSS_SELECTOR, ".products .product")
        if not product_elements:
            product_elements = driver.find_elements(By.CSS_SELECTOR, ".product-grid .product")
        
        print(f"   Found {len(product_elements)} products")
        
        products = []
        for elem in product_elements:
            try:
                # Extract product name - try multiple selectors
                name = ""
                for selector in [".woocommerce-loop-product__title", "h2.woocommerce-loop-product__title", ".product-title", "h2", ".title"]:
                    try:
                        name_elem = elem.find_element(By.CSS_SELECTOR, selector)
                        name = name_elem.text.strip()
                        if name:
                            break
                    except:
                        continue
                
                if not name:
                    continue
                
                # Extract price
                price_text = ""
                for selector in [".price", ".woocommerce-Price-amount", ".amount"]:
                    try:
                        price_elem = elem.find_element(By.CSS_SELECTOR, selector)
                        price_text = price_elem.text.strip()
                        if price_text:
                            break
                    except:
                        continue
                
                # Extract image URL
                image_url = ""
                try:
                    img_elem = elem.find_element(By.CSS_SELECTOR, "img")
                    image_url = img_elem.get_attribute("src") or img_elem.get_attribute("data-src") or img_elem.get_attribute("data-lazy-src")
                except:
                    pass
                
                # Extract product URL
                product_url = ""
                try:
                    link_elem = elem.find_element(By.CSS_SELECTOR, "a")
                    product_url = link_elem.get_attribute("href")
                except:
                    pass
                
                price = extract_price(price_text)
                
                product = {
                    'name': name,
                    'price_text': price_text,
                    'price': price,
                    'image_url': image_url,
                    'product_url': product_url,
                    'page': page_num,
                }
                
                products.append(product)
                print(f"   ✓ {name[:50]}... - {price} DH")
                
            except Exception as e:
                print(f"   ⚠ Error parsing product: {e}")
                continue
        
        return products
        
    except Exception as e:
        print(f"   ❌ Error on page {page_num}: {e}")
        # Try to save page source for debugging
        try:
            with open(output_dir / f'debug_page_{page_num}.html', 'w') as f:
                f.write(driver.page_source)
            print(f"   💾 Saved debug page source")
        except:
            pass
        return []

def download_image(url, filepath):
    """Download image from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"   ⚠ Failed to download {url}: {e}")
    return False

def main():
    print("🚛 Scraping Truck Batteries (Poids-Lourd) from batteryshop.ma")
    print("=" * 60)
    print("⚠️  A browser window will open - DO NOT close it!")
    print("=" * 60)
    
    # URLs to scrape (2 pages)
    base_url = "https://batteryshop.ma/categorie-produit/batteries-poids-lourd/"
    urls = [
        (base_url, 1),
        (base_url + "page/2/", 2),
    ]
    
    driver = None
    all_products = []
    
    try:
        print("⏳ Initializing Chrome driver...")
        driver = setup_driver()
        print("✓ Chrome driver initialized (visible browser)")
        
        for url, page_num in urls:
            products = scrape_page(driver, url, page_num)
            all_products.extend(products)
            time.sleep(3)  # Be polite between pages
            
    except Exception as e:
        print(f"❌ Driver error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if driver:
            try:
                driver.quit()
            except:
                pass
    
    print(f"\n{'=' * 60}")
    print(f"📊 Total products scraped: {len(all_products)}")
    
    # Save raw JSON
    with open(output_dir / 'trucks_raw.json', 'w', encoding='utf-8') as f:
        json.dump(all_products, f, ensure_ascii=False, indent=2)
    print(f"💾 Saved raw data to {output_dir / 'trucks_raw.json'}")
    
    # Download images and create clean data
    if all_products:
        print(f"\n📷 Downloading images...")
        clean_products = []
        
        for i, product in enumerate(all_products, 1):
            # Create clean filename
            clean_name = re.sub(r'[^\w\s-]', '', product['name'])[:50].replace(' ', '_')
            filename = f"{i:03d}_{clean_name}"
            
            # Determine extension from URL
            ext = '.webp'
            if product['image_url']:
                if '.jpg' in product['image_url'].lower():
                    ext = '.jpg'
                elif '.png' in product['image_url'].lower():
                    ext = '.png'
            
            image_path = images_dir / f"{filename}{ext}"
            
            # Download image
            if product['image_url']:
                success = download_image(product['image_url'], image_path)
                if success:
                    product['local_image'] = str(image_path.absolute())
                    print(f"   ✓ Downloaded {filename}{ext}")
            
            # Add to clean products with price
            clean_product = {
                **product,
                'price_display': f"{int(product['price'])}dhs" if product['price'] else None,
            }
            clean_products.append(clean_product)
        
        # Save clean JSON
        with open(output_dir / 'trucks_clean.json', 'w', encoding='utf-8') as f:
            json.dump(clean_products, f, ensure_ascii=False, indent=2)
        print(f"💾 Saved clean data to {output_dir / 'trucks_clean.json'}")
        
        # Print statistics
        print(f"\n📊 Statistics:")
        print(f"   Total products: {len(all_products)}")
        priced = [p for p in clean_products if p['price']]
        print(f"   Products with prices: {len(priced)}")
        
        if priced:
            prices = [p['price'] for p in priced]
            print(f"   Price range: {min(prices):.0f} - {max(prices):.0f} DH")
            print(f"   Average price: {sum(prices)/len(prices):.0f} DH")
        
        # Brand breakdown
        brands = {}
        for p in all_products:
            name_upper = p['name'].upper()
            if 'VARTA' in name_upper:
                brand = 'VARTA'
            elif 'EXIDE' in name_upper:
                brand = 'EXIDE'
            elif 'TUDOR' in name_upper:
                brand = 'TUDOR'
            elif 'FULMEN' in name_upper:
                brand = 'FULMEN'
            elif 'BOSCH' in name_upper:
                brand = 'BOSCH'
            else:
                brand = 'AUTRE'
            brands[brand] = brands.get(brand, 0) + 1
        
        print(f"\n   Brand breakdown:")
        for brand, count in sorted(brands.items(), key=lambda x: -x[1]):
            print(f"      {brand}: {count}")
    else:
        print("\n⚠️ No products scraped. Check debug_page_*.html files for issues.")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Battery Shop MA Scraper with Playwright
Bypasses Cloudflare protection using headless browser
"""

import asyncio
import json
import os
import re
import time
from playwright.async_api import async_playwright

# Configuration
BASE_URL = "https://batteryshop.ma/categorie-produit/batteries-voitures/"
OUTPUT_DIR = "/Users/zakaria/BATTERYCHADLIF/scraper/output"
IMAGES_DIR = "/Users/zakaria/BATTERYCHADLIF/scraper/output/images"
TOTAL_PAGES = 19

def create_dirs():
    """Create output directories"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(IMAGES_DIR, exist_ok=True)

def get_page_url(page_num):
    """Get URL for a specific page"""
    if page_num == 1:
        return BASE_URL
    return f"{BASE_URL}page/{page_num}/"

def clean_price(price_text):
    """Extract numeric price from text"""
    if not price_text:
        return None
    # Remove currency and whitespace, extract number
    price = re.sub(r'[^\d.,]', '', price_text)
    price = price.replace(',', '.')
    # Handle multiple dots (thousand separator)
    parts = price.split('.')
    if len(parts) > 2:
        price = ''.join(parts[:-1]) + '.' + parts[-1]
    try:
        return float(price)
    except:
        return price_text.strip()

async def scrape_page(page, page_num):
    """Scrape a single page"""
    url = get_page_url(page_num)
    print(f"\n📄 Page {page_num}/{TOTAL_PAGES}: {url}")
    
    try:
        await page.goto(url, wait_until='networkidle', timeout=60000)
        # Wait for products to load
        await page.wait_for_selector('li.product, .product-item, .products .product', timeout=30000)
    except Exception as e:
        print(f"  ⚠️ Timeout or error: {e}")
        # Try to continue anyway
    
    # Extract products using JavaScript
    products = await page.evaluate('''() => {
        const products = [];
        const items = document.querySelectorAll('li.product, .product-item');
        
        items.forEach((item, idx) => {
            try {
                // Get name
                const nameEl = item.querySelector('.woocommerce-loop-product__title, .product-title, h2, h3, .title a, a.woocommerce-LoopProduct-link h2');
                const name = nameEl ? nameEl.innerText.trim() : '';
                
                // Get price - try multiple selectors
                let priceText = '';
                const priceEl = item.querySelector('.price ins .woocommerce-Price-amount, .price .woocommerce-Price-amount, .price');
                if (priceEl) {
                    priceText = priceEl.innerText.trim();
                }
                
                // Get image
                const imgEl = item.querySelector('img');
                let imageUrl = '';
                if (imgEl) {
                    imageUrl = imgEl.getAttribute('data-src') || imgEl.getAttribute('src') || imgEl.getAttribute('data-lazy-src') || '';
                }
                
                // Get product link
                const linkEl = item.querySelector('a');
                const productUrl = linkEl ? linkEl.href : '';
                
                if (name) {
                    products.push({
                        name: name,
                        price_text: priceText,
                        image_url: imageUrl,
                        product_url: productUrl
                    });
                }
            } catch (e) {
                console.error('Error parsing product:', e);
            }
        });
        
        return products;
    }''')
    
    # Add page number and clean price
    for p in products:
        p['page'] = page_num
        p['price'] = clean_price(p.get('price_text'))
        print(f"  ✓ {p['name'][:60]}... - {p.get('price_text', 'N/A')}")
    
    print(f"  Found {len(products)} products")
    return products

async def download_images(page, products):
    """Download all product images"""
    print("\n📷 Downloading images...")
    
    for idx, product in enumerate(products):
        if product.get('image_url') and product['image_url'].startswith('http'):
            try:
                # Create safe filename
                safe_name = re.sub(r'[^\w\s-]', '', product['name'])[:50]
                safe_name = re.sub(r'\s+', '_', safe_name)
                ext = product['image_url'].split('.')[-1].split('?')[0][:4]
                if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                    ext = 'jpg'
                filename = f"{idx+1:03d}_{safe_name}.{ext}"
                filepath = os.path.join(IMAGES_DIR, filename)
                
                # Download using Playwright
                response = await page.request.get(product['image_url'])
                if response.ok:
                    with open(filepath, 'wb') as f:
                        f.write(await response.body())
                    product['local_image'] = filepath
                    print(f"  ✓ {idx+1}/{len(products)}: {filename}")
                else:
                    print(f"  ✗ {idx+1}/{len(products)}: Failed ({response.status})")
                
                await asyncio.sleep(0.2)  # Be polite
            except Exception as e:
                print(f"  ✗ {idx+1}/{len(products)}: Error - {e}")
    
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
        f.write("Index,Name,Price (MAD),Price Text,Image URL,Product URL,Page\n")
        for idx, p in enumerate(products, 1):
            name = p['name'].replace('"', '""')
            f.write(f'{idx},"{name}",{p.get("price", "")},"{p.get("price_text", "")}","{p.get("image_url", "")}","{p.get("product_url", "")}",{p.get("page", "")}\n')
    print(f"💾 Saved CSV: {csv_path}")
    
    # Save TypeScript data for the website
    ts_path = os.path.join(OUTPUT_DIR, 'batteries_data.ts')
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write("// Auto-generated from batteryshop.ma scraper\n")
        f.write("export interface ScrapedBattery {\n")
        f.write("  id: number;\n")
        f.write("  name: string;\n")
        f.write("  price: number | null;\n")
        f.write("  priceText: string;\n")
        f.write("  imageUrl: string;\n")
        f.write("  productUrl: string;\n")
        f.write("  sourcePage: number;\n")
        f.write("}\n\n")
        f.write("export const scrapedBatteries: ScrapedBattery[] = [\n")
        for idx, p in enumerate(products, 1):
            name = p['name'].replace("'", "\\'").replace('"', '\\"')
            price_val = p.get('price') if p.get('price') else 'null'
            f.write(f"  {{\n")
            f.write(f"    id: {idx},\n")
            f.write(f'    name: "{name}",\n')
            f.write(f"    price: {price_val},\n")
            f.write(f'    priceText: "{p.get("price_text", "")}",\n')
            f.write(f'    imageUrl: "{p.get("image_url", "")}",\n')
            f.write(f'    productUrl: "{p.get("product_url", "")}",\n')
            f.write(f"    sourcePage: {p.get('page', 1)},\n")
            f.write(f"  }},\n")
        f.write("];\n")
    print(f"💾 Saved TypeScript: {ts_path}")
    
    # Print summary
    print(f"\n📊 Summary:")
    print(f"   Total products: {len(products)}")
    prices = [p['price'] for p in products if p.get('price')]
    if prices:
        print(f"   Price range: {min(prices):.2f} - {max(prices):.2f} MAD")
        print(f"   Average price: {sum(prices)/len(prices):.2f} MAD")

async def main():
    print("🔋 Battery Shop MA Scraper (Playwright)")
    print("="*50)
    
    create_dirs()
    all_products = []
    
    async with async_playwright() as p:
        # Launch browser
        print("\n🚀 Launching browser...")
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport={'width': 1920, 'height': 1080}
        )
        page = await context.new_page()
        
        # Wait for Cloudflare challenge on first page
        print("\n⏳ Waiting for Cloudflare challenge...")
        await page.goto(BASE_URL, wait_until='domcontentloaded')
        await asyncio.sleep(5)  # Wait for Cloudflare
        
        # Scrape all pages
        for page_num in range(1, TOTAL_PAGES + 1):
            try:
                products = await scrape_page(page, page_num)
                all_products.extend(products)
                await asyncio.sleep(1)  # Be polite between pages
            except Exception as e:
                print(f"  ❌ Error on page {page_num}: {e}")
        
        print(f"\n✅ Total products scraped: {len(all_products)}")
        
        # Download images
        if all_products:
            print("\n📷 Starting image downloads...")
            all_products = await download_images(page, all_products)
        
        await browser.close()
    
    # Save results
    if all_products:
        save_results(all_products)
    
    print("\n🎉 Scraping complete!")

if __name__ == "__main__":
    asyncio.run(main())

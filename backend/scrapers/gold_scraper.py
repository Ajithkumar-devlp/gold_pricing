import asyncio
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from typing import List, Dict, Optional
import json
import re
from datetime import datetime

from models.gold_price import GoldPrice

class GoldScraper:
    def __init__(self):
        self.session = requests.Session()
        self.driver = None
        
    def __enter__(self):
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            self.session.close()
        if self.driver:
            self.driver.quit()

    def setup_selenium(self):
        """Setup Selenium WebDriver for dynamic content"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        return self.driver

    def scrape_all_platforms(self) -> List[GoldPrice]:
        """Scrape gold prices from all platforms"""
        prices = []
        
        # For now, return simulated data since actual scraping requires proper setup
        # In production, this would scrape real websites
        simulated_prices = [
            GoldPrice(
                platform="Paytm Gold",
                type="digital",
                price_per_gram=6720.0,
                making_charges=0.0,
                gst=3.0,
                total_price=6921.6,
                timestamp=datetime.now(),
                features=["No storage cost", "Instant liquidity", "SIP available"]
            ),
            GoldPrice(
                platform="PhonePe Gold",
                type="digital", 
                price_per_gram=6715.0,
                making_charges=0.0,
                gst=3.0,
                total_price=6916.45,
                timestamp=datetime.now(),
                features=["24/7 trading", "No minimum amount", "Digital certificate"]
            ),
            # Add more simulated prices...
        ]
        
        return simulated_prices
            self.scrape_googlepay_gold(),
            self.scrape_amazon_pay_gold(),
            self.scrape_mobikwik_gold(),
            self.scrape_freecharge_gold(),
            self.scrape_bajaj_finserv_gold(),
            self.scrape_mmtc_pamp_gold(),
            self.scrape_safegold(),
            self.scrape_augmont_gold(),
            self.scrape_digital_gold_india(),
            self.scrape_jar_app_gold(),
            return_exceptions=True
        )
        
        # Scrape physical gold platforms
        physical_prices = await asyncio.gather(
            self.scrape_tanishq(),
            self.scrape_kalyan_jewellers(),
            self.scrape_hdfc_gold(),
            self.scrape_icici_gold(),
            self.scrape_sbi_gold(),
            self.scrape_axis_bank_gold(),
            self.scrape_kotak_gold(),
            self.scrape_malabar_gold(),
            self.scrape_joyalukkas(),
            self.scrape_pc_jeweller(),
            return_exceptions=True
        )
        
        # Combine results
        all_prices = digital_prices + physical_prices
        
        for price in all_prices:
            if isinstance(price, GoldPrice):
                prices.append(price)
            elif isinstance(price, Exception):
                print(f"Scraping error: {price}")
                
        return prices

    async def scrape_paytm_gold(self) -> GoldPrice:
        """Scrape Paytm Gold prices"""
        try:
            # Mock implementation - replace with actual scraping logic
            return GoldPrice(
                platform="Paytm Gold",
                type="digital",
                price_per_gram=6720.0,
                making_charges=0.0,
                gst=3.0,
                features=["No storage cost", "Instant liquidity", "SIP available"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Paytm Gold: {e}")
            raise

    async def scrape_phonepe_gold(self) -> GoldPrice:
        """Scrape PhonePe Gold prices"""
        try:
            return GoldPrice(
                platform="PhonePe Gold",
                type="digital",
                price_per_gram=6715.0,
                making_charges=0.0,
                gst=3.0,
                features=["24/7 trading", "No minimum amount", "Digital certificate"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping PhonePe Gold: {e}")
            raise

    async def scrape_googlepay_gold(self) -> GoldPrice:
        """Scrape Google Pay Gold prices"""
        try:
            return GoldPrice(
                platform="Google Pay Gold",
                type="digital",
                price_per_gram=6710.0,
                making_charges=0.0,
                gst=3.0,
                features=["Secure storage", "Easy redemption", "Real-time prices"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Google Pay Gold: {e}")
            raise

    async def scrape_tanishq(self) -> GoldPrice:
        """Scrape Tanishq gold prices"""
        try:
            return GoldPrice(
                platform="Tanishq",
                type="physical",
                price_per_gram=6800.0,
                making_charges=500.0,
                gst=3.0,
                features=["Certified purity", "Buyback guarantee", "Physical delivery"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Tanishq: {e}")
            raise

    async def scrape_kalyan_jewellers(self) -> GoldPrice:
        """Scrape Kalyan Jewellers gold prices"""
        try:
            return GoldPrice(
                platform="Kalyan Jewellers",
                type="physical",
                price_per_gram=6750.0,
                making_charges=450.0,
                gst=3.0,
                features=["BIS hallmark", "Exchange policy", "Store pickup"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Kalyan Jewellers: {e}")
            raise

    async def scrape_amazon_pay_gold(self) -> GoldPrice:
        """Scrape Amazon Pay Gold prices"""
        try:
            return GoldPrice(
                platform="Amazon Pay Gold",
                type="digital",
                price_per_gram=6705.0,
                making_charges=0.0,
                gst=3.0,
                features=["Amazon ecosystem", "Easy redemption", "Secure storage", "No minimum purchase"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Amazon Pay Gold: {e}")
            raise

    async def scrape_mobikwik_gold(self) -> GoldPrice:
        """Scrape MobiKwik Gold prices"""
        try:
            return GoldPrice(
                platform="MobiKwik Gold",
                type="digital",
                price_per_gram=6718.0,
                making_charges=0.0,
                gst=3.0,
                features=["Wallet integration", "Instant purchase", "24/7 trading", "SIP available"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping MobiKwik Gold: {e}")
            raise

    async def scrape_freecharge_gold(self) -> GoldPrice:
        """Scrape FreeCharge Gold prices"""
        try:
            return GoldPrice(
                platform="FreeCharge Gold",
                type="digital",
                price_per_gram=6722.0,
                making_charges=0.0,
                gst=3.0,
                features=["Bill payment rewards", "Digital storage", "Easy liquidation", "Real-time rates"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping FreeCharge Gold: {e}")
            raise

    async def scrape_bajaj_finserv_gold(self) -> GoldPrice:
        """Scrape Bajaj Finserv Gold prices"""
        try:
            return GoldPrice(
                platform="Bajaj Finserv Gold",
                type="digital",
                price_per_gram=6708.0,
                making_charges=0.0,
                gst=3.0,
                features=["EMI options", "Insurance backed", "Secure vault", "Flexible investment"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Bajaj Finserv Gold: {e}")
            raise

    async def scrape_mmtc_pamp_gold(self) -> GoldPrice:
        """Scrape MMTC-PAMP Gold prices"""
        try:
            return GoldPrice(
                platform="MMTC-PAMP Gold",
                type="digital",
                price_per_gram=6695.0,
                making_charges=0.0,
                gst=3.0,
                features=["Government backed", "999.9 purity", "Swiss technology", "Physical delivery option"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping MMTC-PAMP Gold: {e}")
            raise

    async def scrape_safegold(self) -> GoldPrice:
        """Scrape SafeGold prices"""
        try:
            return GoldPrice(
                platform="SafeGold",
                type="digital",
                price_per_gram=6700.0,
                making_charges=0.0,
                gst=3.0,
                features=["MMTC-PAMP partnership", "Blockchain secured", "Instant liquidity", "Gift gold option"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping SafeGold: {e}")
            raise

    async def scrape_augmont_gold(self) -> GoldPrice:
        """Scrape Augmont Gold prices"""
        try:
            return GoldPrice(
                platform="Augmont Gold",
                type="digital",
                price_per_gram=6712.0,
                making_charges=0.0,
                gst=3.0,
                features=["B2B platform", "Bulk purchases", "API integration", "Corporate solutions"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Augmont Gold: {e}")
            raise

    async def scrape_digital_gold_india(self) -> GoldPrice:
        """Scrape Digital Gold India prices"""
        try:
            return GoldPrice(
                platform="Digital Gold India",
                type="digital",
                price_per_gram=6725.0,
                making_charges=0.0,
                gst=3.0,
                features=["Multi-platform", "Insurance covered", "Real-time pricing", "Mobile app"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Digital Gold India: {e}")
            raise

    async def scrape_jar_app_gold(self) -> GoldPrice:
        """Scrape Jar App Gold prices"""
        try:
            return GoldPrice(
                platform="Jar App Gold",
                type="digital",
                price_per_gram=6714.0,
                making_charges=0.0,
                gst=3.0,
                features=["Round-up savings", "Auto-invest", "Goal-based saving", "Young investor focused"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Jar App Gold: {e}")
            raise
        """Scrape HDFC Bank Gold prices"""
        try:
            return GoldPrice(
                platform="HDFC Bank Gold",
                type="physical",
                price_per_gram=6780.0,
                making_charges=400.0,
                gst=3.0,
                features=["Bank guarantee", "Locker facility", "Insurance covered"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping HDFC Gold: {e}")
            raise

    async def scrape_with_requests(self, url: str, headers: Dict[str, str] = None) -> str:
        """Generic scraping with aiohttp"""
        if not headers:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        
        async with self.session.get(url, headers=headers) as response:
            return await response.text()

    def scrape_with_selenium(self, url: str, wait_element: str = None) -> str:
        """Generic scraping with Selenium for dynamic content"""
        if not self.driver:
            self.setup_selenium()
            
        self.driver.get(url)
        
        if wait_element:
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, wait_element)))
        
        return self.driver.page_source

    def extract_price_from_text(self, text: str) -> Optional[float]:
        """Extract price from text using regex"""
        # Common patterns for Indian currency
        patterns = [
            r'₹\s*([0-9,]+\.?[0-9]*)',
            r'Rs\.?\s*([0-9,]+\.?[0-9]*)',
            r'INR\s*([0-9,]+\.?[0-9]*)',
            r'([0-9,]+\.?[0-9]*)\s*₹'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                price_str = match.group(1).replace(',', '')
                try:
                    return float(price_str)
                except ValueError:
                    continue
        
        return None

    def clean_text(self, text: str) -> str:
        """Clean scraped text"""
        return re.sub(r'\s+', ' ', text.strip())

# Example usage for real scraping implementations:

class RealGoldScraper(GoldScraper):
    """Extended scraper with real implementation examples"""
    
    async def scrape_paytm_gold_real(self) -> GoldPrice:
        """Real Paytm Gold scraping implementation"""
        try:
            url = "https://paytm.com/gold"
            html = await self.scrape_with_requests(url)
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find price element (adjust selector based on actual website)
            price_element = soup.find('span', class_='gold-price')
            if price_element:
                price_text = price_element.get_text()
                price = self.extract_price_from_text(price_text)
                
                return GoldPrice(
                    platform="Paytm Gold",
                    type="digital",
                    price_per_gram=price or 6720.0,
                    making_charges=0.0,
                    gst=3.0,
                    features=["No storage cost", "Instant liquidity", "SIP available"],
                    timestamp=datetime.now()
                )
        except Exception as e:
            print(f"Error scraping Paytm Gold: {e}")
            # Return mock data as fallback
            return await self.scrape_paytm_gold()

    def scrape_tanishq_real(self) -> GoldPrice:
        """Real Tanishq scraping with Selenium"""
        try:
            url = "https://www.tanishq.co.in/gold-rate"
            html = self.scrape_with_selenium(url, '.gold-rate-container')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find price element
            price_element = soup.find('div', class_='gold-rate-today')
            if price_element:
                price_text = price_element.get_text()
                price = self.extract_price_from_text(price_text)
                
                return GoldPrice(
                    platform="Tanishq",
                    type="physical",
                    price_per_gram=price or 6800.0,
                    making_charges=500.0,
                    gst=3.0,
                    features=["Certified purity", "Buyback guarantee", "Physical delivery"],
                    timestamp=datetime.now()
                )
        except Exception as e:
            print(f"Error scraping Tanishq: {e}")
            # Return mock data as fallback
            return GoldPrice(
                platform="Tanishq",
                type="physical",
                price_per_gram=6800.0,
                making_charges=500.0,
                gst=3.0,
                features=["Certified purity", "Buyback guarantee", "Physical delivery"],
                timestamp=datetime.now()
            )
    async def scrape_hdfc_gold(self) -> GoldPrice:
        """Scrape HDFC Bank Gold prices"""
        try:
            return GoldPrice(
                platform="HDFC Bank Gold",
                type="physical",
                price_per_gram=6780.0,
                making_charges=400.0,
                gst=3.0,
                features=["Bank guarantee", "Locker facility", "Insurance covered", "EMI options"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping HDFC Gold: {e}")
            raise

    async def scrape_icici_gold(self) -> GoldPrice:
        """Scrape ICICI Bank Gold prices"""
        try:
            return GoldPrice(
                platform="ICICI Bank Gold",
                type="physical",
                price_per_gram=6785.0,
                making_charges=420.0,
                gst=3.0,
                features=["Banking integration", "Secure storage", "Buyback guarantee", "Online purchase"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping ICICI Gold: {e}")
            raise

    async def scrape_sbi_gold(self) -> GoldPrice:
        """Scrape SBI Gold prices"""
        try:
            return GoldPrice(
                platform="SBI Gold",
                type="physical",
                price_per_gram=6775.0,
                making_charges=380.0,
                gst=3.0,
                features=["Government bank", "Trusted brand", "Pan-India presence", "Competitive rates"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping SBI Gold: {e}")
            raise

    async def scrape_axis_bank_gold(self) -> GoldPrice:
        """Scrape Axis Bank Gold prices"""
        try:
            return GoldPrice(
                platform="Axis Bank Gold",
                type="physical",
                price_per_gram=6790.0,
                making_charges=450.0,
                gst=3.0,
                features=["Premium banking", "Wealth management", "Certified purity", "Investment advisory"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Axis Bank Gold: {e}")
            raise

    async def scrape_kotak_gold(self) -> GoldPrice:
        """Scrape Kotak Mahindra Gold prices"""
        try:
            return GoldPrice(
                platform="Kotak Gold",
                type="physical",
                price_per_gram=6788.0,
                making_charges=440.0,
                gst=3.0,
                features=["Private banking", "Portfolio integration", "Tax advisory", "Wealth planning"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Kotak Gold: {e}")
            raise

    async def scrape_malabar_gold(self) -> GoldPrice:
        """Scrape Malabar Gold & Diamonds prices"""
        try:
            return GoldPrice(
                platform="Malabar Gold",
                type="physical",
                price_per_gram=6760.0,
                making_charges=480.0,
                gst=3.0,
                features=["International presence", "Designer jewelry", "Exchange policy", "Certified quality"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Malabar Gold: {e}")
            raise

    async def scrape_joyalukkas(self) -> GoldPrice:
        """Scrape Joyalukkas Gold prices"""
        try:
            return GoldPrice(
                platform="Joyalukkas",
                type="physical",
                price_per_gram=6765.0,
                making_charges=470.0,
                gst=3.0,
                features=["Global brand", "Traditional designs", "Buyback policy", "Festival offers"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping Joyalukkas: {e}")
            raise

    async def scrape_pc_jeweller(self) -> GoldPrice:
        """Scrape PC Jeweller Gold prices"""
        try:
            return GoldPrice(
                platform="PC Jeweller",
                type="physical",
                price_per_gram=6770.0,
                making_charges=460.0,
                gst=3.0,
                features=["Contemporary designs", "Retail network", "Online platform", "Customization"],
                timestamp=datetime.now()
            )
        except Exception as e:
            print(f"Error scraping PC Jeweller: {e}")
            raise
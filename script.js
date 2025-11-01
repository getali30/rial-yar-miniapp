// حالت خودکار دارک/لایت بر اساس تم تلگرام کاربر
const themeBtn = document.getElementById('theme-toggle');
const root = document.body;

// متغیرهای مهم برای نمایش قیمت‌ها
const goldItemsContainer = document.getElementById('gold-items');
const currencyItemsContainer = document.getElementById('currency-items');
const cryptoItemsContainer = document.getElementById('crypto-items');
const goldLoading = document.getElementById('gold-loading');
const currencyLoading = document.getElementById('currency-loading');
const cryptoLoading = document.getElementById('crypto-loading');
const currencyError = document.getElementById('currency-error');
const updateTimeElement = document.getElementById('update-time');
const cryptoSearch = document.getElementById('crypto-search');

// برای ذخیره تب فعال فعلی
let activeTab = 'gold-section';

// کلید API صحیح navasan.tech
const API_KEY = 'free6bPuGs1inMVBvfdMptJOrfRbmBR7';

// متغیر global برای ذخیره داده‌های API
let globalApiData = null;

// تابع تنظیم تم بر اساس Telegram WebApp theme
function setThemeByTelegram() {
    const webapp = window.Telegram?.WebApp;
    if (webapp && webapp.themeParams) {
        // تلگرام دارک مود است؟
        if (webapp.themeParams.bg_color && webapp.themeParams.bg_color.toLowerCase() === "#181818") {
            root.classList.add('dark');
            window.localStorage.setItem('theme', 'dark');
        } else if (webapp.themeParams.bg_color && webapp.themeParams.bg_color.toLowerCase() === "#ffffff") {
            root.classList.remove('dark');
            window.localStorage.setItem('theme', 'light');
        } else if (webapp.colorScheme === "dark") {
            root.classList.add('dark');
            window.localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            window.localStorage.setItem('theme', 'light');
        }
    } else {
        // fallback: اگر از تلگرام نبود، به حالت قبلی یا سیستم
        if (window.localStorage.getItem('theme')) {
            if (window.localStorage.getItem('theme') === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
            window.localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            window.localStorage.setItem('theme', 'light');
        }
    }
}

// فراخوانی تابع تنظیم تم هنگام بارگذاری
setThemeByTelegram();

// دکمه تغییر تم
themeBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// لیست ارزهای دیجیتال موردنظر برای نمایش (ریالی)
const cryptoCurrenciesIRT = [
    "BTCIRT", "ETHIRT", "LTCIRT", "USDTIRT", "XRPIRT", "BCHIRT", "BNBIRT", "EOSIRT", 
    "XLMIRT", "ETCIRT", "TRXIRT", "DOGEIRT", "UNIIRT", "DAIIRT", "LINKIRT", "DOTIRT", 
    "AAVEIRT", "ADAIRT", "SHIBIRT", "FTMIRT", "MATICIRT", "AXSIRT", "MANAIRT", "SANDIRT", 
    "AVAXIRT", "MKRIRT", "GMTIRT", "USDCIRT", "CHZIRT", "GRTIRT", "CRVIRT", "EGLDIRT", 
    "GALIRT", "HBARIRT", "IMXIRT", "WBTCIRT", "ONEIRT", "ENSIRT", "1M_BTTIRT", "SUSHIIRT", 
    "LDOIRT", "ZROIRT", "STORJIRT", "ANTIRT", "100K_FLOKIIRT", "GLMIRT", "OMIRT", "RDNTIRT", 
    "NOTIRT", "CVXIRT", "XTZIRT", "FILIRT", "UMAIRT", "1B_BABYDOGEIRT", "BANDIRT", "SSVIRT", 
    "DAOIRT", "BLURIRT", "GMXIRT", "SKLIRT", "SNTIRT", "NMRIRT", "API3IRT", "WLDIRT", 
    "SOLIRT", "QNTIRT", "FETIRT", "AGIXIRT", "LPTIRT", "SLPIRT", "COMPIRT", "MEMEIRT", 
    "BATIRT", "TRBIRT", "AGLDIRT", "MDTIRT", "LRCIRT", "BICOIRT", "MAGICIRT", "ETHFIIRT", 
    "1INCHIRT", "1M_NFTIRT", "ARBIRT", "BALIRT", "TONIRT", "CELRIRT", "ALGOIRT", "MASKIRT", 
    "EGALAIRT", "FLOWIRT", "OMGIRT", "ENJIRT", "DYDXIRT", "JSTIRT", "HMSTRIRT", "MAJORIRT"
];

// لیست ارزهای دیجیتال موردنظر برای نمایش (دلاری)
const cryptoCurrenciesUSDT = [
    "BTCUSDT", "ETHUSDT", "LTCUSDT", "XRPUSDT", "BCHUSDT", "BNBUSDT", "EOSUSDT", 
    "XLMUSDT", "ETCUSDT", "TRXUSDT", "PMNUSDT", "DOGEUSDT", "UNIUSDT", "DAIUSDT", 
    "LINKUSDT", "DOTUSDT", "AAVEUSDT", "ADAUSDT", "SHIBUSDT", "FTMUSDT", "MATICUSDT", 
    "AXSUSDT", "MANAUSDT", "SANDUSDT", "AVAXUSDT", "MKRUSDT", "GMTUSDT", "USDCUSDT", 
    "BANDUSDT", "COMPUSDT", "HBARUSDT", "WBTCUSDT", "GLMUSDT", "ENSUSDT", "AEVOUSDT", 
    "RSRUSDT", "API3USDT", "ONEUSDT", "EGALAUSDT", "XTZUSDT", "FLOWUSDT", "CVCUSDT", 
    "NMRUSDT", "BATUSDT", "TRBUSDT", "RDNTUSDT", "OMUSDT", "YFIUSDT", "QNTUSDT", 
    "IMXUSDT", "GMXUSDT", "ETHFIUSDT", "GRTUSDT", "WLDUSDT", "NOTUSDT", "MAGICUSDT", 
    "MEMEUSDT", "SOLUSDT", "BALUSDT", "DAOUSDT", "SNXUSDT", "SSVUSDT", "RNDRUSDT", 
    "NEARUSDT", "WOOUSDT", "CRVUSDT", "EGLDUSDT", "LPTUSDT", "BICOUSDT", "ANTUSDT", 
    "1INCHUSDT", "SLPUSDT", "CVXUSDT", "TONUSDT", "BLURUSDT", "CELRUSDT", "DYDXUSDT", 
    "ZROUSDT", "ARBUSDT", "APTUSDT", "UMAUSDT", "ZRXUSDT", "SUSHIUSDT", "FETUSDT", 
    "ALGOUSDT", "MASKUSDT", "STORJUSDT", "XMRUSDT", "SNTUSDT", "APEUSDT", "FILUSDT", 
    "ENJUSDT", "OMGUSDT", "CHZUSDT", "JSTUSDT", "HMSTRUSDT", "MAJORUSDT"
];

// نام‌های فارسی ارزهای دیجیتال 
const cryptoNames = {
    "BTC": "بیت‌کوین",
    "ETH": "اتریوم",
    "LTC": "لایت‌کوین",
    "USDT": "تتر",
    "XRP": "ریپل",
    "BCH": "بیت‌کوین‌کش",
    "BNB": "بایننس‌کوین",
    "EOS": "ایاس",
    "XLM": "استلار",
    "ETC": "اتریوم‌کلاسیک",
    "TRX": "ترون",
    "PMN": "پی‌ام‌ان",
    "DOGE": "دوج‌کوین",
    "UNI": "یونی‌سواپ",
    "DAI": "دای",
    "LINK": "چین‌لینک",
    "DOT": "پولکادات",
    "AAVE": "آوه",
    "ADA": "کاردانو",
    "SHIB": "شیبا اینو",
    "FTM": "فانتوم",
    "MATIC": "پالیگان",
    "AXS": "اکسی اینفینیتی",
    "MANA": "مانا (دیسنترالند)",
    "SAND": "سندباکس",
    "AVAX": "آوالانچ",
    "MKR": "میکر",
    "GMT": "جی‌ام‌تی (StepN)",
    "USDC": "یو‌اس‌دی‌کوین",
    "BAND": "بند پروتکل",
    "COMP": "کامپاند",
    "HBAR": "هدرا هش‌گراف",
    "WBTC": "رپد بیت‌کوین",
    "GLM": "گولم",
    "ENS": "اتریوم نیم سرویس",
    "AEVO": "ایوو",
    "RSR": "ریزرو رایتس",
    "API3": "ای‌پی‌آی۳",
    "ONE": "هارمونی وان",
    "EGALA": "گالا",
    "XTZ": "تزوس",
    "FLOW": "فلو",
    "CVC": "سیویک",
    "NMR": "نومرای",
    "BAT": "بیسیک اتنشن توکن",
    "TRB": "تلور",
    "RDNT": "رادینت",
    "OM": "اومیس‌گو",
    "YFI": "یرن فایننس",
    "QNT": "کوانت",
    "IMX": "ایمیوتبل ایکس",
    "GMX": "جی‌ام‌ایکس",
    "ETHFI": "اتریوم‌فای",
    "GRT": "گراف",
    "WLD": "ورلد‌کوین",
    "NOT": "نات‌کوین",
    "MAGIC": "مجیک",
    "MEME": "میم‌کوین",
    "SOL": "سولانا",
    "BAL": "بالانسر",
    "DAO": "دائو میکر",
    "SNX": "سینتتیکس",
    "SSV": "اس‌اس‌وی نتورک",
    "RNDR": "رندر",
    "NEAR": "نیر پروتکل",
    "WOO": "وو نتورک",
    "CRV": "کرو",
    "EGLD": "مولتی‌ورس‌ایکس (الروند)",
    "LPT": "لایو‌پییر",
    "BICO": "بیکونومی",
    "ANT": "آراگون",
    "1INCH": "وان‌اینچ",
    "SLP": "اسموث لاو پوشن",
    "CVX": "کانوکس فایننس",
    "TON": "تون‌کوین",
    "BLUR": "بلور",
    "CELR": "سلر نتورک",
    "DYDX": "دی‌وای‌دی‌اکس",
    "ZRO": "لایه‌زیرو",
    "ARB": "آربیتروم",
    "APT": "آپتوس",
    "UMA": "یو‌ام‌ای",
    "ZRX": "زیروایکس",
    "SUSHI": "سوشی‌سواپ",
    "FET": "فچ.ای‌آی",
    "ALGO": "الگوراند",
    "MASK": "مسک نتورک",
    "STORJ": "استورج",
    "XMR": "مونرو",
    "SNT": "استاتوس",
    "APE": "ایپ‌کوین",
    "FIL": "فایل‌کوین",
    "ENJ": "انجین‌کوین",
    "OMG": "اومیس‌گو",
    "CHZ": "چیلیز",
    "JST": "جاست",
    "HMSTR": "همستر",
    "MAJOR": "میجر",
    "GAL": "گالاکسی",
    "AGIX": "سینگولاریتی نت",
    "LDO": "لیدو دائو",
    "SKL": "اسکیل نتورک",
    "AGLD": "ادونچر گلد",
    "MDT": "می‌دیتا",
    "LRC": "لوپرینگ",
    "1M_BTT": "بیت‌تورنت (۱M)",
    "1M_NFT": "NFT (۱M)",
    "100K_FLOKI": "فلوکی (100K)",
    "1B_BABYDOGE": "بیبی‌دوج (1B)"
};

// مدیریت ناوبری
function navigateTo(targetSection) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(targetSection).classList.remove('hidden');
    
    // اگر هدف صفحه ارز است، بارگذاری داده‌ها
    if (targetSection === 'currency-page') {
        loadAllData();
    }
}

// تنظیم دکمه‌های ناوبری
document.getElementById('goto-converter')?.addEventListener('click', () => navigateTo('converter-page'));
document.getElementById('goto-currency')?.addEventListener('click', () => navigateTo('currency-page'));

// تنظیم دکمه‌های برگشت
document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        if (target) navigateTo(target);
    });
});

// مخفی کردن همه لودینگ‌ها
function hideAllLoadings() {
    if (goldLoading) goldLoading.classList.add('hidden');
    if (currencyLoading) currencyLoading.classList.add('hidden');
    if (cryptoLoading) cryptoLoading.classList.add('hidden');
}

// نمایش لودینگ متناسب با تب فعال
function showLoading(tabName) {
    hideAllLoadings();
    
    if (tabName === 'gold-section' && goldLoading) {
        goldLoading.classList.remove('hidden');
    } else if (tabName === 'currency-section' && currencyLoading) {
        currencyLoading.classList.remove('hidden');
    } else if (tabName === 'crypto-section' && cryptoLoading) {
        cryptoLoading.classList.remove('hidden');
    }
}

// تنظیم تب‌ها
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        if (!target) return;
        
        // تغییر کلاس active تب‌ها
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // تغییر بخش فعال
        document.querySelectorAll('.currency-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(target)?.classList.remove('hidden');
        
        // ذخیره تب فعال و بارگذاری داده‌های مخصوص آن
        activeTab = target;
        
        // بارگذاری داده‌ها برای تب فعال
        if (target === 'gold-section') {
            showLoading('gold-section');
            loadGoldData();
        } else if (target === 'currency-section') {
            showLoading('currency-section');
            loadCurrencyData();
        } else if (target === 'crypto-section') {
            showLoading('crypto-section');
            loadCryptoData();
        }
    });
});

// فرمت‌بندی اعداد به فارسی
function formatNumber(num) {
    // تبدیل به فرمت فارسی با جداکننده هزارگان
    return num.toLocaleString('fa-IR');
}

// فرمت‌بندی قیمت دلاری
function formatDollarPrice(price, includeDecimal = false) {
    const numPrice = parseFloat(price);
    
    // برای اعداد بزرگتر از 10، اعشار نمایش داده نشود
    if (numPrice >= 10 || !includeDecimal) {
        return formatNumber(Math.round(numPrice));
    } else {
        // برای اعداد کوچکتر، تا دو رقم اعشار نمایش داده شود
        return formatNumber(Math.round(numPrice * 100) / 100);
    }
}

// تابع تبدیل تاریخ میلادی به شمسی
function gregorianToJalali(g_d, g_m, g_y) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    
    let jy = g_y <= 1600 ? 0 : 979;
    g_y -= g_y <= 1600 ? 621 : 1600;
    
    let gy2 = g_m > 2 ? g_y + 1 : g_y;
    let days = 365 * g_y + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
               Math.floor((gy2 + 399) / 400) - 80 + g_d + g_d_m[g_m - 1];
    
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    
    let jm, jd;
    if (days < 186) {
        jm = 1 + Math.floor(days / 31);
        jd = 1 + days % 31;
    } else {
        jm = 7 + Math.floor((days - 186) / 30);
        jd = 1 + (days - 186) % 30;
    }
    
    return [jy, jm, jd];
}

// به‌روزرسانی زمان آخرین به‌روزرسانی - با تاریخ شمسی
function updateLastUpdateTime() {
    const now = new Date();
    const [jalaliYear, jalaliMonth, jalaliDay] = gregorianToJalali(
        now.getDate(),
        now.getMonth() + 1,
        now.getFullYear()
    );
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    const persianDate = `${jalaliYear}/${String(jalaliMonth).padStart(2, '0')}/${String(jalaliDay).padStart(2, '0')}`;
    const persianTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    // نمایش زمان به‌روزرسانی
    if (updateTimeElement) {
        updateTimeElement.textContent = `آخرین به‌روزرسانی: ${persianDate} ساعت ${persianTime}`;
    }
}

// دریافت داده‌ها از API navasan.tech - اصلاح شده برای HTTPS
async function fetchCurrencyRatesFromAPI() {
    try {
        console.log('🔄 دریافت داده‌ها از API navasan.tech...');
        
        // تلاش برای HTTPS ابتدا
        let response;
        let url = `https://api.navasan.tech/latest/?api_key=${API_KEY}`;
        
        try {
            response = await fetch(url);
        } catch (httpsError) {
            console.log('❌ HTTPS ناموفق، تلاش با HTTP...');
            // اگر HTTPS کار نکرد، HTTP امتحان کن
            url = `http://api.navasan.tech/latest/?api_key=${API_KEY}`;
            response = await fetch(url);
        }
        
        console.log(`📡 درخواست به: ${url}`);
        console.log(`📊 وضعیت پاسخ: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ داده‌های API دریافت شد، تعداد آیتم‌ها:', Object.keys(data).length);
        console.log('🔍 نمونه کلیدها:', Object.keys(data).slice(0, 10));
        
        // ذخیره داده‌ها در متغیر global
        globalApiData = data;
        
        return data;
    } catch (error) {
        console.error('❌ خطا در دریافت داده‌ها از API:', error.message);
        console.error('📋 جزئیات خطا:', error);
        return null;
    }
}

// بارگذاری همه داده‌ها
async function loadAllData() {
    try {
        console.log('🚀 شروع بارگذاری همه داده‌ها...');
        
        // پنهان کردن خطاها
        if (currencyError) currencyError.classList.add('hidden');
        
        // به‌روزرسانی زمان
        updateLastUpdateTime();
        
        // نمایش لودینگ مناسب
        showLoading(activeTab);
        
        // دریافت داده‌ها از API
        const apiData = await fetchCurrencyRatesFromAPI();
        
        if (!apiData) {
            console.error('❌ داده‌های API دریافت نشد');
            // نمایش خطا
            hideAllLoadings();
            if (currencyError) currencyError.classList.remove('hidden');
            return;
        }
        
        // بارگذاری داده‌ها بر اساس تب فعال
        if (activeTab === 'gold-section') {
            await loadGoldDataWithAPI(apiData);
        } else if (activeTab === 'currency-section') {
            await loadCurrencyDataWithAPI(apiData);
        } else if (activeTab === 'crypto-section') {
            await loadCryptoData();
        }
        
        console.log('✅ بارگذاری داده‌ها کامل شد');
        
    } catch (error) {
        console.error('❌ خطا در loadAllData:', error);
        hideAllLoadings();
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

// بارگذاری داده‌های طلا با API
async function loadGoldDataWithAPI(apiData) {
    try {
        console.log('💰 بارگذاری داده‌های طلا از API...');
        
        if (!goldItemsContainer) return;
        
        const goldHTML = getGoldDataFromAPI(apiData);
        goldItemsContainer.innerHTML = goldHTML;
        
        // پنهان کردن لودینگ
        if (goldLoading) goldLoading.classList.add('hidden');
        
        console.log('✅ داده‌های طلا بارگذاری شد');
        
    } catch (error) {
        console.error("❌ خطا در بارگذاری داده‌های طلا:", error);
        if (goldLoading) goldLoading.classList.add('hidden');
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

// بارگذاری داده‌های ارز خارجی با API
async function loadCurrencyDataWithAPI(apiData) {
    try {
        console.log('💱 بارگذاری داده‌های ارز خارجی از API...');
        
        if (!currencyItemsContainer) return;
        
        const currencyHTML = getCurrencyDataFromAPI(apiData);
        currencyItemsContainer.innerHTML = currencyHTML;
        
        // پنهان کردن لودینگ
        if (currencyLoading) currencyLoading.classList.add('hidden');
        
        console.log('✅ داده‌های ارز خارجی بارگذاری شد');
        
    } catch (error) {
        console.error("❌ خطا در بارگذاری داده‌های ارز:", error);
        if (currencyLoading) currencyLoading.classList.add('hidden');
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

// تابع اصلی بارگذاری طلا
async function loadGoldData() {
    if (globalApiData) {
        await loadGoldDataWithAPI(globalApiData);
    } else {
        await loadAllData();
    }
}

// تابع اصلی بارگذاری ارز خارجی
async function loadCurrencyData() {
    if (globalApiData) {
        await loadCurrencyDataWithAPI(globalApiData);
    } else {
        await loadAllData();
    }
}

// بارگذاری داده‌های ارز دیجیتال
async function loadCryptoData() {
    try {
        console.log('₿ بارگذاری داده‌های ارز دیجیتال...');
        
        // نمایش لودینگ
        if (cryptoLoading) cryptoLoading.classList.remove('hidden');
        
        // پاک کردن داده‌های قبلی
        if (cryptoItemsContainer) cryptoItemsContainer.innerHTML = '';
        
        // دریافت داده‌های API
        await fetchCryptoData();
    } catch (error) {
        console.error("❌ خطا در بارگذاری داده‌های ارز دیجیتال:", error);
        // مخفی کردن لودینگ در صورت خطا
        if (cryptoLoading) cryptoLoading.classList.add('hidden');
        if (currencyError) currencyError.classList.remove('hidden');
    }
}

// دریافت داده‌های ارزهای دیجیتال از API نوبیتکس
async function fetchCryptoData() {
    try {
        console.log("₿ دریافت داده‌های ارز دیجیتال از API نوبیتکس");
        
        const response = await fetch('https://apiv2.nobitex.ir/v3/orderbook/all');
        const data = await response.json();
        
        if (data && Object.keys(data).length > 0) {
            console.log("✅ داده‌های ارز دیجیتال دریافت شد");
            
            // ساخت HTML ارزهای دیجیتال
            if (cryptoItemsContainer) {
                const cryptoHTML = getCryptoDataHTMLFromAPI(data);
                cryptoItemsContainer.innerHTML = cryptoHTML;
                console.log("✅ داده‌های ارز دیجیتال نمایش داده شد");
                
                // تنظیم جستجوی ارزهای دیجیتال
                setupCryptoSearch();
            }
            
        } else {
            throw new Error("داده‌های دریافتی از API معتبر نیستند");
        }
    } catch (error) {
        console.error("❌ خطا در دریافت داده‌های ارز دیجیتال:", error);
        
        // نمایش پیام خطا
        if (cryptoItemsContainer) {
            cryptoItemsContainer.innerHTML = '<p class="no-data">❌ خطا در دریافت اطلاعات ارزهای دیجیتال</p>';
        }
    } finally {
        // مخفی کردن لودینگ در هر صورت
        if (cryptoLoading) {
            cryptoLoading.classList.add('hidden');
        }
    }
}

// تنظیم جستجوی ارزهای دیجیتال
function setupCryptoSearch() {
    if (cryptoSearch) {
        cryptoSearch.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            const cryptoItems = document.querySelectorAll('#crypto-items .currency-item');
            
            cryptoItems.forEach(item => {
                const cryptoName = item.querySelector('.currency-name').textContent.toLowerCase();
                const cryptoSymbol = item.getAttribute('data-symbol')?.toLowerCase() || '';
                
                if (cryptoName.includes(searchTerm) || cryptoSymbol.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// ساخت HTML برای داده‌های طلا از API - اصلاح شده
function getGoldDataFromAPI(apiData) {
    console.log('🏆 پردازش داده‌های طلا از API...');
    
    const goldSymbols = [
        { key: '18ayar', name: 'طلای 18 عیار', unit: 'تومان' },
        { key: 'abshodeh', name: 'طلای آب‌شده', unit: 'تومان' },
        { key: 'usd_xau', name: 'انس طلا', unit: 'دلار' },
        { key: 'sekkeh', name: 'سکه امامی', unit: 'تومان' },
        { key: 'bahar', name: 'سکه بهار آزادی', unit: 'تومان' },
        { key: 'nim', name: 'نیم سکه', unit: 'تومان' },
        { key: 'rob', name: 'ربع سکه', unit: 'تومان' },
        { key: 'gerami', name: 'سکه یک گرمی', unit: 'تومان' }
    ];
    
    const goldItems = [];
    
    goldSymbols.forEach(symbol => {
        if (apiData[symbol.key]) {
            const item = apiData[symbol.key];
            const price = item.value || item.price || item;
            
            if (price && !isNaN(parseFloat(price))) {
                goldItems.push({
                    name: symbol.name,
                    price: parseFloat(price),
                    unit: symbol.unit
                });
                console.log(`✅ ${symbol.name}: ${price} ${symbol.unit}`);
            } else {
                console.log(`❌ قیمت ${symbol.name} معتبر نیست:`, item);
            }
        } else {
            console.log(`❌ ${symbol.name} در API یافت نشد`);
        }
    });
    
    // اگر هیچ داده معتبری یافت نشد
    if (goldItems.length === 0) {
        console.log('❌ هیچ داده طلای معتبری یافت نشد');
        return '<p class="no-data">❌ اطلاعات طلا و سکه در حال حاضر در دسترس نیست</p>';
    }
    
    console.log(`✅ ${goldItems.length} آیتم طلا پردازش شد`);
    
    return goldItems.map(item => {
        return `
            <div class="currency-item gold">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(item.price)} <span class="currency-unit">${item.unit}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های ارز خارجی از API - اصلاح شده
function getCurrencyDataFromAPI(apiData) {
    console.log('💱 پردازش داده‌های ارز خارجی از API...');
    
    const currencySymbols = [
        // ارزهای اصلی
        { key: 'usd', name: 'دلار آمریکا (USD)', type: 'main' },
        { key: 'eur', name: 'یورو (EUR)', type: 'main' },
        { key: 'gbp', name: 'پوند انگلیس (GBP)', type: 'main' },
        { key: 'aed', name: 'درهم امارات (AED)', type: 'main' },
        { key: 'try', name: 'لیر ترکیه (TRY)', type: 'main' },
        { key: 'cad', name: 'دلار کانادا (CAD)', type: 'main' },
        { key: 'aud', name: 'دلار استرالیا (AUD)', type: 'main' },
        { key: 'cny', name: 'یوآن چین (CNY)', type: 'main' },
        
        // سایر ارزها
        { key: 'afn', name: 'افغانی (AFN)', type: 'other' },
        { key: 'thb', name: 'بات تایلند (THB)', type: 'other' },
        { key: 'amd', name: 'درام ارمنستان (AMD)', type: 'other' },
        { key: 'bhd', name: 'دینار بحرین (BHD)', type: 'other' },
        { key: 'iqd', name: 'دینار عراق (IQD)', type: 'other' },
        { key: 'kwd', name: 'دینار کویت (KWD)', type: 'other' },
        { key: 'rub', name: 'روبل روسیه (RUB)', type: 'other' },
        { key: 'pkr', name: 'روپیه پاکستان (PKR)', type: 'other' },
        { key: 'inr', name: 'روپیه هند (INR)', type: 'other' },
        { key: 'sar', name: 'ریال عربستان (SAR)', type: 'other' },
        { key: 'omr', name: 'ریال عمان (OMR)', type: 'other' },
        { key: 'qar', name: 'ریال قطر (QAR)', type: 'other' },
        { key: 'myr', name: 'رینگیت مالزی (MYR)', type: 'other' },
        { key: 'chf', name: 'فرانک سوئیس (CHF)', type: 'other' },
        { key: 'sek', name: 'کرون سوئد (SEK)', type: 'other' },
        { key: 'gel', name: 'لاری گرجستان (GEL)', type: 'other' },
        { key: 'syp', name: 'لیره سوریه (SYP)', type: 'other' },
        { key: 'azn', name: 'منات آذربایجان (AZN)', type: 'other' },
        { key: 'jpy', name: 'یکصد ین ژاپن (JPY)', type: 'other' }
    ];
    
    const currencyItems = [];
    
    currencySymbols.forEach(symbol => {
        if (apiData[symbol.key]) {
            const item = apiData[symbol.key];
            const price = item.value || item.price || item;
            
            if (price && !isNaN(parseFloat(price))) {
                currencyItems.push({
                    name: symbol.name,
                    price: parseFloat(price),
                    type: symbol.type
                });
                console.log(`✅ ${symbol.name}: ${price} تومان`);
            } else {
                console.log(`❌ قیمت ${symbol.name} معتبر نیست:`, item);
            }
        } else {
            console.log(`❌ ${symbol.name} در API یافت نشد`);
        }
    });
    
    // اگر هیچ داده معتبری یافت نشد
    if (currencyItems.length === 0) {
        console.log('❌ هیچ داده ارز خارجی معتبری یافت نشد');
        return '<p class="no-data">❌ اطلاعات ارزهای خارجی در حال حاضر در دسترس نیست</p>';
    }
    
    console.log(`✅ ${currencyItems.length} ارز خارجی پردازش شد`);
    
    return currencyItems.map(item => {
        return `
            <div class="currency-item forex">
                <div class="currency-header">
                    <span class="currency-name">${item.name}</span>
                </div>
                <div class="currency-price">
                    ${formatNumber(item.price)} <span class="currency-unit">تومان</span>
                </div>
            </div>
        `;
    }).join('');
}

// ساخت HTML برای داده‌های ارز دیجیتال از API
function getCryptoDataHTMLFromAPI(data) {
    // بررسی ارزهای موجود در API
    const cryptoList = [];
    
    // جمع‌آوری داده‌های ارزهای ریالی
    cryptoCurrenciesIRT.forEach(irtSymbol => {
        if (data[irtSymbol] && data[irtSymbol].lastTradePrice) {
            // گرفتن نام کوتاه ارز (مثلاً BTC از BTCIRT)
            const baseSymbol = irtSymbol.replace('IRT', '');
            
            // معادل USDT آن
            const usdtSymbol = baseSymbol + 'USDT';
            
            // اگر در داده‌های API موجود باشد
            const irtPrice = data[irtSymbol].lastTradePrice;
            const usdtPrice = data[usdtSymbol] ? data[usdtSymbol].lastTradePrice : null;
            
            // نام فارسی ارز
            const shortSymbol = baseSymbol.replace(/^1[BKM]_/, '').replace(/^100K_/, '').replace(/^1B_/, '');
            const name = cryptoNames[shortSymbol] || shortSymbol;
            
            cryptoList.push({
                symbol: baseSymbol,
                name: name,
                irtPrice: irtPrice,
                usdtPrice: usdtPrice
            });
        }
    });
    
    // اضافه کردن ارزهای دلاری که فقط قیمت دلاری دارند
    cryptoCurrenciesUSDT.forEach(usdtSymbol => {
        const baseSymbol = usdtSymbol.replace('USDT', '');
        const irtSymbol = baseSymbol + 'IRT';
        
        // اگر قبلاً اضافه نشده و در داده‌ها موجود است
        if (!cryptoList.some(item => item.symbol === baseSymbol) && data[usdtSymbol] && data[usdtSymbol].lastTradePrice) {
            const usdtPrice = data[usdtSymbol].lastTradePrice;
            
            // نام فارسی ارز
            const shortSymbol = baseSymbol.replace(/^1[BKM]_/, '').replace(/^100K_/, '').replace(/^1B_/, '');
            const name = cryptoNames[shortSymbol] || shortSymbol;
            
            cryptoList.push({
                symbol: baseSymbol,
                name: name,
                irtPrice: null,
                usdtPrice: usdtPrice
            });
        }
    });
    
    // اگر هیچ ارزی یافت نشد
    if (cryptoList.length === 0) {
        return '<p class="no-data">❌ اطلاعات ارزهای دیجیتال در دسترس نیست</p>';
    }
    
    // مرتب‌سازی بر اساس اهمیت (BTC و ETH اول، بقیه به ترتیب الفبا)
    cryptoList.sort((a, b) => {
        if (a.symbol === 'BTC') return -1;
        if (b.symbol === 'BTC') return 1;
        if (a.symbol === 'ETH') return -1;
        if (b.symbol === 'ETH') return 1;
        return a.name.localeCompare(b.name);
    });
    
    // ساخت HTML برای هر ارز دیجیتال
    return cryptoList.map(crypto => {
        // نمایش قیمت ریالی (تومانی)
        let irtPriceHtml = '';
        if (crypto.irtPrice) {
            // تبدیل قیمت ریال به تومان
            const tomanPrice = Math.floor(parseInt(crypto.irtPrice) / 10);
            irtPriceHtml = `<div class="crypto-price-irt">${formatNumber(tomanPrice)} <span class="crypto-unit">تومان</span></div>`;
        }
        
        // نمایش قیمت دلاری (با مدیریت اعشار)
        let usdtPriceHtml = '';
        if (crypto.usdtPrice) {
            // برای اعداد کوچکتر از 10، اعشار نمایش داده شود
            const showDecimal = parseFloat(crypto.usdtPrice) < 10;
            usdtPriceHtml = `<div class="crypto-price-usdt">${formatDollarPrice(crypto.usdtPrice, showDecimal)} <span class="crypto-unit">دلار</span></div>`;
        }
        
        return `
            <div class="currency-item crypto" data-symbol="${crypto.symbol}">
                <div class="currency-header">
                    <span class="currency-name">${crypto.name}</span>
                    <span class="currency-symbol">${crypto.symbol}</span>
                </div>
                <div class="crypto-prices">
                    ${irtPriceHtml}
                    ${usdtPriceHtml}
                </div>
            </div>
        `;
    }).join('');
}

// بخش تبدیل ریال به تومان
const conversionTypeSelect = document.getElementById('conversion-type');
const amountLabel = document.getElementById('amount-label');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const resultContainer = document.getElementById('result-container');
const numericResult = document.getElementById('numeric-result');
const textResult = document.getElementById('text-result');
const copyNumericBtn = document.getElementById('copy-numeric');
const copyTextBtn = document.getElementById('copy-text');

// تنظیم متن لیبل براساس نوع تبدیل
conversionTypeSelect?.addEventListener('change', function() {
    if (this.value === 'toman-to-rial') {
        if (amountLabel) amountLabel.textContent = 'مبلغ را به تومان وارد کنید:';
    } else {
        if (amountLabel) amountLabel.textContent = 'مبلغ را به ریال وارد کنید:';
    }
    if (resultContainer) resultContainer.classList.add('hidden');
});

// متغیر برای ذخیره مقدار عددی خالص
let rawNumber = '';

// تبدیل اعداد فارسی به انگلیسی
function convertPersianToEnglishNumbers(input) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (let i = 0; i < 10; i++) {
        const regex = new RegExp(persianNumbers[i], 'g');
        input = input.replace(regex, englishNumbers[i]);
    }
    return input;
}

amountInput?.addEventListener('input', function(e) {
    this.value = convertPersianToEnglishNumbers(this.value);
    const start = this.selectionStart;
    const end = this.selectionEnd;
    if (e.inputType === 'insertText' && /\d/.test(e.data)) {
        const cleanValue = this.value.replace(/[^\d]/g, '');
        rawNumber = cleanValue;
    } else if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') {
        rawNumber = this.value.replace(/[^\d]/g, '');
    } else {
        rawNumber = this.value.replace(/[^\d]/g, '');
    }
    if (rawNumber === '') {
        this.value = '';
        return;
    }
    let formattedValue = '';
    for (let i = 0; i < rawNumber.length; i++) {
        if (i > 0 && (rawNumber.length - i) % 3 === 0) {
            formattedValue += ',';
        }
        formattedValue += rawNumber[i];
    }
    this.value = formattedValue;
    const commasBefore = formattedValue.substring(0, start).split(',').length - 1;
    this.setSelectionRange(start + commasBefore, end + commasBefore);
});

convertBtn?.addEventListener('click', function() {
    const inputValue = rawNumber || amountInput?.value.replace(/[^\d]/g, '');
    if (!inputValue) {
        alert('لطفاً یک عدد وارد کنید');
        return;
    }
    let rialValue, tomanValue;
    if (conversionTypeSelect?.value === 'toman-to-rial') {
        tomanValue = BigInt(inputValue);
        rialValue = tomanValue * BigInt(10);
        numericResult.textContent = formatLargeNumber(rialValue.toString()) + ' ریال';
        textResult.textContent = `${numberToWords(rialValue.toString())} ریال`;
    } else {
        rialValue = BigInt(inputValue);
        tomanValue = rialValue / BigInt(10);
        numericResult.textContent = formatLargeNumber(tomanValue.toString()) + ' تومان';
        textResult.textContent = `${numberToWords(tomanValue.toString())} تومان`;
    }
    resultContainer.classList.remove('hidden');
});

function formatLargeNumber(numStr) {
    let result = '';
    for (let i = 0; i < numStr.length; i++) {
        if (i > 0 && (numStr.length - i) % 3 === 0) {
            result += ',';
        }
        result += numStr[i];
    }
    return result;
}

copyNumericBtn?.addEventListener('click', function() {
    copyToClipboard(numericResult.textContent);
    showToast('نتیجه عددی کپی شد');
});

copyTextBtn?.addEventListener('click', function() {
    copyToClipboard(textResult.textContent);
    showToast('نتیجه متنی کپی شد');
});

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }, 100);
}

const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون', 'کوادریلیون'];

function numberToWords(numStr) {
    if (numStr === '0') return 'صفر';
    let words = '';
    let scaleIndex = 0;
    for (let i = numStr.length; i > 0; i -= 3) {
        const start = Math.max(0, i - 3);
        const chunk = parseInt(numStr.substring(start, i), 10);
        if (chunk !== 0) {
            const chunkWords = convertChunkToWords(chunk);
            words = chunkWords + (scaleIndex > 0 ? ' ' + scales[scaleIndex] : '') + 
                   (words ? ' و ' + words : '');
        }
        scaleIndex++;
    }
    return words;
}

function convertChunkToWords(chunk) {
    let result = '';
    const hundred = Math.floor(chunk / 100);
    if (hundred > 0) {
        result += hundreds[hundred];
    }
    const remainder = chunk % 100;
    if (remainder > 0) {
        if (result.length > 0) result += ' و ';
        if (remainder < 10) {
            result += units[remainder];
        } else if (remainder < 20) {
            result += teens[remainder - 10];
        } else {
            const ten = Math.floor(remainder / 10);
            const unit = remainder % 10;
            result += tens[ten];
            if (unit > 0) {
                result += ' و ' + units[unit];
            }
        }
    }
    return result;
}

// شروع خودکار نمایش داده‌ها
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOMContentLoaded: صفحه بارگذاری شد');
    
    // تنظیم تب فعال اولیه
    activeTab = 'gold-section';
    
    // افزودن رویداد برای دکمه تلاش مجدد
    document.getElementById('retry-btn')?.addEventListener('click', loadAllData);
    
    // تنظیم جستجوی ارز
    document.getElementById('currency-search')?.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        const items = document.querySelectorAll('#currency-items .currency-item');
        
        items.forEach(item => {
            const name = item.querySelector('.currency-name').textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// بارگذاری مجدد در حالت سرویس کارگر
window.addEventListener('load', function() {
    console.log('🚀 Window loaded: پنجره بارگذاری شد');
});

// برقراری ارتباط با تلگرام
if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.ready();
    
    // اگر کاربر در تلگرام تم را تغییر داد (در لحظه)
    if (window.Telegram.WebApp.onEvent) {
        window.Telegram.WebApp.onEvent('themeChanged', setThemeByTelegram);
    }
}

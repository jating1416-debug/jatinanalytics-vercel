/* ============================================================
   JATIN KUMAR — PORTFOLIO V2  ·  script.js
   Projects, datasets, case studies and the detail dialog are
   all rendered from the data blocks at the top of this file.
   ============================================================ */

/* ---------- GitHub source (where live data & files are fetched) ---------- */
const GITHUB = {
  user: 'jating1416-debug',
  repo: 'jatinanalytics-vercel',
  branch: 'main'
};
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB.user}/${GITHUB.repo}/${GITHUB.branch}`;
const TREE_API = `https://api.github.com/repos/${GITHUB.user}/${GITHUB.repo}/git/trees/${GITHUB.branch}?recursive=1`;

/* ---------- PROJECTS (edit here to add/change projects) ---------- */
const PROJECTS = [
  {
    id: 'supply-chain',
    title: 'Supply Chain & Logistics Control Tower',
    label: 'OPERATIONS ANALYTICS',
    summary: 'A Power BI control tower for order fulfilment, carrier performance, warehouse returns and profitability.',
    metric: '200K orders · 86.19% on-time delivery',
    tags: ['Power BI', 'DAX', 'Data Modelling'],
    alt: 'Supply chain and logistics Power BI dashboard',
    dashboard: 'https://app.powerbi.com/view?r=eyJrIjoiMzAzMGViOTMtYjliNy00NjlhLWIxMzktMTFjYzVjZTYwOGVkIiwidCI6IjUzMTVhNjkzLTM3MjktNDY0NS1hOTIyLWMxY2EwMTVjNWY1MiJ9',
    source: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/Supply%20Chain%20Analytics',
    folder: 'Supply Chain Analytics',
    fallbackImage: `${RAW_BASE}/projects/Supply%20Chain%20Analytics/Dashboard%20Image/Supply%20Chain%20Analytics.png`,
    info: {
      tagline: 'Order fulfilment efficiency, carrier analytics, warehouse bottlenecks and logistics profitability.',
      overview: 'Analyzed 200,000 supply chain order transactions along with customer, product, warehouse and carrier data to optimise logistics costs, evaluate courier SLAs, track fulfilment bottlenecks and analyse net profit margins using Python, DAX and Power BI. Built a high-impact single-page executive control tower dashboard focused on fulfilment KPIs, shipping cost distribution, warehouse return rates and financial performance.',
      objectives: [
        'Track core logistics KPIs including Total Revenue (₹3.95Bn), Net Profit (₹518.09M), Net Margin % (13.13%), On-Time Delivery % (86.19%) and Average Delivery Days (4 days).',
        'Evaluate courier partner performance and shipping mode cost efficiency across 200,000 order shipments.',
        'Identify warehouse fulfilment bottlenecks, dispatch delays and regional late order distributions.',
        'Analyse product category profit margins, COGS impact, warehouse return rates (RTO) and customer segment profitability.'
      ],
      insights: [
        'Overall on-time delivery rate of 86.19% with an average fulfilment cycle time of 4 days across 200K orders.',
        'Air Freight is the costliest shipping mode at ₹266.99 average per order — nearly 80% higher than Road Freight (₹148.41).',
        'Delhivery led logistics execution with 49.9K orders (~25% of total volume), outperforming other major carriers.',
        'Clothing generated the highest profit margin at 15.0%, while Grocery recorded the lowest at 4.4%.',
        'WH-Chennai had the highest warehouse return rate (6.24%); the West Region had the most late orders (5.1K).',
        'Regular (43.58%) and Premium (37.24%) customer segments generated over 80% of total net profit.'
      ],
      tech: ['Python', 'Pandas', 'NumPy', 'Power BI', 'DAX', 'Data Modelling', 'Star Schema']
    }
  },
  {
    id: 'financial-fraud',
    title: 'Indian Financial Fraud Analytics',
    label: 'RISK ANALYTICS',
    summary: 'An analytics dashboard exploring transaction behaviour, customer exposure, merchant risk and fraud signals.',
    metric: '250K synthetic transactions · financial risk analysis',
    tags: ['Power BI', 'SQL', 'Python'],
    alt: 'Financial fraud analytics dashboard',
    dashboard: 'https://app.powerbi.com/view?r=eyJrIjoiMmMxZGU0NDgtNTA5Yy00NTM0LWEwODctYjA4MTQ0NTk3MjAyIiwidCI6IjUzMTVhNjkzLTM3MjktNDY0NS1hOTIyLWMxY2EwMTVjNWY1MiJ9',
    source: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/Indian-Financial-Fraud-Detection',
    folder: 'Indian-Financial-Fraud-Detection',
    fallbackImage: `${RAW_BASE}/projects/Indian-Financial-Fraud-Detection/Dashboard%20Image/Fraud%20Analytics%20Dashboard%20Image.png`,
    info: {
      tagline: 'Transaction patterns, fraud detection and financial risk analysis.',
      overview: 'Analyzed 250,000 financial transactions along with customer, card and merchant data to identify fraud patterns, transaction trends, high-risk states, card-related risks and merchant risk exposure using Python, SQL and Power BI. Built a comprehensive dashboard focused on fraud rate, transaction performance, customer behaviour and financial risk analysis.',
      objectives: [
        'Track core financial KPIs including Total Transactions, Fraud Rate, Fraud Amount and Transaction Success Rate.',
        'Analyse fraud patterns across payment methods, transaction channels, devices, cards and customer demographics.',
        'Identify high-risk states and merchant categories based on fraud exposure and fraud amount.',
        'Analyse transaction trends, customer behaviour, merchant risk and credit limit patterns.'
      ],
      insights: [
        'Fraud rate stands at 5.4% while the overall transaction success rate is 91%.',
        'Expired-card transactions emerged as the leading fraud trigger.',
        'Fraud activity increases during late-night and early-morning hours.',
        'Kerala, Odisha and Punjab show the highest fraud exposure.',
        'Hospital and Airline merchant categories account for the highest fraud amounts.'
      ],
      tech: ['Python', 'Pandas', 'NumPy', 'SQL', 'MySQL', 'Power BI', 'DAX', 'Matplotlib', 'Seaborn']
    }
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Sales Analytics',
    label: 'RETAIL ANALYTICS',
    summary: 'A decision-focused sales dashboard for category performance, regional demand and payment preferences.',
    metric: '250K transactions · customer and sales analysis',
    tags: ['Power BI', 'Python', 'SQL'],
    alt: 'E-commerce sales Power BI dashboard',
    dashboard: 'https://app.powerbi.com/view?r=eyJrIjoiNjdkNDFkMjEtN2VlYS00M2JiLTg2YjgtNTA4NWEwMmM1YzBkIiwidCI6IjUzMTVhNjkzLTM3MjktNDY0NS1hOTIyLWMxY2EwMTVjNWY1MiJ9',
    source: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/Ecommerce-Sales-Analysis',
    folder: 'Ecommerce-Sales-Analysis',
    fallbackImage: `${RAW_BASE}/projects/Ecommerce-Sales-Analysis/Ecommerce_dashboard%20page1.png`,
    info: {
      tagline: 'Sales trends and category performance analysis using Power BI.',
      overview: 'Analyzed e-commerce sales data to uncover revenue trends, category performance, regional sales patterns and payment preferences. Built an interactive Power BI dashboard to help business teams identify growth opportunities and optimise marketing strategy.',
      objectives: [
        'Track sales and profit performance across product categories.',
        'Analyse regional sales distribution across India.',
        'Identify top-selling products driving customer demand.',
        'Monitor payment method preferences and seasonal demand patterns.'
      ],
      insights: [
        'Strong seasonal demand observed across festive and peak shopping months.',
        'Home Decor generated the highest sales and profit, making it the best-performing category.',
        'South region recorded the lowest sales and requires targeted marketing campaigns.',
        'Headphones emerged as the top-selling product, indicating consistently high customer demand.',
        'Digital payment methods accounted for the majority of transactions.'
      ],
      tech: ['Python', 'Pandas', 'Power BI', 'DAX', 'Excel', 'SQL']
    }
  },
  {
    id: 'bank',
    title: 'Bank Analytics Dashboard',
    label: 'BANKING ANALYTICS',
    summary: 'A dashboard connecting customer, branch, loan and transaction analysis for banking reporting.',
    metric: 'Customer, branch and transaction performance',
    tags: ['Power BI', 'SQL', 'Python'],
    alt: 'Bank analytics dashboard',
    dashboard: 'https://app.powerbi.com/view?r=eyJrIjoiMDdjZGM2OGYtMzNjOS00OWI3LWEzOTctMzQyYmY4ZTA3Y2U2IiwidCI6IjUzMTVhNjkzLTM3MjktNDY0NS1hOTIyLWMxY2EwMTVjNWY1MiJ9',
    source: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/Bank%20Analytics',
    folder: 'Bank Analytics',
    fallbackImage: `${RAW_BASE}/projects/Bank%20Analytics/Dashboard%20Image/Bank_analytics_image%20page%201.png`,
    info: {
      tagline: 'End-to-end banking data analysis with fraud detection.',
      overview: 'Analyzed 1M+ bank transactions to identify fraud patterns, customer behaviour and branch performance. Built an interactive Power BI dashboard for executive reporting.',
      objectives: [
        'Identify high-risk transaction patterns.',
        'Analyse customer segmentation by account type.',
        'Track branch-wise performance metrics.',
        'Build an automated fraud detection pipeline.'
      ],
      insights: [
        '78% of fraud transactions occurred in amounts between ₹45,000–₹1,25,000.',
        'New accounts (under 6 months old) show 3x higher fraud probability.',
        'Metro branches handle 65% of total transaction volume.',
        'Loan default rate is highest in Q3 (monsoon season).'
      ],
      tech: ['Python', 'Pandas', 'NumPy', 'Power BI', 'DAX', 'MySQL', 'Excel', 'Matplotlib', 'Seaborn']
    }
  },
  {
    id: 'hr',
    title: 'HR Analytics Dashboard',
    label: 'WORKFORCE ANALYTICS',
    summary: 'An employee analytics project covering workforce distribution, attrition, satisfaction and salary patterns.',
    metric: '4,410 employee records · workforce insights',
    tags: ['Power BI', 'SQL', 'Python'],
    alt: 'Human resources analytics dashboard',
    dashboard: 'https://app.powerbi.com/view?r=eyJrIjoiYTY1YmQxMGMtY2M5NC00YTQ5LTk4YjItY2QyOTgxZGZkZjZjIiwidCI6IjUzMTVhNjkzLTM3MjktNDY0NS1hOTIyLWMxY2EwMTVjNWY1MiJ9',
    source: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/HR-Analytics',
    folder: 'HR-Analytics',
    fallbackImage: `${RAW_BASE}/projects/HR-Analytics/Images/HR_analytics_Dashboard.png`,
    info: {
      tagline: 'Workforce trends and employee attrition analysis.',
      overview: 'Analyzed HR employee data to identify workforce trends, employee attrition, salary distribution and performance insights using SQL, Python and Power BI. Built a comprehensive dashboard featuring department-wise distribution, job satisfaction matrix and performance rating analysis.',
      objectives: [
        'Track core HR KPIs: Total/Active Employees, Attrition Rate and Average Age.',
        'Analyse attrition and workforce distribution by department.',
        'Monitor salary distribution across different departments and roles.',
        'Evaluate age group distribution and job satisfaction levels.'
      ],
      insights: [
        'Overall attrition rate stands at 16.12% out of 4,410 total employees (3,699 active).',
        'Research & Development has the largest workforce.',
        'Average salary is also highest in the R&D department.',
        'The majority of employees belong to the 26–35 age group.'
      ],
      tech: ['Python', 'Pandas', 'SQL', 'MySQL', 'Power BI', 'DAX']
    }
  },
  {
    id: 'zomato',
    title: 'Zomato Analytics Dashboard',
    label: 'FOOD DELIVERY ANALYTICS',
    summary: 'Restaurant and delivery analysis focused on cuisine preferences, payment patterns and city performance.',
    metric: 'Restaurant operations and customer demand',
    tags: ['Power BI', 'SQL', 'Python'],
    alt: 'Zomato analytics dashboard',
    dashboard: 'https://app.powerbi.com/view?r=eyJrIjoiNmFiYjQ3MzMtMzU3Ny00OTNlLTg0ZjEtMTBjNzBkOTczNzlhIiwidCI6IjUzMTVhNjkzLTM3MjktNDY0NS1hOTIyLWMxY2EwMTVjNWY1MiJ9',
    source: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/Zomato%20Analytics',
    folder: 'Zomato Analytics',
    fallbackImage: `${RAW_BASE}/projects/Zomato%20Analytics/Dashboard_Image/Zomato_analytics.png`,
    info: {
      tagline: 'Transforming raw restaurant data into meaningful business insights.',
      overview: 'Built this Zomato Analytics Dashboard using SQL, Python, MySQL and Power BI to transform raw restaurant data into meaningful business insights. The project covers data cleaning, SQL querying, data modelling, dashboard design and business storytelling.',
      objectives: [
        'Clean and preprocess raw restaurant order data using Python.',
        'Perform in-depth analysis using MySQL queries.',
        'Build an interactive Power BI dashboard with DAX measures.',
        'Identify key business patterns in cuisine preference, payments and delivery performance.'
      ],
      insights: [
        'North Indian cuisine generated the highest number of orders.',
        'Around 75% of orders were successfully delivered.',
        'Cash & Card remained the most preferred payment method.',
        'Bangalore generated the highest revenue among all cities.',
        'Highly popular restaurants contributed the maximum orders.'
      ],
      tech: ['Python', 'MySQL', 'Power BI', 'DAX', 'SQL']
    }
  },
  {
    id: 'smoking-health',
    title: 'Synthetic Health Risk Analytics',
    label: 'EDUCATIONAL ANALYTICS',
    summary: 'A synthetic, non-clinical Power BI demonstration of smoking patterns, lifestyle factors and illustrative risk indicators.',
    metric: '30K synthetic records · educational use only',
    tags: ['Power BI', 'DAX', 'Python'],
    alt: 'Synthetic health risk analytics dashboard',
    dashboard: 'https://app.powerbi.com/view?r=eyJrIjoiMTZjZTliZjAtNTk3ZS00YWFiLTkxM2QtYTQ2ZTg2MzNmN2JjIiwidCI6IjUzMTVhNjkzLTM3MjktNDY0NS1hOTIyLWMxY2EwMTVjNWY1MiJ9',
    source: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/Smoking%20Health%20Risk%20Analytics',
    folder: 'Smoking Health Risk Analytics',
    fallbackImage: `${RAW_BASE}/projects/Smoking%20Health%20Risk%20Analytics/Dashboard%20Image/Smoking%20%26%20Health%20Analytics%20Dashboard.png`,
    info: {
      tagline: 'Synthetic smoking patterns, health-risk indicators and organ-wise analytics.',
      overview: 'Designed a Power BI healthcare analytics project using a carefully controlled 30,000-row synthetic, risk-enriched screening cohort. The project analyzes smoking status, age, gender, blood pressure, cholesterol, lifestyle patterns and illustrative organ-risk indicators across Human Body, Heart, Lungs, Liver and Kidney views. Created for educational analytics only — Healthy/Damaged labels and risk scores are synthetic indicators, not medical diagnoses.',
      objectives: [
        'Track core KPIs: Total Patients, Smoking Status Distribution, Average Risk Score, Blood Pressure and Cholesterol profiles.',
        'Analyze Never, Current and Former smoking patterns across age groups, gender and lifestyle habits.',
        'Compare smoking exposure across Human Body, Heart, Lungs, Liver and Kidney cohorts.',
        'Build an interactive experience with organ navigation, Healthy/Damaged state selection and DAX-based filtering.',
        'Explore relationships between smoking behaviour, activity, alcohol use, blood pressure, cholesterol, BMI and risk scores.'
      ],
      insights: [
        '30,000 patient records distributed unevenly across five organ-analysis cohorts for realistic comparison.',
        'Never smokers: 46.17% · Current smokers: 32.22% · Former smokers: 21.62%.',
        'The Lungs cohort has the highest Current smoker share (37%) — the strongest exposure comparison view.',
        'The Liver cohort has the highest Never smoker share (48%) and lowest Current share (29%).',
        'Healthy/Damaged states are balanced 60/40 within every Organ × Smoking Status group.'
      ],
      tech: ['Python', 'Pandas', 'NumPy', 'Power BI', 'DAX', 'Power Query', 'Data Modelling', 'Pillow']
    }
  }
];

/* ---------- DATASETS (edit here to add/change Kaggle datasets) ---------- */
const DATASETS = [
  {
    id: 'ecommerce-dataset',
    type: 'E-COMMERCE',
    title: 'Indian E-Commerce Sales Analytics',
    summary: 'A retail analytics dataset built for customer, product, order and regional sales analysis.',
    scale: '40K customers · 2K products · 250K orders',
    structure: 'Customers, Products and Sales tables',
    url: 'https://www.kaggle.com/datasets/jatinkhandelwal112/indian-e-commerce-sales-analytics-dataset',
    cover: ['images/ecommerce-dataset-cover.webp', 'images/ecommerce-dataset-cover.png']
  },
  {
    id: 'financial-fraud-dataset',
    type: 'FINANCE',
    title: 'Indian Financial Fraud Dataset',
    summary: 'A structured dataset for studying transaction patterns, fraud signals and merchant risk.',
    scale: '250K transactions',
    structure: 'Customers, Cards, Merchants and Transactions tables',
    url: 'https://www.kaggle.com/datasets/jatinkhandelwal112/indian-financial-fraud-dataset',
    cover: ['images/fraud-dataset-cover.webp', 'images/fraud-dataset-cover.png']
  },
  {
    id: 'hospital-dataset',
    type: 'HEALTHCARE',
    title: 'Gurugram Hospital Analytics',
    summary: 'A synthetic educational dataset for relational modelling, SQL practice and BI learning.',
    scale: '40K+ synthetic records and 400K+ billing rows',
    structure: 'Doctors, Patients and Transactions tables',
    url: 'https://www.kaggle.com/datasets/jatinkhandelwal112/gurugram-hospital-analytics-dataset',
    cover: ['images/hospital-dataset-cover.webp', 'images/hospital-dataset-cover.png']
  }
];

/* ---------- DATASET CASE STUDIES (merged into the Datasets section) ---------- */
const CASE_STUDIES = {
  'hospital-dataset': {
    intro: 'I engineer these synthetic datasets from scratch using Python. Because real healthcare and banking data are highly confidential under privacy laws, I program complex real-world business logic into these datasets. This allows learners to practice SQL, data modelling and BI tools on data that behaves exactly like a production environment.',
    problem: 'Real healthcare data is protected under strict privacy regulations (HIPAA/DPDP). Publicly available datasets lack the complex relational structure of a real hospital management system. I built a custom Python script to generate a 400,000+ row relational database, simulating the exact chaos, patterns and strict medical logic of a real multi-specialty hospital.',
    architecture: [
      'Designed a 3-tier relational database (Doctors, Patients, Transactions) ensuring 100% referential integrity.',
      'Separated master data (Doctors) from transactional data (Billing) to mimic standard Hospital Management Systems.',
      'Built strict primary–foreign key mappings preventing orphan records in the massive transaction table.'
    ],
    rules: [
      "Mapped 15+ diseases to exact medical specializations (e.g. 'Viral Fever' → General Physician, 'Fracture' → Orthopedics).",
      'Programmed chronological date logic: admission date is always strictly before treatment and discharge dates.',
      'Engineered dynamic billing calculations: ICU room charges dynamically multiplied by 3x compared to general wards.'
    ],
    constraints: [
      "Enforced age & gender constraints: 'Pregnancy' records computationally restricted to female patients aged 18–45.",
      'Age-weighted diseases: severe cardiac issues statistically weighted to appear primarily in the 45+ demographic.',
      'Injected controlled data chaos: intentionally added 4% missing values and inconsistent date formats (DD-MM-YYYY vs MM-DD-YYYY) to simulate real-world data entry errors.'
    ],
    structure: [
      { table: 'doctors.csv', rows: '80', desc: 'Doctor profiles, exact shift timings and specializations' },
      { table: 'patients.csv', rows: '40,600+', desc: 'Unique patient demographics and linked Doctor IDs' },
      { table: 'transactions.csv', rows: '4,10,000+', desc: 'Granular billing data for medicines, rooms and lab tests' }
    ],
    snippet: "# Logic: Mapping diseases to exact specialists & calculating discharge dates\ndef generate_patient_record(patient_id):\n    disease = random.choice(list(DISEASE_TO_SPEC.keys()))\n    assigned_doctor = get_doctor_by_spec(DISEASE_TO_SPEC[disease])\n\n    # Enforcing chronological date logic\n    admission_date = fake.date_between(start_date='-2y', end_date='today')\n    recovery_days = DISEASE_SEVERITY[disease]['min_days']\n    discharge_date = admission_date + timedelta(days=random.randint(recovery_days, recovery_days + 5))\n\n    return patient_id, disease, assigned_doctor, admission_date, discharge_date",
    challenges: [
      'Writing scalable Python code to generate 400K+ rows without memory overflow (used chunking).',
      'Balancing realistic statistical distributions so no single department looked artificially overloaded.',
      "Ensuring the injected 'dirty data' was complex enough to challenge analysts during EDA, but not unfixable."
    ],
    insights: [
      "Cardiology and Orthopedics combined generate 42% of the hospital's total revenue.",
      'Average Length of Stay (ALOS) jumps from 2.4 days to 8.7 days for ICU-admitted patients.',
      'Seasonal trend analysis revealed a 300% spike in vector-borne diseases (Dengue/Malaria) between July and September.'
    ],
    kaggle: 'https://www.kaggle.com/datasets/jatinkhandelwal112/gurugram-hospital-analytics-dataset',
    github: null
  },
  'financial-fraud-dataset': {
    intro: 'I engineer these synthetic datasets from scratch using Python. Because real healthcare and banking data are highly confidential under privacy laws, I program complex real-world business logic into these datasets. This allows learners to practice SQL, data modelling and BI tools on data that behaves exactly like a production environment.',
    problem: 'Banking transaction data with actual fraud labels is virtually impossible to access publicly due to RBI compliance. I engineered a 250,000-row dataset across 4 relational tables. Instead of randomizing fraud, I programmed specific behavioral "fraud signatures" that mimic how real financial cybercrimes occur in the Indian banking system.',
    architecture: [
      'Created a 4-table star-like schema connecting Customers, Cards, Merchants and Transactions.',
      'Maintained strict economic realism by computationally correlating customer income brackets directly with credit card limits.',
      'Tuned the transaction generator to maintain exactly a 4.8% fraud class imbalance for realistic ML training.'
    ],
    rules: [
      'Programmed geo-location anomalies: fraud flags when a customer swipes in Delhi and Mumbai within 30 minutes.',
      'Built transaction velocity algorithms: simulating stolen-card behaviour with 5+ rapid transactions under 2 minutes.',
      'Merchant risk routing: forced 65% of fraudulent volumes through high-risk categories like Crypto, Jewelry and Electronics.'
    ],
    constraints: [
      "Card status validation: hardcoded transaction failures when attempted on 'Blocked', 'Lost' or 'Expired' cards.",
      'Credit limit caps: transaction amounts never bypass the maximum assigned credit limit without triggering a high-utilization flag.',
      'Time-based constraints: skewed fraudulent transaction probability to be 6x higher between 1:00 AM and 4:00 AM.'
    ],
    structure: [
      { table: 'Cusmtomer_data.csv', rows: '~15,000', desc: 'Customer income segments, occupation and home city' },
      { table: 'Cards_Data.csv', rows: '~20,000', desc: 'Card statuses (Active, Blocked, Expired) and credit limits' },
      { table: 'merchant_table.csv', rows: '~2,000', desc: 'Merchant risk categories, geo-locations and ratings' },
      { table: 'Transaction_Data_250k.csv', rows: '250,000', desc: 'Fact table linking all entities with engineered fraud signals' }
    ],
    snippet: "# Logic: Simulating geo-location anomalies & velocity fraud\ndef is_fraudulent_transaction(cust_city, merchant_city, time_diff, amount, limit):\n    fraud_score = 0\n\n    # Geo-mismatch: POS transaction 1000km away within 1 hour\n    if cust_city != merchant_city and time_diff.seconds < 3600:\n        fraud_score += 50\n\n    # Credit limit breach: sudden 95% utilization\n    if (amount / limit) > 0.95:\n        fraud_score += 40\n\n    return 1 if fraud_score >= 80 else 0",
    challenges: [
      'Designing the complex logic required to interlink foreign keys across 4 distinct tables seamlessly.',
      'Writing geo-spatial logic to calculate realistic travel times between cities to flag impossible location hops.',
      "Avoiding 'data leakage' where the fraud pattern becomes too obvious for ML models to predict with 100% accuracy."
    ],
    insights: [
      'Transactions between 1:00 AM and 4:00 AM have a 6x higher probability of being fraudulent.',
      'Over 80% of successful fraud amounts were processed through virtual/online payment modes rather than physical POS.',
      'Customers with account age under 6 months are disproportionately targeted for velocity fraud attacks.'
    ],
    kaggle: 'https://www.kaggle.com/datasets/jatinkhandelwal112/indian-financial-fraud-dataset',
    github: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/Indian-Financial-Fraud-Detection'
  },
  'ecommerce-dataset': {
    intro: 'I engineer these synthetic datasets from scratch using Python. Because real e-commerce marketplace data contains confidential customer details, pricing strategies and transaction-level business information, I built a dataset that behaves like a production ecosystem — suitable for SQL joins, Power BI dashboards, Python EDA and retail analysis.',
    problem: 'Real e-commerce marketplace data contains confidential customer details, commercial pricing strategies and transaction-level business information. Most public datasets are simple flat files that do not reflect a production e-commerce ecosystem. I engineered a realistic Indian e-commerce dataset with 250,000 sales records across Customers, Products and Sales tables, making it suitable for SQL joins, Power BI dashboards, Python EDA, customer segmentation and retail business analysis.',
    architecture: [
      'Designed a 3-table star-like relational model with Customers and Products as master tables and Sales as the central transaction fact table.',
      'Mapped every sales record to a valid Customer_ID and Product_ID, ensuring complete referential integrity with no orphan transactions.',
      'Created 40,000 customer profiles, 2,000 product catalog records and 250,000 detailed sales transactions.',
      'Included location, age group, category, brand, payment mode, order status, coupon, review and delivery fields for multi-dimensional analysis.'
    ],
    rules: [
      'Programmed product pricing logic: Selling_Price is calculated after applying Discount_Percent and Discount_Amount to Original_Price.',
      'Calculated Order_Value using Quantity × Unit_Price, then Total_Amount using Order_Value, Shipping_Cost and Coupon_Discount.',
      'Enforced chronological delivery logic: Delivery_Date is always later than Order_Date, with windows ranging from 2 to 7 days.',
      'Generated realistic behaviour through multiple payment modes, order statuses, coupon usage, ratings, customer tiers and reviews.'
    ],
    constraints: [
      'Maintained 100% valid Customer_ID and Product_ID mappings between master tables and the 250,000-row sales fact table.',
      'Conditional coupon logic: orders without a coupon have blank Coupon_Code and zero Coupon_Discount.',
      'Kept rating and review fields partially populated to simulate real e-commerce feedback behaviour.',
      'Created diverse Indian state and city coverage for state-wise sales, city-level performance and regional demand analysis.'
    ],
    structure: [
      { table: 'customers.csv', rows: '40,000', desc: 'Customer profiles, demographics, city/state, tier, total orders and total spending' },
      { table: 'products.csv', rows: '2,000', desc: 'Product catalog with category, brand, pricing, stock, rating and review information' },
      { table: 'sales.csv', rows: '250,000', desc: 'Fact table with order/delivery dates, quantity, payment mode, coupon discount, status, ratings and total amount' }
    ],
    snippet: "# Logic: Calculating order amounts and enforcing delivery chronology\ndef generate_sales_record(order_id, customer, product):\n    order_date = fake.date_between(start_date='-2y', end_date='today')\n    quantity = random.randint(1, 3)\n    unit_price = product['Selling_Price']\n\n    # Transaction value calculation\n    order_value = round(quantity * unit_price, 2)\n    shipping_cost = calculate_shipping_cost(order_value)\n    coupon_discount = apply_coupon_discount(order_value)\n    total_amount = round(order_value + shipping_cost - coupon_discount, 2)\n\n    # Enforcing chronological logistics logic\n    delivery_date = order_date + timedelta(days=random.randint(2, 7))\n\n    return order_id, customer['Customer_ID'], product['Product_ID'], order_date, delivery_date, total_amount",
    challenges: [
      'Generating 250,000 transaction records efficiently while preserving correct Customer_ID and Product_ID relationships.',
      'Maintaining accurate pricing arithmetic across original price, discounts, quantity, shipping, coupons and final amount.',
      'Creating realistic category, brand, payment, city, state, customer-tier and order-status distributions.',
      'Balancing detailed transactional fields without making the dataset look artificially uniform.'
    ],
    insights: [
      'The dataset contains approximately ₹593.07 crore in recorded Total_Amount across 250,000 transactions.',
      'Electronics is the highest-value category, contributing approximately 72.6% of recorded transaction amount.',
      'UPI is the most used payment mode at ~51.4% of transactions, followed by Cash on Delivery at ~32.8%.',
      'Around 80.1% of orders are marked Delivered, with delivery durations of 2–7 days (avg ~4.5 days).',
      'Uttar Pradesh records the highest state-level transaction amount at approximately ₹76.84 crore.'
    ],
    kaggle: 'https://www.kaggle.com/datasets/jatinkhandelwal112/indian-e-commerce-sales-analytics-dataset',
    github: 'https://github.com/jating1416-debug/jatinanalytics-vercel/tree/main/projects/Ecommerce-Sales-Analysis'
  }
};

/* ============================================================
   Small helpers
   ============================================================ */

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function formatBytes(size) {
  if (!Number.isFinite(size)) return '';
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(0) + ' KB';
  return (size / (1024 * 1024)).toFixed(1) + ' MB';
}

function rawUrl(path) {
  return `https://raw.githubusercontent.com/${GITHUB.user}/${GITHUB.repo}/${GITHUB.branch}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

function blobUrl(path) {
  return `https://github.com/${GITHUB.user}/${GITHUB.repo}/blob/${GITHUB.branch}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

/* Minimal CSV line parser (handles quoted fields). */
function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

/* Load the first working image from a list of candidates. */
function loadImageCandidates(img, candidates, onSettled) {
  let index = 0;
  const tryNext = () => {
    if (index >= candidates.length) { onSettled && onSettled(false); return; }
    img.onload = () => { onSettled && onSettled(true); };
    img.onerror = () => { index += 1; tryNext(); };
    img.src = candidates[index++];
  };
  tryNext();
}

/* ============================================================
   Project cards
   ============================================================ */

function projectCard(project) {
  const tags = project.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('');
  return `
    <article class="project-card" data-project="${escapeHTML(project.id)}">
      <div class="project-visual">
        <span class="project-label">${escapeHTML(project.label)}</span>
        <img class="project-card-img" data-project-id="${escapeHTML(project.id)}" alt="${escapeHTML(project.alt)}" loading="lazy" decoding="async">
      </div>
      <div class="project-body">
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.summary)}</p>
        <p class="project-metric">${escapeHTML(project.metric)}</p>
        <div class="project-tags">${tags}</div>
        <div class="card-actions">
          <button class="card-embed-button" type="button" data-details-id="${escapeHTML(project.id)}">View details</button>
          <button class="card-link" type="button" data-dashboard-id="${escapeHTML(project.id)}">Live dashboard</button>
          <a class="card-link" href="${escapeHTML(project.source)}" target="_blank" rel="noopener">Source</a>
        </div>
      </div>
    </article>`;
}

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
const PROJECT_TOOL_FILTERS = ['All'];

/* Card images load automatically from the project's GitHub folder —
   whatever image file (any name) exists in projects/<folder>/ is used.
   fallbackImage is only a last resort if GitHub cannot be reached. */
const projectState = { query: '', tool: 'All' };
const dynamicImageByProject = {};

function projectMatches(project) {
  const q = projectState.query.trim().toLowerCase();
  const haystack = [project.title, project.label, project.summary, project.metric,
    ...(project.tags || []), ...((project.info && project.info.tech) || [])].join(' ').toLowerCase();
  const queryOk = !q || haystack.includes(q);
  const toolOk = projectState.tool === 'All'
    || (project.tags || []).some(tag => tag.toLowerCase() === projectState.tool.toLowerCase());
  return queryOk && toolOk;
}

function cardImageCandidates(project) {
  return [dynamicImageByProject[project.id], project.fallbackImage, `images/${project.id}-dashboard.png`].filter(Boolean);
}

function attachCardImages(scope) {
  scope.querySelectorAll('.project-card-img').forEach(img => {
    const project = PROJECTS.find(p => p.id === img.dataset.projectId);
    const visual = img.closest('.project-visual');
    if (!project || !visual) return;
    visual.classList.add('is-loading');
    loadImageCandidates(img, cardImageCandidates(project), ok => {
      visual.classList.remove('is-loading');
      if (!ok) visual.classList.add('image-unavailable');
    });
  });
}

function renderProjectGrid() {
  const projectGrid = document.getElementById('project-grid');
  if (!projectGrid) return;
  const filtered = PROJECTS.filter(projectMatches);
  projectGrid.innerHTML = filtered.length
    ? filtered.map(projectCard).join('')
    : '<p class="project-empty">No projects match. Try a different keyword or clear the filters.</p>';
  const countEl = document.getElementById('project-count');
  if (countEl) countEl.textContent = `${filtered.length} of ${PROJECTS.length} projects`;
  attachCardImages(projectGrid);
}

function initProjectSearch() {
  const input = document.getElementById('project-search');
  const filterRow = document.getElementById('project-filters');
  if (!input || !filterRow) return;

  filterRow.innerHTML = PROJECT_TOOL_FILTERS.map(tool =>
    `<button type="button" class="filter-chip${tool === 'All' ? ' is-active' : ''}" data-tool="${escapeHTML(tool)}">${escapeHTML(tool)}</button>`
  ).join('');

  let timer = null;
  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      projectState.query = input.value;
      if (input.value.trim()) trackEvent('search_projects', { query: input.value.trim() });
      renderProjectGrid();
    }, 120);
  });

  filterRow.addEventListener('click', event => {
    const chip = event.target.closest('.filter-chip');
    if (!chip) return;
    projectState.tool = chip.dataset.tool;
    filterRow.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('is-active', c === chip));
    renderProjectGrid();
  });
}

function initProjectLibrary() {
  const projectGrid = document.getElementById('project-grid');
  if (!projectGrid) return;
  renderProjectGrid();
  initProjectSearch();

  // Once the GitHub tree is known, use the first image actually present in
  // each project folder (so newly added screenshots show up automatically).
  getGitHubTree().then(tree => {
    let changed = false;
    PROJECTS.forEach(project => {
      const images = filesForProject(tree, project.folder).filter(f => IMAGE_EXTS.includes(f.ext));
      if (images.length) {
        dynamicImageByProject[project.id] = rawUrl(images[0].fullPath);
        changed = true;
      }
    });
    if (changed) renderProjectGrid();
  }).catch(() => { /* fallback images already shown */ });
}

/* ============================================================
   Dataset cards
   ============================================================ */

function datasetCard(dataset) {
  return `
    <article class="dataset-card" data-dataset="${escapeHTML(dataset.id)}">
      <div class="dataset-cover">
        <img data-candidates='${JSON.stringify(dataset.cover)}' alt="${escapeHTML(dataset.title)} dataset cover" loading="lazy" decoding="async">
      </div>
      <div class="dataset-body">
        <p class="dataset-type">${escapeHTML(dataset.type)}</p>
        <h3>${escapeHTML(dataset.title)}</h3>
        <p>${escapeHTML(dataset.summary)}</p>
        <dl>
          <div><dt>Scale</dt><dd>${escapeHTML(dataset.scale)}</dd></div>
          <div><dt>Structure</dt><dd>${escapeHTML(dataset.structure)}</dd></div>
        </dl>
        <div class="dataset-actions">
          <button class="card-embed-button" type="button" data-case-id="${escapeHTML(dataset.id)}">View case study</button>
          <a class="card-link" href="${escapeHTML(dataset.url)}" target="_blank" rel="noopener">Kaggle</a>
        </div>
      </div>
    </article>`;
}

function initDatasetLibrary() {
  const datasetGrid = document.getElementById('dataset-grid');
  if (!datasetGrid) return;
  datasetGrid.innerHTML = DATASETS.map(datasetCard).join('');
  datasetGrid.querySelectorAll('.dataset-cover img').forEach(img => {
    const candidates = JSON.parse(img.dataset.candidates || '[]');
    loadImageCandidates(img, candidates, ok => {
      if (!ok) img.closest('.dataset-cover').classList.add('cover-unavailable');
    });
  });
}

/* ============================================================
   Shared detail dialog (project details + dataset case studies)
   ============================================================ */

const detailDialog = () => document.getElementById('detail-dialog');

/* ---------- Modal system: pure fixed overlays (NO native top layer) ----------
   The native <dialog> top layer behaves inconsistently inside iframes,
   embedded previews and mobile webviews (dialog can render clipped,
   invisible, or swallow touches — page looks "locked"). So every dialog
   is rendered as a fixed overlay with its own backdrop + close logic.
   Same behaviour everywhere, on every device. */
const MODAL_IDS = ['dashboard-dialog', 'detail-dialog', 'lightbox-dialog'];
let modalDepth = 0;
let modalZ = 250;

function anyDialogOpen() {
  return MODAL_IDS.some(id => {
    const d = document.getElementById(id);
    return !!d && (d.open || d.hasAttribute('open'));
  });
}

function topDialog() {
  let top = null;
  let topZ = -1;
  MODAL_IDS.forEach(id => {
    const d = document.getElementById(id);
    if (d && (d.open || d.hasAttribute('open'))) {
      const z = parseInt(d.style.zIndex || '250', 10);
      if (z >= topZ) { topZ = z; top = d; }
    }
  });
  return top;
}

/* Derive the page scroll-lock from the ACTUAL dialog state — never from
   counter arithmetic alone. If counters ever desync, this self-heals. */
function syncModalLock() {
  if (anyDialogOpen()) {
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('dialog-open');
  } else {
    modalDepth = 0;
    document.documentElement.style.overflow = '';
    document.body.classList.remove('dialog-open');
  }
}

function openModalDialog(dialog) {
  if (!dialog) return;
  dialog.classList.add('dialog-fallback');
  dialog.setAttribute('open', '');
  dialog.style.zIndex = String(++modalZ);
  modalDepth += 1;
  syncModalLock();
}

function closeModalDialog(dialog) {
  if (dialog) {
    dialog.classList.remove('dialog-fallback');
    dialog.style.zIndex = '';
    dialog.style.transform = '';
    dialog.style.opacity = '';
    dialog.style.transition = '';
    if (dialog.hasAttribute('open')) dialog.removeAttribute('open');
    try { if (dialog.open) dialog.close(); } catch (err) {}
  }
  modalDepth = Math.max(0, modalDepth - 1);
  syncModalLock();
  /* self-heal one tick later in case state changed async */
  window.setTimeout(syncModalLock, 120);
}

function openDetailDialog(eyebrow, title) {
  const dialog = detailDialog();
  const eyebrowEl = document.getElementById('detail-dialog-eyebrow');
  const titleEl = document.getElementById('detail-dialog-title');
  const body = document.getElementById('detail-dialog-body');
  if (!dialog || !body) return;
  if (dialog.open || dialog.hasAttribute('open')) closeModalDialog(dialog);
  eyebrowEl.textContent = eyebrow;
  titleEl.textContent = title;
  body.innerHTML = '';
  body.scrollTop = 0;
  openModalDialog(dialog);
}

function closeDetailDialog() {
  closeModalDialog(detailDialog());
}

/* ---------- Deep links: #project=<id> and #case=<id> ---------- */

function detailLinkFor(kind, id) {
  const base = window.location.href.split('#')[0];
  return `${base}#${kind}=${id}`;
}

async function copyDetailLink(copyId, button) {
  const [kind, id] = copyId.split(':');
  const url = detailLinkFor(kind, id);
  trackEvent('copy_link', { link_kind: kind, link_id: id });
  try {
    await navigator.clipboard.writeText(url);
  } catch (err) {
    const textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (e2) { /* ignore */ }
    textarea.remove();
  }
  const original = button.textContent;
  button.textContent = 'Link copied ✓';
  window.setTimeout(() => { button.textContent = original; }, 1600);
}

function handleDeepLink() {
  const match = window.location.hash.match(/^#(?:project|case)=([\w-]+)/);
  if (!match) return;
  const kind = window.location.hash.startsWith('#case') ? 'case' : 'project';
  const id = match[1];
  window.setTimeout(() => {
    if (kind === 'project') openProjectDetails(id);
    else openCaseStudy(id);
  }, 250);
}

/* ---------- GitHub tree (cached like the original site) ---------- */

async function getGitHubTree() {
  const DATA_KEY = 'v2_gh_tree';
  const TIME_KEY = 'v2_gh_tree_time';
  const MAX_AGE = 30 * 60 * 1000; // 30 minutes — new files pushed to GitHub appear within one refresh

  const cached = localStorage.getItem(DATA_KEY);
  const cachedTime = parseInt(localStorage.getItem(TIME_KEY) || '0', 10);

  if (cached && Date.now() - cachedTime < MAX_AGE) {
    try { return JSON.parse(cached); } catch (e) { /* fall through */ }
  }

  const res = await fetch(TREE_API);
  if (!res.ok) throw new Error(`GitHub API error (${res.status})`);
  const data = await res.json();
  const tree = data.tree || [];
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(tree));
    localStorage.setItem(TIME_KEY, String(Date.now()));
  } catch (e) { /* storage full — ignore */ }
  return tree;
}

function filesForProject(tree, folder) {
  const prefix = `projects/${folder}/`;
  return tree
    .filter(item => item.type === 'blob' && item.path.startsWith(prefix))
    .map(item => {
      const relativePath = item.path.slice(prefix.length);
      const name = relativePath.split('/').pop();
      const ext = name.split('.').pop().toLowerCase();
      return {
        fullPath: item.path,
        relativePath,
        name,
        ext,
        size: item.size
      };
    });
}

/* Any file type dropped into a project folder shows up in its details dialog. */
const FILE_GROUPS = [
  { key: 'code', label: 'Code & analysis', exts: ['py', 'ipynb', 'sql', 'txt'], icon: '⌘' },
  { key: 'data', label: 'Data files', exts: ['csv', 'xlsx', 'xls'], icon: '▤' },
  { key: 'report', label: 'Power BI reports', exts: ['pbix'], icon: '◫' },
  { key: 'other', label: 'Other files', exts: null, icon: '·' } // catch-all
];

function groupFiles(files) {
  const groups = {};
  files.forEach(file => {
    const group = FILE_GROUPS.find(g => g.exts === null || g.exts.includes(file.ext));
    if (group) (groups[group.key] = groups[group.key] || []).push(file);
  });
  return groups;
}

function fileChipHTML(file) {
  return `
    <a class="file-chip" href="${blobUrl(file.fullPath)}" target="_blank" rel="noopener" title="View on GitHub">
      <span class="file-chip-ext">${escapeHTML(file.ext.toUpperCase())}</span>
      <span class="file-chip-name">${escapeHTML(file.name)}</span>
      <span class="file-chip-size">${formatBytes(file.size)}</span>
    </a>`;
}

/* ---------- CSV preview + stats (same idea as the old site) ---------- */

async function fetchCsvPreview(path) {
  const res = await fetch(rawUrl(path), { headers: { 'Range': 'bytes=0-18000' } });
  if (!res.ok && res.status !== 206) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return null;
  const header = parseCsvLine(lines[0]);
  const rows = lines.slice(1, 13).map(parseCsvLine);
  return { header, rows };
}

function computeStats(header, rows) {
  const numericCols = [];
  header.forEach((name, colIdx) => {
    const values = rows
      .map(row => parseFloat(row[colIdx]))
      .filter(v => Number.isFinite(v));
    if (values.length > rows.length * 0.5) numericCols.push({ name, values });
  });
  if (numericCols.length === 0) return null;
  const shown = numericCols.slice(0, 8);
  const labels = ['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max'];
  const data = labels.map(label => {
    const row = [label];
    shown.forEach(col => {
      const sorted = [...col.values].sort((a, b) => a - b);
      const n = sorted.length;
      let val;
      if (label === 'count') val = n;
      else if (label === 'mean') val = (sorted.reduce((a, b) => a + b, 0) / n).toFixed(2);
      else if (label === 'std') {
        const mean = sorted.reduce((a, b) => a + b, 0) / n;
        val = Math.sqrt(sorted.reduce((a, b) => a + (b - mean) ** 2, 0) / n).toFixed(2);
      } else val = sorted[Math.floor(n * ({ 'min': 0, '25%': 0.25, '50%': 0.5, '75%': 0.75, 'max': 1 }[label]))]?.toFixed(2);
      row.push(val);
    });
    return row;
  });
  return { headers: ['stat', ...shown.map(c => c.name)], data };
}

function dataTableHTML(headers, rows, emptyText) {
  if (!rows.length) return `<p class="detail-note">${escapeHTML(emptyText || 'No data available.')}</p>`;
  const thead = headers.map(h => `<th>${escapeHTML(h)}</th>`).join('');
  const tbody = rows.map(r => `<tr>${r.map(c => `<td>${escapeHTML(c ?? '')}</td>`).join('')}</tr>`).join('');
  return `
    <div class="detail-table-wrap">
      <table class="detail-table">
        <thead><tr>${thead}</tr></thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>`;
}

function detailListHTML(items, ordered) {
  const itemsHtml = items.map(item => `<li>${escapeHTML(item)}</li>`).join('');
  return ordered
    ? `<ol class="detail-list">${itemsHtml}</ol>`
    : `<ul class="detail-list">${itemsHtml}</ul>`;
}

/* ---------- Project details ---------- */

function projectDetailsSkeleton(project) {
  const info = project.info || {};
  const techChips = (info.tech || []).map(t => `<span>${escapeHTML(t)}</span>`).join('');
  return `
    <section class="detail-section">
      <p class="detail-tagline">${escapeHTML(info.tagline || project.summary)}</p>
      <p class="detail-overview">${escapeHTML(info.overview || project.summary)}</p>
      <div class="detail-tech">${techChips}</div>
    </section>
    <div class="detail-two-col">
      ${info.objectives && info.objectives.length ? `
      <section class="detail-section">
        <h3>Objectives</h3>
        ${detailListHTML(info.objectives, true)}
      </section>` : ''}
      ${info.insights && info.insights.length ? `
      <section class="detail-section">
        <h3>Key insights</h3>
        ${detailListHTML(info.insights)}
      </section>` : ''}
    </div>
    <section class="detail-section" id="pd-files-section">
      <h3>Project files</h3>
      <p class="detail-note">Loading file list from GitHub…</p>
    </section>
    <section class="detail-section" id="pd-data-section">
      <h3>Data preview</h3>
      <p class="detail-note">Loading live data preview…</p>
    </section>
    <section class="detail-section" id="pd-gallery-section">
      <h3>Dashboard visuals</h3>
      <p class="detail-note">Loading visuals…</p>
    </section>
    <div class="detail-footer-actions">
      <button class="detail-back-link" type="button" data-back-to-work>&#8592; Back to projects</button>
      <button class="button button-secondary" type="button" data-dashboard-id="${escapeHTML(project.id)}">Open live dashboard</button>
      <a class="button button-primary" href="${escapeHTML(project.source)}" target="_blank" rel="noopener">Open source on GitHub</a>
      <button class="detail-copy-link" type="button" data-copy-id="project:${escapeHTML(project.id)}">Copy project link</button>
    </div>`;
}

async function loadProjectLiveData(project) {
  const filesHost = document.getElementById('pd-files-section');
  const dataHost = document.getElementById('pd-data-section');
  const galleryHost = document.getElementById('pd-gallery-section');

  let tree;
  try {
    tree = await getGitHubTree();
  } catch (err) {
    const stale = (() => {
      try { return JSON.parse(localStorage.getItem('v2_gh_tree')); } catch (e) { return null; }
    })();
    if (!stale) {
      const msg = 'Live data is temporarily unavailable (GitHub could not be reached).';
      if (filesHost) filesHost.innerHTML = `<h3>Project files</h3><p class="detail-note">${msg} <a href="${escapeHTML(project.source)}" target="_blank" rel="noopener">Browse all files on GitHub →</a></p>`;
      if (dataHost) dataHost.innerHTML = `<h3>Data preview</h3><p class="detail-note">${msg}</p>`;
      if (galleryHost) galleryHost.remove();
      return;
    }
    tree = stale;
  }

  const files = filesForProject(tree, project.folder);
  const groups = groupFiles(files);
  const images = files.filter(f => ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(f.ext));
  const csvFiles = files.filter(f => f.ext === 'csv');

  /* --- Files --- */
  if (filesHost) {
    const groupHTML = FILE_GROUPS.map(group => {
      const list = groups[group.key] || [];
      if (!list.length) return '';
      return `
        <div class="file-group">
          <p class="file-group-label">${escapeHTML(group.label)}</p>
          <div class="file-chips">${list.map(fileChipHTML).join('')}</div>
        </div>`;
    }).join('');
    filesHost.innerHTML = `<h3>Project files</h3>${groupHTML || '<p class="detail-note">No source files found in this project folder.</p>'}`;
  }

  /* --- Gallery --- */
  if (galleryHost) {
    if (images.length) {
      const thumbs = images.map(img => `
        <div class="gallery-thumb" title="${escapeHTML(img.name)} (click to enlarge)">
          <img src="${rawUrl(img.fullPath)}" alt="${escapeHTML(img.name)}" loading="lazy">
        </div>`).join('');
      galleryHost.innerHTML = `<h3>Dashboard visuals</h3><div class="gallery-grid">${thumbs}</div>`;
    } else {
      galleryHost.remove();
    }
  }

  /* --- Data preview (first 3 CSVs, sequentially) --- */
  if (dataHost) {
    if (!csvFiles.length) {
      dataHost.innerHTML = `<h3>Data preview</h3><p class="detail-note">No CSV data files in this project folder.</p>`;
      return;
    }
    const previews = csvFiles.slice(0, 3);
    const extra = csvFiles.length - previews.length;
    dataHost.innerHTML = `<h3>Data preview</h3><p class="detail-note">Reading first rows from ${escapeHTML(previews.map(c => c.name).join(', '))}${extra > 0 ? ` (+${extra} more in the folder)` : ''}…</p>`;
    let html = '';
    for (const csv of previews) {
      try {
        const parsed = await fetchCsvPreview(csv.fullPath);
        if (!parsed) {
          html += `<div class="data-preview"><p class="detail-note">${escapeHTML(csv.name)} — not enough rows to preview.</p></div>`;
          continue;
        }
        const stats = computeStats(parsed.header, parsed.rows);
        html += `
          <div class="data-preview">
            <p class="data-preview-name">${escapeHTML(csv.name)} <span>· first ${parsed.rows.length} of ~${(csv.size / 1024).toFixed(0)} KB read</span></p>
            ${dataTableHTML(parsed.header, parsed.rows)}
            ${stats ? `<p class="data-preview-name" style="margin-top:14px">Quick statistics (sample)</p>${dataTableHTML(stats.headers, stats.data)}` : ''}
          </div>`;
      } catch (err) {
        html += `<div class="data-preview"><p class="detail-note">${escapeHTML(csv.name)} — preview could not be loaded right now.</p></div>`;
      }
    }
    dataHost.innerHTML = `<h3>Data preview</h3>${html}`;
  }
}

function openProjectDetails(projectId) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return;
  trackEvent('view_project_details', { project_id: projectId });
  openDetailDialog('PROJECT DETAILS', project.title);
  const body = document.getElementById('detail-dialog-body');
  if (!body) return;
  body.innerHTML = projectDetailsSkeleton(project);
  loadProjectLiveData(project);
}

/* ---------- Dataset case study ---------- */

function caseStudyHTML(datasetId, dataset) {
  const study = CASE_STUDIES[datasetId];
  if (!study) return '';
  const structRows = study.structure.map(s => `<tr><td><code>${escapeHTML(s.table)}</code></td><td>${escapeHTML(s.rows)}</td><td>${escapeHTML(s.desc)}</td></tr>`).join('');
  const linkButtons = `
    <a class="button button-primary" href="${escapeHTML(study.kaggle)}" target="_blank" rel="noopener">Open on Kaggle</a>
    ${study.github ? `<a class="button button-secondary" href="${escapeHTML(study.github)}" target="_blank" rel="noopener">View source code</a>` : ''}`;
  return `
    ${dataset && dataset.cover ? `<img class="case-cover" data-candidates='${JSON.stringify(dataset.cover)}' alt="${escapeHTML(dataset.title)} dataset cover">` : ''}
    <section class="detail-section">
      <h3>About this dataset</h3>
      <p class="detail-overview">${escapeHTML(study.intro)}</p>
    </section>
    <section class="detail-section">
      <h3>Problem statement</h3>
      <p class="detail-overview">${escapeHTML(study.problem)}</p>
    </section>
    <div class="detail-two-col">
      <section class="detail-section">
        <h3>Architecture logic</h3>
        ${detailListHTML(study.architecture)}
      </section>
      <section class="detail-section">
        <h3>Generation rules</h3>
        ${detailListHTML(study.rules)}
      </section>
    </div>
    <section class="detail-section">
      <h3>Realistic constraints</h3>
      ${detailListHTML(study.constraints)}
    </section>
    <section class="detail-section">
      <h3>Dataset structure</h3>
      <div class="detail-table-wrap">
        <table class="detail-table">
          <thead><tr><th>File</th><th>Rows</th><th>Contents</th></tr></thead>
          <tbody>${structRows}</tbody>
        </table>
      </div>
    </section>
    <section class="detail-section">
      <h3>Generator logic (Python)</h3>
      <pre class="code-block"><code>${escapeHTML(study.snippet)}</code></pre>
    </section>
    <div class="detail-two-col">
      <section class="detail-section">
        <h3>Challenges</h3>
        ${detailListHTML(study.challenges)}
      </section>
      <section class="detail-section">
        <h3>Key insights from the data</h3>
        ${detailListHTML(study.insights)}
      </section>
    </div>
    <div class="detail-footer-actions">${linkButtons}<button class="detail-copy-link" type="button" data-copy-id="case:${escapeHTML(datasetId)}">Copy case study link</button></div>`;
}

function openCaseStudy(datasetId) {
  const dataset = DATASETS.find(d => d.id === datasetId);
  if (!dataset) return;
  trackEvent('view_case_study', { dataset_id: datasetId });
  openDetailDialog('DATASET CASE STUDY', dataset.title);
  const body = document.getElementById('detail-dialog-body');
  if (!body) return;
  body.innerHTML = caseStudyHTML(datasetId, dataset);
  body.querySelectorAll('.case-cover').forEach(img => {
    loadImageCandidates(img, JSON.parse(img.dataset.candidates || '[]'));
  });
}

function initDetailDialog() {
  const dialog = detailDialog();
  const closeButton = document.getElementById('detail-dialog-close');
  if (!dialog) return;
  if (closeButton) closeButton.addEventListener('click', closeDetailDialog);
  dialog.addEventListener('cancel', () => { closeModalDialog(dialog); });
}

function initDetailTriggers() {
  document.body.addEventListener('click', event => {
    const backTrigger = event.target.closest('[data-back-to-work]');
    if (backTrigger) {
      closeDetailDialog();
      if (/^#(?:project|case)=/.test(window.location.hash)) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      window.setTimeout(() => {
        const work = document.getElementById('work');
        if (work) work.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
      return;
    }
    const copyTrigger = event.target.closest('[data-copy-id]');
    if (copyTrigger) { copyDetailLink(copyTrigger.dataset.copyId, copyTrigger); return; }
    const detailsTrigger = event.target.closest('[data-details-id]');
    if (detailsTrigger) {
      openProjectDetails(detailsTrigger.dataset.detailsId);
      return;
    }
    const caseTrigger = event.target.closest('[data-case-id]');
    if (caseTrigger) openCaseStudy(caseTrigger.dataset.caseId);
  });
}

/* ============================================================
   Lightbox (project images, dashboard visuals, profile photo)
   ============================================================ */

function openLightbox(src, caption) {
  const dialog = document.getElementById('lightbox-dialog');
  const img = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  if (!dialog || !img) return;
  img.src = src;
  img.alt = caption || 'Image preview';
  if (captionEl) captionEl.textContent = caption || '';
  openModalDialog(dialog);
}

function closeLightbox() {
  closeModalDialog(document.getElementById('lightbox-dialog'));
}

function initLightbox() {
  const dialog = document.getElementById('lightbox-dialog');
  const closeButton = document.getElementById('lightbox-close');
  if (!dialog) return;
  if (closeButton) closeButton.addEventListener('click', closeLightbox);
  dialog.addEventListener('cancel', () => { closeLightbox(); });

  document.body.addEventListener('click', event => {
    const profileImg = event.target.closest('#profile-photo');
    if (profileImg && !profileImg.hidden && profileImg.currentSrc) {
      openLightbox(profileImg.currentSrc, 'Jatin Kumar — Data Analyst');
      return;
    }
    const cardImg = event.target.closest('.project-card-img');
    if (cardImg && cardImg.currentSrc) {
      const project = PROJECTS.find(p => p.id === cardImg.dataset.projectId);
      openLightbox(cardImg.currentSrc, project ? `${project.title} — dashboard screenshot` : 'Dashboard screenshot');
      return;
    }
    const thumbImg = event.target.closest('.gallery-thumb img');
    if (thumbImg && thumbImg.currentSrc) {
      openLightbox(thumbImg.currentSrc, thumbImg.alt || 'Dashboard visual');
    }
  });
}

/* ============================================================
   Power BI dashboard dialog
   ============================================================ */

function initDashboardDialog() {
  const dialog = document.getElementById('dashboard-dialog');
  const frame = document.getElementById('dashboard-iframe');
  const title = document.getElementById('dashboard-dialog-title');
  const fullLink = document.getElementById('dashboard-full-link');
  const closeButton = document.getElementById('dashboard-dialog-close');
  if (!dialog || !frame || !title || !fullLink || !closeButton) return;

  const closeDialog = () => {
    closeModalDialog(dialog);
    frame.src = 'about:blank';
  };

  document.body.addEventListener('click', event => {
    const trigger = event.target.closest('[data-dashboard-id]');
    if (!trigger) return;
    const project = PROJECTS.find(item => item.id === trigger.dataset.dashboardId);
    if (!project) return;
    trackEvent('view_live_dashboard', { project_id: project.id });
    title.textContent = project.title;
    fullLink.href = project.dashboard;
    frame.src = project.dashboard;
    if (dialog.open || dialog.hasAttribute('open')) closeModalDialog(dialog);
    openModalDialog(dialog);
  });

  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', () => {
    closeModalDialog(dialog);
    window.setTimeout(() => { frame.src = 'about:blank'; }, 0);
  });
}

/* ============================================================
   Profile photo auto-loader
   ============================================================ */

function initProfilePhoto() {
  const image = document.getElementById('profile-photo');
  const frame = document.querySelector('.profile-photo-frame');
  if (!image || !frame) return;

  const candidates = [
    'assets/profile-photo.webp',
    'assets/profile-photo.png',
    'assets/profile-photo.jpg',
    'assets/profile-photo.jpeg'
  ];
  let index = 0;

  const tryNextPhoto = () => {
    if (index >= candidates.length) {
      image.removeAttribute('src');
      return;
    }
    const source = candidates[index++];
    image.onload = () => {
      image.hidden = false;
      frame.classList.add('is-loaded');
    };
    image.onerror = tryNextPhoto;
    image.src = source;
  };
  tryNextPhoto();
}

/* ============================================================
   Animated stat counters
   ============================================================ */

function initCounters() {
  const targets = document.querySelectorAll('[data-count]');
  if (!targets.length) return;

  const animate = el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 900;
    const start = performance.now();
    el.textContent = '0' + suffix;
    const step = now => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   Scroll progress bar
   ============================================================ */

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ============================================================
   Copy-email quick action
   ============================================================ */

function initCopyEmail() {
  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.copyEmail;
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try { document.execCommand('copy'); } catch (e2) { /* ignore */ }
        textarea.remove();
      }
      trackEvent('copy_email', { email });
      const original = btn.textContent;
      btn.textContent = 'Copied ✓';
      window.setTimeout(() => { btn.textContent = original; }, 1600);
    });
  });
}

/* ============================================================
   Keyboard shortcuts (" / " focuses project search)
   ============================================================ */

function initKeyboardShortcuts() {
  const search = document.getElementById('project-search');
  if (!search) return;
  document.addEventListener('keydown', event => {
    const active = document.activeElement;
    const typing = active && /input|textarea|select/i.test(active.tagName);
    if (event.key === '/' && !typing) {
      event.preventDefault();
      search.scrollIntoView({ behavior: 'smooth', block: 'center' });
      search.focus();
    } else if (event.key === 'Escape' && active === search) {
      search.blur();
    }
  });
}

/* ============================================================
   Analytics event tracking (GA4)
   ============================================================ */

function trackEvent(name, params) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  } catch (err) { /* analytics must never break the page */ }
}

/* ============================================================
   Mobile navigation
   ============================================================ */

/* ---------- DARK MODE ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}
function initModalSelfHeal() {
  let t = 0;
  const maybe = () => {
    window.clearTimeout(t);
    t = window.setTimeout(syncModalLock, 150);
  };
  document.addEventListener('click', maybe, true);
  document.addEventListener('keydown', maybe, true);
  document.addEventListener('touchend', maybe, true);
  window.addEventListener('resize', maybe);
  MODAL_IDS.forEach(id => {
    const d = document.getElementById(id);
    if (d) d.addEventListener('close', () => window.setTimeout(syncModalLock, 30));
  });
  /* global Escape: closes any open dialog from anywhere */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    MODAL_IDS.forEach(id => {
      const d = document.getElementById(id);
      if (d && (d.open || d.hasAttribute('open'))) closeModalDialog(d);
    });
  }, true);
  /* tap/click anywhere OUTSIDE the top dialog closes it (backdrop behaviour) */
  document.addEventListener('pointerdown', e => {
    const top = topDialog();
    if (!top) return;
    if (top.contains(e.target)) return;
    closeModalDialog(top);
  }, true);
}

/* Swipe the dialog header down to dismiss (mobile-native close gesture) */
function initDialogSwipeClose() {
  MODAL_IDS.forEach(id => {
    const d = document.getElementById(id);
    if (!d) return;
    const header = d.querySelector('.dialog-header');
    if (!header) return;
    let startY = null;
    header.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
      d.style.transition = '';
    }, { passive: true });
    header.addEventListener('touchmove', e => {
      if (startY === null) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 0) {
        d.style.transition = 'none';
        d.style.transform = `translateY(${Math.min(dy, 170)}px)`;
        d.style.opacity = String(Math.max(0, 1 - dy / 280));
      }
    }, { passive: true });
    header.addEventListener('touchend', e => {
      if (startY === null) return;
      const endY = e.changedTouches.length ? e.changedTouches[0].clientY : startY;
      const dy = endY - startY;
      startY = null;
      if (dy > 70) {
        d.style.transition = 'transform .18s ease, opacity .18s ease';
        d.style.transform = 'translateY(70px)';
        d.style.opacity = '0';
        window.setTimeout(() => {
          d.style.transform = '';
          d.style.opacity = '';
          d.style.transition = '';
          closeModalDialog(d);
        }, 170);
      } else {
        d.style.transition = 'transform .15s ease, opacity .15s ease';
        d.style.transform = '';
        d.style.opacity = '';
        window.setTimeout(() => { d.style.transition = ''; }, 160);
      }
    }, { passive: true });
  });
}

function initDarkMode() {
  let stored = null;
  try { stored = localStorage.getItem('jatin-theme'); } catch (e) {}
  applyTheme(stored === 'dark' ? 'dark' : 'light');
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('jatin-theme', next); } catch (e) {}
    trackEvent('theme_toggle', { theme: next });
  });
}

/* ---------- COMMAND PALETTE (Ctrl+K) ---------- */
const CMDK_SECTIONS = [
  { label: 'About', target: 'about' },
  { label: 'My Journey', target: 'journey' },
  { label: 'Projects', target: 'work' },
  { label: 'Process', target: 'process' },
  { label: 'Skills', target: 'skills' },
  { label: 'Resume & Education', target: 'resume' },
  { label: 'Datasets & Case Studies', target: 'datasets' },
  { label: 'Contact', target: 'contact' }
];
function buildCmdkItems() {
  const items = CMDK_SECTIONS.map(s => ({ kind: 'section', label: s.label, hint: 'Go to section', target: s.target }));
  PROJECTS.forEach(p => items.push({ kind: 'project', label: p.title, hint: p.metric || 'Project details', id: p.id }));
  DATASETS.forEach(d => items.push({ kind: 'dataset', label: d.title, hint: 'Case study · ' + d.type, id: d.id }));
  items.push(
    { kind: 'action', label: 'Copy email address', hint: 'jating1416@gmail.com', action: 'copy-email' },
    { kind: 'action', label: 'Download resume (PDF)', hint: 'Action', action: 'resume' },
    { kind: 'action', label: 'Toggle dark mode', hint: 'Action', action: 'theme' },
    { kind: 'action', label: 'Ask portfolio assistant', hint: 'Action', action: 'assistant' }
  );
  return items;
}
function initCommandPalette() {
  const overlay = document.getElementById('cmdk');
  const input = document.getElementById('cmdk-input');
  const list = document.getElementById('cmdk-list');
  const opener = document.getElementById('cmdk-open');
  if (!overlay || !input || !list) return;
  const items = buildCmdkItems();
  const kindLabel = { section: 'Section', project: 'Project', dataset: 'Dataset', action: 'Action' };
  let visible = [];
  let activeIndex = 0;
  let isOpen = false;

  function render(query) {
    const q = String(query || '').trim().toLowerCase();
    visible = items
      .map((it, i) => {
        const hay = (it.label + ' ' + (it.hint || '') + ' ' + it.kind).toLowerCase();
        let score = 0;
        if (q) {
          score = it.label.toLowerCase().startsWith(q) ? 2 : (hay.includes(q) ? 1 : -1);
        }
        return { it, i, score };
      })
      .filter(r => r.score >= 0)
      .sort((a, b) => (b.score - a.score) || (a.i - b.i))
      .slice(0, 8)
      .map(r => r.it);
    activeIndex = 0;
    list.innerHTML = visible.length
      ? visible.map((it, idx) => (
        `<li role="option" aria-selected="${idx === 0}" data-cmdk-index="${idx}" class="${idx === 0 ? 'is-active' : ''}">` +
        `<span class="cmdk-kind">${kindLabel[it.kind]}</span>` +
        `<span class="cmdk-label">${escapeHTML(it.label)}</span>` +
        (it.hint ? `<span class="cmdk-hint">${escapeHTML(it.hint)}</span>` : '') +
        `</li>`
      )).join('')
      : '<li class="cmdk-empty">No matches — try "zomato", "skills" or "email"</li>';
  }

  function closeCmdk() {
    if (!isOpen) return;
    isOpen = false;
    overlay.hidden = true;
    input.value = '';
    document.body.classList.remove('cmdk-open');
  }

  function run(item) {
    if (!item) return;
    closeCmdk();
    trackEvent('command_palette', { kind: item.kind, label: item.label });
    if (item.kind === 'section') {
      const el = document.getElementById(item.target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (item.kind === 'project') {
      openProjectDetails(item.id);
    } else if (item.kind === 'dataset') {
      openCaseStudy(item.id);
    } else if (item.kind === 'action') {
      const byAction = {
        'copy-email': '[data-copy-email]',
        'resume': '.nav-resume',
        'theme': '#theme-toggle',
        'assistant': '#assistant-toggle'
      };
      const el = document.querySelector(byAction[item.action]);
      if (el) el.click();
    }
  }

  function openCmdk() {
    if (isOpen) return;
    isOpen = true;
    overlay.hidden = false;
    document.body.classList.add('cmdk-open');
    requestAnimationFrame(() => { input.focus(); render(''); });
  }

  function moveActive(delta) {
    if (!visible.length) return;
    activeIndex = (activeIndex + delta + visible.length) % visible.length;
    Array.from(list.children).forEach((li, idx) => {
      li.classList.toggle('is-active', idx === activeIndex);
      li.setAttribute('aria-selected', String(idx === activeIndex));
    });
    const active = list.children[activeIndex];
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) closeCmdk(); });
  if (opener) opener.addEventListener('click', openCmdk);
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); run(visible[activeIndex]); }
  });
  list.addEventListener('click', e => {
    const li = e.target.closest('li[data-cmdk-index]');
    if (li) run(visible[Number(li.dataset.cmdkIndex)]);
  });
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k') {
      e.preventDefault();
      if (isOpen) closeCmdk(); else openCmdk();
    } else if (e.key === 'Escape' && isOpen) {
      closeCmdk();
    }
  });
}

function initMobileNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
  });
}

/* ============================================================
   Scroll reveal
   ============================================================ */

function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(element => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  elements.forEach(element => observer.observe(element));
}

/* ============================================================
   Active navigation
   ============================================================ */

function initActiveNavigation() {
  const navLinks = [...document.querySelectorAll('.primary-nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-25% 0px -65% 0px', threshold: [0.1, 0.4, 0.7] });
  sections.forEach(section => observer.observe(section));
}

/* ============================================================
   Contact form (Web3Forms)
   ============================================================ */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (form.elements.botcheck?.checked) return;

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending message';
    status.textContent = '';
    status.classList.remove('is-error');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Unable to send the message.');
      form.reset();
      status.textContent = 'Message sent. I will get back to you soon.';
      trackEvent('contact_form_submitted');
    } catch (error) {
      status.textContent = 'Message could not be sent. Please email jating1416@gmail.com directly.';
      status.classList.add('is-error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send message';
    }
  });
}

/* ============================================================
   Portfolio assistant
   ============================================================ */

/* ============================================================
   Portfolio assistant — intent scoring (more powerful)
   ============================================================ */

const ASSISTANT_PROMPTS = {
  projects: 'Tell me about the projects',
  details: 'How do I see project details and the data preview?',
  dashboards: 'Where are the live dashboards?',
  datasets: 'What datasets are published?',
  'case-study': 'Tell me about the case studies',
  skills: 'What skills and tools do you use?',
  resume: 'Tell me about the resume and education',
  certificate: 'Tell me about the certificate',
  contact: 'How can I contact you?'
};

const ASSISTANT_TOPICS = [
  {
    keywords: ['power bi', 'powerbi', 'pbix', 'dashboard', 'live report', 'embed'],
    answer: 'Every project has a published Power BI dashboard. Click Live dashboard on the card — it opens inside the portfolio, and you can pop it out in a new tab. The .pbix report files are also listed under each project\'s View details section.'
  },
  {
    keywords: ['details', 'detail', 'data preview', 'preview', 'csv', 'row', 'column', 'statistic', 'file', 'code'],
    answer: 'Click View details on any project card. It opens the full breakdown: overview, objectives, key insights, every source file (Python, SQL, PBIX, CSV), a live preview of the actual data with quick statistics, and all dashboard visuals. Everything is read straight from the GitHub project folder — add a file there and it appears here.'
  },
  {
    keywords: ['dataset', 'kaggle', 'case study', 'case studies', 'hospital', 'gurugram'],
    answer: 'Three datasets are published on Kaggle: Indian E-Commerce Sales (250K orders), Indian Financial Fraud (250K transactions) and Gurugram Hospital Analytics (40K+ patients, 400K+ billing rows). Click View case study on any dataset card to read how each one was engineered — architecture, generation rules, the Python generator logic and key insights.'
  },
  {
    keywords: ['certificate', 'certification', 'course', 'bootcamp', 'training', 'udemy', 'krish'],
    answer: 'I completed an 89-hour Complete Data Analyst Bootcamp (Krish Naik, Jayant Topnani & KRISHAI Technologies, Udemy) on 11 July 2026. It is in the Resume section with a Verify-on-Udemy link, and the certificate PDF can be viewed and downloaded there.'
  },
  {
    keywords: ['resume', 'cv', 'education', 'degree', 'mba', 'bca', 'diploma', 'university', 'qualification', 'study'],
    answer: 'Professional experience: 2 years as a Registered Pharmacist (dispensing, patient counselling and pharmacy operations). Education: MBA in Operations Management (Vivekananda Global University, pursuing), BCA (Sikkim Alpine University, 2022–2025) and Diploma in Pharmacy (Apeejay Stya University, 2020–2022). The full resume PDF is in the navbar and the Resume section.'
  },
  {
    keywords: ['skill', 'skills', 'tool', 'tools', 'stack', 'sql', 'python', 'excel', 'pandas', 'numpy', 'dax', 'mysql', 'technology'],
    answer: 'The core toolkit: Power BI + DAX, SQL/MySQL, Python (Pandas, NumPy), Excel and Matplotlib/Seaborn. The focus is the full pipeline — cleaning, data modelling, KPI analysis and dashboard storytelling. The Skills section has a card for each area.'
  },
  {
    keywords: ['process', 'method', 'methodology', 'approach', 'workflow', 'eda', 'steps', 'how do you work'],
    answer: 'Every project follows the same 6 steps: Understand the business problem → Clean the data → Exploratory analysis → Analyse (KPIs, segments, trends) → Visualise in Power BI → Turn findings into recommendations. The full breakdown is in the Analytics Process section.'
  },
  {
    keywords: ['contact', 'email', 'mail', 'reach', 'hire', 'hiring', 'opportunity', 'opportunities', 'job', 'jobs', 'internship', 'intern', 'apply', 'career', 'remote', 'available', 'salary'],
    answer: 'You can email jating1416@gmail.com directly or use the contact form in the Contact section — it lands straight in the inbox. Jatin — with 2 years of registered pharmacist experience — is open to entry-level Data Analyst, BI Analyst, internship and remote opportunities.'
  },
  {
    keywords: ['project', 'projects', 'work', 'portfolio', 'built', 'supply chain', 'zomato', 'bank', 'fraud', 'hr'],
    answer: 'There are 7 end-to-end projects: Supply Chain & Logistics, Indian Financial Fraud, E-Commerce Sales, Bank Analytics, HR Analytics, Zomato and Synthetic Health Risk. Use the search box above the grid (try "fraud" or "DAX"), and each card has View details, Live dashboard and Source.'
  },
  {
    keywords: ['about', 'who', 'background', 'self', 'introduce', 'jatin', 'experience', 'fresher'],
    answer: 'Jatin Kumar is a fresher Data Analyst from India, actively seeking his first analyst job. His first profession was pharmacy — he worked as a Registered Pharmacist for 2 years — before he moved into self-taught data analytics. He builds end-to-end projects across operations, finance, retail, HR and healthcare with Python, SQL and Power BI, and is currently pursuing an MBA in Operations Management.'
  },
  {
    keywords: ['hello', 'hi', 'hey', 'hii', 'namaste', 'good morning', 'good evening', 'good afternoon'],
    answer: 'Hello! 👋 Ask me anything about the projects, data previews, live dashboards, Kaggle datasets, skills, resume, certificate or how to get in touch. The quick buttons below are a good start.'
  },
  {
    keywords: ['thank', 'thanks', 'thx', 'shukriya'],
    answer: 'You\'re welcome! If anything here is useful, feel free to reach out at jating1416@gmail.com. 🙌'
  }
];

function initPortfolioAssistant() {
  const toggle = document.getElementById('assistant-toggle');
  const panel = document.getElementById('assistant-panel');
  const close = document.getElementById('assistant-close');
  const form = document.getElementById('assistant-form');
  const input = document.getElementById('assistant-input');
  const messages = document.getElementById('assistant-messages');
  if (!toggle || !panel || !close || !form || !input || !messages) return;

  const appendMessage = (text, user = false) => {
    const message = document.createElement('p');
    message.className = `assistant-message${user ? ' is-user' : ''}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  };

  const topicScore = (question, keywords) => {
    let score = 0;
    keywords.forEach(keyword => {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`\\b${escaped}`, 'i').test(question)) score += 1;
    });
    return score;
  };

  const responseFor = question => {
    let best = null;
    let bestScore = 0;
    ASSISTANT_TOPICS.forEach(topic => {
      const score = topicScore(question, topic.keywords);
      if (score > bestScore) { best = topic; bestScore = score; }
    });
    if (best) return best.answer;
    return 'I can help with: projects, project details & data previews, live dashboards, Kaggle datasets & case studies, skills, resume/education, the certificate, the analytics process, or contact details. Try one of those!';
  };

  const openAssistant = () => {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => input.focus(), 0);
  };
  const closeAssistant = () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  };
  const ask = question => {
    const cleaned = question.trim();
    if (!cleaned) return;
    appendMessage(cleaned, true);
    window.setTimeout(() => appendMessage(responseFor(cleaned)), 180);
  };

  toggle.addEventListener('click', () => panel.hidden ? openAssistant() : closeAssistant());
  close.addEventListener('click', closeAssistant);
  form.addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
    input.value = '';
  });
  document.querySelectorAll('[data-assistant-prompt]').forEach(button => {
    button.addEventListener('click', () => {
      const prompt = ASSISTANT_PROMPTS[button.dataset.assistantPrompt] || button.dataset.assistantPrompt;
      ask(prompt);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
  initProfilePhoto();
  initProjectLibrary();
  initDatasetLibrary();
  initDashboardDialog();
  initDetailDialog();
  initDetailTriggers();
  initLightbox();
  initMobileNavigation();
  initReveal();
  initActiveNavigation();
  initContactForm();
  initPortfolioAssistant();
  initCounters();
  initScrollProgress();
  initCopyEmail();
  initKeyboardShortcuts();
  initDarkMode();
  initCommandPalette();
  initModalSelfHeal();
  initDialogSwipeClose();
  handleDeepLink();
});

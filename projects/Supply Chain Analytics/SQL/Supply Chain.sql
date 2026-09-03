create database supply_chain;
use supply_chain;
select* from orders;
select *from customers;
select *from products;
select distinct(state) from customers
where state="Delhi";
update customers
set city="Palwal"
where city="Delhi";

SET SQL_SAFE_UPDATES=0;
select count(city) from customers
where city="Mumbai";

UPDATE orders
SET 
    order_date = DATE_SUB(order_date, INTERVAL 1 YEAR),
    promised_delivery_date = DATE_SUB(promised_delivery_date, INTERVAL 1 YEAR),
    actual_delivery_date = DATE_SUB(actual_delivery_date, INTERVAL 1 YEAR)
WHERE YEAR(order_date) = 2026
   OR YEAR(promised_delivery_date) = 2026
   OR YEAR(actual_delivery_date) = 2026;
   
   UPDATE customers
SET registration_date = DATE_SUB(registration_date, INTERVAL 1 YEAR)
WHERE YEAR(registration_date) = 2026;

-- Total kitne orders aaye hain aur total kitne unique customers ne order kiya hai?
select
count(order_id) as total_orders,
count(Distinct(customer_id)) as total_customers
from orders;

-- Har delivery_status (On-Time, Late, Early) ke kitne orders hain
select delivery_status,
count(order_id) as total_orders
from orders 
group by delivery_status
order by total_orders desc;

-- Top 5 warehouses kaunse hain jahan se sabse zyada orders ship hue hain?
select warehouse ,count(order_id) as total_orders
from orders
group by warehouse 
order by total_orders desc
limit 5;

-- Q4. Kis shipping_mode (Road, Air, Rail, Ship) ka average shipping_cost sabse zyada hai?
select
shipping_mode,
round(avg(shipping_cost),2) as total_average 
from orders
group by shipping_mode
order by total_average desc;

--  2026 ke October month mein kitne orders aaye the
select count(order_id) as total_orders
from orders
where order_date between '2026-10-1' and '2026-10-31';

ALTER TABLE orders
ADD COLUMN total_price DECIMAL(12, 2) 
GENERATED ALWAYS AS (
    (quantity * unit_price * (1 - discount_percent / 100.0)) + shipping_cost
) STORED;

-- Q6. Har Region (North, South, East, West, Central) se total kitna revenue generate hua hai?
select c.region , sum(o.total_price) as total_region_revenue
from customers c 
inner join orders o
on c.customer_id = o.customer_id
group by region 
order by total_region_revenue desc;


	 SET SQL_SAFE_UPDATES=0;
     
SELECT COUNT(*) AS different_prices
FROM orders o
JOIN products p
    ON o.product_id = p.product_id
WHERE o.unit_price <> p.selling_price;

ALTER TABLE products
ADD INDEX idx_products_product_id (product_id);

ALTER TABLE orders
ADD INDEX idx_orders_product_id (product_id);

ALTER TABLE orders ADD INDEX idx_orders_product_id (product_id);

-- region wise top selling product name 

-- product_id - quantity 
WITH RegionProductSales AS (
    SELECT 
        c.region,
        p.product_id,          -- 👈 Product ID
        p.product_name,        -- 👈 Product Name
        SUM(o.quantity) AS total_quantity_sold,
        
        -- Har Region mein sabse zyada bikne wale product_id ko Rank 1 milega
        ROW_NUMBER() OVER (
            PARTITION BY c.region 
            ORDER BY SUM(o.quantity) DESC
        ) AS rnk
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN products p ON o.product_id = p.product_id
    GROUP BY c.region, p.product_id, p.product_name -- 👈 Product ID + Name Dono Pe Group By
    
)
SELECT 
    region,
    product_id,
    product_name,
    total_quantity_sold
FROM RegionProductSales
WHERE rnk = 1
order by total_quantity_sold desc;

WITH ProductRegionRank AS (
    SELECT 
        p.product_id,
        p.product_name,
        c.region,
        SUM(o.quantity) AS total_quantity_sold,
        -- Har Product ke andar Region wise Ranking
        ROW_NUMBER() OVER (
            PARTITION BY p.product_id           -- 👈 Partition by Product!
            ORDER BY SUM(o.quantity) DESC
        ) AS rnk
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN products p ON o.product_id = p.product_id
    GROUP BY p.product_id, p.product_name, c.region
)
SELECT 
    product_id,
    product_name,
    region AS best_performing_region,
    total_quantity_sold
FROM ProductRegionRank
WHERE rnk = 1;  -- Har product ki sabse best market (region) nikal ke aayegi!



-- Interviewer Intent: Amazon Poochhta hai—"Customer do orders ke beech mein kitne din ka gap leta hai?" LAG(order_date) aur DATEDIFF() check karta hai.
with customerorderdate as (
select
customer_id,
order_id,
order_date,
LAG(order_date,1)over(partition by customer_id order by order_date) as previous_order_date
from orders),
ordergaps As 
(select 
customer_id,
datediff(order_date,previous_order_date) AS days_between_orders
from customerorderdate
where previous_order_date IS NOT NULL
)
select 
c.customer_id,
c.customer_name,
c.customer_segment,
COUNT(og.days_between_orders) + 1 AS total_repeat_orders,
    ROUND(AVG(og.days_between_orders), 1) AS avg_days_between_orders
FROM OrderGaps og
JOIN customers c ON og.customer_id = c.customer_id
GROUP BY c.customer_id, c.customer_name, c.customer_segment
HAVING COUNT(og.days_between_orders) >= 3
ORDER BY avg_days_between_orders asc;

-- Q4: Cumulative Running Total Revenue Per Customer (LTV Tracker)
-- Interviewer Intent: Amazon LTV track karne ke liye SUM(revenue) OVER (PARTITION BY customer_id ORDER BY order_date) poochhta hai.
SELECT 
    c.customer_id,
    c.customer_name,
    o.order_id,
    o.order_date,
    ROUND(o.quantity * o.unit_price * (1 - o.discount_percent / 100.0), 2) AS current_order_revenue,
    ROUND(
        SUM(o.quantity * o.unit_price * (1 - o.discount_percent / 100.0)) OVER (
            PARTITION BY o.customer_id 
            ORDER BY o.order_date, o.order_id
        ), 2
    ) AS cumulative_running_total_ltv
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
ORDER BY c.customer_id, o.order_date;

alter table orders
add column total_order_value decimal(12,2)
GENERATED ALWAYS AS (
    (quantity * unit_price * (1 - discount_percent / 100.0))
) STORED;

alter table orders
Rename column  total_order_value to Total_Revenue;

-- Task: "Har warehouse ka total orders count aur average rating nikalo."
select 
warehouse,
count(order_id) as total_orders,
avg(customer_rating) as average_rating
from orders
group by  warehouse
order by total_orders desc, average_rating desc;

ALTER TABLE orders MODIFY COLUMN carrier VARCHAR(50);

Select *from orders;
-- Q11. Har Carrier (Delhivery, BlueDart, DTDC, etc.) ke total orders, late orders aur Late Delivery Percentage (%) nikalna hai

select 
carrier,
count(order_id) as total_orders,
count(case when delivery_status='late' then 1  end) as total_late_order,
round(avg(case when delivery_status='late' then 1 else 0 end)*100,2) as late_delivery_percentage
from orders
group by carrier
order by total_orders desc,total_late_order desc ,late_delivery_percentage desc;

-- Q12: Har Warehouse ka Total Orders, Average Processing Days, aur Late Delivery % (Deciding slow warehouses).
select
warehouse,
count(order_id) as total_orders,
round(avg(warehouse_processing_days),2) as total_avg_days,
round(avg(case when delivery_status='late' then 1 else 0 end)*100,2) as late_delivery_percentage
from orders
group by warehouse
order by total_orders desc,total_avg_days desc,late_delivery_percentage desc;

-- "Un Top 5 Customers ke Name, City aur Total Orders count nikal jo sabse zyada repeat orders kar rahe hain."
select
c.customer_name,
c.city,
count(o.order_id) as total_orders
from customers c
left join orders o
on c.customer_id=o.customer_id
group by c.customer_name,
c.city
order by total_orders desc
limit 5;

-- Repeat order of same product --
SELECT 
    c.customer_id,
    c.customer_name,
    p.product_id,
    p.product_name,
    COUNT(o.order_id) AS times_bought_same_item
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN products p ON o.product_id = p.product_id
GROUP BY c.customer_id, c.customer_name, p.product_id, p.product_name
HAVING COUNT(o.order_id) > 1  
ORDER BY times_bought_same_item DESC;
 
-- Monthly Revenue & MoM Growth Trend - Window Function)

SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS month_year,
    ROUND(SUM((quantity * unit_price * (1 - discount_percent/100.0)) + shipping_cost), 2) AS total_revenue
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY month_year;



-- Business Need: Finance Director ko dekhna hai ki sabse zyada munafa (Profit) kis Product Category se aa raha hai.
select 
p.category,
sum(o.Total_Revenue),
sum(o.quantity*p.unit_cost) as total_cost,
(sum(o.Total_Revenue)-sum(o.quantity*p.unit_cost)) as total_profit,
round((sum(o.total_revenue)-sum(o.quantity*p.unit_cost))/sum(o.total_revenue)*100,2) as profit_percentage 
from orders o
join products p 
on p.product_id=o.product_id
group by p.category
order by total_profit desc;

select 
p.category,
sum(o.total_revenue) as total_revenue,
sum(o.quantity*p.unit_cost) as total_cost,
round(sum(o.total_revenue)-sum(o.quantity*p.unit_cost),2) as total_profit,
round(((sum(o.total_revenue)-sum(o.quantity*p.unit_cost))/sum(o.total_revenue))*100,2) as total_profit_margin
from orders o
join products p
on o.product_id=p.product_id
group by p.category
order by total_profit;

-- Un Customers ki list chahiye jinhone Average Customer Spending se ZYADA kharcha kiya hai.

WITH CustomerSpendTable AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.city,
        SUM(o.total_price) AS total_spent
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    GROUP BY c.customer_id, c.customer_name, c.city
)
SELECT 
    customer_id,
    customer_name,
    city,
    ROUND(total_spent, 2) AS total_spent
FROM CustomerSpendTable
WHERE total_spent > (SELECT AVG(total_spent) FROM CustomerSpendTable) -- 👈 Pure Customer Average se Comparison!
ORDER BY total_spent DESC;

-- Q17. (Cumulative Revenue / Running Total — Window Function)
-- Business Need: Management ko dekhna hai ki har mahine business ki total kamai progressive tareeke se kitni badh rahi hai (Running Total).

with cte as 
(select
date_format(order_date, '%Y-%m') as month_year,
sum(total_revenue) over(partition by date_format(order_date, '%Y-%m') order by order_date desc) as monthyl_revenue
from orders)

select month_year,
monthyl_revenue
from cte
group by month_year
order by monthly_revenue desc;




WITH MonthlySales AS (
    SELECT 
        DATE_FORMAT(order_date, '%Y-%m') AS month_year,
        ROUND(SUM(total_price), 2) AS monthly_revenue
    FROM orders
    GROUP BY DATE_FORMAT(order_date, '%Y-%m')
)
SELECT 
    month_year,
    monthly_revenue,
    SUM(monthly_revenue) OVER (ORDER BY month_year) AS cumulative_revenue
FROM MonthlySales
ORDER BY month_year;


-- Customer Segment vs Shipping Mode Matrix — Pivot / Conditional Aggregation)
-- Business Need: Logistics team dekhna chahti hai ki VIP aur Premium customers Air shipping prefer karte hain ya Road.
-- Task: Har customer_segment (VIP, Premium, Regular, New) ke liye alag-alag columns mein order count dikhao:
-- Column 1: customer_segment
-- Column 2: air_orders (Air shipping wale orders)
-- Column 3: road_orders (Road shipping wale orders)
-- Column 4: rail_orders (Rail shipping wale orders)
-- Column 5: ship_orders (Ship shipping wale orders)

SELECT
    c.customer_segment,
	COUNT(CASE WHEN o.shipping_mode = 'Air' THEN 1 END) AS air_orders,
    COUNT(CASE WHEN o.shipping_mode = 'Road' THEN 1 END) AS road_orders,
    COUNT(CASE WHEN o.shipping_mode = 'Rail' THEN 1 END) AS rail_orders,
    COUNT(CASE WHEN o.shipping_mode = 'Ship' THEN 1 END) AS ship_orders,
    COUNT(o.order_id) AS total_orders

FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
GROUP BY c.customer_segment
ORDER BY total_orders DESC;

-- (Region-wise Carrier Distribution — Pivot Practice)
-- Requirement: Management ko dekhna hai ki har Region mein alag-alag Carriers (Delhivery, BlueDart, DTDC, etc.) kitne orders handle kar rahe hain.
-- Task: Har region (North, South, East, West) ki 1-1 row banao aur aage columns mein counts nikalo:
-- region
-- delhivery_orders
-- bluedart_orders
-- dtdc_orders
-- india_post_orders
-- total_orders

select 
c.region ,
count(case when carrier='XpressBees' then 1 end) as xpressbees_orders,
count(case when carrier='India Post' then 1 end) as indiapost_orders,
count(case when carrier='Delhivery' then  1 end) as delhivery_orders,
count(case when carrier='DTDC' then 1 end) as DTDC_orders,
count(case when carrier='BlueDart' then 1 end) as bluedart_orders,
count(case when carrier='Ecom Express' then 1 end) as ecom_express_order,
count(Order_id) as total_orders
from orders o
join customers c
on o.customer_id=c.customer_id
group by region 
order by total_orders desc;

-- (Category-wise Top Supplier — Window Function Practice)
-- Requirement: Procurement team ko dekhna hai ki har Category mein kaunsa Supplier sabse zyada Revenue generate kar raha hai.
with cte as 
(select 
p.category,
p.supplier_name,
sum(o.total_revenue) as total_sales,
row_number()over(partition by p.category order by sum(o.total_revenue) desc )as rnk 
from orders o
join products p
on o.product_id=p.product_id
group by p.category, p.supplier_name)

select category,
supplier_name,
total_sales 
from cte
where rnk=1;


-- Q21. (Above Average Processing Time Warehouses — CTE / Subquery Practice)
-- Requirement: Un Warehouses ki list nikalo jinka Average Warehouse Processing Days poore business ke Overall Average Processing Days se ZYADA (slow) hai.

WITH WarehouseAvg AS (
    SELECT 
        warehouse,
        ROUND(AVG(warehouse_processing_days), 2) AS avg_processing_days
    FROM orders
    GROUP BY warehouse -- 👈 Pehle har warehouse ka avg nikala
)
SELECT 
    warehouse,
    avg_processing_days
FROM WarehouseAvg
WHERE avg_processing_days > (SELECT AVG(warehouse_processing_days) FROM orders) 
ORDER BY avg_processing_days DESC;


SELECT 
    warehouse,
    ROUND(AVG(warehouse_processing_days), 2) AS avg_processing_days
FROM orders
GROUP BY warehouse
HAVING AVG(warehouse_processing_days) > (SELECT AVG(warehouse_processing_days) FROM orders)
ORDER BY avg_processing_days DESC;

-- Q22. (Monthly Order Volume & MoM Order Growth — Lag Practice)
-- Requirement: Is baar Revenue ki jagah Total Orders Count ka Month-over-Month Trend dekhna hai.

with cte as
(select
date_format(order_date,'%Y-%m') as month_year,
count(order_id) as total_orders,
lag(count(order_id)) over(order by date_format(order_date,'%Y-%m')) as previous_year_order
from orders
group by date_format(order_date,'%Y-%m'))

select
 month_year,
total_orders,
previous_year_order,
round((((total_orders-previous_year_order)/previous_year_order)*100),2) as monthy_growth
from cte 
order by month_year asc;

-- Q23. (High Discount vs High Rating Analysis — Case When Practice)
-- Requirement: Management check karna chahti hai ki: "Kya zyaada discount dene se customer rating acchi milti hai?"

select
case
when discount_percent=0 then 'NO Discount'
when discount_percent between 1 and 10 then 'Low Discount'
when discount_percent>10 then 'High Discount'
end as Discount_bucket,
count(order_id) as total_orders,
round(avg(customer_rating),2) as avg_rating
from orders
group by  Discount_bucket
order by avg_rating desc;

-- mom growth % or monthly revenue
with cte as 
(select 
date_format(order_date, '%Y-%m') as month_year,
sum(total_revenue) as total_sales,
lag(sum(total_revenue)) over(order by date_format(order_date, '%Y-%m') asc)as previous_month_revenue
from orders
group by date_format(order_date, '%Y-%m'))

select 
month_year,
total_sales,
previous_month_revenue,
round(((total_sales - previous_month_revenue) /previous_month_revenue)*100,2)as cummulative_growth
from cte ;

WITH CustomerSpending AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.preferred_payment,
        ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_percent / 100.0)), 2) AS total_spent
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.customer_name, c.preferred_payment
)
SELECT 
    CASE 
        WHEN total_spent > 50000 THEN '1. High Spender (> ₹50k)'
        WHEN total_spent BETWEEN 10000 AND 50000 THEN '2. Medium Spender (₹10k - ₹50k)'
        ELSE '3. Low Spender (< ₹10k)'
    END AS spending_tier,
    preferred_payment,
    COUNT(customer_id) AS customer_count,
    ROUND(AVG(total_spent), 2) AS avg_tier_spend
FROM CustomerSpending
GROUP BY spending_tier, preferred_payment
ORDER BY spending_tier, customer_count DESC;


-- 🏬 CASE STUDY 1: Carrier Performance & Contract Renewal Scorecard
-- 📜 Business Context:
-- Company ke VP of Logistics ko aane wale saal ke liye Courier Companies (Delhivery, BlueDart, DTDC, etc.) ke saath Contracts Renew karne hain.
--  Wo chahte hain ki tum unhe ek 360-Degree Carrier Scorecard Report do, jiske basis par wo faisla le sakein ki kis carrier ko bonus dena hai 
--  aur kiske saath contract khatam karna hai.
with cte as 
(select carrier ,
count(order_id) as total_orders,
round(avg(case when delivery_status='on-time' or delivery_status='early' then 1 else 0 end)*100,2) as on_time_delivery,
round(avg(warehouse_processing_days),2)as total_time_average,
round(avg(transportation_days),2) as avg_days_taken,
round(avg(customer_rating),2) as avg_rating
from orders
group by carrier
order by total_orders desc,on_time_delivery desc,total_time_average desc)

SELECT 
    carrier,
    total_orders,
    on_time_delivery,
    total_time_average,
    avg_days_taken,
    avg_rating,
    CASE 
        WHEN on_time_delivery >= 80 AND avg_rating >= 4.0 THEN 'Preferred Partner'
        WHEN on_time_delivery BETWEEN 65 AND 80 THEN 'Under Review'
        ELSE 'At Risk / Penalty'
    END AS carrier_status
FROM cte ;


-- 🏬 CASE STUDY 2 (REVISED): Supplier Lead-Time & Demand Vulnerability Scorecard
-- 📜 Business Context:
-- Head of Procurement chahte hain ki hum un High-Velocity Products ki list dein jinhe Slow Suppliers (High Lead Time) supply kar rahe hain, taaki 
-- wo un suppliers ke saath baat karke SLA/Lead Time kam karwa sakein.



with cte as 
(select 
p.category,
p.product_id,
p.product_name,
p.supplier_name,
p.lead_time_days,
sum(o.quantity) as total_quantity
from products p
join orders o
on p.product_id=o.product_id
where o.order_date>=date_sub((select max(order_date)from orders),interval 1 month)
group by p.category,
p.product_id,
p.product_name,
p.supplier_name,
p.lead_time_days
order by total_quantity desc)

select *,
case 
when total_quantity>=450 and lead_time_days>=7 then 'high_vulnerbility' 
when total_quantity>=450 and lead_time_days<7 and lead_time_days>=5  then 'moderate_risk' 
else 'low_risk'
End AS supplier_risk
from cte
having supplier_risk='high_vulnerbility'
order by  total_quantity desc,lead_time_days desc 
limit 50;

-- Customer Churn & Retention Risk (VIP / Premium Segment)
-- Chalo ab chalte hain Case Study 3 par. Is baar sawaal aaya hai Chief Commercial Officer (CCO) aur Customer Success Head ki taraf se!

-- 📜 Business Context:
-- E-commerce mein VIP aur Premium Customers hamari backbone hote hain (sabse zyada revenue wahi dete hain).
--  Lekin kuch VIP/Premium customers pichle 3 Mahine (90 Days) se ek bhi order nahi kiye hain! Management ko dar hai ki yeh 
--  high-value customers churn (chhod kar doosre platform par shifts) ho rahe hain.

WITH CustomerLastOrder AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.city,
        c.customer_segment,
        MAX(o.order_date) AS last_order_date,
        DATEDIFF((SELECT MAX(order_date) FROM orders), MAX(o.order_date)) AS days_since_last_order
        
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    WHERE c.customer_segment IN ('VIP', 'Premium') -- 👈 Clean Filter
    GROUP BY c.customer_id, c.customer_name, c.city, c.customer_segment -- 👈 Necessary Group By
)
SELECT 
    customer_id,
    customer_name,
    city,
    customer_segment,
    last_order_date,
    days_since_last_order,
    CASE 
        WHEN days_since_last_order >= 120 THEN 'Critical Retention Risk'
        WHEN days_since_last_order BETWEEN 90 AND 119 THEN 'High Churn Risk'
        ELSE 'Active / Low Risk'
    END AS churn_risk_level

FROM CustomerLastOrder
WHERE days_since_last_order >= 90 -- 👈 Filter only Churn-risk customers
ORDER BY days_since_last_order DESC;

-- 🏬 CASE STUDY 4: RFM (Recency, Frequency, Monetary) Customer Value Segmentation
-- 📜 Business Context:
-- Growth aur Marketing Team ke VP of Marketing chahte hain ki hum unke sabhi Customers ko unke Buying Behavior (Order 
-- Count + Total Spend) ke basis par 4 Strategic Tiers (VIP Buckets) mein classify karke dein. Isse wo har 
-- Tier ke customer ko alag-alag targeted ads aur discounts bhej sakein.
with cte as 
(select 
c.customer_id,
c.customer_name,
c.customer_type,
count(o.order_id) as total_orders,
sum(o.total_price) as total_spend
from customers c 
join orders o
on o.customer_id=c.customer_id
group by c.customer_id,
c.customer_name,
c.customer_type)

select 
customer_id,
customer_name,
customer_type,
total_orders,
total_spend,
case when total_orders >=26 and total_spend>90000 then 'Champions'
when total_orders >=20 and total_spend>=60000 then 'High-Value Frequent'
when total_orders >=13 and total_spend>40000 then 'Potential Loyalist'
when total_orders >=8 and total_spend>12000 then 'Standard'
else 'Low Activity'
end as rfm_customer_tier
from cte 
order by total_orders desc,
total_spend desc
limit 80;

-- 🗣️ Interviewer (Scenario):
-- "Jatin, hamari marketing team ne naye customers acquire kiye hain. Ab humein dekhna hai ki ek customer apna Pehla (1st)
--  order karne ke baad, apna Doosra (2nd) order kitne din baad karta hai. Isey hum 'Time to Second Purchase' kehte hain."
-- 🎯 Your Task:
-- Ek aisi query likho jo sirf un customers ka data de jinhone kam se kam 2 orders kiye hain. Output mein yeh 4 columns aane chahiye:


with cte as 
(select 
customer_id,
order_date,
lead(order_date)over(partition by customer_id order by order_date asc) as second_order,
row_number()over(partition by customer_id order by order_date asc) as rnk
from orders)


select customer_id,
order_date,
second_order,
datediff(second_order,order_date)as Daysdifference
from cte
where rnk=1 and second_order is not null
order by Daysdifference desc;


select warehouse,
count(order_id) as total_orders,
year(order_date) as year_order ,delivery_status,
(count(case when delivery_status='Delayed' then 1 end)/count(delivery_status))*100 as delivery_rate
from orders
where year(order_date)='2024'
group by warehouse
having delivery_rate > 2;



SELECT 
    warehouse,
    COUNT(order_id) AS total_orders,
   
    ROUND(
        100.0 * COUNT(CASE WHEN delivery_status ='Late' THEN 1 END) / COUNT(order_id), 
        2
    ) AS delayed_delivery_rate_pct
FROM orders
WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
GROUP BY warehouse
HAVING delayed_delivery_rate_pct > 3
ORDER BY delayed_delivery_rate_pct DESC;

select c.city,
count(case when delivery_status IN("Early","On-Time") then 1 end) as On_time_orders,
count(case when delivery_status="Late" then 1 end) as Late_orders,
count(o.order_id) as total_orders,
dense_rank() over(order by count(case when delivery_status IN("Early","On-Time") then 1 end) desc) as rnk
from customers c
join orders o
on c.customer_id =o.customer_id
group by city 
order by On_time_orders desc ,Late_orders desc ;

-- 7-Day Moving Average

with date_wise_sales as
(select 
order_date,
sum(total_revenue) as total_sales
from orders
where order_date>((select max(order_date) from orders)-interval 7 day)
group by order_date
order by order_date asc)

select 
order_date,total_sales,
sum(total_sales)over(order by order_date asc) as running_total,
round(avg(total_sales)over(ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW),2)as avg_wise_rnk
from date_wise_sales;

WITH date_wise_sales AS (
    SELECT 
        order_date,
        SUM(total_revenue) AS daily_revenue
    FROM orders
    WHERE order_date >= (SELECT MAX(order_date) FROM orders) - INTERVAL 60 DAY  -- 👈 60 Days Trend
    GROUP BY order_date
)
SELECT 
    order_date,
    daily_revenue,
    
    -- 1. Running Total
    SUM(daily_revenue) OVER (ORDER BY order_date ASC) AS running_total_revenue,
    
    -- 2. 7-Day Moving Average
    ROUND(
        AVG(daily_revenue) OVER (
            ORDER BY order_date ASC 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ), 2
    ) AS moving_avg_7_days

FROM date_wise_sales
ORDER BY order_date ASC;

select p.category,p.product_name,
sum(o.total_revenue) as total_sales,
row_number() over(partition by p.Category order by sum(o.total_revenue) desc) as Row_wise_rank,
rank() over(partition by p.Category order by sum(o.total_revenue) desc) as Rank_wise,
dense_rank() over(partition by p.Category order by sum(o.total_revenue) desc) as dense_rank_wise
from products p
join orders o 
on p.product_id=o.product_id
group by p.Category , p.product_name
 order by total_sales desc;
 
with cte as
 (select customer_id,
 order_date,
 total_price,
 row_number() over(partition by customer_id order by order_date asc ,order_id asc)as first_purchase_amount,
 row_number()over(partition by customer_id order by order_date desc ,order_id desc)as last_purchase_amount
from orders)

select 
f.customer_id,
f.order_date as first_order_date,
f.total_price as first_purchase_maount,
l.order_date as last_order_date,
l.total_price as last_order_price,
round(f.total_price - l.total_price,2) as value_growth
from cte f
join cte l
on f.customer_id=l.customer_id
where f.first_purchase_amount=1 and 
l.last_purchase_amount=1
order by  value_growth desc;


WITH RankedOrders AS (
    SELECT 
        customer_id,
        order_date,
        total_price,
        ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY order_date ASC, order_id ASC) AS rnk_first,
        ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY order_date DESC, order_id DESC) AS rnk_latest
    FROM orders
)
SELECT 
    f.customer_id,
    f.order_date AS first_order_date,
    f.total_price AS first_order_amount,
    l.order_date AS latest_order_date,
    l.total_price AS latest_order_amount,
    
    -- Growth Difference = Latest Order Amount - First Order Amount
    ROUND(l.total_price - f.total_price, 2) AS order_value_growth

FROM RankedOrders f
JOIN RankedOrders l ON f.customer_id = l.customer_id
WHERE f.rnk_first = 1     -- 👈 Sirf Pehla Order uthaya
  AND l.rnk_latest = 1    -- 👈 Sirf Latest Order uthaya
ORDER BY order_value_growth DESC;


 


 
 
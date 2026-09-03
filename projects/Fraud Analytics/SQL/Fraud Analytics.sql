use fraud_analytics;
select* from cards;
select* from customers;
select*from merchants;
select*from transactions;
select distinct payment_method
from transactions;

select customer_name , occupation
from customers
where customer_name like 'A%';

select transaction_id , customer_id ,transaction_amount
from transactions
order by transaction_amount desc
limit 10;

select transaction_id , payment_method , transaction_amount
from transactions
where payment_method in ('upi','credit card' ,'debit card');

select 
count(transaction_amount) as total_count,
round(sum(transaction_amount),2) as total_sum,
round(avg(transaction_amount),2) as total_avg,
max(transaction_amount) as maximum_amount,
min(transaction_amount) as minimum_amount
from transactions ;

select count(fraud_flag) as total_fraud
from transactions
where fraud_flag = 1;

select customer_name , customer_since
from customers 
where customer_since > 2020
order by customer_since asc;

select customer_name , datediff(curdate(),customer_since) as total_days
from customers
order by total_days desc;

SELECT UPPER(customer_name) AS customer_name, 
LENGTH(customer_name) AS name_length 
FROM customers 
ORDER BY name_length DESC;

select customer_name ,city ,
concat(customer_name,' ','from',' ',city)
from customers 
limit 10;

select customer_name , city ,
concat_ws(' ',customer_name , city , state,occupation) as Full_detail
from customers;

-- Question 16: Sirf fraud transactions ka data lo, aur har Merchant_Category ke liye total fraud count aur total fraud amount dikhao — fraud amount ke descending order mein.
select merchant_category , count(fraud_flag) as total_fraud,
round(sum(transaction_amount),2) as total_fraudamount
from transactions
where fraud_flag=1
group by merchant_category 
order by total_fraud desc;

select round(sum(transaction_amount),2)as total_fraudamount,
Transaction_Channel from transactions
group by transaction_channel 
order by total_fraudamount desc;

-- transactions table se un Merchant_Category dikhao jinke total transaction amount 500000 se zyada hai. Columns: Merchant_Category, total transactions count, total amount.

select Merchant_category ,
round(sum(transaction_amount),2) as total_amount
from transactions
group by merchant_category
having total_amount >500000
order by total_amount desc;

-- transactions table se un Payment_Method dikhao jinme:
-- Total transactions 50 se zyada hue hain, AND
-- Average transaction amount 2000 se zyada ho

select payment_method, 
round(count(transaction_id),2) as total_transactions,
round(avg(transaction_amount),2) as total_avg
from transactions 
group by payment_method
having total_transactions>50 and total_avg >2000
order by total_transactions desc ,total_avg desc ;

-- transactions table se un Merchant_Category dikhao jaha:
-- Sirf Transaction_Status = 'Success' wale transactions consider karo (WHERE)
-- Group by Merchant_Category
-- Sirf wo categories dikhao jinka total success amount > 100000 ho (HAVING)

select merchant_category , transaction_status,
round(sum(transaction_amount),2) as total_amount
from transactions
where transaction_status='successful'
group by merchant_category , transaction_status
having total_amount >100000000 
order by total_amount desc;

SELECT Merchant_state,
       COUNT(*) AS success_count,
       ROUND(SUM(Transaction_Amount), 2) AS total_success_amount
FROM transactions
GROUP BY Merchant_state
HAVING SUM(Transaction_Amount) > 100000
ORDER BY total_success_amount DESC;
       
-- customers table se har State aur Gender combination ke liye:
-- Kitne customers hain (count)
-- Average age
select state,gender,Avg(age) as avg_age,
count(*) as total_customers
from customers
group by state , gender
having total_customers >10
order by total_customers desc;

-- transactions aur customers tables ko join karke ye dikhao:
-- Transaction_ID,Customer_Name,Gender,Transaction_Amount,Payment_Method
-- Sirf top 20 highest transactions dikhao 
select 
c.customer_name  , c.gender ,
t.transaction_amount,t.payment_method 
from customers c
join transactions t
on c.customer_id=t.customer_id 
order by  transaction_amount desc
limit 20;

-- Un customers ka Customer_Name, City, aur Transaction_ID dikhao jinhone koi transaction nahi ki hai. (Yaani transactions table mein unki entry hi nahi hai)

select 
c.customer_name,
c.city,
t.transaction_id
from transactions t
Right Join Customers c
on t.customer_id=c.customer_id
where t.customer_id is null;

-- Har customer ne total kitni transactions ki aur total kitna amount spend kiya — ye dikhao.
-- Customer_ID,Customer_Name,total_transactions,total_spent
-- Sirf top 10 highest spenders dikhao.

SELECT c.Customer_ID, c.Customer_Name,
       COUNT(t.Transaction_ID) AS total_transactions,
       ROUND(SUM(t.Transaction_Amount), 2) AS total_amount
FROM transactions t
JOIN customers c ON t.Customer_ID = c.Customer_ID
GROUP BY c.Customer_ID, c.Customer_Name    
ORDER BY total_amount DESC
LIMIT 10;

-- Q24: transactions, customers, aur merchants ko join karke top 15 highest transactions dikhao with Transaction_ID,
--  Customer_Name, Merchant_Name, Merchant_Category, Transaction_Amount
select
c.customer_name,
m.merchant_name,
t.merchant_category,
t.transaction_id,
transaction_amount 
from customers c
join transactions t
on c.customer_id=t.customer_id
join  merchants m
on m.merchant_id=t.merchant_id
order by transaction_amount desc
limit 15;

-- Ab CHALLENGE! Chaaron tables use karo: customers, transactions, merchants, cards
-- Transaction_ID,Customer_Name,Card_Type (from cards table),Card_Network (from cards table),Merchant_Name,
-- Transaction_Amount,Sirf Transaction_Status = 'Success' wali transactions, top 20 by amount (descending).

select
t.transaction_id ,
c.customer_name,
ca.card_type,
ca.card_network,
m.merchant_name,
t.transaction_amount
from merchants m
join transactions t
on m.merchant_id = t.merchant_id
join customers c
on c.customer_id = t.customer_id
join cards ca
on ca.card_id=t.card_id
where t.transaction_status='successful'
order by t.transaction_amount desc
limit 20;


-- Har Merchant_Category ke liye ye dikhao:
-- Total transactions ,Total revenue,Number of unique customers,
-- Average transaction amount,Sort by total revenue descending, top 10 categories.

select
merchant_category,
count(transaction_amount) as total_transactions,
count(Distinct customer_id) as unique_customers,
round(avg(transaction_amount),2) as avg_transactions,
round(sum(transaction_amount),2) as total_revenue
from transactions
group by merchant_category
order by total_revenue desc
limit 10;

-- Har Merchant_Name  ke liye:
-- Merchant ka Merchant_Rating,Total transactions count
-- Total revenue,Sort by total revenue descending, top 10 merchants.

select
m.merchant_name ,
m.merchant_rating,
round(sum(t.transaction_amount),2) as total_transactions,
count(t.transaction_id) as total_count 
from merchants m
join transactions t
on m.merchant_id=t.merchant_id
group by t.merchant_id, m.merchant_name, m.merchant_rating
order by total_transactions desc
limit 10;

-- State-wise Fraud Analytics: Har Customer_State mein total fraud transactions (Fraud_Flag = True) aur unki total monetary value calculate karein.
select customer_state,
round(sum(transaction_amount),2)as total_amount
,count(fraud_flag) as total_fraud 
from transactions
where fraud_flag=1
group by customer_state ;

WITH Customer_Spend AS (
    -- Pehle har customer ka total spend nikala
    SELECT 
        Customer_ID,
        SUM(Transaction_Amount) AS total_spent
    FROM transactions
    WHERE Transaction_Status = 'Success'
    GROUP BY Customer_ID
),
Customer_Limit AS (
    -- Pehle har customer ki total credit limit nikali (multiple cards ho toh bhi sahi sum hoga)
    SELECT 
        Customer_ID,
        SUM(Credit_Limit) AS total_limit
    FROM cards
    WHERE Card_Status = 'Active'
    GROUP BY Customer_ID
)
SELECT 
    c.Customer_ID,
    c.Customer_Name,
    COALESCE(cs.total_spent, 0) AS total_spent,
    cl.total_limit,
    ROUND((COALESCE(cs.total_spent, 0) / cl.total_limit) * 100, 2) AS utilization_percentage
FROM customers c
JOIN Customer_Limit cl ON c.Customer_ID = cl.Customer_ID
LEFT JOIN Customer_Spend cs ON c.Customer_ID = cs.Customer_ID
ORDER BY utilization_percentage DESC;

SELECT 
    c.Customer_ID,
    c.Customer_Name,
    SUM(t.Transaction_Amount) AS total_spent,
    MAX(card.Credit_Limit) AS total_limit,
    ROUND((SUM(t.Transaction_Amount) / MAX(card.Credit_Limit)) * 100, 2) AS limit_utilization_pct
FROM customers c
JOIN cards card ON c.Customer_ID = card.Customer_ID
JOIN transactions t ON c.Customer_ID = t.Customer_ID
WHERE t.Transaction_Status = 'Success' -- Sirf successful transactions
GROUP BY c.Customer_ID, c.Customer_Name
ORDER BY limit_utilization_pct DESC;

SELECT 
    c.Card_ID,
    c.Customer_ID,
    c.Credit_Limit,
    COALESCE(SUM(t.Transaction_Amount), 0) AS total_spent,
    ROUND(
        (COALESCE(SUM(t.Transaction_Amount), 0) / c.Credit_Limit) * 100, 
        2
    ) AS card_utilization_pct
FROM cards c
LEFT JOIN transactions t 
    ON c.Card_ID = t.Card_ID 
    AND t.Transaction_Status = 'Success' -- Success check
GROUP BY 
    c.Card_ID, 
    c.Customer_ID, 
    c.Credit_Limit
ORDER BY 
    card_utilization_pct DESC;

--  High-risk merchants (Merchant_Risk_Level = 'High') ke top 5 categories nikalein jinme sabse zyada transaction amount execute hua ho.
select 
merchant_category,
round(sum(transaction_amount),2)as total_amount
from transactions
where merchant_risk_level='HIGH'
group by merchant_category 
order by total_amount desc
limit 5;

-- Incomes categories (Annual_Income) aur age brackets (Age) ke basis par fraud rate breakdown determine karein.
SELECT 
    CASE 
        WHEN c.Age < 25 THEN 'Under 25'
        WHEN c.Age BETWEEN 25 AND 45 THEN '25-45'
        ELSE 'Above 45'
    END AS age_group,
    c.Annual_Income,
	COUNT(DISTINCT c.Customer_ID) AS total_customers,
    COUNT(t.Transaction_ID) AS total_transactions,
    SUM(CASE WHEN t.Fraud_Flag = 1 THEN 1 ELSE 0 END) AS total_fraud_transactions,
  ROUND((100.0 * SUM(CASE WHEN t.Fraud_Flag = 1 THEN 1 ELSE 0 END)) / NULLIF(COUNT(t.Transaction_ID), 0), 
        2) AS fraud_rate_pct
FROM customers c
LEFT JOIN transactions t
ON c.Customer_ID = t.Customer_ID
GROUP BY age_group ,c.Annual_Income
ORDER BY fraud_rate_pct DESC;



 

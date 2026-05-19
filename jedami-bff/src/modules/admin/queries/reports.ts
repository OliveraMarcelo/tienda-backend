export const REPORTS_QUERY = `
  WITH top_products AS (
    SELECT
      p.id                               AS product_id,
      p.name,
      SUM(oi.quantity)                   AS total_units,
      SUM(oi.quantity * oi.unit_price)   AS total_revenue
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    JOIN orders   o ON o.id = oi.order_id
    WHERE o.status = 'paid'
    GROUP BY p.id, p.name
    ORDER BY total_units DESC
    LIMIT $1
  ),
  top_customers AS (
    SELECT
      c.id            AS customer_id,
      u.email,
      COUNT(o.id)     AS total_orders,
      COALESCE(SUM(o.total_amount) FILTER (WHERE o.status = 'paid'), 0) AS total_revenue
    FROM customers c
    JOIN users  u ON u.id = c.user_id
    JOIN orders o ON o.customer_id = c.id
    GROUP BY c.id, u.email
    ORDER BY total_orders DESC
    LIMIT $1
  )
  SELECT
    (SELECT COALESCE(json_agg(tp), '[]'::json) FROM top_products tp) AS top_products,
    (SELECT COALESCE(json_agg(tc), '[]'::json) FROM top_customers tc) AS top_customers
`;

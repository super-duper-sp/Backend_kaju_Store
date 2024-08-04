ShopSync

ShopSync empowers shop owners with predictive analytics, offering a comprehensive platform to analyze historical sales data, forecast future earnings, and visualize insights. Leveraging advanced forecasting models and interactive visualizations, it enables users to anticipate revenue trends, identify growth opportunities, and optimize business strategies. With scenario analysis capabilities and customizable parameters, shop owners can simulate various scenarios and make informed decisions to drive profitability. Real-time alerts keep users informed of significant changes, ensuring proactive management. Secure handling of sensitive data and user-friendly interfaces enhance usability and privacy. ShopSync equips shop owners with the tools they need to thrive in a dynamic retail landscape.

MERN Stack

	•	Frontend: React.js, Tailwind CSS
	•	Backend: Express.js & Node.js
	•	Database: MongoDB

Backend

Routes

User Authentication

	•	POST /api/user/register - Create a new user account.
	•	POST /api/user/login - Log in to an existing account. [Email + Password]
	•	POST /api/user/logout - Logout from account.

Shop Profile

	•	GET /api/shop/ - Get the shop details.
	•	POST /api/shop/ - Edit the shop details.

Daily Entry

	•	POST /api/DailyTransactions - Add the daily entry details.
	•	GET /api/DailyTransactions - Get all the daily entry details.
	•	PUT /api/DailyTransactions/:id - Update the daily entry details by id.
	•	DELETE /api/DailyTransactions/:id - Delete the daily entry details by id.

Dashboard

	•	GET /api/offline-sales-monthly/ - Get all offline sales on a monthly basis sum.
	•	GET /api/offline-sales-yearly/:YEAR - Get offline sales on a yearly basis sum.
	•	GET /api/offline-sales-month-year/:YEAR - Get offline sales on a yearly & monthly basis sum.

All User

	•	GET /api/shopmember - Get the current shop member user’s profile information.
	•	POST /api/shopmember - Update the current shop member user’s profile information.

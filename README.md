🎉 Charity Donation Platform 💖

Welcome to the Charity Donation Platform! 🌍 This web application is designed to make donating to charities easier, transparent, and more impactful! Whether you're looking to support a cause, track your donations, or just make the world a better place, you're in the right spot! 🌱

The platform allows users to browse and donate to various charities, and charities to showcase their missions, set donation goals, and provide updates to their donors! 🎯💰

✨ Key Features
1. User Authentication and Profiles 🛡️
Register and Login: Get onboard and log in securely with JWT authentication 🔐.
Profile Management: Keep your profile up-to-date, view your donations, and manage your personal details 🧑‍💻👤.
2. Charity Management 🏢
Charity Registration: Charities can join the platform and get started by creating a profile. Admin approval? Yes, please! ✅
Profile Information: Charities provide mission statements, goals, and exciting updates 🌟.
3. Donation Process 💸
Browse and Search: Find the perfect charity by filtering through categories, location, and more 🔍.
Make Donations: Help causes close to your heart with secure payment integrations (Razorpay) 💳.
Donation Tracking: Keep tabs on all your past donations 🗂️ and feel good about it! 😊
4. Donation Tracking and Impact Reports 📊
Donation History: View all the amazing contributions you’ve made, anytime you want! 📅
Impact Reports: Charities can share how your donations have made a difference 🌍💪.
5. Admin Dashboard 👑
Manage Users and Charities: Admins have the power to approve charities and manage users. 🧐🔧
6. Notifications 📧
Email Updates: Get notified via email for every donation confirmation, charity update, and donation reminder 🚀.
⚙️ Tech Stack
Backend Framework: Node.js with Express 🚀
Database: SQL (MySQL) 💾
Authentication: JWT (Token-based Authentication) 🔑
Payment Gateways: Razorpay 💳
Email Notifications: SendGrid 📬
Version Control: Git with GitHub 🧑‍💻
🚀 Setup Instructions
Prerequisites
Before you dive into setting up the platform, make sure you have:

Node.js installed (Don’t worry, it’s fast! 💨)
MySQL or PostgreSQL running for your database 🗄️
SendGrid API Key for those lovely email notifications ✉️
Stripe or Razorpay credentials (Let’s get the donations rolling! 💸)
Steps to Get Started 🚀
Clone the repository (or fork it if you like):



Create a .env file to store your environment variables:

env
Copy code
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=charity_platform
JWT_SECRET=supersecretjwtkey
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret_key
Run the database migrations to create the necessary tables:



💬 Contribution
Contributions are always welcome! Feel free to fork the repository, create issues, and submit pull requests. Let's make this platform even better together! 💪

🎉 Special Thanks
Big thanks to  Razorpay for making secure payments so easy 💳.
Thanks to SendGrid for handling our email notifications and keeping the users updated 📧.
📜 License
This project is licensed under the ME License. Enjoy building, donating, and making the world a better place! ✨
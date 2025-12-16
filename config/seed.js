const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Default admin user created:', admin.email);
    } else {
      console.log('Admin user already exists:', adminEmail);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

module.exports = seedAdmin;


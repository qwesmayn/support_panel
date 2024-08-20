import bcrypt from 'bcryptjs'
import UserAdmin from '../models/userAdminModel.js';

export const start = async () => {
  // try {
  //   const adminData = {
  //     login: 'superadmin',
  //     password: 'admin'
  //   };

  //   adminData.password = await bcrypt.hash(adminData.password, 12)

  //   const admin = new UserAdmin(adminData);
  //   await admin.save();
  //   console.log('Admin user created successfully');

  // } catch (error) {
  //   console.error('Error initializing the database:', error);
  //   process.exit(1);
  // }
};

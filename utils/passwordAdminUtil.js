import bcrypt from 'bcryptjs';

export const comparePassword = async (enteredPassword, storedPasswordHash) => {
  return await bcrypt.compare(enteredPassword, storedPasswordHash);
};

export const generateNewPassword = async () => {
  const newPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  return { newPassword, hashedPassword };
};

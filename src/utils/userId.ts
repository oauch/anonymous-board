const generateUserId = () => {
  const newUserId = `user-${Date.now()}`;
  localStorage.setItem("userId", newUserId);
  return newUserId;
};

const userId = localStorage.getItem("userId") || generateUserId();

export { userId };

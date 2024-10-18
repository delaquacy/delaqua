import { useCallback, useState } from "react";
import { UserService } from "../lib/UserService";

export const useUserSearch = (
  setAdminAssignedUser: Function,
  setAdminCreateMode: Function
) => {
  const [userPhone, setUserPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any | null>(null);

  const validatePhone = useCallback(() => {
    if (!userPhone || userPhone.length < 11) {
      setError("Please enter a valid number.");
      return false;
    }
    setError("");
    return true;
  }, [userPhone]);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const foundUser = await UserService.findUserByPhoneNumber(userPhone);

      if (!foundUser) {
        setError("User with current number does not exist");
        setLoading(false);
        return;
      }
      setUser(foundUser);
      setAdminAssignedUser({
        uid: foundUser?.id || "",
        phoneNumber: foundUser?.phoneNumber || "",
      });
      setAdminCreateMode(true);
      setLoading(false);
    } catch (error) {
      setError(`Error fetching user: ${error}`);
      setLoading(false);
    }
  }, [userPhone, setAdminAssignedUser, setAdminCreateMode]);

  const handleApplySearch = useCallback(() => {
    if (validatePhone()) {
      fetchUser();
    }
  }, [validatePhone, fetchUser]);

  const createUser = async () => {
    setLoading(true);
    setError("");
    const user = await UserService.createUserIfNotExists(userPhone);

    setUser(user);
    setAdminAssignedUser({
      uid: user?.id || "",
      phoneNumber: user?.phoneNumber || "",
    });
    setAdminCreateMode(true);
    setLoading(false);
  };

  return {
    userPhone,
    setUserPhone,
    loading,
    error,
    user,
    setError,
    handleApplySearch,
    setAdminCreateMode,
    createUser,
  };
};

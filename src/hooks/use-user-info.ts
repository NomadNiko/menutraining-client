import { useState } from 'react';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

interface UserInfo {
  firstName?: string;
  lastName?: string;
  email: string;
}

type UserCache = {
  [key: string]: UserInfo;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const useUserInfo = () => {
  const [userCache, setUserCache] = useState<UserCache>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchUserInfo = async (userId: string, retryCount = 0): Promise<UserInfo | null> => {
    // Don't retry if we already have the data or are loading
    if (userCache[userId] || loading[userId]) {
      return userCache[userId];
    }

    try {
      setLoading(prev => ({ ...prev, [userId]: true }));
      setErrors(prev => ({ ...prev, [userId]: '' }));

      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const response = await fetch(`${API_URL}/v1/users/${userId}/name`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      setUserCache(prev => ({
        ...prev,
        [userId]: userData
      }));

      return userData;
    } catch (error) {
      console.error(`Error fetching user info for ${userId}:`, error);
      
      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY);
        return fetchUserInfo(userId, retryCount + 1);
      }

      setErrors(prev => ({
        ...prev,
        [userId]: 'Failed to fetch user info'
      }));
      return null;
    } finally {
      setLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[userId];
        return newLoading;
      });
    }
  };

  const getUserDisplayName = (userId: string): string => {
    const user = userCache[userId];
    if (!user) return 'Loading...';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  return {
    fetchUserInfo,
    getUserDisplayName,
    userCache,
    loading,
    errors,
  };
};
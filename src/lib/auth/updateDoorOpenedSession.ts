import { signIn, getSession } from "next-auth/react";

/**
 * Updates the session with a new doorOpend value.
 * @param doorOpend - boolean indicating door open status
 * @returns boolean - true if session update is successful
 */

export const updateDoorOpenedSession = async (doorOpend: boolean): Promise<boolean> => {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      console.error("❌ No session user found.");
      return false;
    }
 
    const updated = await signIn("credentials", {
      redirect: false,
      login_type: user.login_type,
      login_id: user.email,
      login_name: user.fname,
      device_type: user.deviceType,
      doorOpend,
      trigger: "update", // will be picked up by JWT callback
    });

    if (updated?.ok) {
      console.log("✅ doorOpend session value updated.");
      return true;
    } else {
      console.error("❌ Failed to update doorOpend in session.");
      return false;
    }

  } catch (error) {
    console.error("🚨 Error updating doorOpend:", error);
    return false;
  }
};

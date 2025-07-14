import { useState } from "react";
import UsersList from "../components/users/UsersList";
import UserProfile from "../components/users/UserProfile";
import DashboardLayout from "../components/boards/DashboardLayout";
import FancyLoader from "../components/FancyLoader/FancyLoader";

export default function UsersPage() {
  const [selectedUserId, setSelectedUserId] =
    useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <DashboardLayout>
      {loading ? (
        <FancyLoader />
      ) : selectedUserId ? (
        <UserProfile
          userId={selectedUserId}
          onBack={() => setSelectedUserId(null)}
          setLoading={setLoading}
        />
      ) : (
        <UsersList
          onSelectUser={setSelectedUserId}
          setLoading={setLoading}
        />
      )}
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import { UserDTO } from "./types";

function UserView() {
  const [users, setUsers] = useState([]);
  const baseUrl = import.meta.env.VITE_POLLING_SERVER_BASE_URL;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${baseUrl}/users`);

        if (response.ok) {
          const currentUsers = await response.json();
          setUsers(currentUsers);
        } else {
          console.error("Failed to fetch users:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="px-20">
      <div className="flex flex-row h-9 font-bold">
        <div className="basis-1/6 text-left">Active</div>
        <div className="basis-5/6">
          <div className="flex flex-row text-left">
            <div className="basis-1/3">Id</div>
            <div className="basis-1/3">Created Date</div>
            <div className="basis-1/3">Token Expires</div>
          </div>
        </div>
      </div>
      <div>
        {users.map((user: UserDTO) => (
          <User key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function User({ user }: { user: UserDTO }) {
  const [isActive, toggleActive] = useState(user.active);

  const toggleUserActive = () => {
    async function putUserActiveState(active: boolean) {
      try {
        const baseUrl = import.meta.env.VITE_POLLING_SERVER_BASE_URL;
        const toggleUserActiveUrl = `${baseUrl}/user/${user.id}/active`;
        const response = await fetch(toggleUserActiveUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active }),
        });

        if (response.ok) {
          const res = await response.json();
          toggleActive(res.active);
        } else {
          console.error("Failed to change active state", response.status);
        }
      } catch (error) {
        console.error("Error put data:", error);
      }
    }

    putUserActiveState(!isActive);
  };

  return (
    <div className="flex flex-row h-10 ">
      <div className="basis-1/6 text-left">
        <input
          type="checkbox"
          checked={isActive}
          onChange={toggleUserActive}
          readOnly
          className=""
        />
      </div>
      <div className="basis-5/6">
        <div className="flex flex-row text-left">
          <div className="basis-1/3">{user.id}</div>
          <div className="basis-1/3">{user.createdAt}</div>
          <div className="basis-1/3">{user.accessToken?.expires}</div>
        </div>
      </div>
    </div>
  );
}

export default UserView;

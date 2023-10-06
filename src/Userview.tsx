import { useEffect, useState } from "react";

function Userview() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const baseUrl = import.meta.env.VITE_POLLING_SERVER_BASE_URL;
        const allUsersUrl = `${baseUrl}/users`;
        const response = await fetch(allUsersUrl);
        if (response.ok) {
          const currentUsers = await response.json();
          // console.log("All Users:", currentUsers);
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
        <div className="basis-1/6 text-left">active</div>
        <div className="basis-5/6">
          <div className="flex flex-row text-left">
            <div className="basis-1/2">User Id</div>
            <div className="basis-1/2">Date</div>
          </div>
        </div>
      </div>
      <div>
        {users.map((user: { id: string }) => (
          <User key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function User({ user }: any) {
  const [checked, setChecked] = useState(user.active);

  const handleChange = () => {
    async function put_user_active_state() {
      try {
        const baseUrl = import.meta.env.VITE_POLLING_SERVER_BASE_URL;
        const user_active_url = `${baseUrl}/user/${user.id}/active`;
        const requestBody = { active: !checked };
        const response = await fetch(user_active_url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (response.ok) {
          const res = await response.json();
          setChecked(res.active);
        } else {
          console.error("Failed to change active state", response.status);
        }
      } catch (error) {
        console.error("Error put data:", error);
      }
    }
    put_user_active_state();
  };

  return (
    <div className="flex flex-row h-10 ">
      <div className="basis-1/6 text-left">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          readOnly
          className=""
        />
      </div>
      <div className="basis-5/6">
        <div className="flex flex-row text-left">
          <div className="basis-1/2">{user.id}</div>
          <div className="basis-1/2">01.01.1900</div>
        </div>
      </div>
    </div>
  );
}

export default Userview;

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
                    setUsers(currentUsers)
                } else {
                    console.error("Failed to fetch users:", response.status);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchUsers()
    }, []);



    return (
        <table className="table-fixed">
            <tbody>
                {users.map((user: { id: string }) => (
                    <User key={user.id} user={user} />
                ))}
            </tbody>
        </table>

    );
};

function User({ user }: any) {
    const [checked, setChecked] = useState(user.active);

    const handleChange = () => {
        async function put_user_active_state() {
            try {
                const baseUrl = import.meta.env.VITE_POLLING_SERVER_BASE_URL;
                const user_active_url = `${baseUrl}/user/${user.id}/active`;
                const requestBody = { active: !checked };
                const response = await fetch(user_active_url,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(requestBody),
                    }
                );
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
        put_user_active_state()
    };

    return (

        <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.id}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    // className="appearance-none checked:bg-blue-500"
                    checked={checked}
                    onChange={handleChange}
                    readOnly
                    className="form-checkbox h-5 w-5 text-blue-500"
                />
            </td>



        </tr>
    );
    // <div className="bg-white rounded-lg shadow-md p-4">
    //     <h2 className="text-2xl font-semibold mb-2">{user.id}</h2>
    //     <div className="flex items-center">
    //         <label className="mr-2">Aktiv:</label>
    //         <input
    //             type="checkbox"
    //             checked={checked}
    //             onChange={handleChange}
    //             readOnly
    //             className="form-checkbox h-5 w-5 text-blue-500"
    //         />
    //     </div>
    //     {/* Weitere Anzeigeelemente für den Benutzer */}
    // </div>

}

export default Userview;

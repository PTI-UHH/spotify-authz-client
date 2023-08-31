import { useState } from "react";

export function UserIdForm(props: { onSubmit: (userId: string) => void }) {
  const [userId, setUserId] = useState<string>('')

  function handleChange(event: any) {
    setUserId(event.target.value);
  }

  function handleSubmit(event: any) {
    props.onSubmit(userId);
    event.preventDefault();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          UserId:
          <input
            type="text"
            value={userId}
            onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}

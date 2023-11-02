import { useState } from "react";

export interface UserFormData {
  id?: string;
  email?: string;
}

interface UserFormState extends UserFormData {
  submitted?: boolean;
  idValid?: boolean;
  emailValid?: boolean;
}

export function UserForm(props: { onSubmit: (data: UserFormData) => void }) {
  const [formState, setFormState] = useState<UserFormState>({ id: "", email: "" });

  function handleIdChange(userId: string) {
    const userIdValid = userId.match(/^[0-9]{4}$/) !== null;
    setFormState((prevFormData) => ({
      ...prevFormData,
      id: userId,
      idValid: userIdValid,
    }));
  }

  function handleEmailChange(email: string) {
    const emailValid = email.match(/@gmail.com$/) !== null;
    setFormState((prevFormData) => ({
      ...prevFormData,
      email,
      emailValid,
    }));
  }

  function handleSubmit(event: any) {
    setFormState((prevFormData) => ({ ...prevFormData, submitted: true }));
    if (formState.idValid && formState.emailValid) {
      const { id, email } = formState;
      props.onSubmit({ id, email });
    }
  }

  const invalidUserIdClass =
    formState.submitted && !formState.idValid ? "border-red-500" : "";
  const invalidEmailClass =
    formState.submitted && !formState.emailValid ? "border-red-500" : "";

  return (
    <div className="w-full max-w-sm">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="userId"
          >
            PTI_ID (user's ID in DB and Movisens)
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${invalidUserIdClass}`}
            id="userId"
            type="text"
            placeholder="1234"
            value={formState.id}
            onChange={e => handleIdChange(e.target.value)}
          />
          <p
            hidden={!formState.submitted || formState.idValid}
            className="text-red-500 text-xs italic"
          >
            Please set a valid user id.
          </p>
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email (user's smartwatch account)
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${invalidEmailClass}`}
            id="email"
            required
            type="email"
            placeholder="max.mustermann@gmail.com"
            value={formState.email}
            onChange={e => handleEmailChange(e.target.value)}
          />
          <p
            hidden={!formState.submitted || formState.emailValid}
            className="text-red-500 text-xs italic"
          >
            Please set a valid email address.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

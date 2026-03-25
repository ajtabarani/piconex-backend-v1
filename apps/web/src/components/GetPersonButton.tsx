import { useAuth0 } from "@auth0/auth0-react";

function GetPersonButton() {
  const { getAccessTokenSilently } = useAuth0();

  const handleClick = async () => {
    const token = await getAccessTokenSilently();

    const res = await fetch("http://localhost:3000/iam/person/admin-uuid-123", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
  };

  return <button onClick={handleClick}>Get Person</button>;
}

export default GetPersonButton;

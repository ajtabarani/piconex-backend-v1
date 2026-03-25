import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import GetPersonButton from "../components/GetPersonButton";

function Home() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const t = await getAccessTokenSilently();
      setToken(t);
    };

    fetchToken();
  }, [getAccessTokenSilently]);

  return (
    <div>
      {/* <h1>User Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>Token: {token}</p> */}
      <h1>PersonDTO Button</h1>
      <GetPersonButton />
    </div>
  );
}

export default Home;

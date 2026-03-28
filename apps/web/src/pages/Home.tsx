import CreateAdminForm from "../components/CreateAdminForm";
import GetPersonButton from "../components/GetPersonButton";

function Home() {
  return (
    <div>
      <h1>PersonDTO Button</h1>
      <GetPersonButton />
      <CreateAdminForm />
    </div>
  );
}

export default Home;

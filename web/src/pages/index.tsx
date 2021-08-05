import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index: React.FC<{}> = ({}) => {
  return (
    <>
      <NavBar />
      <div>Index</div>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

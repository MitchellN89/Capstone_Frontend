import { useNavigate } from "react-router-dom";

export default function AccountSelect() {
  const navigate = useNavigate();
  console.log("AccountSelect.jsx");
  return (
    <>
      <button
        onClick={() => {
          navigate("/auth/eventPlanner/login");
        }}
      >
        eventplanner
      </button>
      <button>vendor</button>
    </>
  );
}

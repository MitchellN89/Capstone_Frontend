import { useNavigate } from "react-router-dom";

export default function AccountSelect() {
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={() => {
          navigate("/auth/eventPlanner/login");
        }}
      >
        eventplanner
      </button>
      <button
        onClick={() => {
          navigate("/auth/vendor/login");
        }}
      >
        vendor
      </button>
    </>
  );
}

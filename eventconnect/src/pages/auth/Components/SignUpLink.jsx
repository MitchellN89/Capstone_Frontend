import StyledLink from "../../../components/StyledLink";

export default function SignUpLink({ accountType, textValue, linkValue }) {
  return (
    <p style={{ textAlign: "center" }}>
      {textValue}{" "}
      <StyledLink to={`/auth/${accountType}/signup`}>{linkValue}</StyledLink>
    </p>
  );
}

import { Header2 } from "../../../components/Texts/TextHeaders";
import { FeatureStylize } from "../../../components/Texts/TextStyles";

export default function AuthHeader({ accountTypeLabel, message }) {
  return (
    <Header2 centered style={{ marginTop: "35px" }}>
      <FeatureStylize bold featureStrength={3}>
        {accountTypeLabel}
      </FeatureStylize>{" "}
      {message}
    </Header2>
  );
}

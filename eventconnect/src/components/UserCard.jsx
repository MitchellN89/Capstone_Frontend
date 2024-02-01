import { IconUser } from "./Icons";
import { Text } from "../components/Texts/Texts";
import { FeatureStylize } from "./Texts/TextStyles";

export default function UserCard({
  companyName,
  firstName,
  lastName,
  websiteUrl,
  phoneNumber,
  emailAddress,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div>
        <IconUser height="114px" />
      </div>
      <div style={{ marginLeft: "10px" }}>
        {companyName && (
          <Text size="md" style={{ margin: "0" }}>
            <FeatureStylize bold featureStrength={2}>
              Company Name:{" "}
            </FeatureStylize>
            {companyName}
          </Text>
        )}
        {(firstName || lastName) && (
          <Text size="sm" style={{ margin: "0" }}>
            <FeatureStylize bold featureStrength={2}>
              Contact Name:{" "}
            </FeatureStylize>
            {firstName} {lastName}
          </Text>
        )}
        {emailAddress && (
          <Text size="sm" style={{ margin: "0" }}>
            <FeatureStylize bold featureStrength={2}>
              Email Address:{" "}
            </FeatureStylize>
            {emailAddress}
          </Text>
        )}
        {phoneNumber && (
          <Text size="sm" style={{ margin: "0" }}>
            <FeatureStylize bold featureStrength={2}>
              Phone Number:{" "}
            </FeatureStylize>
            {phoneNumber}
          </Text>
        )}
        {websiteUrl && (
          <Text size="sm" style={{ margin: "0" }}>
            <FeatureStylize bold featureStrength={2}>
              Website Url:{" "}
            </FeatureStylize>
            {websiteUrl}
          </Text>
        )}
      </div>
    </div>
  );
}

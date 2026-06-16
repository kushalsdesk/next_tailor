import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { FC } from "react";

interface UserEmailProps {
  firstName: string;
  course: string;
}

export const UserEmailTemplate: FC<Readonly<UserEmailProps>> = ({
  firstName,
  course,
}) => (
  <Html>
    <Head />
    <Preview>
      Thank you for enrolling in {course} at ASHAA-Tailoring Institute!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://firebasestorage.googleapis.com/v0/b/game-lib-bd07d.appspot.com/o/files%2Fashaafoundation%2F1745937979056.jpg?alt=media&token=ac1158a0-65c6-4d3c-b49c-893da85407a9"
          alt="ASHAA-Tailoring Institute"
          width={80}
          height={80}
          style={logo}
        />

        <Section style={section}>
          <Heading style={heading}>Dear {firstName},</Heading>
          <Text style={paragraph}>
            Thank you for enrolling in <strong>{course}</strong> at our
            institute! Your enrollment has been submitted and confirmed. An
            authority will be reaching out to you shortly. Stay tuned!
          </Text>

          <Img
            src="https://firebasestorage.googleapis.com/v0/b/game-lib-bd07d.appspot.com/o/files%2Fashaafoundation%2Fhero.png?alt=media&token=8c9d0536-26a6-4a1a-9f5f-b1969b54afba"
            alt="Tailoring Course"
            width={500}
            height={500}
            style={courseImage}
          />

          <Text style={paragraph}>
            We&apos;re excited to have you join our community of creative
            learners!
          </Text>

          <Text style={paragraph}>Best regards,</Text>
          <Text style={signature}>
            <strong>ASHAA-Tailoring Institute</strong>
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              © 2025 ASHAA-Tailoring Institute. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href="https://ashaafoundation.in">Visit our website</Link> |{" "}
              <Link href="https://ashaafoundation.in/#career">Contact Us</Link>
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
};

const logo = {
  margin: "0 auto 20px",
  display: "block",
};

const section = {
  backgroundColor: "#ffffff",
  padding: "30px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};

const heading = {
  fontSize: "24px",
  color: "#333",
  marginBottom: "20px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#444",
  margin: "0 0 20px",
};

const courseImage = {
  margin: "20px 0",
  borderRadius: "4px",
  width: "100%",
};

const signature = {
  fontSize: "16px",
  color: "#333",
  marginTop: "10px",
  marginBottom: "30px",
};

const footer = {
  borderTop: "1px solid #ddd",
  marginTop: "30px",
  paddingTop: "20px",
};

const footerText = {
  fontSize: "14px",
  color: "#777",
  margin: "5px 0",
  textAlign: "center" as const,
};

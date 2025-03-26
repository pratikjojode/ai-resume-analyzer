import React from "react";
import { Layout, Typography, Space, Button } from "antd"; // Using Ant Design for quick styling
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css"; // Create this CSS file for custom styles

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <div className="header-content">
          <Title level={3} className="logo">
            YourAppName
          </Title>
          <Space size="large">
            <Button type="text" onClick={() => navigate("/features")}>
              Features
            </Button>
            <Button type="text" onClick={() => navigate("/about")}>
              About
            </Button>
            <Button type="primary" onClick={() => navigate("/login")}>
              Get Started
            </Button>
          </Space>
        </div>
      </Header>

      <Content className="home-content">
        <div className="hero-section">
          <Title level={1} className="hero-title">
            Welcome to Your Application
          </Title>
          <Text className="hero-subtitle">
            A simple, clean solution for your needs
          </Text>
          <div className="hero-actions">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
            <Button size="large" onClick={() => navigate("/learn-more")}>
              Learn More
            </Button>
          </div>
        </div>

        <div className="features-section">
          <Title level={2}>Key Features</Title>
          <div className="features-grid">
            {/* Feature cards would go here */}
          </div>
        </div>
      </Content>

      <Footer className="home-footer">
        <div className="footer-content">
          <Text>
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </Text>
          <Space size="middle">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
          </Space>
        </div>
      </Footer>
    </Layout>
  );
};

export default HomePage;

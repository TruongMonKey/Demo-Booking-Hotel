import React, { useState } from "react";
import { Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import './LanguageSelector.scss'

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("Tiếng Việt");

  const languages = [
    { key: "vi", label: "Tiếng Việt", flag: "🇻🇳" }
    // { key: "en", label: "English", flag: "en" }
  ];

  const handleMenuClick = (e) => {
    const lang = languages.find((lang) => lang.key === e.key);
    if (lang) {
      setSelectedLanguage(lang.label);
    }
  };

  const menuItems = languages.map((lang) => ({
    key: lang.key,
    label: lang.label,
  }));

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]}>
      <Button className="button--language">
        {selectedLanguage} <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default LanguageSelector;

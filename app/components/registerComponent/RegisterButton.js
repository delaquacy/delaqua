import React, { useState } from "react";

export const RegisterButton = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleRegisterClick = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await response.json();
    } catch (error) {
      console.log("Ошибка при создании пользователя:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="Введите номер телефона"
      />
      <button onClick={handleRegisterClick}>
        Зарегистрировать пользователя
      </button>
    </div>
  );
};

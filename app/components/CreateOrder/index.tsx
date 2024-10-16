"use client";

import { useOrderDetailsContext } from "@/app/contexts/OrderDetailsContext";
import { useScreenSize } from "@/app/hooks";
import { useUserSearch } from "@/app/hooks/useUserSearch";
import { KeyboardEvent, useCallback } from "react";
import PhoneInput from "react-phone-number-input";
import OrderStepper from "../OrderStepper";
import { CardShadow, SharedButton } from "../shared";
import {
  ButtonBox,
  ErrorBox,
  HelperText,
  PhoneInputGroupWrapper,
  PhoneInputWrapper,
  Wrapper,
} from "./styled";

const CreateOrderComponent = () => {
  const { adminCreateMode, setAdminAssignedUser, setAdminCreateMode } =
    useOrderDetailsContext();

  const {
    userPhone,
    setUserPhone,
    loading,
    error,
    user,
    handleApplySearch,
    setError,
    setAdminCreateMode: resetAdminCreateMode,
    createUser,
  } = useUserSearch(setAdminAssignedUser, setAdminCreateMode);

  const { isSmallScreen } = useScreenSize();

  const handleApplyOnEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleApplySearch();
      }
    },
    [handleApplySearch]
  );

  const handleCancel = useCallback(() => {
    setAdminCreateMode(false);
    setUserPhone("");
    setError("");
    resetAdminCreateMode(false);
  }, [setAdminCreateMode, resetAdminCreateMode]);

  return (
    <CardShadow sx={{ height: "100%", flex: 1 }}>
      <Wrapper>
        {adminCreateMode
          ? "Create order for user with number:"
          : "Search user by phone number:"}
        <PhoneInputGroupWrapper user_phone_length={userPhone?.length || 0}>
          <PhoneInputWrapper>
            <PhoneInput
              type="tel"
              value={userPhone}
              disabled={loading || adminCreateMode}
              onChange={(e) => {
                setUserPhone(e as string);
                setError("");
              }}
              onKeyDown={handleApplyOnEnter}
              placeholder="357 77 123342"
              containerStyle={{
                marginLeft: !userPhone || (userPhone?.length < 3 && "40px"),
              }}
            />

            <ErrorBox>
              {error && isSmallScreen && <HelperText>{error}</HelperText>}
            </ErrorBox>
          </PhoneInputWrapper>

          <ButtonBox>
            <SharedButton
              onClick={handleApplySearch}
              disabled={loading || adminCreateMode}
              text="Apply"
              loading={loading}
              width="100px"
            />

            <SharedButton
              onClick={handleCancel}
              text="Cancel"
              variantType="error"
              width="100px"
            />

            {error === "User with current number does not exist" && (
              <SharedButton
                onClick={createUser}
                disabled={loading || adminCreateMode}
                text="Create"
                variantType="success"
                width="100px"
              />
            )}
          </ButtonBox>
        </PhoneInputGroupWrapper>
        <ErrorBox>
          {error && !isSmallScreen && <HelperText>{error}</HelperText>}
        </ErrorBox>
      </Wrapper>

      {adminCreateMode && user && <OrderStepper />}
    </CardShadow>
  );
};

export default CreateOrderComponent;

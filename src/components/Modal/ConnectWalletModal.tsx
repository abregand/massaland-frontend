import alert from "../../assets/icons/alert.svg";
import massaLogo from "../../assets/massa-logos/massa-logo.png";
import Modal from "./Modal";
import Image from "next/image";
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  error: any;
  fromNav?: boolean;
};

const textVariantDapp =
  "To rate this dapp, you need to use a Massa wallet and connect it to massaland.";
const textVariantNav =
  "To rate this dapp, you need to use a Massa wallet and connect it to massaland.";

const ConnectWalletModal = ({
  isOpen,
  onClose,
  onConfirm,
  error,
  fromNav,
}: Props) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="flex flex-col items-center justify-center mt-10">
      <Image src={massaLogo} alt="massa-logo" />
      <div className="text-[40px] leading-[40px] font-bold mt-8 text-black text-center">
        Connect and rate
      </div>
      <div className="text-[20px] leading-[28px] text-center font-light text-black mt-8 mb-10 max-w-[75%]">
        {fromNav ? textVariantNav : textVariantDapp}
      </div>
      <div className="pb-14"></div>
      {error && (
        <div className="bg-black flex gap-3 items-center text-white font-[14px] p-4 rounded-lg mb-14">
          <Image src={alert} alt="alert" />
          <div>{error}</div>
        </div>
      )}
    </div>
  </Modal>
);

export default ConnectWalletModal;

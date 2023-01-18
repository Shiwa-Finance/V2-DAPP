import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { HomeLogo, TokenLogo } from "../assets";
import { useAccount, useSigner, useContract } from "wagmi";
import { migrateABI, tokenABI } from "../interface/abi";
import { TokenV1Addr, TokenV2Addr, MigrateV2Addr } from "../config/appconf";

const StyledWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
`;

const StyledCard = styled.div`
    max-width: 400px;
    height: 376px;
    border-radius: 20px;
    color: white;
    font-family: 'Inter';
`;

const StyledTopWrap = styled.div`
    height: 144px;
    background: #334155;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
`;

const StyledBottomWrap = styled.div`
    height: 232px;
    background: #1E293B;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
`;

const StyledTopBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    padding: 0 16px;
    user-select: none;
`;

const StyledInputBar = styled.div`
    display: flex;
    flex-direction: column;
    height: 92px;
    padding: 0 16px;
`;

const StyledValueBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const StyledBalanceBar = styled(StyledValueBar)`
    font-weight: 100;
    font-size: 14px;
`;

const StyledBarWrap = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledTokenTitleBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: #4C586A;
    padding: 2px 4px;
    border-radius: 8px;
    user-select: none;
    cursor: pointer;
`;

const StyledTopTitle = styled.div`
    font-weight: 500;
    font-size: 14px;
`;

const StyledTopSet = styled.div`
    width: 12px;
    height: 12px;
    background-image: radial-gradient(#13213e,#111829);
    border-radius: 50%;
`;

const StyledValueInput = styled.input.attrs((props) => ({
    type: `number`
}))
    `
    all: unset;
    width: 67%;
    height: 44px;
    font-weight: 500;
    font-size: 30px;
`;

const StyledTokenIcon = styled.img.attrs((props) => ({
    src: `${TokenLogo}`
}))
    `
    height: 32px;
    width: 32px;
`;

const StyledTokenTitle = styled.div`

`;

const StyledBalanceTitle = styled.div`
    
`;

const StyledInfoBar = styled.div`
    height: 76px;
    padding: 0 16px;
`;

const StyledConnectBar = styled.div`
    height: 64px;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const StyledInfoWrap = styled.div`
    padding: 10px;
    background: #273143;
    border-radius: 12px;
    text-align: center;
`;

const StyledInfoTitle = styled.div`
    
`;

const StyledConnectButton = styled.button`
    all: unset;
    background: #3B82F6;
    width: 100%;
    height: 90%;
    border-radius: 14px;
    margin-bottom: 12px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    font-weight: 500;

    :active {
        transform: scale(0.96);
        transition: scale 300ms;
    }

    :disabled {
        background: #4e91ff;
        cursor: default;
    }
`;

const StyledHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;


const StyledHeaderIconsWrap = styled.div`
    
`;

const StyledHomeLink = styled.a.attrs((props) => ({
    href: `https://shiwa.finance/`
}))
    `
    
`;

const StyledHomeIcon = styled.img.attrs((props) => ({
    src: `${HomeLogo}`
}))
    `
    height: 42px;
    width: 42px;
    background: #324054;
    padding: 4px;
    border-radius: 8px;
`;

const StyledHeaderIcon = styled.img.attrs((props) => ({
    src: `${TokenLogo}`
}))
    `
    width: 200px;
`;

const StyledHeaderTitle = styled.div`
    color: white;
    font-weight: 500;
    font-size: 32px;
    white-space: pre-line;
    text-align: center;
    margin-top: 10px;
`;

const Migrator = () => {
    const { address, isConnected } = useAccount();
    const { data: signer } = useSigner();
    const { openConnectModal } = useConnectModal();

    const tokenV1Contract = useContract({
        address: TokenV1Addr,
        abi: tokenABI,
        signerOrProvider: signer
    });

    const tokenV2Contract = useContract({
        address: TokenV2Addr,
        abi: tokenABI,
        signerOrProvider: signer
    });

    const migratorV2Contract = useContract({
        address: MigrateV2Addr,
        abi: migrateABI,
        signerOrProvider: signer
    });

    const [inputValue, setInputValue] = useState("1");
    const [priceETH, setPriceETH] = useState("0");
    const [priceUSD, setPriceUSD] = useState("0");
    const [isPriceFetched, setPriceFetched] = useState(false);
    const [v1Bal, setV1Bal] = useState(0);
    const [v2Bal, setV2Bal] = useState(0);
    const [isApproved, setApproved] = useState(false);
    const [isUserFetched, setUserFetched] = useState(false);

    const inputHandler = (e: any) => {
        setInputValue(e.target.value);
    };

    const approveHandler = async () => {
        await tokenV1Contract?.approve(MigrateV2Addr, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
    };

    const swapHandler = async () => {
        //approve and swap
        const tokenV1Allowance = await tokenV1Contract?.allowance(address, MigrateV2Addr);

        if (tokenV1Allowance > 0) {
            const amount = (Number(inputValue) * 10 ** 9).toString();
            await migratorV2Contract?.migrateV2(amount);
        } else {
            await approveHandler();
        }
    };

    useEffect(() => {
        const fetchPrice = async () => {
            const { data: respETH } = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=shiwa&vs_currencies=eth&precision=18");
            const { data: respUSD } = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=shiwa&vs_currencies=usd&precision=18");
            setPriceETH(Number(respETH.shiwa.eth).toFixed(18));
            setPriceUSD(Number(respUSD.shiwa.usd).toFixed(18));
            setPriceFetched(true);
        };
        fetchPrice();
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const tokenV1Bal = await tokenV1Contract?.balanceOf(address);
            const tokenV2Bal = await tokenV2Contract?.balanceOf(address);
            const tokenV1Allowance = await tokenV1Contract?.allowance(address, MigrateV2Addr);
            setV1Bal(tokenV1Bal.toString());
            setV2Bal(tokenV2Bal.toString());
            setApproved(tokenV1Allowance > 0);
            setUserFetched(true);
        };
        if (isConnected && signer) {
            fetchUserInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, signer, address]);

    return (
        <StyledWrap>
            <StyledHeader>
                <StyledHeaderIconsWrap>
                    <StyledHeaderIcon />
                    <StyledHomeLink>
                        <StyledHomeIcon />
                    </StyledHomeLink>
                </StyledHeaderIconsWrap>
                <StyledHeaderTitle>Shiwa migration platform.{"\n"}Connect and swap your Shiwa v1 to{"\n"}receive same amount of Shiwa v2.</StyledHeaderTitle>
            </StyledHeader>
            <StyledCard>
                <StyledTopWrap>
                    <StyledBarWrap>
                        <StyledTopBar>
                            <StyledTopTitle>Switch</StyledTopTitle>
                            <StyledTopSet />
                        </StyledTopBar>
                        <StyledInputBar>
                            <StyledValueBar>
                                <StyledValueInput value={inputValue} onChange={(e) => inputHandler(e)} />
                                <StyledTokenTitleBar>
                                    <StyledTokenIcon />
                                    <StyledTokenTitle>SHIWAv1</StyledTokenTitle>
                                </StyledTokenTitleBar>
                            </StyledValueBar>
                            <StyledBalanceBar>
                                {isPriceFetched && <StyledBalanceTitle>${(Number(inputValue) * Number(priceUSD)).toFixed(18)}</StyledBalanceTitle>}
                                {isUserFetched && <StyledBalanceTitle>Balance: {v1Bal}</StyledBalanceTitle>}
                            </StyledBalanceBar>
                        </StyledInputBar>
                    </StyledBarWrap>
                </StyledTopWrap>
                <StyledBottomWrap>
                    <StyledBarWrap>
                        <StyledInputBar>
                            <StyledValueBar>
                                <StyledValueInput value={inputValue} onChange={(e) => inputHandler(e)} disabled={true} />
                                <StyledTokenTitleBar>
                                    <StyledTokenIcon />
                                    <StyledTokenTitle>SHIWAv2</StyledTokenTitle>
                                </StyledTokenTitleBar>
                            </StyledValueBar>
                            <StyledBalanceBar>
                                {isPriceFetched && <StyledBalanceTitle>${(Number(inputValue) * Number(priceUSD)).toFixed(18)}</StyledBalanceTitle>}
                                {isUserFetched && <StyledBalanceTitle>Balance: {v2Bal}</StyledBalanceTitle>}
                            </StyledBalanceBar>
                        </StyledInputBar>
                        <StyledInfoBar>
                            <StyledInfoWrap>
                                {isPriceFetched && <StyledInfoTitle>1 SHIWA = ${priceETH} ETH (${priceUSD})</StyledInfoTitle>}
                            </StyledInfoWrap>
                        </StyledInfoBar>
                        <StyledConnectBar>
                            <StyledConnectButton
                                onClick={(isConnected && isApproved) ? swapHandler : (isConnected) ? approveHandler : openConnectModal}
                                disabled={isConnected && !signer ? true : false}
                            >
                                {(isConnected && isApproved) ? "Swap" : (isConnected) ? "Approve" : "Connect Wallet"}
                            </StyledConnectButton>
                        </StyledConnectBar>
                    </StyledBarWrap>
                </StyledBottomWrap>
            </StyledCard>
        </StyledWrap>
    );
};

export default Migrator;
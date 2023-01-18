import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { ClaimLogo, ETHLogo, HomeLogo, ShibaLogo, TokenLogo, USDTLogo, WBTCLogo } from "../assets";
import { useAccount, useSigner, useContract } from "wagmi";
import { ethers } from "ethers";
import { tokenABI } from "../interface/abi";
import { SHIBAAddr, TokenV2Addr, USDTAddr, WBTCAddr, WETHAddr } from "../config/appconf";

type ObjType = {
    [index: string]: string;
};

const StyledWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    margin: 10px 0 32px 0;
`;

const StyledCard = styled.div`
    width: 400px;
    border-radius: 20px;
    color: white;
    font-family: 'Inter';
`;

const StyledBottomWrap = styled.div`
    background: #1E293B;
    border-radius: 16px;
`;

const StyledBarWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px 0 16px 0;
`;

const StyledInfoBar = styled.div`
    padding: 0 16px;
    white-space: pre-line;
`;

const StyledConnectBar = styled.div`
    height: 64px;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const StyledInfoTopWrap = styled.div`
    border: 1px solid #2c2ce7bf;
    box-shadow: 0px 0px 20px #2c2ce7;
    padding: 10px;
    background: #273143;
    text-align: center;
    border-radius: 12px 12px 0 0;
`;

const StyledInfoBottomWrap = styled.div`
    background: #27314354;
    font-weight: 100;
    padding: 10px;
    border-radius: 0 0 12px 12px;
    text-align: center;
`;

const StyledInfoTitle = styled.div`
    
`;

const StyledConnectButton = styled.button`
    all: unset;
    background: #3B82F6;
    width: 100%;
    height: 52px;
    border-radius: 14px;
    margin-bottom: 12px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-weight: 600;

    :active {
        transform: scale(0.96);
        transition: scale 300ms;
    }

    :disabled {
        background: #4e91ff;
        cursor: default;
    }
`;

const StyledClaimButton = styled.button`
    all: unset;
    background: #3B82F6;
    width: 100%;
    height: 38px;
    border-radius: 0 0 16px 16px;
    margin-bottom: 12px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    font-weight: 600;

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

const StyledClaimIcon = styled.img.attrs((props) => ({
    src: `${ClaimLogo}`
}))
    `
    width: 30px;
`;

const APIList = [
    {
        ticker: "SHIWA",
        endpoint: "https://api.coingecko.com/api/v3/simple/price?ids=shiwa&vs_currencies=usd&precision=18"
    }, {
        ticker: "WBTC",
        endpoint: "https://api.coingecko.com/api/v3/simple/price?ids=wrapped-bitcoin&vs_currencies=usd&precision=18"
    }, {
        ticker: "SHIBA",
        endpoint: "https://api.coingecko.com/api/v3/simple/price?ids=shiba-inu&vs_currencies=usd&precision=18"
    }, {
        ticker: "USDT",
        endpoint: "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd&precision=18"
    },
    {
        ticker: "WETH",
        endpoint: "https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd&precision=18"
    }
];

const tickerMap: ObjType = {
    "SHIWA": TokenV2Addr,
    "WBTC": WBTCAddr,
    "SHIBA": SHIBAAddr,
    "USDT": USDTAddr,
    "WETH": WETHAddr
};

const tickerReMap: ObjType = {
    [TokenV2Addr]: "SHIWA",
    [WBTCAddr]: "WBTC",
    [SHIBAAddr]: "SHIBA",
    [USDTAddr]: "USDT",
    [WETHAddr]: "WETH"
};

const iconMap: ObjType = {
    "SHIWA": TokenLogo,
    "WBTC": WBTCLogo,
    "SHIBA": ShibaLogo,
    "USDT": USDTLogo,
    "WETH": ETHLogo
};

const StyledIcon = styled.img`
    width: 40px;
`;

const PlaceholderMap = () => {
    const placeholderComp = APIList.map(({ ticker }, index) => {
        return (
            <StyledInfoBar key={index}>
                <StyledInfoTopWrap>
                    <StyledIcon src={iconMap[ticker]} />
                    <StyledInfoTitle>0000 {ticker}{"\n"}($0.000000000000000000)</StyledInfoTitle>
                </StyledInfoTopWrap>
                <StyledInfoBottomWrap>
                    <StyledInfoTitle>0000 {ticker}{"\n"}($0.000000000000000000)</StyledInfoTitle>
                </StyledInfoBottomWrap>
                <StyledClaimButton disabled={true}>
                    Claim
                </StyledClaimButton>
            </StyledInfoBar>
        );
    });

    return placeholderComp;
};

const DividendMap = (priceList: any[], rewardState: ObjType, withdrawnState: ObjType, claimHandler: (ticker: string) => void) => {
    const dividendComp = priceList.map(({ ticker, price }, index) => {
        const isReward = rewardState[ticker] !== undefined;
        const rewardValue = rewardState[ticker];
        const isWithdrawn = withdrawnState[ticker] !== undefined;
        const withdrawnValue = withdrawnState[ticker];

        return (
            <StyledInfoBar key={index}>
                <StyledInfoTopWrap>
                    <StyledIcon src={iconMap[ticker]} />
                    {isReward ? <StyledInfoTitle>{ethers.utils.formatUnits(rewardValue, 18)} {ticker}{"\n"}(${(Number(ethers.utils.formatUnits(rewardValue, 18)) * Number(price)).toFixed(18)})</StyledInfoTitle> :
                        <StyledInfoTitle>0000 {ticker}{"\n"}($0.000000000000000000)</StyledInfoTitle>
                    }
                </StyledInfoTopWrap>
                <StyledInfoBottomWrap>
                    {isWithdrawn ? <StyledInfoTitle>{ethers.utils.formatUnits(withdrawnValue, 18)} {ticker}{"\n"}(${(Number(ethers.utils.formatUnits(withdrawnValue, 18)) * Number(price)).toFixed(18)})</StyledInfoTitle> :
                        <StyledInfoTitle>0000 {ticker}{"\n"}($0.000000000000000000)</StyledInfoTitle>
                    }
                </StyledInfoBottomWrap>
                <StyledClaimButton disabled={isReward ? false : true} onClick={(e) => isReward && claimHandler(ticker)}>
                    Claim
                </StyledClaimButton>
            </StyledInfoBar>
        );
    });

    return dividendComp;
};


const Dividend = () => {
    const { address, isConnected } = useAccount();
    const { data: signer } = useSigner();
    const { openConnectModal } = useConnectModal();

    const shiwaV2Contract = useContract({
        address: TokenV2Addr,
        abi: tokenABI,
        signerOrProvider: signer
    });

    const [isPriceFetched, setPriceFetched] = useState(false);
    const [isUserFetched, setUserFetched] = useState(false);
    const [priceList, setPriceList] = useState([{
        ticker: "",
        price: ""
    }]);
    const [rewardState, setRewardState] = useState({});
    const [withdrawnState, setWithdrawnState] = useState({});
    const [canClaimAll, setCanClaimAll] = useState(false);

    const allClaimHandler = async () => {
        await shiwaV2Contract?.multiWithdrawDividend();
    };

    const claimHandler = async (ticker: string) => {
        await shiwaV2Contract?.withdrawDividend(tickerMap[ticker]);
    };

    useEffect(() => {
        const fetchPrice = async () => {
            const priceObj: ObjType = {};
            const promises = APIList.map(async ({ ticker, endpoint }) => {
                const { data } = await axios.get(endpoint);
                const price = Number(data[Object.keys(data)[0]]["usd"]).toFixed(18);
                priceObj[ticker] = price;
            });
            await Promise.all(promises);
            const currentPriceList = Object.keys(priceObj).map((elemKey) => {
                return {
                    ticker: elemKey,
                    price: priceObj[elemKey]
                };
            });
            setPriceList(currentPriceList);
            setPriceFetched(true);
        };
        fetchPrice();
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            // @todo
            const dividendTokenList: string[] = await shiwaV2Contract?.getDividendTokenList();
            let dividendRewards: string[] = await shiwaV2Contract?.dividendOfAll(address);
            dividendRewards = dividendRewards.toString().split(",");
            let withdrawnRewards: string[] = await shiwaV2Contract?.withdrawnDividendOfAll(address);
            withdrawnRewards = withdrawnRewards.toString().split(",");
            const rewardObj: ObjType = {};
            const withdrawnObj: ObjType = {};
            let currentClaimAll = false;
            dividendTokenList.forEach((elemToken, index) => {
                const ticker = tickerReMap[elemToken];
                const reAmount = index < dividendRewards.length ? dividendRewards[index] : "0";
                const wiAmount = index < withdrawnRewards.length ? withdrawnRewards[index] : "0";
                if (reAmount > "0") {
                    rewardObj[ticker] = reAmount.toString();
                    currentClaimAll = true;
                }
                if (wiAmount > "0") {
                    withdrawnObj[ticker] = wiAmount.toString();
                }
            });
            setCanClaimAll(currentClaimAll);
            setRewardState(rewardObj);
            setWithdrawnState(withdrawnObj);
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
                <StyledHeaderTitle>SHIWA Rewards v2.</StyledHeaderTitle>
            </StyledHeader>
            <StyledCard>
                <StyledBottomWrap>
                    <StyledBarWrap>
                        {(isConnected && isPriceFetched && isUserFetched) ? DividendMap(priceList, rewardState, withdrawnState, claimHandler) : PlaceholderMap()}
                        <StyledConnectBar>
                            <StyledConnectButton
                                onClick={isConnected ? allClaimHandler : openConnectModal}
                                disabled={(isConnected && !signer && !canClaimAll) ? true : false}
                            >
                                <StyledClaimIcon />
                                {isConnected ? "Claim All" : "Connect Wallet"}
                            </StyledConnectButton>
                        </StyledConnectBar>
                    </StyledBarWrap>
                </StyledBottomWrap>
            </StyledCard>
        </StyledWrap>
    );
};

export default Dividend;
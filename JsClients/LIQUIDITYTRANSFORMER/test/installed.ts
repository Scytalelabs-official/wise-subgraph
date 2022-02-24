import { config } from "dotenv";
config();
import { LIQUIDITYClient, utils, constants } from "../src";
import { parseTokenMeta, sleep, getDeploy } from "./utils";

import {
	CLValueBuilder,
	Keys,
	CLPublicKey,
	CLAccountHash,
	CLPublicKeyType,
	CLURef,
	decodeBase16,
	AccessRights,
} from "casper-js-sdk";

const { LIQUIDITYEvents } = constants;

const {
	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,
	LIQUIDITYTRANSFORMER_WASM_PATH,
	LIQUIDITYTRANSFORMER_MASTER_KEY_PAIR_PATH,
	RECEIVER_ACCOUNT_ONE,
	INSTALL_PAYMENT_AMOUNT,
	SET_FEE_TO_PAYMENT_AMOUNT,
	SET_FEE_TO_SETTER_PAYMENT_AMOUNT,
	CREATE_PAIR_PAYMENT_AMOUNT,
	LIQUIDITYTRANSFORMER_CONTRACT_NAME,
	TOKEN0_CONTRACT,
	TOKEN1_CONTRACT,
	// PAIR_CONTRACT,
	RESERVE_WISE_PAYMENT_AMOUNT,
	INVESTMENT_DAY,
	INVESTMENT_DAYS,
	INVESTMENT_BALANCE,
	AMOUNT,
	REFERAL_ADDRESS,
	SENDER_ADDRESS,
	SENDER_VALUE,
	QUERY_ID,
	RESULTS,
	PROOFS,
	REFERAL_BATCH_FROM,
	REFERAL_BATCH_TO,
	REFERAL_AMOUNT,
	RATIO,
	INVESTOR_BATCH_FROM,
	INVESTOR_BATCH_TO,
	CURRENT_WISE_DAY,
	TEAM_ADDRESS_PURSE,
	INVESTOR_ADDRESS,
	TEAM_AMOUNT,
	SUCCESOR_PURSE,
	LIQUIDITYTRANSFORMER_CONTRACT_HASH,
	INVESTMENT_MODE,
	MSG_VALUE,
	CALLER_PURSE,
	WISETOKEN_CONTRACT_HASH,
	PAIR_CONTRACT_HASH,
	SYNTHETIC_CSPR_ADDRESS
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
	`${LIQUIDITYTRANSFORMER_MASTER_KEY_PAIR_PATH}/public_key.pem`,
	`${LIQUIDITYTRANSFORMER_MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const liquidity = new LIQUIDITYClient(
	NODE_ADDRESS!,
	CHAIN_NAME!,
	EVENT_STREAM_ADDRESS!
);

const test = async () => {
	
	// We don't need hash- prefix so i'm removing it
	await liquidity.setContractHash(LIQUIDITYTRANSFORMER_CONTRACT_HASH!);

	console.log("Liquidity Transformer contract Hash: ",LIQUIDITYTRANSFORMER_CONTRACT_HASH!);

	// const _setSettings = await liquidity.setSettings(
	// 	KEYS,
	// 	WISETOKEN_CONTRACT_HASH!,
	// 	PAIR_CONTRACT_HASH!,
	// 	SYNTHETIC_CSPR_ADDRESS!,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... _setSettings deploy hash: ", _setSettings);

	// await getDeploy(NODE_ADDRESS!, _setSettings);
	// console.log("... _setSettings called successfully");

	const _reserve_Wise = await liquidity.reserve_Wise(
		KEYS,
		INVESTMENT_MODE!,
		MSG_VALUE!,
		CALLER_PURSE!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... _reserve_Wise deploy hash: ", _reserve_Wise);

	await getDeploy(NODE_ADDRESS!, _reserve_Wise);
	console.log("... _reserve_Wise created successfully");

	// const reserveWiseWithToken = await liquidity.reserveWiseWithToken(
	// 	KEYS,
	// 	TOKEN1_CONTRACT!,
	// 	AMOUNT!,
	// 	INVESTMENT_DAYS!,
	// 	REFERAL_ADDRESS!,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... reserveWiseWithToken deploy hash: ", reserveWiseWithToken);
	// await getDeploy(NODE_ADDRESS!, reserveWiseWithToken);
	// console.log("... reserveWiseWithToken created successfully");

	// const reserveWise = await liquidity.reserveWise(
	// 	KEYS,
	// 	INVESTMENT_DAYS!,
	// 	REFERAL_ADDRESS!,
	// 	SENDER_ADDRESS!,
	// 	SENDER_VALUE!,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... reserveWise deploy hash: ", reserveWise);
	// await getDeploy(NODE_ADDRESS!, reserveWise);
	// console.log("... reserveWise createINVESTMENT_DAYd successfully");

	// const forwardLiquidity = await liquidity.forwardLiquidity(
	// 	KEYS,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... forwardLiquidity deploy hash: ", forwardLiquidity);
	// await getDeploy(NODE_ADDRESS!, forwardLiquidity);
	// console.log("... forwardLiquidity created successfully");

	// const getMyTokens = await liquidity.getMyTokens(
	// 	KEYS,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... getMyTokens deploy hash: ", getMyTokens);
	// await getDeploy(NODE_ADDRESS!, getMyTokens);
	// console.log("... getMyTokens created successfully");

	// /*=========================Getters=========================*/

	// const INVESTMENTDAY = CLValueBuilder.u256(INVESTMENT_DAY);
	// const TEAMAMOUNT = CLValueBuilder.u256(TEAM_AMOUNT);

	// const payoutInvestorAddress = await liquidity.payoutInvestorAddress(
	// 	KEYS.publicKey
	// );
	// console.log(`... Contract payoutInvestorAddress: ${payoutInvestorAddress}`);

	// const preparePath = await liquidity.preparePath(KEYS.publicKey);
	// console.log(`... Contract allpairs: ${preparePath}`);

	//const currentWiseDay = await liquidity.currentWiseDay();
	//console.log(`... currentWiseDay : ${currentWiseDay}`);

	// const SUCCESORPURSE = new CLURef(
	// 	decodeBase16(SUCCESOR_PURSE),
	// 	AccessRights.READ_ADD_WRITE
	// );
	// const requestRefund = await liquidity.requestRefund(
	// 	KEYS.publicKey,
	// 	SUCCESORPURSE
	// );
	// console.log(`... Contract allpairs: ${requestRefund}`);

};

//test();

import { config } from "dotenv";
config();
import { WISETokenClient, utils, constants } from "../src";
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

const { WISEEvents } = constants;

const {
	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,
	WISETOKEN_WASM_PATH,
	WISETOKEN_MASTER_KEY_PAIR_PATH,
	RECEIVER_ACCOUNT_ONE,
	INSTALL_PAYMENT_AMOUNT,
	SET_FEE_TO_PAYMENT_AMOUNT,
	SET_FEE_TO_SETTER_PAYMENT_AMOUNT,
	CREATE_PAIR_PAYMENT_AMOUNT,
	WISETOKEN_CONTRACT_NAME,
	RESERVE_WISE_PAYMENT_AMOUNT,
	IMMUTABLE_TRANSFORMER,
	TRANSFORMER_PURSE,
	EQUALIZER_ADDRESS,
	INVESTOR_ADDRESS,
	AMOUNT,
	LOCK_DAYS,
	PURSE,
	TOKEN_ADDRESS,
	TOKEN_AMOUNT,
	WISETOKEN_CONTRACT_HASH
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
	`${WISETOKEN_MASTER_KEY_PAIR_PATH}/public_key.pem`,
	`${WISETOKEN_MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const wise = new WISETokenClient(
	NODE_ADDRESS!,
	CHAIN_NAME!,
	EVENT_STREAM_ADDRESS!
);

const test = async () => {
	
	let accountInfo = await utils.getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

	console.log(`... Account Info: `);
	console.log(JSON.stringify(accountInfo, null, 2));

	const contractHash = await utils.getAccountNamedKeyValue(
		accountInfo,
		`${WISETOKEN_CONTRACT_NAME!}_contract_hash`
	);

	console.log(`... Contract Hash: ${contractHash}`);

	// We don't need hash- prefix so i'm removing it
	//await wise.setContractHash(WISETOKEN_CONTRACT_HASH);

	const setLiquidityTransfomer = await wise.setLiquidityTransfomer(
		KEYS,
		IMMUTABLE_TRANSFORMER!,
		TRANSFORMER_PURSE!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log(
		"... setLiquidityTransfomer deploy hash: ",
		setLiquidityTransfomer
	);
	await getDeploy(NODE_ADDRESS!, setLiquidityTransfomer);
	console.log("... setLiquidityTransfomer created successfully");

	const setBusd = await wise.setBusd(
		KEYS,
		EQUALIZER_ADDRESS!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... setBusd deploy hash: ", setBusd);
	await getDeploy(NODE_ADDRESS!, setBusd);
	console.log("... setBusd created successfully");

	const renounceKeeper = await wise.renounceKeeper(
		KEYS,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... renounceKeeper deploy hash: ", renounceKeeper);
	await getDeploy(NODE_ADDRESS!, renounceKeeper);
	console.log(".PURSE.. renounceKeeper createINVESTMENT_DAYd successfully");

	const mintSupply = await wise.mintSupply(
		KEYS,
		INVESTOR_ADDRESS!,
		AMOUNT!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... mintSupply deploy hash: ", mintSupply);
	await getDeploy(NODE_ADDRESS!, mintSupply);
	console.log("... mintSupply created successfully");

	const extendLtAuction = await wise.extendLtAuction(
		KEYS,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... extendLtAuction deploy hash: ", extendLtAuction);
	await getDeploy(NODE_ADDRESS!, extendLtAuction);
	console.log("... extendLtAuction created successfully");

	/*=========================Getters=========================*/
	const LOCKDAYS = CLValueBuilder.u64(LOCK_DAYS);
	const _AMOUNT = CLValueBuilder.u256(AMOUNT);
	const TOKENAMOUNT = CLValueBuilder.u256(TOKEN_AMOUNT);

	const _PURSE = new CLURef(decodeBase16(PURSE), AccessRights.READ_ADD_WRITE);
	const createStakeWithBnb = await wise.createStakeWithBnb(
		LOCKDAYS,
		KEYS.publicKey,
		_AMOUNT,
		_PURSE
	);
	console.log(`... Contract createStakeWithBnb: ${createStakeWithBnb}`);

	const createStakeWithToken = await wise.createStakeWithToken(
		KEYS.publicKey,
		TOKENAMOUNT,
		LOCKDAYS,
		KEYS.publicKey
	);
	console.log(`... Contract createStakeWithToken: ${createStakeWithToken}`);

	const getPairAddress = await wise.getPairAddress();
	console.log(`... Contract getPairAddress: ${getPairAddress}`);

	const getTotalStaked = await wise.getTotalStaked();
	console.log(`... Contract getTotalStaked: ${getTotalStaked}`);

	const getLiquidityTransformer = await wise.getLiquidityTransformer();
	console.log(
		`... Contract getLiquidityTransformer: ${getLiquidityTransformer}`
	);

	const getSyntheticTokenAddress = await wise.getSyntheticTokenAddress();
	console.log(
		`... Contract getSyntheticTokenAddress: ${getSyntheticTokenAddress}`
	);
};

//test();

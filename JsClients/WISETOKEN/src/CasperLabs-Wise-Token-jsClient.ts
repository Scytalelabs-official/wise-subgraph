import {
	CasperClient,
	CLPublicKey,
	CLAccountHash,
	CLByteArray,
	CLKey,
	CLString,
	CLTypeBuilder,
	CLValue,
	CLValueBuilder,
	CLValueParsers,
	CLMap,
	DeployUtil,
	EventName,
	EventStream,
	Keys,
	RuntimeArgs,
	CLURef,
	decodeBase16,
	AccessRights,
	CLU64,
	CLU256,
} from "casper-js-sdk";
import { WISEEvents } from "./constants";
import * as utils from "./utils";
import { RecipientType, IPendingDeploy } from "./types";
import blake from "blakejs";
import { concat } from "@ethersproject/bytes";
// const axios = require("axios").default;

class WISETokenClient {
	private contractHash: string="Wise_Token";
	private contractPackageHash: string="Wise_Token";

	private isListening = false;
	private pendingDeploys: IPendingDeploy[] = [];

	constructor(
		private nodeAddress: string,
		private chainName: string,
		private eventStreamAddress?: string
	) {}

	public async install(
		keys: Keys.AsymmetricKey,
		wcsprAddress: string,
		syntheticCsprAddress: string,
		pairAddress: string,
		routerAddress: string,
		factoryAddress: string,
		liquidityguardAddress: string,
		launchtime: string,
		contractName: string,
		paymentAmount: string,
		wasmPath: string
	) {
		const wcspr_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(wcsprAddress, "hex"))
		);
		const scspr_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(syntheticCsprAddress, "hex"))
		);
		const pair_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(pairAddress, "hex"))
		);
		const router_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(routerAddress, "hex"))
		);
		const factory_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(factoryAddress, "hex"))
		);
		const liquidity_guard_contract = new CLByteArray(
			Uint8Array.from(Buffer.from(liquidityguardAddress, "hex"))
		);
		
		const runtimeArgs = RuntimeArgs.fromMap({
			wcspr: CLValueBuilder.key(wcspr_contract),
			scspr: CLValueBuilder.key(scspr_contract),
			pair: CLValueBuilder.key(pair_contract),
			router: CLValueBuilder.key(router_contract),
			factory: CLValueBuilder.key(factory_contract),
			liquidity_guard: CLValueBuilder.key(liquidity_guard_contract),
			launch_time: CLValueBuilder.u256(launchtime),
			contract_name: CLValueBuilder.string(contractName),
		});

		const deployHash = await installWasmFile({
			chainName: this.chainName,
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys,
			pathToContract: wasmPath,
			runtimeArgs,
		});

		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Problem with installation");
		}
	}

	public async setLiquidityTransfomer(
		keys: Keys.AsymmetricKey,
		immutableTransformer: string,
		transformerPurse: string,
		paymentAmount: string
	) {
		const immutable_transformer = new CLByteArray(
			Uint8Array.from(Buffer.from(immutableTransformer, "hex"))
		);
		const transformer_purse = new CLURef(
			decodeBase16(transformerPurse),
			AccessRights.READ_ADD_WRITE
		);
		const runtimeArgs = RuntimeArgs.fromMap({
			immutable_transformer: CLValueBuilder.key(immutable_transformer),
			transformer_purse,
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "set_liquidity_transfomer",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async setBusd(
		keys: Keys.AsymmetricKey,
		equalizerAddress: string,
		paymentAmount: string
	) {
		const equalizer_address = new CLByteArray(
			Uint8Array.from(Buffer.from(equalizerAddress, "hex"))
		);

		const runtimeArgs = RuntimeArgs.fromMap({
			equalizer_address: CLValueBuilder.key(equalizer_address),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "set_busd",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async renounceKeeper(keys: Keys.AsymmetricKey, paymentAmount: string) {
		const runtimeArgs = RuntimeArgs.fromMap({});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "renounce_keeper",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async mintSupply(
		keys: Keys.AsymmetricKey,
		investorAddress: string,
		amount: string,
		paymentAmount: string
	) {
		const investor_address = new CLByteArray(
			Uint8Array.from(Buffer.from(investorAddress, "hex"))
		);

		const runtimeArgs = RuntimeArgs.fromMap({
			investor_address: CLValueBuilder.key(investor_address),
			amount: CLValueBuilder.u256(amount),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "mint_supply",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	public async extendLtAuction(
		keys: Keys.AsymmetricKey,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "extend_lt_auction",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	/*=========================Getters=========================*/

	//Need Consultancy
	//Cannot pass more than 1 argument
	//Cannot pass any argument then then string
	public async createStakeWithBnb(
		lock_days: CLU64,
		_referrer: CLPublicKey,
		amount: CLU256,
		purse: CLURef
	) {
		const referrer = new CLKey(new CLAccountHash(_referrer.toAccountHash()));

		const finalBytes = concat([
			CLValueParsers.toBytes(lock_days).unwrap(),
			CLValueParsers.toBytes(referrer).unwrap(),
			CLValueParsers.toBytes(amount).unwrap(),
			CLValueParsers.toBytes(purse).unwrap(),
		]);
		const blaked = blake.blake2b(finalBytes, undefined, 32);
		const encodedBytes = Buffer.from(blaked).toString("hex");

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			encodedBytes,
			"create_stake_with_bnb"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	//Need Consultancy
	//Cannot pass more than 1 argument
	//Cannot pass any argument then then string
	public async createStakeWithToken(
		tokenAddress: CLPublicKey,
		token_amount: CLU256,
		lock_days: CLU64,
		_referrer: CLPublicKey
	) {
		const token_address = new CLKey(
			new CLAccountHash(tokenAddress.toAccountHash())
		);
		const referrer = new CLKey(new CLAccountHash(_referrer.toAccountHash()));

		const finalBytes = concat([
			CLValueParsers.toBytes(token_address).unwrap(),
			CLValueParsers.toBytes(token_amount).unwrap(),
			CLValueParsers.toBytes(lock_days).unwrap(),
			CLValueParsers.toBytes(referrer).unwrap(),
		]);
		const blaked = blake.blake2b(finalBytes, undefined, 32);

		const encodedBytes = Buffer.from(blaked).toString("hex");

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			encodedBytes,
			"create_stake_with_token"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	public async getPairAddress() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"get_pair_address"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}

	public async getTotalStaked() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"get_total_staked"
		);
		return result.value().toString();
	}

	public async getLiquidityTransformer() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"get_liquidity_transformer"
		);
		return result.value().toString();
	}

	public async getSyntheticTokenAddress() {
		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			this.contractHash,
			"get_synthetic_token_address"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}
}

interface IInstallParams {
	nodeAddress: string;
	keys: Keys.AsymmetricKey;
	chainName: string;
	pathToContract: string;
	runtimeArgs: RuntimeArgs;
	paymentAmount: string;
}

const installWasmFile = async ({
	nodeAddress,
	keys,
	chainName,
	pathToContract,
	runtimeArgs,
	paymentAmount,
}: IInstallParams): Promise<string> => {
	const client = new CasperClient(nodeAddress);

	// Set contract installation deploy (unsigned).
	let deploy = DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(
			CLPublicKey.fromHex(keys.publicKey.toHex()),
			chainName
		),
		DeployUtil.ExecutableDeployItem.newModuleBytes(
			utils.getBinary(pathToContract),
			runtimeArgs
		),
		DeployUtil.standardPayment(paymentAmount)
	);

	// Sign deploy.
	deploy = client.signDeploy(deploy, keys);

	// Dispatch deploy to node.
	return await client.putDeploy(deploy);
};

interface IContractCallParams {
	nodeAddress: string;
	keys: Keys.AsymmetricKey;
	chainName: string;
	entryPoint: string;
	runtimeArgs: RuntimeArgs;
	paymentAmount: string;
	contractHash: string;
}

const contractCall = async ({
	nodeAddress,
	keys,
	chainName,
	contractHash,
	entryPoint,
	runtimeArgs,
	paymentAmount,
}: IContractCallParams) => {
	const client = new CasperClient(nodeAddress);
	const contractHashAsByteArray = utils.contractHashToByteArray(contractHash);

	let deploy = DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(keys.publicKey, chainName),
		DeployUtil.ExecutableDeployItem.newStoredContractByHash(
			contractHashAsByteArray,
			entryPoint,
			runtimeArgs
		),
		DeployUtil.standardPayment(paymentAmount)
	);

	// Sign deploy.
	deploy = client.signDeploy(deploy, keys);

	// Dispatch deploy to node.
	const deployHash = await client.putDeploy(deploy);

	return deployHash;
};

const contractSimpleGetter = async (
	nodeAddress: string,
	contractHash: string,
	key: string[]
) => {
	const stateRootHash = await utils.getStateRootHash(nodeAddress);
	const clValue = await utils.getContractData(
		nodeAddress,
		stateRootHash,
		contractHash,
		key
	);

	if (clValue && clValue.CLValue instanceof CLValue) {
		return clValue.CLValue!;
	} else {
		throw Error("Invalid stored value");
	}
};

export default WISETokenClient;

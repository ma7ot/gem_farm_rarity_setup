import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { NodeWallet } from "@metaplex/js";
import { Wallet } from "@project-serum/anchor";
import farmIdl from "./idl/gem_farm.json";
import bankIdl from "./idl/gem_bank.json";
import {
  findRarityPDA,
  GemFarmClient,
  RarityConfig,
} from "@gemworks/gem-farm-ts";

export const stakingDefaults = {
  //choose cluster here (mainnet-beta or devnet)
  CLUSTER: "devnet",

  GEM_BANK_PROG_ID: new PublicKey(
    // TODO bank program id String
    "bankHHdqMuaaST4qQk6mkzxGeKPHWmqdgor6Gs8r88m" // This is the default bankID for gemworks, change it if you deoployed your own
  ),

  GEM_FARM_PROG_ID: new PublicKey(
      // TODO farm program id String
      "farmL4xeBFVXJqtfxCzU9b28QACM7E2W2ctT6epAjvE" // This is the default farmID for gemworks, change it if you deoployed your own
  ),

  FARM_ID: new PublicKey(
      // TODO farm id String - ADD
      ""
  ),
};

// This is the rarity array that you configure, each object consists of the
// NFT mint address and the rarity points associated with it.
const rarities: RarityConfig[] = [
  {
    mint: new PublicKey("5v1eFkcxNkikvtDGDMz7shBPFGokERvDoBYYBYWX11kC"), // The NFT address
    rarityPoints: 4, // < this is the rarity multiplier
  },
  // It's an array, you can put as many rarity configurations as you want
];

(async () => {
  const connection = new Connection(
    clusterApiUrl(stakingDefaults.CLUSTER as any),
    "confirmed"
  );

  // This keypair needs to be the farm manager
  const manager = Keypair.fromSecretKey(
      Uint8Array.from(
          // TODO Wallet private key here
          []
      )
  );

  let gf = new GemFarmClient(
      connection,
      new NodeWallet(manager) as Wallet,
      farmIdl as any,
      stakingDefaults.GEM_FARM_PROG_ID,
      bankIdl as any,
      stakingDefaults.GEM_BANK_PROG_ID
  );

  const farm = await gf.fetchFarmAcc(stakingDefaults.FARM_ID);
  
  let x = rarities.length / 8;
  let length = (Math.floor(x) * 8);
  let ExtraRounds = rarities.length - length;
  //This loops through the rarity configs and runs 8 transaction at a time
  for( let i=0; i < length; i = i + 8 ){
    const { txSig } = await gf.addRaritiesToBank(
      stakingDefaults.FARM_ID,
      manager.publicKey,
      rarities.slice(i, i+8)
    );
    await connection.confirmTransaction(txSig);

    //This loop is to confirm the added rarities
    for(let n=i; n < i+8; n++){
      const [rarityAddr] = await findRarityPDA(
        farm.bank,
        rarities[n].mint // add address of the address you want to add
      );
    
      const rarityAcc = await gf.fetchRarity(rarityAddr);
      console.log("Added rarity: ", rarityAcc);
    }
    console.log("txSig: ", txSig);
    console.log("added " + (i+8) +"/" +rarities.length);

    if((i+8) == length){
      const { txSig } = await gf.addRaritiesToBank(
        stakingDefaults.FARM_ID,
        manager.publicKey,
        rarities.slice(i+8, i+8+ExtraRounds)
      );
      await connection.confirmTransaction(txSig);
      for(let n=i+8; n < i+8+ExtraRounds; n++){
        const [rarityAddr] = await findRarityPDA(
          farm.bank,
          rarities[n].mint // add address of the address you want to add
        );
      
        const rarityAcc = await gf.fetchRarity(rarityAddr);
        console.log("Added rarity: ", rarityAcc);
      }
      console.log("txSig:", txSig);
      console.log("added " + (i+8+ExtraRounds) +"/" +rarities.length);
    }
  
  }

})();

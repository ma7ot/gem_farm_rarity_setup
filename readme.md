# gemworks_rarity_configuration

Open up the script `set_rarity.ts`, and first of all read it

consider updating the IDLs and the @gemworks version to match the program version if needed

Then:

Scroll to `stakingDefaults` and change the following values:
+ CLUSTER: choose between 'mainnet-beta' and 'devnet'
+ Bank Program ID (String): this defaults to gemworks.gg BankID
+ Farm Program ID (String): this defaults to gemworks.gg FarmID
+ Farm ID (String): add the id/address of your farm.
+ set the keypair of the farm manager on `manager`
+ set up all the rarities on the `rarities` constant

run `yarn && yarn execute` or `npm install && npm run execute` to run the script
